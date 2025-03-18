import {Request, Response, NextFunction} from 'express';
import {fbApp} from '../services/firebase';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const server_type = req?.headers?.server_type as string;

  if (
    [
      '/auth/login-token-generator1',
      '/stripe/stripe-account-webhook',
      '/stripe/stripe-payment-webhook',
      '/stripe/stripe-payout-webhook',
      '/auth/account-deletion',
    ].includes(req?.path)
  ) {
    next();
    return;
  }

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized',
      error: true,
    });
    return;
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await fbApp.auth().verifyIdToken(idToken);
    (req as any).user = decodedIdToken;
    console.log({server_type});

    if (!['LIVE', 'STAGING', 'DEVELOPMENT'].includes(server_type)) {
      res.status(400).json({
        status: 400,
        message: `Server type not found`,
        error: true,
      });
      return;
    }

    next();
  } catch (e) {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized',
      error: true,
    });
  }
};
