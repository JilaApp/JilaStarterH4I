import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import { colors } from "@/colors";
import { View, Image, StyleSheet } from "react-native";
import { componentSizes } from "@/constants/sizes";
import { Button } from "@/components/Button";
import { useRouter } from "expo-router";
import AudioButton from "@/components/AudioButton";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.orange[400], colors.jila[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
        locations={[0.1, 0.9]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../assets/images/jila-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.audioButtonContainer}>
              <AudioButton
                audioSource={require("../assets/audio/welcome_to_jila.mp3")}
              />
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            text="Get started"
            onPress={() => router.push("/auth/sign-up")}
            preset="outline"
            customStyle={{ ...styles.button, textColor: colors.white[400] }}
          />
          <View style={{ marginTop: 20 }}>
            <Button
              text="Sign In"
              onPress={() => router.push("/auth/sign-in")}
              preset="outline"
              customStyle={{ ...styles.button, textColor: colors.white[400] }}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: "30%",
  },
  audioButtonContainer: {
    marginLeft: -16,
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: "600",
    color: colors.white[400],
    marginBottom: -200,
  },
  logo: {
    width: componentSizes.logo.background.width * 1.6,
    height: componentSizes.logo.background.height * 3.0,
  },
  buttonContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: "15%",
  },
  button: {
    width: 200,
    paddingHorizontal: 10,
    paddingVertical: 18,
    fontSize: 20,
    borderColor: colors.white[400],
    borderRadius: 50,
    borderWidth: 2,
  },
});
