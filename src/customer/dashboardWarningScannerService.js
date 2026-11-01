import { File } from 'expo-file-system';
import { fetchWithPictureSearchFallback, getPictureSearchAuthHeaders } from '../config/pictureSearchApi';
import { getFriendlyDiagnosticError } from '../data/userFriendlyResponses';

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
    let response;
    try {
        response = await fetchWithPictureSearchFallback(
            '/api/v1/dashboard-warning-scans',
            {
                method: 'POST',
                headers: await getPictureSearchAuthHeaders(),
                body: formData,
            },
        );
    } catch (error) {
        throw new Error(getFriendlyDiagnosticError(error, 'We could not connect to the warning-light checker. Check your connection and try again.'));
    }
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        const fallback = response.status === 401
            ? 'Please sign in again, then try checking the photo.'
            : response.status === 429
                ? 'Too many photos were checked just now. Wait a moment and try again.'
                : response.status >= 500
                    ? 'The warning-light checker is unavailable right now. Please try again shortly.'
                    : 'This photo could not be checked. Try a clearer image or check your vehicle manual.';
        throw new Error(getFriendlyDiagnosticError(payload?.error || payload?.message, fallback));
    }
    if (payload?.success !== true || !Array.isArray(payload.detections)) {
        throw new Error('The scanner returned an unexpected response. Please try again.');
    }
    return payload;
}
