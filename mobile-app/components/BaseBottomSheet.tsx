import React, { useRef, useEffect, ReactNode } from "react";
import { ViewStyle, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

export interface BaseBottomSheetProps {
  children: ReactNode;
  height?: string | string[];
  maxHeight?: number;
  padding?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function BaseBottomSheet({
  children,
  height = "70%",
  maxHeight,
  padding = 20,
  backgroundColor,
  style,
}: BaseBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const snapPoints = Array.isArray(height) ? height : [height];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableOverDrag={false}
      maxDynamicContentSize={maxHeight || sizes.screen.height * 0.6}
      backgroundStyle={
        style || {
          backgroundColor: backgroundColor || colors.white[400],
          borderTopLeftRadius: styles.background.borderTopLeftRadius,
          borderTopRightRadius: styles.background.borderTopRightRadius,
        }
      }
      enableContentPanningGesture={true}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          flex: styles.contentContainer.flex,
          padding,
        }}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    flex: 1,
  },
});
