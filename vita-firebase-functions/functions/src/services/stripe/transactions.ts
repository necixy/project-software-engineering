import {NextFunction, Request, Response} from 'express';
import Stripe from 'stripe';
import {db} from '../firebase';
const stripe: Stripe = new Stripe(
  `sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0`,
);

// const simulateTransaction = async (accountId) => {
//   try {
//     // Create a test charge
//     const charge = await stripe.charges.create({
//       amount: 1000, // Amount in cents
//       currency: "eur",
//       source: "tok_visa", // Use a test token for successful transactions
//       description: "Test Charge",
//       destination: {
//         account: accountId,
//         amount: 1000,
//       },
//     });

//     console.log("Charge created:", charge);

//     // Retrieve balance information
//     const balance = await stripe.balance.retrieve();
//     console.log("Current Balance:", balance);

//     return charge;
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };
// Type definition for charge object

const getConnectedAccountTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {userId} = req.body;
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

    // Fetch balance
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });

    // Fetch payouts
    const payouts = await fetchTotalPayoutCountAndNextPayoutDate(accountId);

    // Fetch charges (transactions)
    // const charges = await stripe.charges.list({
    //   stripeAccount: accountId,
    // });

    // const charges = await fetchChargesForCurrentMonth(accountId);
    const todayCharges = await fetchChargesAndCalculateTodayBalance(accountId);
    const allCharges = await getAllSucceededCharges(accountId);
    res.json({
      balance,
      todayCharges,
      bookingCount: {
        totalBookings: allCharges.length,
        completedBookings: allCharges?.filter(item => !item?.refunded)?.length,
      },
      payouts,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    next(error);
  }
};

// const fetchChargesForCurrentMonth = async (accountId) => {
//   // Get the current date
//   const now = new Date();

//   // Calculate the start of the month
//   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//   // Convert dates to Unix timestamps (in seconds)
//   const startOfMonthUnix = Math.floor(startOfMonth.getTime() / 1000);
//   const currentDateUnix = Math.floor(now.getTime() / 1000);

//   try {
//     const charges = await stripe.charges.list(
//       {
//         created: {
//           gte: startOfMonthUnix,
//           lte: currentDateUnix,
//         },
//       },
//       {
//         stripeAccount: accountId,
//       }
//     );

//     return charges.data;
//   } catch (error) {
//     console.error("Error fetching charges:", error);
//     throw error;
//   }
// };

