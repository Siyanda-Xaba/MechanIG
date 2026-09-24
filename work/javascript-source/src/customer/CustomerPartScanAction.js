import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useState } from 'react';
import DiagnosticActionCard from '../components/DiagnosticActionCard';
import ImageSourcePickerModal from '../components/ImageSourcePickerModal';
import { useImageCapture } from '../media/useImageCapture';
import { useTheme } from '../theme/ThemeContext';
import { usePartScan } from './usePartScan';
function waitForModalDismiss() {
    return new Promise((resolve) => {
        setTimeout(resolve, 300);
    });
}
export default function CustomerPartScanAction() {
    const { colors } = useTheme();
    const [isSourcePickerVisible, setIsSourcePickerVisible,] = useState(false);
    const [isResultVisible, setIsResultVisible,] = useState(false);
    const { isSelectingImage, imageCaptureError, selectImage, clearImage, clearImageCaptureError, } = useImageCapture();
    const { partScanResult, isRecognizingPart, partScanError, scanPart, clearPartScanResult, clearPartScanError, } = usePartScan();
    const isBusy = isSelectingImage ||
        isRecognizingPart;
    async function handleImageSource(source) {
        clearImageCaptureError();
        clearPartScanError();
        clearPartScanResult();
        // Dismiss our React Native modal before presenting
        // the native iOS camera/photo picker.
        setIsSourcePickerVisible(false);
        await waitForModalDismiss();
        const selectedImage = await selectImage(source);
        if (!selectedImage) {
            return;
        }
        const result = await scanPart(selectedImage);
        if (result) {
            setIsResultVisible(true);
        }
    }
    function handleOpenPicker() {
        clearImage();
        clearImageCaptureError();
        clearPartScanError();
        clearPartScanResult();
        setIsResultVisible(false);
        setIsSourcePickerVisible(true);
    }
    function handleCloseResult() {
        setIsResultVisible(false);
        clearImage();
        clearImageCaptureError();
        clearPartScanResult();
        clearPartScanError();
    }
    const resultTitle = imageCaptureError
        ? 'Image unavailable'
        : partScanError
            ? 'Unable to scan part'
            : partScanResult?.status ===
                'identified'
                ? 'Possible part identified'
                : partScanResult?.status ===
                    'uncertain'
                    ? 'Identification uncertain'
                    : 'Part recognition unavailable';
    const resultMessage = imageCaptureError ??
        partScanError ??
        partScanResult?.message ??
        'The image could not be processed.';
    const resultColor = imageCaptureError ||
        partScanError
        ? colors.danger
        : partScanResult?.status ===
            'identified'
            ? colors.accent
            : colors.warning;
    return (_jsxs(_Fragment, { children: [_jsx(DiagnosticActionCard, { title: "Scan a Part", description: "Use camera to identify visible parts.", icon: "camera", onPress: handleOpenPicker }), _jsx(ImageSourcePickerModal, { visible: isSourcePickerVisible, isBusy: isBusy, title: "Scan a Part", description: "Take a clear photo of the visible vehicle part or choose an existing image.", onCameraPress: () => {
                    void handleImageSource('camera');
                }, onLibraryPress: () => {
                    void handleImageSource('library');
                }, onClose: () => {
                    if (!isBusy) {
                        setIsSourcePickerVisible(false);
                    }
                } }), _jsx(Modal, { visible: isResultVisible, transparent: true, animationType: "fade", onRequestClose: handleCloseResult, children: _jsx(Pressable, { style: styles.overlay, onPress: handleCloseResult, children: _jsxs(Pressable, { style: [
                            styles.resultCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], onPress: (event) => {
                            event.stopPropagation();
                        }, children: [_jsx(View, { style: [
                                    styles.resultIcon,
                                    {
                                        borderColor: resultColor,
                                    },
                                ], children: _jsx(MaterialCommunityIcons, { name: partScanResult?.status ===
                                        'identified'
                                        ? 'check'
                                        : 'image-search-outline', size: 27, color: resultColor }) }), _jsx(Text, { style: [
                                    styles.resultTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: resultTitle }), _jsx(Text, { style: [
                                    styles.resultMessage,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: resultMessage }), partScanResult?.recognition ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                            styles.recognitionCard,
                                            {
                                                borderColor: colors.border,
                                            },
                                        ], children: [_jsx(Text, { style: [
                                                    styles.recognitionLabel,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Possible part" }), _jsx(Text, { style: [
                                                    styles.recognitionName,
                                                    {
                                                        color: colors.accent,
                                                    },
                                                ], children: partScanResult
                                                    .recognition
                                                    .partName }), _jsxs(Text, { style: [
                                                    styles.confidenceText,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: [Math.round(partScanResult
                                                        .recognition
                                                        .confidence *
                                                        100), "% recognition confidence"] })] }), _jsx(Text, { style: [
                                            styles.disclaimer,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: "A photo does not confirm a vehicle fault or part compatibility." })] })) : null, _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: handleCloseResult, style: [
                                    styles.doneButton,
                                    {
                                        backgroundColor: colors.accent,
                                    },
                                ], children: _jsx(Text, { style: styles.doneButtonText, children: "Done" }) })] }) }) })] }));
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        paddingHorizontal: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultCard: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
    },
    resultIcon: {
        width: 58,
        height: 58,
        borderWidth: 1.5,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultTitle: {
        marginTop: 14,
        fontSize: 17,
        fontWeight: '800',
        textAlign: 'center',
    },
    resultMessage: {
        marginTop: 7,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    recognitionCard: {
        width: '100%',
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderRadius: 11,
    },
    recognitionLabel: {
        fontSize: 9,
    },
    recognitionName: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '700',
    },
    confidenceText: {
        marginTop: 4,
        fontSize: 9.5,
    },
    disclaimer: {
        marginTop: 12,
        fontSize: 9,
        lineHeight: 14,
        textAlign: 'center',
    },
    doneButton: {
        width: '100%',
        minHeight: 42,
        marginTop: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
});
