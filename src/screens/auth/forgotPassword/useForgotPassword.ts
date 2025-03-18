import {useFormik} from 'formik';
import * as yup from 'yup';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {forgotPassword} from 'src/firebase/auth/auth';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {useNavigation} from '@react-navigation/native';
import {AuthStackRouteName} from 'src/navigation/constant/authStackRouteName';

export default function useForgotPassword() {
  const {navigate} = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  const hideEmail = (email: string): string => {
    const [username, domain] = email?.split('@');

    if (!username || !domain) {
      return '';
    }

    const firstChar = username[0];
    const lastChar = username[username.length - 1];

    const domainStart = domain?.substring(0, 2);
    const domainEnd = domain?.substring(domain.length - 3);

    return `${firstChar}******${lastChar}@${domainStart}****${domainEnd}`;
  };

  const validationForgot = yup.object().shape({
    email: yup
      .string()
      .trim()
      .email(t('message:invalidEmail'))
      .required(t('customWords:usernameEmailRequired')),
  });
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationForgot,
    onSubmit: async values => {
      try {
        setIsLoading(true);
        var res = await forgotPassword(values?.email);
        showModal({
          title: t('message:emailTitle'),
          message: `${t('message:weSentAnEmailTo')} ${hideEmail(
            values?.email,
          )} ${t('message:withALinkToGetBackIntoYourAccount')}`,
          successFn() {},
          type: 'success',
        });
        navigate(AuthStackRouteName.LOGIN);
      } catch (error) {
        console.error('forgot', error);
      } finally {
        setIsLoading(false);
      }
    },
  });
  return {formik, serverType, isLoading};
}
