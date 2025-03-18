import * as admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

const fbApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "vita-abe0f",
    clientEmail: "firebase-adminsdk-ue2xt@vita-abe0f.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0pWL8IvYMGeYP\nCXTsxJ0YM9tRArCk/AJ9C7+KXbZ+p42XSc4XZmfSCC6n3kdWWYsv26Cy2t6FPhRW\nrVnr/NPxrw5YF0mV29EVs3GQZrvbr8yo9qltRa78fV1vsdPewAJsm8tVPXh9sOiM\nvKtdZxDVOf1u6GiRbhSx4vWGYUyZcOZrvEpcZqvOXGHkYEb4MtknB9WIh2B4R0wl\nJ+Ql1gUokeckuFaBw5mCO3RyGyD2v+RjEJprcz3kWUETXsLJFSpCI/3EqTuBX1CW\nmPNCLtHhOoDhVsCTuoG7/s5d8lFremCepSydRPrRJ0znq1g3fdD5yj8AZNV+frkJ\nFEdoNTh7AgMBAAECggEAJa5sB+kpBtwuI4vW8n6OwFos0OitPTT+NeRJ94xVwXSk\n8d5o2XO4i1S+mrCgk9AI2xpGmphSG1wYNP5jB/lMopjf9psg89wO8KZmNXdgj1JL\n8CDHta338t4Zq+9doRTPTKVw1B6G8D0DPTwryMdzeO7oQQbErTVXpsWPbpEEP+s1\nsMTLrrIm3KMLXDRiVDGw/2iTB37Iz/pqODywSI0gVeivzxU9AtX1tQ2RFIlaTCV3\nbSBm/I92xwKbTybGrurxhxJg4iIzBoZ23W1WBY3hGGlscLBPjqYQKbI8TrehkA9A\nv5pc4tPJW0ochwMvY7UWpHwulXOroxUDj/8TFe8H8QKBgQDghdBm7K0+K76o+ey/\nwL2JVrFgQCkVT/ikokWO4IWSCnpzwcMHc1C+dpvOvOTbxbJcyFH6Cpd3kyCns3iY\ny0IusQ19wCcEw+7AT+vWwT0NBnOKVlrcV6OmLlFjFTsXyVJiTMJ3/UTOpOeehC/4\nSG7+szw4MvRuayv2ai2FB4ZkKwKBgQDN+NN4VKO98C7OOzH3W8mFY2n45nhMgpx/\nGyj1o759CrpgTJt5638Ltxi9Srmq5R8aZj+L8GqauPoovVB8j+qNCv1QVv9EIA2r\n1Yb3bWe7xE4a9FMuKH1jdLBZhdvW52tiWZR+ptxWBmmc+H5kO8o6rJk5RI2kb/XR\ncUf8SgDE8QKBgQC4uH9YXrq93sGzRkQpEwsdVk0C0ma6mRwJX1R5E3HxUFukpzKt\nC4vP18eilLh5tDJlsY34eQRbJZoFP1wl4Xym65Yc8p1nh0gDwv1Wp49yCu++TgPd\nKuGCFLNzIIGItWLpaxvIGoCkvvms6jaJQBbJyG7wEcQWoGgACSVAQIuqFwKBgGu2\n4dh+4va0wbWGTXYfoT7Jo6TP2j+g2ni6WmxDip3X22n7Bh/3YQReZ2iuyHQvyFlE\n+ZyUSRvK+sANaScLGE1UXu8B4BLfdGbVjvScWXBfk70S4uEzuYcmggb/Mt2rPoQ7\ndqXZW0b9qYO2jFqczgBrPOIvEKfbCUHTrSKqDMbxAoGBAJMYwUMvSqNpCHjXxajQ\n1DFwd3oP8l/gsIbYGkjEzLGsoJuaIVR4dT6DyBrBjpGFUMQtgDfVu32zRJSIn4yk\nFtySg4O+Lv7frI2xvRPaiMPUCmWbm6XJ44zwT0KizHIUG0gF50xKu9LbW9XyzmJA\n+Dc5JtNTmRZyOVh0KFCXnMZi\n-----END PRIVATE KEY-----\n",
  }),
  databaseURL: "https://vita-abe0f-default-rtdb.firebaseio.com/",
});

const db = fbApp.database();
const messaging = getMessaging(fbApp);

export { db, messaging, fbApp };
