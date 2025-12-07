import Header from "./Header";
import { View, Image, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native";
import VideoEmbed, { VideoType } from "@/components/VideoEmbed";
import { ArrowDownToLine, ChevronLeft } from "lucide-react-native";
import { Button } from "./Button";
import { Linking } from 'react-native';
import JilaText from "@/components/JilaText";
import AudioButton from "./AudioButton";
import { colors } from "@/colors";
import VideoUpNext from "./VideoUpNext";
import { VideoData } from "@/types/api";
import VideoRouter from "@/app/video-router";
import { useRouter } from "expo-router";


interface HeaderProps {
  clickIndex: number,
  videos: VideoData;
}

{/*we take in a list of urls and the next shows up as a stepper function */}

export default function VideoPage({ clickIndex: clickIndex, videos: videos }: HeaderProps) {
    
    const router = useRouter();

    const video_urls = videos.urls;
    const video_youtube_list = videos.youtube_url;
    const total_urls = video_urls.length;

    const title = videos.titleEnglish;

    const uri = video_urls[clickIndex];
    const youtube = video_youtube_list[clickIndex];

    let type = VideoType.YouTube;

    let showNext = true;

    if (clickIndex == total_urls - 1) {
        showNext = false;
    }

    if (youtube === false) {
        type = VideoType.GoogleDrive;
    }

    const handlePress = async () => {
        const supported = await Linking.canOpenURL(uri);

        if (supported) {
          await Linking.openURL(uri);
        } else {
          console.error(`Don't know how to open this URL: ${uri}`);
        }
    };

  return (
    <View style={{height: '100%', backgroundColor: colors.cream[300] }}>

      <View style={{ marginBottom: 30 }}>
        <Header  toggleSearch={false} />
      </View>

<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 45 }}>

        <TouchableOpacity onPress={() => router.push('/video-router')}>
              <ChevronLeft style={{marginLeft: 15, marginRight: 15}} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}/>
          </TouchableOpacity>
          
              <JilaText style={{ fontSize: 24, fontWeight: '600', marginRight: 10 }}>{title}</JilaText>
    <AudioButton audioSource={{ uri: "https://mysite.com/audio.mp3" }}/>
</View>
        <VideoEmbed uri={uri} type={type} />

<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 33, justifyContent: 'space-between' }}>
    <View style={{flexDirection: 'row',  marginLeft: 10}}>

    <TouchableOpacity style={{marginRight: 10}} onPress={handlePress}>
        <ArrowDownToLine />
    </TouchableOpacity>

    <JilaText style={{fontSize: 20}}>Part {clickIndex + 1}</JilaText>

    </View>

</View>

    {showNext && <View style={{marginTop: 60}}>
        <JilaText style={{fontSize: 24, fontWeight: '600', marginLeft: 15}}>Up Next</JilaText>

        <View style={{flexDirection: 'row', backgroundColor: colors.white[400], height: 75, borderColor: colors.gray[200], borderWidth: 1, shadowColor: '#6D0F00',
    shadowOffset: {
      width: 0,   
      height: 4,  
    },
    shadowOpacity: 0.1, 
    shadowRadius: 40,}}>

        <VideoUpNext title={`Part ${clickIndex + 2}`} duration={67} videoUrl="sigma.com"/>

        </View>
    </View>}
       
</View>
      

  );
}

