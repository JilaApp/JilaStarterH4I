import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Text from "@/components/JilaText";
import Header from "@/components/Header";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import { wp } from "@/utils/responsive";

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
    padding: wp(6),
  },
  categoryText: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: "700",
    color: colors.type[400],
  },
});
