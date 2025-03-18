import {NextFunction, Request, Response} from 'express';
import {db} from '../firebase';
import {throwError} from '../../utils/errorHandler';
import Stripe from 'stripe';
const stripe: Stripe = new Stripe(
  `sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0`,
);

const createConnectAccount = async (req: Request, res: Response) => {
  const {first_name, last_name, dob, address, email, phone, uid, displayName} =
    req.body;
  const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

  if (!uid) {
    res.status(400).send({
      message: 'User Id must be required',
      error: true,
      status: 400,
    });
    return;
  } else if (!email) {
    res.status(400).send({
      message: 'Email Id must be required',
      error: true,
      status: 400,
    });

    return;
  } else if (!displayName) {
    res.status(400).send({
      message: 'Display Name must be required',
      error: true,
      status: 400,
    });

    return;
  } else if (!phone) {
    res.status(400).send({
      message: 'Phone number must be required',
      error: true,
      status: 400,
    });
  }
  if (!first_name || !last_name) {
    res.status(400).send({
      message: `${!first_name ? 'First name' : 'Last name'} must be required`,
      error: true,
      status: 400,
    });
    return;
  }
  if (!dob?.day || !dob?.month || !dob?.year) {
    res.status(400).send({
      message: `In Date of birth ${
        !dob?.day ? 'Day' : !dob?.month ? 'month' : 'year'
      } must be required`,
      error: true,
      status: 400,
    });
    return;
  }
  if (
    !address?.city ||
    !address?.country ||
    !address?.postal_code ||
    !address?.line1
  ) {
    res.status(400).send({
      message: `Address must be in valid format. Need country , state ,postal_code , line1.`,
      error: true,
      status: 400,
    });
    return;
  }
  try {
    const customerSnapshot = await db
      .ref(`/${serverType}/stripeAccounts/${uid}/stripeAccountId`)
      .once('value');
    const stripeAccountId = customerSnapshot.val();

    if (stripeAccountId) {
      // res.json({ accountId: stripeAccountId });
      // let res = await deleteConnectAccount({
      //   body: {
      //     uid,
      //     accountId: stripeAccountId,
      //     serverType,
      //   },
      // });

      await stripe.accounts.del(stripeAccountId);
      await db
        .ref(`${serverType}/stripeAccounts/${uid}/stripeAccountId`)
        .remove();
    }

    const account = await stripe.accounts.create({
      type: 'express',
      country: address?.country,
      email: email,
      capabilities: {
        card_payments: {requested: true},
        transfers: {requested: true},
      },
      business_type: 'individual',
      // default_currency: 'eur',
      individual: {
        first_name,
        last_name,
        dob,
        email,
        address,
        phone,
      },
      business_profile: {
        product_description: 'N/A',
      },

      settings: {
        payouts: {
          schedule: {
            // interval: "monthly",
            // monthly_anchor: 1,
            interval: 'daily',
            delay_days: 'minimum',
          },
        },
      },
      metadata: {
        uid,
        serverType,
        email,
      },
    });
    await db.ref(`${serverType}/stripeAccounts/${uid}`).update({
      stripeAccountId: account.id,
      email: email,
    });
    await db.ref(`${serverType}/users/${uid}/proPersonalInfo`).update(req.body);
    res.json({accountId: account.id});
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 500,
      message: error?.message ?? 'Unable to create Stripe account',
      error: true,
    });
  }
};

const createAccountLink = async (req: Request, res: Response) => {
  const {accountId, type = 'account_onboarding'} = req.body;
  if (!accountId) {
    res.status(400).json({
      message: 'Account Id must be required',
      error: true,
      status: 400,
    });
    return;
  }
  if (!['account_onboarding', 'account_update'].includes(type)) {
    res.status(400).json({
      message:
        'Invalid type, must be either account_onboarding or account_update',
      error: true,
      status: 400,
    });
    return;
  }
  try {
    console.log(type);

    const accountLinks = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: 'https://vita-abe0f.web.app/reauth',
      return_url: 'https://vita-abe0f.web.app/return',
      type: 'account_onboarding',
    });
    res.json({url: accountLinks.url});
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Unable to create account link',
      error: true,
      data: error,
    });
  }
};

const verifyAccountStatus = async (req: Request, res: Response) => {
  const {userId} = req.query;
  const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

  try {
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({
        status: 400,
        message: 'User Id must be required',
        error: true,
      });
      return;
    }

    const accountIdRef = await db
      .ref(`${serverType}/stripeAccounts/${userId}/stripeAccountId`)
      .once('value');
    if (!accountIdRef.exists()) {
      res.status(404).json({
        message: 'Account Id not found.',
        error: true,
        status: 404,
      });
      return;
    }

    const accountId = accountIdRef.val();
    // Fetch the Stripe account details
    const account = await stripe.accounts.retrieve(accountId);

    // Check if the account is fully set up
    if (account.details_submitted && account.charges_enabled) {
      res.json({
        status: 200,
        message: 'Account is fully set up and ready to accept payments',
        account,
        isFullSetup: true,
      });
    } else {
      res.json({
        status: 200,
        message: 'Account is not fully set up yet',
        account,
        isFullSetup: false,
      });
    }
  } catch (error) {
    console.error('Error verifying account status:', error);
    res.status(500).json({
      status: 500,
      message: 'Unable to verify account status',
      error: true,
    });
  }
};

const getStripeAccountData = async (req: Request, res: Response) => {
  const {userId} = req.query;
  const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

  try {
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({
        message: 'User Id must be required',
        error: true,
        status: 400,
      });
      return;
    }

    const accountIdRef = await db
      .ref(`${serverType}/stripeAccounts/${userId}/stripeAccountId`)
      .once('value');
    if (!accountIdRef.exists()) {
      res.status(404).json({
        message: 'Account Id not found.',
        error: true,
        status: 404,
      });
      return;
    }

    const accountId = accountIdRef.val();
    const account = await stripe.accounts.retrieve(accountId);
    res.json(account);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Unable to fetch Stripe account data',
      error: true,
    });
  }
};

const deleteConnectAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {accountId, uid} = req.body;
  const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

  try {
    if (!accountId || typeof accountId !== 'string' || !uid) {
      throwError({
        status: 400,
        message: 'Invalid or missing accountId parameter',
      });
      return;
    }

    const deletion = await stripe.accounts.del(accountId);

    await db
      .ref(`${serverType}/stripeAccounts/${uid}/stripeAccountId`)
      .update(undefined);
    res.json(deletion);
  } catch (error) {
    next(error);
  }
};

const deleteAllConnectAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await stripe.accounts.list({limit: 100});

    const deletionResults = await Promise.all(
      accounts.data.map(async account => {
        try {
          await stripe.accounts.del(account.id);
          return {accountId: account.id, deleted: true};
        } catch (err: any) {
          return {
            accountId: account.id,
            deleted: false,
            error: err.message,
          };
        }
      }),
    );

    res.json({
      status: 200,
      message: 'Stripe Connect accounts deletion process completed',
      results: deletionResults,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Unable to delete Stripe Connect accounts',
      error: true,
    });
  }
};

export {
  createConnectAccount,
  createAccountLink,
  verifyAccountStatus,
  getStripeAccountData,
  deleteConnectAccount,
  deleteAllConnectAccounts,
};
