import Header from "./Header";
import { View, Image, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native";
import VideoEmbed, { VideoType } from "@/components/VideoEmbed";
import { Download } from "lucide-react-native";
import { Button } from "./Button";
import { Linking } from 'react-native';

interface HeaderProps {
  uri: string;
  type: VideoType;
}

export default function VideoPage({ uri: uri, type: type }: HeaderProps) {

  const { height: screenHeight } = useWindowDimensions();
  const videoHeight = screenHeight * 0.45;

    const handlePress = async () => {
        const supported = await Linking.canOpenURL(uri);

        if (supported) {
          await Linking.openURL(uri);
        } else {
          console.error(`Don't know how to open this URL: ${uri}`);
        }
    };

  return (
    <View>
      {/* need to pass in video url and video type */}

      <View style={{ marginBottom: 30 }}>
        <Header  toggleSearch={false} />
      </View>
      <VideoEmbed uri={uri} type={type} height={screenHeight}/>

      <TouchableOpacity onPress={handlePress}>
        <Download />
      </TouchableOpacity>

    </View>
  );
}
