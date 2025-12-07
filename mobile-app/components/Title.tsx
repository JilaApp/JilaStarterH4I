import { View, StyleSheet, TextStyle } from "react-native";
import JilaText from "./JilaText";
import AudioButton from "./AudioButton";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import { useTTS } from "@/context/TTSContext";

type AudioSource = number | { uri: string };

interface TitleProps {
  text: string;
  audioSource?: AudioSource;
  style?: TextStyle;
}

export default function Title({ text, audioSource, style }: TitleProps) {
  const { ttsEnabled } = useTTS();

  return (
    <View style={styles.container}>
      <JilaText style={[styles.text, style]}>{text}</JilaText>
      {ttsEnabled && audioSource && (
        <AudioButton audioSource={audioSource} variant="default" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.spacing.md,
  },
  text: {
    fontSize: sizes.fontSize.xl,
    fontWeight: "600",
    lineHeight: sizes.fontSize.xxl,
    color: colors.black,
    textAlign: "center",
  },
});
