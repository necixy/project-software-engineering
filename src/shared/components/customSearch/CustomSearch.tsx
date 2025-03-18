import {
  View,
  TextInput,
  ViewStyle,
  ActivityIndicator,
  StyleProp,
  TextStyle,
} from 'react-native';
import React, {useState} from 'react';
import {ImageStyle} from 'react-native-fast-image';
import Icon from 'src/assets/svg';
import {useTranslation} from 'react-i18next';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {globalStyles} from 'src/constants/globalStyles.style';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import Entypo from 'react-native-vector-icons/Entypo';
import {EventRegister} from 'react-native-event-listeners';
const AREA_HEIGHT = 35;
type Props = {
  onFocus?: () => void;
  onBlur?: () => void;
  containerStyle?: ViewStyle;
  onChangeText?: (e?: any) => void;
  value?: string | number;
  isLoading?: boolean;
  searchContainer?: ViewStyle;
  textStyle?: StyleProp<TextStyle>;
  onSubmit?: () => void;
  showCancel?: boolean;
  onCancel?: () => void;
  searchButtonStyle?: ViewStyle;
  searchImageStyle?: ImageStyle;
  placeholderText?: string;
  color?: keyof typeof colors;
};
const CustomSearch = ({
  onFocus,
  onBlur,
  containerStyle,
  onChangeText,
  placeholderText,
  value,
  searchContainer,
  textStyle,
  isLoading,
  onSubmit,
  onCancel,
  showCancel = false,
  color = 'inputGrey',
  searchButtonStyle,
  searchImageStyle,
}: Props) => {
  const {t} = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...containerStyle,
      }}>
      <View
        style={[
          globalStyles.rowCenter,
          {
            width: '100%',
            paddingHorizontal: 5,
            backgroundColor: colors[color],
            height: AREA_HEIGHT,
            alignItems: 'center',
            borderRadius: 5,
          },
          {...searchContainer},
        ]}>
        <Icon
          name="search"
          width={18}
          height={18}
          style={{alignSelf: 'center', marginLeft: 10}}
        />
        <TextInput
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholderText ? placeholderText : t('common:Search')}
          placeholderTextColor={colors.grey}
          style={[
            {
              color: colors?.defaultBlack,
              fontSize: fontSizePixelRatio(14),
              fontFamily: fonts.arialRegular,
              flex: 1,
              padding: 0,
            },
            textStyle,
          ]}
          onChangeText={e => onChangeText && onChangeText(e)}
          defaultValue={value}
          onSubmitEditing={onSubmit}
        />
        {isLoading ? (
          <ActivityIndicator
            color={colors.grey}
            style={{
              marginRight: 10,
            }}
          />
        ) : showCancel ? (
          <View
            style={{
              alignSelf: 'center',
              marginRight: 10,
              backgroundColor: '#C1C1C1',
              borderRadius: 50,
            }}>
            <Entypo
              name="cross"
              color={colors?.defaultBlack}
              size={18}
              onPress={onCancel}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default CustomSearch;
