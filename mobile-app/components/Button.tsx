import { Text, Pressable, StyleSheet } from "react-native";
import { colors } from "@/colors";

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export function Button({ text, onPress }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.jila[400],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  text: {
    color: colors.white[400],
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 40,
    textAlign: "center",
  },
});
