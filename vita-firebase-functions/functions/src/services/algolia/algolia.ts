// import { DatabaseEvent, onValueWritten } from 'firebase-functions/v2/database';
import {algoliasearch} from 'algoliasearch';
// import { Change } from 'firebase-functions/v2';
// import { DataSnapshot } from 'firebase-admin/database';
import {db} from '../firebase';
import {Request, Response} from 'express';
// import { logger } from 'firebase-functions/v2';
import {error, log} from 'firebase-functions/logger';
// Set up Algolia client
const appID = '283W8ZE4TM';
const apiKey = '731eb16d98dcf3a4dc6b520c85cda7fd';
const indexNamePreFix = 'Vita-';
const client = algoliasearch(appID, apiKey);

// Cloud Function to sync user data to Algolia
// const syncUserToAlgoliaFn = onValueWritten(
//   '{serverType}/users/{uid}/proPersonalInfo',
//   async (
//     event: DatabaseEvent<Change<DataSnapshot>, Record<string, string>>,
//   ) => {
//     const {params, data} = event;
//     const {serverType, uid} = params;

//     if (!data.after.exists()) {
//       // Handle deletion
//       try {
//         await client.deleteObject({
//           indexName,
//           objectID: `${serverType}_${uid}`,
//         });
//         log(`User ${uid} removed from Algolia.`);
//       } catch (error) {
//         error(`Error removing user ${uid} from Algolia:`, error);
//       }
//       return;
//     }

//     // Handle creation or update
//     const userData = data.after.val();
//     if (!userData) {
//       error(`No user data found at path ${serverType}/users/${uid}`);
//       return;
//     }

//     const algoliaObject = {
//       objectID: `${serverType}_${uid}`, // Unique ID for Algolia
//       username: userData.username || '',
//       bio: userData.bio || '',
//       serviceName: userData.serviceName || '',
//     };

//     try {
//       // Add or update record in Algolia
//       const {taskID} = await client.saveObject({
//         indexName,
//         body: algoliaObject,
//       });
//       // Wait for the indexing task to complete
//       await client.waitForTask({indexName, taskID});
//       log(`User ${uid} synced to Algolia successfully.`);
//     } catch (error) {
//       error(`Error syncing user ${uid} to Algolia:`, error);
//     }
//   },
// );

// Function to sync Pro users to Algolia
const syncProUsersToAlgolia = async (event: any) => {
  const {serverType, uid: userId} = event.params;
  const user = event.data.after.val();
  // try {
  //   // const user = event.data;
  //   log(user, 'allUsers', serverType, userId)
  // }
  // catch (err) {
  //   error(err)
  // }
  // Allow only POST requests
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ error: 'Method Not Allowed' });
  // }
  // const serverType = (req?.headers?.server_type as string) ?? 'LIVE';

  let indexName = indexNamePreFix + serverType;

  // const ref = db.ref(`${serverType}/users`); // Reference to the Firebase path containing user data

  try {
    // Fetch all user data from Firebase
    // const snapshot = await ref.once('value');
    // const allUsers = snapshot.val();

    if (!user) {
      log('No users found in the database.');
      return;
    }

    // Prepare user data for Algolia
    const records = [];
    let profession = user?.profession
      ? user?.profession?.replace(/ /g, '_')
      : null;
    // Only include users where `isPro` is true
    if (user.isPro && user.proPersonalInfo) {
      records.push({
        objectID: userId, // Unique ID for Algolia
        uid: userId, // Unique ID for users
        displayName: user.displayName || '',
        firstName: user.proPersonalInfo.first_name || '',
        lastName: user.proPersonalInfo.last_name || '',
        address: user?.location?.city
          ? {city: user?.location?.city}
          : user.proPersonalInfo.address || {},
        frontImage: user?.frontImage,
        photoURL: user?.photoURL,
        bio: user?.bio,
        rating: Number(user?.rating),
        price: Number(user?.price),
        profession,
        default_currency: user?.default_currency,
      });
    }

    if (records.length === 0) {
      log('No Pro users found to sync.');
      return;
    }

    // Save all records to Algolia
    for (let i = 0; i < records.length; i++) {
      await client.addOrUpdateObject({
        indexName: indexName,
        objectID: records[i].objectID,
        body: records[0],
      });
    }

    // Wait for all tasks to complete using Promise.all
    // const taskPromises = responses.map(response =>
    //   client.waitForTask({
    //     indexName,
    //     taskID: response.taskID,
    //   }),
    // );

    // Wait for all indexing tasks to finish
    // await Promise.all(taskPromises);

    // Wait for the indexing task to complete

    log(`Successfully synced ${records.length} Pro users to Algolia.`);

    // return res.status(200).json({
    //   message: `Successfully synced ${records.length} Pro users to Algolia.`,
    // });
  } catch (err) {
    error('Error syncing Pro users to Algolia:', err);
    // return res.status(500).json({ error: 'Failed to sync users to Algolia.' });
  }
};

