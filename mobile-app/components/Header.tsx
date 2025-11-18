import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

export default function Header() {
  return (
    <LinearGradient
      colors={["#E8965B", "#7E0601"]} // orange → red
      start={{ x: 0, y: 0 }}          // top
      end={{ x: 0, y: 1 }}            // bottom
      style={{
        height: 125,
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
    </LinearGradient>
  );
}
