import {firebase} from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import React, {Dispatch, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {EventRegister} from 'react-native-event-listeners';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const useDeleteModal = ({
  screen,
  navigation,
  currentUser,
  postId,
  createdBy,
  setDeleteModalVisible,
  media,
}: {
  navigation: any;
  screen: 'home' | 'viewPost';
  currentUser: String;
  postId: String;
  createdBy: String;
  setDeleteModalVisible: Dispatch<React.SetStateAction<boolean>>;
  media: {type: string; uri: string}[];
}) => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportPressed, setReportPressed] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [reportModal, setReportModal] = useState<boolean>(false);
  const [reportSuccessModal, setReportSuccessModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState('');
  const triggerEvent = () => {
    EventRegister.emit('deleteOrReportPost', {postId});
  };
  const deletePost = async () => {
    setIsLoading(true);
    try {
      await databaseRef(`posts/${postId}`).remove();
      await databaseRef(`users/${createdBy}/posts/${postId}`).remove();
      for (var i = 0; i < media.length; i++) {
        await storage().refFromURL(media[i].uri).delete();
      }
      setDeleteModal(false);
      setReportSuccessModal(true);

      triggerEvent();
      screen == 'viewPost' && navigation.goBack();
    } catch (error) {
      setDeleteModal(false);
      // showModal({message: error});
      console.log(JSON.stringify(error, null, 2));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const reportPost = async () => {
    setIsLoading(true);
    const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
    try {
      await databaseRef(`posts/${postId}/reportedBy/${currentUser}`).set(true);
      await databaseRef(`postReports/${postId}/${currentUser}`).update({
        reportReason,
        createdAt: firebaseTimestamp,
      });

      setReportModal(false);
      setReportSuccessModal(true);

      triggerEvent();
      screen == 'viewPost' && navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      // setDeleteModalVisible(false);
    }
  };
  return {
    deletePost,
    reportPost,
    isLoading,
    reportPressed,
    setReportPressed,
    reportReason,
    setReportReason,
    deleteModal,
    setDeleteModal,
    reportModal,
    setReportModal,
    reportSuccessModal,
    setReportSuccessModal,
  };
};

export default useDeleteModal;
