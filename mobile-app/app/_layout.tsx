import "./global.css";
import { Slot, usePathname } from "expo-router";
import NavBar from "@/components/NavBar";
import { useMemo } from "react";
import { View } from "react-native";
import { Stack, SplashScreen } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { useEffect } from "react";

const NAV_ROUTES = new Set(["/", "/job", "/social", "/dev"]);

export default function RootLayout() {
  const pathname = usePathname();
  const shouldShowNav = useMemo(() => NAV_ROUTES.has(pathname), [pathname]);
  const [fontsLoaded, error] = useFonts({
    Fustat: require("../assets/fonts/Fustat.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>

        {shouldShowNav && <NavBar />}
      </View>
    </ClerkProvider>
  );
}
