import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { darkColors } from '../../theme/colors';
// Legacy export names are kept because the existing mechanic signup
// screens import them. Their values now come from the shared theme.
export const CYAN = darkColors.accent;
export const BORDER = darkColors.border;
export const MUTED = darkColors.secondaryText;
export const GREEN = darkColors.success;
const BACKGROUND = darkColors.background;
const CARD = darkColors.card;
const TEXT = darkColors.text;
const SECONDARY_TEXT = darkColors.secondaryText;
export const STEP_LABELS = [
    'Personal Details',
    'Professional Details',
    'Security',
];
const STEP_SUBTITLES = {
    1: "Let's get to know you and your business.",
    2: 'Tell us about your professional experience.',
    3: 'Secure your account.',
};
export function FieldRow({ icon, label, placeholder, value, onChangeText, style, keyboardType = 'default', }) {
    return (_jsxs(View, { style: [
            styles.fieldWrapper,
            style,
        ], children: [_jsx(View, { style: styles.fieldIcon, children: icon }), _jsxs(View, { style: styles.fieldTextArea, children: [_jsx(Text, { style: styles.fieldLabel, children: label }), _jsx(TextInput, { style: styles.fieldInput, placeholder: placeholder, placeholderTextColor: SECONDARY_TEXT, value: value, onChangeText: onChangeText, keyboardType: keyboardType })] })] }));
}
export function DropdownRow({ icon, label, placeholder, value = '', style, onPress, }) {
    return (_jsxs(TouchableOpacity, { style: [
            styles.fieldWrapper,
            style,
        ], activeOpacity: 0.8, onPress: onPress, children: [_jsx(View, { style: styles.fieldIcon, children: icon }), _jsxs(View, { style: styles.fieldTextArea, children: [_jsx(Text, { style: styles.fieldLabel, children: label }), _jsx(Text, { style: value
                            ? styles.fieldInput
                            : styles.fieldPlaceholder, numberOfLines: 1, children: value || placeholder })] }), _jsx(Ionicons, { name: "chevron-down", size: 18, color: MUTED })] }));
}
export function UploadRow({ label, onPress, }) {
    return (_jsxs(TouchableOpacity, { style: styles.fieldWrapper, activeOpacity: 0.8, onPress: onPress, children: [_jsx(View, { style: styles.fieldIcon, children: _jsx(Ionicons, { name: "document-text-outline", size: 18, color: MUTED }) }), _jsxs(View, { style: styles.fieldTextArea, children: [_jsx(Text, { style: styles.fieldLabel, children: label }), _jsx(Text, { style: styles.fieldPlaceholder, children: "Upload document" })] }), _jsx(Ionicons, { name: "cloud-upload-outline", size: 18, color: MUTED })] }));
}
export function PasswordRow({ label, placeholder, value, onChangeText, visible, onToggleVisible, }) {
    return (_jsxs(View, { style: styles.fieldWrapper, children: [_jsx(View, { style: styles.fieldIcon, children: _jsx(Ionicons, { name: "lock-closed-outline", size: 18, color: MUTED }) }), _jsxs(View, { style: styles.fieldTextArea, children: [_jsx(Text, { style: styles.fieldLabel, children: label }), _jsx(TextInput, { style: styles.fieldInput, placeholder: placeholder, placeholderTextColor: SECONDARY_TEXT, value: value, onChangeText: onChangeText, secureTextEntry: !visible })] }), _jsx(TouchableOpacity, { onPress: onToggleVisible, hitSlop: 8, activeOpacity: 0.7, children: _jsx(Ionicons, { name: visible
                        ? 'eye-off-outline'
                        : 'eye-outline', size: 20, color: MUTED }) })] }));
}
export function StepIndicator({ currentStep, }) {
    return (_jsx(View, { style: styles.stepIndicatorRow, children: STEP_LABELS.map((label, index) => {
            const stepNumber = (index +
                1);
            return (_jsxs(View, { style: styles.stepItem, children: [index <
                        STEP_LABELS.length -
                            1 && (_jsx(View, { style: [
                            styles.stepConnector,
                            currentStep >
                                stepNumber &&
                                styles.stepConnectorActive,
                        ] })), _jsx(View, { style: [
                            styles.stepCircle,
                            currentStep >=
                                stepNumber &&
                                styles.stepCircleActive,
                        ], children: _jsx(Text, { style: [
                                styles.stepNumber,
                                currentStep >=
                                    stepNumber &&
                                    styles.stepNumberActive,
                            ], children: stepNumber }) }), _jsx(Text, { style: [
                            styles.stepLabel,
                            currentStep ===
                                stepNumber &&
                                styles.stepLabelActive,
                        ], numberOfLines: 2, children: label })] }, stepNumber));
        }) }));
}
export function SignUpHeader({ onBack, step, }) {
    return (_jsxs(_Fragment, { children: [_jsx(TouchableOpacity, { style: styles.backButton, onPress: onBack, activeOpacity: 0.7, accessibilityRole: "button", accessibilityLabel: "Go back", children: _jsx(Ionicons, { name: "arrow-back", size: 24, color: TEXT }) }), _jsx(View, { style: styles.logoContainer, children: _jsx(Image, { source: require('../../../assets/images/mechaniq-logo.png'), style: styles.logo, resizeMode: "contain" }) }), _jsx(Text, { style: styles.title, children: "Create Your Account" }), _jsx(Text, { style: styles.subtitle, children: STEP_SUBTITLES[step] }), _jsx(StepIndicator, { currentStep: step })] }));
}
export function SignUpFooter({ onSignIn, }) {
    return (_jsxs(View, { style: styles.footerRow, children: [_jsxs(Text, { style: styles.footerText, children: ["Already have an account?", ' '] }), _jsx(TouchableOpacity, { onPress: onSignIn, activeOpacity: 0.7, children: _jsx(Text, { style: styles.footerLink, children: "Log in" }) })] }));
}
export const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: BACKGROUND,
    },
    container: {
        flex: 1,
        backgroundColor: BACKGROUND,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 6,
    },
    logo: {
        width: 150,
        height: 80,
    },
    title: {
        color: TEXT,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 6,
    },
    subtitle: {
        color: SECONDARY_TEXT,
        fontSize: 13,
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 20,
    },
    stepIndicatorRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 24,
    },
    stepItem: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: BORDER,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BACKGROUND,
        zIndex: 2,
    },
    stepCircleActive: {
        backgroundColor: CYAN,
        borderColor: CYAN,
    },
    stepNumber: {
        color: MUTED,
        fontWeight: 'bold',
        fontSize: 13,
    },
    stepNumberActive: {
        color: TEXT,
    },
    stepLabel: {
        color: MUTED,
        fontSize: 10,
        textAlign: 'center',
        marginTop: 6,
        width: '100%',
    },
    stepLabelActive: {
        color: CYAN,
        fontWeight: 'bold',
    },
    stepConnector: {
        position: 'absolute',
        top: 14,
        left: '50%',
        right: '-50%',
        height: 2,
        backgroundColor: BORDER,
        zIndex: 1,
    },
    stepConnectorActive: {
        backgroundColor: CYAN,
    },
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 4,
    },
    sectionTitle: {
        color: TEXT,
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 8,
    },
    sectionSubtitle: {
        color: MUTED,
        fontSize: 12,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    fieldWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 14,
        backgroundColor: CARD,
    },
    fieldIcon: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldTextArea: {
        flex: 1,
    },
    fieldLabel: {
        color: SECONDARY_TEXT,
        fontSize: 11,
    },
    fieldInput: {
        color: TEXT,
        fontSize: 13,
        paddingVertical: 2,
    },
    fieldPlaceholder: {
        color: MUTED,
        fontSize: 13,
        paddingVertical: 2,
    },
    halfRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfField: {
        width: '48%',
    },
    fieldContainer: {
        marginBottom: 14,
    },
    fieldLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
        gap: 8,
    },
    dropdown: {
        minHeight: 52,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: CARD,
    },
    dropdownSelectedText: {
        color: TEXT,
        fontSize: 13,
        flex: 1,
        marginRight: 10,
    },
    requirementsBox: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        backgroundColor: CARD,
    },
    requirementsTitle: {
        color: TEXT,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    requirementText: {
        color: SECONDARY_TEXT,
        fontSize: 11,
        marginLeft: 8,
        flex: 1,
    },
    verificationBox: {
        marginBottom: 14,
    },
    verificationHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 10,
    },
    verificationHeaderText: {
        marginLeft: 10,
        flex: 1,
    },
    verificationSubtext: {
        color: MUTED,
        fontSize: 11,
        marginTop: 2,
    },
    verificationInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 14,
        backgroundColor: CARD,
    },
    verificationInputArea: {
        flex: 1,
        marginRight: 10,
    },
    sendCodeButton: {
        borderWidth: 1,
        borderColor: CYAN,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    sendCodeText: {
        color: CYAN,
        fontSize: 11,
        fontWeight: 'bold',
    },
    verifyCodeButton: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    verifyCodeText: {
        color: MUTED,
        fontSize: 11,
        fontWeight: 'bold',
    },
    twoFactorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: CARD,
    },
    twoFactorTextArea: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    agreeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: 'transparent',
    },
    agreeText: {
        flex: 1,
        color: SECONDARY_TEXT,
        fontSize: 11,
    },
    agreeLink: {
        color: CYAN,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    continueButton: {
        flex: 1,
        backgroundColor: CYAN,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    continueText: {
        color: TEXT,
        fontSize: 13,
        fontWeight: 'bold',
    },
    backOutlineButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: CYAN,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    backOutlineText: {
        color: CYAN,
        fontSize: 13,
        fontWeight: 'bold',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        flexWrap: 'wrap',
    },
    footerText: {
        color: SECONDARY_TEXT,
        fontSize: 12,
    },
    footerLink: {
        color: CYAN,
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    dropdownModal: {
        width: '100%',
        maxHeight: '80%',
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: CYAN,
        borderRadius: 12,
        padding: 18,
    },
    modalTitle: {
        color: TEXT,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalSubtext: {
        color: MUTED,
        fontSize: 11,
        textAlign: 'center',
        marginTop: -8,
        marginBottom: 12,
    },
    dropdownOption: {
        minHeight: 46,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    dropdownOptionText: {
        color: TEXT,
        fontSize: 13,
    },
    modalDoneButton: {
        backgroundColor: CYAN,
        borderRadius: 8,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    modalDoneText: {
        color: TEXT,
        fontSize: 13,
        fontWeight: 'bold',
    },
});
