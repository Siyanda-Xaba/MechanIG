import { File } from 'expo-file-system';
import { fetchWithPictureSearchFallback, getPictureSearchAuthHeaders } from '../config/pictureSearchApi';

export async function recognizeVehiclePart(request) {
  if (!request.imageUri) throw new Error('Select or capture an image before scanning.');
  const formData = new FormData();
  const imageFile = new File(request.imageUri);
  formData.append('image', imageFile, request.fileName || imageFile.name || 'vehicle-part.jpg');
  formData.append('vehicleId', request.vehicleId || '');
  const response = await fetchWithPictureSearchFallback('/api/v1/part-searches', { method: 'POST', headers: await getPictureSearchAuthHeaders(), body: formData });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || 'The image could not be processed.');
  const recognition = payload?.recognition;
  if (!recognition || recognition.partName === 'Part not identified') {
    return { status: 'uncertain', recognition: null, message: 'The image was too unclear to identify an automotive part. Try another angle with better lighting.' };
  }
  const confidence = Math.max(0, Math.min(1, Number(recognition.confidence) || 0));
  return {
    status: confidence >= 0.55 ? 'identified' : 'uncertain',
    recognition: { partName: recognition.partName, confidence },
    message: confidence >= 0.55 ? 'A possible part was identified from the image.' : 'A possible match was found, but the image result is uncertain.',
  };
}
