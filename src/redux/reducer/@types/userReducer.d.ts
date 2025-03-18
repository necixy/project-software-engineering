type TUserDetails = {
  displayName?: string;
  email?: string;
  uid?: string;
  photoURL?: string;
  frontImage?: string;
  profession?: string;
  location?: any;
  bio?: string;
  following?: Object;
  followers?: Object;
  locationData?: any;
  fcmTokens?: any;
  rating?: number;
  isPro?: boolean;
  isDeleted?: any;
};

type TProDetails = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
  termsAccepted: boolean;
};

interface URProps {
  token?: string;
  userDetails?: TUserDetails | FirebaseAuthTypes.User | null;
  proDetails?: TProDetails | null;
  userType?: 'client' | 'pro';
  baseUrl: 'Staging' | 'Production';
  language?: 'en' | 'fr';
  searchedPlaces?: [] | any;
  follow: {followers: string[]; followings: string[]};
}
