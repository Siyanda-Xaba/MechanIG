import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function CommonSymptomsGrid({ symptoms, onSymptomPress, }) {
    const { colors } = useTheme();
    return (_jsxs(View, { style: styles.section, children: [_jsx(Text, { style: [
                    styles.sectionTitle,
                    {
                        color: colors.text,
                    },
                ], children: "Common Symptoms" }), _jsx(View, { style: styles.grid, children: symptoms.map((symptom) => (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => onSymptomPress(symptom), style: [
                        styles.card,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: symptom.icon, size: 24, color: colors.accent }), _jsx(Text, { style: [
                                styles.label,
                                {
                                    color: colors.text,
                                },
                            ], children: symptom.label })] }, symptom.id))) })] }));
}
const styles = StyleSheet.create({
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        marginBottom: 12,
        fontSize: 17,
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 10,
    },
    card: {
        width: '31.5%',
        minHeight: 82,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginTop: 7,
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
});
