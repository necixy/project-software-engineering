import {Router, Request, Response, NextFunction} from 'express';
import {db, fbApp} from '../services/firebase';
import {throwError} from '../utils/errorHandler';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import Stripe from 'stripe';
import {Timestamp} from 'firebase-admin/firestore';
const stripe: Stripe = new Stripe(
  `sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0`,
);
// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBWpJ6cDpp80gQ8WhAILR1Z0ILawqtqzDw',
  authDomain: 'vita-abe0f.firebaseapp.com',
  databaseURL: 'https://vita-abe0f-default-rtdb.firebaseio.com',
  projectId: 'vita-abe0f',
  storageBucket: 'vita-abe0f.appspot.com',
  messagingSenderId: '976546399680',
  appId: '1:976546399680:web:f97794e491911d0a52b425',
  measurementId: 'G-PYNRYS8D0Q',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const router = Router();

router.post(
  '/login-token-generator1',
  async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

    try {
      if (!email || !password) {
        throwError({
          message: 'Email and password must be provided',
          status: 400,
        });
        return;
      }
      const userRecord = await fbApp.auth().getUserByEmail(email);
      const uid = userRecord.uid;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      // Verify the ID token
      const decodedToken = await fbApp.auth().verifyIdToken(idToken);
      const uid1 = decodedToken.uid;
      console.log({uid, uid1});

      // Create a custom token for the authenticated user
      //   const customToken = await fbApp.auth().createCustomToken(uid);

      const customerSnapshot = await db
        .ref(`/${serverType}/stripeAccounts/${uid}`)
        .once('value');
      let data: any = {};
      if (customerSnapshot?.exists) {
        data = customerSnapshot?.val() ?? {};
      }
      console.log({data});

      res.json({token: idToken, uid, ...data, serverType});
    } catch (error) {
      console.error('Error logging in user:', error);
      next(
        error?.message
          ? error
          : {message: 'Invalid email or password', status: 401},
      );
    }
  },
);

router.get(
  '/delete-data-generator1',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {password} = req?.query;
      const serverType = (req?.headers?.server_type as string) ?? 'LIVE';
      console.log({password, s: req?.body});

      if (password !== 'vita-admin-password') {
        res.json({status: 200, message: '------!!!!!!!!-------'});
        return;
      }
      const usersRef = fbApp.database().ref(`${serverType}/users`);
      const stripeAccountsRef = fbApp
        .database()
        .ref(`${serverType}/stripeAccounts`);
      const usersData = await usersRef.once('value');
      const users = usersData?.val();

      if (users) {
        const userIds = Object.keys(users);

        // Deleting users from Firebase Authentication, Realtime Database, and Stripe
        const deletePromises = userIds.map(async userId => {
          try {
            const userStripeDataSnapshot = await stripeAccountsRef
              .child(userId)
              .once('value');
            const userStripeData = userStripeDataSnapshot.val();

            try {
              if (userStripeData) {
                const {stripeCustomerId, stripeAccountId} = userStripeData;

                if (stripeCustomerId) {
                  await stripe.customers.del(stripeCustomerId);
                }

                if (stripeAccountId) {
                  await stripe.accounts.del(stripeAccountId);
                }

                await stripeAccountsRef.child(userId).remove();
              }
            } catch (error) {
              console.log('Error on delete data on stripe');
              const {stripeCustomerId, stripeAccountId} = userStripeData;

              if (stripeCustomerId) {
                await db
                  .ref(`deleteFailed/${userId}`)
                  .update({stripeCustomerId});
              }

              if (stripeAccountId) {
                await db
                  .ref(`deleteFailed/${userId}`)
                  .update({stripeAccountId});
              }
            }
            await fbApp.auth().deleteUser(userId);
            // Delete user-specific storage
            const bucket = fbApp.storage().bucket();
            const [files] = await bucket.getFiles({prefix: `${userId}/`});
            const deleteFilePromises = files.map(file => file.delete());
            await Promise.all(deleteFilePromises);
          } catch (error) {
            console.log('error.code-->', error.code);

            if (error.code === 'auth/user-not-found') {
              console.warn(`User not found: ${userId}`);
            } else if (error.code === 'storage/invalid-argument') {
              await db.ref(`deleteFailed/${userId}`).update({storage: true});
              console.warn(
                `Invalid argument for storage operation: ${error.message}`,
              );
            } else {
              throw error; // rethrow other errors
            }
          }
          return usersRef.child(userId).remove();
        });
        await Promise.all(deletePromises);
        await db.ref(`${serverType}`).remove();
        res
          .status(200)
          .send(
            'All users and their associated Stripe data deleted successfully',
          );
      } else {
        res.status(404).send('No users found');
      }
    } catch (error) {
      console.error('Error deleting users:', error);
      res.status(500).send('Error deleting users');
    }
  },
);

router.get(
  '/currency-entry-for-old-accounts',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serverType = (req?.headers?.server_type as string) ?? 'LIVE';
      const stripeAccounts = await fbApp
        .database()
        .ref(`${serverType}/stripeAccounts`)
        .once('value');
      const users = stripeAccounts?.val();
      if (users) {
        const userIds = Object.keys(users);
        const deletePromises = userIds.map(async userId => {
          const {stripeAccountId} = users?.[userId];
          if (stripeAccountId) {
            const account = await stripe.accounts.retrieve(stripeAccountId);
            await db
              .ref(`/${serverType}/users/${userId}/default_currency`)
              .set(account?.default_currency);
            console.log('Default Currency:', account.default_currency);
          }
        });
        await Promise.all(deletePromises);
        res
          .status(200)
          .send(
            'All users and their associated Stripe data update successfully',
          );
      }
    } catch (error) {
      res.status(500).send('Error updating users');
    }
  },
);

function isValidEmail(email) {
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  return emailRegex.test(email);
}
// Route: Handle account deletion request
router.post('/account-deletion', async (req, res) => {
  const {email, password, reason} = req.body;
  const server_type = (req?.headers?.server_type as string) ?? 'LIVE';

  if (!['LIVE', 'STAGING', 'DEVELOPMENT'].includes(server_type)) {
    res.status(400).json({
      status: 400,
      message: `Server type not found`,
      error: true,
      success: false,
    });
  }

  console.log(req.body);

  // Validate input
  if (!email || !password || !reason) {
    res.status(400).json({success: false, message: 'All fields are required.'});
  }
  if (!isValidEmail(email)) {
    res.status(400).json({success: false, message: 'Invalid email format.'});
  }
  if (reason.length < 100) {
    res.status(400).json({
      success: false,
      message: 'Reason must be at least 100 characters long.',
    });
  }

  try {
    const userRecord = await fbApp.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const idToken = await userCredential.user.getIdToken();

    // Verify the ID token
    await fbApp.auth().verifyIdToken(idToken);

    const userValueRef = await db
      .ref(`${server_type}/users/${uid}`)
      .once('value');
    const userValue = userValueRef.val();
    if (!userValue) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    } else if (userValue?.deletionRequests) {
      res.status(400).json({
        success: false,
        message:
          'Your account deletion request has already been submitted. Our team is reviewing it.',
      });
    }

    // Store request in Firebase Realtime Database

    await db.ref(`${server_type}/users/${uid}/deletionRequests`).set({
      reason,
      status: 'pending',
      createdAt: Math?.floor(Timestamp.now().toDate().getTime() / 1000),
    });

    res.status(200).json({
      success: true,
      message: 'Account deletion request submitted successfully.',
    });
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({success: false, error});
  }
});
export default router;
