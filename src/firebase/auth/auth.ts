import auth from '@react-native-firebase/auth';

const login = (data: loginPayload) =>
  auth().signInWithEmailAndPassword(data?.email, data?.password);

const signup = (data: loginPayload) =>
  auth().createUserWithEmailAndPassword(data?.email, data?.password);

const forgotPassword = (email: string) => auth().sendPasswordResetEmail(email);

export {login, signup, forgotPassword};
