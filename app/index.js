import { jsx as _jsx } from 'react/jsx-runtime';

import { Redirect } from 'expo-router';

import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';

import { auth } from '../src/firebase/firebase';

import { useTheme } from '../src/theme/ThemeContext';

import { useUser } from '../src/users/UserContext';

export default function Index() {
    const { user, isLoadingUser } = useUser();

    const { colors } = useTheme();

    /*
     * Wait until Firebase restores its session
     * and UserContext finishes checking the
     * authenticated account.
     *
     * This prevents premature navigation to
     * Login or the wrong dashboard.
     */
    if (isLoadingUser) {
        return _jsx(View, {
            style: [
                styles.loadingContainer,
                {
                    backgroundColor: colors.background,
                },
            ],
            children: _jsx(ActivityIndicator, {
                size: 'large',
                color: colors.accent,
            }),
        });
    }

    /*
     * Dashboard access requires:
     *
     * 1. An active Firebase session.
     * 2. A verified email address.
     * 3. A user profile matching the Firebase UID.
     * 4. A profile recognized as verified.
     *
     * The backend must independently enforce
     * authorization for protected operations.
     */
    const firebaseUser = auth.currentUser;

    const canAccessDashboard =
        !!firebaseUser &&
        firebaseUser.emailVerified === true &&
        !!user &&
        user.id === firebaseUser.uid &&
        user.emailVerified === true;

    /*
     * Signed-out users and accounts that have
     * not completed email verification must
     * use the Login screen.
     */
    if (!canAccessDashboard) {
        return _jsx(Redirect, {
            href: '/auth/login',
        });
    }

    /*
     * Route authenticated users according
     * to their verified MechanIQ account role.
     */
    if (user.role === 'customer') {
        return _jsx(Redirect, {
            href: '/(customer)',
        });
    }

    if (user.role === 'mechanic') {
        return _jsx(Redirect, {
            href: '/(mechanic)',
        });
    }

    /*
     * An unknown role must never be
     * assigned a dashboard automatically.
     */
    return _jsx(Redirect, {
        href: '/auth/login',
    });
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});