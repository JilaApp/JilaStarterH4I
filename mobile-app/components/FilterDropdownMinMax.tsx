import React, { useState, useRef } from "react";
import { FilterDropdown } from "../components/FilterDropdown";
import { TTSItem, TTSController } from "@/controllers/TTSController";
import { AudioButtonHandle } from "@/components/AudioButton";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { colors } from "@/colors";

type FilterDropdownMinMaxProps = {
  title: TTSItem;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
};

const MIN_AUDIO = require("../assets/audio/short_sample.mp3");
const MAX_AUDIO = require("../assets/audio/short_sample.mp3");

export const FilterDropdownMinMax: React.FC<FilterDropdownMinMaxProps> = ({
  title,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  const audioButtonRef = useRef<AudioButtonHandle>(null);
  const ttsControllerRef = useRef(
    new TTSController(setHighlightedField, audioButtonRef),
  );
  const titleTtsControllerRef = useRef(
    new TTSController(() => {}, audioButtonRef),
  );

  const handleSoundPress = async () => {
    if (isPlaying) {
      await titleTtsControllerRef.current.stop();
      await ttsControllerRef.current.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await titleTtsControllerRef.current.playSequence([title]);

    // If dropdown is open, play min and max fields
    if (isOpen) {
      await ttsControllerRef.current.playSequence([
        {
          id: "min",
          text: "Minimum",
          audioSource: MIN_AUDIO,
        },
        {
          id: "max",
          text: "Maximum",
          audioSource: MAX_AUDIO,
        },
      ]);
      await ttsControllerRef.current.stop();
      await titleTtsControllerRef.current.stop();
      setIsPlaying(false);
      return;
    }

    await ttsControllerRef.current.stop();
    await titleTtsControllerRef.current.stop();
    setIsPlaying(false);
  };

  return (
    <FilterDropdown
      title={title.text}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSoundPress={handleSoundPress}
      audioButtonRef={audioButtonRef}
    >
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.labelText,
              highlightedField === "min" && styles.fieldHighlighted,
            ]}
          >
            Minimum
          </Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              value={minValue}
              onChangeText={onMinChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray[300]}
            />
          </View>
        </View>

        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.labelText,
              highlightedField === "max" && styles.fieldHighlighted,
            ]}
          >
            Maximum
          </Text>

          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              value={maxValue}
              onChangeText={onMaxChange}
              keyboardType="numeric"
              placeholder="10000"
              placeholderTextColor={colors.gray[300]}
            />
          </View>
        </View>
      </View>
    </FilterDropdown>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 16,
  },
  inputField: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white[400],
  },
  fieldHighlighted: {
    backgroundColor: "#D4928F66",
  },
  labelContainer: {
    flex: 1,
    gap: 3,
  },
  labelDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[300],
    marginRight: 6,
  },
  labelText: {
    fontSize: 18,
    fontWeight: "400",
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  input: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.black,
    padding: 0,
    textAlign: "center",
  },
});
