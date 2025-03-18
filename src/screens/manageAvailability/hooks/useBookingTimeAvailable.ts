import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import database, {firebase} from '@react-native-firebase/database';

export const throwError = (data: any) => {
  throw new Error(JSON.stringify(data));
};

const createPaymentIntent = async (req: any) => {
  try {
    const {
      clientUserId,
      proUserId,
      menuId,
      productId,
      paymentMethodId,
      serverType,
    } = req;

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

    const productSnapshot = await database()
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
    const customerSnapshot = await database()
      .ref(`/${serverType}/stripeAccounts/${clientUserId}/stripeCustomerId`)
      .once('value');
    const customerId = customerSnapshot.val();

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

    const proUserSnapshot = await database()
      .ref(`/${serverType}/stripeAccounts/${proUserId}/stripeAccountId`)
      .once('value');
    const stripeAccountId = proUserSnapshot.val();

    if (!stripeAccountId) {
      throwError({
        message: 'Stripe account Id not found.',
        status: 400,
      });
      return;
    }

    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Number(product?.servicePrice) * 100,
    //   currency: "eur",
    //   customer: customerId,
    //   payment_method_types: ["card"],
    //   transfer_data: {
    //     destination: stripeAccountId,
    //   },
    //   payment_method: paymentMethodId,
    //   capture_method: "manual",
    //   metadata: {
    //     customerId,
    //     stripeAccountId,
    //     clientUserId,
    //     proUserId,
    //     serverType,
    //   },
    // });

    // await db
    //   .ref(`/${serverType}/booking/${bookingId}/paymentIntent`)
    //   .set(paymentIntent);

    return {
      // clientSecret: paymentIntent.client_secret,
      // paymentIntent,
    };
  } catch (error) {
    console.error('--->', error);

    // nexshot(
    //   error?.message
    //     ? error
    //     : {
    //         message: "Unable to create payment intent",
    //       }
    // );
  }
};

const checkBookingTimeAvailable = (
  proUserId: string,
  serverType: 'LIVE' | 'DEVELOPMENT' | 'STAGING',
  orderDate: string,
  orderTime: string | string[],
) => {
  // clientUserId, proUserId, menuId, productId, paymentMethodId
  return new Promise(async (resolve, reject) => {
    // Check booking time is already alloted or not

    let bookingDetails = await databaseRef(
      `/${serverType}/bookingTimes/${proUserId}`,
    ).once('value');
    let bookedTimesAlloted = bookingDetails.val();
    let isOrderTimeAvailable: string[] = bookedTimesAlloted[orderDate] ?? [];
    console.log(
      {isOrderTimeAvailable},
      isOrderTimeAvailable?.includes(orderTime?.[0]),
    );
    if (isOrderTimeAvailable?.includes(orderTime?.[0])) {
      // Booking time allot in this if booking time is not already alloted.

      resolve({
        bookingTime: true,
        message: 'Booking time store successfully.',
      });
    } else {
      // Throw error is already booked this time
      const message = {message: 'Booking time slot is already booked'};
      reject(message);
    }
  });
};
