function sendAuthError(res, req, status, code, message) {
  return res.status(status).json({ error: code, message, requestId: req.requestId });
}

let testTokenVerifier = null;

export function setTestTokenVerifier(verifier) {
  if (process.env.NODE_ENV !== "test" || typeof verifier !== "function") {
    throw new Error("A test token verifier is available only in NODE_ENV=test.");
  }
  testTokenVerifier = verifier;
}

export async function requireActor(req, res, next) {
  const authMode = process.env.OBD_AUTH_MODE || (process.env.NODE_ENV === "production" ? "firebase" : "development");

  if (!["firebase", "development"].includes(authMode)) {
    return sendAuthError(res, req, 503, "AUTH_CONFIGURATION_ERROR", "Set OBD_AUTH_MODE to firebase or development.");
  }
  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return sendAuthError(res, req, 401, "AUTHENTICATION_REQUIRED", "Send a Firebase ID token in the Authorization: Bearer header.");
  }

  try {
    if (process.env.NODE_ENV === "test" && testTokenVerifier) {
      const token = await testTokenVerifier(match[1]);
      req.actor = { id: token.uid };
      return next();
    }
    const [{ getApps, initializeApp }, { getAuth }] = await Promise.all([
      import("firebase-admin/app"),
      import("firebase-admin/auth"),
    ]);
    const appName = "obd-token-verification";
    const firebaseApp = getApps().find((app) => app.name === appName)
      || initializeApp({ projectId: process.env.GOOGLE_CLOUD_PROJECT || "mechaniq-3a0f2" }, appName);
    const token = await getAuth(firebaseApp).verifyIdToken(match[1], process.env.NODE_ENV === "production");
    req.actor = { id: token.uid };
    return next();
  } catch (error) {
    if (error?.code?.startsWith("auth/")) {
      return sendAuthError(res, req, 401, "INVALID_ID_TOKEN", "The Firebase ID token is invalid or expired. Sign in again and retry.");
    }
    return next(error);
  }
}
