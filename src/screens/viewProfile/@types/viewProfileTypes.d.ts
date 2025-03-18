interface TViewProfileData {
  bio: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  isPro: boolean;
  location: string;
  photoURL: string;
  profession: string;
  uid: string;
  followers?: [];
  following?: [];
  proPersonalInfo: any;
  rating?: number;
}

interface TBlockedUserData {
  createdAt: number;
  id: number;
  blockedUserId: string;
  blockingUser: string;
}

interface TReportedUserData {
  createdAt: number;
  id: number;
  reportedUserId: string;
  reportingUser: string;
}
