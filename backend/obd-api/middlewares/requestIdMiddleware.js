import { randomUUID } from "node:crypto";

export function requestId(req, res, next) {
  const suppliedId = req.get("x-request-id")?.trim();
  req.requestId = suppliedId && /^[A-Za-z0-9._:-]{1,100}$/.test(suppliedId)
    ? suppliedId
    : randomUUID();
  res.set("x-request-id", req.requestId);
  next();
}
