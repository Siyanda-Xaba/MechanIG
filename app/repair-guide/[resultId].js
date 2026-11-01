import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useRepairGuide } from '../../src/customer/useRepairGuide';
import { useTheme } from '../../src/theme/ThemeContext';
export default function RepairGuideScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const params = useLocalSearchParams();
    const resultId = Array.isArray(params.resultId)
        ? params.resultId[0]
        : params.resultId;
    const { repairGuide, isLoadingRepairGuide, repairGuideError, } = useRepairGuide(resultId);
    if (isLoadingRepairGuide) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                        styles.loadingText,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Loading repair guide..." })] }));
    }
    if (repairGuideError || !repairGuide) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "wrench-outline", size: 48, color: colors.secondaryText }), _jsx(Text, { style: [
                        styles.errorTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Repair guide unavailable" }), _jsx(Text, { style: [
                        styles.errorMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: repairGuideError ??
                        'A DIY repair guide is not available for this diagnostic result.' }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/diagnostics'), style: [
                        styles.backButton,
                        {
                            borderColor: colors.border,
                        },
                    ], children: _jsx(Text, { style: [
                            styles.backButtonText,
                            {
                                color: colors.text,
                            },
                        ], children: "Go Back" }) })] }));
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/diagnostics'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Fix It Yourself" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsxs(View, { style: [
                        styles.summaryCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(View, { style: [
                                styles.summaryIcon,
                                {
                                    borderColor: colors.accent,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "tools", size: 30, color: colors.accent }) }), _jsx(Text, { style: [
                                styles.guideTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: repairGuide.title }), _jsx(Text, { style: [
                                styles.description,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: repairGuide.description }), _jsxs(View, { style: styles.summaryStats, children: [_jsxs(View, { style: styles.stat, children: [_jsx(Text, { style: [
                                                styles.statLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Difficulty" }), _jsx(Text, { style: [
                                                styles.statValue,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: repairGuide.difficulty })] }), _jsx(View, { style: [
                                        styles.statDivider,
                                        {
                                            backgroundColor: colors.border,
                                        },
                                    ] }), _jsxs(View, { style: styles.stat, children: [_jsx(Text, { style: [
                                                styles.statLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Estimated Time" }), _jsxs(Text, { style: [
                                                styles.statValue,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: [repairGuide.estimatedMinutes, " min"] })] })] })] }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Safety First" }), _jsx(View, { style: [
                        styles.sectionCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.warning,
                        },
                    ], children: repairGuide.safetyWarnings.map((warning) => (_jsxs(View, { style: styles.listRow, children: [_jsx(MaterialCommunityIcons, { name: "alert-outline", size: 18, color: colors.warning }), _jsx(Text, { style: [
                                    styles.listText,
                                    {
                                        color: colors.text,
                                    },
                                ], children: warning })] }, warning))) }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Tools Required" }), _jsx(View, { style: [
                        styles.sectionCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: repairGuide.toolsRequired.length > 0 ? (repairGuide.toolsRequired.map((tool) => (_jsxs(View, { style: styles.listRow, children: [_jsx(MaterialCommunityIcons, { name: "tools", size: 17, color: colors.accent }), _jsx(Text, { style: [
                                    styles.listText,
                                    {
                                        color: colors.text,
                                    },
                                ], children: tool })] }, tool)))) : (_jsx(Text, { style: [
                            styles.emptyText,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "No special tools required." })) }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Parts Required" }), _jsx(View, { style: [
                        styles.sectionCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: repairGuide.partsRequired.length > 0 ? (repairGuide.partsRequired.map((part) => (_jsxs(View, { style: styles.listRow, children: [_jsx(MaterialCommunityIcons, { name: "car-cog", size: 17, color: colors.accent }), _jsx(Text, { style: [
                                    styles.listText,
                                    {
                                        color: colors.text,
                                    },
                                ], children: part })] }, part)))) : (_jsx(Text, { style: [
                            styles.emptyText,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "No replacement parts required." })) }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Step-by-Step Guide" }), _jsx(View, { style: styles.stepsContainer, children: [...repairGuide.steps]
                        .sort((a, b) => a.order - b.order)
                        .map((step) => (_jsxs(View, { style: [
                            styles.stepCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(View, { style: [
                                    styles.stepNumber,
                                    {
                                        backgroundColor: colors.accent,
                                    },
                                ], children: _jsx(Text, { style: styles.stepNumberText, children: step.order }) }), _jsxs(View, { style: styles.stepContent, children: [_jsx(Text, { style: [
                                            styles.stepTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: step.title }), _jsx(Text, { style: [
                                            styles.stepDescription,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: step.description })] })] }, step.id))) }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Tutorial Videos" }), _jsx(View, { style: [
                        styles.sectionCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: repairGuide.videos.length === 0 ? (_jsxs(View, { style: styles.videoEmpty, children: [_jsx(MaterialCommunityIcons, { name: "youtube", size: 30, color: colors.secondaryText }), _jsx(Text, { style: [
                                    styles.emptyText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "No approved tutorial videos are available yet." })] })) : (repairGuide.videos.map((video) => (_jsxs(TouchableOpacity, { activeOpacity: 0.75, style: styles.videoRow, children: [_jsx(MaterialCommunityIcons, { name: "play-circle-outline", size: 30, color: colors.accent }), _jsxs(View, { style: styles.videoText, children: [_jsx(Text, { style: [
                                            styles.videoTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: video.title }), _jsx(Text, { style: [
                                            styles.videoChannel,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: video.channelName })] }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] }, video.videoId)))) })] }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    centeredPage: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 12,
    },
    errorTitle: {
        marginTop: 14,
        fontSize: 18,
        fontWeight: '700',
    },
    errorMessage: {
        marginTop: 8,
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
    backButton: {
        marginTop: 20,
        minHeight: 42,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 12,
        fontWeight: '700',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    header: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerButton: {
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
    summaryCard: {
        marginTop: 12,
        padding: 18,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
    },
    summaryIcon: {
        width: 60,
        height: 60,
        borderWidth: 1.5,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    guideTitle: {
        marginTop: 14,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    description: {
        marginTop: 8,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    summaryStats: {
        width: '100%',
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 32,
    },
    statLabel: {
        fontSize: 9,
    },
    statValue: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '700',
    },
    sectionTitle: {
        marginTop: 22,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: '700',
    },
    sectionCard: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        gap: 10,
    },
    listRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    listText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 16,
    },
    emptyText: {
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
    },
    stepsContainer: {
        gap: 10,
    },
    stepCard: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 11,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    stepDescription: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 15,
    },
    videoEmpty: {
        minHeight: 80,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    videoRow: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    videoText: {
        flex: 1,
    },
    videoTitle: {
        fontSize: 11,
        fontWeight: '700',
    },
    videoChannel: {
        marginTop: 3,
        fontSize: 9,
    },
});
