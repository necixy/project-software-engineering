import {Router, Request, Response} from 'express';
import {MulticastMessage} from 'firebase-admin/messaging';
import {db, messaging} from '../services/firebase';

const router = Router();

router.post('/send-notification', async (req: Request, res: Response) => {
  try {
    const {data, message, title, userIds, type} = req.body;
    const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

    if (!userIds?.length) {
      res.status(400).json({
        status: 400,
        message: `User ids is required`,
        error: true,
      });
      return;
    } else if (!message) {
      res.status(400).json({
        status: 400,
        message: `Message body is required`,
        error: true,
      });
      return;
    } else if (!title) {
      res.status(400).json({
        status: 400,
        message: `Message title is required`,
        error: true,
      });
      return;
    }

    const tokenResponse: any = await getStoredFCMTokens(
      userIds,
      serverType,
      type,
    );
    let usersTokens = [];
    tokenResponse?.map(item => {
      usersTokens = [...usersTokens, ...(item?.tokens ?? [])];
    });
    if (!usersTokens?.length) {
      res.status(200).json({
        status: 200,
        message: `Users did not have any token`,
        error: true,
      });
      return;
    }

    const payload: MulticastMessage = {
      tokens: usersTokens ?? [],
      notification: {
        body: message,
        title,
      },
      data,
    };
    await messaging.sendEachForMulticast(payload);
    res.status(200).json({
      status: 200,
      message: `Notification sent successfully!`,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `Something went wrong`,
      error: true,
      data: error,
    });
  }
});

function getStoredFCMTokens(
  userIDs: string | String[],
  serverType: string,
  type,
) {
  return new Promise((resolve, reject) => {
    // Ensure userIDs is an array
    if (!Array.isArray(userIDs)) {
      userIDs = [userIDs];
    }

    const promises = userIDs.map(userID => {
      return new Promise((resolve, reject) => {
        // Fetch user notification setting from the settings table
        const notificationSettingType =
          type === 'chat'
            ? 'messageNotification'
            : type === 'booking'
            ? 'bookingNotification'
            : 'notificationEnabled';
        const userSettingsRef = db.ref(
          `${serverType}/userSettings/${userID}/${notificationSettingType}`,
        );
        userSettingsRef
          .once('value')
          .then(snapshot => {
            const settings = snapshot.val();
            console.log('settings', settings);
            console.log('settings', notificationSettingType, userID);

            if (settings) {
              // Fetch the FCM tokens for the user from the database
              const userTokensRef = db.ref(`${serverType}/fcmTokens/${userID}`);

              userTokensRef
                .once('value')
                .then(snapshot => {
                  const tokens = snapshot.val();

                  if (tokens) {
                    const tokenArray = Object.values(tokens);

                    resolve({userID, tokens: tokenArray});
                  } else {
                    console.log(`No tokens found for user ${userID}.`);
                    resolve({userID, tokens: null});
                  }
                })
                .catch(error => {
                  console.error('Error fetching tokens:', error);
                  reject(error);
                });
            } else {
              console.log(`Notifications are not enabled for user ${userID}.`);
              resolve({userID, tokens: null});
            }
          })
          .catch(error => {
            console.error('Error fetching user settings:', error);
            reject(error);
          });
      });
    });

    Promise.all(promises)
      .then(results => resolve(results))
      .catch(error => reject(error));
  });
}

export default router;
