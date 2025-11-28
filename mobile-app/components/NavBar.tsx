import { useRouter, usePathname } from "expo-router";
import { Pressable, View, StyleSheet } from "react-native";
import { House, Briefcase, BookOpen } from "lucide-react-native";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

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
        style={styles.iconContainer}
      >
        <Briefcase color={colors.white[400]} size={sizes.icon.lg} />
        {pathname === "/job" && <View style={styles.activeIndicator} />}
      </Pressable>

      <Pressable
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        onPress={handleHomePress}
        style={styles.iconContainer}
      >
        <House color={colors.white[400]} size={sizes.icon.lg} />
        {pathname === "/" && <View style={styles.activeIndicator} />}
      </Pressable>

      <Pressable
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        onPress={handleSocialPress}
        style={styles.iconContainer}
      >
        <BookOpen color={colors.white[400]} size={sizes.icon.lg} />
        {pathname === "/social" && <View style={styles.activeIndicator} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingVertical: sizes.spacing.lg,
    alignItems: "center",
    backgroundColor: colors.jila[400],
  },
  iconContainer: {
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
    height: sizes.icon.lg + 8,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -4,
    width: sizes.icon.lg - 4,
    height: 4,
    backgroundColor: colors.white[400],
    borderRadius: 5,
  },
});
