import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  G,
  Path,
  Line,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface Props {
  value: number;
  max: number;
}

const AQISpeedometerGauge: React.FC<Props> = ({ value, max }) => {
  const size = 250;
  const center = size / 2;
  const radius = 100;
  const labelRadius = radius - 30; // INSIDE the arc
  const tickRadius = radius + 10; // BELOW the arc

  const segments = [
    { from: 0, to: 50, gradientId: 'grad1', label: 'Very Good' },
    { from: 51, to: 100, gradientId: 'grad2', label: 'Good' },
    { from: 101, to: 200, gradientId: 'grad3', label: 'Fair' },
    { from: 201, to: 300, gradientId: 'grad4', label: 'Poor' },
    { from: 301, to: 400, gradientId: 'grad5', label: 'Very Poor' },
    { from: 401, to: 500, gradientId: 'grad6', label: 'Hazardous' },
  ];

  const tickValues = [0, 50, 100, 200, 300, 400, 500];

  const angleForValue = (val: number) => (Math.PI * val) / max;

  const polarToCartesian = (r: number, angle: number) => {
    const x = center + r * Math.cos(angle - Math.PI);
    const y = center + r * Math.sin(angle - Math.PI);
    return { x, y };
  };

  const describeArc = (start: number, end: number) => {
    const startAngle = angleForValue(start);
    const endAngle = angleForValue(end);
    const startCoord = polarToCartesian(radius, startAngle);
    const endCoord = polarToCartesian(radius, endAngle);
    const largeArcFlag = end - start > max / 2 ? 1 : 0;

    return [
      `M ${startCoord.x} ${startCoord.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endCoord.x} ${endCoord.y}`,
    ].join(' ');
  };

  const pointerAngle = angleForValue(value);
  const needle = polarToCartesian(radius - 8, pointerAngle);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 1.5}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#A8E6CF" />
            <Stop offset="100%" stopColor="#98d6a5" />
          </LinearGradient>
          <LinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#D0EAFB" />
            <Stop offset="100%" stopColor="#b3dced" />
          </LinearGradient>
          <LinearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFACD" />
            <Stop offset="100%" stopColor="#fff3b0" />
          </LinearGradient>
          <LinearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFD6A5" />
            <Stop offset="100%" stopColor="#ffd59e" />
          </LinearGradient>
          <LinearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FF9A9E" />
            <Stop offset="100%" stopColor="#ffaaa7" />
          </LinearGradient>
          <LinearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#D8B4DC" />
            <Stop offset="100%" stopColor="#d88bcd" />
          </LinearGradient>
        </Defs>

        <G>
          {/* Arc segments */}
          {segments.map((seg, index) => (
            <Path
              key={index}
              d={describeArc(seg.from, seg.to)}
              stroke={`url(#${seg.gradientId})`}
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
            />
          ))}

          {/* Inside segment labels */}
          {segments.map((seg, index) => {
            const midVal = (seg.from + seg.to) / 2;
            const angle = angleForValue(midVal);
            const pos = polarToCartesian(labelRadius, angle);
            return (
              <SvgText
                key={`label-${index}`}
                x={pos.x}
                y={pos.y + 4}
                fill="#2A608F"
                fontSize="10"
                textAnchor="middle"
              >
                {seg.label}
              </SvgText>
            );
          })}

          {/* AQI values below arc */}
          {tickValues.map((val, index) => {
            const angle = angleForValue(val);
            const pos = polarToCartesian(tickRadius, angle);
            return (
              <SvgText
                key={`tick-${index}`}
                x={pos.x}
                y={pos.y + 10}
                fill="#2A608F"
                fontSize="10"
                textAnchor="middle"
              >
                {val}
              </SvgText>
            );
          })}

          {/* Center label */}
          <SvgText
            x={center}
            y={center - 5}
            fontSize="14"
            fill="#2A608F"
            fontWeight="bold"
            textAnchor="middle"
          >
            AIR QUALITY
          </SvgText>
          <SvgText
            x={center}
            y={center + 12}
            fontSize="13"
            fill="#2A608F"
            fontWeight="bold"
            textAnchor="middle"
          >
            INDEX (AQI)
          </SvgText>

          {/* Needle */}
          <Line
            x1={center}
            y1={center}
            x2={needle.x}
            y2={needle.y}
            stroke="#2A608F"
            strokeWidth={3}
          />
          <Circle cx={center} cy={center} r={6} fill="#2A608F" />
        </G>
      </Svg>
    </View>
  );
};

export default AQISpeedometerGauge;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
});
