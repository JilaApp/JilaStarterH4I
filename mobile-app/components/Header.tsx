import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import SearchBar from "./SearchBar";
import React, { useState } from "react";
import { Volume2, CircleHelp, Menu } from "lucide-react-native";
import { colors } from "@/colors";
import { sizes, componentSizes } from "@/constants/sizes";
import { hp } from "@/utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  text?: string;
  toggleSearch: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function Header({
  text,
  toggleSearch,
  searchValue = "",
  onSearchChange,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const getContainerHeight = () => {
    const baseHeight = toggleSearch
      ? text
        ? hp(18)
        : hp(12)
      : text
        ? hp(12)
        : hp(10);
    return baseHeight + insets.top;
  };

  const getGradientPaddingBottom = () => {
    if (toggleSearch) {
      return text ? hp(1) : hp(0.5);
    }
    return text ? hp(1.5) : hp(0.75);
  };

  return (
    <View style={[styles.container, { height: getContainerHeight() }]}>
      <LinearGradient
        colors={[colors.orange[400], colors.jila[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.gradient,
          { paddingTop: insets.top, paddingBottom: getGradientPaddingBottom() },
        ]}
      >
        <View style={styles.topRow}>
          <Image
            source={require("../assets/images/jila-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.iconRow}>
            <View style={styles.audioIconContainer}>
              <Volume2 size={sizes.icon.xs} color={colors.white[400]} />
            </View>

            <CircleHelp size={sizes.icon.md} color={colors.white[400]} />

            <Menu size={sizes.icon.md} color={colors.white[400]} />
          </View>
        </View>

        {text && <Text style={styles.headerText}>{text}</Text>}
      </LinearGradient>

      {toggleSearch && (
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchValue}
            onChange={onSearchChange || (() => {})}
            isFocused={searchFocused}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  gradient: {
    paddingHorizontal: sizes.spacing.xl,
    borderBottomLeftRadius: sizes.borderRadius.xxl,
    height: "100%",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    marginLeft: -sizes.spacing.md,
    width: componentSizes.logo.header.width,
    height: componentSizes.logo.header.height,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.spacing.md,
    paddingTop: sizes.spacing.md,
  },
  audioIconContainer: {
    width: sizes.icon.md,
    height: sizes.icon.md,
    borderRadius: sizes.icon.md / 2,
    borderWidth: 2,
    borderColor: colors.white[400],
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: colors.white[400],
    fontSize: sizes.fontSize.xl,
    fontWeight: "600",
    lineHeight: sizes.fontSize.xxl,
    marginTop: hp(1),
    width: "100%",
    marginLeft: sizes.spacing.sm,
  },
  searchBarContainer: {
    position: "absolute",
    bottom: hp(-2),
    alignSelf: "center",
    width: "90%",
    alignItems: "center",
    zIndex: 10,
  },
});
