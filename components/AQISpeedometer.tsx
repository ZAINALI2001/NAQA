import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { interpolate } from 'react-native-reanimated';

interface Props {
    value: number;      // AQI
    max: number;        // max AQI
    label: string;
    color: string;
}

const AQISpeedometer: React.FC<Props> = ({ value, max, label, color }) => {
    const size = 200;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const angle = Math.PI * (value / max); // radians (0 to π)

    const getArcPath = (angle: number) => {
        const startX = center - radius;
        const startY = center;
        const endX = center + radius * Math.cos(angle);
        const endY = center - radius * Math.sin(angle);
        const largeArcFlag = angle > Math.PI / 2 ? 1 : 0;

        return `M ${startX} ${startY}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    };

    return (
        <View style={styles.wrapper}>
            <Svg width={size} height={size / 1.5}>
                <G rotation="-90" origin={`${center}, ${center}`}>
                    <Path
                        d={getArcPath(Math.PI)}
                        stroke="#eee"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Path
                        d={getArcPath(angle)}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                </G>
                <SvgText
                    x={center}
                    y={size / 2.5}
                    fill={color}
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                >
                    {label}
                </SvgText>
                <SvgText
                    x={center}
                    y={size / 2.1}
                    fill="#333"
                    fontSize="14"
                    textAnchor="middle"
                >
                    AQI: {value}
                </SvgText>
            </Svg>
        </View>
    );
};

export default AQISpeedometer;

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginVertical: 10,
    },
});
