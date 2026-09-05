import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CustomerDiagnosticsProvider } from '../../src/customer/CustomerDiagnosticsContext'
import { CustomerFuelProvider } from '../../src/customer/CustomerFuelContext'
import { CustomerHomeProvider } from '../../src/customer/CustomerHomeContext'
import { CustomerMarketplaceProvider } from '../../src/customer/CustomerMarketplaceContext'
import { CustomerProfileProvider } from '../../src/customer/CustomerProfileContext'
import { useTheme } from '../../src/theme/ThemeContext'

export default function CustomerLayout() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <CustomerHomeProvider>
      <CustomerDiagnosticsProvider>
        <CustomerFuelProvider>
          <CustomerMarketplaceProvider>
            <CustomerProfileProvider>
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
                  name="fuel"
                  options={{
                    title: 'Fuel',
                    tabBarIcon: ({
                      color,
                    }) => (
                      <MaterialCommunityIcons
                        name="gas-station-outline"
                        size={25}
                        color={color}
                      />
                    ),
                  }}
                />

                <Tabs.Screen
                  name="marketplace"
                  options={{
                    title: 'Marketplace',
                    tabBarIcon: ({
                      color,
                    }) => (
                      <Ionicons
                        name="storefront-outline"
                        size={24}
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
            </CustomerProfileProvider>
          </CustomerMarketplaceProvider>
        </CustomerFuelProvider>
      </CustomerDiagnosticsProvider>
    </CustomerHomeProvider>
  )
}