import { useCallback, useState, } from 'react';
import { checkMarketplacePartCompatibility, recognizeMarketplacePart, recordMarketplaceActivity, } from './marketplaceService';
export function useMarketplacePictureSearch() {
    const [recognitionResult, setRecognitionResult,] = useState(null);
    const [compatibilityResult, setCompatibilityResult,] = useState(null);
    const [isRecognizingPart, setIsRecognizingPart,] = useState(false);
    const [isCheckingCompatibility, setIsCheckingCompatibility,] = useState(false);
    const [recognitionError, setRecognitionError,] = useState(null);
    const [compatibilityError, setCompatibilityError,] = useState(null);
    const recognizePicture = useCallback(async (picture, vehicle) => {
        try {
            setIsRecognizingPart(true);
            setRecognitionError(null);
            setCompatibilityResult(null);
            setCompatibilityError(null);
            const result = await recognizeMarketplacePart(picture, vehicle);
            setRecognitionResult(result);
            return result;
        }
        catch (error) {
            setRecognitionResult(null);
            setRecognitionError(error instanceof Error
                ? error.message
                : 'Unable to identify the vehicle part.');
            return null;
        }
        finally {
            setIsRecognizingPart(false);
        }
    }, []);
    const confirmPartAndCheckCompatibility = useCallback(async (vehicle, confirmedPartName) => {
        if (!recognitionResult) {
            setCompatibilityResult(null);
            setCompatibilityError('Identify a part before checking vehicle compatibility.');
            return null;
        }
        const normalizedPartName = confirmedPartName.trim();
        if (normalizedPartName.length === 0) {
            setCompatibilityResult(null);
            setCompatibilityError('Confirm the identified part name before checking compatibility.');
            return null;
        }
        try {
            setIsCheckingCompatibility(true);
            setCompatibilityError(null);
            const result = await checkMarketplacePartCompatibility({
                vehicle,
                confirmedPartName: normalizedPartName,
                catalogueMatches: recognitionResult.catalogueMatches,
                offers: recognitionResult.offers,
            });
            if (result.offers?.length) {
                await recordMarketplaceActivity({ title: `Viewed ${result.offers.length} live deals for ${normalizedPartName}`, type: 'viewed' });
            }
            setCompatibilityResult(result);
            return result;
        }
        catch (error) {
            setCompatibilityResult(null);
            setCompatibilityError(error instanceof Error
                ? error.message
                : 'Unable to check vehicle compatibility.');
            return null;
        }
        finally {
            setIsCheckingCompatibility(false);
        }
    }, [recognitionResult]);
    const clearRecognitionResult = useCallback(() => {
        setRecognitionResult(null);
        setRecognitionError(null);
        setCompatibilityResult(null);
        setCompatibilityError(null);
    }, []);
    const clearCompatibilityResult = useCallback(() => {
        setCompatibilityResult(null);
        setCompatibilityError(null);
    }, []);
    const resetPictureSearch = useCallback(() => {
        setRecognitionResult(null);
        setCompatibilityResult(null);
        setRecognitionError(null);
        setCompatibilityError(null);
        setIsRecognizingPart(false);
        setIsCheckingCompatibility(false);
    }, []);
    return {
        recognitionResult,
        compatibilityResult,
        isRecognizingPart,
        isCheckingCompatibility,
        recognitionError,
        compatibilityError,
        recognizePicture,
        confirmPartAndCheckCompatibility,
        clearRecognitionResult,
        clearCompatibilityResult,
        resetPictureSearch,
    };
}
