import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '../theme/ThemeContext'

type ImageSourcePickerModalProps = {
  visible: boolean
  isBusy: boolean
  title: string
  description: string
  onCameraPress: () => void
  onLibraryPress: () => void
  onClose: () => void
}

export default function ImageSourcePickerModal({
  visible,
  isBusy,
  title,
  description,
  onCameraPress,
  onLibraryPress,
  onClose,
}: ImageSourcePickerModalProps) {
  const { colors } = useTheme()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={
          isBusy
            ? undefined
            : onClose
        }
      >
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={(event) => {
            event.stopPropagation()
          }}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerContent}>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {title}
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {description}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isBusy}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close image source options"
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={21}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
          </View>

          {isBusy ? (
            <View
              style={[
                styles.loadingCard,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <ActivityIndicator
                size="small"
                color={colors.accent}
              />

              <Text
                style={[
                  styles.loadingText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Opening image source...
              </Text>
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onCameraPress}
                style={[
                  styles.actionButton,
                  {
                    borderColor:
                      colors.accent,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      borderColor:
                        colors.accent,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={25}
                    color={colors.accent}
                  />
                </View>

                <View style={styles.actionContent}>
                  <Text
                    style={[
                      styles.actionTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Take Photo
                  </Text>

                  <Text
                    style={[
                      styles.actionDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Use your camera to capture the visible part.
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onLibraryPress}
                style={[
                  styles.actionButton,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      borderColor:
                        colors.accent,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="image-outline"
                    size={25}
                    color={colors.accent}
                  />
                </View>

                <View style={styles.actionContent}>
                  <Text
                    style={[
                      styles.actionTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Choose from Gallery
                  </Text>

                  <Text
                    style={[
                      styles.actionDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Select an existing photo from your device.
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
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
})