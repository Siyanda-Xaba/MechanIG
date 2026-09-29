import * as authService from "../services/authService.js";

export function register(req, res, next) {
  try {
    return res.status(201).json({ success: true, data: authService.register(req.body) });
  } catch (error) { return next(error); }
}

export function login(req, res, next) {
  try {
    return res.json({ success: true, data: authService.login(req.body) });
  } catch (error) { return next(error); }
}

export function me(req, res) {
  return res.json({ success: true, data: req.user });
}
