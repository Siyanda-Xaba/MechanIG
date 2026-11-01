import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'
import { auth } from '../../src/firebase/firebase'
import { getMyMechanicReviewsData } from '../../src/reviews/reviewService'
import { useTheme } from '../../src/theme/ThemeContext'
import { useUser } from '../../src/users/UserContext'

const PAGE_SIZE = 20
const STARS = [1, 2, 3, 4, 5]

function formatReviewDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString()
}

function ReviewStars({ rating, colors, size = 18 }) {
  return (
    <View style={styles.stars} accessibilityLabel={`${rating} out of 5 stars`}>
      {STARS.map((star) => (
        <MaterialCommunityIcons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={size}
          color={star <= rating ? colors.accent : colors.secondaryText}
        />
      ))}
    </View>
  )
}

export default function MechanicReviewsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { user, isLoadingUser } = useUser()

  const [reviewsData, setReviewsData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [loadMoreError, setLoadMoreError] = useState(null)
  const generationRef = useRef(0)
  const loadingMoreRef = useRef(false)

  const getIdToken = useCallback(async () => {
    return auth.currentUser?.getIdToken() ?? null
  }, [])

  const refreshReviews = useCallback(async () => {
    const generation = ++generationRef.current
    loadingMoreRef.current = false
    setIsLoading(true)
    setIsLoadingMore(false)
    setError(null)
    setLoadMoreError(null)

    try {
      const result = await getMyMechanicReviewsData({
        getIdToken,
        limit: PAGE_SIZE,
      })

      if (generationRef.current === generation) {
        setReviewsData(result)
      }
    } catch (caughtError) {
      if (generationRef.current === generation) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to load customer reviews.'
        )
      }
    } finally {
      if (generationRef.current === generation) {
        setIsLoading(false)
      }
    }
  }, [getIdToken])

  useEffect(() => {
    if (isLoadingUser) {
      return undefined
    }

    if (!user) {
      generationRef.current += 1
      setReviewsData(null)
      setIsLoading(false)
      setError('Sign in to view your customer reviews.')
      return undefined
    }

    // Clear reviews when the authenticated profile changes.
    setReviewsData(null)
    void refreshReviews()

    return () => {
      generationRef.current += 1
    }
  }, [user?.id, isLoadingUser, refreshReviews])

  const loadMore = useCallback(async () => {
    const cursor = reviewsData?.reviews?.nextCursor

    if (
      !cursor ||
      !reviewsData?.reviews?.hasMore ||
      isLoading ||
      loadingMoreRef.current
    ) {
      return
    }

    const generation = generationRef.current
    loadingMoreRef.current = true
    setIsLoadingMore(true)
    setLoadMoreError(null)

    try {
      const result = await getMyMechanicReviewsData({
        getIdToken,
        cursor,
        limit: PAGE_SIZE,
      })

      if (generationRef.current !== generation) {
        return
      }

      setReviewsData((current) => {
        if (
          !current ||
          current.summary.mechanicId !== result.summary.mechanicId
        ) {
          return current
        }

        const existingIds = new Set(
          current.reviews.reviews.map((review) => review.id)
        )
        const newReviews = result.reviews.reviews.filter(
          (review) => !existingIds.has(review.id)
        )

        return {
          summary: result.summary,
          reviews: {
            ...result.reviews,
            reviews: [...current.reviews.reviews, ...newReviews],
          },
        }
      })
    } catch (caughtError) {
      if (generationRef.current === generation) {
        setLoadMoreError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to load more reviews.'
        )
      }
    } finally {
      if (generationRef.current === generation) {
        loadingMoreRef.current = false
        setIsLoadingMore(false)
      }
    }
  }, [getIdToken, isLoading, reviewsData])

  const reviewItems = reviewsData?.reviews?.reviews ?? []
  const summary = reviewsData?.summary ?? null
  const canLoadMore =
    reviewsData?.reviews?.hasMore === true &&
    Boolean(reviewsData.reviews.nextCursor)

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StableScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={[styles.headerButton, { borderColor: colors.border }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Customer Reviews
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Refresh reviews"
            onPress={refreshReviews}
            disabled={isLoading || isLoadingUser || !user}
            style={[styles.headerButton, { borderColor: colors.border }]}
          >
            <Ionicons
              name="refresh"
              size={19}
              color={isLoading ? colors.secondaryText : colors.accent}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Ratings & Reviews
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Feedback from customers who completed a verified service.
        </Text>

        {(isLoadingUser || (isLoading && !reviewsData)) && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.stateMessage, { color: colors.secondaryText }]}>
              Loading customer reviews...
            </Text>
          </View>
        )}

        {error && (
          <View
            style={[
              styles.stateCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <MaterialCommunityIcons
              name="cloud-alert-outline"
              size={38}
              color={colors.danger}
            />
            <Text style={[styles.stateTitle, { color: colors.text }]}>
              {reviewsData ? 'Unable to Refresh Reviews' : 'Reviews Unavailable'}
            </Text>
            <Text style={[styles.stateMessage, { color: colors.secondaryText }]}>
              {error}
            </Text>
            {user ? (
              <TouchableOpacity
                onPress={refreshReviews}
                style={[styles.actionButton, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.actionButtonText}>Try Again</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        {reviewsData && (
          <>
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.summaryRating, { color: colors.text }]}>
                {summary.averageRating === null
                  ? 'Not rated'
                  : summary.averageRating.toFixed(1)}
              </Text>
              {summary.averageRating !== null && (
                <ReviewStars
                  rating={Math.round(summary.averageRating)}
                  colors={colors}
                  size={22}
                />
              )}
              <Text style={[styles.summaryCount, { color: colors.secondaryText }]}>
                {summary.reviewCount} verified {summary.reviewCount === 1 ? 'review' : 'reviews'}
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Review History
            </Text>

            {reviewItems.length === 0 ? (
              <View
                style={[
                  styles.stateCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <MaterialCommunityIcons
                  name="message-star-outline"
                  size={42}
                  color={colors.secondaryText}
                />
                <Text style={[styles.stateTitle, { color: colors.text }]}>
                  No Reviews Yet
                </Text>
                <Text style={[styles.stateMessage, { color: colors.secondaryText }]}>
                  Verified customer reviews will appear here after completed services.
                </Text>
              </View>
            ) : (
              reviewItems.map((review) => (
                <View
                  key={review.id}
                  style={[
                    styles.reviewCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.reviewTopRow}>
                    <ReviewStars rating={review.rating} colors={colors} />
                    <Text style={[styles.reviewDate, { color: colors.secondaryText }]}>
                      {formatReviewDate(review.createdAt)}
                    </Text>
                  </View>
                  <Text style={[styles.reviewLabel, { color: colors.text }]}>
                    Customer review
                  </Text>
                  {review.comment ? (
                    <Text style={[styles.reviewComment, { color: colors.secondaryText }]}>
                      {review.comment}
                    </Text>
                  ) : (
                    <Text style={[styles.reviewComment, { color: colors.secondaryText }]}>
                      No written feedback provided.
                    </Text>
                  )}
                </View>
              ))
            )}

            {loadMoreError ? (
              <Text style={[styles.paginationError, { color: colors.danger }]}>
                {loadMoreError}
              </Text>
            ) : null}

            {canLoadMore && (
              <TouchableOpacity
                accessibilityRole="button"
                disabled={isLoading || isLoadingMore}
                onPress={loadMore}
                style={[styles.loadMoreButton, { borderColor: colors.border }]}
              >
                {isLoadingMore ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <Text style={[styles.loadMoreText, { color: colors.text }]}>
                    Load More Reviews
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </StableScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
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
  headerTitle: { fontSize: 17, fontWeight: '700' },
  title: { marginTop: 14, fontSize: 24, fontWeight: '800' },
  subtitle: { marginTop: 6, marginBottom: 18, fontSize: 12, lineHeight: 18 },
  stateContainer: { paddingVertical: 62, alignItems: 'center' },
  stateCard: {
    padding: 22,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  stateTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateMessage: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
  actionButton: {
    minHeight: 42,
    marginTop: 18,
    paddingHorizontal: 25,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: { color: '#000000', fontSize: 12, fontWeight: '800' },
  summaryCard: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
  },
  summaryRating: { fontSize: 28, fontWeight: '800' },
  summaryCount: { marginTop: 9, fontSize: 11 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  sectionTitle: { marginTop: 22, marginBottom: 10, fontSize: 15, fontWeight: '700' },
  reviewCard: { padding: 16, borderWidth: 1, borderRadius: 14, marginBottom: 10 },
  reviewTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewDate: { fontSize: 10 },
  reviewLabel: { marginTop: 10, fontSize: 12, fontWeight: '700' },
  reviewComment: { marginTop: 6, fontSize: 12, lineHeight: 19 },
  paginationError: { marginTop: 8, marginBottom: 12, fontSize: 11, textAlign: 'center' },
  loadMoreButton: {
    minHeight: 46,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: { fontSize: 12, fontWeight: '700' },
})
