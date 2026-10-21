import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useState, } from 'react';
import { useMarketplacePictureSearch } from '../src/customer/useMarketplacePictureSearch';
import { useMarketplacePictureSelection } from '../src/customer/useMarketplacePictureSelection';
import { useTheme } from '../src/theme/ThemeContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function MarketplacePictureSearchScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { selectedPicture, isSelectingPicture, pictureSelectionError, takePhoto, chooseFromGallery, clearPicture, clearPictureSelectionError, } = useMarketplacePictureSelection();
    const { recognitionResult, compatibilityResult, isRecognizingPart, isCheckingCompatibility, recognitionError, compatibilityError, recognizePicture, confirmPartAndCheckCompatibility, clearRecognitionResult, clearCompatibilityResult, resetPictureSearch, } = useMarketplacePictureSearch();
    const [confirmedPartName, setConfirmedPartName,] = useState('');
    function handleClearPicture() {
        clearPicture();
        resetPictureSearch();
        setConfirmedPartName('');
    }
    async function handleTakePhoto() {
        clearPictureSelectionError();
        resetPictureSearch();
        setConfirmedPartName('');
        await takePhoto();
    }
    async function handleChooseFromGallery() {
        clearPictureSelectionError();
        resetPictureSearch();
        setConfirmedPartName('');
        await chooseFromGallery();
    }
    async function handleRecognizePicture() {
        if (!selectedPicture) {
            return;
        }
        clearRecognitionResult();
        setConfirmedPartName('');
        const result = await recognizePicture(selectedPicture, selectedVehicle);
        if (result) {
            setConfirmedPartName(result.suggestedPartName);
        }
    }
    async function handleCompatibilityCheck() {
        if (!selectedVehicle ||
            confirmedPartName.trim().length === 0) {
            return;
        }
        clearCompatibilityResult();
        await confirmPartAndCheckCompatibility(selectedVehicle, confirmedPartName);
    }
    const recognitionConfidence = recognitionResult?.confidence !== null &&
        recognitionResult?.confidence !== undefined
        ? `${Math.round(recognitionResult.confidence * 100)}%`
        : null;
    const canRecognize = selectedPicture !== null &&
        !isSelectingPicture &&
        !isRecognizingPart;
    const canCheckCompatibility = recognitionResult !== null &&
        selectedVehicle !== null &&
        confirmedPartName.trim().length > 0 &&
        !isCheckingCompatibility;
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/marketplace'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Search by Picture" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Identify a Vehicle Part" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Take a photo or choose an existing image to identify a part before checking whether it is compatible with your selected vehicle." }), _jsxs(View, { style: [
                        styles.vehicleCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                        styles.sectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Selected Vehicle" })] }), isLoadingVehicles ? (_jsx(Text, { style: [
                                styles.secondaryText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Loading vehicle..." })) : selectedVehicle ? (_jsxs(_Fragment, { children: [_jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                        styles.secondaryText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: selectedVehicle.registration })] })) : (_jsx(Text, { style: [
                                styles.secondaryText,
                                {
                                    color: colors.danger,
                                },
                            ], children: "No vehicle selected." }))] }), _jsxs(View, { style: [
                        styles.pictureCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(MaterialCommunityIcons, { name: "image-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                        styles.sectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Part Image" })] }), selectedPicture ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                        styles.imagePreviewContainer,
                                        {
                                            borderColor: colors.border,
                                        },
                                    ], children: [_jsx(Image, { source: {
                                                uri: selectedPicture.uri,
                                            }, resizeMode: "cover", style: styles.imagePreview }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: handleClearPicture, style: [
                                                styles.removePictureButton,
                                                {
                                                    backgroundColor: colors.background,
                                                    borderColor: colors.border,
                                                },
                                            ], children: _jsx(Ionicons, { name: "close", size: 18, color: colors.text }) })] }), _jsx(Text, { style: [
                                        styles.pictureSource,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: selectedPicture.source ===
                                        'camera'
                                        ? 'Photo taken with camera'
                                        : 'Photo selected from gallery' })] })) : (_jsxs(View, { style: [
                                styles.emptyPicture,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "camera-plus-outline", size: 42, color: colors.secondaryText }), _jsx(Text, { style: [
                                        styles.emptyPictureText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Add a clear photo of the vehicle part you want to identify." })] })), _jsxs(View, { style: styles.pictureActions, children: [_jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isSelectingPicture, onPress: handleTakePhoto, style: [
                                        styles.pictureActionButton,
                                        {
                                            borderColor: colors.accent,
                                        },
                                    ], children: [_jsx(MaterialCommunityIcons, { name: "camera-outline", size: 20, color: colors.accent }), _jsx(Text, { style: [
                                                styles.pictureActionText,
                                                {
                                                    color: colors.accent,
                                                },
                                            ], children: "Take Photo" })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isSelectingPicture, onPress: handleChooseFromGallery, style: [
                                        styles.pictureActionButton,
                                        {
                                            borderColor: colors.accent,
                                        },
                                    ], children: [_jsx(MaterialCommunityIcons, { name: "image-multiple-outline", size: 20, color: colors.accent }), _jsx(Text, { style: [
                                                styles.pictureActionText,
                                                {
                                                    color: colors.accent,
                                                },
                                            ], children: "Gallery" })] })] }), isSelectingPicture ? (_jsxs(View, { style: styles.inlineLoading, children: [_jsx(ActivityIndicator, { size: "small", color: colors.accent }), _jsx(Text, { style: [
                                        styles.inlineLoadingText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Opening image picker..." })] })) : null, pictureSelectionError ? (_jsxs(View, { style: [
                                styles.errorCard,
                                {
                                    borderColor: colors.danger,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 19, color: colors.danger }), _jsx(Text, { style: [
                                        styles.errorText,
                                        {
                                            color: colors.danger,
                                        },
                                    ], children: pictureSelectionError })] })) : null] }), _jsxs(TouchableOpacity, { activeOpacity: canRecognize
                        ? 0.75
                        : 1, disabled: !canRecognize, onPress: handleRecognizePicture, style: [
                        styles.primaryButton,
                        {
                            backgroundColor: canRecognize
                                ? colors.accent
                                : colors.border,
                        },
                    ], children: [isRecognizingPart ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "magnify-scan", size: 20, color: canRecognize
                                ? '#000000'
                                : colors.secondaryText })), _jsx(Text, { style: [
                                styles.primaryButtonText,
                                {
                                    color: canRecognize
                                        ? '#000000'
                                        : colors.secondaryText,
                                },
                            ], children: isRecognizingPart
                                ? 'Identifying Part...'
                                : 'Identify Part' })] }), recognitionError ? (_jsxs(View, { style: [
                        styles.errorCard,
                        styles.standaloneCard,
                        {
                            borderColor: colors.danger,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "image-search-outline", size: 21, color: colors.danger }), _jsx(Text, { style: [
                                styles.errorText,
                                {
                                    color: colors.danger,
                                },
                            ], children: recognitionError })] })) : null, recognitionResult ? (_jsxs(View, { style: [
                        styles.resultCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsxs(View, { style: styles.resultHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                                styles.resultLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Suggested Part" }), _jsx(Text, { style: [
                                                styles.resultTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: recognitionResult.suggestedPartName })] }), _jsx(MaterialCommunityIcons, { name: "check-decagram-outline", size: 28, color: colors.accent })] }), recognitionConfidence ? (_jsxs(View, { style: styles.resultMetaRow, children: [_jsx(Text, { style: [
                                        styles.resultMetaLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Recognition confidence" }), _jsx(Text, { style: [
                                        styles.resultMetaValue,
                                        {
                                            color: colors.accent,
                                        },
                                    ], children: recognitionConfidence })] })) : null, recognitionResult.suggestedCategory ? (_jsxs(View, { style: styles.resultMetaRow, children: [_jsx(Text, { style: [
                                        styles.resultMetaLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Suggested category" }), _jsx(Text, { style: [
                                        styles.resultMetaValue,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: recognitionResult.suggestedCategory })] })) : null, _jsx(Text, { style: [
                                styles.fieldLabel,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Confirm Part Name" }), _jsx(TextInput, { value: confirmedPartName, onChangeText: (value) => {
                                setConfirmedPartName(value);
                                clearCompatibilityResult();
                            }, placeholder: "Confirm identified part", placeholderTextColor: colors.secondaryText, style: [
                                styles.partNameInput,
                                {
                                    color: colors.text,
                                    borderColor: colors.border,
                                },
                            ] }), _jsxs(View, { style: [
                                styles.warningCard,
                                {
                                    borderColor: colors.warning,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "shield-outline", size: 20, color: colors.warning }), _jsx(Text, { style: [
                                        styles.warningText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Image recognition only suggests what the part may be. It does not guarantee that the part fits your vehicle." })] }), _jsxs(TouchableOpacity, { activeOpacity: canCheckCompatibility
                                ? 0.75
                                : 1, disabled: !canCheckCompatibility, onPress: handleCompatibilityCheck, style: [
                                styles.compatibilityButton,
                                {
                                    backgroundColor: canCheckCompatibility
                                        ? colors.accent
                                        : colors.border,
                                },
                            ], children: [isCheckingCompatibility ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "car-cog", size: 20, color: canCheckCompatibility
                                        ? '#000000'
                                        : colors.secondaryText })), _jsx(Text, { style: [
                                        styles.compatibilityButtonText,
                                        {
                                            color: canCheckCompatibility
                                                ? '#000000'
                                                : colors.secondaryText,
                                        },
                                    ], children: isCheckingCompatibility
                                        ? 'Checking...'
                                        : 'Check Vehicle Compatibility' })] })] })) : null, compatibilityError ? (_jsxs(View, { style: [
                        styles.errorCard,
                        styles.standaloneCard,
                        {
                            borderColor: colors.danger,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 20, color: colors.danger }), _jsx(Text, { style: [
                                styles.errorText,
                                {
                                    color: colors.danger,
                                },
                            ], children: compatibilityError })] })) : null, compatibilityResult ? (_jsxs(View, { style: [
                        styles.compatibilityResultCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: compatibilityResult.isCompatible ===
                                true
                                ? colors.success
                                : compatibilityResult.isCompatible ===
                                    false
                                    ? colors.danger
                                    : colors.warning,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: compatibilityResult.isCompatible ===
                                true
                                ? 'check-circle-outline'
                                : compatibilityResult.isCompatible ===
                                    false
                                    ? 'close-circle-outline'
                                    : 'help-circle-outline', size: 32, color: compatibilityResult.isCompatible ===
                                true
                                ? colors.success
                                : compatibilityResult.isCompatible ===
                                    false
                                    ? colors.danger
                                    : colors.warning }), _jsxs(View, { style: styles.compatibilityResultContent, children: [_jsx(Text, { style: [
                                        styles.compatibilityResultTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: compatibilityResult.isCompatible === true
                                        ? 'Verified compatible'
                                        : compatibilityResult?.offers?.length
                                            ? 'Fitment needs confirmation'
                                            : 'No offers found' }), compatibilityResult.message ? (_jsx(Text, { style: [
                                        styles.compatibilityResultMessage,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: compatibilityResult.message })) : null] })] })) : null, compatibilityResult?.offers?.length ? (_jsxs(View, { style: styles.liveDealsSection, children: [_jsxs(View, { style: styles.liveDealsHeader, children: [_jsxs(View, { style: styles.liveDealsTitleRow, children: [_jsx(MaterialCommunityIcons, { name: "store-search-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [styles.liveDealsTitle, { color: colors.text }], children: "Nearby + online deals" })] }), _jsx(Text, { style: [styles.liveDealsSubtitle, { color: colors.secondaryText }], children: "Closest local shops first, followed by online offers" })] }), compatibilityResult.offers.map((offer, offerIndex) => (_jsxs(_Fragment, { children: [offerIndex === 0 || compatibilityResult.offers[offerIndex - 1].sourceType !== offer.sourceType ? (_jsx(Text, { style: [styles.dealGroupTitle, { color: colors.text }], children: offer.sourceType === 'nearby' ? 'Nearby shops' : 'Online offers' })) : null, _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: !offer.productUrl, onPress: () => {
                                if (offer.productUrl) Linking.openURL(offer.productUrl).catch(() => { });
                        }, style: [styles.dealCard, { backgroundColor: colors.card, borderColor: colors.border }], children: [_jsx(View, { style: [styles.dealImageWrap, { backgroundColor: colors.background }], children: offer.thumbnail ? (_jsx(Image, { source: { uri: offer.thumbnail }, resizeMode: "contain", style: styles.dealImage })) : (_jsx(MaterialCommunityIcons, { name: "car-wrench", size: 28, color: colors.secondaryText })) }), _jsxs(View, { style: styles.dealContent, children: [_jsx(Text, { numberOfLines: 2, style: [styles.dealName, { color: colors.text }], children: offer.productName }), _jsx(Text, { numberOfLines: 2, style: [styles.dealRetailer, { color: colors.secondaryText }], children: `${offer.sourceType === 'nearby' ? 'Nearby' : 'Online'} · ${offer.retailer}` }), _jsxs(View, { style: styles.dealPriceRow, children: [_jsx(Text, { numberOfLines: 2, style: [styles.dealPrice, { color: colors.accent }], children: offer.priceText || "Price unavailable" }), _jsx(Text, { style: [styles.dealRecommendation, { color: colors.secondaryText }], children: offer.recommendation })] }), offer.rating ? (_jsxs(View, { style: styles.dealRatingRow, children: [_jsx(MaterialCommunityIcons, { name: "star", size: 14, color: "#F7B500" }), _jsx(Text, { style: [styles.dealRating, { color: colors.secondaryText }], children: [offer.rating, offer.reviewCount ? ` (${offer.reviewCount} reviews)` : ""] })] })) : null, offer.delivery ? (_jsx(Text, { numberOfLines: 2, style: [styles.dealDelivery, { color: colors.secondaryText }], children: [offer.sourceType === 'nearby' ? "Location: " : "Delivery: ", offer.delivery] })) : null] }), _jsx(MaterialCommunityIcons, { name: "open-in-new", size: 20, color: colors.accent })] }, `${offer.id}-${offerIndex}`)] }))) ] })) : null] }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
    title: {
        marginTop: 14,
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 6,
        fontSize: 12,
        lineHeight: 18,
    },
    vehicleCard: {
        marginTop: 20,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    pictureCard: {
        marginTop: 14,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    vehicleName: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: '700',
    },
    secondaryText: {
        marginTop: 5,
        fontSize: 10,
        lineHeight: 15,
    },
    imagePreviewContainer: {
        height: 230,
        marginTop: 14,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removePictureButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 34,
        height: 34,
        borderWidth: 1,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pictureSource: {
        marginTop: 7,
        fontSize: 9,
    },
    emptyPicture: {
        minHeight: 170,
        marginTop: 14,
        padding: 20,
        borderWidth: 1,
        borderRadius: 12,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyPictureText: {
        marginTop: 10,
        maxWidth: 260,
        fontSize: 10,
        lineHeight: 15,
        textAlign: 'center',
    },
    pictureActions: {
        marginTop: 12,
        flexDirection: 'row',
        gap: 10,
    },
    pictureActionButton: {
        flex: 1,
        minHeight: 44,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    pictureActionText: {
        fontSize: 10,
        fontWeight: '700',
    },
    inlineLoading: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inlineLoadingText: {
        fontSize: 10,
    },
    primaryButton: {
        minHeight: 48,
        marginTop: 16,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonText: {
        fontSize: 12,
        fontWeight: '700',
    },
    resultCard: {
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    resultLabel: {
        fontSize: 9,
    },
    resultTitle: {
        marginTop: 4,
        fontSize: 16,
        fontWeight: '700',
    },
    resultMetaRow: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    resultMetaLabel: {
        fontSize: 9,
    },
    resultMetaValue: {
        fontSize: 10,
        fontWeight: '700',
    },
    fieldLabel: {
        marginTop: 18,
        fontSize: 9,
        fontWeight: '600',
    },
    partNameInput: {
        minHeight: 46,
        marginTop: 7,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 9,
        fontSize: 12,
    },
    warningCard: {
        marginTop: 12,
        padding: 11,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    warningText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 14,
    },
    compatibilityButton: {
        minHeight: 46,
        marginTop: 14,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    compatibilityButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    errorCard: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    standaloneCard: {
        marginTop: 14,
    },
    errorText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 15,
    },
    compatibilityResultCard: {
        marginTop: 14,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    compatibilityResultContent: {
        flex: 1,
        marginLeft: 12,
    },
    compatibilityResultTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    compatibilityResultMessage: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 15,
    },
    liveDealsSection: {
        marginTop: 18,
    },
    liveDealsHeader: {
        marginBottom: 10,
    },
    liveDealsTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    liveDealsTitle: {
        fontSize: 15,
        fontWeight: '800',
    },
    liveDealsSubtitle: {
        marginTop: 4,
        fontSize: 9,
    },
    dealGroupTitle: {
        marginTop: 12,
        fontSize: 12,
        fontWeight: '700',
    },
    dealCard: {
        minHeight: 96,
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    dealImageWrap: {
        width: 60,
        height: 60,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    dealImage: {
        width: '100%',
        height: '100%',
    },
    dealContent: {
        flex: 1,
        minWidth: 0,
    },
    dealName: {
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 15,
    },
    dealRetailer: {
        marginTop: 3,
        fontSize: 10,
        lineHeight: 14,
    },
    dealPriceRow: {
        marginTop: 6,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 3,
    },
    dealPrice: {
        fontSize: 13,
        fontWeight: '800',
    },
    dealRecommendation: {
        fontSize: 9,
        lineHeight: 13,
    },
    dealRatingRow: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    dealRating: {
        fontSize: 9,
    },
    dealDelivery: {
        marginTop: 3,
        fontSize: 9,
        lineHeight: 13,
    },
});
