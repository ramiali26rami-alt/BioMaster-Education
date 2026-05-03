import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#A855F7",
];

type Particle = {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  startRotation: number;
  isCircle: boolean;
  speedFactor: number;
};

function makeParticles(count: number, width: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * (width - 12),
    color: COLORS[i % COLORS.length],
    size: 7 + Math.random() * 8,
    delay: Math.random() * 500,
    startRotation: Math.random() * 360,
    isCircle: Math.random() > 0.45,
    speedFactor: 0.8 + Math.random() * 0.5,
  }));
}

function Piece({
  particle,
  screenHeight,
}: {
  particle: Particle;
  screenHeight: number;
}) {
  const translateY = useSharedValue(-24);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(particle.startRotation);
  const scaleX = useSharedValue(1);

  const duration = 1300 * particle.speedFactor;

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(screenHeight + 50, {
        duration,
        easing: Easing.in(Easing.poly(1.4)),
      })
    );

    opacity.value = withDelay(
      particle.delay,
      withTiming(1, { duration: 120 }, () => {
        opacity.value = withDelay(
          duration - 450,
          withTiming(0, { duration: 380 })
        );
      })
    );

    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.startRotation + 1080, { duration })
    );

    scaleX.value = withDelay(
      particle.delay,
      withTiming(-1, { duration: duration / 2 }, () => {
        scaleX.value = withTiming(1, { duration: duration / 2 });
      })
    );
  }, []);

  const animated = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scaleX: scaleX.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animated,
        {
          position: "absolute",
          left: particle.x,
          top: 0,
          width: particle.size,
          height: particle.isCircle ? particle.size : particle.size * 1.7,
          backgroundColor: particle.color,
          borderRadius: particle.isCircle ? particle.size / 2 : 3,
        },
      ]}
    />
  );
}

type Props = { visible: boolean };

export default function Confetti({ visible }: Props) {
  const { width, height } = useWindowDimensions();
  const particles = useMemo(() => makeParticles(55, width), [width]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Piece key={p.id} particle={p} screenHeight={height} />
      ))}
    </View>
  );
}
