import {axiosInstance} from 'src/api/root_api/axiosInstance.service';

export const createStripeCustomerId = (
  serverType: string,
  email: any,
  uid: string,
  name: string,
) =>
  axiosInstance
    .post(`stripe/create-customer`, {
      serverType,
      email,
      uid,
      name,
    })
    .then(res => res);
// .catch(err => console.error('error in create stripe customerId', err));
export const createStripeSecretKey = (
  uid: string,
  serverType: string,
  // uid: string,
) =>
  axiosInstance
    .post(`stripe/create-setup-intent`, {
      uid,
      serverType,
      // uid,
    })
    .then(res => res?.data)
    .catch(err =>
      console.error(
        'error in create secret key',
        JSON.stringify(err?.response),
      ),
    );

export const getSavedCards = (uid: string, serverType: string) =>
  axiosInstance
    .get(`stripe/saved-cards`, {
      params: {uid, serverType},
    })
    .then(res => res?.data?.data);
// .catch(err =>
//   console.error(
//     'error in saved cards list in StripeCustomerId',
//     JSON.stringify(err),
//   ),
// );

export const createPaymentIntent = ({
  proUserId,
  paymentMethodId,
  menuId,
  clientUserId,
  productId,
  serverType,
  date,
  time,
}: {
  proUserId: any;
  paymentMethodId: string;
  menuId: string;
  clientUserId: string;
  productId: string;
  serverType: string;
  date: string | any;
  time: string[];
}) =>
  axiosInstance
    .post(`stripe/create-payment-intent`, {
      proUserId,
      paymentMethodId,
      menuId,
      clientUserId,
      productId,
      serverType,
      date,
      time,
    })
    .then(res => res?.data);
// .catch(err =>
//   console.error('error while doing payment', JSON.stringify(err)),
// );
