import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

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
        {checked && <Check size={sizes.icon.xs} color={colors.white[400]} />}
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
    borderRadius: sizes.borderRadius.xs,
  },
  small: {
    width: sizes.icon.sm,
    height: sizes.icon.sm,
  },
  large: {
    width: sizes.icon.md,
    height: sizes.icon.md,
  },
  checked: {
    backgroundColor: colors.jila[400],
  },
});
