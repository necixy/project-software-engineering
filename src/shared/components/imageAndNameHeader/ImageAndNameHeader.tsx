import {View, Text, StatusBar, Platform} from 'react-native';
import React from 'react';
import {colors} from 'src/theme/colors';
import CustomText from '../customText/CustomText';
import FastImage from 'react-native-fast-image';
import {globalStyles} from 'src/constants/globalStyles.style';
import Entypo from 'react-native-vector-icons/Entypo';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {IS_IOS} from 'src/constants/deviceInfo';

const ImageAndNameHeader = ({name, url}: any) => {
  const {goBack} = useStackNavigation();
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>
      <StatusBar barStyle={'light-content'} backgroundColor={colors.primary} />
      <Entypo
        onPress={() => {
          goBack();
        }}
        name="chevron-left"
        style={{margin: 5}}
        size={30}
        color={colors.secondary}
      />
      <FastImage
        source={{uri: `${url}`}}
        style={[globalStyles.circleImage, {height: 45, width: 45, margin: 10}]}
      />
      <CustomText fontFamily={'openSansBold'} fontSize={14} color="secondary">
        {name}
      </CustomText>
    </View>
  );
};

export default ImageAndNameHeader;
