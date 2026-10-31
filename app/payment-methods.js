import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useCustomerPaymentMethods } from '../src/customer/useCustomerPaymentMethods';
import { useTheme } from '../src/theme/ThemeContext';
import { useUser } from '../src/users/UserContext';
export default function PaymentMethodsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, isLoadingUser, } = useUser();
    const { paymentMethods, isLoadingPaymentMethods, paymentMethodsError, refreshPaymentMethods, } = useCustomerPaymentMethods(user?.id ?? null);
    const [showProviderNotice, setShowProviderNotice,] = useState(false);
    const isLoading = isLoadingUser ||
        isLoadingPaymentMethods;
    function handleAddPaymentMethod() {
        setShowProviderNotice(true);
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/profile'), style: [
                                styles.backButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Payment Methods" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Saved Payment Methods" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Manage secure payment methods used for supported MechanIQ services." }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleAddPaymentMethod, style: [
                        styles.addButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "credit-card-plus-outline", size: 21, color: "#000000" }), _jsx(Text, { style: styles.addButtonText, children: "Add Payment Method" })] }), showProviderNotice ? (_jsxs(View, { style: [
                        styles.providerCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.warning,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "shield-lock-outline", size: 27, color: colors.warning }), _jsxs(View, { style: styles.providerContent, children: [_jsx(Text, { style: [
                                        styles.providerTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Secure Payment Provider Required" }), _jsx(Text, { style: [
                                        styles.providerDescription,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Adding a payment method will be enabled once a supported payment provider is connected. MechanIQ will use that provider to securely collect and tokenize payment details." }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => setShowProviderNotice(false), style: [
                                        styles.dismissButton,
                                        {
                                            borderColor: colors.border,
                                        },
                                    ], children: _jsx(Text, { style: [
                                            styles.dismissButtonText,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: "Dismiss" }) })] })] })) : null, isLoading ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Loading Payment Methods" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Retrieving your secure payment information." })] })) : !user ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Ionicons, { name: "person-outline", size: 40, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Customer Unavailable" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Your account information could not be loaded." })] })) : paymentMethodsError ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 40, color: colors.warning }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Payment Methods Unavailable" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: paymentMethodsError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshPaymentMethods, style: [
                                styles.retryButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "refresh", size: 18, color: colors.text }), _jsx(Text, { style: [
                                        styles.retryButtonText,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Try Again" })] })] })) : paymentMethods.length ===
                    0 ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "credit-card-outline", size: 44, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No Payment Methods" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Securely saved payment methods will appear here once payment-provider integration is available." })] })) : (_jsx(View, { style: styles.paymentList, children: paymentMethods.map((paymentMethod) => (_jsx(PaymentMethodCard, { paymentMethod: paymentMethod, textColor: colors.text, secondaryTextColor: colors.secondaryText, cardColor: colors.card, borderColor: colors.border, accentColor: colors.accent }, paymentMethod.id))) })), _jsxs(View, { style: [
                        styles.securityCard,
                        {
                            borderColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "shield-check-outline", size: 21, color: colors.accent }), _jsxs(View, { style: styles.securityContent, children: [_jsx(Text, { style: [
                                        styles.securityTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Payment Security" }), _jsx(Text, { style: [
                                        styles.securityDescription,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "MechanIQ will never store raw card numbers or CVV values in the mobile app. Payment details must be securely handled and tokenized by the connected payment provider." })] })] })] }) }));
}
function PaymentMethodCard({ paymentMethod, textColor, secondaryTextColor, cardColor, borderColor, accentColor, }) {
    const maskedNumber = paymentMethod.last4
        ? `•••• ${paymentMethod.last4}`
        : 'Secure payment method';
    const expiry = paymentMethod.expiryMonth !==
        null &&
        paymentMethod.expiryYear !==
            null
        ? `${String(paymentMethod.expiryMonth).padStart(2, '0')}/${String(paymentMethod.expiryYear).slice(-2)}`
        : null;
    return (_jsxs(View, { style: [
            styles.paymentCard,
            {
                backgroundColor: cardColor,
                borderColor,
            },
        ], children: [_jsx(View, { style: [
                    styles.paymentIcon,
                    {
                        borderColor: accentColor,
                    },
                ], children: _jsx(MaterialCommunityIcons, { name: "credit-card-outline", size: 24, color: accentColor }) }), _jsxs(View, { style: styles.paymentContent, children: [_jsxs(View, { style: styles.paymentHeader, children: [_jsx(Text, { numberOfLines: 1, style: [
                                    styles.paymentName,
                                    {
                                        color: textColor,
                                    },
                                ], children: paymentMethod.cardBrand ??
                                    paymentMethod.displayName }), paymentMethod.isDefault ? (_jsx(View, { style: [
                                    styles.defaultBadge,
                                    {
                                        borderColor: accentColor,
                                    },
                                ], children: _jsx(Text, { style: [
                                        styles.defaultBadgeText,
                                        {
                                            color: accentColor,
                                        },
                                    ], children: "Default" }) })) : null] }), _jsx(Text, { style: [
                            styles.maskedNumber,
                            {
                                color: secondaryTextColor,
                            },
                        ], children: maskedNumber }), expiry ? (_jsxs(Text, { style: [
                            styles.expiry,
                            {
                                color: secondaryTextColor,
                            },
                        ], children: ["Expires ", expiry] })) : null] })] }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 36,
    },
    header: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    headerPlaceholder: {
        width: 38,
    },
    title: {
        marginTop: 14,
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 5,
        fontSize: 12,
        lineHeight: 18,
    },
    addButton: {
        minHeight: 48,
        marginTop: 18,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
    providerCard: {
        marginTop: 14,
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 11,
    },
    providerContent: {
        flex: 1,
    },
    providerTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    providerDescription: {
        marginTop: 5,
        fontSize: 9.5,
        lineHeight: 15,
    },
    dismissButton: {
        alignSelf: 'flex-start',
        minHeight: 34,
        marginTop: 10,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
    },
    dismissButtonText: {
        fontSize: 9.5,
        fontWeight: '700',
    },
    stateCard: {
        minHeight: 220,
        marginTop: 18,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateTitle: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    stateDescription: {
        marginTop: 7,
        maxWidth: 310,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    retryButton: {
        minHeight: 42,
        marginTop: 16,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    retryButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    paymentList: {
        marginTop: 18,
        gap: 10,
    },
    paymentCard: {
        minHeight: 92,
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        width: 44,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentContent: {
        flex: 1,
        marginLeft: 12,
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    paymentName: {
        flexShrink: 1,
        fontSize: 12,
        fontWeight: '700',
    },
    defaultBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 5,
    },
    defaultBadgeText: {
        fontSize: 8,
        fontWeight: '700',
    },
    maskedNumber: {
        marginTop: 5,
        fontSize: 10,
    },
    expiry: {
        marginTop: 3,
        fontSize: 9,
    },
    securityCard: {
        marginTop: 18,
        padding: 13,
        borderWidth: 1,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    securityContent: {
        flex: 1,
    },
    securityTitle: {
        fontSize: 11,
        fontWeight: '700',
    },
    securityDescription: {
        marginTop: 4,
        fontSize: 9,
        lineHeight: 15,
    },
});
