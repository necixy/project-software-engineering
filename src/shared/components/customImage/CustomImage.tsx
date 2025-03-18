import React from 'react';
import {StyleProp} from 'react-native';
import FastImage, {
  FastImageProps,
  ImageStyle,
  ResizeMode,
} from 'react-native-fast-image';

export interface TCustomImage extends FastImageProps {
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
}
const CustomImage = ({
  source,
  style,
  resizeMode = 'cover',
  ...props
}: TCustomImage) => {
  const [isLoadingImage, setLoadingImageState] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const onLoadStart = () => setLoadingImageState(true);
  const onLoadEnd = () => setLoadingImageState(false);
  const onError = () => setIsError(false);

  return (
    <FastImage
      {...props}
      source={
        !!source && !isError
          ? source
          : require('../../../assets/images/placeholder.png')
      }
      // defaultSource={require('src/assets/images/placeholder.png')}
      style={[{height: 50, width: 50, borderRadius: 50}, style]}
      resizeMode={resizeMode}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onError={onError}
    />
  );
};

export default CustomImage;
