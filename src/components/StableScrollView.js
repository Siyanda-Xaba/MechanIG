import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, } from 'react';
import { ScrollView, } from 'react-native';
const StableScrollView = forwardRef(function StableScrollView({ children, ...props }, ref) {
    return (_jsx(ScrollView, { ref: ref, bounces: false, alwaysBounceVertical: false, overScrollMode: "never", ...props, children: children }));
});
export default StableScrollView;
