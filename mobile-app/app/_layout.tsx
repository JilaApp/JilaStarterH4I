import { Slot, usePathname, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NavBar from "@/components/NavBar";
import { useMemo, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import TRPCProvider from "@/components/TRPCProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TTSProvider } from "@/context/TTSContext";
import '../i18n'; 

const NAV_ROUTES = new Set([
  "/",
  "/job",
  "/social",
  "/dev",
  "/video-router",
  "/video",
  "/help",
]);

export default function RootLayout() {
  const pathname = usePathname();
  const shouldShowNav = useMemo(() => NAV_ROUTES.has(pathname), [pathname]);
  const [fontsLoaded, error] = useFonts({
    Fustat: require("../assets/fonts/Fustat-Regular.ttf"),
    "Fustat-ExtraLight": require("../assets/fonts/Fustat-ExtraLight.ttf"),
    "Fustat-Light": require("../assets/fonts/Fustat-Light.ttf"),
    "Fustat-Medium": require("../assets/fonts/Fustat-Medium.ttf"),
    "Fustat-SemiBold": require("../assets/fonts/Fustat-SemiBold.ttf"),
    "Fustat-Bold": require("../assets/fonts/Fustat-Bold.ttf"),
    "Fustat-ExtraBold": require("../assets/fonts/Fustat-ExtraBold.ttf"),
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ClerkProvider tokenCache={tokenCache}>
          <TRPCProvider>
            <TTSProvider>
              <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
              />
              <View style={styles.container}>
                <View style={styles.content}>
                  <Slot />
                </View>

                {shouldShowNav && (
                  <View style={styles.navContainer}>
                    <NavBar />
                  </View>
                )}
              </View>
            </TTSProvider>
          </TRPCProvider>
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  navContainer: {
    zIndex: 1000,
    elevation: 1000, // For Android
  },
});
