import { Slot, usePathname, SplashScreen } from "expo-router";
import NavBar from "@/components/NavBar";
import { useMemo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";

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
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>

        {shouldShowNav && <NavBar />}
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
