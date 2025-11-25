import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/colors";
import { useRouter } from "expo-router";
import { sizes } from "@/constants/sizes";

type LinkProps = {
  path: string;
  children: string;
};

export default function Link({ path, children }: LinkProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(path);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Text style={styles.linkText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linkText: {
    fontFamily: "Fustat",
    fontWeight: "700",
    fontSize: sizes.fontSize.base,
    lineHeight: sizes.fontSize.xl + 1,
    color: colors.jila[400],
    textAlign: "center",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
});
