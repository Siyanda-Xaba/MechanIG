import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState, } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, } from 'react-native';
import { useUser } from '../users/UserContext';
import { useTheme } from '../theme/ThemeContext';
import ThemeLogo from '../components/ThemeLogo';
const { width } = Dimensions.get('window');
const LOGO_WIDTH = Math.min(width * 0.82, 380);
function LoadingDots({ activeIndex, colors }) {
    return (_jsx(View, { style: styles.dotsRow, children: [0, 1, 2].map((index) => (_jsx(View, { style: [
                styles.dot,
                {
                    backgroundColor: index === activeIndex
                        ? colors.accent
                        : colors.border,
                },
            ] }, index))) }));
}
export default function SplashScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, isLoadingUser } = useUser();
    const fadeIn = useRef(new Animated.Value(0)).current;
    const [activeDot, setActiveDot,] = useState(0);
    useEffect(() => {
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
        const interval = setInterval(() => {
            setActiveDot((previous) => (previous + 1) % 3);
        }, 550);
        const timeout = setTimeout(() => {
            if (!isLoadingUser) {
                if (!user) {
                    router.replace('/auth/login');
                } else if (user.role === 'superadmin') {
                    router.replace('/(superadmin)');
                } else {
                    const email = (user.email || '').toLowerCase();
                    const isMechanic =
                        user.role === 'mechanic' ||
                        email.includes('@mechanic') ||
                        email.endsWith('mechanic') ||
                        email.includes('mechanic@');
                    router.replace(isMechanic ? '/(mechanic)' : '/(customer)');
                }
            }
        }, 1200);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [fadeIn, isLoadingUser, router, user]);
    return (_jsxs(View, { style: [styles.container, { backgroundColor: colors.background }], children: [_jsxs(View, { style: StyleSheet.absoluteFill, pointerEvents: "none", children: [_jsx(LinearGradient, { colors: [
                            colors.background,
                            colors.background,
                            colors.background,
                        ], style: StyleSheet.absoluteFill }), _jsx(LinearGradient, { colors: [
                            colors.accentWash,
                            'rgba(0, 239, 253, 0)',
                        ], start: {
                            x: 0.9,
                            y: 0.25,
                        }, end: {
                            x: 0.3,
                            y: 0.6,
            }, style: StyleSheet.absoluteFill })] }), _jsx(Animated.View, { style: [
                    styles.content,
                    {
                        opacity: fadeIn,
                    },
                ], children: _jsx(ThemeLogo, { style: styles.logo }) }), _jsxs(View, { style: styles.footer, children: [_jsx(LoadingDots, { activeIndex: activeDot, colors }), _jsx(Text, { style: [styles.loadingText, { color: colors.secondaryText }], children: "Loading..." })] })] }));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        width: LOGO_WIDTH,
        height: LOGO_WIDTH * 0.62,
    },
    footer: {
        position: 'absolute',
        bottom: 70,
        alignItems: 'center',
    },
    dotsRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    dot: {
        width: 22,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 4,
    },
    loadingText: {
        fontSize: 13,
        letterSpacing: 1,
    },
});
