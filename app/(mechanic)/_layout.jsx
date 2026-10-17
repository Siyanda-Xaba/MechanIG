import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { RoleRouteGuard } from '../../src/auth/RoleRouteGuard'
import { MechanicCustomersProvider } from '../../src/mechanic/MechanicCustomersContext'
import { MechanicDiagnosticsProvider } from '../../src/mechanic/MechanicDiagnosticsContext'
import { MechanicHomeProvider } from '../../src/mechanic/MechanicHomeContext'
import { MechanicJobsProvider } from '../../src/mechanic/MechanicJobsContext'
import { MechanicProfileProvider } from '../../src/mechanic/MechanicProfileContext'
import OfflineStatusBanner from '../../src/offline/OfflineStatusBanner'
import { useTheme } from '../../src/theme/ThemeContext'

export default function MechanicLayout() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <RoleRouteGuard role="mechanic">
      <MechanicHomeProvider>
        <MechanicJobsProvider>
          <MechanicDiagnosticsProvider>
            <MechanicCustomersProvider>
              <MechanicProfileProvider>
                <View style={{ flex: 1 }}>
                  <Tabs
                    screenOptions={{
                      headerShown: false,

                      tabBarActiveTintColor:
                        colors.accent,
                      tabBarInactiveTintColor:
                        colors.secondaryText,

                      tabBarStyle: {
                        position: 'absolute',

                        left: 16,
                        right: 16,
                        bottom: Math.max(
                          insets.bottom - 10,
                          2
                        ),

                        height: 68,

                        backgroundColor:
                          colors.card,

                        borderWidth: 1,
                        borderTopWidth: 1,
                        borderColor:
                          colors.border,

                        borderRadius: 18,

                        paddingTop: 7,
                        paddingBottom: 7,

                        marginHorizontal: 16,
                      },

                      tabBarItemStyle: {
                        flex: 1,
                        paddingVertical: 2,
                      },

                      tabBarLabelStyle: {
                        fontSize: 9.5,
                        fontWeight: '500',
                        marginTop: 2,
                      },

                      tabBarIconStyle: {
                        marginTop: 1,
                      },
                    }}
                  >
                    <Tabs.Screen
                      name="index"
                      options={{
                        title: 'Home',
                        tabBarIcon: ({
                          color,
                        }) => (
                          <Ionicons
                            name="home-outline"
                            size={24}
                            color={color}
                          />
                        ),
                      }}
                    />

                    <Tabs.Screen
                      name="jobs"
                      options={{
                        title: 'Jobs',
                        tabBarIcon: ({
                          color,
                        }) => (
                          <MaterialCommunityIcons
                            name="briefcase-outline"
                            size={25}
                            color={color}
                          />
                        ),
                      }}
                    />

                    <Tabs.Screen
                      name="diagnostics"
                      options={{
                        title: 'Diagnostics',
                        tabBarIcon: ({
                          color,
                        }) => (
                          <MaterialCommunityIcons
                            name="engine-outline"
                            size={25}
                            color={color}
                          />
                        ),
                      }}
                    />

                    <Tabs.Screen
                      name="customers"
                      options={{
                        title: 'Customers',
                        tabBarIcon: ({
                          color,
                        }) => (
                          <MaterialCommunityIcons
                            name="account-group-outline"
                            size={25}
                            color={color}
                          />
                        ),
                      }}
                    />

                    <Tabs.Screen
                      name="profile"
                      options={{
                        title: 'Profile',
                        tabBarIcon: ({
                          color,
                        }) => (
                          <Ionicons
                            name="person-outline"
                            size={25}
                            color={color}
                          />
                        ),
                      }}
                    />
                  </Tabs>

                  <OfflineStatusBanner />
                </View>
              </MechanicProfileProvider>
            </MechanicCustomersProvider>
          </MechanicDiagnosticsProvider>
        </MechanicJobsProvider>
      </MechanicHomeProvider>
    </RoleRouteGuard>
  )
}