import { View, Image, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import SearchBar from "./SearchBar";
import React, { useState } from "react";
import { Volume2, CircleHelp, Menu } from "lucide-react-native";
import { colors } from "@/colors";

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

  const getGradientPaddingBottom = () => {
    if (toggleSearch) {
      return text ? 50 : 30;
    }
    return 38;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.orange[400], colors.jila[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, { paddingBottom: getGradientPaddingBottom() }]}
      >
        <View style={styles.topRow}>
          <Image
            source={require("../assets/images/jila-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.iconRow}>
            <View style={styles.audioIconContainer}>
              <Volume2 size={12} color={colors.white[400]} />
            </View>

            <CircleHelp size={24} color={colors.white[400]} />

            <Menu size={26} color={colors.white[400]} />
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
    paddingHorizontal: 32,
    paddingTop: 50,
    borderBottomLeftRadius: 35,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: 0,
  },
  logo: {
    width: 125,
    height: 65,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 16,
  },
  audioIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.white[400],
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: colors.white[400],
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
    marginTop: 20,
    width: 312,
    marginLeft: 10,
  },
  searchBarContainer: {
    position: "absolute",
    bottom: -20,
    alignSelf: "center",
    zIndex: 10,
  },
});
