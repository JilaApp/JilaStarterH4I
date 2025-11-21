import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Check } from "lucide-react-native";

interface CheckboxProps {
    size: "small" | "large";
    defaultChecked?: boolean;
}

export default function Checkbox({
    size,
    defaultChecked = false
}: CheckboxProps) {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const handlePress = () => {
        setIsChecked(!isChecked);
    };

    const sizeClasses = size === "small" ? "w-[15px] h-[15px]" : "w-[20px] h-[20px]";

    return (
        <TouchableOpacity onPress={handlePress}>
            <View className={`flex-col items-center justify-center border border-jila-400 rounded-[3.13px] 
                ${sizeClasses} 
                ${isChecked ? "bg-jila-400" : ""}`}
            >
                {isChecked && <Check size={10} color="white" />}
            </View>
        </TouchableOpacity>
    );
}