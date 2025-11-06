import { View, TouchableOpacity, Text } from "react-native";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react-native";

type LikeDislikeProps = {
  numLikes: number;
  setNumLikes: (likes: number) => void;
  isClicked: boolean;
  setIsClicked: (clicked: boolean) => void;
  type: "like" | "dislike";
};

export default function LikeDislike({
  numLikes,
  setNumLikes,
  isClicked,
  setIsClicked,
  type,
}: LikeDislikeProps) {
  const handlePress = () => {
    if (isClicked) {
      setNumLikes(numLikes - 1);
      setIsClicked(false);
    } else {
      setNumLikes(numLikes + 1);
      setIsClicked(true);
    }
  };

  const Icon = type === "like" ? ThumbsUpIcon : ThumbsDownIcon;

  return (
    <View className="flex-col items-center">
      <TouchableOpacity>
        <Icon
          onPress={handlePress}
          className="w-[24px] h-[24px]"
          fill={isClicked ? "black" : "none"}
        ></Icon>
      </TouchableOpacity>

      <Text className="w-[8px] h-[15px]">{numLikes}</Text>
    </View>
  );
}
