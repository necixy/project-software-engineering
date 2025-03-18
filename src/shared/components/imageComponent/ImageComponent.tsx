import {StyleProp} from 'react-native';
import React from 'react';
import FastImage, {
  FastImageProps,
  ImageStyle,
  ResizeMode,
} from 'react-native-fast-image';
import {colors} from 'src/theme/colors';
export interface TAvatar extends FastImageProps {
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
}
const ImageComponent = ({
  source,
  style,
  resizeMode = 'cover',
  ...props
}: TAvatar) => {
  const [isLoadingImage, setLoadingImageState] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const onLoadStart = () => setLoadingImageState(true);
  const onLoadEnd = () => setLoadingImageState(false);
  const onError = () => setIsError(false);

  return (
    <FastImage
      {...props}
      source={!!source && !isError ? source : require('./placeholder.png')}
      defaultSource={require('./placeholder.png')}
      style={[
        {
          backgroundColor: isLoadingImage ? colors?.primary : colors.lightGrey,
        },
        style,
      ]}
      resizeMode={resizeMode}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onError={onError}
    />
  );
};

export default ImageComponent;
