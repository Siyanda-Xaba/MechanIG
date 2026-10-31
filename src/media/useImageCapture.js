import { useCallback, useState, } from 'react';
import { captureImageFromCamera, selectImageFromLibrary, } from './imageCaptureService';
export function useImageCapture() {
    const [image, setImage,] = useState(null);
    const [isSelectingImage, setIsSelectingImage,] = useState(false);
    const [imageCaptureError, setImageCaptureError,] = useState(null);
    const selectImage = useCallback(async (source) => {
        try {
            setIsSelectingImage(true);
            setImageCaptureError(null);
            const result = source === 'camera'
                ? await captureImageFromCamera()
                : await selectImageFromLibrary();
            if (result.status ===
                'selected') {
                setImage(result.image);
                return result.image;
            }
            if (result.status ===
                'permission-denied' ||
                result.status === 'error') {
                setImageCaptureError(result.message);
            }
            return null;
        }
        catch {
            setImageCaptureError('Unable to select an image.');
            return null;
        }
        finally {
            setIsSelectingImage(false);
        }
    }, []);
    const clearImage = useCallback(() => {
        setImage(null);
        setImageCaptureError(null);
    }, []);
    const clearImageCaptureError = useCallback(() => {
        setImageCaptureError(null);
    }, []);
    return {
        image,
        isSelectingImage,
        imageCaptureError,
        selectImage,
        clearImage,
        clearImageCaptureError,
    };
}
