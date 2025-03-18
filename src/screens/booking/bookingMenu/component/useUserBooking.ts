import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useUserBooking = (proUId?: string) => {
  const {t} = useTranslation();
  const navigation = useStackNavigation();

  const [fetching, setFetching] = useState(false);
  const [menuData, setMenuData] = useState<menuListType[] | null>([]);

  useEffect(() => {
    setFetching(true);
    let fetchedData: menuListType[] | null;
    try {
      databaseRef(`menu/${proUId}`).on('value', snapshot => {
        if (snapshot.exists()) {
          let getUserMenu = snapshot.val();
          // if (!!getUserMenu) {
          fetchedData = !!getUserMenu ? Object.values(getUserMenu) : null;
          // } else {
          //   setMenuData(null);
          // }
          setMenuData(fetchedData);
        }
      });
      setFetching(false);
    } catch (err) {
      setFetching(false);
      console.error({err});
    }
    return () => databaseRef(`menu/${proUId}`).off('value');
  }, []);
  return {t, navigation, fetching, menuData};
};

export default useUserBooking;
