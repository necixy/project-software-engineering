interface loginPayload {
  email: string;
  password: string;
}
interface forgotPayload {
  email: string;
}

// Define custom error types
type FirebaseLoginError =
  | 'auth/invalid-credential'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/too-many-requests';

type FirebaseCreateError = 'auth/email-already-in-use';
