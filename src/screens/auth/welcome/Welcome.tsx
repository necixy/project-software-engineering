import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {globalStyles} from 'src/constants/globalStyles.style';
import {AuthStackRouteName} from 'src/navigation/constant/authStackRouteName';
import {AuthUseNavigationProps} from 'src/navigation/navigationHooks';
import ChangeServer from 'src/shared/components/changeServer/ChangeServer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {getDeviceId} from 'react-native-device-info';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import Heading from '../components/Heading';
import welcomeStyles from './Welcome.style';
import {useAppSelector} from 'src/redux/reducer/reducer';

export default function Welcome() {
  const {navigate} = useNavigation<AuthUseNavigationProps>();
  const {t} = useTranslation();
  // const dispatch = useAppDispatch();
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  // useEffect(() => {
  //   dispatch(updateBaseUrl('Staging'));
  // }, []);
  useEffect(() => {
    updateDeviceIndex();
  }, [serverType]);
  const updateDeviceIndex = async () => {
    try {
      const deviceId = getDeviceId();
      await databaseRef(`deviceIndex/${deviceId}`).once('value', snapshot => {
        let userId = snapshot.val();
        userId && databaseRef(`/fcmTokens/${userId}/${deviceId}`).remove();
      });
    } catch (error) {
      console.error('error in device index', error);
    }
  };
  return (
    <View
      style={[
        globalStyles.screenCenter,
        {backgroundColor: colors.secondary, paddingBottom: 50},
      ]}>
      <Heading
        container={{top: -10}}
        text={`${t('customWords:bestProAtYourDoor')}💆🏻‍♂️`}
      />
      <CustomButton
        onPress={() => navigate(AuthStackRouteName.LOGIN)}
        alignSelf="center"
        fontSize={18}
        style={welcomeStyles.logInButton}
        textProps={{
          style: welcomeStyles.logInText,
        }}>
        {t('customWords:logIn')}
      </CustomButton>
      <CustomButton
        type="white"
        alignSelf="center"
        fontSize={18}
        style={[welcomeStyles.logInButton, {marginTop: 10}]}
        textProps={{
          style: {
            // fontSize: fontSizePixelRatio(20),
            fontFamily: fonts.openSansBold,
            color: colors.primary,
          },
        }}
        onPress={() => navigate(AuthStackRouteName.SIGN_UP)}>
        {t('customWords:signUp')}
      </CustomButton>
      <ChangeServer />
    </View>
  );
}
