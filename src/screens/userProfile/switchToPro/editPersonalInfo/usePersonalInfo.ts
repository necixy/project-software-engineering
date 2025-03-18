import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
  createAccountLink,
  createStripeAccountApi,
} from 'src/api/stripe/stripeAccountId/stripeAccountId';
import updateProPersonalInfo from 'src/firebase/updateProPersonalDetails/updateProPersonalInfo';
import { screenStackName } from 'src/navigation/constant/screenStackName';
import { useAppSelector } from 'src/redux/reducer/reducer';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
  showModal,
} from 'src/shared/components/modalProvider/ModalProvider';
import * as yup from 'yup';

import { useEffect, useState } from 'react';
import { databaseRef } from 'src/utils/useFirebase/useFirebase';
import database from '@react-native-firebase/database';
import { phoneReg } from 'src/@types/regex/regex';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePersonalInfo = ({ params }: any) => {
  const [lang, setLang] = useState<'en' | 'fr'>();
  AsyncStorage.getItem('user-language', (err, language) => {
    language && setLang(language! ?? 'en');
  });
  const { navigate } = useNavigation();
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  const displayName = useAppSelector(
    state => state?.userReducer?.userDetails?.displayName
  );
  // const prevData = params?.prevData!;
  const [prevData, setPrevData] = useState(params?.prevData!);
  const { t } = useTranslation();
  const userData = useAppSelector(state => state?.userReducer?.userDetails);
  const PersonalInfo = yup.object().shape({
    firstName: yup.string().trim().required(t('customWords:firstNameRequired')),
    lastName: yup.string().trim().required(t('customWords:lastNameRequired')),
    dateOfBirth: yup.string().trim().required(t('customWords:dobRequired')),
    address: yup.string().trim().required(t('customWords:addressRequired')),
    city: yup.string().trim().required(t('customWords:cityRequired')),
    country: yup.string().trim().required(t('customWords:pleasePickCountry')),
    postCode: yup.string().trim().required(t('customWords:postCodeRequired')),
    termsAccepted: yup.boolean().required(t('customWords:firstNameRequired')),
    phoneNumber: yup
      .string()
      .trim()
      .required(t('customWords:phoneRequired'))
      .matches(phoneReg, t('customWords:phoneNumberNotValid')),
  });
  const formik = useFormik<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    city: string;
    country: string;
    postCode: string;
    termsAccepted: boolean;
    phoneNumber: string;
    countryCode: string;
  }>({
    initialValues: {
      firstName: __DEV__ ? 'Gunjan' : prevData! ? prevData?.firstName : '',
      lastName: __DEV__ ? 'Sharma' : prevData! ? prevData?.lastName : '',
      dateOfBirth: __DEV__
        ? '2001-02-01'
        : prevData!
          ? prevData?.dateOfBirth
          : '',
      address: __DEV__ ? 'Shastri nagar' : prevData! ? prevData?.address : '',
      city: __DEV__ ? 'Paris' : prevData! ? prevData?.city : '',
      country: __DEV__ ? '' : prevData! ? prevData?.country : '',
      postCode: __DEV__ ? '78000' : prevData! ? prevData?.postCode : '',
      phoneNumber: __DEV__
        ? '+33612345678'
        : prevData!
          ? prevData?.phoneNumber
          : '',
      termsAccepted: __DEV__
        ? true
        : prevData!
          ? prevData?.termsAccepted
          : false,
      countryCode: prevData?.countryCode ?? "+33",
    },
    validationSchema: PersonalInfo,
    onSubmit: async values => {
      if (values?.termsAccepted) {
        // try {
        //   // setIsProfessionLoading(true);
        //   await database()
        //     .ref('CountryCode/')
        //     .once('value', snapshot => {
        //       const data = snapshot.val();
        //       console.log('snapshot', data);
        //       // setProfessions(snapshot.val());
        //     });
        // } catch (error) {
        //   console.error('Error in getting professions', error);
        // } finally {
        //   // setIsProfessionLoading(false);
        // }
        try {
          showLoadingSpinner({});

          const dob = {
            day: moment(values?.dateOfBirth).date(),
            month: moment(values?.dateOfBirth).month() + 1,
            year: moment(values?.dateOfBirth).year(),
          };
          const address = {
            city: values?.city,
            country: values?.country,
            postal_code: values?.postCode,
            line1: values?.address,
          };
          console.log({ values });


          const res: any = await createStripeAccountApi(
            serverType,
            userData?.email,
            userData?.uid,
            values?.firstName,
            values?.lastName,
            dob,
            address,
            `${values?.countryCode}${values?.phoneNumber}`,
            displayName
          );

          console.log({ res });

          const { accountId } = res ?? {}
          if (accountId) {
            const accountLink = await createAccountLink(accountId)
            console.log({ accountLink });

            const { url } = accountLink ?? {};

            url && navigate(screenStackName.WEB_VIEW, { url });
          }

          //Old pro switch steps
          // await updateProPersonalInfo(
          //   userData?.uid,
          //   values?.firstName,
          //   values?.lastName,
          //   values?.dateOfBirth,
          //   values?.address,
          //   values?.city,
          //   values?.country,
          //   values?.postCode,
          //   values?.termsAccepted,
          // );
          // const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
          // const postsRef = databaseRef(`users/${uid}`);
          // const newPostRef = postRef.push();
          // let postData = {
          // id : newPostRef?.key,
          // name:"First Post",
          // createdAt:firebaseTimestamp,
          // ...otherdata
          // }
          // newPostRef.set(postData);
          // navigate(screenStackName.PRO_PHONE_NUMBER);
        } catch (error) {
          console.error('Error in create Pro Profile Screen', error);
          // showModal({
          //   type: "error",
          //   message: error?.message
          // })

        } finally {
          hideLoadingSpinner();
        }
      } else {
        !values?.termsAccepted &&
          showModal({
            message: 'Please accept the terms of use before proceeding',
            type: 'error',
          });
      }
    },
  });
  useEffect(() => {
    console.log(formik.values, "lololoofidfi")
  }, [formik.values])
  console.log(formik.initialValues, 'for')
  useEffect(() => {
    if (userData) {
      formik.setValues({
        ...formik.values,
        countryCode: userData?.countryCode?.dial_code,
        phoneNumber: userData?.phoneNumber,
      });
    }
  }, [userData]);

  return { formik, userData, navigate, lang };
};

export default usePersonalInfo;
