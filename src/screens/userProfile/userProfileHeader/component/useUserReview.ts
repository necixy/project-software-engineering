import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {useAppSelector} from 'src/redux/reducer/reducer';

const useUserReview = (item: any) => {
  // console.log(item, 'hookuse');
  const uid = useAppSelector(state => state.userReducer.userDetails.uid);
  const [clientImage, setClientImage] = useState('');
  const [clientName, setClientName] = useState('');
  const [likes, setLikes] = useState<string[]>([]);
  const [reviewsReplies, setReviewsReplies] = useState<any[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const fetchImage = async () => {
    try {
      await databaseRef(`users/${item.clientId}/photoURL`).once(
        'value',
        snapshot => {
          snapshot.exists() && setClientImage(snapshot.val());
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const fetchClientName = async () => {
    try {
      await databaseRef(`users/${item.clientId}/displayName`).once(
        'value',
        snapshot => {
          snapshot.exists() && setClientName(snapshot.val());
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLikes = async () => {
    try {
      const onValueChange = databaseRef(`reviews/${item?.id}/likes`).on(
        'value',
        snapshot => {
          if (snapshot.val() == null) {
            setLikes([]);
          } else {
            setLikes(Object.keys(snapshot.val()));
          }
        },
      );
      return () => {
        databaseRef(`reviews/${item?.id}/likes`).off('value', onValueChange);
      };
    } catch (error) {
      console.error(error);
    }
  };
  const like = async () => {
    try {
      await databaseRef(`reviews/${item?.id}/likes/${uid}`).set(true);
    } catch (error) {
      console.error(error);
    }
  };
  const unLike = async () => {
    try {
      await databaseRef(`reviews/${item?.id}/likes/${uid}`).remove();
    } catch (error) {
      console.error(error);
    }
  };
  const fetchReviewReplies = async () => {
    try {
      const onValueChange = databaseRef(`reviewsReplies/${item?.id}`).on(
        'value',
        snapshot => {
          if (snapshot.exists()) {
            setReviewsReplies(Object.values(snapshot.val()));
          }
        },
      );
      return () => {
        databaseRef(`reviewsReplies/${item?.id}`).off('value', onValueChange);
      };
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchImage();
    fetchClientName();
    fetchLikes();
    fetchReviewReplies();
  }, []);
  return {
    clientImage,
    clientName,
    like,
    unLike,
    likes,
    uid,
    reviewsReplies,
    showReplies,
    setShowReplies,
  };
};

export default useUserReview;
