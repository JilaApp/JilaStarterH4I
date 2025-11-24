import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/colors";
import { useRouter } from "expo-router";

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
    fontSize: 18,
    lineHeight: 25,
    color: colors.jila[400],
    textAlign: "center",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
});
