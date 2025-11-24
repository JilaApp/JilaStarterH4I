import { View, TouchableOpacity } from "react-native";
import AudioButton from "@/components/AudioButton";
import JilaText from "@/components/JilaText";
import { Check } from "lucide-react-native";

type AudioSource = number | { uri: string };

interface SelectOption {
  id: string;
  title: string;
  audioSource: AudioSource;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

export default function Select({
  options,
  selected,
  onSelect,
  className = "w-[275px] h-[45px]",
}: SelectProps) {
  return (
    <View className="flex-col items-center gap-[25px]">
      {options.map((option) => {
        const isSelected = selected === option.id;
        const disabled = option.disabled ?? false;

        const borderColor = isSelected ? "border-jila-400" : "border-gray-300";
        const opacityClass = disabled ? "opacity-100" : "";
        const textColor = disabled ? "text-gray-300" : "";

        const handlePress = () => {
          if (!disabled) {
            onSelect(option.id);
          }
        };

        return (
          <TouchableOpacity
            key={option.id}
            onPress={handlePress}
            disabled={disabled}
          >
            <View
              className={`flex-col items-center justify-center rounded-[10px] border border-[1px] ${borderColor} ${opacityClass} ${className}`}
            >
              <View className="flex-row p-[15px]">
                <View className="flex-1 flex-row items-center">
                  <View className="pr-[10px]">
                    <JilaText
                      className={`text-base font-semibold ${textColor}`}
                    >
                      {option.title}
                    </JilaText>
                  </View>
                  <View className="flex-row">
                    <AudioButton
                      audioSource={option.audioSource}
                      disabled={disabled}
                    />
                  </View>
                </View>
                {isSelected && (
                  <View className="ml-[15px]">
                    <Check size={25} color="#7E0601" />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
