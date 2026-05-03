import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { Unit } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  unit: Unit;
}

const UNIT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  cellular: "grid-outline",
  dna: "git-branch-outline",
  leaf: "leaf-outline",
  earth: "earth-outline",
  body: "body-outline",
};

const UNIT_BG_COLORS = [
  "#0D5C41",
  "#1A4D6E",
  "#3B4A2A",
  "#4A3228",
  "#2A3B4A",
];

export default function UnitCard({ unit }: Props) {
  const colors = useColors();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const progress =
    unit.totalLessons > 0 ? unit.completedLessons / unit.totalLessons : 0;
  const bgColor = UNIT_BG_COLORS[unit.colorIndex % UNIT_BG_COLORS.length];
  const iconName = UNIT_ICONS[unit.icon] ?? "book-outline";

  const ctaLabel =
    progress === 0
      ? t("unit.startUnit")
      : progress === 1
      ? t("unit.reviewUnit")
      : t("unit.continueUnit");

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 14,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lockedOverlay: { opacity: 0.65 },
    topBar: {
      backgroundColor: bgColor,
      padding: 18,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 14,
    },
    iconCircle: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: "rgba(255,255,255,0.18)",
      alignItems: "center",
      justifyContent: "center",
    },
    topMeta: { flex: 1 },
    unitLabel: {
      fontFamily: "Inter_500Medium",
      fontSize: 11,
      color: "rgba(255,255,255,0.70)",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 2,
      textAlign: isRTL ? "right" : "left",
    },
    unitTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 22,
      color: "#FFFFFF",
      lineHeight: 28,
      letterSpacing: -0.4,
      textAlign: isRTL ? "right" : "left",
    },
    lockIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.25)",
      alignItems: "center",
      justifyContent: "center",
    },
    bottom: { padding: 16 },
    description: {
      fontFamily: "Inter_400Regular",
      fontSize: 13,
      color: colors.mutedForeground,
      lineHeight: 18,
      marginBottom: 14,
      textAlign: isRTL ? "right" : "left",
    },
    stats: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 16,
      marginBottom: 14,
    },
    statItem: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 4,
    },
    statText: {
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      color: colors.mutedForeground,
    },
    progressHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    progressLabel: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      color: colors.mutedForeground,
    },
    progressPct: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 12,
      color: unit.locked ? colors.mutedForeground : colors.primary,
    },
    progressTrack: {
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 3,
    },
    progressFill: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      width: `${Math.round(progress * 100)}%` as `${string}%`,
    },
    startBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryLight,
      borderRadius: 10,
      padding: 12,
      marginTop: 14,
      gap: 6,
    },
    startBtnText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
      color: colors.primary,
    },
    lockedBanner: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.muted,
      borderRadius: 10,
      padding: 12,
      marginTop: 14,
      gap: 6,
    },
    lockedText: {
      fontFamily: "Inter_500Medium",
      fontSize: 13,
      color: colors.mutedForeground,
      textAlign: "center",
    },
  });

  const unitLabel = isRTL
    ? `الوحدة ${unit.number}`
    : `Unit ${unit.number}`;

  return (
    <TouchableOpacity
      style={[styles.card, unit.locked && styles.lockedOverlay]}
      onPress={() => !unit.locked && router.push(`/unit/${unit.id}`)}
      activeOpacity={unit.locked ? 1 : 0.88}
    >
      <View style={styles.topBar}>
        <View style={styles.iconCircle}>
          <Ionicons name={iconName} size={22} color="#FFFFFF" />
        </View>
        <View style={styles.topMeta}>
          <Text style={styles.unitLabel}>{unitLabel}</Text>
          <Text style={styles.unitTitle}>{isRTL ? unit.titleAr : unit.title}</Text>
        </View>
        {unit.locked && (
          <View style={styles.lockIcon}>
            <Ionicons
              name="lock-closed"
              size={14}
              color="rgba(255,255,255,0.8)"
            />
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.description} numberOfLines={2}>
          {isRTL ? unit.descriptionAr : unit.description}
        </Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons
              name="book-outline"
              size={13}
              color={colors.mutedForeground}
            />
            <Text style={styles.statText}>
              {unit.chapters.length} {t("unit.chapters")}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="layers-outline"
              size={13}
              color={colors.mutedForeground}
            />
            <Text style={styles.statText}>
              {unit.totalLessons} {t("unit.lessons")}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="time-outline"
              size={13}
              color={colors.mutedForeground}
            />
            <Text style={styles.statText}>{unit.estimatedHours}h</Text>
          </View>
        </View>

        <View>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {unit.completedLessons}/{unit.totalLessons} {t("unit.lessons")}
            </Text>
            <Text style={styles.progressPct}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            {progress > 0 && <View style={styles.progressFill} />}
          </View>
        </View>

        {unit.locked ? (
          <View style={styles.lockedBanner}>
            <Ionicons
              name="lock-closed-outline"
              size={14}
              color={colors.mutedForeground}
            />
            <Text style={styles.lockedText}>{t("unit.locked")}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => router.push(`/unit/${unit.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.startBtnText}>{ctaLabel}</Text>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={14}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
