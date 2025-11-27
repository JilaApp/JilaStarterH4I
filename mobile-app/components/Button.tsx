import { Pressable, StyleSheet } from "react-native";
import { colors } from "@/colors";
import { LucideIcon } from "lucide-react-native";
import Text from "./JilaText";
import { sizes } from "@/constants/sizes";

type ButtonPreset = "primary" | "secondary" | "outline" | "outline-cream";

interface ButtonStyle {
  width?: number;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  borderRadius: number;
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  fontSize: number;
  fontWeight: "600" | "bold";
  lineHeight?: number;
  textColor: string;
}

interface ButtonProps {
  text: string;
  onPress: () => void;
  preset?: ButtonPreset;
  icon?: LucideIcon;
  iconSize?: number;
  customStyle?: Partial<ButtonStyle>;
}

const buttonPresets: Record<ButtonPreset, ButtonStyle> = {
  primary: {
    paddingHorizontal: sizes.spacing.lg,
    paddingVertical: sizes.spacing.md,
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.jila[400],
    borderWidth: 0,
    borderColor: "transparent",
    fontSize: sizes.fontSize.base,
    fontWeight: "bold",
    textColor: colors.white[400],
  },
  secondary: {
    paddingHorizontal: sizes.spacing.xl,
    paddingVertical: sizes.spacing.md,
    borderRadius: sizes.borderRadius.xl,
    backgroundColor: colors.jila[400],
    borderWidth: 2,
    borderColor: colors.jila[400],
    fontSize: sizes.fontSize.sm,
    fontWeight: "600",
    textColor: colors.white[400],
  },
  outline: {
    paddingHorizontal: sizes.spacing.xl,
    paddingVertical: sizes.spacing.md,
    borderRadius: sizes.borderRadius.xl,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.jila[400],
    fontSize: sizes.fontSize.sm,
    fontWeight: "600",
    textColor: colors.jila[400],
  },
  "outline-cream": {
    paddingHorizontal: sizes.spacing.xxl,
    paddingVertical: sizes.spacing.xl,
    borderRadius: sizes.borderRadius.xxl + sizes.borderRadius.sm,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.gray[300],
    fontSize: sizes.fontSize.xxl,
    fontWeight: "600",
    textColor: colors.type[400],
  },
};

export function Button({
  text,
  onPress,
  preset = "primary",
  icon: Icon,
  iconSize = sizes.icon.sm,
  customStyle = {},
}: ButtonProps) {
  const buttonStyle = { ...buttonPresets[preset], ...customStyle };

  const containerStyle: any = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Icon ? sizes.spacing.xs : 0,
    backgroundColor: buttonStyle.backgroundColor,
    borderRadius: buttonStyle.borderRadius,
    borderWidth: buttonStyle.borderWidth,
    borderColor: buttonStyle.borderColor,
    paddingHorizontal: buttonStyle.paddingHorizontal,
    paddingVertical: buttonStyle.paddingVertical,
  };

  const textStyle: any = {
    color: buttonStyle.textColor,
    fontSize: buttonStyle.fontSize,
    fontWeight: buttonStyle.fontWeight,
    textAlign: "center",
  };

  if (buttonStyle.lineHeight) {
    textStyle.lineHeight = buttonStyle.lineHeight;
  }

  return (
    <Pressable
      style={({ pressed }) => [containerStyle, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Text style={textStyle}>{text}</Text>
      {Icon && <Icon color={buttonStyle.textColor} size={iconSize} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.7,
  },
});
