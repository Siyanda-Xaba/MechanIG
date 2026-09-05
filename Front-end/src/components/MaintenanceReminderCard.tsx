import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { MaintenanceReminder } from '../customer/homeTypes'
import { useTheme } from '../theme/ThemeContext'

type MaintenanceReminderCardProps = {
  reminder?: MaintenanceReminder | null
  onPress: () => void
}

export default function MaintenanceReminderCard({
  reminder,
  onPress,
}: MaintenanceReminderCardProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Maintenance Reminders
        </Text>

        <Ionicons
          name="notifications-outline"
          size={20}
          color={colors.accent}
        />
      </View>

      {reminder ? (
        <View style={styles.reminderContent}>
          <View
            style={[
              styles.iconContainer,
              {
                borderColor: colors.accent,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="oil"
              size={24}
              color={colors.accent}
            />
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.reminderTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {reminder.title}
            </Text>

            <Text
              style={[
                styles.description,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              {reminder.description}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.secondaryText}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            No maintenance reminders
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 150,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
  },

  reminderContent: {
    flex: 1,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    flex: 1,
  },

  reminderTitle: {
    fontSize: 13,
    fontWeight: '700',
  },

  description: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 11,
  },
})