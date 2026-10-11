const NOTIFICATION_REQUEST_TIMEOUT_MS = 15000;

/**
 * Mark a notification as read through the MechanIQ backend.
 *
 * The backend must:
 * - Authenticate the Firebase ID token.
 * - Verify the notification belongs to the signed-in user.
 * - Persist the read state.
 * - Return HTTP 204, or a confirmed read-state response.
 *
 * @param {string} notificationId
 * @param {{
 *   getIdToken?: () => Promise<string>,
 *   apiBaseUrl?: string
 * }} [options]
 * @returns {Promise<boolean>}
 */
export async function markNotificationAsRead(
    notificationId,
    options = {}
) {
    const {
        getIdToken,
        apiBaseUrl,
    } = options;

    const id =
        typeof notificationId === 'string'
            ? notificationId.trim()
            : '';

    if (!id) {
        throw new Error(
            'A valid notification ID is required.'
        );
    }

    const baseUrl = String(
        apiBaseUrl ??
        process.env.EXPO_PUBLIC_NOTIFICATIONS_API_URL ??
        ''
    )
        .trim()
        .replace(/\/+$/, '');

    if (!baseUrl) {
        throw new Error(
            'Notification read updates are unavailable until the MechanIQ backend is connected.'
        );
    }

    if (typeof getIdToken !== 'function') {
        throw new Error(
            'Authentication is required to update notifications.'
        );
    }

    const token = await getIdToken();

    if (!token) {
        throw new Error(
            'Your session could not be verified.'
        );
    }

    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        NOTIFICATION_REQUEST_TIMEOUT_MS
    );

    try {
        const response = await fetch(
            `${baseUrl}/notifications/${encodeURIComponent(id)}/read`,
            {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
            }
        );

        if (!response.ok) {
            if (
                response.status === 401 ||
                response.status === 403
            ) {
                throw new Error(
                    'You are not authorized to update this notification.'
                );
            }

            if (response.status === 404) {
                throw new Error(
                    'This notification could not be found.'
                );
            }

            throw new Error(
                'Unable to mark the notification as read.'
            );
        }

        if (response.status === 204) {
            return true;
        }

        const result = await response
            .json()
            .catch(() => null);

        const confirmedRead =
            result?.isRead === true ||
            result?.notification?.isRead === true;

        if (!confirmedRead) {
            throw new Error(
                'The backend did not confirm the notification read state.'
            );
        }

        return true;
    } catch (error) {
        if (error?.name === 'AbortError') {
            throw new Error(
                'The notification update timed out. Please try again.'
            );
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}