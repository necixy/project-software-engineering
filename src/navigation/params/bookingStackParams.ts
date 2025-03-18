import {bookingSackRouteName} from '../constant/bookingStackRouteName';

export type bookingStackParams = {
  [bookingSackRouteName?.TOP_TAB_NAVIGATION]: undefined;
  [bookingSackRouteName?.REQUEST_DETAIL]: {
    headingText?: string;
    badgeText?: string;
    displayButton?: boolean;
    displayComplete?: boolean;
    displayCancel?: boolean;
    details?: TBookingHistory;
    displayBadge?: boolean;
  };
};
