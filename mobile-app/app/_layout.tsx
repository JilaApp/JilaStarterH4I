import "./global.css";
import { Stack, SplashScreen } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {
  // const [fontsLoaded, error] = useFonts({
  //   Fustat: require("../assets/fonts/Fustat.ttf"),
  // });
  // useEffect(() => {
  //   if (fontsLoaded || error) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, error]);
  // if (!fontsLoaded && !error) {
  //   return null;
  // }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}
