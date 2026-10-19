import { jsx as _jsx } from 'react/jsx-runtime';

import { Redirect } from 'expo-router';

import {
    useEffect,
    useState,
} from 'react';

import { auth } from '../src/firebase/firebase';

import SplashScreen from '../src/auth/SplashScreen';

import { useUser } from '../src/users/UserContext';

const MIN_SPLASH_DURATION_MS = 1200;

export default function Index() {
    const { user, isLoadingUser } = useUser();

    const [
        hasCompletedSplash,
        setHasCompletedSplash,
    ] = useState(false);

    /*
     * Always display the existing MechanIQ splash
     * screen when the root entry point mounts.
     *
     * The splash animation must remain visible
     * for at least 1.2 seconds.
     *
     * Authentication may take longer, so navigation
     * also waits for UserContext to finish loading.
     */
    useEffect(() => {
        const timeout = setTimeout(() => {
            setHasCompletedSplash(true);
        }, MIN_SPLASH_DURATION_MS);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    /*
     * Keep showing the existing branded splash
     * until both conditions have been satisfied:
     *
     * 1. Minimum splash duration has elapsed.
     * 2. Firebase account restoration is complete.
     *
     * Never redirect before authentication finishes.
     */
    if (!hasCompletedSplash || isLoadingUser) {
        return _jsx(SplashScreen, {});
    }

    /*
     * Dashboard access requires:
     *
     * 1. An active Firebase session.
     * 2. A verified email address.
     * 3. A user profile matching the Firebase UID.
     * 4. A verified MechanIQ account.
     *
     * Backend services must independently enforce
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
     * not completed verification go to Login.
     *
     * Existing Login, Sign-up, and Role Selection
     * screens remain unchanged.
     */
    if (!canAccessDashboard) {
        return _jsx(Redirect, {
            href: '/auth/login',
        });
    }

    /*
     * Route authenticated users according to
     * their verified MechanIQ account role.
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