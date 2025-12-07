import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
// import Text from "@/components/JilaText";

interface SearchableDropdownProps {
  text: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
  placeholder?: string;
  citySearch: boolean;
  onSearchChange?: (text: string) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  text,
  options,
  selected,
  onSelect,
  disabled = false,
  placeholder,
  citySearch,
  onSearchChange,
}: SearchableDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayValue = isEditing ? searchQuery : selected || "";

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={[
            styles.searchContainer,
            open && !disabled && styles.searchContainerOpen,
            disabled && styles.searchContainerDisabled,
          ]}
        >
          <Search size={sizes.icon.md} color={colors.gray[400]} />
          <TextInput
            placeholder={placeholder || text}
            placeholderTextColor={colors.gray[400]}
            value={displayValue}
            onChangeText={(text) => {
              setSearchQuery(text);
              setIsEditing(true);
              if (citySearch && onSearchChange) {
                onSearchChange(text);
              }
            }}
            onFocus={() => {
              if (!disabled) {
                setOpen(true);
                setIsEditing(true);
                if (selected && !searchQuery) {
                  setSearchQuery(selected);
                }
              }
            }}
            style={styles.searchInput}
            selectionColor={colors.jila[400]}
            editable={!disabled}
          />
          {(searchQuery.length > 0 || selected) && !disabled && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setIsEditing(true);
                onSelect("");
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={sizes.icon.md} color={colors.black} />
            </TouchableOpacity>
          )}
        </View>

        {open && filteredOptions.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {filteredOptions.map((option, index) => {
                const isSelected = option === selected;
                const isFirst = index === 0;
                const isLast = index === filteredOptions.length - 1;

                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onSelect(option);
                      setSearchQuery("");
                      setIsEditing(false);
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
                      <Search
                        size={sizes.icon.md}
                        color={colors.gray[400]}
                        style={styles.searchIcon}
                      />
                      <Text style={styles.optionText}>{option}</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sizes.spacing.md,
    paddingVertical: sizes.spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[400],
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.white[400],
  },
  searchContainerOpen: {
    borderColor: colors.jila[400],
  },
  searchContainerDisabled: {
    backgroundColor: colors.gray[200],
    borderColor: colors.gray[300],
  },
  searchInput: {
    flex: 1,
    marginLeft: sizes.spacing.sm,
    fontSize: sizes.fontSize.base,
    color: colors.black,
    paddingVertical: 0,
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
    maxHeight: 85,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
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
  searchIcon: {
    marginRight: sizes.spacing.sm,
  },
  optionText: {
    color: colors.black,
  },
});

export default SearchableDropdown;
