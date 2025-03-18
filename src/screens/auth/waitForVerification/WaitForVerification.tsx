import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, View} from 'react-native';
import {globalStyles} from 'src/constants/globalStyles.style';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {updateDetails} from 'src/redux/reducer/userReducer';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {colors} from 'src/theme/colors';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const WaitForVerification = ({navigation}: any) => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  // const setData = (userData: any) => {};

  const updateRef = async () => {
    const user = auth()?.currentUser;
    await databaseRef(`users/${user?.uid}`)?.update({
      emailVerified: true,
    });
    await databaseRef(`users/${user?.uid}`).once('value', snapshot => {
      let userData = snapshot.val();
      dispatch(updateDetails(userData));
    });
    setIsLoading(false);
  };
  // useEffect(() => {
  //   auth().onUserChanged(response => {
  //     const unsubscribeSetInterval = setInterval(() => {
  //       auth().currentUser?.reload();
  //     }, 15000);
  //     if (response?.emailVerified) {
  //       clearInterval(unsubscribeSetInterval); //stop setInterval
  //       const user = auth().currentUser;

  //       updateRef();
  //     }
  //   });
  // }, []);
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  const checkUserIsVerified = async () => {
    // if (serverType === 'DEVELOPMENT' || serverType === 'STAGING') {
    //   updateRef();
    // } else
    try {
      setIsLoading(true);
      await auth().currentUser?.reload();
      if (auth().currentUser?.emailVerified) {
        updateRef();
      } else {
        showModal({
          message:
            'Your account is not yet verified. Please check your email and try again.',
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Container contentContainerStyle={globalStyles.ph2}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {/* <LoadingSpinner style={{flex: 0.2}} /> */}
        <CustomText fontSize={18} fontFamily="openSansBold">
          {t('customWords:accountVerificationRequired')}
        </CustomText>
        <CustomText
          textAlign="center"
          fontFamily="arialRegular"
          color="grey"
          marginVertical={20}>
          {t('customWords:checkYourMail')}
        </CustomText>
        {serverType !== 'LIVE' && (
          <CustomText
            onPress={() =>
              Linking.openURL(
                `https://www.mailinator.com/v4/public/inboxes.jsp?to=${
                  auth()?.currentUser?.email
                }`,
              )
            }
            style={{
              color: colors.primary,
              textDecorationLine: 'underline',
            }}>
            Go to Verify (Development Only)
          </CustomText>
        )}
        <CustomButton
          isLoading={isLoading}
          onPress={checkUserIsVerified}
          alignSelf="center"
          style={{marginVertical: 20}}>
          {t('customWords:checkAccountVerification')}
        </CustomButton>

        <CustomButton
          onPress={() => auth().currentUser?.sendEmailVerification()}>
          {t('customWords:resend')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default WaitForVerification;
