import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {firebase} from '@react-native-firebase/database';

const useFetchReviews = (uid: string) => {
  const [replyTo, setReplyTo] = useState<{
    profileName: string;
    reviewId: string;
    uid: string;
  }>({profileName: '', reviewId: '', uid: ''});
  const [reviewReply, setReviewRelpy] = useState<string>('');
  const [reviews, setReviews] = useState<any[]>([]);
  const fetchReviews = async () => {
    try {
      await databaseRef(`reviews`)
        .orderByChild('proId')
        .equalTo(uid)
        .once('value', snapshot => {
          snapshot.exists() && setReviews(Object.values(snapshot.val()));
          // console.log(Object.values(snapshot.val()), `review`);
        });
    } catch (err) {
      console.error(err);
    }
  };
  const submit = async () => {
    if (reviewReply.length != 0) {
      try {
        const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
        let reviewReplyObject = {
          reviewReply: reviewReply,
          uploadTime: firebaseTimestamp,
        };
        const reviewReplyRef = databaseRef(
          `reviewsReplies/${replyTo.reviewId}`,
        );
        const newReviewReplyRef = reviewReplyRef.push();
        let reviewReplyData = {
          id: newReviewReplyRef?.key,
          ...reviewReplyObject,
        };
        await newReviewReplyRef.set(reviewReplyData);
        await databaseRef(
          `reviews/${replyTo.reviewId}/numberOfReviewsReplies`,
        ).transaction(number => number + 1);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);
  return {
    reviews,
    replyTo,
    setReplyTo,
    reviewReply,
    setReviewRelpy,
    submit,
  };
};

export default useFetchReviews;
