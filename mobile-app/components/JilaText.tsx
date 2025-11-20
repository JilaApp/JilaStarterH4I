import React, { ReactNode } from "react";
import { Text, TextProps } from "react-native";

export default function JilaText({
  children,
  ...props
}: {
  children: ReactNode;
} & TextProps) {
  return (
    <Text {...props} style={{ fontFamily: "Fustat" }}>
      {children}
    </Text>
  );
}
