import { get, ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebase';

export async function getCustomerNotifications(userId) {
    const user = auth.currentUser;
    if (!user || user.uid !== userId) throw new Error('Sign in to the matching account to view notifications.');
    const snapshot = await get(ref(database, `notifications/${user.uid}`));
    let readReceipts = {};
    try {
        const readSnapshot = await get(ref(database, `notificationReads/${user.uid}`));
        readReceipts = readSnapshot.val() || {};
    } catch {
        // Show server notification state if receipt rules are not yet published.
    }
    const notifications = Object.entries(snapshot.val() || {})
        .map(([id, notification]) => ({ id, ...notification, isRead: notification.isRead === true || Boolean(readReceipts[id]?.readAt) }))
        .filter((item) => typeof item.title === 'string' && typeof item.message === 'string')
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    return {
        unreadCount: notifications.filter((item) => item.isRead !== true).length,
        notifications,
    };
}

export async function markCustomerNotificationRead(userId, notificationId) {
    const user = auth.currentUser;
    if (!user || user.uid !== userId) throw new Error('Sign in to the matching account to update notifications.');
    if (typeof notificationId !== 'string' || !notificationId.trim()) throw new Error('A notification ID is required.');
    const notificationRef = ref(database, `notifications/${user.uid}/${notificationId}`);
    const snapshot = await get(notificationRef);
    if (!snapshot.exists()) throw new Error('Notification not found.');
    await set(ref(database, `notificationReads/${user.uid}/${notificationId}`), {
        ownerUid: user.uid,
        readAt: new Date().toISOString(),
    });
    return { id: notificationId, isRead: true };
}
