import {axiosInstance} from '../root_api/axiosInstance.service';

const getDashboardDetails = (data: {
  userId: string;
}): Promise<dashboardBalanceType> =>
  axiosInstance
    .post(`stripe/dashboard-amount-details`, data)
    .then(res => res?.data)
    .catch(err =>
      console.error('error while doing payment', JSON.stringify(err)),
    );

export {getDashboardDetails};
