import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { colors } from "@/colors";

interface DisplayBoxProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
}

export default function DisplayBox({ 
  children, 
  minHeight = 400,
  maxHeight = 600
}: DisplayBoxProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.innerBox, { minHeight, maxHeight }]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {children}
        </ScrollView>
      </View>
      <Image
        source={require("@/assets/images/display-box-tail.png")}
        style={styles.tail}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
  },
  innerBox: {
    backgroundColor: colors.white[400],
    borderRadius: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 80,
    elevation: 10,
    zIndex: 2,
    overflow: 'hidden',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  tail: {
    position: "absolute",
    bottom: -100,
    right: -50,
    width: 160,
    height: 160,
    zIndex: 1,
  },
});