import { MapPin, Phone } from "lucide-react-native";
import React, { ReactNode, useState } from "react";
import { Pressable, View, StyleSheet, LayoutChangeEvent } from "react-native";
import Text from "./JilaText";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioButton from "./AudioButton";

interface ResourceCardProps {
  title: string;
  phone: string;
  address?: string;
  description: string;
}
const ResourceCardBack = ({ description }: ResourceCardProps) => {
  return (
    <View className="p-7 h-full items-center justify-between border-gray-300 border-[1px] rounded-xl flex-row">
      <View className="flex-1">
        <Text className="text-lg">{description}</Text>
      </View>
      <View>
        <AudioButton
          audioSource={require("../components/sample.mp3")}
          variant={"default"}
        />
      </View>
    </View>
  );
};

const ResourceCardFront = ({ title, phone, address }: ResourceCardProps) => {
  return (
    <View className="p-7 h-full justify-between border-gray-300 border-[1px] rounded-xl flex-row">
      <View className="flex-1">
        <Text className="text-3xl font-semibold">{title}</Text>
        <View className="text-jila-400 flex flex-row items-center">
          <Phone color="#7E0601" />
          <Text className="ml-2 text-jila-400">{phone}</Text>
        </View>
        {address && (
          <View className="text-jila-400 flex flex-row items-center pt-1">
            <MapPin color="#7E0601" />
            <Text className="ml-2 text-jila-400">{address}</Text>
          </View>
        )}
      </View>
      <View>
        <AudioButton
          audioSource={require("../components/sample.mp3")}
          variant={"default"}
        />
      </View>
    </View>
  );
};

interface FlipCardProps {
  isFlipped: SharedValue<boolean>;
  cardStyle: any;
  direction?: string;
  duration?: number;
  RegularContent: ReactNode;
  FlippedContent: ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export function ResourceCard(props: ResourceCardProps) {
  const isFlipped = useSharedValue(false);

  return (
    <SafeAreaView style={styles.container}>
      <FlipCard
        isFlipped={isFlipped}
        cardStyle={styles.flipCard}
        FlippedContent={<ResourceCardBack {...props} />}
        RegularContent={<ResourceCardFront {...props} />}
      />
    </SafeAreaView>
  );
}

const FlipCard = ({
  isFlipped,
  cardStyle,
  direction = "y",
  duration = 500,
  RegularContent,
  FlippedContent,
}: FlipCardProps) => {
  const handlePress = () => {
    isFlipped.value = !isFlipped.value;
  };

  const isDirectionX = direction === "x";

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  return (
    <Pressable onPress={handlePress}>
      <View style={{ position: "relative" }}>
        <Animated.View style={[cardStyle, regularCardAnimatedStyle]}>
          {RegularContent}
        </Animated.View>
        <Animated.View
          style={[
            flipCardStyles.flippedCard,
            cardStyle,
            flippedCardAnimatedStyle,
          ]}
        >
          {FlippedContent}
        </Animated.View>
      </View>
    </Pressable>
  );
};

const flipCardStyles = StyleSheet.create({
  flippedCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCard: {
    backfaceVisibility: "hidden",
    width: 300,
  },
});
