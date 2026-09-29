import { getUserByToken } from "../services/authService.js";

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

    const user = getUserByToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
