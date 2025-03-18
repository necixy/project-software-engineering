// This code is the function to be used as custom hook for home screen components.
import React, {useEffect, useState} from 'react';
import useTimeCalculation from 'src/utils/useTimeCalculation/useTimeCalculation';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {useTranslation} from 'react-i18next';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {firebase} from '@react-native-firebase/database';

interface TComments {
  comment: string;
  createdAt: number;
  id: string;
  uid: string;
}
const useFeedComponent = ({feedPostString}: {feedPostString: string}) => {
  const [feedPostObject, setFeedPostObject] = useState<TFeedPostObject>({
    userName: '',
    userImage: '',
    media: [],
    caption: '',
    numberOfComments: [],
    createdAt: 0,
    rating: 0,
    id: '',
    createdBy: '',
  });
  const [replyTo, setReplyTo] = useState<{
    profileName: string;
    repliedUser: string;
    commentId: string;
  } | null>(null);
  const [modalLoading, setModalLoading] = useState(true);
  const [userComment, setUserComment] = useState('');
  const [comments, setComments] = useState<TComments[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentsNumber, setCommentsNumber] = useState(0);
  const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid);
  const [isLiked, setIsLiked] = React.useState(false);
  const [creatorRating, setCreatorRating] = useState(0);
  const profile = useAppSelector(
    state => state.userReducer.userDetails?.photoURL,
  );
  const timeString = useTimeCalculation({time: feedPostObject?.createdAt});
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const {t} = useTranslation();
  const [likeData, setLikedata] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        await databaseRef(`posts/${feedPostString}/likes`).on(
          'value',
          snapshot => {
            if (snapshot.exists()) {
              setLikedata(snapshot.val());
              if (snapshot.val()[uid]) {
                setIsLiked(true);
              }
            } else {
              setLikedata(0);
            }
          },
        );
      } catch (error) {
        console.error(error);
      }
    };
    const fetchComments = async () => {
      try {
        await databaseRef(`posts/${feedPostString}/numberOfComments`).on(
          'value',
          snapshot => {
            if (snapshot.exists()) {
              setCommentCount(snapshot.val());
            } else {
              setCommentCount(0);
            }
          },
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikes();
    fetchComments();
    return () => {
      databaseRef(`posts/${feedPostString}/likes`).off;
      databaseRef(`posts/${feedPostString}/numberOfComments`).off;
    };
  }, []);
  // useEffect(() => {
  //   //the code below will fetch the post having the reference ID of 'feedPostString' and set it to feedPostObject to render the feedPostCompontent.
  //   const getPostObject = async () => {
  //     try {
  //       const onValueChange = await databaseRef(`posts/${feedPostString}`).on(
  //         'value',
  //         snapshot => {
  //           setFeedPostObject(snapshot.val());
  //           setIsLiked(
  //             snapshot.val()?.likes
  //               ? snapshot.val()?.likes?.hasOwnProperty(uid)
  //               : false,
  //           );
  //         },
  //       );
  //       return () => {
  //         databaseRef(`posts/${feedPostString}`).off('value', onValueChange);
  //       };
  //     } catch (error) {
  //       console.error('Error in getting post object', error);
  //     }
  //   };
  //   if (feedPostString) {
  //     getPostObject();
  //   }
  // }, []);
  // useEffect(() => {
  //   const getImageFromFirebase = async () => {
  //     try {
  //       const onValueChange = await databaseRef(
  //         `users/${feedPostObject?.createdBy}/photoURL`,
  //       ).on('value', snapshot => {
  //         setProImage(snapshot.val());
  //       });
  //       return () =>
  //         databaseRef(`users/${feedPostObject?.createdBy}/photoURL`).off(
  //           'value',
  //           onValueChange,
  //         );
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   feedPostObject && getImageFromFirebase();
  //   feedPostObject &&
  //     setIsLiked(
  //       feedPostObject?.likes
  //         ? feedPostObject?.likes?.hasOwnProperty(uid)
  //         : false,
  //     );
  // }, [feedPostObject]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setModalLoading(true);
        databaseRef(`comments/${feedPostString}`).on('value', snapshot => {
          if (snapshot.exists()) {
            let commentsList: TComments[] | null =
              Object.values(snapshot.val()) ?? null;
            // Sort the data by createdAt
            const sortedData: TComments[] | null = commentsList.sort(
              (a: any, b: any) => b.createdAt - a.createdAt,
            );

            setComments(sortedData);
          }
        });
        return () => {
          databaseRef(`comments/${feedPostString}`).off('value');
        };
      } catch (error) {
        console.error('Error in Fetching', error);
      } finally {
        setTimeout(() => {
          setModalLoading(false);
        }, 2000);
      }
    };
    if (modalOpen) {
      fetchComments();
    }
  }, [modalOpen]);
  useEffect(() => {
    const fetchRating = async () => {
      try {
        databaseRef(`users/${feedPostObject?.createdBy}/rating`).on(
          'value',
          snapshot => {
            if (snapshot.exists()) setCreatorRating(snapshot.val());
          },
        );
      } catch (error) {
        console.error('Error in Fetching', error);
      }
    };
    const fetchCommentsNumber = async () => {
      try {
        databaseRef(`posts/${feedPostObject.id}/numberOfComments`).on(
          'value',
          snapshot => {
            if (snapshot.exists()) setCommentsNumber(snapshot.val());
          },
        );
      } catch (error) {
        console.error('Error in Fetching', error);
      }
    };
    fetchRating();
    // fetchName();
    fetchCommentsNumber();

    return () => {
      databaseRef(`users/${feedPostObject?.createdBy}/rating`).off('value');
      databaseRef(`posts/${feedPostObject.id}/numberOfComments`).off('value');
    };
  }, [feedPostObject]);
  const submit = async () => {
    setCommentLoading(true);
    if (userComment.length != 0) {
      try {
        if (replyTo == null) {
          const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
          const commentsRef = databaseRef(`comments/${feedPostString}`);
          const newCommentRef = commentsRef.push();
          let commentData = {
            id: newCommentRef?.key,
            comment: userComment,
            createdAt: firebaseTimestamp,
            uid,
          };
          await newCommentRef.update(commentData);
          await databaseRef(
            `posts/${feedPostString}/numberOfComments`,
          ).transaction(currentNumComments => currentNumComments + 1);
          setUserComment('');
          setCommentLoading(false);
        } else {
          const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
          const repliesRef = databaseRef(
            `commentsReplies/${replyTo.commentId}`,
          );
          const newReplyRef = repliesRef.push();
          let replyData = {
            id: newReplyRef?.key,
            comment: userComment,
            createdAt: firebaseTimestamp,
            uid,
            ...replyTo,
          };
          await newReplyRef.update(replyData);
          await databaseRef(
            `comments/${feedPostString}/${replyTo.commentId}/numberOfReplies`,
          ).transaction(currentNumReplies => currentNumReplies + 1);
          setUserComment('');
          setReplyTo(null);
          setCommentLoading(false);
        }
      } catch (error) {
        console.error(error);
        setCommentLoading(false);
      }
    }
  };
  return {
    isLiked,
    setIsLiked,
    timeString,
    currentPage,
    setCurrentPage,
    uid,
    t,
    feedPostObject,
    modalOpen,
    setModalOpen,
    profile,
    modalLoading,
    userComment,
    setUserComment,
    submit,
    comments,
    replyTo,
    setReplyTo,
    likeObj: feedPostObject?.likes,
    creatorRating,
    commentsNumber,
    likeData,
    commentCount,
    commentLoading,
  };
};
export default useFeedComponent;
