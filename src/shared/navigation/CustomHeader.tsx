import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, Pressable, SafeAreaView, StatusBar, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import CustomButton from '../components/customButton/CustomButton';
import CustomText from '../components/customText/CustomText';
import Avatar from '../components/imageComponent/Avatar';
import {ICustomHeader} from './CustomHeaderType';

const CustomHeader = ({
  leftIconColor = 'blue',
  titleColor = 'blue',
  back,
  translateY: any,
  textAlignTitle,
  route,
  navigation,
  fontSize = 24,
  lineHeight = 30,
  fontFamily = 'fredokaSemiBold',
  color,
  titleWidth,
  titleType = 'text',
  children,
  handleRight,

  ...props
}: ICustomHeader) => {
  const {t} = useTranslation();
  const title: IObjectKeys = {
    [screenStackName.EDIT_PRO_PROFILE]: t('common:editProfile'),
    [screenStackName.EDIT_CLIENT_PROFILE]: t('common:editProfile'),
    [screenStackName.USER_SETTINGS]: t('common:setting'),
    [screenStackName.REQUEST_DETAILS]: t('common:requests'),
    [screenStackName.MISSION_DETAILS]: t('common:missions'),
    [screenStackName.USER_MANAGEMENT_PRO]: t('common:management'),
    [screenStackName.ARCHIVES]: t('common:archives'),
    [screenStackName.CLIENT_NOTIFICATIONS]: t('common:notifications'),
    [screenStackName.DASHBOARD]: t('common:dashboard'),
    [screenStackName.MANAGE_AVAILABILITY]: t('common:manageAvailability'),
    [screenStackName.Chat]: t('customWords:chat'),
    [screenStackName.BOOKING_CHECKOUT]: t('common:booking'),
    [screenStackName.BOOKING_HISTORY]: t('common:bookingHistory'),
  };

  const {navigate, goBack} = useStackNavigation();

  return (
    <SafeAreaView style={[{backgroundColor: '#fff'}, props?.headerContainer]}>
      <View
        style={[
          {
            height: 50,
            backgroundColor: '#fff',
            marginTop: Platform.OS === 'ios' ? StatusBar?.currentHeight : 0,
            flexDirection: 'row',
            alignItems: 'center',
          },
          props?.headerContainer,
        ]}>
        {(props?.leftIcon || props?.leftIconStyle || back) && (
          <View style={[{flex: 1}, props?.leftIconStyle]}>
            {back ? (
              <CustomButton
                hitSlop={15}
                style={[
                  {alignSelf: 'flex-start', marginStart: 10},
                  {
                    marginRight: route?.name === 'chat' ? 0 : null,
                  },
                ]}
                type="unstyled"
                onPress={() => {
                  if (navigation === undefined) {
                    goBack();
                  }
                  navigation && navigation.goBack();
                }}>
                <Entypo
                  name="chevron-left"
                  size={24}
                  color={
                    leftIconColor === 'blue'
                      ? colors?.primary
                      : leftIconColor === 'black'
                      ? colors?.defaultBlack
                      : colors?.secondary
                  }
                />
              </CustomButton>
            ) : props?.leftIcon ? (
              props?.leftIcon
            ) : null}
          </View>
        )}

        {/* <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
            },
            props.leftIconContainer,
          ]}> */}
        {route?.name === 'chat' ? (
          // <CustomImage
          //   source={{uri: route?.params?.profile}}
          //   style={{height: 40, width: 40}}
          // />
          <Avatar
            source={
              route?.params?.profile
                ? {
                    uri: route?.params?.profile,
                  }
                : undefined
            }
            style={{height: 40, width: 40, marginHorizontal: 10}}
          />
        ) : null}
        {route?.name === 'chat' ? (
          <CustomText style={{marginLeft: 2}}>{route?.params?.name}</CustomText>
        ) : null}

        <View
          style={{
            flex: 8,

            // justifyContent: textAlignTitle ?? 'center',
          }}>
          {titleType === 'text' ? (
            <CustomText
              style={[
                {
                  alignSelf:
                    textAlignTitle == 'left'
                      ? 'flex-start'
                      : textAlignTitle == 'right'
                      ? 'flex-end'
                      : 'center',
                  textAlign: textAlignTitle ?? 'center',
                  width:
                    back || props?.leftIcon || props?.rightIcon
                      ? '50%'
                      : '100%',
                  fontSize: fontSizePixelRatio(fontSize),
                  fontFamily: fonts[fontFamily!] || fontFamily,
                  lineHeight: fontSizePixelRatio(lineHeight),
                  color:
                    titleColor === 'blue'
                      ? colors?.primary
                      : titleColor === 'black'
                      ? colors?.defaultBlack
                      : colors?.secondary,
                },
                props?.titleStyle,
              ]}>
              {route?.name === 'chat'
                ? null
                : props?.title ?? title[route?.name]}
            </CustomText>
          ) : children ? (
            <View style={[props?.titleStyle]}>{children}</View>
          ) : null}
        </View>

        {(props?.rightIcon || props?.rightIconStyle) && (
          <Pressable
            onPress={handleRight}
            style={[
              {
                flex: 1,
              },
              props?.rightIconStyle,
            ]}>
            {props?.rightIcon}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
