import { store } from "../data/store.js";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is required",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Authorization must use Bearer token",
      });
    }

    const session = store.sessions.get(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    const user = store.users.get(session.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this session was not found",
      });
    }

    // Make authenticated user available to controllers
    req.user = user;

    // Also make the session available if needed
    req.session = session;

    next();
  } catch (error) {
    next(error);
  }
}