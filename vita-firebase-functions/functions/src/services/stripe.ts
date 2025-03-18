// import { NextFunction, Request, Response } from "express";
// import Stripe from "stripe";
// import { db } from "./firebase";
// import { throwError } from "../utils/errorHandler";

// const stripe: Stripe = new Stripe(
//   "sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0"
// );
// const webhookEndpointSecret = "we_1PSuvf07ZECLJyzZJGLT2WPM";

// // export

// // export const createStripeCustomer = async (event: any) => {
// //   const { uid: userId, serverType } = event.params;
// //   const userData = event.data.val();

// //   try {
// //     const customer = await stripe.customers.create({
// //       email: userData.email,
// //       name: userData.name,
// //     });

// //     await db
// //       .ref(`/${serverType}/stripeAccounts/${userId}/stripeCustomerId`)
// //       .set(customer.id);
// //     console.log(`Stripe customer created: ${customer.id}`);
// //   } catch (error: any) {
// //     console.error(`Error creating Stripe customer: ${error.message}`);
// //   }
// // };

// export

// export

// // Function to get total payments received
// export const getTotalPaymentsReceived = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const {
//       stripeAccountId,
//       startDate = new Date(),
//       endDate = new Date(),
//     } = req.body as PaymentRequestBody;

//     const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
//     const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

//     const balanceTransactions = await stripe.balanceTransactions.list(
//       {
//         created: {
//           gte: startTimestamp,
//           lte: endTimestamp,
//         },
//       },
//       {
//         stripeAccount: stripeAccountId,
//       }
//     );

//     let totalReceived = 0;
//     balanceTransactions.data.forEach((transaction) => {
//       if (transaction.type === "payment") {
//         totalReceived += transaction.amount;
//       }
//     });

//     res.json({ totalReceived: totalReceived / 100, balanceTransactions });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getConnectedAccountTransactions = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { accountId } = req?.body;
//     // Fetch balance
//     const balance = await stripe.balance.retrieve({
//       stripeAccount: accountId,
//     });

//     // Fetch payouts
//     const payouts = await stripe.payouts.list({
//       stripeAccount: accountId,
//     });

//     // Fetch charges (transactions)
//     const charges = await stripe.charges.list({
//       stripeAccount: accountId,
//     });

//     res.json({ balance, payouts, charges });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     next(error);
//   }
// };
