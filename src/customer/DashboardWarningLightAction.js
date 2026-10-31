import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DiagnosticActionCard from '../components/DiagnosticActionCard';
import ImageSourcePickerModal from '../components/ImageSourcePickerModal';
import { scanDashboardWarningLights } from '../customer/dashboardWarningScannerService';
import { useImageCapture } from '../media/useImageCapture';
import { useTheme } from '../theme/ThemeContext';

function waitForModalDismiss() {
    return new Promise((resolve) => setTimeout(resolve, 300));
}

const URGENCY_LABELS = {
    before_driving: 'Before driving',
    check_dashboard_message: 'Check dashboard message',
    high: 'High urgency',
    informational: 'Informational',
    prompt_inspection: 'Prompt inspection',
    soon: 'Address soon',
};

function urgencyColor(urgency, colors) {
    if (urgency === 'high' || urgency === 'before_driving') return colors.danger;
    if (urgency === 'prompt_inspection' || urgency === 'check_dashboard_message') return colors.warning;
    if (urgency === 'soon') return colors.accent;
    return colors.success;
}

function WarningLightResult({ detection, colors }) {
    const title = detection.title || detection.detectedLabel || 'Unrecognized dashboard symbol';
    const urgency = URGENCY_LABELS[detection.urgency] || detection.urgency;
    const badgeColor = urgencyColor(detection.urgency, colors);
    const confidence = detection.confidence == null ? null : Number(detection.confidence);

    return (
        <View style={[styles.detectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.detectionHeader}>
                <View style={styles.detectionTitleWrap}>
                    <Text style={[styles.detectionTitle, { color: colors.text }]}>{title}</Text>
                    {detection.detectedLabel && detection.detectedLabel !== title ? (
                        <Text style={[styles.detectedLabel, { color: colors.secondaryText }]}>
                            Detected as: {detection.detectedLabel}
                        </Text>
                    ) : null}
                </View>
                {urgency ? (
                    <View style={[styles.urgencyBadge, { borderColor: badgeColor }]}>
                        <Text style={[styles.urgencyText, { color: badgeColor }]}>{urgency}</Text>
                    </View>
                ) : null}
            </View>

            {detection.explanationAvailable ? (
                <>
                    <DetailSection colors={colors} icon="information-outline" title="What it means">
                        {detection.meaning}
                    </DetailSection>
                    {Array.isArray(detection.possibleCauses) && detection.possibleCauses.length ? (
                        <View style={styles.detailSection}>
                            <DetailHeading colors={colors} icon="magnify" title="Possible causes" />
                            {detection.possibleCauses.map((cause, index) => (
                                <Text key={`${index}-${cause}`} style={[styles.bullet, { color: colors.secondaryText }]}>• {cause}</Text>
                            ))}
                        </View>
                    ) : null}
                    {detection.recommendedAction ? (
                        <DetailSection colors={colors} icon="wrench-outline" title="Recommended action">
                            {detection.recommendedAction}
                        </DetailSection>
                    ) : null}
                    {detection.safetyAdvice ? (
                        <DetailSection colors={colors} icon="shield-alert-outline" title="Safety advice">
                            {detection.safetyAdvice}
                        </DetailSection>
                    ) : null}
                </>
            ) : (
                <DetailSection colors={colors} icon="help-circle-outline" title="Unverified symbol">
                    {detection.message || 'The symbol was detected, but its meaning is not verified in the warning-light catalogue.'}
                </DetailSection>
            )}
            {confidence != null && Number.isFinite(confidence) ? (
                <Text style={[styles.confidence, { color: colors.secondaryText }]}>Model confidence: {Math.round(confidence * 100)}%. This is an estimate, not a confirmed diagnosis.</Text>
            ) : null}
        </View>
    );
}

function DetailHeading({ colors, icon, title }) {
    return (
        <View style={styles.detailHeading}>
            <MaterialCommunityIcons color={colors.accent} name={icon} size={16} />
            <Text style={[styles.detailTitle, { color: colors.text }]}>{title}</Text>
        </View>
    );
}

function DetailSection({ children, colors, icon, title }) {
    if (!children) return null;
    return (
        <View style={styles.detailSection}>
            <DetailHeading colors={colors} icon={icon} title={title} />
            <Text style={[styles.detailText, { color: colors.secondaryText }]}>{children}</Text>
        </View>
    );
}

export default function CustomerDashboardWarningLightAction({ cardStyle }) {
    const { colors } = useTheme();
    const [isSourcePickerVisible, setIsSourcePickerVisible] = useState(false);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const { isSelectingImage, imageCaptureError, selectImage, clearImage, clearImageCaptureError } = useImageCapture();

    function resetResult() {
        setIsResultVisible(false);
        setScanResult(null);
        setScanError(null);
        clearImage();
        clearImageCaptureError();
    }

    async function handleImageSource(source) {
        setScanResult(null);
        setScanError(null);
        clearImageCaptureError();
        setIsSourcePickerVisible(false);
        await waitForModalDismiss();
        const image = await selectImage(source);
        if (!image) return;

        setIsResultVisible(true);
        setIsAnalyzing(true);
        try {
            const result = await scanDashboardWarningLights({
                imageUri: image.uri,
                fileName: image.fileName,
                mimeType: image.mimeType,
            });
            setScanResult(result);
        } catch (error) {
            setScanError(error instanceof Error ? error.message : 'Unable to analyze this dashboard image.');
        } finally {
            setIsAnalyzing(false);
        }
    }

    return (
        <>
            <DiagnosticActionCard
                title="Know Instrument Cluster"
                description="Photograph a warning light to learn its meaning and urgency."
                icon="car-info"
                cardStyle={cardStyle}

                onPress={() => {
                    if (isAnalyzing) return;
                    clearImage();
                    clearImageCaptureError();
                    setScanError(null);
                    setScanResult(null);
                    setIsSourcePickerVisible(true);
                }}
            />
            <ImageSourcePickerModal
                visible={isSourcePickerVisible}
                isBusy={isSelectingImage}
                title="Know Instrument Cluster"
                description="Take a clear photo of the warning symbol, or choose one from your gallery."
                onCameraPress={() => { void handleImageSource('camera'); }}
                onLibraryPress={() => { void handleImageSource('library'); }}
                onClose={() => {
                    if (!isSelectingImage) setIsSourcePickerVisible(false);
                }}
            />
            <Modal
                visible={isResultVisible || Boolean(imageCaptureError)}
                transparent
                animationType="fade"
                onRequestClose={() => { if (!isAnalyzing) resetResult(); }}
            >
                <View style={styles.overlay}>
                    <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleWrap}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>
                                    {isAnalyzing ? 'Analyzing dashboard' : imageCaptureError ? 'Image unavailable' : scanError ? 'Unable to scan dashboard' : scanResult?.detections?.length ? 'Warning light results' : 'No warning light detected'}
                                </Text>
                                <Text style={[styles.modalSubtitle, { color: colors.secondaryText }]}>
                                    {isAnalyzing
                                        ? 'Checking the photo against the warning-light catalogue…'
                                        : imageCaptureError || scanError || scanResult?.message || 'Check the symbol and follow the vehicle manual for your exact model.'}
                                </Text>
                            </View>
                            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close warning light results" onPress={resetResult} style={styles.closeButton}>
                                <Ionicons color={colors.secondaryText} name="close" size={22} />
                            </TouchableOpacity>
                        </View>
                        {isAnalyzing ? (
                            <View style={styles.loading}>
                                <ActivityIndicator color={colors.accent} size="large" />
                            </View>
                        ) : imageCaptureError ? (
                            <Text style={[styles.errorText, { color: colors.danger }]}>{imageCaptureError}</Text>
                        ) : scanError ? (
                            <Text style={[styles.errorText, { color: colors.danger }]}>{scanError}</Text>
                        ) : scanResult?.detections?.length ? (
                            <ScrollView contentContainerStyle={styles.resultsList} showsVerticalScrollIndicator={false}>
                                {scanResult.detections.map((detection, index) => (
                                    <WarningLightResult
                                        key={`${detection.detectedLabel || detection.title || 'symbol'}-${index}`}
                                        detection={detection}
                                        colors={colors}
                                    />
                                ))}
                                <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>The camera model can misidentify symbols. Verify the warning in your owner&apos;s manual. For a red warning or unsafe vehicle behaviour, stop safely and seek qualified help.</Text>
                            </ScrollView>
                        ) : (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons color={colors.secondaryText} name="image-search-outline" size={34} />
                                <Text style={[styles.emptyText, { color: colors.secondaryText }]}>If the symbol is visible, retake the photo closer with good lighting and avoid glare.</Text>
                            </View>
                        )}
                        {!isAnalyzing ? (
                            <TouchableOpacity activeOpacity={0.75} onPress={resetResult} style={[styles.doneButton, { backgroundColor: colors.accent }]}>
                                <Text style={[styles.doneButtonText, { color: '#090B10' }]}>Done</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.76)', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 24 },
    resultCard: { width: '100%', maxHeight: '92%', borderWidth: 1, borderRadius: 20, padding: 16 },
    modalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    modalTitleWrap: { flex: 1 },
    modalTitle: { fontSize: 18, fontWeight: '800' },
    modalSubtitle: { marginTop: 5, fontSize: 11, lineHeight: 16 },
    closeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    loading: { minHeight: 140, alignItems: 'center', justifyContent: 'center' },
    errorText: { fontSize: 13, lineHeight: 19, marginTop: 18 },
    resultsList: { gap: 10, paddingTop: 14, paddingBottom: 4 },
    detectionCard: { borderWidth: 1, borderRadius: 16, padding: 13 },
    detectionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    detectionTitleWrap: { flex: 1 },
    detectionTitle: { fontSize: 16, lineHeight: 21, fontWeight: '800' },
    detectedLabel: { fontSize: 10, marginTop: 3 },
    urgencyBadge: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
    urgencyText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
    detailSection: { marginTop: 13 },
    detailHeading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailTitle: { fontSize: 11, fontWeight: '800' },
    detailText: { fontSize: 11, lineHeight: 16, marginTop: 5 },
    bullet: { fontSize: 11, lineHeight: 16, marginTop: 4, marginLeft: 22 },
    confidence: { fontSize: 9, lineHeight: 13, marginTop: 12 },
    disclaimer: { fontSize: 10, lineHeight: 15, marginTop: 4 },
    emptyState: { minHeight: 150, justifyContent: 'center', alignItems: 'center', padding: 14, gap: 12 },
    emptyText: { fontSize: 12, lineHeight: 17, textAlign: 'center' },
    doneButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 13, marginTop: 14 },
    doneButtonText: { fontSize: 13, fontWeight: '800' },
});
