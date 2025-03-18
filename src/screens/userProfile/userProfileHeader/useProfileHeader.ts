import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const useProfileHeader = () => {
  const {t} = useTranslation();
  const {navigate, goBack} = useNavigation();
  // const {userType} = useAppSelector(state => state?.userReducer);
  const userDetails = useAppSelector(state => state?.userReducer?.userDetails);
  const likeCountReducer = useAppSelector(state => state?.likeCountReducer);
  const {likedBy, likes} = likeCountReducer ?? {};
  const [followersCount, setFollowersCount] = useState(0);
  const isScreenFocused = useIsFocused();
  useEffect(() => {}, [likedBy, likes]);
  const lang = useAppSelector;

  useEffect(() => {
    databaseRef(
      `${userDetails?.isPro ? 'followers' : 'following'}/${
        userDetails?.uid
      }/count`,
    ).on('value', snapshot => {
      setFollowersCount(snapshot.val() ?? 0);
    });
    return () => {
      databaseRef(
        `${userDetails?.isPro ? 'followers' : 'following'}/${
          userDetails?.uid
        }/count`,
      ).off('value');
    };
  }, [userDetails?.uid, isScreenFocused]);

  //  useMemo(
  //   () =>
  const profileAds =
    userDetails?.isPro === true
      ? [
          {
            label: t('common:stars'),
            id: 'Stars',
            value: userDetails?.rating ?? '-',
          },
          {
            label: t('common:followers'),
            id: 'Followers',
            value: followersCount || '0',
          },
          {label: t('common:likes'), id: 'Likes', value: likes},
        ]
      : [
          {
            label: t('common:following'),
            id: 'Following',
            value: followersCount || '0',
          },
          {label: t('common:likes'), id: 'Likes', value: likedBy},
        ];
  //   [userDetails, followersCount, likes, userDetails?.language],
  // );

  return {
    navigate,
    userDetails,
    profileAds,
    t,
    goBack,
    followersCount,
    likedBy,
    likes,
  };
};

export default useProfileHeader;
