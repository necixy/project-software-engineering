import {
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  ColorValue,
} from 'react-native';
import React from 'react';
import CustomText from 'src/shared/components/customText/CustomText';
import {globalStyles} from 'src/constants/globalStyles.style';
import {colors} from '../../../theme/colors';
import {useTranslation} from 'react-i18next';

interface ILoadingSpinner {
  style?: StyleProp<ViewStyle>;
  textDisable?: boolean;
  spinnerSize?: number | 'large' | 'small';
  indicatorColor?: ColorValue | keyof typeof colors;
}
function LoadingSpinner({
  style,
  spinnerSize = 'large',
  textDisable,
  indicatorColor = colors?.primary,
}: ILoadingSpinner) {
  const {t} = useTranslation();
  return (
    <View style={[globalStyles.screenCenter, style]}>
      <ActivityIndicator size={spinnerSize} color={indicatorColor} />
      {textDisable ? null : (
        <CustomText
          color={indicatorColor ?? 'primary'}
          fontFamily="openSansRegular"
          fontSize={15}
          style={[{marginVertical: 10, lineHeight: 20}]}>
          {t('customWords:pleaseWait')}
        </CustomText>
      )}
    </View>
  );
}

export default LoadingSpinner;
