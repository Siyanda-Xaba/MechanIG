import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'
import {
  useEffect,
  useState,
} from 'react'

import { useMarketplacePictureSearch } from '../src/customer/useMarketplacePictureSearch'
import { useMarketplacePictureSelection } from '../src/customer/useMarketplacePictureSelection'
import { useTheme } from '../src/theme/ThemeContext'
import { useVehicle } from '../src/vehicles/VehicleContext'

export default function MarketplacePictureSearchScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    selectedPicture,
    isSelectingPicture,
    pictureSelectionError,
    takePhoto,
    chooseFromGallery,
    clearPicture,
    clearPictureSelectionError,
  } = useMarketplacePictureSelection()

  const {
    recognitionResult,
    compatibilityResult,

    isRecognizingPart,
    isCheckingCompatibility,

    recognitionError,
    compatibilityError,

    recognizePicture,
    confirmPartAndCheckCompatibility,

    clearRecognitionResult,
    clearCompatibilityResult,
    resetPictureSearch,
  } = useMarketplacePictureSearch()

  const [
    confirmedPartName,
    setConfirmedPartName,
  ] = useState('')

  useEffect(() => {
    if (recognitionResult) {
      setConfirmedPartName(
        recognitionResult.suggestedPartName
      )
    }
  }, [recognitionResult])

  function handleClearPicture() {
    clearPicture()
    resetPictureSearch()
    setConfirmedPartName('')
  }

  async function handleTakePhoto() {
    clearPictureSelectionError()
    resetPictureSearch()
    setConfirmedPartName('')

    await takePhoto()
  }

  async function handleChooseFromGallery() {
    clearPictureSelectionError()
    resetPictureSearch()
    setConfirmedPartName('')

    await chooseFromGallery()
  }

  async function handleRecognizePicture() {
    if (!selectedPicture) {
      return
    }

    clearRecognitionResult()
    setConfirmedPartName('')

    await recognizePicture(
      selectedPicture
    )
  }

  async function handleCompatibilityCheck() {
    if (
      !selectedVehicle ||
      confirmedPartName.trim().length === 0
    ) {
      return
    }

    clearCompatibilityResult()

    await confirmPartAndCheckCompatibility(
      selectedVehicle.id,
      confirmedPartName
    )
  }

  const recognitionConfidence =
    recognitionResult?.confidence !== null &&
    recognitionResult?.confidence !== undefined
      ? `${Math.round(
          recognitionResult.confidence * 100
        )}%`
      : null

  const canRecognize =
    selectedPicture !== null &&
    !isSelectingPicture &&
    !isRecognizingPart

  const canCheckCompatibility =
    recognitionResult !== null &&
    selectedVehicle !== null &&
    confirmedPartName.trim().length > 0 &&
    !isCheckingCompatibility

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <StableScrollView
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.back()
            }
            style={[
              styles.headerButton,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Search by Picture
          </Text>

          <View
            style={
              styles.headerPlaceholder
            }
          />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Identify a Vehicle Part
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Take a photo or choose an
          existing image to identify a
          part before checking whether
          it is compatible with your
          selected vehicle.
        </Text>

        <View
          style={[
            styles.vehicleCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View
            style={
              styles.sectionHeader
            }
          >
            <MaterialCommunityIcons
              name="car-outline"
              size={22}
              color={colors.accent}
            />

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Selected Vehicle
            </Text>
          </View>

          {isLoadingVehicles ? (
            <Text
              style={[
                styles.secondaryText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Loading vehicle...
            </Text>
          ) : selectedVehicle ? (
            <>
              <Text
                style={[
                  styles.vehicleName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {
                  selectedVehicle.make
                }{' '}
                {
                  selectedVehicle.model
                }
              </Text>

              <Text
                style={[
                  styles.secondaryText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {
                  selectedVehicle.registration
                }
              </Text>
            </>
          ) : (
            <Text
              style={[
                styles.secondaryText,
                {
                  color: colors.danger,
                },
              ]}
            >
              No vehicle selected.
            </Text>
          )}
        </View>

        <View
          style={[
            styles.pictureCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View
            style={
              styles.sectionHeader
            }
          >
            <MaterialCommunityIcons
              name="image-outline"
              size={22}
              color={colors.accent}
            />

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Part Image
            </Text>
          </View>

          {selectedPicture ? (
            <>
              <View
                style={[
                  styles.imagePreviewContainer,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Image
                  source={{
                    uri:
                      selectedPicture.uri,
                  }}
                  resizeMode="cover"
                  style={
                    styles.imagePreview
                  }
                />

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={
                    handleClearPicture
                  }
                  style={[
                    styles.removePictureButton,
                    {
                      backgroundColor:
                        colors.background,
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={18}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.pictureSource,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {selectedPicture.source ===
                'camera'
                  ? 'Photo taken with camera'
                  : 'Photo selected from gallery'}
              </Text>
            </>
          ) : (
            <View
              style={[
                styles.emptyPicture,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={42}
                color={
                  colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.emptyPictureText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Add a clear photo of the
                vehicle part you want to
                identify.
              </Text>
            </View>
          )}

          <View
            style={
              styles.pictureActions
            }
          >
            <TouchableOpacity
              activeOpacity={0.75}
              disabled={
                isSelectingPicture
              }
              onPress={handleTakePhoto}
              style={[
                styles.pictureActionButton,
                {
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="camera-outline"
                size={20}
                color={colors.accent}
              />

              <Text
                style={[
                  styles.pictureActionText,
                  {
                    color:
                      colors.accent,
                  },
                ]}
              >
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              disabled={
                isSelectingPicture
              }
              onPress={
                handleChooseFromGallery
              }
              style={[
                styles.pictureActionButton,
                {
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="image-multiple-outline"
                size={20}
                color={colors.accent}
              />

              <Text
                style={[
                  styles.pictureActionText,
                  {
                    color:
                      colors.accent,
                  },
                ]}
              >
                Gallery
              </Text>
            </TouchableOpacity>
          </View>

          {isSelectingPicture ? (
            <View
              style={
                styles.inlineLoading
              }
            >
              <ActivityIndicator
                size="small"
                color={colors.accent}
              />

              <Text
                style={[
                  styles.inlineLoadingText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Opening image
                picker...
              </Text>
            </View>
          ) : null}

          {pictureSelectionError ? (
            <View
              style={[
                styles.errorCard,
                {
                  borderColor:
                    colors.danger,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={19}
                color={colors.danger}
              />

              <Text
                style={[
                  styles.errorText,
                  {
                    color:
                      colors.danger,
                  },
                ]}
              >
                {
                  pictureSelectionError
                }
              </Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          activeOpacity={
            canRecognize
              ? 0.75
              : 1
          }
          disabled={!canRecognize}
          onPress={
            handleRecognizePicture
          }
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                canRecognize
                  ? colors.accent
                  : colors.border,
            },
          ]}
        >
          {isRecognizingPart ? (
            <ActivityIndicator
              size="small"
              color="#000000"
            />
          ) : (
            <MaterialCommunityIcons
              name="magnify-scan"
              size={20}
              color={
                canRecognize
                  ? '#000000'
                  : colors.secondaryText
              }
            />
          )}

          <Text
            style={[
              styles.primaryButtonText,
              {
                color:
                  canRecognize
                    ? '#000000'
                    : colors.secondaryText,
              },
            ]}
          >
            {isRecognizingPart
              ? 'Identifying Part...'
              : 'Identify Part'}
          </Text>
        </TouchableOpacity>

        {recognitionError ? (
          <View
            style={[
              styles.errorCard,
              styles.standaloneCard,
              {
                borderColor:
                  colors.danger,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="image-search-outline"
              size={21}
              color={colors.danger}
            />

            <Text
              style={[
                styles.errorText,
                {
                  color:
                    colors.danger,
                },
              ]}
            >
              {recognitionError}
            </Text>
          </View>
        ) : null}

        {recognitionResult ? (
          <View
            style={[
              styles.resultCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={
                styles.resultHeader
              }
            >
              <View>
                <Text
                  style={[
                    styles.resultLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Suggested Part
                </Text>

                <Text
                  style={[
                    styles.resultTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {
                    recognitionResult.suggestedPartName
                  }
                </Text>
              </View>

              <MaterialCommunityIcons
                name="check-decagram-outline"
                size={28}
                color={colors.accent}
              />
            </View>

            {recognitionConfidence ? (
              <View
                style={
                  styles.resultMetaRow
                }
              >
                <Text
                  style={[
                    styles.resultMetaLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Recognition
                  confidence
                </Text>

                <Text
                  style={[
                    styles.resultMetaValue,
                    {
                      color:
                        colors.accent,
                    },
                  ]}
                >
                  {
                    recognitionConfidence
                  }
                </Text>
              </View>
            ) : null}

            {recognitionResult.suggestedCategory ? (
              <View
                style={
                  styles.resultMetaRow
                }
              >
                <Text
                  style={[
                    styles.resultMetaLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Suggested category
                </Text>

                <Text
                  style={[
                    styles.resultMetaValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {
                    recognitionResult.suggestedCategory
                  }
                </Text>
              </View>
            ) : null}

            <Text
              style={[
                styles.fieldLabel,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Confirm Part Name
            </Text>

            <TextInput
              value={confirmedPartName}
              onChangeText={(value) => {
                setConfirmedPartName(
                  value
                )

                clearCompatibilityResult()
              }}
              placeholder="Confirm identified part"
              placeholderTextColor={
                colors.secondaryText
              }
              style={[
                styles.partNameInput,
                {
                  color: colors.text,
                  borderColor:
                    colors.border,
                },
              ]}
            />

            <View
              style={[
                styles.warningCard,
                {
                  borderColor:
                    colors.warning,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="shield-outline"
                size={20}
                color={colors.warning}
              />

              <Text
                style={[
                  styles.warningText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Image recognition only
                suggests what the part
                may be. It does not
                guarantee that the part
                fits your vehicle.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={
                canCheckCompatibility
                  ? 0.75
                  : 1
              }
              disabled={
                !canCheckCompatibility
              }
              onPress={
                handleCompatibilityCheck
              }
              style={[
                styles.compatibilityButton,
                {
                  backgroundColor:
                    canCheckCompatibility
                      ? colors.accent
                      : colors.border,
                },
              ]}
            >
              {isCheckingCompatibility ? (
                <ActivityIndicator
                  size="small"
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="car-cog"
                  size={20}
                  color={
                    canCheckCompatibility
                      ? '#000000'
                      : colors.secondaryText
                  }
                />
              )}

              <Text
                style={[
                  styles.compatibilityButtonText,
                  {
                    color:
                      canCheckCompatibility
                        ? '#000000'
                        : colors.secondaryText,
                  },
                ]}
              >
                {isCheckingCompatibility
                  ? 'Checking...'
                  : 'Check Vehicle Compatibility'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {compatibilityError ? (
          <View
            style={[
              styles.errorCard,
              styles.standaloneCard,
              {
                borderColor:
                  colors.danger,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color={colors.danger}
            />

            <Text
              style={[
                styles.errorText,
                {
                  color:
                    colors.danger,
                },
              ]}
            >
              {compatibilityError}
            </Text>
          </View>
        ) : null}

        {compatibilityResult ? (
          <View
            style={[
              styles.compatibilityResultCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  compatibilityResult.isCompatible ===
                  true
                    ? colors.success
                    : compatibilityResult.isCompatible ===
                        false
                      ? colors.danger
                      : colors.warning,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={
                compatibilityResult.isCompatible ===
                true
                  ? 'check-circle-outline'
                  : compatibilityResult.isCompatible ===
                      false
                    ? 'close-circle-outline'
                    : 'help-circle-outline'
              }
              size={32}
              color={
                compatibilityResult.isCompatible ===
                true
                  ? colors.success
                  : compatibilityResult.isCompatible ===
                      false
                    ? colors.danger
                    : colors.warning
              }
            />

            <View
              style={
                styles.compatibilityResultContent
              }
            >
              <Text
                style={[
                  styles.compatibilityResultTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {compatibilityResult.isCompatible ===
                true
                  ? 'Compatible'
                  : compatibilityResult.isCompatible ===
                      false
                    ? 'Not Compatible'
                    : 'Compatibility Unconfirmed'}
              </Text>

              {compatibilityResult.message ? (
                <Text
                  style={[
                    styles.compatibilityResultMessage,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  {
                    compatibilityResult.message
                  }
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </StableScrollView>
    </SafeAreaView>
  )
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
})