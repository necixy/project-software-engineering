import React from 'react';
import {SCREEN_WIDTH} from '../../../constants/deviceInfo';
import FastImage from 'react-native-fast-image';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import Video from 'react-native-video';
const RenderPostItems = ({
  item,
  index,
  onPress,
}: {
  item: TFeedPostObject;
  index: number;
  onPress?: () => void;
}) => {
  return (
    <CustomButton type="unstyled" onPress={onPress}>
      {item?.media?.[0]?.type?.includes('image') ? (
        <FastImage
          key={index}
          resizeMode="cover"
          style={[
            {
              aspectRatio: 1,
              height: SCREEN_WIDTH / 3,
              marginTop: 3,
              marginRight: 3,
            },
          ]}
          source={{uri: item?.media?.[0]?.uri! ?? item?.media?.[0]!}}
        />
      ) : (
        <Video
          key={index}
          resizeMode="cover"
          style={[
            {
              aspectRatio: 1,
              height: SCREEN_WIDTH / 3,
              marginTop: 3,
              marginRight: 3,
            },
          ]}
          source={{uri: item?.media?.[0]?.uri!}}
          paused={true}
        />
      )}
    </CustomButton>
  );
};
export default RenderPostItems;
