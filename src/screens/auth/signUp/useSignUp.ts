import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import {AuthStackRouteName} from 'src/navigation/constant/authStackRouteName';

import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useState} from 'react';
import {signup} from 'src/firebase/auth/auth';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { getFunctions, httpsCallable } from "firebase/functions";
import {
  checkCharacterRegex,
  emailRegex,
  passwordLowerCaseRegex,
  passwordNumericRegex,
  passwordUpperCaseRegex,
} from 'src/@types/regex/regex';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useSignUp = () => {
  const [lang, setLang] = useState<'en' | 'fr'>();
  AsyncStorage.getItem('user-language', (err, language) => {
    language && setLang(language! ?? 'en');
  });
  // const functions = getFunctions();
  const navigation = useStackNavigation();

  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isTermAndCondition, setIsTermAndCondition] = useState(false);
  const [fcmTokens, setFcmTokens] = useState<any>([]);

  // Method to check unique username
  const checkUniqueUsername = async (username: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        setFetching(true);
        const snapshot = await databaseRef('users/')
          .orderByChild('displayName')
          .equalTo(`${username}`)
          .once('value');

        return resolve(!snapshot.exists());
      } catch (error) {
        console.error('error on fetch username', error);

        return reject(error);
      } finally {
        setFetching(false);
      }
    });
  };

  const validationSignUp = yup.object().shape({
    username: yup
      .string()
      .trim()
      .max(30, t('message:nameMessage'))
      .required(t('customWords:usernameRequired')),
    // .test(async function (value) {

    //   const isUnique = await checkUniqueUsername(value);

    //   if (!isUnique) {
    //     return this.createError({
    //       path: 'username',
    //       message: t('message:userNameAlreadyInUse'),
    //     });
    //   }
    //   return true;
    // }),
    password: yup
      .string()
      .trim()
      .required(t('customWords:passwordRequired'))
      .min(8, t('customWords:charactersLongRequest'))
      .matches(
        passwordUpperCaseRegex,
        t('customWords:passwordMustHaveACapitalLetter'),
      )
      .matches(passwordNumericRegex, t('customWords:passwordMustHaveANumber'))
      .matches(
        checkCharacterRegex,
        t('customWords:passwordMustHaveASpecialCharacter'),
      )
      .matches(
        passwordLowerCaseRegex,
        t('customWords:passwordMustHaveASmallLetter'),
      ),

    email: yup
      .string()
      .trim()
      // .email(t('message:invalidEmail')) // Optional: custom error message for built-in email validation
      .matches(emailRegex, t('message:invalidEmail')) // Custom regex validation
      .required(t('customWords:emailRequired')),
    // yup.string().trim().email().required(t('customWords:emailRequired')),
    confirmPassword: yup
      .string()
      .trim()
      .required(t('customWords:passwordRequired'))
      .oneOf([yup.ref('password')], t('customWords:passwordNotMatch')),
    termsAccepted: yup.boolean().required(t('customWords:acceptTerms')),
  });

  const formik = useFormik({
    initialValues: {
      // username: __DEV__ ? 'Pratik Purohit' : '',
      // email: __DEV__ ? 'necixy@hotmail.com' : '',
      username: __DEV__ ? 'prouser' : '',
      email: __DEV__ ? 'proUser@mailinator.com' : '',
      password: __DEV__ ? 'Qwerty1234@' : '',
      confirmPassword: __DEV__ ? 'Qwerty1234@' : '',
      termsAccepted: __DEV__ ? true : false,
    },
    validationSchema: validationSignUp,

    onSubmit: async values => {
      if (values?.termsAccepted) {
        try {
          // if (serverType === 'DEVELOPMENT') {
          //   const modifiedEmail = serverType + '_' + values?.email;
          //   res = await signup({
          //     ...values,
          //     email: 'yy1@mailinator.com',
          //   });
          // } else if (serverType === 'STAGING') {
          //   const modifiedEmail = serverType + '_' + values?.email;
          //   res = await signup({
          //     ...values,
          //     email: modifiedEmail,
          //   });
          //   res = await signup(values);
          // } else if (serverType === 'LIVE') {
          //   res = await signup(values);
          // }
          setLoading(true);
          const isUnique = await checkUniqueUsername(
            values?.username?.toLowerCase(),
          );
          if (!isUnique) {
            return showModal({
              type: 'error',
              message: t('message:userNameAlreadyInUse'),
            });
          }
          // const enabled = await firebase.messaging().hasPermission();
          // if (enabled) {
          //   firebase
          //     .messaging()
          //     .getToken()
          //     .then((res: any) => {
          //       setFcmTokens([...fcmTokens, res]);
          //     })
          //     .catch(err => console.error('res error of token', err));
          // } else {
          // }
          var res: FirebaseAuthTypes.UserCredential | undefined = undefined;

          setFetching(true);
          res = await signup(values);

          if (!res) {
            return;
          }

          await res?.user?.sendEmailVerification();

          const {uid, emailVerified, photoURL, email} = res?.user;

          databaseRef(`/users/${uid}`)?.set({
            displayName: values?.username?.toLowerCase(),
            email,
            emailVerified: emailVerified,
            photoURL: photoURL,
            isFollowing: [],
            followers: [],
            isPro: false,
            uid,
          });
          // await createStripeAccountApi(serverType, email, uid);
          // dispatch(updateDetails(res?.user));
          navigation.navigate(AuthStackRouteName.WAIT_FOR_VERIFICATION);
        } catch (error: any) {
          handleSignupErrors(error.code);
        } finally {
          setFetching(false);
          setLoading(false);
        }
      } else {
        showModal({
          message: 'Please accept the terms and conditions',
          type: 'error',
        });
      }
    },
  });

  const handleSignupErrors = (error: FirebaseCreateError) => {
    console.error({error}, 'checking signup errors', error);
    switch (error) {
      case 'auth/email-already-in-use':
        showModal({
          message: t('message:emailAlreadyInUse'),
          type: 'error',
        });
        break;
      // default:
      //   showModal({
      //     message: error,
      //     type: 'error',
      //   });

      // default:
      //   showModal({
      //     message: t('message:signUpFailed'),
      //     type: 'error',
      //   });
      //   break;
    }
  };

  return {
    formik,
    navigate: navigation.navigate,
    t,
    fetching,
    isTermAndCondition,
    setIsTermAndCondition,
    serverType,
    loading,
    checkUniqueUsername,
    lang,
  };
};

export default useSignUp;
