import { jsx as _jsx } from "react/jsx-runtime";
import { Stack } from 'expo-router';
import { MechanicSignUpProvider } from '../../../src/auth/mechanic/MechanicSignUpContext';
export default function MechanicSignUpLayout() {
    return (_jsx(MechanicSignUpProvider, { children: _jsx(Stack, { screenOptions: {
                headerShown: false,
                contentStyle: {
                    backgroundColor: '#000000',
                },
            } }) }));
}
