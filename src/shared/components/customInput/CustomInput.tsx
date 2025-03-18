import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from 'src/theme/colors';
import { fonts } from 'src/theme/fonts';
import {
  capitalizeString,
  fontSizePixelRatio,
} from 'src/utils/developmentFunctions';
import CustomText from '../customText/CustomText';
import Icon from 'src/assets/svg';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import CustomButton from '../customButton/CustomButton';
import { IS_IOS } from 'src/constants/deviceInfo';
import { navigate } from 'react-navigation-helpers';
import { screenStackName } from 'src/navigation/constant/screenStackName';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from 'src/redux/reducer/reducer';
import LoadingSpinner from '../placeholder/LoadingSpinner';

export type TCustomInput = {
  containerStyle?: StyleProp<ViewStyle>;
  value?: any;
  onChangeText?: (e?: any) => void;
  onPress?: () => void;
  error?: string | boolean;
  multiline?: boolean;
  maxLength?: number;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  onBlur?: (e: KeyboardEvent) => void;
  textInputProps?: TextInputProps;
  isLoading?: boolean;
  onChange?: (e?: any) => void;
  placeHolderText?: string;
  inputBoxStyle?: StyleProp<TextStyle> | object;
  inputContainer?: StyleProp<ViewStyle>;
  performOnFocus?: () => void;
  performOnBlur?: () => void;
  otherChildren?: ReactNode;
  errorStyle?: ViewStyle;
  selection?: {
    start: number;
    end: number;
  };
  onSubmitEditing?: (e?: any) => void;
  autoFocus?: boolean;
  readOnly?: boolean;
  icon?: boolean;
  onIconPress?: () => void;
  name?: 'phone' | null;
  dialCode?: string;
  countryCodeStyle?: TextStyle;
  iconLoading?: boolean;
};

