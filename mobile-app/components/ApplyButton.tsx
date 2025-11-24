import { JSX } from "react";
import { TouchableOpacity } from "react-native";
import Text from "./JilaText";
import { SquareArrowOutUpRightIcon } from "lucide-react-native";

type ApplyProps = {
  onPress: () => void;
};

export default function ApplyButton({ onPress }: ApplyProps): JSX.Element {
  return (
    <TouchableOpacity
      className="flex flex-row gap-[5px] w-[116px] h-[41px] rounded-full bg-jila-400 border-jila-400 border-[2px] justify-center items-center"
      onPress={onPress}
    >
      <Text className="text-white-400 font-semibold">Apply</Text>
      <SquareArrowOutUpRightIcon color="white" size={14} />
    </TouchableOpacity>
  );
}
