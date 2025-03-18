import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const enum notificationType {
  notificationEnabled = 'notificationEnabled',
  messageNotification = 'messageNotification',
  bookingNotification = 'bookingNotification',
}

const useNotification = () => {
  const {userDetails} = useAppSelector(state => state?.userReducer);
  const {t} = useTranslation();

  const [data, setData] = useState([
    {
      // id: 'All notifications',
      name: t('common:allNotifications'),
      value: notificationType.notificationEnabled,
      status: true,
    },
    {
      // id: 'Booking notifications',
      name: t('common:bookingNotifications'),
      value: notificationType.bookingNotification,
      status: true,
    },
    {
      // id: 'Message notifications',
      name: t('common:messageNotifications'),
      value: notificationType.messageNotification,
      status: true,
    },
  ]);

  const handlePress = (item: any) => {
    const newStatus = !item.status;

    const updates: any = {};
    if (item.value === notificationType.bookingNotification) {
      updates.bookingNotification = newStatus;
      updates.notificationEnabled =
        newStatus &&
        data?.find(d => d.value === notificationType.messageNotification)
          ?.status;
    } else if (item.value === notificationType.messageNotification) {
      updates.messageNotification = newStatus;
      updates.notificationEnabled =
        newStatus &&
        data.find(d => d.value === notificationType.bookingNotification)
          ?.status;
    } else if (item.value === notificationType.notificationEnabled) {
      updates.notificationEnabled = newStatus;
      updates.bookingNotification = newStatus;
      updates.messageNotification = newStatus;
    }

    databaseRef(`userSettings/${userDetails?.uid}`).update(updates);

    setData(prevData =>
      prevData.map(d => {
        if (item.value === notificationType.notificationEnabled) {
          return {
            ...d,
            status: newStatus,
          };
        } else if (
          item.value === notificationType.bookingNotification ||
          item.value === notificationType.messageNotification
        ) {
          return {
            ...d,
            status:
              d.value === item.value
                ? newStatus
                : d.value === notificationType.notificationEnabled
                ? newStatus &&
                  (d.value === notificationType.bookingNotification
                    ? updates?.bookingNotification
                    : d.value === notificationType.messageNotification
                    ? updates?.messageNotification
                    : d.status)
                : d.status,
          };
        }
        return d;
      }),
    );
  };

  useEffect(() => {
    const useRef = databaseRef(`userSettings/${userDetails?.uid}`);

    const handleGetNotifications = useRef.on('value', snapshot => {
      const notifications = snapshot.val();

      setData([
        {
          name: t('common:allNotifications'),
          status: notifications?.notificationEnabled,
          value: notificationType.notificationEnabled,
        },
        {
          name: t('common:bookingNotifications'),
          status: notifications?.bookingNotification,
          value: notificationType.bookingNotification,
        },
        {
          name: t('common:messageNotifications'),
          status: notifications?.messageNotification,
          value: notificationType.messageNotification,
        },
      ]);
    });

    return () => {
      databaseRef(`userSettings/${userDetails?.uid}`).off(
        'value',
        handleGetNotifications,
      );
    };
  }, [userDetails?.uid]);

  return {data, handlePress};
};

export default useNotification;
