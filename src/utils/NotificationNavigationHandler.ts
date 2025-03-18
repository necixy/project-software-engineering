import {Linking} from 'react-native';
import {navigate} from 'react-navigation-helpers';
import {bookingSackRouteName} from 'src/navigation/constant/bookingStackRouteName';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {tabStackRouteName} from 'src/navigation/constant/tabNavRouteName';
import {topTabNavRouteName} from 'src/navigation/constant/topTabNavRouteName';

export const notificationNavigationHandler = (data: any) => {
  const id = data?.status;

  let url = 'vita://';
  switch (id) {
    case 'p0':
      break;

    case 'hold':
      navigate(rootStackName.BOTTOM_TABS, {
        screen: tabStackRouteName.BOOKING,
        params: {
          screen: topTabNavRouteName.ON_HOLD,
        },
      });

      break;
    case 'new':
      // url += `/request`;
      // `${rootStackName.BOTTOM_TABS}/${tabStackRouteName.BOOKING}/${bookingSackRouteName.TOP_TAB_NAVIGATION}/${topTabNavRouteName.REQUESTS}?bookingId=${data?.bookingKey}`;
      // console.log('url', url);
      navigate(rootStackName.BOTTOM_TABS, {
        screen: tabStackRouteName.BOOKING,
        params: {
          screen: bookingSackRouteName.TOP_TAB_NAVIGATION,
          params: {
            screen: topTabNavRouteName.REQUESTS,
            params: {bookingId: data?.bookingKey},
          },
          // screen: topTabNavRouteName.REQUESTS,

          // screen: bookingSackRouteName.REQUEST_DETAIL,

          // params: {bookingId: data?.bookingKey},
        },
      });
      break;
    case 'accepted':
      navigate(rootStackName.BOTTOM_TABS, {
        screen: tabStackRouteName.BOOKING,
        params: {
          screen: bookingSackRouteName.TOP_TAB_NAVIGATION,
          params: {
            screen: topTabNavRouteName.ACCEPTED,
            params: {bookingId: data?.bookingKey},
          },
        },
      });
      break;
    case 'canceled':
      data?.canceledBy == 'client'
        ? navigate(rootStackName.SCREEN_STACK, {
            screen: screenStackName.MISSION_HISTORY,
            // params: {
            //   screen: screenStackName.REQUEST_DETAILS,
            params: {bookingId: data?.bookingKey},
            // },
            // screen: screenStackName.BOOKING_HISTORY,
          })
        : navigate(rootStackName.SCREEN_STACK, {
            screen: screenStackName.BOOKING_HISTORY,
            params: {bookingId: data?.bookingKey},
          });

      break;
    case 'declined':
      navigate(rootStackName.SCREEN_STACK, {
        screen: screenStackName.BOOKING_HISTORY,
        // params: {
        //   screen: screenStackName.REQUEST_DETAILS,
        //   params: {bookingId: data?.bookingKey},
        // },
        // screen: screenStackName.BOOKING_HISTORY,
      });
      break;
    case 'completed':
      navigate(rootStackName.SCREEN_STACK, {
        screen: screenStackName.BOOKING_HISTORY,
        params: {
          // screen: screenStackName.REQUEST_DETAILS,
          // params: {bookingId: data?.bookingKey},
        },
      });
      break;
    case 'chat':
      navigate(rootStackName.SCREEN_STACK, {
        screen: screenStackName.Chat,
        params: {
          name: data?.name,
          profile: data?.profile,
          channelId: null,
          uid: data?.uid,
        },
      });
      break;
    default:
  }
  Linking.openURL(url);
};
