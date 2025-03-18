import {useState} from 'react';
import {databaseRef} from './useFirebase/useFirebase';
import {useAppSelector} from 'src/redux/reducer/reducer';

const useGetMenuData = async () => {
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);
  const [fetching, setFetching] = useState(false);
  const [menuData, setMenuData] = useState<menuListType[]>([]);
  setFetching(true);
  try {
    await databaseRef(`menu/${uid}`).once('value', snapshot => {
      let getUserMenu = snapshot.val();
      let fetchedData = !!getUserMenu ? Object.values(getUserMenu) : null;
      setMenuData(fetchedData);
      setFetching(false);
    });
  } catch (err) {
    setFetching(false);
    console.error({err});
  }
  return;
};

export default useGetMenuData;
