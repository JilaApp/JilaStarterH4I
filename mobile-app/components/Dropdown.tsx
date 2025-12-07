import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

interface DropdownProps {
  text: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  text,
  options,
  selected,
  onSelect,
  disabled = false,
  placeholder,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setOpen((prev) => !prev)}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <View
            style={[
              styles.trigger,
              open ? styles.triggerOpen : styles.triggerClosed,
              disabled && styles.triggerDisabled,
            ]}
          >
            <Text
              style={[
                selected ? styles.textSelected : styles.textPlaceholder,
                disabled && styles.textDisabled,
              ]}
            >
              {selected || placeholder || text}
            </Text>
            {open ? (
              <ChevronDown
                size={sizes.icon.md}
                color={disabled ? colors.gray[400] : colors.black}
              />
            ) : (
              <ChevronRight
                size={sizes.icon.md}
                color={disabled ? colors.gray[400] : colors.black}
              />
            )}
          </View>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdown}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {options.map((option, index) => {
                const isSelected = option === selected;
                const isFirst = index === 0;
                const isLast = index === options.length - 1;

                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onSelect(option);
                      setOpen(false);
                    }}
                  >
                    <View
                      style={[
                        styles.option,
                        !isFirst && styles.optionBorderTop,
                        isSelected
                          ? styles.optionSelected
                          : styles.optionUnselected,
                        isFirst && styles.optionRoundedTop,
                        isLast && styles.optionRoundedBottom,
                      ]}
                    >
                      <Text style={{ fontSize: sizes.fontSize.base }}>
                        {option}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    width: "100%",
    borderRadius: sizes.borderRadius.md,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 1,
    borderRadius: sizes.borderRadius.md,
    paddingHorizontal: sizes.spacing.md,
    paddingVertical: sizes.spacing.sm,
    backgroundColor: colors.white[400],
  },
  triggerOpen: {
    borderColor: colors.jila[400],
  },
  triggerClosed: {
    borderColor: colors.gray[400],
  },
  triggerDisabled: {
    backgroundColor: colors.gray[200],
    borderColor: colors.gray[300],
  },
  textSelected: {
    color: colors.gray[800],
  },
  textPlaceholder: {
    color: colors.gray[400],
  },
  textDisabled: {
    color: colors.gray[400],
  },
  dropdown: {
    position: "absolute",
    left: 0,
    marginTop: sizes.spacing.md,
    width: "100%",
    backgroundColor: colors.white[400],
    zIndex: 1001,
    top: "100%",
    borderRadius: sizes.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[400],
    overflow: "hidden",
  },
  scrollView: {
    maxHeight: 144,
  },
  option: {
    paddingHorizontal: sizes.spacing.md,
    paddingVertical: sizes.spacing.sm,
  },
  optionBorderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[400],
  },
  optionSelected: {
    backgroundColor: colors.gray[200],
  },
  optionUnselected: {
    backgroundColor: colors.white[400],
  },
  optionRoundedTop: {
    borderTopLeftRadius: sizes.borderRadius.md,
    borderTopRightRadius: sizes.borderRadius.md,
  },
  optionRoundedBottom: {
    borderBottomLeftRadius: sizes.borderRadius.md,
    borderBottomRightRadius: sizes.borderRadius.md,
  },
});

export default Dropdown;
