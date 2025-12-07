import { useState } from "react";

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
import SearchableDropdown from "@/components/SearchableDropdown";
import SocialServicesCategories, {
  SocialService,
} from "@/components/SocialServicesCategories";
import { ResourceCard } from "@/components/FlipCard";
import { Toggle } from "@/components/Toggle";
import VideoDropdown from "@/components/VideoDropdown";
import JobDropdown from "@/components/JobDropdown";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Header from "@/components/Header";
import Link from "@/components/Link";
import VideoEmbed, { VideoType } from "@/components/VideoEmbed";
import VideoUpNext from "@/components/VideoUpNext";
import JobCard from "@/components/JobCard";
import { VideoData } from "@/types/api";
import VideoPage from "./video";

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

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const cityOptions = [
    "Champaign",
    "Urbana",
    "Chicago",
    "Springfield",
    "Peoria",
    "Rockford",
    "Naperville",
    "Aurora",
    "Joliet",
    "Elgin",
  ];

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

  const videoEmbedYoutubeURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  const videoEmbedGoogleDriveURL =
    "https://drive.google.com/file/d/1OqRpiJnv6jykHuMxv1pJM6FqPzdgW4VD/view?usp=sharing";

  const mockVideo: VideoData = {
    id: 1,
    titleEnglish: "Introduction to Healthcare",
    titleQanjobal: "Yichbanil Yetok An",
    topic: "HEALTH",
    urls: [
      "https://www.youtube.com/watch?v=H2VWkcUoCqs",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=HxdqdqDORcY",
      "https://www.youtube.com/watch?v=wgVOgGLtPtc",
      "https://www.youtube.com/watch?v=7QJ-N-AQJYc",
    ],
    descriptionEnglish: "A basic introduction to the healthcare system.",
    descriptionQanjobal: "Jun yichbanil tzet yetal chi yala yetok an.",
    audioFilename: "intro_health.mp3",
    audioFileSize: 1024000,
    audioFileS3Key: "audio/intro_health.mp3",
    youtube_url: [true, true, true, true, true],
  };

  return (
    <View style={{ flex: 1 }}>
      <VideoPage clickIndex={0} videos={mockVideo} />
    </View>
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
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
    color: colors.gray[600],
  },
  exampleText: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 8,
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
