import {View, Text, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {firebase} from '@react-native-firebase/database';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {EventRegister} from 'react-native-event-listeners';

const useBookingRatings = (useRatingProps: TBookingRatingsProps) => {
  const {t} = useTranslation();
  const {goBack, pop} = useStackNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previousRating, setPreviousRating] = useState<number>(0);
  const [ratingArray, setRatingArray] = useState<number[]>([]);
  const uid = useAppSelector(state => state.userReducer.userDetails.uid);
  const [rating, setRating] = useState<number>(1);
  const [review, setReview] = useState<string>('');
  const [originalReview, setOriginalReview] = useState<TRatingData>({
    review: undefined,
    clientId: undefined,
    clientPro: undefined,
    proId: undefined,
    rating: undefined,
    uploadTime: undefined,
    orderId: undefined,
    id: undefined,
  });

  const fetchRatingArray = async () => {
    try {
      await databaseRef(`users/${useRatingProps?.proId}/ratingArray`).once(
        'value',
        snapshot => {
          if (snapshot.exists()) {
            setRatingArray(Object.values(snapshot.val()));
          } else {
            setRatingArray([]);
          }
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const fetchOriginalReview = async () => {
    try {
      // await databaseRef(`reviews`).orderByChild('clientPro').startAt(uid).endAt(useRatingProps.proId).once('value',snapshot=>{
      await databaseRef(`reviews`)
        .orderByChild('orderId')
        .equalTo(`${useRatingProps?.orderId}`)
        // .orderByChild('clientPro')
        // .equalTo(`${uid}_${useRatingProps.proId}`)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            setOriginalReview(Object.values(snapshot.val())[0]);
            setReview(Object.values(snapshot.val())[0].review);
            setRating(Object.values(snapshot.val())[0].rating);
            setPreviousRating(Object.values(snapshot.val())[0].rating);
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const ratingUpload = async () => {
    const average = (array: number[]) =>
      array.reduce((sum, num) => sum + num, 0) / array.length;
    try {
      const newRatingArray = [...ratingArray, rating];
      await databaseRef(`users/${useRatingProps?.proId}/rating`).set(
        average(newRatingArray),
      );
      await databaseRef(`users/${useRatingProps?.proId}/ratingArray`).push(
        rating,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const ratingUpdate = async () => {
    const filteredArray = (arr: number[], numToRemove: number) => {
      const index = arr.indexOf(numToRemove);
      if (index !== -1) {
        const newArr = [...arr];
        newArr.splice(index, 1);
        return newArr;
      }
      return arr;
    };

    try {
      const newRatingArray = filteredArray(ratingArray, previousRating);
      newRatingArray.push(rating);
      const average = (array: number[]) =>
        array.reduce((sum, num) => sum + num, 0) / array.length;
      let itemToRemove = null;
      await databaseRef(`users/${useRatingProps.proId}/ratingArray`)
        .orderByValue()
        .equalTo(previousRating)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            itemToRemove = Object.keys(snapshot.val())[0];
          }
        });

      itemToRemove &&
        (await databaseRef(
          `users/${useRatingProps.proId}/ratingArray/${itemToRemove}`,
        ).remove());
      await databaseRef(`users/${useRatingProps.proId}/rating`).set(
        average(newRatingArray),
      );
      await databaseRef(`users/${useRatingProps.proId}/ratingArray`).push(
        rating,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const triggerEvent = () => {
    // Emit an event with some data
    EventRegister.emit('reviewPro');
  };

  const uploadReview = async () => {
    if (originalReview.rating == undefined) {
      try {
        const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
        let reviewObject = {
          review: review,
          clientId: uid,
          clientPro: `${uid}_${useRatingProps.proId}`,
          proId: useRatingProps.proId,
          rating: rating,
          uploadTime: firebaseTimestamp,
          orderId: useRatingProps?.orderId,
        };
        // let reviewObject = {"review":review,"clientId":uid,"clientPro":`${uid}_${useRatingProps.proId}`,"proId":useRatingProps.proId,rating,uploadTime:firebaseTimestamp}
        const reviewRef = databaseRef(`reviews`);
        const newReviewRef = reviewRef.push();
        let reviewData = {
          id: newReviewRef?.key,
          ...reviewObject,
        };
        newReviewRef.set(reviewData);
        ratingUpload();

        showModal({
          message: t('customWords:updatedSuccessfully'),
          type: 'success',
        });
      } catch (error) {
        console.error(error);
      } finally {
        setReview('');
        setRating(1);
        triggerEvent();
        useRatingProps?.screenName == 'RequestDetail' ? pop(2) : goBack();
      }
    } else {
      try {
        const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
        let reviewObject = {
          review: review,
          clientId: uid,
          clientPro: `${uid}_${useRatingProps.proId}`,
          proId: useRatingProps.proId,
          rating: rating,
          uploadTime: firebaseTimestamp,
          orderId: useRatingProps?.orderId,
        };
        // let reviewObject = {"review":review,"clientId":uid,"clientPro":`${uid}_${useRatingProps.proId}`,"proId":useRatingProps.proId,rating,uploadTime:firebaseTimestamp}
        const reviewRef = databaseRef(`reviews/${originalReview.id}`);
        let reviewData = {
          id: originalReview.id,
          ...reviewObject,
        };
        reviewRef.update(reviewData);
        ratingUpdate();
      } catch (error) {
        console.error(error);
      } finally {
        setReview('');
        setRating(1);
        triggerEvent();
        useRatingProps?.screenName == 'RequestDetail' ? pop(2) : goBack();
      }
    }
  };
  useEffect(() => {
    fetchRatingArray();
    fetchOriginalReview();
  }, []);
  return {
    t,
    setReview,
    setRating,
    uploadReview,
    rating,
    ratingArray,
    review,
    isLoading,
  };
};

export default useBookingRatings;
