import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { RecentActivityItem } from '../customer/homeTypes'
import { useTheme } from '../theme/ThemeContext'

type RecentActivityCardProps = {
  activities: RecentActivityItem[]
  onViewAllPress: () => void
  onActivityPress: (activity: RecentActivityItem) => void
}

export default function RecentActivityCard({
  activities,
  onViewAllPress,
  onActivityPress,
}: RecentActivityCardProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Recent Activity
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onViewAllPress}
        >
          <Text
            style={[
              styles.viewAll,
              {
                color: colors.accent,
              },
            ]}
          >
            View All
          </Text>
        </TouchableOpacity>
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
        {activities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              No recent activity
            </Text>
          </View>
        ) : (
          activities.map((activity, index) => {
            const isDiagnostic =
              activity.title
                .toLowerCase()
                .includes('diagnostic')

            const isScheduled =
              activity.status
                .toLowerCase()
                .includes('scheduled')

            return (
              <TouchableOpacity
                key={activity.id}
                activeOpacity={0.7}
                onPress={() =>
                  onActivityPress(activity)
                }
                style={[
                  styles.activityRow,
                  index < activities.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      borderColor: colors.accent,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      isDiagnostic
                        ? 'check-circle-outline'
                        : 'calendar-check-outline'
                    }
                    size={21}
                    color={colors.accent}
                  />
                </View>

                <View style={styles.activityContent}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.activityTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {activity.title}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.activityDescription,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {activity.description}
                  </Text>
                </View>

                <View style={styles.activityRight}>
                  <Text
                    style={[
                      styles.activityTime,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {activity.time}
                  </Text>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        borderColor: isScheduled
                          ? colors.accent
                          : colors.success,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: isScheduled
                            ? colors.accent
                            : colors.success,
                        },
                      ]}
                    >
                      {activity.status}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>
            )
          })
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
  },

  sectionHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  viewAll: {
    fontSize: 11,
    fontWeight: '600',
  },

  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  activityRow: {
    minHeight: 72,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityContent: {
    flex: 1,
    minWidth: 0,
  },

  activityTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  activityDescription: {
    marginTop: 3,
    fontSize: 9,
  },

  activityRight: {
    alignItems: 'flex-end',
    gap: 5,
  },

  activityTime: {
    fontSize: 8,
  },

  statusPill: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 8,
    fontWeight: '600',
  },

  emptyContainer: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 11,
  },
})