import { JSX } from "react";
import { TouchableOpacity } from "react-native";
import Text from "./JilaText";

type ClearButtonProps = {
  onPress: () => void;
};

export default function ClearButton({
  onPress,
}: ClearButtonProps): JSX.Element {
  return (
    <TouchableOpacity
      className="w-[105px] h-[41px] rounded-full border-jila-400 border justify-center items-center"
      onPress={onPress}
    >
      <Text className="text-jila-400 font-semibold">Clear all</Text>
    </TouchableOpacity>
  );
}
