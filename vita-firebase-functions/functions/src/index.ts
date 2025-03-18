import * as express from 'express';
import * as functions from 'firebase-functions/v2';
// import { onValueCreated } from "firebase-functions/v2/database";
// import * as admin from "firebase-admin";
import {authenticate} from './middleware/auth';
import authRoutes from './routes/auth';
import notificationRoutes from './routes/notification';
import stripeRoutes from './routes/stripe';
import algoliaRoutes from './routes/algolia';
// import { createStripeCustomer } from "./services/stripe";
import {errorHandler} from './utils/errorHandler';
// import { getMessaging } from "firebase-admin/messaging";
import {onValueCreated, onValueUpdated} from 'firebase-functions/v2/database';
import {createStripeCustomer} from './services/stripe/customer';
import {
  syncAvailabilityToAlgolia,
  syncProUsersToAlgolia,
} from './services/algolia/algolia';
const cors = require('cors');
// import {algoliasearch} from 'algoliasearch';

// Set up Algolia client
// const appID = '283W8ZE4TM';
// const apiKey = '731eb16d98dcf3a4dc6b520c85cda7fd';
// // const indexName = 'Vita';
// const index = algoliasearch(appID, apiKey);
// import bodyParser = require("body-parser");

const app = express();

// Allow CORS only for your Firebase Hosting domain
const allowedOrigins = [
  'https://vita-abe0f.web.app', // Replace with your actual domain
];
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// Use JSON and URL-encoded parsers for regular routes
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  }),
);
app.use(authenticate);
app.use('/auth', authRoutes);
app.use('/notification', notificationRoutes);
app.use('/stripe', stripeRoutes);
app.use('/algolia', algoliaRoutes);
// app.use('/search', searchRoutes)
app.use(errorHandler);

exports.api = functions.https.onRequest(app);

const createStripeCustomerFn = onValueCreated(
  '{serverType}/users/{uid}',
  createStripeCustomer,
);
const updateToAlgolia = onValueUpdated(
  '{serverType}/users/{uid}',
  syncProUsersToAlgolia,
);
const updateAvailabilityToAlgolia = onValueUpdated(
  '{serverType}/availability/{uid}',
  syncAvailabilityToAlgolia,
);
const updateBookingTimesToAlgolia = onValueUpdated(
  '{serverType}/bookingTimes/{uid}',
  syncAvailabilityToAlgolia,
);
// const createProUserAlgoliaFn = onValueWritten(
//   {ref: '{serverType}/users/{uid}/proPersonalInfo'},
//   syncUserToAlgoliaFn,
// );
// const createAlgoliaData = onValueCreated(
//   '{serverType}/users/{uid}/proPersonalInfo',
//   (event) => {
//     // const data = event.params;
//     const userData = event.data.val();

//     try {
//       // // Define record to save in Algolia
//       // const record = {
//       //   serverType,
//       //   objectID: userId,
//       //   userName: userData.displayName

//       // };
//       // console.log(record, 'record')
//       // Save record to Algolia index
//       return index.saveObject({ indexName: indexName + userData.serverType, body: userData });
//     } catch (error) {
//       console.error("Error adding data to Algolia:", error);
//       throw new Error("Failed to add data to Algolia");

//     }
//   },
// );

export {
  createStripeCustomerFn,
  updateToAlgolia,
  updateAvailabilityToAlgolia,
  updateBookingTimesToAlgolia,
};
