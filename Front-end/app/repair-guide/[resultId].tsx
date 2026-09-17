import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'

import { useRepairGuide } from '../../src/customer/useRepairGuide'
import { useTheme } from '../../src/theme/ThemeContext'

export default function RepairGuideScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const params = useLocalSearchParams<{
    resultId?: string | string[]
  }>()

  const resultId = Array.isArray(params.resultId)
    ? params.resultId[0]
    : params.resultId

  const {
    repairGuide,
    isLoadingRepairGuide,
    repairGuideError,
  } = useRepairGuide(resultId)

  if (isLoadingRepairGuide) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text
          style={[
            styles.loadingText,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Loading repair guide...
        </Text>
      </SafeAreaView>
    )
  }

  if (repairGuideError || !repairGuide) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="wrench-outline"
          size={48}
          color={colors.secondaryText}
        />

        <Text
          style={[
            styles.errorTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Repair guide unavailable
        </Text>

        <Text
          style={[
            styles.errorMessage,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          {repairGuideError ??
            'A DIY repair guide is not available for this diagnostic result.'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.backButtonText,
              {
                color: colors.text,
              },
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StableScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={[
              styles.headerButton,
              {
                borderColor: colors.border,
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
            Fix It Yourself
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        {/* Guide Summary */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.summaryIcon,
              {
                borderColor: colors.accent,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="tools"
              size={30}
              color={colors.accent}
            />
          </View>

          <Text
            style={[
              styles.guideTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {repairGuide.title}
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            {repairGuide.description}
          </Text>

          <View style={styles.summaryStats}>
            <View style={styles.stat}>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                Difficulty
              </Text>

              <Text
                style={[
                  styles.statValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {repairGuide.difficulty}
              </Text>
            </View>

            <View
              style={[
                styles.statDivider,
                {
                  backgroundColor: colors.border,
                },
              ]}
            />

            <View style={styles.stat}>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                Estimated Time
              </Text>

              <Text
                style={[
                  styles.statValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {repairGuide.estimatedMinutes} min
              </Text>
            </View>
          </View>
        </View>

        {/* Safety */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Safety First
        </Text>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.warning,
            },
          ]}
        >
          {repairGuide.safetyWarnings.map(
            (warning) => (
              <View
                key={warning}
                style={styles.listRow}
              >
                <MaterialCommunityIcons
                  name="alert-outline"
                  size={18}
                  color={colors.warning}
                />

                <Text
                  style={[
                    styles.listText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {warning}
                </Text>
              </View>
            )
          )}
        </View>

        {/* Tools */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Tools Required
        </Text>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {repairGuide.toolsRequired.length > 0 ? (
            repairGuide.toolsRequired.map((tool) => (
              <View
                key={tool}
                style={styles.listRow}
              >
                <MaterialCommunityIcons
                  name="tools"
                  size={17}
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.listText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {tool}
                </Text>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              No special tools required.
            </Text>
          )}
        </View>

        {/* Parts */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Parts Required
        </Text>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {repairGuide.partsRequired.length > 0 ? (
            repairGuide.partsRequired.map((part) => (
              <View
                key={part}
                style={styles.listRow}
              >
                <MaterialCommunityIcons
                  name="car-cog"
                  size={17}
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.listText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {part}
                </Text>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              No replacement parts required.
            </Text>
          )}
        </View>

        {/* Steps */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Step-by-Step Guide
        </Text>

        <View style={styles.stepsContainer}>
          {[...repairGuide.steps]
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <View
                key={step.id}
                style={[
                  styles.stepCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.stepNumber,
                    {
                      backgroundColor: colors.accent,
                    },
                  ]}
                >
                  <Text style={styles.stepNumberText}>
                    {step.order}
                  </Text>
                </View>

                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {step.title}
                  </Text>

                  <Text
                    style={[
                      styles.stepDescription,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Tutorials */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Tutorial Videos
        </Text>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {repairGuide.videos.length === 0 ? (
            <View style={styles.videoEmpty}>
              <MaterialCommunityIcons
                name="youtube"
                size={30}
                color={colors.secondaryText}
              />

              <Text
                style={[
                  styles.emptyText,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                No approved tutorial videos are available yet.
              </Text>
            </View>
          ) : (
            repairGuide.videos.map((video) => (
              <TouchableOpacity
                key={video.videoId}
                activeOpacity={0.75}
                style={styles.videoRow}
              >
                <MaterialCommunityIcons
                  name="play-circle-outline"
                  size={30}
                  color={colors.accent}
                />

                <View style={styles.videoText}>
                  <Text
                    style={[
                      styles.videoTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {video.title}
                  </Text>

                  <Text
                    style={[
                      styles.videoChannel,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {video.channelName}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
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
})