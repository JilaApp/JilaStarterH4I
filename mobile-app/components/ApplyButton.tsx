import { JSX } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Text from "./JilaText";
import { SquareArrowOutUpRightIcon } from "lucide-react-native";
import { colors } from "@/colors";

type ApplyProps = {
  onPress: () => void;
};

export default function ApplyButton({ onPress }: ApplyProps): JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>Apply</Text>
      <SquareArrowOutUpRightIcon color={colors.white[400]} size={14} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 5,
    width: 116,
    height: 41,
    borderRadius: 20.5,
    backgroundColor: colors.jila[400],
    borderColor: colors.jila[400],
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white[400],
    fontWeight: "600",
  },
});
