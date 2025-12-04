import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import { colors } from "@/colors";
import { View, Image, StyleSheet } from "react-native";
import { sizes, componentSizes } from "@/constants/sizes";
import { hp } from "@/utils/responsive";
import { Button } from "@/components/Button";

const myOnPress = () => {
    console.log("cleared");
  };

export default function Welcome(){
    return (
            <View style={{ flex: 1 }}>
                <LinearGradient
                    colors={[colors.orange[400], colors.jila[400]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ flex: 1 }}
                    locations={[0.1, 0.9]}
                >
                    {/* <Text style={[styles.label, styles.labelColor]}>Welcome to</Text> */}
                    <Image
                        source={require("../assets/images/jila-logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <View style={{marginLeft: sizes.spacing.xs * 22}}>
                        <Button
                        text="Get Started"
                        onPress={myOnPress}
                        preset="outline"
                        customStyle={{
                            width: 200,
                            paddingHorizontal: 10,
                            paddingVertical: 18,
                            fontSize: 20,
                            borderColor: colors.white[400],
                            textColor: colors.white[400],
                        }}
                        />
                    </View>


                </LinearGradient>
            </View>

    )
}


const styles = StyleSheet.create({
  logo: {
    // FIX 
    marginLeft: 55,
    width: componentSizes.logo.background.width * 1.75,
    height: componentSizes.logo.background.height * 3.67,
  },
  labelColor: {
    color: colors.white[400],
  },
  label: {
    fontSize: sizes.fontSize.base,
    fontWeight: "600",
    marginTop: sizes.spacing.xl,
  },
});

