import { View, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import SearchBar from "./SearchBar";
import React, { useState } from "react";
import { Volume2, CircleHelp, Menu } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";

interface HeaderProps {
  text?: string;
  toggleSearch: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

export default function Header({ text, toggleSearch }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <View style={{ position: "relative" }}>
      <LinearGradient
        colors={["#E8965B", "#7E0601"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          paddingHorizontal: 32,
          paddingTop: 50,
          paddingBottom: toggleSearch ? (text ? 50 : 30) : 38,
          borderBottomLeftRadius: 35,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
            paddingLeft: 0,
          }}
        >
          <Image
            source={require("../assets/images/jila-logo.png")}
            style={{ width: 125, height: 65 }}
            resizeMode="contain"
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingTop: 16,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Volume2 size={12} color="#fff" />
            </View>

            <CircleHelp size={24} color="#fff" />

            <Menu size={26} color="#fff" />
          </View>
        </View>

        {text && (
          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: "700",
              lineHeight: 28,
              marginTop: 20,
              width: 312,
              marginLeft: 10,
            }}
          >
            {text}
          </Text>
        )}
      </LinearGradient>

      {toggleSearch && (
        <View
          style={{
            position: "absolute",
            bottom: -20,
            alignSelf: "center",
            zIndex: 10,
          }}
        >
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            isFocused={searchFocused}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </View>
      )}
    </View>
  );
}
