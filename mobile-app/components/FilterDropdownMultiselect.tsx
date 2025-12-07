import React, { useState, useRef } from "react";
import { FilterDropdown } from "../components/FilterDropdown";
import { FilterMultiSelect } from "../components/FilterMultiSelect";
import { TTSItem, TTSController } from "@/controllers/TTSController";
import { AudioButtonHandle } from "@/components/AudioButton";
import { TouchableOpacity, View, Text } from "react-native";
import { Audio } from "expo-av";

type FilterDropdownMultiselectProps = {
  title: TTSItem;
  options: TTSItem[];
  selected: Set<string>;
  onSelectedChange: (selected: Set<string>) => void;
};

export const FilterDropdownMultiselect: React.FC<
  FilterDropdownMultiselectProps
> = ({ title, options, selected, onSelectedChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const audioButtonRef = useRef<AudioButtonHandle>(null);
  const titleTTSController = new TTSController(() => {}, audioButtonRef);
  const optionTTSController = new TTSController(
    setHighlightedId,
    audioButtonRef,
  );

  const handleSoundPress = async () => {
    if (isPlaying) {
      await titleTTSController.stop();
      await optionTTSController.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await titleTTSController.playSequence([title]);

    if (!isOpen) {
      await titleTTSController.stop();
      setIsPlaying(false);
      return;
    }

    await optionTTSController.playSequence(options);
    await optionTTSController.stop();
    setIsPlaying(false);
  };

  const handleToggle = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    onSelectedChange(newSelected);
  };

  return (
    <FilterDropdown
      title={title.text}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSoundPress={handleSoundPress}
      audioButtonRef={audioButtonRef}
    >
      <FilterMultiSelect
        options={options}
        selected={selected}
        onToggle={handleToggle}
        highlightedId={highlightedId}
      />
    </FilterDropdown>
  );
};
