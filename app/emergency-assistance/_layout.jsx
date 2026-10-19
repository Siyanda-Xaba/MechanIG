import { Redirect, Slot } from 'expo-router';
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';

import { auth } from '../../src/firebase/firebase';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';

/**
 * MechanIQ Emergency Assistance Route Guard
 *
 * Emergency Assistance is available exclusively
 * to registered MechanIQ Customers.
 *
 * A previously verified Customer may access
 * offline functionality using an existing
 * authenticated Firebase session and cached profile.
 *
 * Cached profile information does not authorize
 * backend operations.
 */
export default function EmergencyAssistanceLayout() {
    const { user, isLoadingUser } = useUser();
    const { colors } = useTheme();

    if (isLoadingUser) {
        return (
            <View
                style={[
                    styles.loadingContainer,
                    {
                        backgroundColor: colors.background,
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

    const hasVerifiedAccount =
        !!firebaseUser &&
        firebaseUser.emailVerified === true &&
        !!user &&
        user.id === firebaseUser.uid &&
        user.emailVerified === true;

    if (!hasVerifiedAccount) {
        return <Redirect href="/auth/login" />;
    }

    if (user.role === 'mechanic') {
        return <Redirect href="/(mechanic)" />;
    }

    if (user.role !== 'customer') {
        return <Redirect href="/auth/login" />;
    }

    return <Slot />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});