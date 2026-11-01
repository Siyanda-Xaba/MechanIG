import {
  useCallback,
  useState,
} from 'react'

import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  SafeAreaView,
} from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'

import {
  auth,
} from '../../src/firebase/firebase'

import {
  REVIEW_COMMENT_MAX_LENGTH,
  REVIEW_RATING_LIMITS,
} from '../../src/reviews/reviewTypes'

import {
  useMechanicReview,
} from '../../src/reviews/useMechanicReview'

import {
  useTheme,
} from '../../src/theme/ThemeContext'

const RATING_OPTIONS = [1, 2, 3, 4, 5]

function ReviewMessageCard({
  icon,
  title,
  message,
  colors,
  onRetry,
}) {
  return (
    <View
      style={[
        styles.messageCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={42}
        color={colors.accent}
      />

      <Text
        style={[
          styles.messageTitle,
          {
            color: colors.text,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.messageDescription,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        {message}
      </Text>

      {onRetry ? (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onRetry}
          style={[
            styles.retryButton,
            {
              backgroundColor: colors.accent,
            },
          ]}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

export default function ServiceReviewScreen() {
  const router = useRouter()

  const {
    colors,
  } = useTheme()

  const params = useLocalSearchParams()

  const jobId = Array.isArray(params.jobId)
    ? params.jobId[0]
    : params.jobId

  const [
    rating,
    setRating,
  ] = useState(0)

  const [
    comment,
    setComment,
  ] = useState('')

  const getIdToken = useCallback(async () => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      return null
    }

    return currentUser.getIdToken()
  }, [])

  const {
    eligibility,
    isCheckingEligibility,
    eligibilityError,
    canSubmitReview,
    submittedReview,
    isSubmittingReview,
    reviewError,
    submitReview,
    refreshEligibility,
    clearReviewError,
  } = useMechanicReview(
    jobId ?? null,
    {
      getIdToken,
    }
  )

  const hasJobId =
    typeof jobId === 'string' &&
    jobId.trim().length > 0

  const hasSelectedRating =
    rating >= REVIEW_RATING_LIMITS.MIN &&
    rating <= REVIEW_RATING_LIMITS.MAX

  const canSubmit =
    canSubmitReview &&
    hasSelectedRating &&
    !isSubmittingReview

  const handleRatingChange = (value) => {
    setRating(value)
    clearReviewError()
  }

  const handleCommentChange = (value) => {
    setComment(value)
    clearReviewError()
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      return
    }

    await submitReview({
      rating,
      comment: comment.trim() || null,
    })
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
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
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
            Service Review
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Rate Your Service
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Share your experience after your
          mechanic service has been completed.
        </Text>

        {!hasJobId ? (
          <ReviewMessageCard
            icon="clipboard-alert-outline"
            title="No Service Selected"
            message="Select a completed mechanic service to leave a review."
            colors={colors}
          />
        ) : null}

        {hasJobId &&
        isCheckingEligibility &&
        !submittedReview ? (
          <View style={styles.loadingContainer}>
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
              Checking review eligibility...
            </Text>
          </View>
        ) : null}

        {hasJobId &&
        eligibilityError &&
        !isCheckingEligibility &&
        !submittedReview ? (
          <ReviewMessageCard
            icon="cloud-alert-outline"
            title="Reviews Unavailable"
            message={eligibilityError}
            colors={colors}
            onRetry={refreshEligibility}
          />
        ) : null}

        {submittedReview ? (
          <View
            style={[
              styles.messageCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={56}
              color={colors.success}
            />

            <Text
              style={[
                styles.messageTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Review Submitted
            </Text>

            <Text
              style={[
                styles.messageDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Your review has been saved
              successfully.
            </Text>

            <View style={styles.successStars}>
              {RATING_OPTIONS.map((star) => (
                <MaterialCommunityIcons
                  key={star}
                  name={
                    star <= submittedReview.rating
                      ? 'star'
                      : 'star-outline'
                  }
                  size={26}
                  color={colors.accent}
                />
              ))}
            </View>

            {submittedReview.comment ? (
              <Text
                style={[
                  styles.submittedComment,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                {submittedReview.comment}
              </Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.back()}
              style={[
                styles.retryButton,
                {
                  backgroundColor: colors.accent,
                },
              ]}
            >
              <Text style={styles.retryButtonText}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {hasJobId &&
        eligibility &&
        !eligibility.canReview &&
        !isCheckingEligibility &&
        !submittedReview ? (
          <ReviewMessageCard
            icon={
              eligibility.existingReviewId
                ? 'check-circle-outline'
                : 'information-outline'
            }
            title={
              eligibility.existingReviewId
                ? 'Already Reviewed'
                : 'Review Not Available'
            }
            message={
              eligibility.reason ||
              (
                eligibility.existingReviewId
                  ? 'This service already has a confirmed review.'
                  : 'This service is not currently eligible for a review.'
              )
            }
            colors={colors}
          />
        ) : null}

        {hasJobId &&
        eligibility?.canReview === true &&
        !isCheckingEligibility &&
        !submittedReview ? (
          <>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.cardHeading}>
                <MaterialCommunityIcons
                  name="star-outline"
                  size={24}
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Your Rating
                </Text>
              </View>

              <Text
                style={[
                  styles.sectionDescription,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                How would you rate your
                mechanic service?
              </Text>

              <View style={styles.ratingRow}>
                {RATING_OPTIONS.map((star) => (
                  <TouchableOpacity
                    key={star}
                    activeOpacity={0.7}
                    onPress={() =>
                      handleRatingChange(star)
                    }
                    disabled={isSubmittingReview}
                    accessibilityRole="button"
                    accessibilityLabel={`Rate ${star} out of 5 stars`}
                    accessibilityState={{
                      selected: rating === star,
                      disabled: isSubmittingReview,
                    }}
                    style={styles.starButton}
                  >
                    <MaterialCommunityIcons
                      name={
                        star <= rating
                          ? 'star'
                          : 'star-outline'
                      }
                      size={35}
                      color={
                        star <= rating
                          ? colors.accent
                          : colors.secondaryText
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Text
                style={[
                  styles.ratingLabel,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                {rating > 0
                  ? `${rating} out of 5 stars`
                  : 'Select a rating'}
              </Text>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.cardHeading}>
                <MaterialCommunityIcons
                  name="comment-text-outline"
                  size={24}
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Your Feedback
                </Text>
              </View>

              <Text
                style={[
                  styles.sectionDescription,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                Tell us about your experience.
                This field is optional.
              </Text>

              <TextInput
                value={comment}
                onChangeText={handleCommentChange}
                editable={!isSubmittingReview}
                multiline
                maxLength={REVIEW_COMMENT_MAX_LENGTH}
                textAlignVertical="top"
                placeholder="Describe your experience with the mechanic..."
                placeholderTextColor={
                  colors.secondaryText
                }
                style={[
                  styles.commentInput,
                  {
                    color: colors.text,
                    backgroundColor:
                      colors.background,
                    borderColor: colors.border,
                  },
                ]}
              />

              <Text
                style={[
                  styles.characterCount,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                {comment.length}/
                {REVIEW_COMMENT_MAX_LENGTH}
              </Text>
            </View>

            {reviewError ? (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.danger,
                  },
                ]}
              >
                {reviewError}
              </Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.75}
              disabled={!canSubmit}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                {
                  backgroundColor: canSubmit
                    ? colors.accent
                    : colors.border,
                },
              ]}
            >
              {isSubmittingReview ? (
                <ActivityIndicator
                  size="small"
                  color="#000000"
                />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={21}
                    color="#000000"
                  />

                  <Text style={styles.submitText}>
                    Submit Review
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text
              style={[
                styles.disclaimer,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Reviews can only be submitted for
              completed services verified by
              MechanIQ.
            </Text>
          </>
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
    marginBottom: 20,
    fontSize: 12,
    lineHeight: 18,
  },

  loadingContainer: {
    paddingVertical: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 14,
    fontSize: 12,
  },

  messageCard: {
    marginTop: 16,
    padding: 24,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
  },

  messageTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  messageDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },

  retryButton: {
    minHeight: 44,
    marginTop: 22,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },

  successStars: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 4,
  },

  submittedComment: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },

  card: {
    marginTop: 14,
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
  },

  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },

  sectionDescription: {
    fontSize: 12,
    lineHeight: 19,
  },

  ratingRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  starButton: {
    paddingHorizontal: 5,
    paddingVertical: 6,
  },

  ratingLabel: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },

  commentInput: {
    marginTop: 16,
    minHeight: 130,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 12,
    lineHeight: 19,
  },

  characterCount: {
    marginTop: 8,
    fontSize: 10,
    textAlign: 'right',
  },

  errorText: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  submitButton: {
    minHeight: 48,
    marginTop: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  submitText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },

  disclaimer: {
    marginTop: 12,
    paddingHorizontal: 12,
    fontSize: 10,
    lineHeight: 17,
    textAlign: 'center',
  },
})