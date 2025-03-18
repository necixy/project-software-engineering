interface TBookingRatingsProps {
  imageUri?: string;
  proId: string;
  name?: string;
  screenName?: 'CustomCard' | 'RequestDetail';
  orderId: string;
}

interface TRatingData {
  review: string | undefined;
  clientId: string | undefined;
  clientPro: string | undefined;
  proId: string | undefined;
  rating: number | undefined;
  uploadTime: object | undefined;
  id: string | undefined;
  orderId: string | undefined;
}
