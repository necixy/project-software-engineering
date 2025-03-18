import {AuthStackRouteName} from '../constant/authStackRouteName';

export type AuthStackParam = {
  [AuthStackRouteName.WELCOME]: undefined;
  [AuthStackRouteName.SIGN_UP]: undefined;
  [AuthStackRouteName.LOGIN]: undefined;
  [AuthStackRouteName.WAIT_FOR_VERIFICATION]: undefined;
  [AuthStackRouteName.FORGOT_PASSWORD]: undefined;
  [AuthStackRouteName.NEW_PASSWORD]: undefined;
  [AuthStackRouteName.PDF_VIEWER]: undefined;
};
