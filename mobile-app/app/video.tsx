import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Text from "@/components/JilaText";
import { colors } from "@/colors";

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
    padding: 20,
    backgroundColor: colors.white[400],
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: colors.type[400],
  },
  urlText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.gray[700],
  },
  url: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 20,
  },
  placeholder: {
    width: "100%",
    height: 200,
    backgroundColor: colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.gray[600],
  },
});
