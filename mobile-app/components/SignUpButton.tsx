import { JSX } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Text from "./JilaText";
import { colors } from "@/colors";

type SignUpProps = {
  onPress: () => void;
};

export default function SignUpButton({ onPress }: SignUpProps): JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>Sign up</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 225,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.cream[300],
    borderColor: colors.gray[300],
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "600",
  },
});
