import * as ImagePicker from 'expo-image-picker';
function mapAsset(asset, source) {
    return {
        uri: asset.uri,
        source,
        fileName: asset.fileName ?? null,
        mimeType: asset.mimeType ?? null,
        width: asset.width,
        height: asset.height,
    };
}
export async function captureImageFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
        return {
            status: 'permission-denied',
            image: null,
            message: 'Camera permission is required to take a photo.',
        };
    }
    try {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.9,
        });
        if (result.canceled) {
            return {
                status: 'cancelled',
                image: null,
            };
        }
        const asset = result.assets[0];
        if (!asset) {
            return {
                status: 'error',
                image: null,
                message: 'No image was captured.',
            };
        }
        return {
            status: 'selected',
            image: mapAsset(asset, 'camera'),
        };
    }
    catch {
        return {
            status: 'error',
            image: null,
            message: 'Unable to open the camera.',
        };
    }
}
export async function selectImageFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
        return {
            status: 'permission-denied',
            image: null,
            message: 'Photo library permission is required to choose an image.',
        };
    }
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.9,
        });
        if (result.canceled) {
            return {
                status: 'cancelled',
                image: null,
            };
        }
        const asset = result.assets[0];
        if (!asset) {
            return {
                status: 'error',
                image: null,
                message: 'No image was selected.',
            };
        }
        return {
            status: 'selected',
            image: mapAsset(asset, 'library'),
        };
    }
    catch {
        return {
            status: 'error',
            image: null,
            message: 'Unable to open the photo library.',
        };
    }
}
