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
import { View, ScrollView } from "react-native";
import Text from "@/components/JilaText";
import { BaseInput } from "@/components/Input/BaseInput";
import { UsernameInput, PasswordInput } from "@/components/Input";

import AudioButton from "@/components/AudioButton";
import LikeDislike from "@/components/LikeDislike";

import Dropdown from "@/components/Dropdown";
import { ResourceCard } from "@/components/FlipCard";
import VideoDropdown from "@/components/VideoDropdown";

export default function DevPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const options = ["PA", "TX", "NJ", "IL", "CA"];

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

  const videoDropdownSampleData = {
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

  return (
    <ScrollView>
      <BaseInput />
      <UsernameInput />
      <PasswordInput />
      <View style={{ backgroundColor: "#f2f2f2", gap: 10 }}>
        <VideoDropdown
          text={videoDropdownSampleData.text}
          ttsUrl={videoDropdownSampleData.ttsUrl}
          parts={videoDropdownSampleData.parts}
        />
        <VideoDropdown
          text={videoDropdownSampleData.text}
          ttsUrl={videoDropdownSampleData.ttsUrl}
          parts={videoDropdownSampleData.parts}
          type="cream"
        />
      </View>
      <AudioButton
        audioSource={require("../components/sample.mp3")}
        variant={"default"}
      />
      <AudioButton audioSource={require("../components/sample.mp3")} disabled />

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
      <Link href="/auth/sign-up">sign in</Link>
      <Text className="text-3xl font-bold">Nativewind Styles:</Text>
      <Text className="page-title-text">page-title-text</Text>
      <Text className="components-text">components-text</Text>
      <Text className="link-text">link-text</Text>

      <View className="m-10">
        <Text className="text-gray-700">
          You chose: <Text className="font-semibold">{selected}</Text>
        </Text>
        <Dropdown
          text={"--Select State--"}
          options={options}
          selected={selected}
          onSelect={setSelected}
        />
      </View>

      <View className="bg-jila-400">
        <Text className="text-white-400">bg-jila-400</Text>
      </View>
      {/* <Text style={{fontSize : 30}} className="bg-jila-300">bg-jila-300</Text> */}
      <Text className="bg-jila-300">bg-jila-300</Text>
      <Text className="bg-orange-400">bg-orange-400</Text>
      <Text className="bg-orange-300">bg-orange-300</Text>
      <Text className="bg-yellow-400">bg-yellow-400</Text>
      <Text className="bg-cream-300">bg-cream-300</Text>
      <Text className="bg-green-400">bg-green-400</Text>
      <Text className="bg-teal-400">bg-teal-400</Text>
      <Text className="bg-teal-300">bg-teal-300</Text>
      <Text className="bg-error-400">bg-error-400</Text>
      <Text className="bg-error-300">bg-error-300</Text>
      <Text className="bg-error-200">bg-error-200</Text>
      <View className="bg-type-400">
        <Text className="text-white-400">bg-type-400</Text>
      </View>
      <Text className="bg-white-400">bg-white-400</Text>
      <Text className="bg-gray-400">bg-gray-400</Text>
      <Text className="bg-gray-300">bg-gray-300</Text>
      <Text className="bg-gray-200">bg-gray-200</Text>

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
  );
}
