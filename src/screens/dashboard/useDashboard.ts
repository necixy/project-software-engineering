import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {err} from 'react-native-svg';
import {getDashboardDetails} from 'src/api/stripe/dashboard';
import {
  createAccountLink,
  getStripeAccountData,
  verifyAccountStatus,
} from 'src/api/stripe/stripeAccountId/stripeAccountId';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {formatDateBasedOnCountry} from 'src/utils/date';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useDashboard = () => {
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state?.userReducer);
  const [paymentUser, setPaymentUser] = useState([]);
  const [dashboardData, setDashboardData] = useState<dashboardBalanceType>();
  const [transactionData, setTransactionData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newFormatDate, setNewFormatDate] = useState(
    moment().add(1, 'months').date(1).format('DD-MM-YYYY'),
  );

  useEffect(() => {
    verifyAccountStatus(userDetails?.uid)?.then(res => {
      console.log('-->', JSON.stringify(res, null, 2));
    });

    return () => {};
  }, []);

  const [accountDetails, setAccountDetails] = useState();
  const {navigate} = useStackNavigation();
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);
  const isFocused = useIsFocused();
  useEffect(() => {
    // let newFormatDate = formatDateBasedOnCountry({
    //   date: moment().add(1, 'months').date(1).format('DD-MM-YYYY'),
    //   countryCode: userDetails?.proPersonalInfo?.address?.country,
    // });
    // console.log(newFormatDate, 1111111111111111111111111111, userDetails?.proPersonalInfo?.address?.country, moment().add(1, 'months').date(1).format('DD-MM-YYYY'),)
    setNewFormatDate(moment().add(1, 'months').date(1).format('DD-MM-YYYY'));
    // console.log({newFormatDate});

    if (isFocused) {
      fetchData();
      setIsEdit(false);
    }
  }, [isFocused]);

  let requestedPayments: any[] = [];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const dashboardData = await getDashboardDetails({
        userId: userDetails?.uid,
      });
      console.log(JSON.stringify(dashboardData));

      // console.log(userDetails?.uid);

      setDashboardData(dashboardData);
      const snapshot = await databaseRef('payments')
        .orderByChild(`proUserId`)
        .equalTo(`${userDetails?.uid}`)
        .limitToLast(1000)
        .once('value');
      let res = await getStripeAccountData(userDetails?.uid);

      setAccountDetails(res?.external_accounts?.data);
      const postPromises: any[] = [];
      const data = snapshot.val();

      let transactionsData = data != null ? Object?.values(data) : [];

      transactionsData?.forEach((item: any) => {
        if (item?.object === 'payout') {
          requestedPayments?.push(item);
        } else {
          let clientUserDetails: any;
          let userPromise = databaseRef(`users/${item?.clientUserId}`)?.once(
            'value',
            snapshot => {
              clientUserDetails = snapshot.val();

              const paymentDetails: any = {
                paymentUserName: clientUserDetails?.displayName!,
                paymentUserUId: clientUserDetails?.uid!,
                ...item,
              };
              if (item?.captured || item?.refunded)
                requestedPayments?.push(paymentDetails);
            },
          );
          postPromises.push(userPromise);
        }
      });
      await Promise.all(postPromises);

      if (requestedPayments) {
        const sortedPayments = requestedPayments.sort(
          (a, b) => b.lastUpdateAt - a.lastUpdateAt,
        ); //
        setTransactionData(sortedPayments);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccountDetails = async () => {
    try {
      setIsEdit(true);
      await databaseRef(`stripeAccounts/${uid}/stripeAccountId`).once(
        'value',
        snapshot => {
          const accountId = snapshot.val();
          accountId &&
            createAccountLink(accountId)
              .then(
                res =>
                  res?.url &&
                  navigate(screenStackName.WEB_VIEW, {
                    url: res?.url,
                    accountType: 'edit',
                  }),
              )
              .catch(err => console.error(err));
          // setIsEdit(false);
        },
      );
    } catch (error) {
      console.error(JSON.stringify(error));
      setIsEdit(false);
    } finally {
    }
  };

  return {
    userDetails,
    isLoading,
    transactionData,
    accountDetails,
    dashboardData,
    updateAccountDetails,
    isEdit,
    t,
    newFormatDate,
  };
};

export default useDashboard;
