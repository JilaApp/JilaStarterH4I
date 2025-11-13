import { useRouter, usePathname } from "expo-router";
import { View } from "react-native";
import { House, Briefcase, BookOpen } from "lucide-react-native";
import colors from "@/colors";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleHomePress = () => {
    if (pathname !== "/") {
      router.replace("/");
    }
  };

  const handleJobPress = () => {
    if (pathname !== "/job") {
      router.replace("/job");
    }
  };

  const handleSocialPress = () => {
    if (pathname !== "/social") {
      router.replace("/social");
    }
  };

  return (
    <View className="flex-row gap-[82px] w-[393px] h-[72px] items-center justify-center bg-jila-400">
      <Briefcase
        color={colors.white[400]}
        size={35}
        onPress={handleJobPress}
      />
      
      <House
        color={colors.white[400]}
        size={35}
        onPress={handleHomePress}
      />

      <BookOpen
        color={colors.white[400]}
        size={35}
        onPress={handleSocialPress}
      />
    </View>
  );
}
