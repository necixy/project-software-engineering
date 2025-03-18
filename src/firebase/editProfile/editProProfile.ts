import {
  databaseRef,
  uploadProfileImages,
} from 'src/utils/useFirebase/useFirebase';

const editProProfile = async (
  uid: string,
  displayName?: string,
  profession?: string,
  location?: object,
  bio?: string,
  profileImg?: string,
  frontImg?: string,
) => {
  try {
    const profileImgPath = await uploadProfileImages(
      uid,
      'ProfileImg',
      profileImg ?? '',
    );

    const frontImgPath = await uploadProfileImages(
      uid,
      'FrontImg',
      frontImg ?? '',
    );

    await databaseRef(`users/${uid}`).update({
      photoURL: profileImgPath,
      displayName,
      profession,
      location,
      bio,
      frontImage: frontImgPath,
    });
  } catch (error) {
    console.error(error);
  }
};

export default editProProfile;
