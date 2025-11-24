import React, { useState } from "react";

import { Link } from "expo-router";
import {
  CareerButton,
  EducationButton,
  LegalButton,
  MedicalButton,
  OtherButton,
  TransportButton,
} from "@/components/GradientButton";
import { LinearGradient } from "expo-linear-gradient";
import { View, ScrollView, StyleSheet } from "react-native";
import Text from "@/components/JilaText";
import { BaseInput } from "@/components/Input/BaseInput";
import { UsernameInput, PasswordInput } from "@/components/Input";
import { colors } from "@/colors";

import AudioButton from "@/components/AudioButton";
import ClearButton from "@/components/ClearAll";
import SignUpButton from "@/components/SignUpButton";
import ApplyButton from "@/components/ApplyButton";
import LikeDislike from "@/components/LikeDislike";
import Dropdown from "@/components/Dropdown";
import { ResourceCard } from "@/components/FlipCard";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Header from "@/components/Header";

export default function DevPage() {
  const [selectedDropdown, setSelectedDropdown] = useState<string | null>(null);
  const dropdownOptions = ["PA", "TX", "NJ", "IL", "CA"];

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [smallChecked, setSmallChecked] = useState(false);
  const [largeChecked, setLargeChecked] = useState(false);
  const languageOptions = [
    {
      id: "english",
      title: "English",
      audioSource: require("../assets/audio/sample.mp3"),
    },
    {
      id: "qanjobal",
      title: "Q'anjob'al",
      audioSource: require("../assets/audio/sample.mp3"),
    },
    {
      id: "disabled",
      title: "English",
      audioSource: require("../assets/audio/sample.mp3"),
      disabled: true,
    },
  ];

  const myOnPress = () => {
    console.log("cleared");
  };
  const [numLikesUp, setNumLikesUp] = useState(0);
  const [isClickedUp, setIsClickedUp] = useState(false);
  const [isClickedDown, setIsClickedDown] = useState(false);

  const handleLikeClick = (clicked: boolean) => {
    setIsClickedUp(clicked);
    if (clicked) {
      setNumLikesUp(numLikesUp + 1);
    } else {
      setNumLikesUp(numLikesUp - 1);
    }
  };

  return (
    <>
      <Header
        // text="Hello Anna! What would you like to learn today?"
        toggleSearch={true}
      />
      <ScrollView>
        <SignUpButton onPress={myOnPress} />
        <ClearButton onPress={myOnPress} />
        <ApplyButton onPress={myOnPress} />
        <BaseInput />
        <UsernameInput />
        <PasswordInput />
        <AudioButton
          audioSource={require("../assets/audio/sample.mp3")}
          variant={"default"}
        />
        <AudioButton
          audioSource={require("../assets/audio/sample.mp3")}
          disabled
        />

        <LikeDislike
          isClicked={isClickedDown}
          setIsClicked={setIsClickedDown}
          type="dislike"
        />
        <LikeDislike
          numLikes={numLikesUp}
          isClicked={isClickedUp}
          setIsClicked={handleLikeClick}
          type="like"
        />
        <View style={styles.selectContainer}>
          <Select
            options={languageOptions}
            selected={selectedLanguage}
            onSelect={setSelectedLanguage}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            size={"small"}
            checked={smallChecked}
            onCheckedChange={setSmallChecked}
          />

          <Checkbox
            size={"large"}
            checked={largeChecked}
            onCheckedChange={setLargeChecked}
          />
        </View>

        <Link href="/auth/sign-up">sign in</Link>
        <Text style={styles.colorDemoTitle}>Color Demo:</Text>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>
            You chose: <Text style={styles.semibold}>{selectedDropdown}</Text>
          </Text>
          <Dropdown
            text={"--Select State--"}
            options={dropdownOptions}
            selected={selectedDropdown}
            onSelect={setSelectedDropdown}
          />
        </View>

        <View style={styles.bgJila400}>
          <Text style={styles.textWhite}>colors.jila[400]</Text>
        </View>
        <Text style={styles.bgJila300}>colors.jila[300]</Text>
        <Text style={styles.bgOrange400}>colors.orange[400]</Text>
        <Text style={styles.bgOrange300}>colors.orange[300]</Text>
        <Text style={styles.bgYellow400}>colors.yellow[400]</Text>
        <Text style={styles.bgCream300}>colors.cream[300]</Text>
        <Text style={styles.bgGreen400}>colors.green[400]</Text>
        <Text style={styles.bgTeal400}>colors.teal[400]</Text>
        <Text style={styles.bgTeal300}>colors.teal[300]</Text>
        <Text style={styles.bgError400}>colors.error[400]</Text>
        <Text style={styles.bgError300}>colors.error[300]</Text>
        <Text style={styles.bgError200}>colors.error[200]</Text>
        <View style={styles.bgType400}>
          <Text style={styles.textWhite}>colors.type[400]</Text>
        </View>
        <Text style={styles.bgWhite400}>colors.white[400]</Text>
        <Text style={styles.bgGray400}>colors.gray[400]</Text>
        <Text style={styles.bgGray300}>colors.gray[300]</Text>
        <Text style={styles.bgGray200}>colors.gray[200]</Text>

        {/* coordinates for start and end positions
      top-left corner: { x: 0, y: 0}
      top-right corner: { x: 1, y: 0}
      bottom-left corner: { x: 1, y: 0}
      bottom-right corner: { x: 1, y: 1} */}

        {/* gradient-green: green-400 & yellow-??? */}
        <LinearGradient
          colors={["#90BE6D", "#FFE078"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text>gradient-green (left-diagonal)</Text>
        </LinearGradient>

        {/* gradient-red: jila-400 & orange-400 */}
        <LinearGradient
          colors={["#7E0601", "#E8965B"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text>gradient-red (right-diagonal)</Text>
        </LinearGradient>

        {/* gradient-blue: teal-400 & green-300 */}
        <LinearGradient
          colors={["#577590", "#CDE6B9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text>gradient-blue (vertical)</Text>
        </LinearGradient>

        {/* gradient-yellow: yellow-400 & orange-400 */}
        <LinearGradient
          colors={["#EFBF6A", "#E8965B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text>gradient-yellow (horizontal)</Text>
        </LinearGradient>

        <ResourceCard
          title="test"
          address="my house"
          phone="18943765928"
          description="a flip cared gggg"
        />
        <LegalButton />
        <EducationButton />
        <MedicalButton />
        <TransportButton />
        <CareerButton />
        <OtherButton />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  selectContainer: {
    paddingVertical: 20,
  },
  checkboxContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    gap: 25,
  },
  colorDemoTitle: {
    fontSize: 30,
    fontWeight: "700",
  },
  dropdownContainer: {
    margin: 40,
  },
  dropdownText: {
    color: colors.gray[700],
  },
  semibold: {
    fontWeight: "600",
  },
  bgJila400: {
    backgroundColor: colors.jila[400],
  },
  bgJila300: {
    backgroundColor: colors.jila[300],
  },
  bgOrange400: {
    backgroundColor: colors.orange[400],
  },
  bgOrange300: {
    backgroundColor: colors.orange[300],
  },
  bgYellow400: {
    backgroundColor: colors.yellow[400],
  },
  bgCream300: {
    backgroundColor: colors.cream[300],
  },
  bgGreen400: {
    backgroundColor: colors.green[400],
  },
  bgTeal400: {
    backgroundColor: colors.teal[400],
  },
  bgTeal300: {
    backgroundColor: colors.teal[300],
  },
  bgError400: {
    backgroundColor: colors.error[400],
  },
  bgError300: {
    backgroundColor: colors.error[300],
  },
  bgError200: {
    backgroundColor: colors.error[200],
  },
  bgType400: {
    backgroundColor: colors.type[400],
  },
  bgWhite400: {
    backgroundColor: colors.white[400],
  },
  bgGray400: {
    backgroundColor: colors.gray[400],
  },
  bgGray300: {
    backgroundColor: colors.gray[300],
  },
  bgGray200: {
    backgroundColor: colors.gray[200],
  },
  textWhite: {
    color: colors.white[400],
  },
});
