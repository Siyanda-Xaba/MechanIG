import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export async function getCustomerSecuritySettings(customerId) {
    // Production implementation will retrieve the
    // authenticated customer's security state from the
    // shared MechanIQ auth/backend layer.
    //
    // Values such as active sessions and password-change
    // timestamps must come from authoritative auth data.
    //
    // Biometric sign-in will also require a supported
    // secure device authentication package and secure
    // credential/session storage.
    //
    // Do not fabricate security state locally.
    return {
        customerId,
        biometricSignInEnabled: null,
        activeSessionCount: null,
        lastPasswordChangedAt: null,
    };
}
export async function changeCustomerPassword(input) {
    const user = auth.currentUser;
    if (!user || user.uid !== input.customerId || !user.email) {
        throw new Error('Sign in again before changing this password.');
    }
    if (typeof input.newPassword !== 'string' || input.newPassword.length < 8) {
        throw new Error('Choose a password with at least 8 characters.');
    }
    const credential = EmailAuthProvider.credential(user.email, input.currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, input.newPassword);
}
export async function updateCustomerBiometricPreference(input) {
    // Production implementation will require:
    // - supported biometric/device authentication
    // - secure credential or token storage
    // - shared auth/session integration
    //
    // Do not treat a local switch as enabled biometric
    // authentication without those capabilities.
    void input;
    throw new Error('Biometric sign-in is not available until secure device authentication is connected.');
}

