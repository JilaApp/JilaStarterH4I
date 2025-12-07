import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AudioButton, { AudioButtonHandle } from "./AudioButton";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { colors } from "@/colors";

interface FilterDropdownProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  onSoundPress?: () => void;
  audioButtonRef?: React.RefObject<AudioButtonHandle | null>;
}

export const FilterDropdown = ({
  title,
  isOpen,
  onToggle,
  children,
  onSoundPress,
  audioButtonRef,
}: FilterDropdownProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.titleContainer} onPress={onToggle}>
          <Text style={styles.title}>{title}</Text>
          <AudioButton ref={audioButtonRef} onPress={onSoundPress} />
          {isOpen ? (
            <ChevronDown
              size={20}
              color={colors.black}
              style={{ marginLeft: "auto" }}
            />
          ) : (
            <ChevronRight
              size={20}
              color={colors.black}
              style={{ marginLeft: "auto" }}
            />
          )}
        </TouchableOpacity>
      </View>

      {isOpen && <View style={styles.contentContainer}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  chevron: {
    fontSize: 12,
    color: "#666",
  },
  contentContainer: {
    paddingVertical: 12,
  },
});
