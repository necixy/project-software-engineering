import {Router} from 'express';
import {
  createAccountLink,
  createConnectAccount,
  deleteAllConnectAccounts,
  deleteConnectAccount,
  getStripeAccountData,
  verifyAccountStatus,
} from '../services/stripe/account';
import {createCustomer} from '../services/stripe/customer';
import {createSetupIntent, getSavedCards} from '../services/stripe/cards';
import {
  changeBookingStatus,
  createPaymentIntent,
  schedulePayouts,
  updatePayoutSchedule,
} from '../services/stripe/payment';
import {
  getAccountWebhook,
  getPaymentWebhook,
  getPayoutWebhook,
} from '../services/stripe/webhook';
import {
  getAccountTransactions,
  getConnectedAccountTransactions,
} from '../services/stripe/transactions';
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '../services/stripe/product';

const router = Router();

router.post('/create-connect-account', createConnectAccount);
router.post('/create-account-link', createAccountLink);
router.get('/verify-account-status', verifyAccountStatus);
router.get('/get-stripe-account-data', getStripeAccountData);
router.delete('/delete-connect-account', deleteConnectAccount);
router.delete('/delete-all-connect-accounts', deleteAllConnectAccounts);
router.post('/create-customer', createCustomer);
router.post('/create-setup-intent', createSetupIntent);
router.get('/saved-cards', getSavedCards);

router.post('/schedule-payout', schedulePayouts);

router.post('/create-payment-intent', createPaymentIntent);
router.post('/dashboard-amount-details', getConnectedAccountTransactions);
router.get('/transactions', getAccountTransactions);
router.post('/update-payout-date', updatePayoutSchedule);

router.post('/booking-status-update', changeBookingStatus);

router.post('/stripe-account-webhook', getAccountWebhook);
router.post('/stripe-payment-webhook', getPaymentWebhook);
router.post('/stripe-payout-webhook', getPayoutWebhook);

router.post("'/create-product'", createProduct);
router.put('/update-product/:id', updateProduct);
router.delete("/delete-product/:id'", deleteProduct);

export default router;
