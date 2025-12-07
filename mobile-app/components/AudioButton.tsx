import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Volume2 } from "lucide-react-native";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

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
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (!audioSource) return null;

  async function playSound() {
    if (!audioSource || isLoading) return;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        setIsLoading(true);
        console.log("Loading sound", audioSource);
        const { sound: newSound } = await Audio.Sound.createAsync(
          typeof audioSource === "number" ? audioSource : audioSource,
          { shouldPlay: true, isLooping: false },
        );
        setSound(newSound);
        setIsPlaying(true);
        setIsLoading(false);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
              newSound.stopAsync();
            }
          }
        });
      }
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsLoading(false);
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
        <Volume2 size={sizes.icon.xs} color={colors.white[400]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: sizes.icon.md,
    height: sizes.icon.md,
    borderRadius: sizes.icon.md / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
