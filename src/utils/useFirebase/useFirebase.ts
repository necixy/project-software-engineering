import store from 'src/redux/store';
import database, {firebase} from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const databaseRef = (address: string) => {
  let reduxStore: any = store.getState();
  let serverType: serverType = reduxStore?.serverReducer?.baseUrl?.serverType;
  return database().ref(`/${serverType}/${address}`);

  // return firebase
  //   .app()
  //   .database(
  //     'https://test-5fa89-default-rtdb.asia-southeast1.firebasedatabase.app/',
  //   )
  //   .ref(`/${serverType}/${address}`);

  // if (serverType === 'Staging') {
  //   return database().ref(`/Staging/${address}`);
  // } else {
  //   return database().ref(`/Production/${address}`);
  // }
};

const writeUserData = ({
  path,
  multipleDataObj,
}: {
  path: any;
  multipleDataObj?: any;
}) => databaseRef(path ?? 'users/').set(multipleDataObj);

const readUserData = ({path, onSuccess, onError, onSettled}: any) =>
  databaseRef(path ?? 'users/').once('value', function (snapshot) {
    onSuccess(snapshot);
  });

const uploadImage = async (
  path: any,
  image: any,
  uid: any,
  newPostName: any,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const time = new Date();
      const response = await storage()
        .ref(`${path}/posts/${newPostName}/${uid + '-' + time?.getTime()}.jpg`)
        .putFile(image.uri);
      const meta = await storage()
        .ref(`${path}/posts/${newPostName}/${uid + '-' + time?.getTime()}.jpg`)
        .getDownloadURL();
      resolve(meta);
    } catch (err) {
      console.error(err, 'storage err');
      reject(err);
      // try {
      //     const time = new Date;
      //     const response = await storage().ref(`${path}/${uid}/${newPostName}/${uid + '-' + time.getTime()}.jpg`).putFile(image.uri)
      //     const meta = await storage().ref(`${path}/${uid}/${newPostName}/${uid + '-' + time.getTime()}.jpg`).getDownloadURL()
      //     return meta;
    }
  });
};

// Uploading profile & front image in storage & returning its path in database
const uploadProfileImages = async (
  uid: string,
  imgType: string,
  imgPath: string,
) => {
  try {
    if (imgPath) {
      await storage().ref(`${uid}/profile/${imgType}.jpg`).putFile(imgPath);

      const imgLocation = await storage()
        .ref(`${uid}/profile/${imgType}.jpg`)
        .getDownloadURL();

      return imgLocation;
    }
  } catch (err) {
    console.error(err);
  }
};

const updateSingleData = ({path, data}: {path?: any; data?: any}) =>
  databaseRef(path ?? 'users/').update(data);

const deleteData = ({path}: {path?: any}) =>
  databaseRef(path ?? 'users/').remove();
export {
  databaseRef,
  writeUserData,
  readUserData,
  deleteData,
  updateSingleData,
  uploadImage,
  uploadProfileImages,
};
