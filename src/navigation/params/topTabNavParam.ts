import {topTabNavRouteName} from '../constant/topTabNavRouteName';

export type topTabNavParam = {
  [topTabNavRouteName.MISSIONS]: undefined;
  [topTabNavRouteName.REQUESTS]: {bookingId?: string};
  [topTabNavRouteName.ON_HOLD]: {headingText: string; displayCancel: boolean};
  [topTabNavRouteName.ACCEPTED]: {bookingId: string};
};
