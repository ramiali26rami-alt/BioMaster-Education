import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function Index() {
  const { user, loading } = useAuth();
  const colors = useColors();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.primaryDark }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return user ? <Redirect href="/(tabs)/" /> : <Redirect href="/(auth)/login" />;
}
