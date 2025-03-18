import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import * as yup from 'yup';
// import {
//   getAuth,
//   updatePassword,
// } from 'firebase/auth';
import auth from '@react-native-firebase/auth';
export default function useNewPassword() {
  const {t} = useTranslation();
  const formik = useFormik({
    initialValues: {newPassword: '', confirmPassword: ''},
    validationSchema: yup.object().shape({
      newPassword: yup
        .string()
        .trim()
        .required(t('customWords:passwordRequired'))
        .min(8, t('customWords:charactersLongRequest')),
      confirmPassword: yup
        .string()
        .trim()
        .required(t('customWords:passwordRequired'))
        .oneOf([yup.ref('newPassword')], t('customWords:passwordNotMatch')),
    }),
    onSubmit: async values => {
      try {
        let res = await auth()?.currentUser?.updatePassword(
          values?.newPassword,
        );
        // await updatePassword(auth.currentUser, newPassword);
      } catch (error) {
        console.error('error', error);
      }
    },
  });
  return {formik, t};
}
