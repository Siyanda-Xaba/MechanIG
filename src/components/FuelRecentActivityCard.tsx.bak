import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { FuelActivity } from '../customer/fuelTypes'
import { useTheme } from '../theme/ThemeContext'

type FuelRecentActivityCardProps = {
  activities: FuelActivity[]
  onActivityPress: (activity: FuelActivity) => void
  onViewAllPress: () => void
}

export default function FuelRecentActivityCard({
  activities,
  onActivityPress,
  onViewAllPress,
}: FuelRecentActivityCardProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
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
              No fuel activity yet
            </Text>
          </View>
        ) : (
          activities.map((activity, index) => {
            const isCompleted =
              activity.status.toLowerCase() ===
              'completed'

            const statusColor = isCompleted
              ? colors.success
              : colors.accent

            return (
              <TouchableOpacity
                key={activity.id}
                activeOpacity={0.7}
                onPress={() =>
                  onActivityPress(activity)
                }
                style={[
                  styles.row,
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
                      borderColor: statusColor,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      isCompleted
                        ? 'truck-check-outline'
                        : 'calendar-clock-outline'
                    }
                    size={21}
                    color={statusColor}
                  />
                </View>

                <View style={styles.content}>
                  <Text
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
                    style={[
                      styles.description,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {activity.description}
                  </Text>

                  <Text
                    style={[
                      styles.time,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {activity.occurredAt}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    {
                      borderColor: statusColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: statusColor,
                      },
                    ]}
                  >
                    {activity.status}
                  </Text>
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
    marginTop: 20,
  },

  header: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
  },

  viewAll: {
    fontSize: 11,
    fontWeight: '600',
  },

  card: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  row: {
    minHeight: 78,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  activityTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  description: {
    marginTop: 3,
    fontSize: 9,
  },

  time: {
    marginTop: 4,
    fontSize: 8,
  },

  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 8,
    fontWeight: '700',
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