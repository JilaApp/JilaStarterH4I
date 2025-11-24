import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import AudioButton from "@/components/AudioButton";
import JilaText from "@/components/JilaText";
import { Check } from "lucide-react-native";
import { colors } from "@/colors";

type AudioSource = number | { uri: string };

interface SelectOption {
  id: string;
  title: string;
  audioSource: AudioSource;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

export default function Select({
  options,
  selected,
  onSelect,
  className,
}: SelectProps) {
  const customStyle: ViewStyle = className
    ? { width: 275, height: 45 }
    : { width: 275, height: 45 };

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option.id;
        const disabled = option.disabled ?? false;

        const handlePress = () => {
          if (!disabled) {
            onSelect(option.id);
          }
        };

        return (
          <TouchableOpacity
            key={option.id}
            onPress={handlePress}
            disabled={disabled}
          >
            <View
              style={[
                styles.option,
                isSelected ? styles.optionSelected : styles.optionUnselected,
                disabled && styles.optionDisabled,
                customStyle,
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.leftContent}>
                  <View style={styles.titleContainer}>
                    <JilaText
                      style={[styles.title, disabled && styles.titleDisabled]}
                    >
                      {option.title}
                    </JilaText>
                  </View>
                  <View style={styles.audioContainer}>
                    <AudioButton
                      audioSource={option.audioSource}
                      disabled={disabled}
                    />
                  </View>
                </View>
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Check size={25} color={colors.jila[400]} />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 25,
  },
  option: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
  },
  optionSelected: {
    borderColor: colors.jila[400],
  },
  optionUnselected: {
    borderColor: colors.gray[300],
  },
  optionDisabled: {
    opacity: 1,
  },
  optionContent: {
    flexDirection: "row",
    padding: 15,
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  titleDisabled: {
    color: colors.gray[300],
  },
  audioContainer: {
    flexDirection: "row",
  },
  checkContainer: {
    marginLeft: 15,
  },
});
