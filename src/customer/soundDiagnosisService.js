import { File } from 'expo-file-system';

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

function formatPredictionDetails(predictions) {
    return predictions
        .slice(0, 3)
        .map((prediction, index) => {
        const title = prediction.title || prediction.class_name || `Sound match ${index + 1}`;
        const recommendation = prediction.recommended_action || prediction.description;
        return recommendation ? `${index + 1}. ${title}\n${recommendation}` : `${index + 1}. ${title}`;
    })
        .join('\n\n');
}

export async function analyzeCustomerVehicleSound(request) {
    if (!soundDiagnosisApiUrl) {
        throw new Error('Sound diagnosis is not configured. Restart MechanIQ from the project folder so it can connect to the sound backend.');
    }
    if (!request?.audioUri) {
        throw new Error('The sound recording is missing. Record it again and retry.');
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
        throw new Error('Cannot reach the sound detection backend. Keep the MechanIQ backend running and the phone connected to the computer.');
    }

    let payload;
    try {
        payload = await response.json();
    }
    catch {
        throw new Error('The sound detection backend returned an invalid response.');
    }
    if (!response.ok) {
        throw new Error(payload?.detail || `Sound analysis failed (HTTP ${response.status}).`);
    }
    if (typeof payload?.overall_message !== 'string' || !Array.isArray(payload?.top_results)) {
        throw new Error('The sound detection backend response is missing its diagnosis details.');
    }

    const predictions = payload.top_results;
    const details = formatPredictionDetails(predictions);
    const message = [
        payload.overall_message,
        details ? `Possible sound matches:\n${details}` : '',
        'This model provides an estimate from its training samples, not a confirmed fault. Have a qualified mechanic verify any concern.',
    ].filter(Boolean).join('\n\n');

    return {
        status: 'submitted',
        resultId: null,
        message,
    };
}
