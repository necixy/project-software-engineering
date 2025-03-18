interface bookingDetailsProps {
  item?: any;
  name?: string;
  profile?: string;
  uid: string;
  time?: string | any;
  date?: string;
  fcmTokens?: any;
  menuId: any;
  rating?: string;
  default_currency?: string;
}

interface TBookingDetails {
  clientUserUId?: string;
  clientUserUId_status?: string;
  createdAt?: string;
  id?: string;
  note?: string;
  orderAddress?: orderAdd;
  orderDate?: {
    date?: string;
    time?: string;
  };
  orderDetails?: orderDetails;
  proUserId?: string;
  proUserUId?: string;
  proUserId_status?: string;
  proUserUId_status?: string;
  status?: 'requested' | 'accepted' | 'completed' | 'canceled';
}

interface TBookingHistory extends TBookingDetails {
  otherUserName: string;
  otherUserProfileImg: string;
  otherUserUId: string;
  orderDetails?: orderDetails;
  createdAt?: string;
  id?: string;
  note?: string;
  orderAddress?: orderAdd;
  orderId?: string;
  orderDate?: {
    date?: string;
    time?: string;
  };
  rating?: any;
  status?: 'requested' | 'accepted' | 'completed' | 'canceled';
  default_currency?: string;
}

interface orderAdd {
  completeAddress?: string;
  latitude?: string;
  longitude?: string;
}
interface orderDetails {
  id?: string;
  serviceName?: string;
  servicePrice?: string;
}

interface TDetailsPageData {
  clientUserUId?: string;
  proUserUId?: string;
  id: string;
  name: string;
  photoUrl: string;
  userUId: string;
  bookingDate: string | {date: string; time: string};
  orderDetails: orderDetails;
  orderAddress: orderAdd;
  note?: string;
  status?: 'requested' | 'accepted' | 'completed' | 'canceled';
  fcmTokens?: any;
}
