import { useCallback, useState, } from 'react';
import { useVehicle } from '../vehicles/VehicleContext';
import { recognizeVehiclePart } from './partScanService';
export function usePartScan() {
    const { selectedVehicle, } = useVehicle();
    const [partScanResult, setPartScanResult,] = useState(null);
    const [isRecognizingPart, setIsRecognizingPart,] = useState(false);
    const [partScanError, setPartScanError,] = useState(null);
    const scanPart = useCallback(async (image) => {
        if (!selectedVehicle) {
            setPartScanError('Select a vehicle before scanning a part.');
            return null;
        }
        if (!image) {
            setPartScanError('Take or choose a photo before scanning a part.');
            return null;
        }
        try {
            setIsRecognizingPart(true);
            setPartScanError(null);
            setPartScanResult(null);
            const result = await recognizeVehiclePart({
                vehicleId: selectedVehicle.id,
                imageUri: image.uri,
                fileName: image.fileName,
                mimeType: image.mimeType,
            });
            setPartScanResult(result);
            return result;
        }
        catch (error) {
            setPartScanError(error instanceof Error
                ? error.message
                : 'Unable to submit the image for part recognition.');
            return null;
        }
        finally {
            setIsRecognizingPart(false);
        }
    }, [selectedVehicle]);
    const clearPartScanResult = useCallback(() => {
        setPartScanResult(null);
    }, []);
    const clearPartScanError = useCallback(() => {
        setPartScanError(null);
    }, []);
    return {
        partScanResult,
        isRecognizingPart,
        partScanError,
        scanPart,
        clearPartScanResult,
        clearPartScanError,
    };
}
