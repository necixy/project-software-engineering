import {axiosInstance} from 'src/api/root_api/axiosInstance.service';

type TSendNotification = {
  type: string;
  userIds: any;
  message: any;
  title?: string;
  data?: any;
};
export const sendNotifications = ({
  type,
  userIds,
  message,
  title,
  data,
}: TSendNotification) =>
  axiosInstance
    .post(`notification/send-notification`, {
      type,
      userIds,
      message,
      title,
      data,
    });
    // .then(res => res)
    // .catch(err => console.error('error in notification', err));
