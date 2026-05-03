import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Confetti from "@/components/Confetti";
import { useColors } from "@/hooks/useColors";
import { QUIZZES } from "@/constants/quizData";

export default function QuizResultScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { quizId, finalScore, total } = useLocalSearchParams<{
    quizId: string;
    finalScore: string;
    total: string;
  }>();

  const score = parseInt(finalScore ?? "0", 10);
  const totalQ = parseInt(total ?? "0", 10);
  const pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

  const quiz = quizId ? QUIZZES[quizId] : null;

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isExcellent = pct >= 80;
  const isGood = pct >= 60;

  const resultIcon = isExcellent ? "trophy" : isGood ? "ribbon" : "refresh-circle";
  const resultColor = isExcellent
    ? "#F59E0B"
    : isGood
    ? colors.primary
    : colors.mutedForeground;

  const resultLabel = isExcellent
    ? "ممتاز!"
    : isGood
    ? "جيد!"
    : "حاول مرة أخرى";

  const resultMessage = isExcellent
    ? "أداء رائع! استمر في التفوق."
    : isGood
    ? "أداء جيد، يمكنك التحسّن أكثر."
    : "لا تستسلم، المراجعة تُحسّن النتيجة.";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <Confetti visible={isExcellent} />

      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backBtn,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Ionicons name="arrow-forward" size={20} color={colors.foreground} />
        <Text style={[styles.backText, { color: colors.foreground }]}>
          العودة
        </Text>
      </Pressable>

      {/* Result Card */}
      <Animated.View
        style={[
          styles.resultCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Icon */}
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: `${resultColor}18` },
          ]}
        >
          <Ionicons name={resultIcon as keyof typeof Ionicons.glyphMap} size={52} color={resultColor} />
        </View>

        <Text style={[styles.resultLabel, { color: resultColor }]}>
          {resultLabel}
        </Text>

        {quiz && (
          <Text style={[styles.quizTitle, { color: colors.mutedForeground }]}>
            {quiz.titleAr}
          </Text>
        )}

        {/* Score Circle */}
        <View style={styles.scoreRow}>
          <View
            style={[
              styles.scoreBig,
              { backgroundColor: `${resultColor}12`, borderColor: `${resultColor}40` },
            ]}
          >
            <Text style={[styles.scorePct, { color: resultColor }]}>{pct}%</Text>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>
              النتيجة
            </Text>
          </View>

          <View style={styles.statsCol}>
            <View
              style={[
                styles.statItem,
                { backgroundColor: "#F0FDF4", borderColor: "#86EFAC" },
              ]}
            >
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={[styles.statNum, { color: "#16A34A" }]}>{score}</Text>
              <Text style={[styles.statLbl, { color: "#166534" }]}>صحيحة</Text>
            </View>
            <View
              style={[
                styles.statItem,
                { backgroundColor: "#FFF5F5", borderColor: "#FCA5A5" },
              ]}
            >
              <Ionicons name="close-circle" size={18} color="#DC2626" />
              <Text style={[styles.statNum, { color: "#DC2626" }]}>
                {totalQ - score}
              </Text>
              <Text style={[styles.statLbl, { color: "#B91C1C" }]}>خاطئة</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.resultMessage, { color: colors.mutedForeground }]}>
          {resultMessage}
        </Text>
      </Animated.View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => router.replace(`/quiz/${quizId}`)}
          style={({ pressed }) => [
            styles.retryBtn,
            {
              backgroundColor: colors.primaryLight,
              borderColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={[styles.retryText, { color: colors.primary }]}>
            إعادة الاختبار
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(tabs)/")}
          style={({ pressed }) => [
            styles.homeBtn,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.88 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Ionicons name="home" size={18} color={colors.primaryForeground} />
          <Text style={[styles.homeBtnText, { color: colors.primaryForeground }]}>
            الصفحة الرئيسية
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  backBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  backText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  resultCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  resultLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    textAlign: "center",
  },
  quizTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  scoreRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 16,
    width: "100%",
    justifyContent: "center",
  },
  scoreBig: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  scorePct: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    lineHeight: 34,
  },
  scoreLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  statsCol: {
    gap: 10,
  },
  statItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 110,
  },
  statNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  statLbl: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  resultMessage: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  retryBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  retryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  homeBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  homeBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
