import React, {useRef, useState} from 'react';
import {useFormik} from 'formik';
import auth, {firebase} from '@react-native-firebase/auth';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {updateUserType} from 'src/redux/reducer/userReducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

export default function useProVerifyCode(params: any) {
  const {navigate} = useStackNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [isResendEnable, setIsResendEnable] = useState(false);
  const [isVerificationIdResend, setIsisVerificationIdResend] =
    useState<any>(null);

  const [otp, setOtp] = useState<string>('');
  const firstVerificationID = params?.phoneAuthSnapshot?.verificationId;
  const ref = useRef<any>();

  const dispatch = useAppDispatch();
  const uid: string = useAppSelector(
    state => state?.userReducer?.userDetails?.uid,
  );

  const resendOtp = async () => {
    try {
      setIsResend(true);
      await auth()
        .verifyPhoneNumber(params?.proNumber, 120, true)
        .on('state_changed', phoneAuthSnapshot => {
          if (phoneAuthSnapshot.state === auth.PhoneAuthState.CODE_SENT) {
            setIsResendEnable(false);
            setIsResend(false);
            setIsisVerificationIdResend(phoneAuthSnapshot?.verificationId);
          }
        })
        .catch(error => {
          setIsResend(false);
          if (error.code == 'auth/invalid-phone-number') {
            return showModal({message: error?.message});
          }
          if (error.code == 'auth/too-many-requests') {
            return showModal({message: error?.message});
          } else {
            return showModal({
              message: 'An error occurred while verifying the phone number',
            });
          }
        });
    } catch (error) {
      console.error('errorerror', error);
      showModal({message: 'Please check your phone number'});
    } finally {
      setIsResend(false);
    }
  };

  const sendOtp = async () => {
    try {
      setIsLoading(true);

      const phoneCredentials = auth.PhoneAuthProvider.credential(
        isVerificationIdResend == null
          ? firstVerificationID
          : isVerificationIdResend,
        otp,
      );

      let signInRes = auth()
        .signInWithCredential(phoneCredentials)
        .then(async userCredentials => {
          navigate(screenStackName.SWITCH_PRO, {type: 'otpVerified'});
          await databaseRef(`users/${uid}/proPersonalInfo`).update({
            proPhoneNumber: params?.proNumber,
          });
          dispatch(updateUserType('pro'));
          await databaseRef(`users/${uid}`).update({
            isPro: true,
          });
        })
        .catch(error => {
          console.error(error);

          setIsLoading(false);
          if (error.code === 'auth/invalid-credential') {
            showModal({message: error?.message});
          } else {
            showModal({
              message: 'An error occurred while verifying the Otp',
            });
          }
        });
    } catch (error) {
      console.error('Invalid code', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    navigate,
    ref,
    resendOtp,
    setOtp,
    sendOtp,
    otp,
    isLoading,
    isResend,
    setIsResendEnable,
    isResendEnable,
  };
}
