import { useCallback, useState, } from 'react';
import { useImageCapture } from '../media/useImageCapture';
import { uploadProfileImage } from './userService';
import { useUser } from './UserContext';
export function useProfileImageUpload() {
    const { user, updateUser, } = useUser();
    const { image, isSelectingImage, imageCaptureError, selectImage, clearImage, clearImageCaptureError, } = useImageCapture();
    const [isUploadingProfileImage, setIsUploadingProfileImage,] = useState(false);
    const [uploadError, setUploadError,] = useState(null);
    const selectAndUploadProfileImage = useCallback(async (source) => {
        if (!user) {
            setUploadError('Profile information is unavailable.');
            return;
        }
        clearImageCaptureError();
        setUploadError(null);
        const selectedImage = await selectImage(source);
        if (!selectedImage) {
            return;
        }
        try {
            setIsUploadingProfileImage(true);
            const result = await uploadProfileImage({
                userId: user.id,
                uri: selectedImage.uri,
                fileName: selectedImage.fileName,
                mimeType: selectedImage.mimeType,
            });
            updateUser({
                profileImageUrl: result.profileImageUrl,
            });
            clearImage();
        }
        catch (error) {
            setUploadError(error instanceof Error
                ? error.message
                : 'Unable to upload the profile image.');
        }
        finally {
            setIsUploadingProfileImage(false);
        }
    }, [
        clearImage,
        clearImageCaptureError,
        selectImage,
        updateUser,
        user,
    ]);
    const clearProfileImageError = useCallback(() => {
        clearImageCaptureError();
        setUploadError(null);
    }, [clearImageCaptureError]);
    return {
        previewImageUrl: image?.uri ?? null,
        isSelectingImage,
        isUploadingProfileImage,
        profileImageError: imageCaptureError ??
            uploadError,
        selectAndUploadProfileImage,
        clearProfileImageError,
    };
}
