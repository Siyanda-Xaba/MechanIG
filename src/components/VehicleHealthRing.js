import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

export default function VehicleHealthRing({ score, size = 42, strokeWidth = 3.5 }) {
    const { colors } = useTheme();
    const safeScore = score == null ? 0 : Math.min(Math.max(score, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (safeScore / 100) * circumference;
    const center = size / 2;
    const showProgress = score != null && safeScore > 0;
    return (
        <View
            accessibilityLabel={
                score != null ? `Vehicle health ${score} percent` : 'Vehicle health not available'
            }
            style={[
                styles.container,
                {
                    height: size,
                    width: size,
                },
            ]}
        >
            <Svg height={size} style={styles.svg} width={size}>
                <Circle
                    cx={center}
                    cy={center}
                    fill="none"
                    r={radius}
                    stroke={colors.wash}
                    strokeWidth={strokeWidth}
                />
                {showProgress ? (
                    <Circle
                        cx={center}
                        cy={center}
                        fill="none"
                        r={radius}
                        stroke={colors.accent}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                        strokeWidth={strokeWidth}
                        transform={`rotate(-90 ${center} ${center})`}
                    />
                ) : null}
            </Svg>
            <View style={styles.scoreContainer}>
                <Text
                    style={[
                        styles.score,
                        {
                            color: colors.text,
                            fontSize: score != null ? Math.max(11, Math.round(size * 0.28)) : 11,
                        },
                    ]}
                >
                    {score != null ? `${score}%` : 'N/A'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    score: {
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        position: 'absolute',
    },
});
