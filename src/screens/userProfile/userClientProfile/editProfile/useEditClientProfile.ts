import {useFormik} from 'formik';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import editClientProfile from 'src/firebase/editProfile/editClientProfile';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
  showModal,
} from 'src/shared/components/modalProvider/ModalProvider';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import * as yup from 'yup';
import useCropImage from '../../userProProfile/editProfile/useCropImage';
import useSignUp from 'src/screens/auth/signUp/useSignUp';
import {phoneReg} from 'src/@types/regex/regex';

const useEditClientProfile = () => {
  const uid: string = useAppSelector(
    state => state?.userReducer?.userDetails?.uid,
  );
  const userData = useAppSelector(state => state?.userReducer?.userDetails);
  const country = useAppSelector(state => state?.countryReducer?.country);
  const {t} = useTranslation();
  const navigation = useStackNavigation();
  const {handleProfilePicker, profileImg} = useCropImage();

  const {checkUniqueUsername} = useSignUp();

  const editClientProfileValidation = yup.object().shape({
    displayName: yup.string()?.trim(),
    // .required('Please add the userName'),
    email: yup.string()?.trim(),
    countryCode: yup.string()?.trim(),
    phoneNumber: yup
      .string()
      .matches(phoneReg, t('customWords:phoneNumberNotValid')),
  });
  const formik = useFormik<{
    displayName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
  }>({
    initialValues: {
      countryCode: '',
      displayName: '',
      email: '',
      phoneNumber: '',
    },
    validationSchema: editClientProfileValidation,
    onSubmit: async values => {
      if (!values?.displayName?.length || values?.displayName?.length > 30) {
        showModal({
          message:
            values?.displayName?.length > 30
              ? 'User Name cannot exceed 30 characters'
              : 'please add user name',
          type: 'error',
        });
      } else {
        try {
          showLoadingSpinner({});

          if (userData?.displayName !== values?.displayName) {
            const isUnique = await checkUniqueUsername(
              values?.displayName.trim(),
            );

            if (!isUnique) {
              return showModal({
                type: 'error',
                message: t('message:userNameAlreadyInUse'),
              });
            }
          }

          await editClientProfile(
            uid,
            values.displayName.trim(),
            values.email,
            values.phoneNumber,
            profileImg,
          );
          navigation?.popToTop();
          showModal({
            message: t('customWords:updatedSuccessfully'),
            type: 'success',
          });
        } catch (error) {
          console.error('Error in Edit Client Profile Screen', error);
        } finally {
          hideLoadingSpinner();
        }
      }
    },
  });

  useEffect(() => {
    if (userData) {
      formik.setValues({
        countryCode: userData?.countryCode?.dial_code,
        displayName: userData?.displayName,
        email: userData?.email,
        phoneNumber: userData?.phoneNumber,
      });
    }
  }, [userData]);

  return {formik, userData, handleProfilePicker, profileImg, country};
};

export default useEditClientProfile;
