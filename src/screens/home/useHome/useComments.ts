import {View, Text} from 'react-native';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useTimeCalculation from 'src/utils/useTimeCalculation/useTimeCalculation';
import {useAppSelector} from 'src/redux/reducer/reducer';

const useComments = (
  item: {
    id: string | null;
    comment: string;
    createdAt: number;
    uid: string;
    numberOfReplies: number;
    likes: number;
  },
  replyTo: {
    profileName: string;
    repliedUser: string;
    commentId: string;
  } | null,
  setReplyTo: Dispatch<
    SetStateAction<{
      profileName: string;
      repliedUser: string;
      commentId: string;
    } | null>
  >,
  feedPostString: string,
) => {
  const [profileImage, setProfileImage] = useState('');
  const [profileName, setProfileName] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showReply, setShowReply] = useState(false);
  const uid = useAppSelector(state => state.userReducer.userDetails?.uid);
  const likeArray = item?.likes ? Object.keys(item?.likes) : [];
  const timeString = useTimeCalculation({time: item.createdAt, short: true});
  const like = async () => {
    try {
      await databaseRef(
        `comments/${feedPostString}/${item.id}/likes/${uid}`,
      ).set(true);
    } catch (error) {
      console.error(error);
    }
  };
  const unLike = async () => {
    try {
      await databaseRef(
        `comments/${feedPostString}/${item.id}/likes/${uid}`,
      ).remove();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchCommentUserData = async () => {
      try {
        await databaseRef(`users/${item.uid}/photoURL`).once(
          'value',
          snapshot => {
            snapshot.exists() && setProfileImage(snapshot.val());
          },
        );
        await databaseRef(`users/${item.uid}/displayName`).once(
          'value',
          snapshot => {
            snapshot.exists() && setProfileName(snapshot.val());
          },
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchCommentUserData();
  }, []);
  useEffect(() => {
    const fetchCommentReplies = async () => {
      try {
        const onValueChange = await databaseRef(
          `commentsReplies/${item.id}`,
        ).on('value', snapshot => {
          snapshot.exists() && setReplies(Object.values(snapshot.val()));
        });
        return () => {
          databaseRef(`commentsReplies/${item.id}`).off('value', onValueChange);
        };
      } catch (e) {
        console.error(e);
      }
    };
    if (item.numberOfReplies > 0) {
      fetchCommentReplies();
    }
  }, [showReply]);
  return {
    profileImage,
    profileName,
    isLiked,
    setIsLiked,
    replies,
    showReply,
    setShowReply,
    timeString,
    like,
    likeArray,
    uid,
    unLike,
  };
};

export default useComments;
