import { LucideIcon } from "lucide-react-native";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

export type SocialService = {
  icon: LucideIcon;
  name: string;
};

type SocialServicesCategoriesProps = {
  socialServices: SocialService[];
  currentIndex: number | null;
  onSelect?: (index: number | null) => void;
};

export default function SocialServicesCategories({
  socialServices,
  currentIndex,
  onSelect,
}: SocialServicesCategoriesProps) {
  return (
    <View style={styles.container}>
      {socialServices.map((service, idx) => {
        const isSelected = idx === currentIndex;

        return (
          <TouchableOpacity
            key={service.name}
            onPress={() => onSelect?.(isSelected ? null : idx)}
            activeOpacity={0.8}
            style={styles.button}
          >
            {isSelected ? (
              <LinearGradient
                style={styles.gradientContainer}
                colors={[colors.jila[400], colors.orange[400]]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
              >
                <View style={styles.iconContainer}>
                  <service.icon
                    color={colors.white[400]}
                    size={sizes.icon.md}
                  />
                </View>
                <Text style={styles.activeText}>{service.name}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveContainer}>
                <View style={styles.iconContainer}>
                  <service.icon color={colors.jila[400]} size={sizes.icon.md} />
                </View>
                <Text style={styles.inactiveText}>{service.name}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white[400],
    borderRadius: sizes.borderRadius.full,
    paddingVertical: sizes.spacing.xxs,
    paddingHorizontal: sizes.spacing.xs,
  },
  button: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: sizes.touch.minTarget,
  },
  gradientContainer: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: sizes.borderRadius.full,
    paddingVertical: sizes.spacing.xs,
    minHeight: sizes.touch.minTarget,
  },
  inactiveContainer: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: sizes.spacing.xs,
    minHeight: sizes.touch.minTarget,
  },
  iconContainer: {
    marginBottom: 1,
  },
  activeText: {
    color: colors.white[400],
    fontSize: sizes.fontSize.xs,
  },
  inactiveText: {
    color: colors.black,
    fontSize: sizes.fontSize.xs,
  },
});
