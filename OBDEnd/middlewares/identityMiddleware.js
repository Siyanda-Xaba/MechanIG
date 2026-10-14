// Development-only identity seam. Replace this with verified session/JWT middleware before production.
export function requireActor(req, res, next) {
  const actorId = req.get("x-mechaniq-user-id")?.trim();

  if (!actorId) {
    return res.status(401).json({
      error: "AUTHENTICATION_REQUIRED",
      message:
        "Provide x-mechaniq-user-id while authentication is being integrated.",
      requestId: req.requestId,
    });
  }

  req.actor = { id: actorId };
  return next();
}
