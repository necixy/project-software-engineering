// eslint-disable-next-line import/namespace

import {screenStackName} from '../constant/screenStackName';

export type screenStackParams = {
  // USER CLIENT SCREENS
  [screenStackName.EDIT_CLIENT_PROFILE]: undefined;
  [screenStackName.USER_SETTINGS]: undefined;
  [screenStackName.SWITCH_PRO]: undefined;
  [screenStackName.REQUEST_DETAILS]: {
    headingText?: string;
    displayCancel?: boolean;
    displayBadge?: boolean;
    displayComplete?: boolean;
    badgeText?: string;
    displayButton?: boolean;
    details?: TBookingDetails;
  };
  [screenStackName.SETTING]: undefined;
  [screenStackName.CLIENT_NOTIFICATIONS]: undefined;
  [screenStackName.VIEW_POST]: undefined;
  [screenStackName.USER_BOOKING_MENU]: {
    name: string;
    profile: string;
    uid: string;
  };
  [screenStackName.BOOK_AVAILABILITY]: {
    item: any;
    name: string;
    profile: string;
    uid: string;
    fcmTokens?: any;
    menuId: any;
  };
  [screenStackName.BOOKING_CHECKOUT]: {item: any};
  [screenStackName.PDF_VIEWER]: undefined;
  [screenStackName.COUNTRY_PICKER]: undefined;

  // USER PRO SCREENS
  [screenStackName.EDIT_PRO_PROFILE]: undefined;
  [screenStackName.USER_PRO_SETTING]: undefined;
  [screenStackName.MISSION_DETAILS]: undefined;
  [screenStackName.USER_MANAGEMENT_PRO]: undefined;
  [screenStackName.ARCHIVES]: undefined;
  [screenStackName.DASHBOARD]: undefined;
  [screenStackName.MANAGE_AVAILABILITY]: undefined;
  [screenStackName.MANAGE_MENU]: undefined;
  [screenStackName.FOLLOWING]: undefined;
  [screenStackName.PERSONAL_PRO]: undefined;
  [screenStackName.PRO_TERMS]: undefined;
  [screenStackName.PRO_PHONE_NUMBER]: undefined;
  [screenStackName.PRO_VERIFY_CODE]: undefined;
  [screenStackName.Chat]: {
    name?: string;
    profile?: string;
    channelId?: string;
    uid?: string;
  };
  [screenStackName.EDIT_PRO_LOCATION]: undefined;
  [screenStackName.VIEW_PRO_MAP]: undefined;
  [screenStackName.VIEW_MAP]: undefined;
  [screenStackName.EDIT_PROFESSION]: undefined;
  [screenStackName.WEB_VIEW]: undefined;
  [screenStackName.BOOKING_HISTORY]: {headerName: string};
  [screenStackName.MISSION_HISTORY]: {headerName: string};
  [screenStackName.BOOKING_RATINGS]: {
    imageUrl: string;
    proId: string;
    orderId: string;
  };
  [screenStackName.ABOUT_VITA]: undefined;
  [screenStackName.HELP_SUPPORT]: undefined;
};
