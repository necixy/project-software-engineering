import React from 'react';
import {View, ViewStyle} from 'react-native';
import CustomText from 'src/shared/components/customText/CustomText';
import welcomeStyles from '../welcome/Welcome.style';
import {useTranslation} from 'react-i18next';

type THeading = {
  text: string;
  container?: ViewStyle;
};
export default function Heading({text, container}: THeading) {
  const {t} = useTranslation();
  return (
    <View style={container}>
      <CustomText style={[welcomeStyles.heading]}>
        {t('common:vita')}
      </CustomText>
      <CustomText style={welcomeStyles.subHeading}>{text}</CustomText>
    </View>
  );
}
