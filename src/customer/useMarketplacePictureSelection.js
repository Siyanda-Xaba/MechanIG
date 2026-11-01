import { useCallback, useState, } from 'react';
import * as ImagePicker from 'expo-image-picker';
function createPictureSelection(asset, source) {
    return {
        uri: asset.uri,
        source,
        fileName: asset.fileName ?? null,
        mimeType: asset.mimeType ?? null,
        width: typeof asset.width === 'number'
            ? asset.width
            : null,
        height: typeof asset.height === 'number'
            ? asset.height
            : null,
    };
}
export function useMarketplacePictureSelection() {
    const [selectedPicture, setSelectedPicture,] = useState(null);
    const [isSelectingPicture, setIsSelectingPicture,] = useState(false);
    const [pictureSelectionError, setPictureSelectionError,] = useState(null);
    const clearPicture = useCallback(() => {
        setSelectedPicture(null);
        setPictureSelectionError(null);
    }, []);
    const clearPictureSelectionError = useCallback(() => {
        setPictureSelectionError(null);
    }, []);
    const takePhoto = useCallback(async () => {
        try {
            setIsSelectingPicture(true);
            setPictureSelectionError(null);
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                setPictureSelectionError('Camera permission is required to photograph a vehicle part.');
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.2,
            });
            if (result.canceled) {
                return;
            }
            const asset = result.assets[0];
            if (!asset) {
                setPictureSelectionError('No image was returned from the camera.');
                return;
            }
            setSelectedPicture(createPictureSelection(asset, 'camera'));
        }
        catch (error) {
            setPictureSelectionError(error instanceof Error
                ? error.message
                : 'Unable to take a photo.');
        }
        finally {
            setIsSelectingPicture(false);
        }
    }, []);
    const chooseFromGallery = useCallback(async () => {
        try {
            setIsSelectingPicture(true);
            setPictureSelectionError(null);
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                setPictureSelectionError('Photo library permission is required to choose a vehicle part image.');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.2,
                selectionLimit: 1,
            });
            if (result.canceled) {
                return;
            }
            const asset = result.assets[0];
            if (!asset) {
                setPictureSelectionError('No image was selected.');
                return;
            }
            setSelectedPicture(createPictureSelection(asset, 'gallery'));
        }
        catch (error) {
            setPictureSelectionError(error instanceof Error
                ? error.message
                : 'Unable to choose a photo.');
        }
        finally {
            setIsSelectingPicture(false);
        }
    }, []);
    return {
        selectedPicture,
        isSelectingPicture,
        pictureSelectionError,
        takePhoto,
        chooseFromGallery,
        clearPicture,
        clearPictureSelectionError,
    };
}