const CustomInput = forwardRef(
  (
    {
      inputContainer,
      inputBoxStyle,
      containerStyle,
      value = '',
      onChangeText,
      onChange,
      onPress,
      maxLength,
      error,
      multiline = false,
      secureTextEntry = false,
      onSubmitEditing,
      placeHolderText,
      keyboardType = 'default',
      textInputProps,
      isLoading,
      performOnFocus = () => { },
      performOnBlur = () => { },
      otherChildren = null,
      errorStyle,
      selection,
      autoFocus = false,
      readOnly = false,
      icon = false,
      onIconPress,
      name,
      dialCode,
      countryCodeStyle,
      iconLoading,
    }: TCustomInput,
    ref: any,
  ) => {
    const { t } = useTranslation();
    const INPUT_HEIGHT = multiline ? 150 : 60;
    const isFocused = useSharedValue(false);
    const [inputValue, setInputValue] = useState(value ?? '');
    const [timeSlots, setTimeSlots] = useState([]);
    const [isSecureTextEntry, setIsSecureTextEntry] = useState(secureTextEntry);
    const labelHeight = useSharedValue(12);
    const [country_code, setCountry_code] = useState();
    // useEffect(() => {
    //   setIsSecureTextEntry(secureTextEntry ?? false);
    // }, [secureTextEntry]);

    const dispatch = useAppDispatch();

    // useFocusEffect(useCallback(() => {}, []));
    // const rLabel = useAnimatedStyle(() => {
    //   return {
    //     top:
    //       isFocused.value || inputValue
    //         ? withTiming(5)
    //         : withTiming(INPUT_HEIGHT / 2 - labelHeight.value / 2),
    //     start: 0,
    //   };
    // }, [isFocused, inputValue]);
    const [show, setShow] = useState(false);
    const [isFocusedState, setIsFocusedState] = useState(false);
    const inputRef = useRef<TextInput>(null);

    return (
      <View style={[containerStyle]}>
        <View
          style={[
            {
              width: '100%',
              justifyContent: 'space-between',
              // justifyContent: 'center',
              paddingHorizontal: 5,
              paddingVertical: 14,
              backgroundColor: colors.secondary,
              borderRadius: 6,
              alignItems: 'center',
              flexDirection: 'row',
              maxHeight: INPUT_HEIGHT,
              borderWidth: 2,
              borderColor: colors.lightGrey,
            },
            inputContainer,
          ]}>
          {name == 'phone' && (
            <Pressable
              // type="unstyled"
              style={{
                // height: INPUT_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
                // paddingHorizontal: 10,
                paddingTop: IS_IOS ? 1 : 0,
              }}
              onPress={() => {
                navigate(screenStackName.COUNTRY_PICKER);
              }}>
              <CustomText
                style={[countryCodeStyle]}
                // adjustsFontSizeToFit={false}
                color={'grey'}
                allowFontScaling={false}
                fontSize={15}>
                {dialCode ?? '+91'}
              </CustomText>
            </Pressable>
          )}
          <TextInput
            textContentType="oneTimeCode"
            readOnly={readOnly}
            onPressIn={onPress}
            autoFocus={autoFocus}
            onSubmitEditing={onSubmitEditing}
            placeholderTextColor={colors.placeHolder}
            selection={selection}
            keyboardType={keyboardType}
            secureTextEntry={isSecureTextEntry}
            ref={ref ?? inputRef}
            maxLength={maxLength}
            selectionColor={colors.lightGrey}
            defaultValue={value}
            placeholder={placeHolderText}
            onChangeText={e => {
              setInputValue(e);
              onChangeText && onChangeText(e);
            }}
            onBlur={(e: any) => {
              setIsFocusedState(false);
              isFocused.value = false;
              textInputProps?.onBlur && textInputProps?.onBlur(e);
              performOnBlur();
            }}
            onFocus={(e: any) => {
              setTimeout(() => setIsFocusedState(true), 800);
              isFocused.value = true;
              textInputProps?.onFocus && textInputProps?.onFocus(e);
              performOnFocus();
            }}
            style={[
              {
                height: INPUT_HEIGHT,
                width: '100%',
                paddingVertical: 10,
                paddingHorizontal: 10,
                color: colors.grey,
                alignItems: 'center',
                textAlign: 'left',
                justifyContent: 'center',
                fontFamily: fonts.arialRegular,
                fontSize: fontSizePixelRatio(18),
                position: 'absolute',

                // backgroundColor: 'pink',
                // borderWidth: 1,
              },
              inputBoxStyle,
            ]}
            multiline={multiline}
            {...textInputProps}
            scrollEnabled={isFocusedState && multiline}
          />
          {icon &&
            (iconLoading ? (
              <ActivityIndicator
                size="small"
                color={colors?.grey}
                style={{ position: 'absolute', right: '4%' }}
              />
            ) : (
              <Pressable
                disabled={iconLoading}
                style={{ position: 'absolute', right: '4%' }}
                onPress={onIconPress}>
                <IonIcons
                  name="paper-plane-outline"
                  color={colors?.grey}
                  size={25}
                  style={{
                    // color: colors.lightGrey,
                    // transform: [{rotate: '22deg'}],
                    transform: [{ rotate: '41deg' }],
                  }}
                />
              </Pressable>
            ))}

          {secureTextEntry && (
            <Pressable
              style={{
                marginEnd: 5,
                position: 'absolute',
                right: 2,
                // top: '55%',
                // borderWidth: 1,
                alignSelf: 'center',
              }}
              onPress={() => setIsSecureTextEntry(prev => !prev)}
              hitSlop={10}>
              <Icon
                name={isSecureTextEntry ? 'eye' : 'eye_close'}
                fill="#000"
              />
            </Pressable>
          )}
          {otherChildren}
        </View>
        {error ? (
          <CustomText
            numberOfLines={2}
            fontFamily="arialBold"
            fontSize={12}
            style={[
              {
                paddingBottom: 12,
                marginTop: 5,
                marginStart: 5,
                color: colors.red,
                lineHeight: 15,
              },
              errorStyle,
            ]}>
            {typeof error === 'string' && capitalizeString(error)}
          </CustomText>
        ) : null}
      </View>
    );
  },
);
export default CustomInput;

const styles = StyleSheet.create({});
