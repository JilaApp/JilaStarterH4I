import { View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import SearchBar from "./SearchBar";
import React from "react";
import { Volume2, CircleHelp, Menu } from "lucide-react-native";

interface HeaderProps {
  text?: string;
  toggleSearch: boolean;
}

export default function Header({ text, toggleSearch }: HeaderProps) {
  return (
    <LinearGradient
      colors={["#E8965B", "#7E0601"]} // orange → red
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        // height: 125,
        paddingBottom: 50,
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          width: "100%",
          paddingTop: 25,
          paddingLeft: 25,
        }}
      >
        <Image
          source={require("../assets/images/jila-logo.png")}
          style={{ width: 85, height: 35 }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            width: "100%",
            // paddingTop: 1,
            paddingLeft: 165,
          }}
        >
          <View style={{ paddingRight: 10 }}>
            <Volume2 size={25} color="#fff" />
          </View>

          <View style={{ paddingRight: 10 }}>
            <CircleHelp size={25} color="#fff" />
          </View>

          <Menu size={25} color="#fff" />
        </View>
      </View>

      {text && (
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "700",
            textAlign: "left",
            alignSelf: "flex-start",
            paddingLeft: 25,
            paddingTop: 20,
          }}
        >
          {text}
        </Text>
      )}

      {toggleSearch && (
        <View style={{ paddingTop: 20 }}>
          <SearchBar
            value={"mobile-header-search"}
            onChange={(newValue) => {
              console.log("hello");
            }}
          />
        </View>
      )}
    </LinearGradient>
  );
}
