import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { screenStackName } from 'src/navigation/constant/screenStackName';
import { useAppSelector } from 'src/redux/reducer/reducer';
import { databaseRef } from 'src/utils/useFirebase/useFirebase';
import database from '@react-native-firebase/database';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useSwitchPro = () => {
  const navigation = useStackNavigation();
  const [prevData, setPrevData] = useState<any>({});
  const uid: string = useAppSelector(
    state => state?.userReducer?.userDetails?.uid,
  );

  const getFirebaseData = async () => {
    try {
      let data = {};
      console.log(1)
      await databaseRef(`users/${uid}/proPersonalInfo`).once(
        'value',
        snapshot => {
          data = snapshot.val();
        },
      ).then(() => {
        database().ref(`CountryCode`).orderByChild('code').equalTo(data.address.country).once("value", snapshot => {
          data.countryCode = snapshot.val().dial_code;
          data && setPrevData(data);
          console.log(data, 'tttttdata')
        })
      });
    } catch (error) { }
  };
  useEffect(() => {
    getFirebaseData();
  }, []);
  // Switch to pro account
  const handleSwitch = () => {
    navigation?.navigate(screenStackName.PERSONAL_PRO, { prevData });
    //
  };
  return { handleSwitch, navigation };
};

export default useSwitchPro;
