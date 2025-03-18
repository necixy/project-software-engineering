import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {useFormik} from 'formik';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import * as yup from 'yup';
import {useAppSelector} from 'src/redux/reducer/reducer';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

export default function useProPhoneNumber() {
  const {navigate} = useStackNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const phoneNumberRegex = /^\+?([2-9])(?!\1+$)\d{8,14}$/;
  const userData = useAppSelector(state => state?.userReducer?.userDetails);

  const verifyCode = async (values?: any) => {
    try {
      setIsLoading(true);
      await auth()
        .verifyPhoneNumber(values?.proPhoneNumber, 90)
        .on('state_changed', phoneAuthSnapshot => {
          if (phoneAuthSnapshot.state === auth.PhoneAuthState.CODE_SENT) {
            navigate(screenStackName.PRO_VERIFY_CODE, {
              phoneAuthSnapshot,
              proNumber: values?.proPhoneNumber,
            });
          }
        })
        .catch(error => {
          console.error('useProPhoneNumber', error);
          setIsLoading(false);
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
      // .on(
      //   'state_changed',
      //   phoneAuthSnapshot => {
      //     console.log('state', phoneAuthSnapshot);
      //     if (phoneAuthSnapshot.state === auth.PhoneAuthState.CODE_SENT) {
      //       navigate(screenStackName.PRO_VERIFY_CODE, {
      //         phoneAuthSnapshot,
      //         proNumber: values?.proPhoneNumber,
      //       });
      //       setUserVerificationCode((prevState: any) => ({
      //         ...prevState,
      //         phoneAuthSnapshot,
      //       }));
      //     }
      //     console.log('phoneAuthSnapshot', phoneAuthSnapshot);
      //   },
      //   error => {
      //     console.log('Error verifying phone number:', error.code);
      //
      //   },
      // );
    } catch (error) {
      console.error('errorerror', error);
      showModal({message: 'Please check your phone number'});
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {proPhoneNumber: __DEV__ ? '+1 650-555-3434' : ''},
    validationSchema: yup.object().shape({
      proPhoneNumber: yup.string().trim().required('Mobile number is Required'),
      // .matches(phoneNumberRegex, 'Please enter valid mobile number'),
    }),

    onSubmit: async values => {
      verifyCode(values);
    },
  });
  return {formik, isLoading, userData};
}
