import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import i18n from 'src/locale/i18n.config';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {useAppDispatch} from 'src/redux/reducer/reducer';
import {updateUserLanguage} from 'src/redux/reducer/userReducer';

const useLanguagePicker = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();

  const getLang = async () => {
    let language = await AsyncStorage.getItem('user-language');
    if (language === 'fr') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  };

  useEffect(() => {
    getLang();
  }, []);

  const toggleSwitch = async () => {
    try {
      if (isEnabled) {
        await i18n.changeLanguage('en');
        setIsEnabled(false);
        dispatch(updateUserLanguage('en'));
        await AsyncStorage.setItem('user-language', 'en');
        navigate(rootStackName.HOME_DRAWER);
      } else {
        await i18n.changeLanguage('fr');
        setIsEnabled(true);
        dispatch(updateUserLanguage('fr'));
        await AsyncStorage.setItem('user-language', 'fr');
        navigate(rootStackName.HOME_DRAWER);
      }
    } catch (error) {
      console.error('handleLanguageChange error', error);
    }
  };
  return {isEnabled, setIsEnabled, toggleSwitch, navigate};
};

export default useLanguagePicker;
