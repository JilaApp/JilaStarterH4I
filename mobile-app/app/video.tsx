import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Text from "@/components/JilaText";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

export default function VideoPage() {
  const { url } = useLocalSearchParams<{ url: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Player</Text>
      <Text style={styles.urlText}>Video URL:</Text>
      <Text style={styles.url}>{url}</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Video embed will go here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sizes.spacing.lg,
    backgroundColor: colors.white[400],
  },
  title: {
    fontSize: sizes.fontSize.xl,
    fontWeight: "700",
    marginBottom: sizes.spacing.lg,
    color: colors.type[400],
  },
  urlText: {
    fontSize: sizes.fontSize.md,
    fontWeight: "600",
    marginBottom: sizes.spacing.sm,
    color: colors.gray[700],
  },
  url: {
    fontSize: sizes.fontSize.sm,
    color: colors.gray[600],
    marginBottom: sizes.spacing.lg,
  },
  placeholder: {
    width: "100%",
    height: sizes.screen.height * 0.25,
    backgroundColor: colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: sizes.borderRadius.sm,
  },
  placeholderText: {
    fontSize: sizes.fontSize.md,
    color: colors.gray[600],
  },
});
