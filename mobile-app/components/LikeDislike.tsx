import { View, TouchableOpacity, Text } from "react-native";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react-native";

type LikeDislikeProps = {
  numLikes?: number;
  isClicked?: boolean;
  setIsClicked: (clicked: boolean) => void;
  type: "like" | "dislike";
};

export default function LikeDislike({
  numLikes,
  isClicked,
  setIsClicked,
  type,
}: LikeDislikeProps) {
  const handlePress = () => {
    setIsClicked(!isClicked);
  };

  const Icon = type === "like" ? ThumbsUpIcon : ThumbsDownIcon;

  return (
    <View className="flex-col items-center">
      <TouchableOpacity onPress={handlePress}>
        <Icon
          className="w-[24px] h-[24px]"
          fill={isClicked ? "black" : "none"}
        />
      </TouchableOpacity>

      {type === "like" && numLikes !== undefined && <Text>{numLikes}</Text>}
    </View>
  );
}
