import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "@/colors";

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

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          styles.container,
          size === "small" ? styles.small : styles.large,
          checked && styles.checked,
        ]}
      >
        {checked && <Check size={14} color={colors.white[400]} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.jila[400],
    borderRadius: 3.13,
  },
  small: {
    width: 16,
    height: 16,
  },
  large: {
    width: 20,
    height: 20,
  },
  checked: {
    backgroundColor: colors.jila[400],
  },
});
