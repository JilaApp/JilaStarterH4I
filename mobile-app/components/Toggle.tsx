import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import AudioButton from "@/components/AudioButton";
import JilaText from "@/components/JilaText";
import { Check } from "lucide-react-native";

type AudioSource = number | { uri: string };

interface ToggleProps {
    defaultToggled: boolean;
    disabled: boolean;
    title: string;
    description?: string;
    audioSource: AudioSource;
}

export default function Toggle({
    defaultToggled,
    disabled,
    title,
    description,
    audioSource
}: ToggleProps) {
    const [isToggled, setIsToggled] = useState(defaultToggled)

    const handlePress = () => {
        if (!disabled) {
            setIsToggled(!isToggled);
        }
    };

    const borderColor = isToggled ? "border-jila-400" : "border-gray-300";
    const opacityClass = disabled ? "opacity-100" : "";
    const textColor = disabled ? "text-gray-300" : "";

    return (
        <TouchableOpacity onPress={handlePress} disabled={disabled}>
            <View className={`"flex-col items-center w-[275px] h-[45px] justify-center rounded-[10px] border border-[1px]" ${borderColor} ${opacityClass}`}>
                <View className="flex-row p-[15px]" >
                    <View className="flex-1 flex-row items-center">
                        <View className="pr-[10px]">
                            <JilaText className={`text-base font-semibold ${textColor}`}>{title}</JilaText>
                        </View>
                        <View className="flex-row">
                            <AudioButton audioSource={audioSource} disabled={disabled} />
                        </View>
                    </View>
                    {isToggled && (
                        <View className="ml-[15px]">
                            <Check size={25} color="#7E0601"/>
                        </View>
                    )}
                </View >
            </View>
        </TouchableOpacity>
    );
}