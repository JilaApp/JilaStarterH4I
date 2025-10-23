import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import SearchBar from "@/components/SearchBar";

export default function App() {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <View className="flex-1 justify-center items-left bg-white">
      <Text className="text-3xl font-bold">Hello Jila!</Text>
      <Link href="/dev">dev page</Link>
      <SearchBar value={searchValue} onChange={setSearchValue} />
    </View>
  );
}
