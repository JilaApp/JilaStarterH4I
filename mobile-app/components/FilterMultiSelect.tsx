import { colors } from "@/colors";
import { TTSItem } from "@/controllers/TTSController";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Check } from "lucide-react-native";

interface FilterMultiSelectProps {
  options: TTSItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  highlightedId: string | null;
}

export const FilterMultiSelect = ({
  options,
  selected,
  onToggle,
  highlightedId,
}: FilterMultiSelectProps) => {
  const isTwoColumn = options.length > 3;

  let leftColumn = options;
  let rightColumn: TTSItem[] = [];

  if (isTwoColumn) {
    const midpoint = Math.ceil(options.length / 2);
    leftColumn = options.slice(0, midpoint);
    rightColumn = options.slice(midpoint);
  }

  const renderOption = (option: TTSItem) => (
    <TouchableOpacity
      key={option.id}
      style={styles.option}
      onPress={() => onToggle(option.id)}
    >
      <View
        style={[
          styles.content,
          highlightedId === option.id && styles.contentHighlighted,
        ]}
      >
        <View
          style={[
            styles.checkbox,
            selected.has(option.id) && styles.checkboxSelected,
          ]}
        >
          {selected.has(option.id) && (
            <Check size={16} color={colors.white[400]} strokeWidth={3} />
          )}
        </View>
        <Text style={styles.optionLabel}>{option.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.optionsList} scrollEnabled={isTwoColumn}>
      {isTwoColumn ? (
        <View style={styles.twoColumnContainer}>
          <View style={styles.column}>{leftColumn.map(renderOption)}</View>
          <View style={styles.column}>{rightColumn.map(renderOption)}</View>
        </View>
      ) : (
        leftColumn.map(renderOption)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  optionsList: {
    maxHeight: 200,
    gap: 10,
  },
  twoColumnContainer: {
    flexDirection: "row",
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  contentHighlighted: {
    backgroundColor: "#D4928F66",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.jila[400],
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.jila[400],
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.black,
  },
});
