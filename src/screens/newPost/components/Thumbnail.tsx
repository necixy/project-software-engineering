//This code will render 80*80 pixel thumbnail instead of the whole image (on IOS only)
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {SCREEN_WIDTH} from '../../../constants/deviceInfo';

const Thumbnail = ({ props }:any) => {
    const [base64Image, setBase64Image] = useState<null|string>(null);

  useEffect(() => {
    const getThumbnail = async () => {
      const options = {
        allowNetworkAccess: true,
        targetSize: {
          height: 80,
          width: 80,
        },
        quality: 1.0,
      };

      const thumbnailResponse = await CameraRoll.getPhotoThumbnail(
        props.node.image.uri,
        options,
      );

      setBase64Image(thumbnailResponse.thumbnailBase64);
    };

    getThumbnail();
  }, []);

  const extension = props.node.image.extension;
  let prefix;

  switch (extension) {
    case 'png':
      prefix = 'data:image/png;base64,';
      break;
    default:
      //all others can use jpeg
      prefix = 'data:image/jpeg;base64,';
      break;
  }

  return (
    <FastImage
      style={[{aspectRatio: 1, height: SCREEN_WIDTH / 4, margin: 1}]}
      source={{uri: `${prefix}${base64Image}`}}
    />
  );
};
export default Thumbnail;
