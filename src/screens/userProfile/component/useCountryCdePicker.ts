import {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

type countryCodeT = {
  code: string;
  dial_code: string;
  name: string;
};

const useCountryCdePicker = () => {
  const {t} = useTranslation();
  const {goBack} = useStackNavigation();
  const dispatch = useAppDispatch();

  const initialCountry = useAppSelector(
    state => state?.countryReducer?.country,
  );
  const [filter, setFilter] = useState<countryCodeT[]>([]);
  // const [temp, setTemp] = useState<string>('');
  // State to hold the list of countryCode
  const [countryCode, setCountryCode] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<
    countryCodeT | undefined
  >(initialCountry);
  const [search, setSearch] = useState<string>('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // useEffect to call getCountryCode when the component mounts
  useEffect(() => {
    getCountryCode();
  }, []);

  // Function to fetch countryCode from the Firebase database
  const getCountryCode = async () => {
    try {
      setIsCountryCodeLoading(true);
      await database()
        .ref('/CountryCode')
        .once('value', snapshot => {
          setCountryCode(snapshot.val());
        });
    } catch (error) {
      console.error('Error in getting country code', error);
    } finally {
      setIsCountryCodeLoading(false);
    }
  };

  // State to manage loading status
  const [isCountryCodeLoading, setIsCountryCodeLoading] = useState(false);

  const onChangeText = (text: string) => {
    setSearch(text);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      let filteredItems = countryCode?.filter(
        (item: countryCodeT) =>
          item?.dial_code?.includes(search) || item?.name?.includes(search),
      );
      setFilter(filteredItems);

      if (search == '') {
        setFilter([]);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  const navigation = useNavigation();

  const handleGoBack = (selectedCountry: countryCodeT) => {
    navigation.goBack();
    if (selectedCountry!) {
      navigation.setParams({selectedCountry});
    }
  };

  // console.log({countryCode, selectedCountry});

  const setCountryCodeFB = async () => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      await databaseRef(`users/${userId}`).update({
        countryCode: selectedCountry,
      });

      goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    countryCode,
    isCountryCodeLoading,
    setIsKeyboardVisible,
    onChangeText,
    search,
    setSearch,
    t,
    goBack,
    dispatch,
    filter,
    selectedCountry,
    setSelectedCountry,
    handleGoBack,
    setCountryCodeFB,
  };
};

export default useCountryCdePicker;
