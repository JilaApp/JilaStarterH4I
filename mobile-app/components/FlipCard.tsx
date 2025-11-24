import { MapPin, Phone } from "lucide-react-native";
import React, { ReactNode } from "react";
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
      <View style={cardStyles.cardContentLeft}>
        <Text style={cardStyles.descriptionText}>{description}</Text>
      </View>
      <View>
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
      <View>
        <AudioButton
          audioSource={require("../assets/audio/sample.mp3")}
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
      <View style={flipCardStyles.relativeContainer}>
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
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: colors.gray[300],
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
  },
  cardContentLeft: {
    flex: 1,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "600",
  },
  descriptionText: {
    fontSize: 18,
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
