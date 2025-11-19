import { JSX } from "react";
import { TouchableOpacity, Text } from "react-native"; 
import JilaText from "./JilaText";

type SignUpProps = { 
  onPress: () => void;
};

export default function SignUpButton({
  onPress
}: SignUpProps): JSX.Element {
  
  return (
    <TouchableOpacity
      className="w-[225px] h-[78px] rounded-full cream-300 border-gray-300 border-[2px] justify-center items-center"
      onPress={onPress}
    >
      <JilaText className=" text-[1.75rem] font-semibold">Sign up</JilaText>
    </TouchableOpacity>
  );
}