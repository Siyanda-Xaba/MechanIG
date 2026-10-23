import {
  getProblem,
  getSupportedProblems as listSupportedProblems,
  translatePayload,
} from "../services/diagnosticService.js";
import {
  getRepairGuide,
  getScan,
  getScanHistory,
  deleteScan,
  saveScan,
} from "../services/scanService.js";

export function getSupportedProblems(req, res) {
  res.json({ data: listSupportedProblems(), requestId: req.requestId });
}

export function getProblemByCode(req, res) {
  const problem = getProblem(req.params.code);
  if (!problem) {
    return res
      .status(404)
      .json({
        error: "NOT_FOUND",
        message: `No supported diagnostic definition exists for ${req.params.code.toUpperCase()}.`,
        requestId: req.requestId,
      });
  }
  return res.json({ data: problem, requestId: req.requestId });
}

export function translateDiagnosticData(req, res, next) {
  try {
    return res.json({
      data: translatePayload(req.body),
      requestId: req.requestId,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createDiagnosticScan(req, res, next) {
  try {
    const scan = await saveScan(req.actor.id, req.body);
    return res.status(201).json({ data: scan, requestId: req.requestId });
  } catch (error) {
    return next(error);
  }
}

export async function getDiagnosticScan(req, res, next) {
  try {
    const scan = await getScan(req.actor.id, req.params.scanId);
    return res.json({ data: scan, requestId: req.requestId });
  } catch (error) {
    return next(error);
  }
}

export async function deleteDiagnosticScan(req, res, next) {
  try {
    await deleteScan(req.actor.id, req.params.scanId);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

export async function getDiagnosticHistory(req, res, next) {
  try {
    const scans = await getScanHistory(req.actor.id, req.query.vehicleId);
    return res.json({ data: scans, requestId: req.requestId });
  } catch (error) {
    return next(error);
  }
}

export async function getDiagnosticRepairGuide(req, res, next) {
  try {
    const scan = await getScan(req.actor.id, req.params.scanId);
    return res.json({ data: getRepairGuide(scan), requestId: req.requestId });
  } catch (error) {
    return next(error);
  }
}
