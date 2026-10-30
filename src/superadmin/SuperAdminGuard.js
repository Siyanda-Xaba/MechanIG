import { onIdTokenChanged } from 'firebase/auth';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth } from '../firebase/firebase';
import { useTheme } from '../theme/ThemeContext';
import { useUser } from '../users/UserContext';

export default function SuperAdminGuard({ children }) {
    const { colors } = useTheme();
    const { user, isLoadingUser } = useUser();
    const [access, setAccess] = useState('checking');

    useEffect(() => {
        let active = true;
        let revision = 0;
        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
            const currentRevision = ++revision;
            if (!firebaseUser) {
                if (active) setAccess('signed-out');
                return;
            }
            try {
                const token = await firebaseUser.getIdTokenResult();
                if (active && currentRevision === revision) {
                    setAccess(token.claims?.role === 'superadmin' ? 'allowed' : 'denied');
                }
            } catch {
                if (active && currentRevision === revision) setAccess('denied');
            }
        });
        return () => {
            active = false;
            unsubscribe();
        };
    }, []);

    if (access === 'checking' || (access === 'denied' && isLoadingUser)) {
        return (
            <View style={[styles.loading, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }
    if (access === 'signed-out' || !auth.currentUser) return <Redirect href="/auth/login" />;
    if (access !== 'allowed') {
        return <Redirect href={user?.role === 'mechanic' ? '/(mechanic)' : '/(customer)'} />;
    }
    return children;
}

const styles = StyleSheet.create({
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
