import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors } from "@/colors";

interface BottomBackgroundProps {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export default function BottomBackground({
  children,
  contentStyle,
}: BottomBackgroundProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.redLayer} />
      <View style={styles.creamLayer}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  redLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.jila[400],
    zIndex: 0,
  },
  creamLayer: {
    flex: 1,
    backgroundColor: colors.cream[300],
    borderTopRightRadius: 70,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
});
