import { View, TouchableOpacity, Text } from "react-native";
import { Check } from "lucide-react-native"

interface CheckboxProps {
    size: "small" | "large";
    isClicked?: boolean;
    setIsClicked: (clicked: boolean) => void;
}

export default function Checkbox({
    size,
    isClicked,
    setIsClicked
}: CheckboxProps) {

    const handlePress = () => {
        setIsClicked(!isClicked);
    };

    return ([
        <TouchableOpacity onPress={handlePress}>
            <View className="flex-col items-center w-[15px] h-[15px] justify-center rounded-[3.13px] border border-jila-400 ">
                <Check size={10} color={"white"} />
            </View>
        </TouchableOpacity>
    ]);
}