import { View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import SearchBar from "./SearchBar";
import React from "react";

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
            <Image
              source={require("../assets/images/volume.png")}
              style={{ width: 25, height: 25 }}
            />
          </View>

          <View style={{ paddingRight: 10 }}>
            <Image
              source={require("../assets/images/question.png")}
              style={{ width: 25, height: 25 }}
            />
          </View>

          <Image
            source={require("../assets/images/menu.png")}
            style={{ width: 25, height: 25 }}
          />
        </View>
      </View>

      <Text
        style={{
          color: "#fff",
          fontSize: "18",
          fontWeight: "700",
          textAlign: "left",
          alignSelf: "flex-start",
          paddingLeft: "25",
          paddingTop: "20",
        }}
      >
        {text ?? ""}
      </Text>

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
