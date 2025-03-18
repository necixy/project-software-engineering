import { View, Text, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import Video, { OnVideoErrorData, VideoRef } from 'react-native-video';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { SCREEN_WIDTH } from 'src/constants/deviceInfo';
import { colors } from 'src/theme/colors';

const VideoPlayer = ({ index, playNumber, play, url }: { index: Number, playNumber: Number, play: boolean, url: string | NodeRequire | undefined }) => {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<VideoRef>(null);
  const [isLoading, setIsLoading] = useState(true);

  const onBuffer = ({ isBuffering }:{isBuffering:boolean}) => {
    setIsLoading(isBuffering);
  };

  const onLoadStart = () => {
    setIsLoading(true);
  };

  const onLoad = () => {
    setIsLoading(false);
  };

  const onError = (error:OnVideoErrorData) => {
    console.error('Video error:', error);
    setIsLoading(false);
  };

  return (
    <Pressable
      style={{
        aspectRatio: 1,
        width: SCREEN_WIDTH,
        justifyContent:'center'
      }}
      onPress={async () => {
        playing ? setPlaying(false) : null;

      }}>
      {play ?
        <>
          <Video
                    onBuffer={onBuffer}
                    onLoadStart={onLoadStart}
                    onLoad={onLoad}
                    onError={onError}
            ref={videoRef}
            source={{ uri: url }}
            style={{
              aspectRatio: 1,
              width: SCREEN_WIDTH,
            }}
            onProgress={(e) => {
              if (!videoRef.current) {
                return;
              }
              if (e.currentTime >= e.seekableDuration - 0.1) {
                videoRef.current.seek(0.0)
              }

            }}

            removeClippedSubviews
            // repeat={true}
            paused={!(index == playNumber && play && playing)}
            resizeMode="contain"
          />
          {playing ? null : (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: SCREEN_WIDTH / 2 - 15,
                left: SCREEN_WIDTH / 2 - 15,
              }}
              onPress={() => {
                !playing ? setPlaying(true) : null;
              }}>
              <IonIcons
                name="play"
                color={colors.secondary}
                size={40}
              />
            </TouchableOpacity>

          )}
        </>
        : (
          isLoading?
        <ActivityIndicator style={{alignSelf:'center'}}/>
      :
      <View style={{backgroundColor:colors.defaultBlack}}/>)}
    </Pressable>
  )
}

export default VideoPlayer