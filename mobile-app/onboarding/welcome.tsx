import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import { colors } from "@/colors";
import { View, Image, StyleSheet } from "react-native";
import { sizes, componentSizes } from "@/constants/sizes";
import { Button } from "@/components/Button";

type WelcomeProps = {
  onGetStarted: () => void;
};

export default function Welcome({ onGetStarted }: WelcomeProps) {
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
          <Image
            source={require("../assets/images/jila-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            text="Get started"
            onPress={onGetStarted}
            preset="outline"
            customStyle={{
              width: 200,
              paddingHorizontal: 10,
              paddingVertical: 18,
              fontSize: 20,
              borderColor: colors.white[400],
              textColor: colors.white[400],
              borderRadius: 50,
              borderWidth: 2,
            }}
          />
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
  welcomeText: {
    fontSize: 32,
    fontWeight: "400",
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
});