const fetchChargesAndCalculateTodayBalance = async accountId => {
  try {
    // Get the current date
    const now = new Date();

    // Set start and end of today in Unix timestamp (in seconds)
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfDayUnix = Math.floor(startOfDay.getTime() / 1000);
    const endOfDayUnix = Math.floor(now.getTime() / 1000) + 86400; // End of day is calculated as start of next day

    // Fetch charges for today
    const charges = await stripe.charges.list(
      {
        created: {
          gte: startOfDayUnix,
          lt: endOfDayUnix,
        },
        limit: 1000000, // Limit to 100 charges (adjust as needed)
        expand: ['data.balance_transaction'], // Expand to get balance transactions
      },
      {stripeAccount: accountId},
    );

    console.log('Charges for today:', JSON.stringify(charges.data));

    let completedBalance = 0;
    let completedCount = 0,
      refundedCount = 0,
      refundedAmount = 0;
    // Calculate today's net earnings (today's balance)
    charges?.data.forEach(charge => {
      if (charge.status === 'succeeded' && !charge.refunded) {
        // completedBalance += charge.amount / 100;
        let netAmount = 0;
        // Check if balance_transaction is an object (expanded)
        if (
          typeof charge.balance_transaction === 'object' &&
          charge.balance_transaction !== null
        ) {
          // Access the fee from the expanded balance_transaction object
          // if (charge.balance_transaction.fee) {
          //   netAmount -= charge.balance_transaction.fee / 100; // Fee is in cents, convert to dollars
          // }
          netAmount = charge?.balance_transaction?.net / 100;
        } else {
          netAmount = charge.amount / 100;
        }
        console.log('netAmount00>', netAmount);

        completedBalance += netAmount;
        completedCount += 1;
      }
      if (charge.refunded) {
        refundedCount += 1;
        refundedAmount += charge.amount / 100;
      }
    });

    // charges?.data.forEach((charge) => {
    //   if (charge.status === "succeeded") {
    //     completedBalance += charge.amount; // Add amount for successful charges
    //     charge.refunds?.data.forEach((refund) => {
    //       completedBalance -= refund.amount; // Subtract refunded amount
    //     });
    //     charge?.fee_details.forEach((fee) => {
    //       if (fee.type === "stripe_fee" && fee.currency === "usd") {
    //         completedBalance -= fee.amount; // Subtract Stripe fee
    //       }
    //     });
    //   }
    // });

    console.log("Today's balance (net earnings):", completedBalance);

    return {refundedCount, completedCount, refundedAmount, completedBalance};
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

async function getAllSucceededCharges(accountId) {
  let allCharges = [];
  let hasMore = true;
  let startingAfter = undefined;

  try {
    while (hasMore) {
      const charges = await stripe.charges.list(
        {
          limit: 100,
          starting_after: startingAfter,
        },
        {
          stripeAccount: accountId,
        },
      );

      // Add the current batch of charges to the accumulated array
      allCharges = allCharges.concat(charges.data);

      // Determine if there are more charges to fetch
      hasMore = charges.has_more;
      startingAfter = charges.data[charges.data.length - 1]?.id;
    }

    console.log('All succeeded charges:', allCharges);
    return allCharges;
  } catch (error) {
    console.error('Error fetching succeeded charges:', error);
    throw error;
  }
}

// async function countTotalPayouts(accountId) {
//   let totalCount = 0;
//   let hasMore = true;
//   let startingAfter = null;

//   while (hasMore) {
//     const response = await stripe.payouts.list(
//       {
//         limit: 100, // maximum limit per request
//         ...(startingAfter ? { starting_after: startingAfter } : {}),
//       },
//       { stripeAccount: accountId }
//     );

//     totalCount += response.data.length;
//     hasMore = response.has_more;
//     if (hasMore) {
//       startingAfter = response.data[response.data.length - 1].id;
//     }
//   }

//   return totalCount;
// }

// async function fetchTotalPayoutCountAndNextPayoutDate(accountId) {
//   let totalCount = 0;
//   let hasMore = true;
//   let startingAfter = null;
//   let nextPayoutDate = null;

//   while (hasMore) {
//     const response = await stripe.payouts.list(
//       {
//         limit: 100, // maximum limit per request
//         ...(startingAfter ? { starting_after: startingAfter } : {}),
//       },
//       { stripeAccount: accountId }
//     );

//     totalCount += response.data.length;

//     // if (response.data.length > 0) {
//     //   // Get the creation date of the latest payout in this batch
//     //   const latestPayoutDate = response.data[response.data.length - 1].created;
//     //   if (!nextPayoutDate || latestPayoutDate > nextPayoutDate) {
//     //     nextPayoutDate = latestPayoutDate;
//     //   }
//     // }

//     hasMore = response.has_more;
//     if (hasMore) {
//       startingAfter = response.data[response.data.length - 1].id;
//     }
//   }

//     // Fetch the upcoming payouts
//     const upcomingPayoutsResponse = await stripe.payouts.listUpcoming({
//         limit: 1, // We only need to know if there is an upcoming payout
//       });

//       const nextPayoutDate = upcomingPayoutsResponse.data.length > 0
//         ? new Date(upcomingPayoutsResponse.data[0].arrival_date * 1000)
//         : null;

//   return {
//     totalCount,
//     nextPayoutDate: nextPayoutDate ? new Date(nextPayoutDate * 1000) : null,
//   };
// }

async function fetchTotalPayoutCountAndNextPayoutDate(accountId) {
  let totalCount = 0;
  let hasMore = true;
  let startingAfter = null;
  let latestPayoutDate = null;

  // Fetch payouts to count them and find the latest payout date
  while (hasMore) {
    const response = await stripe.payouts.list(
      {
        limit: 100, // maximum limit per request
        ...(startingAfter ? {starting_after: startingAfter} : {}),
      },
      {
        stripeAccount: accountId, // Specify the connected account ID
      },
    );

    totalCount += response.data.length;

    if (response.data.length > 0) {
      const lastPayoutDate = response.data[response.data.length - 1].created;
      if (!latestPayoutDate || lastPayoutDate > latestPayoutDate) {
        latestPayoutDate = lastPayoutDate;
      }
    }

    hasMore = response.has_more;
    if (hasMore) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  // Fetch the account settings to determine the payout schedule
  const account = await stripe.accounts.retrieve(accountId);
  const payoutSchedule = account.settings.payouts.schedule;

  let nextPayoutDate = null;
  if (latestPayoutDate && payoutSchedule) {
    // Calculate the next payout date based on the latest payout date and the schedule
    const latestPayout = new Date(latestPayoutDate * 1000);
    if (payoutSchedule.interval === 'daily') {
      nextPayoutDate = new Date(latestPayout);
      nextPayoutDate.setDate(nextPayoutDate.getDate() + 1);
    } else if (payoutSchedule.interval === 'weekly') {
      nextPayoutDate = new Date(latestPayout);
      nextPayoutDate.setDate(nextPayoutDate.getDate() + 7);
    } else if (payoutSchedule.interval === 'monthly') {
      nextPayoutDate = new Date(latestPayout);
      nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 1);
    }
  }

  return {
    totalCount,
    nextPayoutDate,
    latestPayoutDate,
  };
}

interface Charge {
  id: string;
  amount: number;
  currency: string;
  created: number;
  status: string;
}

const getAccountTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {accountId, limit = 10} = req.query;

  if (!accountId || typeof accountId !== 'string') {
    res
      .status(400)
      .json({error: 'Account ID is required and must be a string'});
  }

  let startingAfter: string | null = null;
  let transactions: Charge[] = [];
  try {
    let charges = await getCharges(
      accountId as string,
      startingAfter,
      Number(limit),
    );

    // Paginate through the results
    while (charges.length > 0 && charges.length === Number(limit)) {
      transactions = transactions.concat(charges);
      startingAfter = charges[charges.length - 1].id;

      // Fetch the next page of charges
      charges = await getCharges(
        accountId as string,
        startingAfter,
        Number(limit),
      );
    }

    // Add the last batch of transactions
    transactions = transactions.concat(charges);

    res.status(200).json({
      success: true,
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to fetch charges with pagination
async function getCharges(
  accountId: string,
  startingAfter: string | null = undefined,
  limit: number = 10,
): Promise<Stripe.Charge[]> {
  try {
    const charges = await stripe.charges.list(
      {
        limit,
        starting_after: startingAfter || undefined,
        // starting_after: startingAfter,
      },
      {
        stripeAccount: accountId, // Specify the connected account ID
      },
    );

    return charges.data;
  } catch (error) {
    throw new Error('Error fetching charges: ' + error.message);
  }
}

export {getConnectedAccountTransactions, getAccountTransactions};
