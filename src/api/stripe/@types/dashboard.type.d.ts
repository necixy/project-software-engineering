interface source_typesType {
  card: number;
}

interface availableItemType {
  amount: number;
  currency: string;
  source_types: source_typesType;
}

interface pendingItemType {
  amount: number;
  currency: string;
  source_types: source_typesType;
}

interface balanceType {
  object: string;
  available: Array<availableItemType>;
  livemode: boolean;
  pending: Array<pendingItemType>;
}

interface todayChargesType {
  refundedCount: number;
  completedCount: number;
  refundedAmount: number;
  completedBalance: number;
}

interface bookingCountType {
  totalBookings: number;
  completedBookings: number;
}

interface nextPayoutDateType {}

interface latestPayoutDateType {}

interface payoutsType {
  totalCount: number;
  nextPayoutDate: nextPayoutDateType;
  latestPayoutDate: latestPayoutDateType;
}

interface dashboardBalanceType {
  balance: balanceType;
  todayCharges: todayChargesType;
  bookingCount: bookingCountType;
  payouts: payoutsType;
}
