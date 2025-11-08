import { View, TouchableOpacity } from "react-native";
import { Volume2 } from "lucide-react-native";
import { Audio } from "expo-av";
import { useRef, useState } from "react";

type AudioSource = number | { uri: string };

type AudioButtonProps = {
  audioSource: AudioSource;
  variant?: "default" | "light";
  disabled?: boolean;
};

const BG_COLOR_MAP = {
  playing: "bg-jila-400",
  default: "bg-jila-300",
  disabled: "bg-gray-300",
};

export default function AudioButton({
  audioSource,
  disabled = false,
}: AudioButtonProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const playingRef = useRef(false);
  const [variant, setVariant] = useState<"default" | "playing" | "disabled">(
    "default",
  );

  async function playSound() {
    if (playingRef.current && soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      playingRef.current = false;
      setVariant("default");
      return;
    }

    const { sound } = await Audio.Sound.createAsync(audioSource, {
      shouldPlay: true,
    });

    soundRef.current = sound;
    playingRef.current = true;
    setVariant("playing");

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        playingRef.current = false;
        setVariant("default");
        sound.unloadAsync();
      }
    });

    await sound.playAsync();
  }

  const bgColor = disabled ? BG_COLOR_MAP.disabled : BG_COLOR_MAP[variant];

  return (
    <TouchableOpacity onPress={playSound} disabled={disabled}>
      <View
        className={`w-[20px] h-[20px] rounded-full ${bgColor} justify-center items-center ${disabled && "bg-gray-300"}`}
      >
        <Volume2 size={11} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}
