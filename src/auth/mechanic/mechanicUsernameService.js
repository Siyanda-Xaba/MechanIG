import { get, ref } from 'firebase/database';
import { database } from '../../firebase/firebase';

export function sanitizeMechanicBaseName(fullName) {
    const firstName = (fullName || '').trim().split(/\s+/)[0] || 'mechanic';
    const clean = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean.length > 0 ? clean : 'mechanic';
}

export function previewMechanicUsername(fullName) {
    const base = sanitizeMechanicBaseName(fullName);
    return `${base}@mechanic`;
}

export async function generateUniqueMechanicUsername(fullName) {
    const base = sanitizeMechanicBaseName(fullName);
    const candidate = `${base}@mechanic`;

    try {
        const snapshot = await get(ref(database, `mechanic_usernames/${candidate}`));
        if (!snapshot.exists()) {
            return candidate;
        }

        // Try numbered variations: mike1@mechanic, mike2@mechanic...
        for (let i = 1; i <= 30; i++) {
            const numbered = `${base}${i}@mechanic`;
            const numSnap = await get(ref(database, `mechanic_usernames/${numbered}`));
            if (!numSnap.exists()) {
                return numbered;
            }
        }

        const randomNum = Math.floor(100 + Math.random() * 900);
        return `${base}${randomNum}@mechanic`;
    } catch {
        return candidate;
    }
}
