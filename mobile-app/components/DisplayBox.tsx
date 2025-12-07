import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Keyboard,
  Animated,
  Platform,
} from "react-native";
import { colors } from "@/colors";
import { sizes, componentSizes } from "@/constants/sizes";

interface DisplayBoxProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
  keyboardOffsetMultiplier?: number;
}

export default function DisplayBox({
  children,
  minHeight = componentSizes.displayBox.minHeight,
  maxHeight = componentSizes.displayBox.maxHeight,
  keyboardOffsetMultiplier = 0.4,
}: DisplayBoxProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        // Move the entire DisplayBox up by the specified multiplier of keyboard height
        Animated.timing(translateY, {
          toValue: -e.endCoordinates.height * keyboardOffsetMultiplier,
          duration: e.duration || 250,
          useNativeDriver: true,
        }).start();
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => {
        // Move back to original position
        Animated.timing(translateY, {
          toValue: 0,
          duration: e.duration || 250,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [translateY, keyboardOffsetMultiplier]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  innerBox: {
    backgroundColor: colors.white[400],
    borderRadius: sizes.borderRadius.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: sizes.spacing.xs },
    shadowOpacity: 0.1,
    shadowRadius: 80,
    elevation: 10,
    zIndex: 2,
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    padding: sizes.spacing.xl,
    flexGrow: 1,
  },
  tail: {
    position: "absolute",
    bottom: -componentSizes.displayBox.tailSize * 0.6,
    right: -componentSizes.displayBox.tailSize * 0.3,
    width: componentSizes.displayBox.tailSize,
    height: componentSizes.displayBox.tailSize,
    zIndex: 1,
  },
});
