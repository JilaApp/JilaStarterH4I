import { View, TouchableOpacity, Text } from "react-native";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react-native";

type LikeDislikeProps = {
  numLikes?: number;
  setNumLikes?: (likes: number) => void;
  isClicked?: boolean;
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
    const hasCounter =
      typeof numLikes === "number" && typeof setNumLikes === "function";

    if (isClicked) {
      if (hasCounter) {
        setNumLikes(numLikes - 1);
      }
      setIsClicked(false);
    } else {
      if (hasCounter) {
        setNumLikes(numLikes + 1);
      }
      setIsClicked(true);
    }
  };

  const Icon = type === "like" ? ThumbsUpIcon : ThumbsDownIcon;

  return (
    <View className="flex-col items-center">
      <TouchableOpacity onPress={handlePress}>
        <Icon
          className="w-[24px] h-[24px]"
          fill={isClicked ? "black" : "none"}
        ></Icon>
      </TouchableOpacity>

      {typeof numLikes === "number" && typeof setNumLikes === "function" ? (
        <Text className="w-[8px] h-[15px]">{numLikes}</Text>
      ) : null}
    </View>
  );
}
