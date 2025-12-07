import React, { useState, useRef } from "react";
import { FilterDropdown } from "../components/FilterDropdown";
import { TTSItem, TTSController } from "@/controllers/TTSController";
import { AudioButtonHandle } from "@/components/AudioButton";
import SearchBar from "./SearchBar";
import { Check } from "lucide-react-native";
import { colors } from "@/colors";

type FilterDropdownSearchProps = {
  title: TTSItem;
  value: string;
  onChange: (value: string) => void;
  isFocused: boolean;
};

export const FilterDropdownSearch: React.FC<FilterDropdownSearchProps> = ({
  title,
  value,
  onChange,
  isFocused,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioButtonRef = useRef<AudioButtonHandle>(null);
  const titleTtsManager = new TTSController(() => {}, audioButtonRef);

  const handleSoundPress = async () => {
    if (isPlaying) {
      await titleTtsManager.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await titleTtsManager.playSequence([title]);
    await titleTtsManager.stop();
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
      <SearchBar
        placeholder="Search"
        value={value}
        onChange={onChange}
        isFocused={isFocused}
        style={{
          marginHorizontal: 16,
        }}
      />
    </FilterDropdown>
  );
};
