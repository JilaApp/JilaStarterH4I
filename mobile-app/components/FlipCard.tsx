import { MapPin, Phone, Pointer } from "lucide-react-native";
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
import AudioButton from "./AudioButton";
import { colors } from "@/colors";

interface ResourceCardProps {
  title: string;
  phone: string;
  address?: string;
  description: string;
}
const ResourceCardBack = ({ description }: ResourceCardProps) => {
  return (
    <View style={cardStyles.cardContainer}>
      <View style={cardStyles.cardContentLeftBack}>
        <Text style={cardStyles.descriptionText}>{description}</Text>
      </View>
      <View style={styles.rightContainerBack}>
        <AudioButton
          audioSource={require("../assets/audio/sample.mp3")}
          variant={"default"}
        />
      </View>
    </View>
  );
};

const ResourceCardFront = ({ title, phone, address }: ResourceCardProps) => {
  return (
    <View style={cardStyles.cardContainer}>
      <View style={cardStyles.cardContentLeft}>
        <Text style={cardStyles.titleText}>{title}</Text>
        <View style={cardStyles.infoSection}>
          <View style={cardStyles.infoRows}>
            <View style={cardStyles.infoRow}>
              <Phone color={colors.jila[400]} />
              <Text style={cardStyles.infoText}>{phone}</Text>
            </View>
            {address && (
              <View style={[cardStyles.infoRow, cardStyles.addressRow]}>
                <MapPin color={colors.jila[400]} />
                <Text style={cardStyles.infoText}>{address}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <AudioButton
          audioSource={require("../assets/audio/sample.mp3")}
          variant={"default"}
        />
      </View>
      <View style={styles.pointerContainer}>
        <Pointer size={24} color={colors.gray[400]} />
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
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (!cardHeight) {
      setCardHeight(height);
    }
  };

  return (
    <View style={styles.container}>
      <FlipCard
        isFlipped={isFlipped}
        cardStyle={[styles.flipCard, cardHeight ? { height: cardHeight } : {}]}
        FlippedContent={<ResourceCardBack {...props} />}
        RegularContent={<ResourceCardFront {...props} />}
        onLayout={handleLayout}
      />
    </View>
  );
}

const FlipCard = ({
  isFlipped,
  cardStyle,
  direction = "y",
  duration = 500,
  RegularContent,
  FlippedContent,
  onLayout,
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
      <View style={flipCardStyles.relativeContainer}>
        <Animated.View
          style={[cardStyle, regularCardAnimatedStyle]}
          onLayout={onLayout}
        >
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
  relativeContainer: {
    position: "relative",
  },
  flippedCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const cardStyles = StyleSheet.create({
  cardContainer: {
    padding: 28,
    alignItems: "stretch",
    justifyContent: "space-between",
    borderColor: colors.gray[300],
    borderWidth: 1,
    borderRadius: 24,
    flexDirection: "row",
    width: "100%",
    position: "relative",
    gap: 8,
    flex: 1,
    backgroundColor: colors.white[400],
  },
  cardContentLeft: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  cardContentLeftBack: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
    alignSelf: "flex-start",
  },
  descriptionText: {
    fontSize: 18,
    alignSelf: "flex-start",
  },
  infoSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  infoRows: {
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressRow: {
    paddingTop: 4,
  },
  infoText: {
    marginLeft: 8,
    color: colors.jila[400],
    flexShrink: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  flipCard: {
    backfaceVisibility: "hidden",
    width: "100%",
  },
  rightContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 16,
  },
  rightContainerBack: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  pointerContainer: {
    position: "absolute",
    bottom: 28,
    right: 28,
  },
});
