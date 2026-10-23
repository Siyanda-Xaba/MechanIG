import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useDiagnosticResult } from '../../src/customer/useDiagnosticResult';
import { useTheme } from '../../src/theme/ThemeContext';
export default function DiagnosticResultScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const params = useLocalSearchParams();
    const resultId = Array.isArray(params.resultId)
        ? params.resultId[0]
        : params.resultId;
    const { diagnosticResult, isLoadingDiagnosticResult, diagnosticResultError, } = useDiagnosticResult(resultId);
    const severityColor = diagnosticResult?.severity === 'critical'
        ? colors.danger
        : diagnosticResult?.severity === 'warning'
            ? colors.warning
            : colors.success;
    const severityLabel = diagnosticResult?.severity === 'critical'
        ? 'Critical'
        : diagnosticResult?.severity === 'warning'
            ? 'Review Required'
            : 'No Issues';
    if (isLoadingDiagnosticResult) {
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
                    ], children: "Loading diagnostic result..." })] }));
    }
    if (diagnosticResultError || !diagnosticResult) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 48, color: colors.danger }), _jsx(Text, { style: [
                        styles.errorText,
                        {
                            color: colors.text,
                        },
                    ], children: diagnosticResultError ??
                        'Diagnostic result could not be loaded.' }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/diagnostics'), style: [
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
    const handleRepairAction = () => {
        if (diagnosticResult.diyEligible) {
            router.push({
                pathname: '/repair-guide/[resultId]',
                params: {
                    resultId: diagnosticResult.id,
                },
            });
            return;
        }
        if (diagnosticResult.repairLevel ===
            'mechanic-required') {
            router.push({
                pathname: '/find-mechanic/[resultId]',
                params: {
                    resultId: diagnosticResult.id,
                },
            });
        }
    };
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
                            ], children: "Diagnostic Result" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsxs(View, { style: [
                        styles.resultCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(View, { style: [
                                styles.resultIcon,
                                {
                                    borderColor: severityColor,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: diagnosticResult.severity === 'normal'
                                    ? 'check-circle-outline'
                                    : 'alert-outline', size: 32, color: severityColor }) }), _jsx(View, { style: [
                                styles.statusPill,
                                {
                                    borderColor: severityColor,
                                },
                            ], children: _jsx(Text, { style: [
                                    styles.statusText,
                                    {
                                        color: severityColor,
                                    },
                                ], children: severityLabel }) }), _jsx(Text, { style: [
                                styles.resultTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: diagnosticResult.title }), _jsx(Text, { style: [
                                styles.detectedAt,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: diagnosticResult.detectedAt }), _jsx(Text, { style: [
                                styles.summary,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: diagnosticResult.summary })] }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Diagnostic Evidence" }), _jsx(View, { style: [
                        styles.sectionCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: diagnosticResult.evidence.map((evidence, index) => (_jsxs(View, { style: [
                            styles.evidenceRow,
                            index <
                                diagnosticResult.evidence.length - 1 && {
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                            },
                        ], children: [_jsxs(View, { style: styles.evidenceContent, children: [_jsx(Text, { style: [
                                            styles.evidenceLabel,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: evidence.label }), _jsx(Text, { style: [
                                            styles.evidenceValue,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: evidence.value })] }), _jsx(View, { style: [
                                    styles.verificationPill,
                                    {
                                        borderColor: evidence.verified
                                            ? colors.success
                                            : colors.border,
                                    },
                                ], children: _jsx(Text, { style: [
                                        styles.verificationText,
                                        {
                                            color: evidence.verified
                                                ? colors.success
                                                : colors.secondaryText,
                                        },
                                    ], children: evidence.verified
                                        ? 'VERIFIED'
                                        : 'REPORTED' }) })] }, evidence.id))) }), diagnosticResult.possibleCauses.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(Text, { style: [
                                styles.sectionTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Possible Causes" }), _jsx(View, { style: [
                                styles.sectionCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: diagnosticResult.possibleCauses.map((cause) => (_jsxs(View, { style: styles.causeRow, children: [_jsx(View, { style: [
                                            styles.bullet,
                                            {
                                                backgroundColor: colors.accent,
                                            },
                                        ] }), _jsx(Text, { style: [
                                            styles.causeText,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: cause })] }, cause))) })] })) : null, _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Recommended Action" }), _jsx(View, { style: [
                        styles.sectionCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: _jsx(Text, { style: [
                            styles.recommendation,
                            {
                                color: colors.text,
                            },
                        ], children: diagnosticResult.recommendedAction }) }), diagnosticResult.diyEligible ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleRepairAction, style: [
                        styles.primaryAction,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "tools", size: 20, color: "#000000" }), _jsx(Text, { style: styles.primaryActionText, children: "Fix It Yourself" }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: "#000000" })] })) : diagnosticResult.repairLevel ===
                    'mechanic-required' ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleRepairAction, style: [
                        styles.primaryAction,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "account-wrench-outline", size: 21, color: "#000000" }), _jsx(Text, { style: styles.primaryActionText, children: "Find a Mechanic" }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: "#000000" })] })) : null] }) }));
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
    errorText: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: '600',
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
    resultCard: {
        marginTop: 12,
        borderWidth: 1,
        borderRadius: 14,
        padding: 18,
        alignItems: 'center',
    },
    resultIcon: {
        width: 66,
        height: 66,
        borderRadius: 33,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusPill: {
        marginTop: 14,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '800',
    },
    resultTitle: {
        marginTop: 14,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    detectedAt: {
        marginTop: 5,
        fontSize: 10,
    },
    summary: {
        marginTop: 12,
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
    sectionTitle: {
        marginTop: 22,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: '700',
    },
    sectionCard: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    evidenceRow: {
        minHeight: 66,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    evidenceContent: {
        flex: 1,
    },
    evidenceLabel: {
        fontSize: 11,
        fontWeight: '700',
    },
    evidenceValue: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 14,
    },
    verificationPill: {
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 6,
    },
    verificationText: {
        fontSize: 7,
        fontWeight: '800',
    },
    causeRow: {
        minHeight: 42,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    causeText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 16,
    },
    recommendation: {
        paddingVertical: 12,
        fontSize: 11,
        lineHeight: 17,
    },
    primaryAction: {
        minHeight: 48,
        marginTop: 22,
        borderRadius: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
    },
    primaryActionText: {
        flex: 1,
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
        textAlign: 'center',
    },
});
