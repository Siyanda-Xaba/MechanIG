import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useCustomerHelpSupport } from '../src/customer/useCustomerHelpSupport';
import { useTheme } from '../src/theme/ThemeContext';
export default function HelpSupportScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { helpSupportData, isLoadingHelpSupport, helpSupportError, refreshHelpSupport, } = useCustomerHelpSupport();
    const [expandedFaqId, setExpandedFaqId,] = useState(null);
    function handleFaqPress(faq) {
        setExpandedFaqId((current) => current === faq.id
            ? null
            : faq.id);
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
                            ], children: "Help & Support" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "How can we help?" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Browse common MechanIQ topics and frequently asked questions." }), isLoadingHelpSupport ? (_jsxs(View, { style: [
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
                            ], children: "Loading Help" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Loading MechanIQ help and support information." })] })) : helpSupportError ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.danger,
                        },
                    ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 38, color: colors.danger }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Unable to Load Help" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: helpSupportError }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshHelpSupport, style: [
                                styles.retryButton,
                                {
                                    backgroundColor: colors.accent,
                                },
                            ], children: _jsx(Text, { style: styles.retryText, children: "Try Again" }) })] })) : !helpSupportData ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "help-circle-outline", size: 40, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Help Unavailable" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Help and support information is currently unavailable." })] })) : (_jsxs(_Fragment, { children: [_jsx(Text, { style: [
                                styles.sectionTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Help Topics" }), _jsx(View, { style: styles.topicGrid, children: helpSupportData.topics.map((topic) => (_jsx(HelpTopicCard, { topic: topic, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent, cardColor: colors.card, borderColor: colors.border }, topic.id))) }), _jsx(Text, { style: [
                                styles.sectionTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Frequently Asked Questions" }), _jsx(View, { style: [
                                styles.faqCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: helpSupportData.faqItems.map((faq, index) => {
                                const isExpanded = expandedFaqId ===
                                    faq.id;
                                return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => handleFaqPress(faq), style: [
                                        styles.faqItem,
                                        index !==
                                            helpSupportData
                                                .faqItems
                                                .length -
                                                1
                                            ? {
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors.border,
                                            }
                                            : null,
                                    ], children: [_jsxs(View, { style: styles.faqHeader, children: [_jsx(Text, { style: [
                                                        styles.faqQuestion,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: faq.question }), _jsx(Ionicons, { name: isExpanded
                                                        ? 'chevron-up'
                                                        : 'chevron-down', size: 18, color: colors.secondaryText })] }), isExpanded ? (_jsx(Text, { style: [
                                                styles.faqAnswer,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: faq.answer })) : null] }, faq.id));
                            }) }), _jsx(Text, { style: [
                                styles.sectionTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Contact Support" }), _jsx(View, { style: [
                                styles.supportCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: helpSupportData.supportContacts.map((contact, index) => (_jsxs(View, { style: [
                                    styles.supportRow,
                                    index !==
                                        helpSupportData
                                            .supportContacts
                                            .length -
                                            1
                                        ? {
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors.border,
                                        }
                                        : null,
                                ], children: [_jsx(View, { style: [
                                            styles.supportIcon,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: _jsx(MaterialCommunityIcons, { name: getSupportIcon(contact.channel), size: 20, color: colors.accent }) }), _jsxs(View, { style: styles.supportContent, children: [_jsx(Text, { style: [
                                                    styles.supportLabel,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: contact.label }), _jsx(Text, { style: [
                                                    styles.supportValue,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: contact.isAvailable &&
                                                    contact.value
                                                    ? contact.value
                                                    : 'Not available yet' })] }), _jsx(View, { style: [
                                            styles.statusBadge,
                                            {
                                                borderColor: contact.isAvailable
                                                    ? colors.accent
                                                    : colors.border,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                styles.statusText,
                                                {
                                                    color: contact.isAvailable
                                                        ? colors.accent
                                                        : colors.secondaryText,
                                                },
                                            ], children: contact.isAvailable
                                                ? 'Available'
                                                : 'Coming Soon' }) })] }, contact.channel))) }), _jsxs(View, { style: [
                                styles.noticeCard,
                                {
                                    borderColor: colors.warning,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 21, color: colors.warning }), _jsx(Text, { style: [
                                        styles.noticeText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Support contact details will only be enabled once real MechanIQ support channels are configured. No email address, phone number, or live chat endpoint is fabricated by the frontend." })] })] }))] }) }));
}
function HelpTopicCard({ topic, textColor, secondaryTextColor, accentColor, cardColor, borderColor, }) {
    return (_jsxs(View, { style: [
            styles.topicCard,
            {
                backgroundColor: cardColor,
                borderColor,
            },
        ], children: [_jsx(View, { style: [
                    styles.topicIcon,
                    {
                        borderColor: accentColor,
                    },
                ], children: _jsx(MaterialCommunityIcons, { name: getTopicIcon(topic.id), size: 22, color: accentColor }) }), _jsx(Text, { style: [
                    styles.topicTitle,
                    {
                        color: textColor,
                    },
                ], children: topic.title }), _jsx(Text, { style: [
                    styles.topicDescription,
                    {
                        color: secondaryTextColor,
                    },
                ], children: topic.description })] }));
}
function getTopicIcon(id) {
    switch (id) {
        case 'account-profile':
            return 'account-outline';
        case 'vehicles':
            return 'car-outline';
        case 'diagnostics':
            return 'car-wrench';
        case 'fuel':
            return 'gas-station-outline';
        case 'marketplace':
            return 'store-outline';
        case 'bookings':
            return 'calendar-check-outline';
    }
}
function getSupportIcon(channel) {
    switch (channel) {
        case 'email':
            return 'email-outline';
        case 'phone':
            return 'phone-outline';
        case 'chat':
            return 'message-text-outline';
    }
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
    sectionTitle: {
        marginTop: 20,
        marginBottom: 9,
        fontSize: 15,
        fontWeight: '700',
    },
    stateCard: {
        minHeight: 230,
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
        minWidth: 110,
        minHeight: 40,
        marginTop: 14,
        paddingHorizontal: 16,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryText: {
        color: '#000000',
        fontSize: 10,
        fontWeight: '800',
    },
    topicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    topicCard: {
        width: '48%',
        minHeight: 154,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
    },
    topicIcon: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topicTitle: {
        marginTop: 10,
        fontSize: 11.5,
        fontWeight: '700',
    },
    topicDescription: {
        marginTop: 5,
        fontSize: 8.5,
        lineHeight: 13,
    },
    faqCard: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
    },
    faqItem: {
        paddingVertical: 14,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 10.5,
        lineHeight: 15,
        fontWeight: '600',
    },
    faqAnswer: {
        marginTop: 9,
        paddingRight: 24,
        fontSize: 9,
        lineHeight: 14,
    },
    supportCard: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
    },
    supportRow: {
        minHeight: 70,
        flexDirection: 'row',
        alignItems: 'center',
    },
    supportIcon: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    supportContent: {
        flex: 1,
        marginLeft: 11,
    },
    supportLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    supportValue: {
        marginTop: 3,
        fontSize: 9,
    },
    statusBadge: {
        minHeight: 24,
        paddingHorizontal: 7,
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 8,
        fontWeight: '600',
    },
    noticeCard: {
        marginTop: 18,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    noticeText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 15,
    },
});
