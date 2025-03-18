import auth, {FirebaseAuthTypes, firebase} from '@react-native-firebase/auth';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from './useFirebase/useFirebase';
import {updateDetails} from 'src/redux/reducer/userReducer';
import {updateLikedBy, updateLikes} from 'src/redux/reducer/likeCountReducer';
const useGetUserData = () => {
  const dispatch = useAppDispatch();
  const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid);
  const userDetails = useAppSelector(state => state?.userReducer?.userDetails);

  // Additional logic to handle user logout
  useEffect(() => {
    let authStateChange = firebase
      .auth()
      .onAuthStateChanged(user => handleUserAuthStateChange(user));

    return () => {
      authStateChange();
      databaseRef(`users/${uid}`).off('value');
    };
  }, [uid]);
  useEffect(() => {
    const getLikeCount = async () => {
      try {
        await databaseRef(`likes/${uid}`).on('value', snapshot => {
          if (snapshot.exists()) {
            let data = Object.values(snapshot.val()).flat();
            const getCounts = (objects: any) => {
              const keysArray: any = [];

              objects.forEach(obj => {
                keysArray.push(...Object.keys(obj));
              });
              return keysArray.length;
            };

            const count = getCounts(data);
            dispatch(updateLikes(count));
          } else {
            dispatch(updateLikes(0));
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    const getLikedByCount = async () => {
      try {
        await databaseRef(`likedBy/${uid}`).on('value', snapshot => {
          if (snapshot.exists()) {
            let count = Object.keys(snapshot.val()).flat().length;
            dispatch(updateLikedBy(count));
          } else {
            dispatch(updateLikedBy(0));
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    getLikeCount();
    getLikedByCount();

    return () => {
      databaseRef(`likes/${uid}`).off('value');
      databaseRef(`likedBy/${uid}`).off('value');
    };
  }, []);
  //   change when user auth change
  const handleUserAuthStateChange = async (
    user: FirebaseAuthTypes.User | null,
  ) => {
    if (!user) {
      handleSessionExpired();
      databaseRef(`users/${uid}`).off('value');
    } else {
      try {
        databaseRef(`users/${user?.uid}`).on('value', snapshot => {
          let response = snapshot?.val();
          if (response) {
            //   // DO NOT REMOVE THIS COMMENT! IT NEEDS TO BE RESOLVED.
            //   handleSessionExpired();
            // } else {
            let userData = response;

            userData.posts = response?.posts && Object.keys(response?.posts);
            response?.emailVerified && dispatch(updateDetails(userData));
            userData?.followers === undefined &&
              dispatch(updateDetails({followers: {}}));
            userData?.following === undefined &&
              dispatch(updateDetails({following: {}}));
          }
        });
        // return () => {
        //   databaseRef(`users/${user?.uid}`).off('value');
        // };
      } catch (error) {
        console.error('Error in handleUserAuthStateChange:', error);
      }
    }
  };

  const handleSessionExpired = () => {
    console.log({uid});
    // showModal({
    //   message: 'Your session is expired. Please login again!',
    // });
    dispatch({type: 'LOGOUT'});
  };
  return {};
};

export default useGetUserData;
