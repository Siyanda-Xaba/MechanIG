import { File } from 'expo-file-system';
import { formatSoundDiagnosisResponse, getFriendlyDiagnosticError } from '../data/userFriendlyResponses';

const configuredSoundUrl = process.env.EXPO_PUBLIC_SOUND_DIAGNOSIS_API_URL?.replace(/\/$/, '');
const soundCandidates = [
    configuredSoundUrl,
    'http://127.0.0.1:8000',
    'http://192.168.137.1:8000',
    'http://172.16.41.210:8000',
].filter(Boolean);

let activeSoundUrl = configuredSoundUrl || 'http://127.0.0.1:8000';

(async () => {
    for (const candidate of soundCandidates) {
        try {
            const res = await fetch(`${candidate}/health/ready`, { signal: AbortSignal.timeout(1200) });
            if (res.ok) {
                activeSoundUrl = candidate;
                break;
            }
        } catch {}
    }
})();

const soundDiagnosisApiUrl = activeSoundUrl;

function getRecordingFile(uri) {
    const path = String(uri).split(/[?#]/, 1)[0];
    const encodedName = path.split('/').pop() || '';
    let name = encodedName;
    try {
        name = decodeURIComponent(encodedName);
    }
    catch {
        // Keep the original URI name if it contains an invalid escape sequence.
    }
    if (!/\.(wav|m4a|mp3|aac|flac|ogg)$/i.test(name)) {
        name = `vehicle-sound-${Date.now()}.m4a`;
    }
    const extension = name.split('.').pop()?.toLowerCase();
    const typeByExtension = {
        wav: 'audio/wav',
        m4a: 'audio/mp4',
        mp3: 'audio/mpeg',
        aac: 'audio/aac',
        flac: 'audio/flac',
        ogg: 'audio/ogg',
    };
    return { name, type: typeByExtension[extension] || 'audio/mp4' };
}

export async function analyzeCustomerVehicleSound(request) {
    if (!soundDiagnosisApiUrl) {
        throw new Error('Sound check is not available right now. Please try again later.');
    }
    if (!request?.audioUri) {
        throw new Error('We could not find your recording. Record it again and try once more.');
    }

    const file = getRecordingFile(request.audioUri);
    const formData = new FormData();
    try {
        const audioFile = new File(request.audioUri);
        formData.append('file', audioFile, file.name || audioFile.name || 'vehicle-sound.m4a');
    } catch {
        formData.append('file', {
            uri: request.audioUri,
            name: file.name,
            type: file.type,
        });
    }
    formData.append('vehicle_id', String(request.vehicleId || ''));
    formData.append('duration_millis', String(Math.max(0, Math.round(request.durationMillis || 0))));
    formData.append('recorded_at', String(request.recordedAt || ''));

    let response;
    const targetUrls = [activeSoundUrl, ...soundCandidates.filter((u) => u !== activeSoundUrl)];
    for (const baseUrl of targetUrls) {
        try {
            // Do not set Content-Type here: fetch must add the multipart boundary.
            response = await fetch(`${baseUrl}/predict`, {
                method: 'POST',
                body: formData,
            });
            activeSoundUrl = baseUrl;
            break;
        }
        catch (err) {
            console.warn(`[SoundDiagnosis] Request to ${baseUrl}/predict failed:`, err);
        }
    }
    if (!response) {
        throw new Error('We could not connect to the sound checker. Check your connection and try again.');
    }

    let payload;
    try {
        payload = await response.json();
    }
    catch {
        throw new Error('We could not read the sound check result. Please try again.');
    }
    if (!response.ok) {
        throw new Error(getFriendlyDiagnosticError(payload?.detail, 'We could not analyse that recording. Try again, or ask a mechanic to listen to the sound.'));
    }
    if (typeof payload?.overall_message !== 'string' || !Array.isArray(payload?.top_results)) {
        throw new Error('The sound check did not return a result. Please try again or ask a mechanic to listen.');
    }

    const message = formatSoundDiagnosisResponse(payload);

    return {
        status: 'submitted',
        resultId: null,
        message,
    };
}
