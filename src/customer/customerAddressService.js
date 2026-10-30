import { get, push, ref, runTransaction } from 'firebase/database';
import { auth, database } from '../firebase/firebase';

function requireAddressOwner(customerId) {
    const user = auth.currentUser;
    if (!user || user.uid !== customerId) {
        throw new Error('Sign in to the matching customer account to manage saved addresses.');
    }
    return user;
}

export async function getCustomerSavedAddresses(customerId) {
    const user = requireAddressOwner(customerId);
    const snapshot = await get(ref(database, `users/${user.uid}/savedAddresses`));
    return Object.entries(snapshot.val() || {})
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function createCustomerSavedAddress(input) {
    const user = requireAddressOwner(input?.customerId);
    const label = typeof input.label === 'string' ? input.label.trim().slice(0, 60) : '';
    const address = typeof input.address === 'string' ? input.address.trim().slice(0, 300) : '';
    if (!label || !address) throw new Error('Enter an address label and address before saving.');

    const addressesRef = ref(database, `users/${user.uid}/savedAddresses`);
    const addressRef = push(addressesRef);
    const id = addressRef.key;
    if (!id) throw new Error('Unable to create the address record. Please try again.');
    const now = new Date().toISOString();
    const record = { ownerUid: user.uid, label, address, isDefault: input.isDefault === true, createdAt: now, updatedAt: now };

    if (record.isDefault) {
        const result = await runTransaction(addressesRef, (current) => {
            const addresses = current && typeof current === 'object' ? { ...current } : {};
            for (const [savedId, saved] of Object.entries(addresses)) addresses[savedId] = { ...saved, isDefault: false };
            addresses[id] = record;
            return addresses;
        }, { applyLocally: false });
        if (!result.committed) throw new Error('Unable to save this default address. Please try again.');
    } else {
        const result = await runTransaction(addressRef, (current) => current === null ? record : undefined, { applyLocally: false });
        if (!result.committed) throw new Error('Unable to save this address. Please try again.');
    }

    if (auth.currentUser?.uid !== user.uid) throw new Error('Your account changed while saving this address.');
    return { id, ...record };
}
