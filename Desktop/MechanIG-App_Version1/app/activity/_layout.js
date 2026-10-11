import { jsx as _jsx } from "react/jsx-runtime";
import { Stack } from 'expo-router';
import { CustomerHomeProvider } from '../../src/customer/CustomerHomeContext';
export default function CustomerActivityLayout() {
    return (_jsx(CustomerHomeProvider, { children: _jsx(Stack, { screenOptions: {
                headerShown: false,
            } }) }));
}
