import {
  databaseRef,
  uploadProfileImages,
} from 'src/utils/useFirebase/useFirebase';

const updateProPersonalInfo = async (
  uid: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  address: string,
  city: string,
  country: string,
  postCode: string,
  termsAccepted: boolean,
) => {
  try {
    // const profileImgPath = await uploadProfileImages(
    //   uid,
    //   'ProfileImg',
    //   profileImg ?? '',
    // );

    //     const personalRef = databaseRef(`users/${uid}/proPersonalInfo`);
    // const newRef = personalRef.push();
    // let postData = {
    // id : newRef?.key,
    // name:"First Post",
    // // createdAt:firebaseTimestamp,
    // ...otherdata
    // }
    let proPersonalInfo = {
      firstName,
      lastName,
      dateOfBirth,
      address,
      city,
      country,
      postCode,
      termsAccepted,
    };
    // await databaseRef(`users/${uid}/proPersonalInfo`).set(proPersonalInfo);
  } catch (error) {
    console.error('personalInfo', error);
  }
};

export default updateProPersonalInfo;
