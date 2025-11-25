import React, { useState } from "react";

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
import {
  Ambulance,
  Apple,
  Bus,
  House,
  SquareArrowOutUpRight,
} from "lucide-react-native";
import { Button } from "@/components/Button";
import LikeDislike from "@/components/LikeDislike";
import Dropdown from "@/components/Dropdown";
import SocialServicesCategories, {
  SocialService,
} from "@/components/SocialServicesCategories";
import { ResourceCard } from "@/components/FlipCard";
import VideoDropdown from "@/components/VideoDropdown";
import JobDropdown from "@/components/JobDropdown";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Header from "@/components/Header";
import Link from "@/components/Link";

export default function DevPage() {
  const [
    currentSocialServicesCategoriesIndex,
    setCurrentSocialServicesCategoriesIndex,
  ] = useState<number>(0);

  const socialServices: SocialService[] = [
    {
      icon: Ambulance,
      name: "Emergency",
    },
    {
      icon: House,
      name: "Shelters",
    },
    {
      icon: Apple,
      name: "Food",
    },
    {
      icon: Bus,
      name: "Transport",
    },
  ];

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

  const videoDropdownMultipleVideos = {
    text: "Riding the Bus",
    ttsUrl: "https://example.com/tts.mp3",
    parts: [
      {
        videoUrl: "https://example.com/video1.mp4",
        name: "Introduction",
        duration: 45,
      },
      {
        videoUrl: "https://example.com/video2.mp4",
        name: "Getting on the Bus",
        duration: 75,
      },
      {
        videoUrl: "https://example.com/video3.mp4",
        name: "Paying the Fare",
        duration: 30,
      },
      {
        videoUrl: "https://example.com/video4.mp4",
        name: "Finding a Seat",
        duration: 55,
      },
      {
        videoUrl: "https://example.com/video5.mp4",
        name: "Following Rules",
        duration: 42,
      },
      {
        videoUrl: "https://example.com/video6.mp4",
        name: "Getting Off",
        duration: 37,
      },
      {
        videoUrl: "https://example.com/video7.mp4",
        name: "Transfer Tips",
        duration: 63,
      },
      {
        videoUrl: "https://example.com/video8.mp4",
        name: "Arriving Safely",
        duration: 51,
      },
    ],
  };

  const videoDropdownSingleVideo = {
    text: "Quick Introduction",
    ttsUrl: "https://example.com/tts-single.mp3",
    parts: [
      {
        videoUrl: "https://example.com/single-video.mp4",
        name: "Introduction",
        duration: 45,
      },
    ],
  };

  return (
    <>
      <Header toggleSearch={true} />
      <ScrollView>
        <View
          style={{ backgroundColor: colors.cream[300], gap: 10, padding: 10 }}
        >
          <Text style={styles.sectionTitle}>
            VideoDropdown - Multiple Videos (Cream)
          </Text>
          <VideoDropdown
            text={videoDropdownMultipleVideos.text}
            ttsUrl={videoDropdownMultipleVideos.ttsUrl}
            parts={videoDropdownMultipleVideos.parts}
            type="cream"
          />

          <Text style={styles.sectionTitle}>
            VideoDropdown - Single Video (Cream)
          </Text>
          <VideoDropdown
            text={videoDropdownSingleVideo.text}
            ttsUrl={videoDropdownSingleVideo.ttsUrl}
            parts={videoDropdownSingleVideo.parts}
            type="cream"
          />

          <Text style={styles.sectionTitle}>
            JobDropdown - White Background
          </Text>
          <JobDropdown
            text="Job Application Steps"
            ttsUrl="https://example.com/job-tts.mp3"
          >
            <View style={{ padding: 20, backgroundColor: colors.white[400] }}>
              <Text>Step 1: sleep</Text>
              <Text>Step 2: eepy</Text>
              <Text>Step 3: buh</Text>
            </View>
          </JobDropdown>
        </View>
        <SocialServicesCategories
          socialServices={socialServices}
          currentIndex={currentSocialServicesCategoriesIndex}
          onSelect={setCurrentSocialServicesCategoriesIndex}
        />
        <Button text="Sign up" onPress={myOnPress} preset="outline-cream" />
        <Button text="Clear all" onPress={myOnPress} preset="outline" />
        <Button
          text="Apply"
          onPress={myOnPress}
          preset="secondary"
          icon={SquareArrowOutUpRight}
        />
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

        <Link path="/auth/sign-up">sign in</Link>

        <View style={styles.linkContainer}>
          <Text style={styles.sectionTitle}>Custom Link Component</Text>
          <Link path="/dev">Go to Dev Page</Link>
        </View>

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

        <View style={{ backgroundColor: colors.jila[400] }}>
          <Text style={{ color: colors.white[400] }}>colors.jila[400]</Text>
        </View>
        <Text style={{ backgroundColor: colors.jila[300] }}>
          colors.jila[300]
        </Text>
        <Text style={{ backgroundColor: colors.orange[400] }}>
          colors.orange[400]
        </Text>
        <Text style={{ backgroundColor: colors.orange[300] }}>
          colors.orange[300]
        </Text>
        <Text style={{ backgroundColor: colors.yellow[400] }}>
          colors.yellow[400]
        </Text>
        <Text style={{ backgroundColor: colors.cream[300] }}>
          colors.cream[300]
        </Text>
        <Text style={{ backgroundColor: colors.green[400] }}>
          colors.green[400]
        </Text>
        <Text style={{ backgroundColor: colors.teal[400] }}>
          colors.teal[400]
        </Text>
        <Text style={{ backgroundColor: colors.teal[300] }}>
          colors.teal[300]
        </Text>
        <Text style={{ backgroundColor: colors.error[400] }}>
          colors.error[400]
        </Text>
        <Text style={{ backgroundColor: colors.error[300] }}>
          colors.error[300]
        </Text>
        <Text style={{ backgroundColor: colors.error[200] }}>
          colors.error[200]
        </Text>
        <View style={{ backgroundColor: colors.type[400] }}>
          <Text style={{ color: colors.white[400] }}>colors.type[400]</Text>
        </View>
        <Text style={{ backgroundColor: colors.white[400] }}>
          colors.white[400]
        </Text>
        <Text style={{ backgroundColor: colors.gray[400] }}>
          colors.gray[400]
        </Text>
        <Text style={{ backgroundColor: colors.gray[300] }}>
          colors.gray[300]
        </Text>
        <Text style={{ backgroundColor: colors.gray[200] }}>
          colors.gray[200]
        </Text>

        {/* coordinates for start and end positions
      top-left corner: { x: 0, y: 0}
      top-right corner: { x: 1, y: 0}
      bottom-left corner: { x: 1, y: 0}
      bottom-right corner: { x: 1, y: 1} */}

        {/* gradient-green: green-400 & yellow-??? */}
        <LinearGradient
          colors={[colors.green[400], colors.yellow[400]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text>gradient-green (left-diagonal)</Text>
        </LinearGradient>

        {/* gradient-red: jila-400 & orange-400 */}
        <LinearGradient
          colors={[colors.jila[400], colors.orange[400]]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text>gradient-red (right-diagonal)</Text>
        </LinearGradient>

        {/* gradient-blue: teal-400 & green-300 */}
        <LinearGradient
          colors={[colors.teal[400], colors.green[300]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text>gradient-blue (vertical)</Text>
        </LinearGradient>

        {/* gradient-yellow: yellow-400 & orange-400 */}
        <LinearGradient
          colors={[colors.yellow[400], colors.orange[400]]}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: colors.type[400],
  },
  selectContainer: {
    paddingVertical: 20,
  },
  checkboxContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    gap: 25,
  },
  linkContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 15,
    backgroundColor: colors.cream[300],
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
});
