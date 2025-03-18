import {rootStackName} from '../constant/rootStackName';
import {NavigatorScreenParams} from '@react-navigation/native';
import {screenStackParams} from './screenStackParams';

export type rootStackParams = {
  [rootStackName?.AUTH]: undefined;
  [rootStackName?.BOTTOM_TABS]: undefined;
  [rootStackName?.HOME_DRAWER]: undefined;
  [rootStackName?.SHARE_POST]: undefined;
  [rootStackName.SCREEN_STACK]: undefined;
  [rootStackName.USER_PROFILE_STACK]: undefined;
  [rootStackName?.SEARCH_STACK]: undefined;
  [rootStackName?.BOOKING]: undefined;
  [rootStackName?.TOP_TABS]: undefined;

  // [rootStackName.AUTH]: undefined;
  // [rootStackName.DRAWER]: undefined;
  // [rootStackName.DRIVING_SCHOOL]: { id?: number };
  // [rootStackName.PROFILE]: undefined;
  // [rootStackName.SCREEN_STACK]: NavigatorScreenParams<screenStackParams>;
};
