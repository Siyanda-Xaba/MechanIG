import { get, ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebase';

const ALLOWED_CATEGORIES = new Set(['diagnostics', 'service', 'fuel', 'marketplace', 'account']);

function requirePreferenceOwner(customerId) {
    const user = auth.currentUser;
    if (!user || user.uid !== customerId) throw new Error('Sign in to the matching account to manage notification preferences.');
    return user;
}

export async function getCustomerNotificationPreferences(customerId) {
    const user = requirePreferenceOwner(customerId);
    const snapshot = await get(ref(database, `users/${user.uid}/notificationPreferences`));
    const saved = snapshot.val();
    const storedPreferences = saved?.categoryPreferences;
    const categories = Array.isArray(storedPreferences)
        ? storedPreferences
        : Object.entries(storedPreferences || {}).map(([category, value]) => ({ category, ...value }));
    return {
        customerId: user.uid,
        categoryPreferences: categories.filter((item) => ALLOWED_CATEGORIES.has(item?.category)).map((item) => ({
            category: item.category,
            pushEnabled: item.pushEnabled === true,
            emailEnabled: item.emailEnabled === true,
        })),
        updatedAt: saved?.updatedAt || null,
    };
}

export async function updateCustomerNotificationPreferences(input) {
    const user = requirePreferenceOwner(input?.customerId);
    if (!Array.isArray(input.categoryPreferences)) throw new Error('Notification preferences are invalid.');
    const categoryPreferences = input.categoryPreferences.map((item) => {
        if (!ALLOWED_CATEGORIES.has(item?.category) || typeof item.pushEnabled !== 'boolean' || typeof item.emailEnabled !== 'boolean') {
            throw new Error('Notification preferences are invalid.');
        }
        return { category: item.category, pushEnabled: item.pushEnabled, emailEnabled: item.emailEnabled };
    });
    if (new Set(categoryPreferences.map((item) => item.category)).size !== categoryPreferences.length) {
        throw new Error('Notification categories must be unique.');
    }
    // Store preferences keyed by category so Firebase rules can validate each
    // supported setting and partial preference sets remain valid.
    const storedCategoryPreferences = Object.fromEntries(categoryPreferences.map(({ category, pushEnabled, emailEnabled }) => [
        category,
        { pushEnabled, emailEnabled },
    ]));
    const saved = { ownerUid: user.uid, categoryPreferences: storedCategoryPreferences, updatedAt: new Date().toISOString() };
    await set(ref(database, `users/${user.uid}/notificationPreferences`), saved);
    if (auth.currentUser?.uid !== user.uid) throw new Error('Your account changed while saving preferences.');
    return { customerId: user.uid, ownerUid: user.uid, categoryPreferences, updatedAt: saved.updatedAt };
}
