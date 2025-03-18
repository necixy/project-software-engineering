import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventRegister } from 'react-native-event-listeners';
import editProProfile from 'src/firebase/editProfile/editProProfile';
import { useAppSelector } from 'src/redux/reducer/reducer';
import useSignUp from 'src/screens/auth/signUp/useSignUp';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
  showModal,
} from 'src/shared/components/modalProvider/ModalProvider';
import * as yup from 'yup';
import useCropImage from './useCropImage';
import { Alert } from 'react-native';

const useEditProProfile = () => {
  const { handleProfilePicker, handleFrontPicker, profileImg, frontImg } =
    useCropImage();

  const navigation = useNavigation();

  const { t } = useTranslation();

  const userData = useAppSelector(state => state?.userReducer?.userDetails);

  const [locationData, setLocationData] = useState<AddressInfo>();

  const [professionData, setProfessionData] = useState(userData?.profession);

  const { checkUniqueUsername } = useSignUp();

  const uid: string = useAppSelector(
    state => state?.userReducer?.userDetails?.uid,
  );

  const editProProfileValidation = yup.object().shape({
    displayName: yup
      .string()
      .trim()
      .required('please add user name')
      .max(30, t('message:nameMessage')),
    profession: yup.string().trim(),
    location: yup.string().trim(),
    bio: yup.string().trim().max(100, t('message:bioMessage')),
  });

  const formik = useFormik<{
    displayName: string;
    profession: string;
    location: string;
    bio: string;
  }>({
    initialValues: {
      displayName: '',
      profession: '',
      location: '',
      bio: '',
    },
    validationSchema: editProProfileValidation,
    onSubmit: async values => {
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

        await editProProfile(
          uid,
          values.displayName.trim(),

          professionData,
          locationData,
          values.bio,
          profileImg,
          frontImg,
        );
        navigation.goBack();

        showModal({
          title: t('customWords:updatedSuccessfully'),
          message: t('message:changesUpdatedSuccessfully'),
          type: 'success',
        });
      } catch (error) {

        console.error('Error in Edit Pro Profile Screen', error);
        showModal({
          type: "error",
          message: error?.message + ''
        })

      } finally {
        hideLoadingSpinner();
      }
    },
  });

  useEffect(() => {
    if (userData) {
      formik.setValues({
        displayName: userData?.displayName,
        profession: userData?.profession,
        location: userData?.location?.city,
        bio: userData?.bio,
      });
    }

    // Register the event listener
    const listener = EventRegister.addEventListener(
      'getLocationEvent',
      data => {
        formik.setFieldValue('location', data.city); //If we need to handle the case in which there is no city; we can handle it from here by selecting country as if  "data?.country".
        setLocationData(data);
      },
    );

    const professionListener = EventRegister.addEventListener(
      'getProfessions',
      data => {
        formik.setFieldValue('profession', data);
        setProfessionData(data);
      },
    );

    // Ensure the listener is a string
    if (typeof listener === 'string') {
      // Cleanup the event listener when the component unmounts
      return () => {
        EventRegister.removeEventListener(listener);
      };
    }

    if (typeof professionListener === 'string') {
      // Cleanup the event listener when the component unmounts
      return () => {
        EventRegister.removeEventListener(professionListener);
      };
    }
  }, [userData]);

  return {
    formik,
    userData,
    handleProfilePicker,
    handleFrontPicker,
    profileImg,
    frontImg,
  };
};

export default useEditProProfile;
