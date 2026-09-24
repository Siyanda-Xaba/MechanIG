import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
export default function VehicleHealthRing({ score, size = 78, strokeWidth = 7, }) {
    const { colors } = useTheme();
    const safeScore = score == null
        ? 0
        : Math.min(Math.max(score, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference -
        (safeScore / 100) * circumference;
    return (_jsxs(View, { style: [
            styles.container,
            {
                width: size,
                height: size,
            },
        ], children: [_jsxs(Svg, { width: size, height: size, style: styles.svg, children: [_jsx(Circle, { cx: size / 2, cy: size / 2, r: radius, stroke: colors.border, strokeWidth: strokeWidth, fill: "none" }), _jsx(Circle, { cx: size / 2, cy: size / 2, r: radius, stroke: colors.accent, strokeWidth: strokeWidth, fill: "none", strokeLinecap: "round", strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: progressOffset, rotation: "-90", origin: `${size / 2}, ${size / 2}` })] }), _jsx(View, { style: styles.scoreContainer, children: _jsx(Text, { style: [
                        styles.score,
                        {
                            color: colors.text,
                        },
                    ], children: score != null ? `${score}%` : '--' }) })] }));
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        position: 'absolute',
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    score: {
        fontSize: 20,
        fontWeight: '800',
    },
});
