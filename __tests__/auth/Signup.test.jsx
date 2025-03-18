import {renderHook, act} from '@testing-library/react-hooks';
import useSignUp from '../../src/screens/auth/signup/useSignUp';

import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {signup} from 'src/firebase/auth/auth';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key, callback) => callback(null, 'en')),
}));

jest.mock('src/shared/components/modalProvider/ModalProvider', () => ({
  showModal: jest.fn(),
}));

jest.mock('src/firebase/auth/auth', () => ({
  signup: jest.fn(),
}));

jest.mock('src/utils/useFirebase/useFirebase', () => ({
  databaseRef: jest.fn(() => ({
    orderByChild: jest.fn().mockReturnThis(),
    equalTo: jest.fn().mockReturnThis(),
    once: jest.fn(() => Promise.resolve({exists: () => false})),
    set: jest.fn(),
  })),
}));

describe('useSignUp Hook', () => {
  it('should initialize with default values', async () => {
    const {result} = renderHook(() => useSignUp());

    expect(result.current.formik.initialValues).toEqual({
      username: __DEV__ ? 'prouser' : '',
      email: __DEV__ ? 'proUser@mailinator.com' : '',
      password: __DEV__ ? 'Qwerty1234@' : '',
      confirmPassword: __DEV__ ? 'Qwerty1234@' : '',
      termsAccepted: __DEV__,
    });
    expect(result.current.fetching).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.isTermAndCondition).toBe(false);
  });

  it('should check for unique username', async () => {
    const {result} = renderHook(() => useSignUp());

    await act(async () => {
      const isUnique = await result.current.checkUniqueUsername('testuser');
      expect(isUnique).toBe(true);
    });
  });

  it('should handle signup success', async () => {
    signup.mockResolvedValue({
      user: {
        uid: '12345',
        sendEmailVerification: jest.fn(),
        emailVerified: false,
        email: 'test@mail.com',
        photoURL: '',
      },
    });

    const {result} = renderHook(() => useSignUp());

    await act(async () => {
      await result.current.formik.handleSubmit();
    });

    expect(signup).toHaveBeenCalled();
    expect(databaseRef().set).toHaveBeenCalledWith({
      displayName: 'prouser',
      email: 'test@mail.com',
      emailVerified: false,
      photoURL: '',
      isFollowing: [],
      followers: [],
      isPro: false,
      uid: '12345',
    });
  });

  it('should show error if username is not unique', async () => {
    databaseRef().once.mockResolvedValue({exists: () => true});
    const {result} = renderHook(() => useSignUp());

    await act(async () => {
      await result.current.formik.handleSubmit();
    });

    expect(showModal).toHaveBeenCalledWith({
      type: 'error',
      message: expect.any(String),
    });
  });

  it('should show error for email already in use', async () => {
    signup.mockRejectedValue({code: 'auth/email-already-in-use'});

    const {result} = renderHook(() => useSignUp());

    await act(async () => {
      await result.current.formik.handleSubmit();
    });

    expect(showModal).toHaveBeenCalledWith({
      type: 'error',
      message: expect.any(String),
    });
  });
});
