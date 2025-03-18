import axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { reset } from 'react-navigation-helpers';

import { rootStackName } from 'src/navigation/constant/rootStackName';

import store from 'src/redux/store';
import { showModal } from 'src/shared/components/modalProvider/ModalProvider';

export const axiosError = async (err: AxiosError<any>) => {
  // const {t} = useTranslation();
  // if (err.response) {
  //   // The request was made and the server responded with a status code

  //   showModal({
  //     type: 'error',
  //     message: err?.response?.data?.message,
  //   });
  // }

  // throw err;
  console.error('MAIN ERROR', err);
  console.error('axios instance', err.response);
  if (err.response !== undefined) {
    console.error('err', err);
    if (err?.response.status === 490) throw err;
    // if (err?.response.status === 401) {
    //   handleLoginNavigate();
    //   hideLoadingSpinner();
    //   store.dispatch({ type: "LOGOUT" });
    // }
    // if (err.response.data.message) {
    //   if (err?.response?.data?.error !== "EMAIL_NOT_VERIFIED") {
    //     showModal({
    //       type: "error",
    //       title: "Connection Error",
    //       message:
    //         "Oops! Looks like your device is not connected to the Internet.",
    //     });
    //   }
    // }
    console.log("SSS", err.response.data?.message);

    if (err.response.data?.message) {
      if (err?.response?.data?.error !== 'EMAIL_NOT_VERIFIED') {
        if (err?.response?.status === 406) {
          throw err.response;
        } else {
          console.error(err?.response?.message);

          if (err?.response?.data?.message === 'message:accountIsInactive') {
            showModal({
              type: 'error',
              title: 'customWords:deletedSuccessfully',
              message: 'message:accountDeletionProcess',
            });
          } else {
            showModal({
              type: 'error',
              message: err.response.data.message,
              // successFn: () => {
              //   if (err?.response?.status === 406) {
              //     NavigationService.navigate(screenStackName?.ADD_CARD);
              //   }
              // },
            });
          }
        }
      }
    }

    // if (err.response.status === 401) {
    //   store.dispatch({ type: "LOGOUT" });
    //   reset({
    //     index: 0,
    //     routes: [
    //       {
    //         name: rootStackName.AUTH,
    //         params: { screen: authStackName.LOGIN },
    //       },
    //     ],
    //   });
    // }

    throw err;
  } else {
    if (err.message === 'Network Error') {
      // store.dispatch(START_NETWORKING_POLLING());
      // store.dispatch(isNetworkConnected(false));
      // showModal({
      //   type: "error",
      //   message:
      //     "There was an issue with Internet connection, please try changing your location.",
      // });
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => resolve(axios(originalRequest)), 2000);
      // });
      // console.error("-->", getRetryCount());
      //   if (getRetryCount() < MAX_RETRY_ATTEMPTS) {
      //     incrementRetryCount();
      //     return new Promise((resolve) => {
      //       setTimeout(
      //         () =>
      //           resolve(
      //             axios(originalRequest).then((response) => {
      //               // Resolve the promise with the response if successful
      //               // resolve(response);
      //               resetCount();
      //               return response;
      //             })
      //           ),
      //         2000
      //       );
      //     });
      //   } else {
      // Reject the promise if maximum retry attempts have been reached
      showModal({
        type: 'error',
        message: 'message:InternetConnection',
      });
      return Promise.reject(err);
    } else {
      showModal({
        type: 'error',
        message: 'message:tryAgainConnectingServer',
      });
      return Promise.reject(err);
    }
  }
  throw err;
};
// };
