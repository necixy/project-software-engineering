import React, {ChangeEvent, useTransition} from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardType,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {
  capitalizeString,
  fontSizePixelRatio,
} from 'src/utils/developmentFunctions';
interface TEditProfileInputs {
  value: any;
  label?: string;
  inputBoxStyle?: StyleProp<ViewStyle> | object;
  inputContainerStyle?: StyleProp<ViewStyle>;
  onChangeText?: (e: string | ChangeEvent<any>) => void;
  multiline?: boolean;
  labelContainer?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string | boolean;
  handleBlur?: () => void;
  handleFocus?: () => void;
  selection?: {
    start: number;
    end: number;
  };
  onPress?: () => void;
  readOnly?: boolean;
  keyboardType?: KeyboardType;
  labelStyle?: TextStyle;
  name?: 'phone' | null;
  dialCode?: string;
}

const EditProfileInputs = ({
  value,
  label,
  inputBoxStyle,
  inputContainerStyle,
  containerStyle,
  onChangeText,
  multiline = false,
  labelContainer,
  error,
  handleBlur,
  handleFocus,
  selection,
  onPress,
  readOnly,
  keyboardType,
  labelStyle,
  name,
  dialCode,
}: TEditProfileInputs) => {
  const {t} = useTranslation();
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.labelContainer, labelContainer]}>
        <CustomText
          allowFontScaling={false}
          fontFamily="arialBold"
          fontSize={15}
          color="defaultBlack"
          style={labelStyle}>
          {label}
          {/* {capitalizeString(label ?? '')} */}
        </CustomText>
      </View>

      <CustomInput
        dialCode={dialCode}
        name={name}
        inputContainer={[
          styles.inputContainerStyle,
          inputContainerStyle,
          {justifyContent: 'flex-start', paddingStart: 10},
        ]}
        keyboardType={keyboardType}
        readOnly={readOnly}
        onPress={onPress}
        multiline={multiline}
        value={value ? capitalizeString(value) : value}
        placeHolderText={label}
        onChangeText={onChangeText}
        inputBoxStyle={[
          styles.inputBoxStyle,
          inputBoxStyle,
          name ? styles.countryCodeStyle : {},
        ]}
        performOnBlur={handleBlur}
        performOnFocus={handleFocus}
        selection={selection}
        error={error}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: SCREEN_WIDTH,
  },
  labelContainer: {
    height: 50,
    width: SCREEN_WIDTH * 0.26,
    justifyContent: 'center',
  },
  inputContainerStyle: {
    height: 50,
    width: SCREEN_WIDTH * 0.72,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors?.lightGrey,
    borderWidth: 0,
  },
  inputBoxStyle: {
    fontFamily: fonts?.arialBold,
    width: '90%',
    fontSize: fontSizePixelRatio(15),
  },
  countryCodeStyle: {
    position: 'relative',
  },
});

export default EditProfileInputs;
