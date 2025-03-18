import {NextFunction, Request, Response} from 'express';
import {throwError} from '../../utils/errorHandler';
import Stripe from 'stripe';
import {db} from '../firebase';
import {log} from 'firebase-functions/logger';
const stripe: Stripe = new Stripe(
  `sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0`,
);
const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {clientUserId, proUserId, menuId, productId, paymentMethodId} =
      req.body;
    const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

    if (
      !clientUserId ||
      !proUserId ||
      !menuId ||
      !productId ||
      !paymentMethodId
    ) {
      throwError({
        message:
          'Client ID, booking id, Pro user ID , payment method ID, product ID and Menu ID must be provided',
        status: 400,
      });
      return;
    }

    const productSnapshot = await db
      .ref(`/${serverType}/menu/${proUserId}/${menuId}/subSection/${productId}`)
      // .orderByChild("subSection")
      // .equalTo(productId)
      .once('value');
    const product = productSnapshot.val();

    if (!product?.servicePrice) {
      throwError({
        message: 'Product price not found!',
        status: 400,
      });
      return;
    }
    const customerStripeSnapshot = await db
      .ref(`/${serverType}/stripeAccounts/${clientUserId}/stripeCustomerId`)
      .once('value');
    const customerUserSnapshot = await db
      .ref(`/${serverType}/users/${clientUserId}`)
      .once('value');
    const customerId = customerStripeSnapshot.val();
    const {displayName: customerDisplayName, email: customEmail} =
      customerUserSnapshot.val();

    if (!customerId) {
      throwError({
        message: 'Customer Id not found.',
        status: 400,
      });
      return;
    }

    const isBookingAvailable = checkBookingTimeAvailable();
    if (!isBookingAvailable) {
      throwError({
        message: 'Booking time slot not available.Its booked already',
        status: 400,
        data: {
          code: 'booking-time-not-available',
        },
      });
    }

    const proUserStripeSnapshot = await db
      .ref(`/${serverType}/stripeAccounts/${proUserId}/stripeAccountId`)
      .once('value');
    const proUserSnapshot = await db
      .ref(`/${serverType}/users/${proUserId}`)
      .once('value');
    const stripeAccountId = proUserStripeSnapshot.val();
    const {default_currency, displayName, email} = proUserSnapshot.val();

    if (!stripeAccountId) {
      throwError({
        message: 'Stripe account Id not found.',
        status: 400,
      });
      return;
    }

    const amount = Number(product?.servicePrice) * 100;
    const platformFeePercentage = 0.07; // 7% platform fee

    log('inside stripe ', {amount});

    const platformFee = Math.round(amount * platformFeePercentage);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: default_currency ?? 'eur',
      customer: customerId,
      payment_method_types: ['card'],
      application_fee_amount: platformFee,
      transfer_data: {
        destination: stripeAccountId,
      },
      payment_method: paymentMethodId,
      capture_method: 'manual',
      metadata: {
        customerId,
        stripeAccountId,
        clientUserId,
        proUserId,
        serverType,
        professionalInfo: JSON.stringify({
          displayName,
          email,
          default_currency,
          uid: proUserId,
        }),
        customerInfo: JSON.stringify({
          displayName: customerDisplayName,
          email: customEmail,
          uid: clientUserId,
        }),
        service: JSON.stringify({
          currency: default_currency,
          id: productId,
          serviceName: product?.serviceName,
          servicePrice: product?.servicePrice,
        }),
      },
      on_behalf_of: stripeAccountId, // Add this line
    });

    // await db
    //   .ref(`/${serverType}/booking/${bookingId}/paymentIntent`)
    //   .set(paymentIntent);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntent,
    });
  } catch (error) {
    console.log('--->');

    next(
      error?.message
        ? error
        : {
            message: 'Unable to create payment intent',
          },
    );
  }
};

const checkBookingTimeAvailable = () => {
  // clientUserId, proUserId, menuId, productId, paymentMethodId
  return new Promise(async (resolve, reject) => {
    if (Math.random()) {
      resolve({
        bookingTime: true,
        message: 'Booking time store successfully.',
      });
    } else {
      const message = {message: 'Booking time slot is already booked'};
      reject(message);
    }
  });
};

const changeBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {bookingId, status, canceledBy} = req.body;
  const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

  if (!['LIVE', 'STAGING', 'DEVELOPMENT'].includes(serverType)) {
    res.status(404).send({
      message: 'Server type not found',
      error: true,
      status: 404,
    });
    return;
  }
  if (!bookingId) {
    res.status(400).json({
      message: 'Booking ID must be required',
      error: true,
      status: 400,
    });
    return;
  }

  if (!['completed', 'canceled'].includes(status)) {
    res.status(404).json({
      message: 'Status not found',
      error: true,
      status: 404,
    });
    return;
  }

  if (status === 'canceled' && !canceledBy) {
    res.status(404).json({
      message: 'Canceled by is required.',
      error: true,
      status: 404,
    });
    return;
  }
  try {
    // const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    const bookingDetails = await db
      .ref(`${serverType}/booking/${bookingId}`)
      .once('value');
    const targetBookingDetail = bookingDetails.val();
    if (!bookingDetails.exists()) {
      res.status(404).json({
        message: 'Booking details not found.',
        error: true,
        status: 404,
      });
      return;
    }

    let changedStatus = {
      clientUserUId_status: `${
        targetBookingDetail?.clientUserUId
      }_${status?.toLocaleLowerCase()}`,
      proUserUId_status: `${
        targetBookingDetail?.proUserUId
      }_${status?.toLocaleLowerCase()}`,
      status: `${status?.toLocaleLowerCase()}`,
      canceledBy: canceledBy ?? null,
    };
    const paymentIntent = await stripe.paymentIntents.retrieve(bookingId);
    if (status === 'completed') {
      if (
        paymentIntent.status === 'requires_confirmation' ||
        paymentIntent.status === 'requires_action'
      ) {
        await stripe.paymentIntents.confirm(bookingId);
      } else if (paymentIntent.status === 'requires_capture') {
        await stripe.paymentIntents.capture(bookingId);
      } else {
        throw new Error(
          `PaymentIntent cannot be confirmed or captured. Current status: ${paymentIntent.status}`,
        );
      }
      //   await stripe.paymentIntents.confirm(bookingId);
    }

    if (status === 'canceled') {
      if (paymentIntent.status !== 'canceled') {
        await stripe.paymentIntents.cancel(bookingId);
      } else {
        throw new Error(
          `PaymentIntent is already canceled. Current status: ${paymentIntent.status}`,
        );
      }
    }

    await db.ref(`${serverType}/booking/${bookingId}`).update(changedStatus);
    res.json({
      message: 'Status change successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// const schedulePayouts = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Get all completed payments for the previous month
//     const startDate = new Date();
//     startDate.setMonth(startDate.getMonth() - 1);
//     startDate.setDate(1);
//     startDate.setHours(0, 0, 0, 0);

//     const endDate = new Date();
//     endDate.setDate(0); // Last day of the previous month
//     endDate.setHours(23, 59, 59, 999);

//     const payments = await stripe.paymentIntents.list({
//       created: {
//         gte: Math.floor(startDate.getTime() / 1000),
//         lte: Math.floor(endDate.getTime() / 1000),
//       },
//       limit: 100,
//     });

//     res.json({ payments });
//     // const payouts = [];

//     // for (const payment of payments.data) {
//     //   const transfer = await stripe.transfers.create({
//     //     amount: payment.amount,
//     //     currency: payment.currency,
//     //     destination: payment.transfer_data.destination as string,
//     //     transfer_group: payment.id,
//     //   });
//     //   payouts.push(transfer);
//     // }

//     console.log("Payouts processed:", payments);
//   } catch (error) {
//     console.error("Error scheduling payouts:", error);
//   }
// };

const schedulePayouts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accountId = req?.body?.accountId as string;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(0); // Last day of the previous month
    endDate.setHours(23, 59, 59, 999);

    let allPayments: Stripe.PaymentIntent[] = [];

    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });

    // const ba = balance?.pending?.map((item) => item?.amount)
    const payoutss = [];

    for (const payment of balance?.pending) {
      const transfer = await stripe.payouts.create(
        {
          amount: payment.amount,
          currency: payment.currency,
          //   destination: payment.transfer_data?.destination as string,
          //   transfer_group: payment.id,
        },
        {
          stripeAccount: accountId,
        },
      );
      payoutss.push(transfer);
    }

    res.json({payoutss, balance});
    return;
    // let hasMore = true;
    // let lastPaymentId: string | undefined = undefined;

    // Fetch all completed payments for the previous month
    // while (hasMore) {
    //   const paymentPage = await stripe.paymentIntents.list(
    //     {
    //       //   created: {
    //       //     gte: Math.floor(startDate.getTime() / 1000),
    //       //     lte: Math.floor(endDate.getTime() / 1000),
    //       //   },
    //       // limit: 100,
    //       starting_after: lastPaymentId,
    //     },
    //     {
    //       stripeAccount: accountId,
    //     }
    //   );

    //   allPayments = allPayments.concat(paymentPage.data);
    //   hasMore = paymentPage.has_more;
    //   if (hasMore) {
    //     lastPaymentId = paymentPage.data[paymentPage.data.length - 1].id;
    //   }
    // }
    // res.json({ allPayments });

    // Process payouts
    const payouts = [];
    for (const payment of allPayments) {
      if (payment.status === 'succeeded') {
        const transfer = await stripe.payouts.create({
          amount: payment.amount,
          currency: payment.currency,
          //   destination: payment.transfer_data?.destination as string,
          //   transfer_group: payment.id,
        });
        payouts.push(transfer);
      }
    }

    console.log('Payouts processed:', payouts);
    res.json({payouts});
  } catch (error) {
    console.error('Error scheduling payouts:', error);
    res.status(500).json({error: error.message});
  }
};

const updatePayoutSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accountId = req?.body?.accountId as string;
    const account = await stripe.accounts.update(accountId, {
      settings: {
        payouts: {
          schedule: {
            interval: 'daily', // You can set this to 'daily', 'weekly', or 'monthly'
            delay_days: 'minimum', // Delay in days before payouts are made
          },
        },
      },
    });

    console.log('Payout schedule updated:', account.settings.payouts.schedule);
    res.json({schedule: account.settings.payouts.schedule});
  } catch (error) {
    console.error('Error updating payout schedule:', error);
    next(error);
  }
};
export {
  createPaymentIntent,
  schedulePayouts,
  changeBookingStatus,
  updatePayoutSchedule,
};
