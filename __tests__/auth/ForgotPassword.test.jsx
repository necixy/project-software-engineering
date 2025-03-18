// __tests__/ForgotPassword.test.js
import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import ForgotPassword, {
  useForgotPassword,
} from '../../src/screens/auth/forgotPassword';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {forgotPassword} from 'src/firebase/auth/auth';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('src/firebase/auth/auth', () => ({
  forgotPassword: jest.fn(),
}));
jest.mock('src/shared/components/modalProvider/ModalProvider', () => ({
  showModal: jest.fn(),
}));
jest.mock('src/redux/reducer/reducer', () => ({
  useAppSelector: jest.fn(),
}));

describe('ForgotPassword Component', () => {
  let mockNavigate;
  let mockT;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockT = jest.fn(key => key);
    useNavigation.mockReturnValue({navigate: mockNavigate});
    useTranslation.mockReturnValue({t: mockT});
    useAppSelector.mockReturnValue('LIVE');
    jest.clearAllMocks();
  });

  // Test 1: Component Rendering
  it('renders correctly', () => {
    const {getByText, getByPlaceholderText} = render(<ForgotPassword />);

    expect(getByText('customWords:troubleLoggingIn')).toBeTruthy();
    expect(getByText('customWords:forgotPasswordLinkMessage')).toBeTruthy();
    expect(getByPlaceholderText('customWords:userNameOrEmail')).toBeTruthy();
    expect(getByText('common:next')).toBeTruthy();
    expect(getByText('common:backToLogIn')).toBeTruthy();
  });

  // Test 2: Email Input and Validation
  it('shows validation error for invalid email', async () => {
    const {getByPlaceholderText, getByText, queryByText} = render(
      <ForgotPassword />,
    );

    const input = getByPlaceholderText('customWords:userNameOrEmail');
    const button = getByText('common:next');

    await act(async () => {
      fireEvent.changeText(input, 'invalid-email');
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(getByText('message:invalidEmail')).toBeTruthy();
    });
  });

  // Test 3: Successful Form Submission
  it('handles successful password reset', async () => {
    forgotPassword.mockResolvedValueOnce({});
    const {getByPlaceholderText, getByText} = render(<ForgotPassword />);

    const input = getByPlaceholderText('customWords:userNameOrEmail');
    const button = getByText('common:next');

    await act(async () => {
      fireEvent.changeText(input, 'test@example.com');
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(showModal).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('LOGIN');
    });
  });

  // Test 4: Back to Login Navigation
  it('navigates back to login when clicked', () => {
    const {getByText} = render(<ForgotPassword />);

    const backButton = getByText('common:backToLogIn');
    fireEvent.press(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('LOGIN');
  });
});

describe('useForgotPassword Hook', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigation.mockReturnValue({navigate: mockNavigate});
    useTranslation.mockReturnValue({t: jest.fn(key => key)});
    useAppSelector.mockReturnValue('LIVE');
    jest.clearAllMocks();
  });

  // Test 5: Email Hiding Function
  it('correctly hides email address', () => {
    const {result} = renderHook(() => useForgotPassword());

    const hiddenEmail = result.current.hideEmail('test@example.com');
    expect(hiddenEmail).toBe('t******t@ex****com');
  });

  // Test 6: Form Validation Schema
  it('validates email correctly', async () => {
    const {result} = renderHook(() => useForgotPassword());

    await expect(
      result.current.formik.validationSchema.validate({email: 'invalid'}),
    ).rejects.toThrow();

    await expect(
      result.current.formik.validationSchema.validate({
        email: 'test@example.com',
      }),
    ).resolves.toBeDefined();
  });

  // Test 7: Loading State
  it('manages loading state during submission', async () => {
    forgotPassword.mockResolvedValueOnce({});
    const {result} = renderHook(() => useForgotPassword());

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      result.current.formik.setFieldValue('email', 'test@example.com');
      await result.current.formik.submitForm();
    });

    expect(forgotPassword).toHaveBeenCalled();
  });

  // Test 8: Error Handling
  it('handles submission errors gracefully', async () => {
    const error = new Error('Auth error');
    forgotPassword.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const {result} = renderHook(() => useForgotPassword());

    await act(async () => {
      result.current.formik.setFieldValue('email', 'test@example.com');
      await result.current.formik.submitForm();
    });

    expect(consoleSpy).toHaveBeenCalledWith('forgot', error);
    expect(result.current.isLoading).toBe(false);
    consoleSpy.mockRestore();
  });
});

// Mock setup file (create as jest.setup.js)
beforeAll(() => {
  jest.mock('src/utils/developmentFunctions', () => ({
    fontSizePixelRatio: jest.fn(() => 16),
  }));

  jest.mock('src/constants/deviceInfo', () => ({
    SCREEN_WIDTH: 375,
  }));
});
