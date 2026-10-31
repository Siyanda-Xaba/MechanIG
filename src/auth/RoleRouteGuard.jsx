import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth } from '../firebase/firebase';
import { useTheme } from '../theme/ThemeContext';
import { useUser } from '../users/UserContext';

export function RoleRouteGuard({ role, children }) {
    const { user, isLoadingUser } = useUser();
    const { colors } = useTheme();

    if (isLoadingUser) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    const firebaseUser = auth.currentUser;

    if (!firebaseUser && !user) {
        return <Redirect href="/auth/login" />;
    }

    const email = (user?.email || firebaseUser?.email || '').toLowerCase();
    const username = (user?.username || '').toLowerCase();
    const isMechanic =
        user?.role === 'mechanic' ||
        username.includes('@mechanic') ||
        username.endsWith('mechanic') ||
        email.includes('@mechanic') ||
        email.endsWith('mechanic') ||
        email.includes('mechanic@');
    const userRole = isMechanic ? 'mechanic' : 'customer';

    if (userRole !== role) {
        return <Redirect href={userRole === 'mechanic' ? '/(mechanic)' : '/(customer)'} />;
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
