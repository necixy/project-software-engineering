import {
  databaseRef,
  uploadProfileImages,
} from 'src/utils/useFirebase/useFirebase';

const editClientProfile = async (
  uid: string,
  displayName?: string,
  email?: string,
  phoneNumber?: string,
  profileImg?: string,
) => {
  try {
    const profileImgPath = await uploadProfileImages(
      uid,
      'ProfileImg',
      profileImg ?? '',
    );

    await databaseRef(`users/${uid}`).update({
      displayName,
      photoURL: profileImgPath,
      email,
      phoneNumber,
    });
  } catch (error) {
    console.error(error);
  }
};

export default editClientProfile;
