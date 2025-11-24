import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react-native";
import { colors } from "@/colors";

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
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Icon width={24} height={24} fill={isClicked ? colors.black : "none"} />
      </TouchableOpacity>

      {type === "like" && numLikes !== undefined && <Text>{numLikes}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
});
