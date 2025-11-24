import { useRouter, usePathname } from "expo-router";
import { Pressable, View, StyleSheet } from "react-native";
import { House, Briefcase, BookOpen } from "lucide-react-native";
import { colors } from "@/colors";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleHomePress = () => {
    if (pathname !== "/") {
      router.replace("/");
    }
  };

  const handleJobPress = () => {
    if (pathname !== "/job") {
      router.replace("/job");
    }
  };

  const handleSocialPress = () => {
    if (pathname !== "/social") {
      router.replace("/social");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        onPress={handleJobPress}
      >
        <Briefcase color={colors.white[400]} size={35} />
      </Pressable>

      <Pressable
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        onPress={handleHomePress}
      >
        <House color={colors.white[400]} size={35} />
      </Pressable>

      <Pressable
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        onPress={handleSocialPress}
      >
        <BookOpen color={colors.white[400]} size={35} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 82,
    width: "100%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.jila[400],
  },
});
