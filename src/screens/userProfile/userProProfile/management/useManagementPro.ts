import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {updateMenuRef} from 'src/redux/reducer/menuListReducer';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {comingSoonAlert} from 'src/utils/developmentFunctions';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useManagementPro = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {navigate, goBack} = useStackNavigation();
  const [modalOpen, setModalOpen] = useState(false);

  const userDetails = useAppSelector(state => state?.userReducer?.userDetails);

  const handleNavigate = (data: any) => {
    if (data?.navigation)
      return navigate(rootStackName.SCREEN_STACK, {
        screen: data?.navigation,
      });
    if (data?.navFunction) return data?.navFunction();

    comingSoonAlert();
  };
  return {
    t,
    handleNavigate,
    userDetails,
    modalOpen,
    setModalOpen,
    dispatch,
    // userData,
    navigate,
    goBack,
  };
};

export default useManagementPro;
