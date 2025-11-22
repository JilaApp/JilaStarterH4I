import { Link } from "expo-router";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import React from "react";
import Header from "@/components/Header";

export default function DevPage() {
  return (
    <>
      <Header
        text="Hello Anna! What would you like to learn today?"
        toggleSearch={false}
      />
      <View>
        <Link href="/auth/sign-up">sign in</Link>
        <Text className="text-3xl font-bold">Nativewind Styles:</Text>
        <Text className="page-title-text">page-title-text</Text>
        <Text className="components-text">components-text</Text>
        <Text className="link-text">link-text</Text>

        <View className="bg-jila-400">
          <Text className="text-white-400">bg-jila-400</Text>
        </View>
        <Text className="bg-jila-300">bg-jila-300</Text>
        <Text className="bg-orange-400">bg-orange-400</Text>
        <Text className="bg-orange-300">bg-orange-300</Text>
        <Text className="bg-yellow-400">bg-yellow-400</Text>
        <Text className="bg-cream-300">bg-cream-300</Text>
        <Text className="bg-green-400">bg-green-400</Text>
        <Text className="bg-teal-400">bg-teal-400</Text>
        <Text className="bg-teal-300">bg-teal-300</Text>
        <Text className="bg-error-400">bg-error-400</Text>
        <Text className="bg-error-300">bg-error-300</Text>
        <Text className="bg-error-200">bg-error-200</Text>
        <View className="bg-type-400">
          <Text className="text-white-400">bg-type-400</Text>
        </View>
        <Text className="bg-white-400">bg-white-400</Text>
        <Text className="bg-gray-400">bg-gray-400</Text>
        <Text className="bg-gray-300">bg-gray-300</Text>
        <Text className="bg-gray-200">bg-gray-200</Text>

        {/* coordinates for start and end positions
        top-left corner: { x: 0, y: 0}
        top-right corner: { x: 1, y: 0}
        bottom-left corner: { x: 1, y: 0}
        bottom-right corner: { x: 1, y: 1} */}

        {/* gradient-green: green-400 & yellow-??? */}
        <LinearGradient
          colors={["#90BE6D", "#FFE078"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text>gradient-green (left-diagonal)</Text>
        </LinearGradient>

        {/* gradient-red: jila-400 & orange-400 */}
        <LinearGradient
          colors={["#7E0601", "#E8965B"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text>gradient-red (right-diagonal)</Text>
        </LinearGradient>

        {/* gradient-blue: teal-400 & green-300 */}
        <LinearGradient
          colors={["#577590", "#CDE6B9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text>gradient-blue (vertical)</Text>
        </LinearGradient>

        {/* gradient-yellow: yellow-400 & orange-400 */}
        <LinearGradient
          colors={["#EFBF6A", "#E8965B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text>gradient-yellow (horizontal)</Text>
        </LinearGradient>
      </View>
    </>
  );
}
