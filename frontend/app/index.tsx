import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-3xl font-bold">Hello Jila!</Text>
      <Link href="/dev">dev page</Link>
    </View>
  );
}
