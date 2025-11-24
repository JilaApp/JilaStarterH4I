import { View, TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";

interface CheckboxProps {
  size: "small" | "large";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function Checkbox({
  size,
  checked,
  onCheckedChange,
}: CheckboxProps) {
  const handlePress = () => {
    onCheckedChange(!checked);
  };

  const sizeClasses =
    size === "small" ? "w-[16px] h-[16px]" : "w-[20px] h-[20px]";

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        className={`flex-col items-center justify-center border border-jila-400 rounded-[3.13px] 
                ${sizeClasses} 
                ${checked ? "bg-jila-400" : ""}`}
      >
        {checked && <Check size={14} color="white" />}
      </View>
    </TouchableOpacity>
  );
}
