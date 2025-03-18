import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';
import {useFormik} from 'formik';
import moment from 'moment';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {login} from 'src/firebase/auth/auth';
import {AuthStackRouteName} from 'src/navigation/constant/authStackRouteName';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {updateDetails, updateUserType} from 'src/redux/reducer/userReducer';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef, deleteData} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import * as yup from 'yup';

const checkUniqueUsername = async (email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await databaseRef('users')
        .orderByChild('email')
        .equalTo(`${email?.toLowerCase()}`)
        .once('value');
      let data: TUserDetails[] | null = snapshot.exists()
        ? Object.values(snapshot.val())
        : null;
      data = data?.[0]?.isDeleted;
      // return resolve(!snapshot.exists());
      return resolve({deleteData: data});
    } catch (error) {
      console.error('error on fetch username', error);

      return reject(error);
    }
  });
};

const useLogin = () => {
  const {t} = useTranslation();
  const navigation = useStackNavigation();
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(state => state?.userReducer?.userDetails);
  const [fetching, setFetching] = useState<boolean>(false);
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  const validationLogin = yup.object().shape({
    password: yup
      .string()
      .trim()
      .required(t('customWords:passwordRequired'))
      .min(8, t('customWords:charactersLongRequest')),
    email: yup
      .string()
      .trim()
      .email(t('message:invalidEmail'))
      .required(t('customWords:emailRequired')),
  });

  const formik = useFormik({
    initialValues: {
      email: __DEV__ ? 'kamal333@mailinator.com' : '',
      password: __DEV__ ? 'Qwerty@1234' : '',
    },
    validationSchema: validationLogin,
    onSubmit: async values => {
      try {
        setFetching(true);
        const isUnique = await checkUniqueUsername(values?.email);
        let deletingStatus = isUnique?.deleteData?.createdAt!;

        if (deletingStatus !== undefined) {
          const momentTimestamp = moment(deletingStatus);
          const today = moment();

          const difference = today.diff(momentTimestamp);

          const daysDifference = parseInt(
            moment.duration(difference).asDays().toString(),
          );
          if (daysDifference < 30) {
            showModal({
              type: 'error',
              message: `This account is under deletion process and will be deleted within ${
                30 - daysDifference
              } days`,
            });
          } else {
            showModal({
              type: 'error',
              message: t('message:accountIsDeleted'),
            });
          }
        } else {
          var res: FirebaseAuthTypes.UserCredential | undefined = undefined;
          res = await login(values);

          if (res?.user?.emailVerified) {
            // await databaseRef(`users/${res?.user?.uid}`).once(
            //   'value',
            //   snapshot => {
            //     let userData = snapshot.val();
            //     // let createdAtTime = moment(
            //     //   userData?.isDeleted?.createdAt,
            //     //   'YYYYMMDD',
            //     // ).format('YYYY MM DD');

            //     // const momentTimestamp = moment(userData?.isDeleted?.createdAt);
            //     // const today = moment();

            //     // const difference = today.diff(momentTimestamp);

            //     // const daysDifference = parseInt(
            //     //   moment.duration(difference).asDays().toString(),
            //     // );

            //     // if (res?.user?.uid) {
            //     //   showModal({
            //     //     title: "Can't Login!",
            //     //     message: `This user account is deactivated and will be deleted after ${
            //     //       30 - daysDifference
            //     //     } days`,
            //     //     type: 'error',
            //     //   });
            //     //   return;
            //     // } else {
            //     //   showModal({
            //     //     title: 'This account does not exist.',
            //     //     message: `Kindly signup before you login`,
            //     //     type: 'error',
            //     //   });
            //     //   return;
            //     // }
            //   },
            // );
            await databaseRef(`users/${res?.user?.uid}`).once(
              'value',
              snapshot => {
                let userData = snapshot.val() ?? null;

                dispatch(updateUserType(userData?.isPro ? 'pro' : 'client'));
                dispatch(updateDetails(userData));
                if (!userData) {
                  showModal({
                    title: 'Something went wrong!',
                    message: 'Please check the server type and try again',
                    type: 'error',
                  });
                }
              },
            );
          } else {
            navigation.navigate(AuthStackRouteName.WAIT_FOR_VERIFICATION);
          }
        }
      } catch (error: any) {
        console.error('error', error);
        const errorCode = error.code as FirebaseLoginError;
        handleLoginError(errorCode);
      } finally {
        setFetching(false);
      }
    },
  });

  // Function to handle login errors
  const handleLoginError = (errorCode: FirebaseLoginError) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        showModal({
          message: t('message:invalidEmail'),
          type: 'error',
        });

        break;
      case 'auth/user-disabled':
        showModal({
          message: t('message:userDisabled'),
          type: 'error',
        });

        break;
      case 'auth/invalid-credential':
        showModal({message: t('message:invalidCredential'), type: 'error'});
        break;
      case 'auth/user-not-found':
        showModal({
          message: t('message:userNotFound'),
          type: 'error',
        });

        break;
      case 'auth/too-many-requests':
        showModal({
          message: t('message:tooManyRequests'),
          type: 'error',
        });

        break;

      default:
        showModal({
          message: t('message:loginFailed'),
          type: 'error',
        });

        break;
    }
  };

  const navSignUp = () => {
    formik.resetForm();
    navigation.navigate(AuthStackRouteName?.SIGN_UP);
  };
  const navForgot = () => {
    navigation.navigate(AuthStackRouteName?.FORGOT_PASSWORD);
  };
  return {formik, navSignUp, fetching, serverType, navForgot};
};

export default useLogin;
