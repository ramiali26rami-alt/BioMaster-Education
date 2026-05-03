import { usePreventScreenCapture } from "expo-screen-capture";
import { Platform } from "react-native";

export function useScreenCapturePrevention() {
  if (Platform.OS === "web") return;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  usePreventScreenCapture();
}
