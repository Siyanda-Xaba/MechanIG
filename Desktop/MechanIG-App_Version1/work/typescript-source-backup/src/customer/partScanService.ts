import {
  PartScanRequest,
  PartScanResult,
} from './partScanTypes'

export async function recognizeVehiclePart(
  request: PartScanRequest
): Promise<PartScanResult> {
  // This service is the frontend boundary for future
  // image-recognition backend integration.
  //
  // The frontend may capture a real image, but it must
  // not invent:
  // - part identity
  // - confidence
  // - vehicle compatibility
  // - diagnostic conclusions
  //
  // A production backend can later receive:
  // - vehicleId
  // - image file
  // - filename
  // - MIME type
  //
  // and return recognition candidates with validated
  // confidence values.

  void request.vehicleId
  void request.imageUri
  void request.fileName
  void request.mimeType

  return {
    status: 'unavailable',
    recognition: null,
    message:
      'Part recognition is not connected to the MechanIQ backend yet. Your image can be captured, but no part has been identified.',
  }
}