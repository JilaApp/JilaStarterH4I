import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Volume2 } from "lucide-react-native";
import { useAudioPlayer } from "expo-audio";
import { useState, useEffect } from "react";
import { colors } from "@/colors";

type AudioSource = number | { uri: string };

type AudioButtonProps = {
  audioSource: AudioSource;
  variant?: "default" | "light";
  disabled?: boolean;
};

export default function AudioButton({
  audioSource,
  disabled = false,
}: AudioButtonProps) {
  const player = useAudioPlayer(audioSource);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setIsPlaying(player.playing);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 100);

    return () => {
      clearInterval(interval);
    };
  }, [player]);

  function playSound() {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }

  const getBackgroundColor = () => {
    if (disabled) return colors.gray[300];
    if (isPlaying) return colors.jila[400];
    return colors.jila[300];
  };

  return (
    <TouchableOpacity
      onPress={playSound}
      disabled={disabled}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <View
        style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      >
        <Volume2 size={11} color={colors.white[400]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
