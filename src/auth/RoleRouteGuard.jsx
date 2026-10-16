import { Redirect } from 'expo-router';

import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';

import { auth } from '../firebase/firebase';

import { useTheme } from '../theme/ThemeContext';

import { useUser } from '../users/UserContext';

/**
 * Protect Customer and Mechanic routes.
 *
 * Dashboard access requires:
 * - A restored or active Firebase session.
 * - A previously verified email address.
 * - A matching authenticated user ID.
 * - The correct MechanIQ account role.
 *
 * This is frontend route protection only.
 * Backend services must independently
 * authenticate and authorize API requests.
 */
export function RoleRouteGuard({
    role,
    children,
}) {
    const {
        user,
        isLoadingUser,
    } = useUser();

    const { colors } = useTheme();

    /*
     * Wait for Firebase session restoration
     * and the UserContext profile check.
     *
     * This also supports previously verified
     * users whose permitted offline profile
     * has been restored.
     */
    if (isLoadingUser) {
        return (
            <View
                style={[
                    styles.loadingContainer,
                    {
                        backgroundColor:
                            colors.background,
                    },
                ]}
            >
                <ActivityIndicator
                    size="large"
                    color={colors.accent}
                />
            </View>
        );
    }

    const firebaseUser = auth.currentUser;

    /*
     * Require the current Firebase session,
     * context profile, and route role to
     * refer to the same verified account.
     */
    const canAccessRoute =
        !!firebaseUser &&
        firebaseUser.emailVerified === true &&
        !!user &&
        user.id === firebaseUser.uid &&
        user.emailVerified === true &&
        user.role === role;

    /*
     * Never render a protected dashboard
     * when the account fails these checks.
     */
    if (!canAccessRoute) {
        return (
            <Redirect href="/auth/login" />
        );
    }

    return children;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});