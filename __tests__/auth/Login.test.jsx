import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Login from 'src/screens/auth/Login/Login';
import useLogin from '../../src/screens/auth/Login/useLogin';

jest.mock('../useLogin');

describe('Login Component', () => {
  let mockUseLogin;

  beforeEach(() => {
    mockUseLogin = {
      formik: {
        values: {email: '', password: ''},
        errors: {},
        touched: {},
        submitForm: jest.fn(),
        handleChange: jest.fn(),
        setFieldValue: jest.fn(),
      },
      navSignUp: jest.fn(),
      navForgot: jest.fn(),
      fetching: false,
    };

    useLogin.mockReturnValue(mockUseLogin);
  });

  it('should render input fields and buttons', () => {
    const {getByPlaceholderText, getByText} = render(<Login />);

    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Log In')).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
  });

  it('should update email field when typed', () => {
    const {getByPlaceholderText} = render(<Login />);
    const emailInput = getByPlaceholderText('Enter your email');

    fireEvent.changeText(emailInput, 'test@gmail.com');

    expect(mockUseLogin.formik.setFieldValue).toHaveBeenCalledWith(
      'email',
      'test@gmail.com',
    );
  });

  it('should update password field when typed', () => {
    const {getByPlaceholderText} = render(<Login />);
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(passwordInput, 'password123');

    expect(mockUseLogin.formik.handleChange).toHaveBeenCalledWith('password');
  });

  it('should call submitForm when login button is pressed', () => {
    const {getByText} = render(<Login />);
    const loginButton = getByText('Log In');

    fireEvent.press(loginButton);

    expect(mockUseLogin.formik.submitForm).toHaveBeenCalled();
  });

  it('should navigate to Forgot Password when forgot password is clicked', () => {
    const {getByText} = render(<Login />);
    const forgotPasswordButton = getByText('Forgot Password?');

    fireEvent.press(forgotPasswordButton);

    expect(mockUseLogin.navForgot).toHaveBeenCalled();
  });

  it('should navigate to Sign Up when sign-up is clicked', () => {
    const {getByText} = render(<Login />);
    const signUpButton = getByText('Sign Up');

    fireEvent.press(signUpButton);

    expect(mockUseLogin.navSignUp).toHaveBeenCalled();
  });

  it('should display error message if email is empty', async () => {
    mockUseLogin.formik.errors.email = 'Email is required';
    mockUseLogin.formik.touched.email = true;

    const {getByText} = render(<Login />);

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });
});
