// // backgroundMessageHandler.js
// import messaging from '@react-native-firebase/messaging';
// import notifee, {
//   AndroidImportance,
//   AndroidVisibility,
//   EventType,
// } from '@notifee/react-native';
// import {navigationRef} from 'react-navigation-helpers';
// import {Platform} from 'react-native';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
//   onMessageReceived(remoteMessage);
// });

// notifee.onBackgroundEvent(async ({type, detail}) => {
//   if (type === EventType.ACTION_PRESS) {
//     console.log(
//       'Notification caused app to open from background state:',
//       detail.notification,
//     );
//     // navigate('Notification', { data: detail.notification.data });
//   }
// });

// async function onMessageReceived(message: any) {
//   if (Platform.OS === 'android') {
//     await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       importance: AndroidImportance.HIGH,
//     });

//     await notifee.displayNotification({
//       title: message.notification.title,
//       body: message.notification.body,
//       android: {
//         channelId: 'default',
//         importance: AndroidImportance.HIGH,
//         visibility: AndroidVisibility.PUBLIC,
//         smallIcon: 'ic_launcher',
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   }
// }
