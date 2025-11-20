import { LucideIcon } from "lucide-react-native";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/colors";

export type SocialService = {
  icon: LucideIcon;
  name: string;
};

type SocialServicesCategoriesProps = {
  socialServices: SocialService[];
  currentIndex: number;
  onSelect?: (index: number) => void;
};

export default function SocialServicesCategories({
  socialServices,
  currentIndex,
  onSelect,
}: SocialServicesCategoriesProps) {
  return (
    <View style={styles.container}>
      {socialServices.map((service, idx) => (
        <TouchableOpacity
          key={service.name}
          onPress={() => onSelect?.(idx)}
          activeOpacity={0.8}
          style={styles.button}
        >
          {idx === currentIndex ? (
            <LinearGradient
              style={styles.gradientContainer}
              colors={["#7E0601", "#AA4A2C"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
              <View className="mb-[2px]">
                <service.icon color="#fff" size={24} />
              </View>
              <Text className="text-white-400 text-[14px]">{service.name}</Text>
            </LinearGradient>
          ) : (
            <>
              <View className="mb-[2px]">
                <service.icon color={colors.jila[400]} size={24} />
              </View>
              <Text className="text-black text-[14px]">{service.name}</Text>
            </>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 9999,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  button: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientContainer: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    paddingVertical: 3,
  },
});
