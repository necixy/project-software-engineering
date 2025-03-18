//The following code will handle the logic for uploading the images for a post to the firebase storage, and then getting its hosted url and putting it into the place where post is getting updated in the realtime database.
//And will also add the reference to that post in the userData of the user uploading the image.
import {View, Text, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import storage from '@react-native-firebase/storage';
import {databaseRef, uploadImage} from 'src/utils/useFirebase/useFirebase';
import {image} from '../@types/newPostTypes';
import database, {firebase} from '@react-native-firebase/database';
import {useDispatch} from 'react-redux';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {EventRegister} from 'react-native-event-listeners';
interface TNewPostObject {
  userName: string;
  userImage: null;
  media: {uri: string; type: string}[] | undefined;
  likes: never[];
  caption: String;
  comments: never[];
  rating: number;
  id?: string | null;
  createdAt?: object;
  createdBy?: any;
}
const usePost = (selected: PhotoIdentifier[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const {goBack, dispatch} = useNavigation();
  const uid = useAppSelector(state => state.userReducer.userDetails.uid);
  const user = useAppSelector(state => state.userReducer.userDetails);
  var newPostName = uid + 'post' + new Date().getTime();
  const [caption, setCaption] = useState<String>('');
  const [urls, seturls] = useState<{uri: string; type: string}[]>([]);

  const triggerEvent = () => {
    // Emit an event with some data
    EventRegister.emit('uploadPost');
  };

  const handlePost = async () => {
    var urlarr: {uri: string; type: string}[] | undefined = [];
    try {
      setIsLoading(true);
      for (var i = 0; i < selected.length; i++) {
        const image = selected[i]?.node?.image;

        // Check if image exists and is valid before uploading
        if (!image?.uri) {
          throw new Error('Invalid image URI');
        }
        var task: any = await uploadImage(`${uid}`, image, uid, newPostName);
        // console.log({uri: task, type: selected[i]?.node?.type});
        urlarr?.push({uri: task, type: selected?.[i]?.node?.type});
      }
      seturls(urlarr);
      triggerEvent();
    } catch (e) {
      console.error('Error while Posting Image', e);
      Alert.alert("Couldn't upload image");
    }
  };
  const handlePostUpload = async () => {
    let postObject: TNewPostObject = {
      userName: user?.displayName!,
      userImage: null,
      media: urls!,
      likes: [],
      caption: caption,
      comments: [],
      rating: user?.rating, //have to add in user data
    };
    let postName;
    const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
    try {
      const postsRef = databaseRef(`posts`);
      const newPostRef = postsRef.push();
      let postData = {
        id: newPostRef?.key,
        createdAt: firebaseTimestamp,
        createdBy: uid,
        ...postObject,
      };
      newPostRef.set(postData);
      postName = newPostRef?.key!;
    } catch (err: any) {
      console.error(err, 'err');
      for (var i = 0; i < urls.length; i++) {
        await storage().refFromURL(urls[i]?.uri).delete();
      }
      setIsLoading(false);
      err && showModal({message: err, type: 'error'});
    } finally {
      try {
        const updatePostResult = await databaseRef(
          `users/${uid}/posts/${postName}`,
        ).set(firebaseTimestamp);
        goBack();
        dispatch(DrawerActions.closeDrawer());
      } catch (err) {
        await databaseRef(`posts/${newPostName}`).remove();
        for (var i = 0; i < urls.length; i++) {
          await storage().refFromURL(urls?.[i]?.uri).delete();
        }
        console.error(err, 'updateErr', postName);
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    if (urls?.length == selected?.length) {
      handlePostUpload();
    }
  }, [urls]);
  return {
    handlePost,
    urls,
    caption,
    setCaption,
    isLoading,
  };
};

export default usePost;
