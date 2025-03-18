import {axiosInstance} from 'src/api/root_api/axiosInstance.service';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';

export const createStripeAccountApi = (
  serverType: string,
  email: any,
  uid: string,
  first_name: string,
  last_name: string,
  dob: {
    day: number;
    month: number;
    year: number;
  },
  address: {
    city: string;
    country: string;
    postal_code: string;
  },
  phone: any,
  displayName: string,
) =>
  axiosInstance
    .post(`stripe/create-connect-account`, {
      serverType,
      email,
      uid,
      first_name,
      last_name,
      dob,
      address,
      phone,
      displayName,
    })
    .then(res => {
      return res?.data;
    });

export const createAccountLink = (
  accountId: any,
  type?: 'account_update' | 'account_onboarding',
) =>
  axiosInstance
    .post(`stripe/create-account-link`, {
      accountId,
      type,
    })
    .then(res => res?.data);

export const getStripeAccountData = (userId: string) =>
  axiosInstance
    .get(`stripe/get-stripe-account-data`, {
      params: {userId},
    })
    .then(res => res?.data)
    .catch(err =>
      console.error(
        'error in account details in Stripe Account ID',
        JSON.stringify(err),
      ),
    );
export const verifyAccountStatus = (userId: string) =>
  axiosInstance
    .get(`stripe/verify-account-status`, {
      params: {userId},
    })
    .then(res => res?.data)
    .catch(err => {
      console.error('error in verify account Status', JSON.stringify(err));
      showModal({
        message: err?.message,
      });
    });
