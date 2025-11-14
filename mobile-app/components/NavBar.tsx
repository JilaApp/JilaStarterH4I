import { useRouter, usePathname } from "expo-router";
import { Pressable, View } from "react-native";
import { House, Briefcase, BookOpen } from "lucide-react-native";

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
    <View className="flex-row gap-[82px] w-full h-[10vh] items-center justify-center bg-jila-400">
      <Pressable
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        onPress={handleJobPress}
      >
        <Briefcase
          color={"white"}
          size={35}
        />
      </Pressable>

      <Pressable
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        onPress={handleHomePress}
      >
        <House
          color={"white"}
          size={35}
        />
      </Pressable>

      <Pressable
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        onPress={handleSocialPress}
      >
        <BookOpen
          color={"white"}
          size={35}
        />
      </Pressable>
    </View>
  );
}
