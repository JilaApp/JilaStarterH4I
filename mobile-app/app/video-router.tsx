import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Text from "@/components/JilaText";
import Header from "@/components/Header";
import { colors } from "@/colors";

export default function VideoRouter() {
  const { category } = useLocalSearchParams<{ category: string }>();

  return (
    <>
      <Header toggleSearch={true} />
      <View style={styles.container}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream[300],
    padding: 24,
  },
  categoryText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.type[400],
  },
});
