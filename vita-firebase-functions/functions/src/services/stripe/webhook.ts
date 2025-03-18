import {Request, Response} from 'express';
import {db} from '../firebase';
// import { webhookEndpointSecret } from "./stripeAccountKey";
import Stripe from 'stripe';
import moment = require('moment');
import {Timestamp} from 'firebase-admin/firestore';
const stripe: Stripe = new Stripe(
  `sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0`,
);
// Function to get total payments received
const getAccountWebhook = async (request: Request, response: Response) => {
  let event: Stripe.Event;
  try {
    const payload = request.body;
    const payloadString = JSON.stringify(payload, null, 2);
    const secret = 'we_1PSuvf07ZECLJyzZJGLT2WPM';
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (err: any) {
    response.status(400).send({
      message: `Webhook Error: ${err.message}`,
      error: true,
      status: 400,
    });
    return;
  }
  // Handle the event
  switch (event.type) {
    case 'account.updated':
      const accountUpdated = event.data.object;
      const {
        metadata: {serverType, uid},
        default_currency,
      } = accountUpdated ?? {};
      default_currency &&
        (await db
          .ref(`/${serverType}/users/${uid}/default_currency`)
          .set(default_currency));
      console.log({accountUpdated});

      // Then define and call a function to handle the event account.updated
      break;
    case 'account.external_account.created':
      const accountExternalAccountCreated = event.data.object;
      console.log({accountExternalAccountCreated});
      // Then define and call a function to handle the event account.external_account.created
      break;
    case 'account.external_account.deleted':
      const accountExternalAccountDeleted = event.data.object;
      console.log({accountExternalAccountDeleted});
      // Then define and call a function to handle the event account.external_account.deleted
      break;
    case 'account.external_account.updated':
      const accountExternalAccountUpdated = event.data.object;
      console.log({accountExternalAccountUpdated});
      // Then define and call a function to handle the event account.external_account.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

// Function to get total payments received
const getPaymentWebhook = async (request: Request, response: Response) => {
  let event: Stripe.Event;
  try {
    const payload = request.body;
    const payloadString = JSON.stringify(payload, null, 2);
    // const secret =
    //   "whsec_a5499581eb63f20d888ff4e18ccc014aedd674414ab0b985813f297f3fd14e99";
    const secret = 'we_1PVovg07ZECLJyzZpHu3hCwI';
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log('event-->', event.type);

  // Handle the event
  switch (event.type) {
    // case 'charge.captured':
    //   const chargeCaptured = event.data.object;
    //   // Then define and call a function to handle the event charge.captured
    //   break;
    // case 'charge.expired':
    //   const chargeExpired = event.data.object;
    //   // Then define and call a function to handle the event charge.expired
    //   break;
    // case 'charge.failed':
    //   const chargeFailed = event.data.object;
    //   // Then define and call a function to handle the event charge.failed
    //   break;
    // case 'charge.pending':
    //   const chargePending = event.data.object;
    //   // Then define and call a function to handle the event charge.pending
    //   break;
    // case 'charge.refunded':
    //   const chargeRefunded = event.data.object;
    //   // Then define and call a function to handle the event charge.refunded
    //   break;
    case 'charge.succeeded': {
      const chargeSucceeded = event.data.object;

      const paymentIntentId = chargeSucceeded?.payment_intent as string;
      const {
        // customerId,
        //   stripeAccountId,
        //   bookingId,
        clientUserId,
        proUserId,
        serverType = 'LIVE',
      } = chargeSucceeded?.metadata ?? {};

      const bookingDetails = await db
        .ref(`/${serverType}/pendingBooking/${paymentIntentId}`)
        // .orderByChild("paymentIntentId")
        // .startAt(paymentIntentId)
        // .endAt(paymentIntentId)
        .once('value');

      if (bookingDetails?.exists()) {
        let targetBookingDetail = bookingDetails?.val();
        // const bookingId = Object.keys(targetBookingDetail)?.[0];

        if (targetBookingDetail) {
          targetBookingDetail = {
            ...targetBookingDetail,
            paymentStatus: chargeSucceeded?.status,

            // paymentIntent: chargeSucceeded,
          };

          await db
            .ref(`/${serverType}/booking/${paymentIntentId}`)
            .set(targetBookingDetail);
          await db.ref(`/${serverType}/payments/${paymentIntentId}`).set({
            ...chargeSucceeded,
            clientUserId,
            proUserId,
            lastUpdateAt: Math?.floor(
              Timestamp.now().toDate().getTime() / 1000,
            ),
          });
          await db
            .ref(`/${serverType}/bookingTimes/${proUserId}`)
            ?.orderByChild(`date`)
            ?.equalTo(
              moment(targetBookingDetail?.orderDate?.date).format('YYYY-MM-DD'),
            )
            ?.once('value', async snapshot => {
              let bookedData = snapshot.val()
                ? Object.entries(snapshot.val()).map(([key, value]) => {
                    return Object.assign({key}, value);
                  })
                : [];
              // snapshot.val()
              //   ? Object.entries(snapshot.val()).map(([key, value]) => ({
              //       key,
              //       ...value,
              //     }))
              //   : null;
              let bookedTimesList:
                | any
                | {
                    key: string;
                    createdAt: number;
                    date: string;
                    status: 'pending' | 'successful';
                    time: string;
                  }[] = bookedData?.filter(
                (item: any) =>
                  item?.time == targetBookingDetail?.orderDate?.time?.[0] ||
                  item?.time == targetBookingDetail?.orderDate?.time,
              );
              // console.log({bookedTimesList, bookedData});

              if (bookedTimesList) {
                // update the particular bookingTimes status from pending to successful
                await db
                  .ref(
                    `/${serverType}/bookingTimes/${proUserId}/${bookedTimesList?.[0]?.key}`,
                  )
                  .update({status: 'successful'});
              }
            });

          await db
            .ref(`/${serverType}/pendingBooking/${paymentIntentId}`)
            .remove();
        }
      } else {
        await db
          .ref(
            `/${serverType}/stripe-payment-reference-not-found/${paymentIntentId}`,
          )
          .set(chargeSucceeded);
      }

      break;
    }

    // case "charge.refund.updated": {
    //   const chargeSucceeded = event.data.object;
    //   const paymentIntentId = chargeSucceeded?.payment_intent as string;
    //   console.log({ paymentIntentId, meta: chargeSucceeded?.metadata });

    //   const { serverType = "LIVE" } = chargeSucceeded?.metadata ?? {};
    //   await db
    //     .ref(`/${serverType}/payments/${paymentIntentId}`)
    //     .update(chargeSucceeded);
    //   break;
    // }

    case 'charge.captured':
    case 'charge.refunded':
    case 'charge.refund.updated':
      const chargeSucceeded = event.data.object;
      const paymentIntentId = chargeSucceeded?.payment_intent as string;
      stripe.paymentIntents;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId,
      );

      console.log('--> ', paymentIntent?.metadata, paymentIntentId);

      const {serverType = 'LIVE', proUserId} = paymentIntent?.metadata ?? {};

      await db.ref(`/${serverType}/payments/${paymentIntentId}`).update({
        ...chargeSucceeded,
        lastUpdateAt: Math?.floor(Timestamp.now().toDate().getTime() / 1000),
      });

      const bookingDetails = await db
        .ref(`/${serverType}/booking/${paymentIntentId}`)
        .once('value');
      if (bookingDetails?.exists()) {
        let targetBookingDetail = bookingDetails?.val();
        await db
          .ref(`/${serverType}/bookingTimes/${proUserId}`)
          ?.orderByChild(`date`)
          ?.equalTo(
            moment(targetBookingDetail?.orderDate?.date).format('YYYY-MM-DD'),
          )
          ?.once('value', async snapshot => {
            let bookedData = snapshot.val()
              ? Object.entries(snapshot.val()).map(([key, value]) => {
                  return Object.assign({key}, value);
                })
              : [];
            // snapshot.val()
            //   ? Object.entries(snapshot.val()).map(([key, value]) => ({
            //       key,
            //       ...value,
            //     }))
            //   : null;
            let bookedTimesList:
              | any
              | {
                  key: string;
                  createdAt: number;
                  date: string;
                  status: 'pending' | 'successful';
                  time: string;
                }[] = bookedData?.filter(
              (item: any) =>
                item?.time == targetBookingDetail?.orderDate?.time?.[0] ||
                item?.time == targetBookingDetail?.orderDate?.time,
            );
            // console.log({bookedTimesList, bookedData});

            if (bookedTimesList) {
              // update the particular bookingTimes status from pending to successful
              await db
                .ref(
                  `/${serverType}/bookingTimes/${proUserId}/${bookedTimesList?.[0]?.key}`,
                )
                .remove();
            }
          });
      }

      //   } else {
      //     await db
      //       .ref(
      //         `/${serverType}/stripe-payment-reference-not-found/${paymentIntentId}`
      //       )
      //       .set(chargeSucceeded);
      //   }

      break;
    // case "charge.succeeded" || "charge.updated" || "charge.failed":
    //   const chargeSucceeded = event.data.object;
    //   const paymentIntentId = chargeSucceeded?.payment_intent as string;
    //   const bookingDetails = await db
    //     .ref(`/${serverType}/booking`)
    //     .orderByChild("paymentIntentId")
    //     .startAt(paymentIntentId)
    //     .endAt(paymentIntentId)
    //     .once("value");

    //   if (bookingDetails?.exists()) {
    //     const targetBookingDetail = bookingDetails?.val();
    //     const bookingId = Object.keys(targetBookingDetail)?.[0];
    //     if (bookingId) {
    //       await db
    //         .ref(`/${serverType}/booking/${bookingId}/paymentStatus`)
    //         .set(chargeSucceeded?.status);
    //       await db
    //         .ref(`/${serverType}/booking/${bookingId}/paymentIntent`)
    //         .set(chargeSucceeded);
    //     } else {
    //       await db
    //         .ref(
    //           `/${serverType}/stripe-payment-reference-not-found/${paymentIntentId}`
    //         )
    //         .set(chargeSucceeded?.status);
    //     }
    //   } else {
    //   }

    // Then define and call a function to handle the event charge.succeeded
    //   break;
    // case "charge.updated":
    //   const chargeUpdated = event.data.object;
    //   // Then define and call a function to handle the event charge.updated
    //   break;
    // case 'charge.dispute.closed':
    //   const chargeDisputeClosed = event.data.object;
    //   // Then define and call a function to handle the event charge.dispute.closed
    //   break;
    // case 'charge.dispute.created':
    //   const chargeDisputeCreated = event.data.object;
    //   // Then define and call a function to handle the event charge.dispute.created
    //   break;
    // case 'charge.dispute.funds_reinstated':
    //   const chargeDisputeFundsReinstated = event.data.object;
    //   // Then define and call a function to handle the event charge.dispute.funds_reinstated
    //   break;
    // case 'charge.dispute.funds_withdrawn':
    //   const chargeDisputeFundsWithdrawn = event.data.object;
    //   // Then define and call a function to handle the event charge.dispute.funds_withdrawn
    //   break;
    // case 'charge.dispute.updated':
    //   const chargeDisputeUpdated = event.data.object;
    //   // Then define and call a function to handle the event charge.dispute.updated
    //   break;
    // case 'charge.refund.updated':
    //   const chargeRefundUpdated = event.data.object;
    //   // Then define and call a function to handle the event charge.refund.updated
    //   break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  //   await db.ref(`/DEVELOPMENT/stripePayment/`).push({
  //     type: event.type,
  //     data: event.data.object,
  //   });

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

// Function to get total payments received
const getPayoutWebhook = async (request: Request, response: Response) => {
  let event: Stripe.Event;
  try {
    const payload = request.body;
    const payloadString = JSON.stringify(payload, null, 2);
    // const secret =
    //   "whsec_a5499581eb63f20d888ff4e18ccc014aedd674414ab0b985813f297f3fd14e99";
    const secret = 'we_1PVovg07ZECLJyzZpHu3hCwI';
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const accountDetails = await stripe.accounts.retrieve(event.account);
  const {uid, serverType} = accountDetails?.metadata ?? {};

  // Handle the event
  switch (event.type) {
    case 'payout.canceled':
    case 'payout.created':
    case 'payout.failed':
    case 'payout.paid':
    case 'payout.reconciliation_completed':
    case 'payout.updated':
      const payoutCanceled = event.data.object;
      const {id} = payoutCanceled;
      await db.ref(`${serverType}/payments/${id}`).update({
        ...payoutCanceled,
        proUserId: uid,
        lastUpdateAt: Math?.floor(Timestamp.now().toDate().getTime() / 1000),
      });

      // Then define and call a function to handle the event payout.canceled
      break;
    // case "payout.created":
    //   const payoutCreated = event.data.object;

    //   // Then define and call a function to handle the event payout.created
    //   break;
    // case "payout.failed":
    //   const payoutFailed = event.data.object;
    //   // Then define and call a function to handle the event payout.failed
    //   break;
    // case "payout.paid":
    //   const payoutPaid = event.data.object;
    //   // Then define and call a function to handle the event payout.paid
    //   break;
    // case "payout.reconciliation_completed":
    //   const payoutReconciliationCompleted = event.data.object;
    //   // Then define and call a function to handle the event payout.reconciliation_completed
    //   break;
    // case "payout.updated":
    //   const payoutUpdated = event.data.object;
    //   // Then define and call a function to handle the event payout.updated
    //   break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log('event-->', event.type);

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

export {getAccountWebhook, getPaymentWebhook, getPayoutWebhook};
