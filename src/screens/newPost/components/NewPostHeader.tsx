// This code renders the header for new post and share post screens of the application.
import {View, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import CustomText from '../../../shared/components/customText/CustomText';
import {globalStyles} from '../../../constants/globalStyles.style';
import Icon from '../../../assets/svg';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {DrawerActions} from '@react-navigation/native';
import {IS_IOS} from 'src/constants/deviceInfo';
import {THeaderProps, image} from '../@types/newPostTypes';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll/src/CameraRoll';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {useTranslation} from 'react-i18next';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {fonts} from 'src/theme/fonts';

//Functional component code for the header component.
const NewPostHeader = ({
  selected,
  hasCancel,
  back = false,
  setSelected,
  images,
  hasNext = true,
}: THeaderProps) => {
  // The code below destructures functions and data from the custom navigation hook useStackNavigation
  const {t} = useTranslation();
  const {navigate, dispatch, goBack} = useStackNavigation();
  return (
    <View style={[globalStyles.flexRow, globalStyles.mv1]}>
      <CustomHeader
        leftIcon={
          hasCancel ? (
            <CustomButton
              type="unstyled"
              onPress={() => {
                goBack();
              }}>
              <Ionicons
                name="chevron-back"
                color={colors.defaultBlack}
                size={25}
                style={[{left: 10}]}
              />
            </CustomButton>
          ) : (
            <CustomButton
              type="unstyled"
              onPress={() => {
                back ? goBack() : dispatch(DrawerActions.closeDrawer());
              }}>
              <Icon
                name="cancel"
                width={25}
                height={25}
                color={colors.defaultBlack}
                style={[{left: 10}]}
              />
            </CustomButton>
          )
        }
        headerContainer={{width: '100%', alignItems: 'center'}}
        title={t('customWords:newPost')}
        titleColor="black"
        fontSize={18}
        fontFamily="openSansBold"
        rightIcon={
          selected?.length != 0 && hasNext ? (
            <CustomButton
              style={{
                height: 30,
                alignSelf: 'flex-end',
                marginEnd: 2,
                right: 10,
              }}
              onPress={() =>
                navigate(rootStackName.SHARE_POST, {
                  selected,
                  setSelected,
                  images,
                })
              }
              type="unstyled"
              fontSize={15}
              textProps={{
                style: {
                  fontFamily: fonts.openSansBold,
                  color: colors?.primary,
                },
              }}>
              {t('common:next')}
            </CustomButton>
          ) : (
            <></>
          )
        }
      />
      {/* {hasCancel ? (
        <Ionicons
          onPress={() => {
            goBack();
          }}
          name="chevron-back"
          color={colors.defaultBlack}
          size={25}
          style={[{left: 10, position: 'absolute'}]}
        />
      ) : (
        <Icon
          onPress={() => {
            back ? goBack() : dispatch(DrawerActions.closeDrawer());
          }}
          name="cancel"
          width={25}
          height={25}
          color={colors.defaultBlack}
          style={[{left: 10, position: 'absolute'}]}
        />
      )} */}
      {/* <CustomText color="defaultBlack" fontSize={20} fontFamily="openSansBold">
        New Post
      </CustomText>

      {selected?.length != 0 && hasNext ? (
        <TouchableOpacity
          onPress={() => {
            navigate(rootStackName.SHARE_POST, {selected, setSelected, images});
          }}
          style={{position: 'absolute', right: 10}}>
          <CustomText color="primary" fontSize={20} fontFamily="openSansBold">
            Next
          </CustomText>
        </TouchableOpacity>
      ) : null} */}
    </View>
  );
};

export default NewPostHeader;
