import {
    jsx as _jsx,
    jsxs as _jsxs,
} from 'react/jsx-runtime';

import {
    Ionicons,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RoleRouteGuard } from '../../src/auth/RoleRouteGuard';

import { CustomerDiagnosticsProvider } from '../../src/customer/CustomerDiagnosticsContext';
import { CustomerFuelProvider } from '../../src/customer/CustomerFuelContext';
import { CustomerHomeProvider } from '../../src/customer/CustomerHomeContext';
import { CustomerMarketplaceProvider } from '../../src/customer/CustomerMarketplaceContext';
import { CustomerProfileProvider } from '../../src/customer/CustomerProfileContext';

import { useTheme } from '../../src/theme/ThemeContext';

export default function CustomerLayout() {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const tabs = _jsxs(Tabs, {
        screenOptions: {
            headerShown: false,

            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.secondaryText,

            tabBarStyle: {
                position: 'absolute',

                left: 16,
                right: 16,

                bottom: Math.max(
                    insets.bottom - 10,
                    2
                ),

                height: 68,

                backgroundColor: colors.card,

                borderWidth: 1,
                borderTopWidth: 1,
                borderColor: colors.border,

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
        },

        children: [
            _jsx(Tabs.Screen, {
                name: 'index',
                options: {
                    title: 'Home',
                    tabBarIcon: ({ color }) =>
                        _jsx(Ionicons, {
                            name: 'home-outline',
                            size: 24,
                            color,
                        }),
                },
            }),

            _jsx(Tabs.Screen, {
                name: 'diagnostics',
                options: {
                    title: 'Diagnostics',
                    tabBarIcon: ({ color }) =>
                        _jsx(MaterialCommunityIcons, {
                            name: 'engine-outline',
                            size: 25,
                            color,
                        }),
                },
            }),

            _jsx(Tabs.Screen, {
                name: 'fuel',
                options: {
                    title: 'Fuel',
                    tabBarIcon: ({ color }) =>
                        _jsx(MaterialCommunityIcons, {
                            name: 'gas-station-outline',
                            size: 25,
                            color,
                        }),
                },
            }),

            _jsx(Tabs.Screen, {
                name: 'marketplace',
                options: {
                    title: 'Marketplace',
                    tabBarIcon: ({ color }) =>
                        _jsx(Ionicons, {
                            name: 'storefront-outline',
                            size: 24,
                            color,
                        }),
                },
            }),

            _jsx(Tabs.Screen, {
                name: 'profile',
                options: {
                    title: 'Profile',
                    tabBarIcon: ({ color }) =>
                        _jsx(Ionicons, {
                            name: 'person-outline',
                            size: 25,
                            color,
                        }),
                },
            }),
        ],
    });

    return _jsx(RoleRouteGuard, {
        role: 'customer',

        children: _jsx(CustomerHomeProvider, {
            children: _jsx(CustomerDiagnosticsProvider, {
                children: _jsx(CustomerFuelProvider, {
                    children: _jsx(CustomerMarketplaceProvider, {
                        children: _jsx(CustomerProfileProvider, {
                            children: tabs,
                        }),
                    }),
                }),
            }),
        }),
    });
}