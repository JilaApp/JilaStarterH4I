import { Pressable, StyleSheet } from "react-native";
import { colors } from "@/colors";
import { LucideIcon } from "lucide-react-native";
import Text from "./JilaText";

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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.jila[400],
    borderWidth: 0,
    borderColor: "transparent",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 40,
    textColor: colors.white[400],
  },
  secondary: {
    width: 116,
    height: 41,
    borderRadius: 20.5,
    backgroundColor: colors.jila[400],
    borderWidth: 2,
    borderColor: colors.jila[400],
    fontSize: 14,
    fontWeight: "600",
    textColor: colors.white[400],
  },
  outline: {
    width: 105,
    height: 41,
    borderRadius: 20.5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.jila[400],
    fontSize: 14,
    fontWeight: "600",
    textColor: colors.jila[400],
  },
  "outline-cream": {
    width: 225,
    height: 78,
    borderRadius: 39,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.gray[300],
    fontSize: 28,
    fontWeight: "600",
    textColor: colors.type[400],
  },
};

export function Button({
  text,
  onPress,
  preset = "primary",
  icon: Icon,
  iconSize = 14,
  customStyle = {},
}: ButtonProps) {
  const buttonStyle = { ...buttonPresets[preset], ...customStyle };

  const containerStyle: any = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Icon ? 5 : 0,
    backgroundColor: buttonStyle.backgroundColor,
    borderRadius: buttonStyle.borderRadius,
    borderWidth: buttonStyle.borderWidth,
    borderColor: buttonStyle.borderColor,
  };

  if (buttonStyle.width) {
    containerStyle.width = buttonStyle.width;
    containerStyle.height = buttonStyle.height;
  } else {
    containerStyle.paddingHorizontal = buttonStyle.paddingHorizontal;
    containerStyle.paddingVertical = buttonStyle.paddingVertical;
  }

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
