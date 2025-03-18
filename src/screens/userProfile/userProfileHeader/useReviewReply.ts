import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {useAppSelector} from 'src/redux/reducer/reducer';

const useReviewReply = (
  replyData: {
    id: string;
    reviewReply: string;
    uploadTime: string;
    reviewId: string;
  },
  proId: string,
) => {
  const uid = useAppSelector(state => state.userReducer.userDetails.uid);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [likes, setLikes] = useState<string[]>([]);
  const fetchImage = async () => {
    try {
      await databaseRef(`users/${proId}/photoURL`).once('value', snapshot => {
        snapshot.exists() && setImage(snapshot.val());
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchClientName = async () => {
    try {
      await databaseRef(`users/${proId}/displayName`).once(
        'value',
        snapshot => {
          snapshot.exists() && setName(snapshot.val());
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLikes = async () => {
    try {
      const onValueChange = await databaseRef(
        `reviewsReplies/${replyData?.reviewId}/${replyData?.id}/likes`,
      ).on('value', snapshot => {
        if (snapshot.val() == null) {
          setLikes([]);
        } else {
          setLikes(Object.keys(snapshot.val()));
        }
      });
      return () => {
        databaseRef(
          `reviewsReplies/${replyData?.reviewId}/${replyData?.id}/likes`,
        ).off('value', onValueChange);
      };
    } catch (error) {
      console.error(error);
    }
  };
  const like = async () => {
    try {
      await databaseRef(
        `reviewsReplies/${replyData.reviewId}/${replyData?.id}/likes/${uid}`,
      ).set(true);
    } catch (error) {
      console.error(error);
    }
  };
  const unLike = async () => {
    try {
      await databaseRef(
        `reviewsReplies/${replyData?.reviewId}/${replyData?.id}/likes/${uid}`,
      ).remove();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchClientName();
    fetchLikes();
    fetchImage();
    fetchLikes();
  }, []);
  return {
    image,
    name,
    likes,
    uid,
    like,
    unLike,
  };
};

export default useReviewReply;
