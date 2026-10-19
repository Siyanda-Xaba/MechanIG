import {
    useCallback,
    useRef,
    useState,
} from 'react';

import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from 'expo-audio';

import {
    analyzeCustomerVehicleSound,
} from './soundDiagnosisService';

import { useVehicle } from '../vehicles/VehicleContext';

export function useSoundDiagnosis() {
    const { selectedVehicle } = useVehicle();

    const audioRecorder = useAudioRecorder(
        RecordingPresets.HIGH_QUALITY
    );

    const recorderState = useAudioRecorderState(audioRecorder);

    const [captureStatus, setCaptureStatus] = useState('idle');

    const [recording, setRecording] = useState(null);

    const [
        isSubmittingAnalysis,
        setIsSubmittingAnalysis,
    ] = useState(false);

    const [analysisResult, setAnalysisResult] = useState(null);

    const [
        soundDiagnosisError,
        setSoundDiagnosisError,
    ] = useState(null);

    /*
     * Track the latest selected vehicle independently
     * of asynchronous recording operations.
     */
    const selectedVehicleIdRef = useRef(null);

    selectedVehicleIdRef.current =
        selectedVehicle?.id ?? null;

    /*
     * Keep the recording associated with the vehicle
     * selected when recording originally started.
     */
    const recordingVehicleIdRef = useRef(null);

    /*
     * Synchronous operation guards prevent overlapping
     * recording operations before React state updates.
     *
     * Possible values:
     * idle, starting, recording, stopping, recorded
     */
    const captureOperationRef = useRef('idle');

    /*
     * Prevent concurrent analysis submissions.
     */
    const submissionInProgressRef = useRef(false);

    const startRecording = useCallback(async () => {
        const vehicleId = selectedVehicleIdRef.current;

        if (!vehicleId) {
            setSoundDiagnosisError(
                'Select a vehicle before recording a sound.'
            );

            return false;
        }

        /*
         * A previous recording operation must finish
         * before another recording can begin.
         */
        if (
            captureOperationRef.current !== 'idle' ||
            submissionInProgressRef.current
        ) {
            return false;
        }

        captureOperationRef.current = 'starting';

        try {
            setCaptureStatus('requesting-permission');

            setSoundDiagnosisError(null);
            setAnalysisResult(null);
            setRecording(null);

            const permission =
                await AudioModule.requestRecordingPermissionsAsync();

            if (!permission.granted) {
                captureOperationRef.current = 'idle';

                setCaptureStatus('idle');

                setSoundDiagnosisError(
                    'Microphone permission is required to record vehicle sounds.'
                );

                return false;
            }

            /*
             * The selected vehicle may change while
             * the microphone permission dialog is open.
             */
            if (selectedVehicleIdRef.current !== vehicleId) {
                captureOperationRef.current = 'idle';

                setCaptureStatus('idle');

                setSoundDiagnosisError(
                    'Vehicle selection changed. Start a new recording for the selected vehicle.'
                );

                return false;
            }

            await setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            });

            await audioRecorder.prepareToRecordAsync();

            /*
             * Recheck vehicle selection after preparing
             * the native recording session.
             */
            if (selectedVehicleIdRef.current !== vehicleId) {
                captureOperationRef.current = 'idle';

                setCaptureStatus('idle');

                setSoundDiagnosisError(
                    'Vehicle selection changed. Start a new recording for the selected vehicle.'
                );

                return false;
            }

            recordingVehicleIdRef.current = vehicleId;

            audioRecorder.record();

            captureOperationRef.current = 'recording';

            setCaptureStatus('recording');

            return true;
        } catch {
            captureOperationRef.current = 'idle';

            recordingVehicleIdRef.current = null;

            setCaptureStatus('idle');

            setSoundDiagnosisError(
                'Unable to start sound recording.'
            );

            return false;
        }
    }, [audioRecorder]);

    const stopRecording = useCallback(async () => {
        /*
         * Prevent overlapping stop operations.
         */
        if (
            captureOperationRef.current !== 'recording' ||
            !recordingVehicleIdRef.current
        ) {
            return null;
        }

        captureOperationRef.current = 'stopping';

        try {
            await audioRecorder.stop();

            const uri = audioRecorder.uri;

            if (!uri) {
                captureOperationRef.current = 'idle';

                recordingVehicleIdRef.current = null;

                setCaptureStatus('idle');

                setSoundDiagnosisError(
                    'The recording could not be saved.'
                );

                return null;
            }

            /*
             * Use the vehicle ID captured when recording
             * began, not the currently selected vehicle.
             */
            const completedRecording = {
                vehicleId: recordingVehicleIdRef.current,
                uri,
                durationMillis: recorderState.durationMillis,
                recordedAt: new Date().toISOString(),
            };

            setRecording(completedRecording);

            captureOperationRef.current = 'recorded';

            setCaptureStatus('recorded');

            setAnalysisResult(null);

            if (
                selectedVehicleIdRef.current !==
                completedRecording.vehicleId
            ) {
                setSoundDiagnosisError(
                    'Vehicle selection changed. Select the original vehicle before submitting this recording, or discard it.'
                );
            } else {
                setSoundDiagnosisError(null);
            }

            return completedRecording;
        } catch {
            captureOperationRef.current = 'idle';

            recordingVehicleIdRef.current = null;

            setCaptureStatus('idle');

            setSoundDiagnosisError(
                'Unable to stop and save the sound recording.'
            );

            return null;
        }
    }, [
        audioRecorder,
        recorderState.durationMillis,
    ]);

    const submitRecordingForAnalysis = useCallback(async () => {
        /*
         * Prevent duplicate submissions.
         */
        if (submissionInProgressRef.current) {
            return null;
        }

        if (!recording) {
            setSoundDiagnosisError(
                'Record a vehicle sound before submitting it for analysis.'
            );

            return null;
        }

        /*
         * Never associate a recording with a different
         * vehicle merely because the customer switched
         * vehicles after recording.
         */
        if (
            recording.vehicleId !==
            selectedVehicleIdRef.current
        ) {
            setSoundDiagnosisError(
                'This recording belongs to another vehicle. Select the original vehicle or discard the recording.'
            );

            return null;
        }

        if (captureOperationRef.current !== 'recorded') {
            return null;
        }

        submissionInProgressRef.current = true;

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

            /*
             * A response must not be applied to a different
             * vehicle if selection changes during submission.
             */
            if (
                selectedVehicleIdRef.current !==
                recording.vehicleId
            ) {
                setSoundDiagnosisError(
                    'Vehicle selection changed during submission. No analysis result was applied.'
                );

                return null;
            }

            setAnalysisResult(result);

            return result;
        } catch {
            setSoundDiagnosisError(
                'Unable to submit the recording for analysis.'
            );

            return null;
        } finally {
            submissionInProgressRef.current = false;

            setIsSubmittingAnalysis(false);
        }
    }, [recording]);

    const discardRecording = useCallback(() => {
        /*
         * Do not discard recording state while a native
         * recording operation or submission is active.
         */
        if (
            captureOperationRef.current === 'starting' ||
            captureOperationRef.current === 'recording' ||
            captureOperationRef.current === 'stopping' ||
            submissionInProgressRef.current
        ) {
            return;
        }

        recordingVehicleIdRef.current = null;

        captureOperationRef.current = 'idle';

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