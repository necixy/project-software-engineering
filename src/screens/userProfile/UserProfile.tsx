import React from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import UserClientProfile from './userClientProfile/UserClientProfile';
import UserProProfile from './userProProfile/UserProProfile';

const UserProfile = ({route}: any) => {
  const userDetails = useAppSelector(state => state?.userReducer?.userDetails);
  return userDetails?.isPro ? (
    <UserProProfile tab={route?.params?.tab} />
  ) : (
    <UserClientProfile />
  );
};

export default UserProfile;
