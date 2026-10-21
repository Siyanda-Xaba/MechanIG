import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function ImageSourcePickerModal({ visible, isBusy, title, description, onCameraPress, onLibraryPress, onClose, }) {
    const { colors } = useTheme();
    return (_jsx(Modal, { visible: visible, transparent: true, animationType: "fade", onRequestClose: onClose, children: _jsx(Pressable, { style: styles.overlay, onPress: isBusy
                ? undefined
                : onClose, children: _jsxs(Pressable, { style: [
                    styles.sheet,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ], onPress: (event) => {
                    event.stopPropagation();
                }, children: [_jsxs(View, { style: styles.headerRow, children: [_jsxs(View, { style: styles.headerContent, children: [_jsx(Text, { style: [
                                            styles.title,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: title }), _jsx(Text, { style: [
                                            styles.description,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: description })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, disabled: isBusy, onPress: onClose, accessibilityRole: "button", accessibilityLabel: "Close image source options", style: styles.closeButton, children: _jsx(MaterialCommunityIcons, { name: "close", size: 21, color: colors.secondaryText }) })] }), isBusy ? (_jsxs(View, { style: [
                            styles.loadingCard,
                            {
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(ActivityIndicator, { size: "small", color: colors.accent }), _jsx(Text, { style: [
                                    styles.loadingText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Opening image source..." })] })) : (_jsxs(View, { style: styles.actions, children: [_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: onCameraPress, style: [
                                    styles.actionButton,
                                    {
                                        borderColor: colors.accent,
                                    },
                                ], children: [_jsx(View, { style: [
                                            styles.iconContainer,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: _jsx(MaterialCommunityIcons, { name: "camera-outline", size: 25, color: colors.accent }) }), _jsxs(View, { style: styles.actionContent, children: [_jsx(Text, { style: [
                                                    styles.actionTitle,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: "Take Photo" }), _jsx(Text, { style: [
                                                    styles.actionDescription,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Use your camera to capture the visible part." })] }), _jsx(MaterialCommunityIcons, { name: "chevron-right", size: 22, color: colors.secondaryText })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: onLibraryPress, style: [
                                    styles.actionButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(View, { style: [
                                            styles.iconContainer,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: _jsx(MaterialCommunityIcons, { name: "image-outline", size: 25, color: colors.accent }) }), _jsxs(View, { style: styles.actionContent, children: [_jsx(Text, { style: [
                                                    styles.actionTitle,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: "Choose from Gallery" }), _jsx(Text, { style: [
                                                    styles.actionDescription,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Select an existing photo from your device." })] }), _jsx(MaterialCommunityIcons, { name: "chevron-right", size: 22, color: colors.secondaryText })] })] }))] }) }) }));
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        paddingHorizontal: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        justifyContent: 'center',
    },
    sheet: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    headerContent: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
    },
    description: {
        marginTop: 5,
        fontSize: 11,
        lineHeight: 17,
    },
    closeButton: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actions: {
        marginTop: 18,
        gap: 10,
    },
    actionButton: {
        minHeight: 76,
        paddingHorizontal: 12,
        paddingVertical: 11,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderWidth: 1,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionContent: {
        flex: 1,
        marginHorizontal: 11,
    },
    actionTitle: {
        fontSize: 12.5,
        fontWeight: '700',
    },
    actionDescription: {
        marginTop: 4,
        fontSize: 9.5,
        lineHeight: 14,
    },
    loadingCard: {
        minHeight: 76,
        marginTop: 18,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
    },
    loadingText: {
        fontSize: 11,
        fontWeight: '600',
    },
});
