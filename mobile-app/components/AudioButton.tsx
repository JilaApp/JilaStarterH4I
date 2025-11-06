import { View, TouchableOpacity } from "react-native";
import { Volume2 } from "lucide-react-native";
import { Audio } from "expo-av";
import { useState } from "react";

type AudioButtonProps = {
  audioSource: string;
};

export default function AudioButton({ audioSource }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);

  async function playSound() {
    if (playing) return;
    setPlaying(true);

    const { sound } = await Audio.Sound.createAsync(
      { uri: audioSource },
      { shouldPlay: true },
    );

    sound.playAsync();
    setPlaying(false);
  }
  return (
    <TouchableOpacity onPress={playSound}>
      <View className="w-[20px] h-[20px] rounded-full bg-jila-400 justify-center items-center">
        <Volume2 size={11} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}
