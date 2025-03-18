export const bookingRequestToPro = {
  message: 'has requested for service',
  title: 'New Booking',
  data: {status: 'new'},
  type: 'booking',
};
// export const bookingRequestOnHold = {
//   message: 'Booking Request on-hold',
//   title: 'On-Hold Booking',
//   data: {status: 'hold'},
// };
export const bookingRequestAccepted = {
  message: 'Your requested has been accepted by',
  title: 'Accepted Booking',
  data: {status: 'accepted'},
  type: 'booking',
};
export const bookingRequestOnDecline = {
  message: 'Your requested has been declined by',
  title: 'Declined Booking',
  data: {status: 'declined'},
  type: 'booking',
};
export const bookingRequestCanceled = {
  message: 'Request has been canceled by',
  title: 'Canceled Booking',
  data: {status: 'canceled'},
  type: 'booking',
};

export const bookingCompleted = {
  message: 'Your requested has been completed by',
  title: 'Completed Booking',
  data: {status: 'completed'},
  type: 'booking',
};
