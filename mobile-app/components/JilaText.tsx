import React, { ReactNode, useMemo } from "react";
import { Text, TextProps, TextStyle } from "react-native";

export default function JilaText({
  children,
  style,
  ...props
}: {
  children: ReactNode;
} & TextProps) {
  // Extract fontWeight from style if it exists
  const fontFamily = useMemo(() => {
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...style.filter(Boolean))
      : style || {};

    const fontWeight = (flatStyle as TextStyle).fontWeight;
    const weight =
      typeof fontWeight === "string" ? fontWeight : String(fontWeight);

    // Map fontWeight to the correct font family variant
    switch (weight) {
      case "200":
        return "Fustat-ExtraLight";
      case "300":
        return "Fustat-Light";
      case "400":
      case "normal":
      case "undefined":
        return "Fustat";
      case "500":
        return "Fustat-Medium";
      case "600":
        return "Fustat-SemiBold";
      case "700":
      case "bold":
        return "Fustat-Bold";
      case "800":
        return "Fustat-ExtraBold";
      default:
        return "Fustat"; // Default to regular
    }
  }, [style]);

  return (
    <Text {...props} style={[{ fontFamily }, style]}>
      {children}
    </Text>
  );
}
