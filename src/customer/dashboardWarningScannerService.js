import { File } from 'expo-file-system';
import { fetchWithPictureSearchFallback, getPictureSearchAuthHeaders } from '../config/pictureSearchApi';

const MAX_DASHBOARD_IMAGE_BYTES = 5 * 1024 * 1024;

export async function scanDashboardWarningLights(request) {
    if (!request?.imageUri) throw new Error('Take or choose a dashboard photo first.');

    const imageFile = new File(request.imageUri);
    if (imageFile.size > MAX_DASHBOARD_IMAGE_BYTES) {
        throw new Error('This image is larger than 5 MB. Choose a smaller dashboard photo and try again.');
    }

    const fileName = request.fileName || imageFile.name || 'dashboard-photo.jpg';
    const formData = new FormData();
    formData.append('image', imageFile, fileName);
    const response = await fetchWithPictureSearchFallback(
        '/api/v1/dashboard-warning-scans',
        {
            method: 'POST',
            headers: await getPictureSearchAuthHeaders(),
            body: formData,
        },
    );
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(payload?.error || payload?.message || 'The dashboard photo could not be analyzed.');
    }
    if (payload?.success !== true || !Array.isArray(payload.detections)) {
        throw new Error('The scanner returned an unexpected response. Please try again.');
    }
    return payload;
}
