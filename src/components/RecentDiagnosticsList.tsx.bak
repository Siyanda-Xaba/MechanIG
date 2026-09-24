import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { DiagnosticScan } from '../customer/diagnosticsTypes'
import { useTheme } from '../theme/ThemeContext'

type RecentDiagnosticsListProps = {
  scans: DiagnosticScan[]
  onScanPress: (scan: DiagnosticScan) => void
  onViewAllPress: () => void
}

export default function RecentDiagnosticsList({
  scans,
  onScanPress,
  onViewAllPress,
}: RecentDiagnosticsListProps) {
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
          Recent Diagnostics
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
        {scans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              No diagnostic scans yet
            </Text>
          </View>
        ) : (
          scans.map((scan, index) => {
            const isWarning = scan.severity === 'warning'
            const statusColor = isWarning
              ? colors.warning
              : colors.success

            return (
              <TouchableOpacity
                key={scan.id}
                activeOpacity={0.7}
                onPress={() => onScanPress(scan)}
                style={[
                  styles.row,
                  index < scans.length - 1 && {
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
                      isWarning
                        ? 'disc'
                        : 'clipboard-check-outline'
                    }
                    size={22}
                    color={statusColor}
                  />
                </View>

                <View style={styles.content}>
                  <Text
                    style={[
                      styles.scanTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {scan.title}
                  </Text>

                  <Text
                    style={[
                      styles.description,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {scan.description}
                  </Text>

                  <Text
                    style={[
                      styles.time,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {scan.scannedAt}
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
                    {scan.status}
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
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  scanTitle: {
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
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
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