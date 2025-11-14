import { LucideIcon } from "lucide-react-native";
import { View, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type SocialService = {
  icon: LucideIcon;
  name: string;
};

type SocialServicesCategoriesProps = {
  socialServices: SocialService[];
  currentIndex: number;
  onSelect?: (index: number) => void;
};

const JILA_400 = "#7e0601"; // Use your jila-400 color hex

export default function SocialServicesCategories({
  socialServices,
  currentIndex,
  onSelect,
}: SocialServicesCategoriesProps) {
  return (
    <View className="flex flex-row w-full justify-center items-center bg-white-400 rounded-full py-[3px] px-[5px]">
      {socialServices.map((service, idx) => (
        <TouchableOpacity
          key={service.name}
          onPress={() => onSelect?.(idx)}
          activeOpacity={0.8}
          className={`flex-1 flex-col items-center justify-center`}
        >
          {idx === currentIndex ? (
            <LinearGradient
              className="flex flex-col w-full justify-center items-center rounded-full py-[3px]"
              colors={["#7E0601", "#AA4A2C"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: -1 }}
            >
              <View
                className={`${idx === currentIndex ? "text-white-400" : "text-jila-400"}`}
              >
                <service.icon />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  color: idx === currentIndex ? "#fff" : "#222",
                  fontSize: 14,
                }}
              >
                {service.name}
              </Text>
            </LinearGradient>
          ) : (
            <>
              <View
                className={`${idx === currentIndex ? "text-white-400" : "text-jila-400"}`}
              >
                <service.icon />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  color: idx === currentIndex ? "#fff" : "#222",
                  fontSize: 14,
                }}
              >
                {service.name}
              </Text>
            </>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
