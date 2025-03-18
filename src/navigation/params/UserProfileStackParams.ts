import {userProfileStackName} from '../constant/userProfileStackName';

export type userProfileStackParams = {
  [userProfileStackName?.USER_PROFILE]: {tab?: 'A' | 'B'};
  [userProfileStackName?.FOLLOWERS]: undefined;
  [userProfileStackName?.FOLLOWING]: undefined;
  [userProfileStackName?.VIEW_POST]: undefined;
};
