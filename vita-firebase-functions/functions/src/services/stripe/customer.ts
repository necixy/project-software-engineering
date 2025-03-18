import { Request, Response } from "express";
import { db } from "../firebase";
import { throwError } from "../../utils/errorHandler";
import Stripe from "stripe";
// import { addData } from "../algolia/addOrUpdateData";

const stripe: Stripe = new Stripe(
  `sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0`
);
const createCustomer = async (req: Request, res: Response) => {
  const { email, name, uid } = req.body;
  const serverType = (req?.headers?.server_type as string) ?? "LIVE";

  try {
    if (!uid) {
      throwError({
        message: "User Id must be required",
        status: 400,
      });
      return;
    } else if (!email) {
      throwError({
        message: "Email Id is required",
        status: 400,
      });
      return;
    } else if (!["LIVE", "STAGING", "DEVELOPMENT"].includes(serverType)) {
      throwError({
        message: "Server type not found",
        status: 400,
      });

      return;
    }

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email,
      name,
    });
    // Save customer ID to your database (in-memory for this example)
    await db.ref(`${serverType}/stripeCustomerId/${uid}`).set({
      stripeCustomerId: customer.id,
      email: email,
    });
    res.send({ customerId: customer.id });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

const createStripeCustomer = async (event: any) => {
  const { uid: userId, serverType } = event.params;
  const userData = event.data.val();

  try {
    if (userId) {
      await db.ref(`${serverType}/userSettings/${userId}`).set({
        notificationEnabled: true,
        bookingNotification: true,
        messageNotification: true,
      });
    }
    if (!userData.email) {
      await db.ref(`/${serverType}/customerNotCreate/${userId}`).update({
        userData,
        serverType,
      });
      return;
    }
    const customer = await stripe.customers.create({
      email: userData.email,
      name: userData.name,
    });

    await db
      .ref(`/${serverType}/stripeAccounts/${userId}/stripeCustomerId`)
      .set(customer.id);
    // let userName = userData.name
    // // await addData(userId, serverType, userName);
    // await addData({ userId, userName, serverType })
    console.log(`Stripe customer created: ${customer.id}`);
  } catch (error: any) {
    console.error(`Error creating Stripe customer: ${error.message}`);
  }
};

export { createCustomer, createStripeCustomer };