// Define the search function
const searchWithAlgolia = async (req: Request, res: Response) => {
  const serverType = (req?.headers?.server_type as string) ?? 'LIVE';
  const uid = req?.query?.uid;
  const sortBy = req.query.sortBy;
  const indexName = indexNamePreFix + serverType + sortBy;
  const searchQuery = (req.query.search as string) || '';
  const rating = req.query.rating;
  const price = req.query.price;
  const category = req.query.category;
  const page = parseInt(req.query.page as string, 10) || 0; // Default to page 0
  const hitsPerPage = 15; // Number of results per page
  const cityFilter = req.query.city as string | string[]; // Optional city filter
  const availabilityFilter = req.query.availability as string; // Optional availability filter

  // log(availabilityFilter, 'availability');

  let filters = '';

  // Handle city filters
  if (cityFilter) {
    const cityFilters = Array.isArray(cityFilter)
      ? cityFilter.map(city => `address.city:${city}`).join(' OR ')
      : `address.city:${cityFilter}`;
    filters += `(${cityFilters})`; // Wrap city filters in parentheses
  }

  // Handle availability filter
  if (availabilityFilter) {
    filters +=
      filters.length > 0
        ? ` AND (${availabilityFilter})`
        : `${availabilityFilter}`;
  }
  if (category) {
    filters += filters.length > 0 ? ` AND (${category})` : `${category}`;
  }

  if (rating) {
    filters +=
      filters.length > 0
        ? ` AND (rating>= ${rating[0]} AND rating <= ${rating[1]})`
        : `rating>= ${rating[0]} AND rating <= ${rating[1]}`;
  }
  if (price) {
    filters +=
      filters.length > 0
        ? ` AND (price>= ${price[0]} AND price <= ${price[1]})`
        : `price>= ${price[0]} AND price <= ${price[1]}`;
  }
  const blockedFilters = `NOT objectID: ${uid}`;
  filters = filters ? `${filters} AND ${blockedFilters}` : blockedFilters;

  try {
    const results: any = await client.search({
      requests: [
        {
          indexName,
          query: searchQuery,
          page,
          hitsPerPage,
          filters,
        },
      ],
    });

    const hits = results.results?.[0]?.hits;
    const totalHits = results.results?.[0]?.nbHits || 0;
    const totalPages = results.results?.[0]?.nbPages || 0;
    res.status(200).json({
      success: true,
      data: hits,
      totalHits,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    error('Error performing search with Algolia:', err);
    res.status(500).json({success: false, error: 'Search failed'});
  }
};

const syncAvailabilityToAlgolia = async event => {
  const {serverType, uid} = event.params;

  // Construct index name based on server type
  const indexName = indexNamePreFix + serverType;

  // References to specific user's availability and booking times
  const availabilityRef = db.ref(`${serverType}/availability/${uid}`);
  const bookingTimesRef = db.ref(`${serverType}/bookingTimes/${uid}`);

  try {
    // Fetch specific user's availability and booking times
    const [availabilitySnapshot, bookingTimesSnapshot] = await Promise.all([
      availabilityRef.once('value'),
      bookingTimesRef.once('value'),
    ]);

    const userAvailability = availabilitySnapshot.val();
    const userBookingTimes = bookingTimesSnapshot.val();

    if (!userAvailability) {
      log(`No availability found for user: ${uid}`);
      return;
    }

    // Process booked times
    const bookedTimesForUser = userBookingTimes
      ? Object.values(userBookingTimes).map(
          (booking: {date: string; time: string}) =>
            `${booking.date}-${booking.time.replace(/:/g, '_')}`,
        )
      : [];

    // Process available slots
    const allAvailableSlotsForUser = Object.keys(userAvailability)
      .flatMap(date =>
        userAvailability[date].map(
          time => `${date}-${time.replace(/:/g, '_')}`,
        ),
      )
      .flat();

    // Calculate unbooked slots
    const unBookedSlotsForUser = allAvailableSlotsForUser.filter(
      slot => !bookedTimesForUser.includes(slot),
    );

    // Prepare the record for Algolia
    const record = {
      objectID: uid,
      unbookedTime: unBookedSlotsForUser,
    };

    // Update Algolia index for the specific user
    await client.partialUpdateObject({
      indexName,
      objectID: record.objectID,
      createIfNotExists: true,
      attributesToUpdate: record,
    });

    log(`Successfully synced availability for user: ${uid}`);
  } catch (err) {
    error(`Error syncing availability for user: ${uid}`, err);
  }
};

export {syncProUsersToAlgolia, searchWithAlgolia, syncAvailabilityToAlgolia};
