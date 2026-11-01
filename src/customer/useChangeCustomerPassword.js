import { useCallback, useState, } from 'react';
import { changeCustomerPassword, } from './customerSecurityService';
export function useChangeCustomerPassword() {
    const [isChangingPassword, setIsChangingPassword,] = useState(false);
    const [changePasswordError, setChangePasswordError,] = useState(null);
    const changePassword = useCallback(async (input) => {
        try {
            setIsChangingPassword(true);
            setChangePasswordError(null);
            await changeCustomerPassword(input);
            return true;
        }
        catch (error) {
            setChangePasswordError(error instanceof Error
                ? error.message
                : 'Unable to change your password.');
            return false;
        }
        finally {
            setIsChangingPassword(false);
        }
    }, []);
    const clearChangePasswordError = useCallback(() => {
        setChangePasswordError(null);
    }, []);
    return {
        isChangingPassword,
        changePasswordError,
        changePassword,
        clearChangePasswordError,
    };
}
