import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Confetti from "@/components/Confetti";
import { useColors } from "@/hooks/useColors";
import { useProgress } from "@/context/ProgressContext";
import { QUIZZES } from "@/constants/quizData";

type AnswerState = "idle" | "correct" | "wrong";

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { markComplete } = useProgress();

  const quiz = id ? QUIZZES[id] : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const streakAnim = useRef(new Animated.Value(1)).current;
  const optionAnims = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(1))
  ).current;

  const animateStreak = useCallback(() => {
    streakAnim.setValue(1.4);
    Animated.spring(streakAnim, {
      toValue: 1,
      friction: 4,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [streakAnim]);

  const animateOption = useCallback(
    (index: number) => {
      optionAnims[index].setValue(0.95);
      Animated.spring(optionAnims[index], {
        toValue: 1,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }).start();
    },
    [optionAnims]
  );

  if (!quiz) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>
          الاختبار غير موجود
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }}>
            العودة
          </Text>
        </Pressable>
      </View>
    );
  }

  const question = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const progress = (currentIndex / totalQuestions) * 100;

  const handleSelect = (optionIndex: number) => {
    if (answerState !== "idle") return;

    animateOption(optionIndex);

    const isCorrect = optionIndex === question.correctIndex;
    setSelectedOption(optionIndex);
    setAnswerState(isCorrect ? "correct" : "wrong");

    if (Platform.OS !== "web") {
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + 1);
      animateStreak();
      if (newStreak >= 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    } else {
      setStreak(0);
    }

    setAnswers((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      markComplete(id!).catch(() => {});
      const finalScore = answers.filter(Boolean).length;
      router.replace({
        pathname: "/quiz/result",
        params: {
          quizId: id,
          finalScore: String(finalScore),
          total: String(totalQuestions),
        },
      });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setAnswerState("idle");
  };

  const getOptionStyle = (index: number) => {
    if (answerState === "idle") {
      return {
        backgroundColor: colors.card,
        borderColor: colors.border,
      };
    }
    if (index === question.correctIndex) {
      return {
        backgroundColor: "#DCFCE7",
        borderColor: "#16A34A",
      };
    }
    if (index === selectedOption && answerState === "wrong") {
      return {
        backgroundColor: "#FEE2E2",
        borderColor: "#DC2626",
      };
    }
    return {
      backgroundColor: colors.card,
      borderColor: colors.border,
      opacity: 0.5,
    };
  };

  const getOptionTextColor = (index: number) => {
    if (answerState === "idle") return colors.foreground;
    if (index === question.correctIndex) return "#15803D";
    if (index === selectedOption && answerState === "wrong") return "#DC2626";
    return colors.mutedForeground;
  };

  const streakColor =
    streak >= 5 ? "#DC2626" : streak >= 3 ? "#F97316" : streak >= 1 ? "#F59E0B" : colors.mutedForeground;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Confetti visible={showConfetti} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerBack,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          accessibilityLabel="العودة"
        >
          <Ionicons name="arrow-forward" size={22} color={colors.foreground} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
          {quiz.titleAr}
        </Text>

        {/* Streak Counter */}
        <Animated.View
          style={[
            styles.streakBadge,
            {
              backgroundColor:
                streak > 0 ? `${streakColor}18` : colors.muted,
              borderColor: streak > 0 ? streakColor : colors.border,
              transform: [{ scale: streakAnim }],
            },
          ]}
        >
          <Text style={styles.streakFire}>
            {streak >= 5 ? "🔥" : streak >= 3 ? "🔥" : streak >= 1 ? "🔥" : "💤"}
          </Text>
          <Text
            style={[
              styles.streakNumber,
              { color: streak > 0 ? streakColor : colors.mutedForeground },
            ]}
          >
            {streak}
          </Text>
        </Animated.View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${progress}%` as `${number}%`,
            },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Counter */}
        <View style={styles.questionMeta}>
          <Text style={[styles.questionCounter, { color: colors.mutedForeground }]}>
            {currentIndex + 1} / {totalQuestions}
          </Text>
          <View
            style={[
              styles.scorePill,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Ionicons name="star" size={13} color={colors.primary} />
            <Text style={[styles.scoreText, { color: colors.primary }]}>
              {score} صح
            </Text>
          </View>
        </View>

        {/* Question Card */}
        <View
          style={[
            styles.questionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: "#000",
            },
          ]}
        >
          <Text style={[styles.questionText, { color: colors.foreground }]}>
            {question.htmlAr
              .replace(/<[^>]+>/g, " ")
              .replace(/\s+/g, " ")
              .trim()}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.optionsAr.map((option, index) => {
            const optStyle = getOptionStyle(index);
            const textColor = getOptionTextColor(index);
            const isCorrectAnswer =
              answerState !== "idle" && index === question.correctIndex;
            const isWrongSelected =
              answerState === "wrong" && index === selectedOption;

            return (
              <Animated.View
                key={index}
                style={{ transform: [{ scale: optionAnims[index] }] }}
              >
                <Pressable
                  onPress={() => handleSelect(index)}
                  disabled={answerState !== "idle"}
                  style={[
                    styles.optionBtn,
                    {
                      backgroundColor: optStyle.backgroundColor,
                      borderColor: optStyle.borderColor,
                      opacity: (optStyle as { opacity?: number }).opacity ?? 1,
                    },
                  ]}
                  accessibilityRole="button"
                >
                  <View style={styles.optionInner}>
                    <Text style={[styles.optionText, { color: textColor }]}>
                      {option}
                    </Text>
                    {isCorrectAnswer && (
                      <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
                    )}
                    {isWrongSelected && (
                      <Ionicons name="close-circle" size={22} color="#DC2626" />
                    )}
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Explanation */}
        {answerState !== "idle" && (
          <Animated.View
            style={[
              styles.explanationCard,
              {
                backgroundColor:
                  answerState === "correct" ? "#F0FDF4" : "#FFF5F5",
                borderColor:
                  answerState === "correct" ? "#86EFAC" : "#FCA5A5",
              },
            ]}
          >
            <View style={styles.explanationHeader}>
              <Ionicons
                name={
                  answerState === "correct"
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={20}
                color={answerState === "correct" ? "#16A34A" : "#DC2626"}
              />
              <Text
                style={[
                  styles.explanationTitle,
                  {
                    color: answerState === "correct" ? "#15803D" : "#B91C1C",
                  },
                ]}
              >
                {answerState === "correct" ? "اجابة صحيحة!" : "اجابة خاطئة"}
              </Text>
              {answerState === "correct" && streak >= 2 && (
                <View
                  style={[
                    styles.streakMini,
                    { backgroundColor: `${streakColor}18` },
                  ]}
                >
                  <Text style={[styles.streakMiniText, { color: streakColor }]}>
                    توالٍ {streak}x
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.explanationText,
                {
                  color:
                    answerState === "correct" ? "#166534" : "#991B1B",
                },
              ]}
            >
              {question.explanationAr}
            </Text>
          </Animated.View>
        )}

        {/* Next Button */}
        {answerState !== "idle" && (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextBtn,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.88 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            accessibilityRole="button"
          >
            <Text style={[styles.nextBtnText, { color: colors.primaryForeground }]}>
              {currentIndex + 1 >= totalQuestions ? "عرض النتيجة" : "السؤال التالي"}
            </Text>
            <Ionicons
              name="arrow-back"
              size={18}
              color={colors.primaryForeground}
            />
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    textAlign: "right",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    minWidth: 58,
    justifyContent: "center",
  },
  streakFire: {
    fontSize: 16,
  },
  streakNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    minWidth: 18,
    textAlign: "center",
  },
  progressTrack: {
    height: 4,
    width: "100%",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  questionMeta: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionCounter: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  scorePill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  scoreText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  questionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    lineHeight: 30,
    textAlign: "right",
    writingDirection: "rtl",
  },
  optionsContainer: {
    gap: 10,
  },
  optionBtn: {
    borderRadius: 14,
    borderWidth: 2,
    padding: 16,
  },
  optionInner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  optionText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    textAlign: "right",
    lineHeight: 22,
    writingDirection: "rtl",
  },
  explanationCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    gap: 10,
  },
  explanationHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  explanationTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  streakMini: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: "auto",
  },
  streakMiniText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  explanationText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "right",
    writingDirection: "rtl",
  },
  nextBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
