import React, {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {SCREEN_HEIGHT} from 'src/constants/deviceInfo';
import i18n from 'src/locale/i18n.config';
import CustomText from '../customText/CustomText';
import CustomImage, {TCustomImage} from '../customImage/CustomImage';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
type TEmpty = {
  text?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  lottieStyle?: StyleProp<ViewStyle>;
  imageProps?: TCustomImage;
  iconElement?: ReactNode;
};
const Empty = ({
  text = i18n.t('message:noDataFound'),
  style,
  children,
  lottieStyle,
  imageProps,
  iconElement,
}: TEmpty) => {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          height: SCREEN_HEIGHT / 2,
        },
        style,
      ]}>
      {/* <AnimatedLottieView
        source={require('../../assets/lottie/notFound.json')}
        autoPlay
        loop
        autoSize
        style={[
          {
            height: 180,
            width: 180,
          },
          lottieStyle,
        ]}
      /> */}

      {iconElement ? <>{iconElement}</> : <CustomImage {...imageProps} />}

      <CustomText
        textAlign="center"
        color="grey"
        fontFamily="openSansBold"
        fontSize={fontSizePixelRatio(16)}
        style={{marginTop: 20}}>
        {text}
      </CustomText>
      {children && children}
    </View>
  );
};

export default Empty;
