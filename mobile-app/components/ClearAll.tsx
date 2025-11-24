import { JSX } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Text from "./JilaText";
import { colors } from "@/colors";

type ClearButtonProps = {
  onPress: () => void;
};

export default function ClearButton({
  onPress,
}: ClearButtonProps): JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>Clear all</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 105,
    height: 41,
    borderRadius: 20.5,
    borderColor: colors.jila[400],
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.jila[400],
    fontWeight: "600",
  },
});
