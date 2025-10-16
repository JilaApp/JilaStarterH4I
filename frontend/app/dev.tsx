import { Link } from "expo-router";
import { View } from "react-native";

export default function DevPage() {
  return (
    <View>
      <Link href="/auth/sign-up">sign in</Link>
    </View>
  );
}
