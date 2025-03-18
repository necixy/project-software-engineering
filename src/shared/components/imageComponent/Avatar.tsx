import React from 'react';
import {StyleProp} from 'react-native';
import FastImage, {ImageStyle, ResizeMode} from 'react-native-fast-image';
import {TAvatar} from './ImageComponent';

const Avatar = ({source, style, resizeMode = 'cover', ...props}: TAvatar) => {
  const [isLoadingImage, setLoadingImageState] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const onLoadStart = () => setLoadingImageState(true);
  const onLoadEnd = () => setLoadingImageState(false);
  const onError = () => setIsError(false);

  return (
    <FastImage
      {...props}
      source={
        !!source && !isError ? source : require('./avatarPlaceHolder.png')
      }
      defaultSource={require('./avatarPlaceHolder.png')}
      style={[{height: 50, width: 50, borderRadius: 50}, style]}
      resizeMode={resizeMode}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onError={onError}
    />
  );
};

export default Avatar;
