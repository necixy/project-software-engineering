import {NextFunction, Request, Response} from 'express';
import {throwError} from '../../utils/errorHandler';
import {db} from '../firebase';
import Stripe from 'stripe';
const stripe: Stripe = new Stripe(
  `sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0`,
);
const createSetupIntent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {uid} = req.body;
  const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

  try {
    if (!uid) {
      throwError({
        message: 'User Id must be required',
        status: 400,
      });
      return;
    }

    // Get the Stripe customer ID from the Firebase Realtime Database
    const customerSnapshot = await db
      .ref(`/${serverType}/stripeAccounts/${uid}/stripeCustomerId`)
      .once('value');
    const customerId = customerSnapshot.val();

    if (!customerId) {
      throwError({
        message: 'Customer Id not found!',
        status: 400,
      });
      return;
    }

    const {client_secret} = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    // await admin.database().ref(`${serverType}/stripeCustomerID/${uid}`).update({
    //   clientSecret: client_secret,
    // });
    res.send({clientSecret: client_secret});
  } catch (error: any) {
    console.log(error, error);

    next(error);
  }
};

const getSavedCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {uid} = req.query;
  const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

  try {
    if (!uid || typeof uid !== 'string') {
      throwError({
        message: 'User Id must be required',
        status: 400,
      });
      return;
    }

    const customerSnapshot = await db
      .ref(`/${serverType}/stripeAccounts/${uid}/stripeCustomerId`)
      .once('value');
    const customerId = customerSnapshot.val();

    if (!customerId) {
      throwError({
        message: 'Customer Id not found.',
        status: 400,
      });
      return;
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    res.json(paymentMethods);
  } catch (error) {
    next(error);
  }
};

export {createSetupIntent, getSavedCards};
