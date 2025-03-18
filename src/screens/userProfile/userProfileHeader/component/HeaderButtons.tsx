// Buttons in user and pro profile inside profile header

import {DrawerActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, Platform, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {handleMediaPermission} from 'src/screens/newPost/hooks/UsePermission';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const HeaderButtons = () => {
  const userDetails = useAppSelector(state => state?.userReducer?.userDetails);
  const {t} = useTranslation();
  const {dispatch, navigate} = useStackNavigation();
  // const [hasPermission, setHasPermission] = useState(false);
  // async function savePicture() {
  //   let permit: boolean = await handleMediaPermission();
  //   setHasPermission(permit);
  //   if (Platform.OS === 'android' && !permit) {
  //     return;
  //   }
  // }

  // useEffect(() => {
  //   savePicture();
  // }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        width: SCREEN_WIDTH * 0.94,
        alignItems: 'center',
        height: 35,
        marginVertical: 10,
        alignSelf: 'center',
      }}>
      {/* Pro User Edit profile or Follow button */}
      <CustomButton
        textProps={{style: {fontFamily: fonts?.arialBold}}}
        alignSelf="stretch"
        onPress={() => {
          navigate(rootStackName.SCREEN_STACK, {
            screen: screenStackName.EDIT_PRO_PROFILE,
          });
        }}
        style={{flex: 1, marginEnd: 5, height: 30}}>
        {t('common:editProfile')}
        {/* {userDetails?.isPro ? t('common:editProfile') : 'Follow'} */}
      </CustomButton>

      {/* Pro User Management Screen or Booking Screen Navigation button */}
      <CustomButton
        textProps={{style: {fontFamily: fonts?.arialBold}}}
        hitSlop={10}
        alignSelf="stretch"
        onPress={() => {
          navigate(rootStackName.SCREEN_STACK, {
            screen: screenStackName.USER_MANAGEMENT_PRO,
          });
        }}
        style={{flex: 1, marginEnd: 5, height: 30}}>
        {t('common:management')}
        {/* {userDetails?.isPro ? t('common:management') : 'Booking'} */}
      </CustomButton>

      <CustomButton
        onPress={() => {
          // if (hasPermission) {
          dispatch(DrawerActions.openDrawer());
          // } else {
          //   showModal({
          //     message: 'Allow media access to post images and videos.',
          //     successFn() {
          //       Linking.openSettings();
          //     },
          //   });
          // }
        }}
        hitSlop={10}
        type="unstyled"
        style={{
          backgroundColor: colors?.secondary,
          borderRadius: 7,
          borderWidth: 2,
          borderColor: colors?.primary,
          height: 30,
          // flex: 0.3,
          width: 30,
        }}>
        <MaterialIcons name="add" color={colors?.primary} size={26} />
      </CustomButton>
    </View>
  );
};

export default HeaderButtons;
