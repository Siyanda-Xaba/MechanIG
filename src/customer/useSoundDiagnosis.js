import { useCallback, useState, } from 'react';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState, } from 'expo-audio';
import { analyzeCustomerVehicleSound, } from './soundDiagnosisService';
import { useVehicle } from '../vehicles/VehicleContext';
export function useSoundDiagnosis() {
    const { selectedVehicle, } = useVehicle();
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);
    const [captureStatus, setCaptureStatus,] = useState('idle');
    const [recording, setRecording,] = useState(null);
    const [isSubmittingAnalysis, setIsSubmittingAnalysis,] = useState(false);
    const [analysisResult, setAnalysisResult,] = useState(null);
    const [soundDiagnosisError, setSoundDiagnosisError,] = useState(null);
    const startRecording = useCallback(async () => {
        if (!selectedVehicle) {
            setSoundDiagnosisError('Select a vehicle before recording a sound.');
            return false;
        }
        try {
            setCaptureStatus('requesting-permission');
            setSoundDiagnosisError(null);
            setAnalysisResult(null);
            setRecording(null);
            const permission = await AudioModule.requestRecordingPermissionsAsync();
            if (!permission.granted) {
                setCaptureStatus('idle');
                setSoundDiagnosisError('Microphone permission is required to record vehicle sounds.');
                return false;
            }
            await setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            });
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
            setCaptureStatus('recording');
            return true;
        }
        catch {
            setCaptureStatus('idle');
            setSoundDiagnosisError('Unable to start sound recording.');
            return false;
        }
    }, [
        audioRecorder,
        selectedVehicle,
    ]);
    const stopRecording = useCallback(async () => {
        if (!selectedVehicle ||
            !audioRecorder.isRecording) {
            return null;
        }
        try {
            await audioRecorder.stop();
            const uri = audioRecorder.uri;
            if (!uri) {
                setCaptureStatus('idle');
                setSoundDiagnosisError('The recording could not be saved.');
                return null;
            }
            const completedRecording = {
                vehicleId: selectedVehicle.id,
                uri,
                durationMillis: recorderState.durationMillis,
                recordedAt: new Date().toISOString(),
            };
            setRecording(completedRecording);
            setCaptureStatus('recorded');
            setSoundDiagnosisError(null);
            setAnalysisResult(null);
            return completedRecording;
        }
        catch {
            setCaptureStatus('idle');
            setSoundDiagnosisError('Unable to stop and save the sound recording.');
            return null;
        }
    }, [
        audioRecorder,
        recorderState.durationMillis,
        selectedVehicle,
    ]);
    const submitRecordingForAnalysis = useCallback(async () => {
        if (!recording) {
            setSoundDiagnosisError('Record a vehicle sound before submitting it for analysis.');
            return null;
        }
        try {
            setIsSubmittingAnalysis(true);
            setSoundDiagnosisError(null);
            setAnalysisResult(null);
            const result = await analyzeCustomerVehicleSound({
                vehicleId: recording.vehicleId,
                audioUri: recording.uri,
                durationMillis: recording.durationMillis,
                recordedAt: recording.recordedAt,
            });
            setAnalysisResult(result);
            return result;
        }
        catch (error) {
            setSoundDiagnosisError(error instanceof Error && error.message
                ? error.message
                : 'Unable to submit the recording for analysis.');
            return null;
        }
        finally {
            setIsSubmittingAnalysis(false);
        }
    }, [recording]);
    const discardRecording = useCallback(() => {
        setRecording(null);
        setCaptureStatus('idle');
        setSoundDiagnosisError(null);
        setAnalysisResult(null);
    }, []);
    const clearSoundDiagnosisError = useCallback(() => {
        setSoundDiagnosisError(null);
    }, []);
    const clearAnalysisResult = useCallback(() => {
        setAnalysisResult(null);
    }, []);
    return {
        captureStatus,
        recording,
        durationMillis: recorderState.durationMillis,
        isRecording: recorderState.isRecording,
        isSubmittingAnalysis,
        analysisResult,
        soundDiagnosisError,
        startRecording,
        stopRecording,
        submitRecordingForAnalysis,
        discardRecording,
        clearSoundDiagnosisError,
        clearAnalysisResult,
    };
}
