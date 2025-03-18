import {axiosInstance} from 'src/api/root_api/axiosInstance.service';

export const updateBookingPaymentStatus = (
  bookingId: any,
  status: string,
  canceledBy?: string,
) =>
  axiosInstance.post(`stripe/booking-status-update`, {
    bookingId,
    status,
    canceledBy,
  });
// .then(res => res)
// .catch(err => {
//   console.error('error in booking status', err);
//   return err;
// });
