import {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {comingSoonAlert} from 'src/utils/developmentFunctions';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useUserSetting = () => {
  const {t} = useTranslation();
  const navigation = useStackNavigation();
  const [showSubList, setShowSubList] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userType = useAppSelector(state => state?.userReducer?.userType);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // handleNavigation: the function handles navigation of user setting components if it has navigation defined in it else would show coming soon alert
  const handleNavigation = (item: any) => {
    if (item?.navigation) {
      return navigation.navigate(rootStackName.SCREEN_STACK, {
        screen: item?.navigation,
      });
    } else if (item?.navFunction) {
      item?.navFunction && item?.navFunction();
    } else if (item?.subList) {
      return;
    } else {
      comingSoonAlert();
    }
  };

  const deleteUserAccount = async () => {
    const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;

    const userId = firebase.auth().currentUser?.uid;
    try {
      await databaseRef(`users/${userId}`).update({
        isDeleted: {
          createdAt: firebaseTimestamp,
          // reasonDescription: deleteReason,
          status: 'pending',
        },
      });
      setModalOpen(false);
      showModal({
        message: t('message:accountUnderDeletion'),
      });

      const timer = setTimeout(() => {
        dispatch({type: 'LOGOUT'});
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    } catch (error) {
      console.error({error});
    }
  };

  return {
    handleNavigation,
    navigation,
    t,
    showSubList,
    setShowSubList,
    dispatch,
    userType,
    modalOpen,
    setModalOpen,
    deleteUserAccount,
  };
};

export default useUserSetting;
