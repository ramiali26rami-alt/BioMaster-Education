import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePreventScreenCapture } from "expo-screen-capture";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { seedFirestoreIfEmpty } from "@/firebase/seed";
import "@/i18n";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function ScreenCaptureGuard() {
  usePreventScreenCapture();
  return null;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="unit/[id]" />
      <Stack.Screen name="lesson/[id]" />
      <Stack.Screen name="pdf/[id]" />
      <Stack.Screen name="quiz/[id]" />
      <Stack.Screen name="quiz/result" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      seedFirestoreIfEmpty();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <ThemeProvider>
                <LanguageProvider>
                  <AuthProvider>
                    <ProgressProvider>
                      {Platform.OS !== "web" && <ScreenCaptureGuard />}
                      <RootLayoutNav />
                    </ProgressProvider>
                  </AuthProvider>
                </LanguageProvider>
              </ThemeProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
