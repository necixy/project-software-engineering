// __tests__/useBookingCheckout.test.js
import {renderHook, act} from '@testing-library/react-hooks';
import useBookingCheckout from '../useBookingCheckout';
import {useAppSelector} from 'src/redux/reducer/reducer';
import Geolocation from '@react-native-community/geolocation';
import {firebase} from '@react-native-firebase/database';
import {confirmPayment} from '@stripe/stripe-react-native';
import {useTranslation} from 'react-i18next';
import {BackHandler} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {
  createPaymentIntent,
  getSavedCards,
} from 'src/api/stripe/stripeCustomerId/stripeCustomerId';
import {requestLocationPermission} from 'src/screens/newPost/hooks/UsePermission';
import {getCompleteAddressByLatLong} from 'src/screens/viewMap/component/googlePlaceInput/getCompleteAddress';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {sendNotifications} from 'src/api/notification/notification';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import moment from 'moment';

// Mock dependencies
jest.mock('src/redux/reducer/reducer', () => ({
  useAppSelector: jest.fn(),
}));
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));
jest.mock('@react-native-firebase/database', () => ({
  firebase: {
    database: jest.fn(() => ({
      ref: jest.fn(() => ({
        orderByChild: jest.fn(() => ({
          equalTo: jest.fn(() => ({
            once: jest.fn(),
          })),
        })),
        set: jest.fn(),
        remove: jest.fn(),
      })),
      ServerValue: {
        TIMESTAMP: 'timestamp',
      },
    })),
  },
}));
jest.mock('@stripe/stripe-react-native', () => ({
  confirmPayment: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('react-native', () => ({
  BackHandler: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));
jest.mock('react-native-event-listeners', () => ({
  EventRegister: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));
jest.mock('src/api/stripe/stripeCustomerId/stripeCustomerId', () => ({
  createPaymentIntent: jest.fn(),
  getSavedCards: jest.fn(),
}));
jest.mock('src/screens/newPost/hooks/UsePermission', () => ({
  requestLocationPermission: jest.fn(),
}));
jest.mock(
  'src/screens/viewMap/component/googlePlaceInput/getCompleteAddress',
  () => ({
    getCompleteAddressByLatLong: jest.fn(),
  }),
);
jest.mock('src/shared/components/modalProvider/ModalProvider', () => ({
  showModal: jest.fn(),
}));
jest.mock('src/api/notification/notification', () => ({
  sendNotifications: jest.fn(),
}));
jest.mock('src/utils/useStackNavigation/useStackNavigation', () => jest.fn());
jest.mock('moment', () => () => ({
  format: jest.fn(() => 'Monday January 1'),
}));

describe('useBookingCheckout Hook', () => {
  let mockT;
  let mockNavigation;

  beforeEach(() => {
    mockT = jest.fn(key => key);
    useTranslation.mockReturnValue({t: mockT});
    useAppSelector.mockImplementation(selector =>
      selector({
        userReducer: {
          userDetails: {
            uid: 'user123',
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        serverReducer: {baseUrl: {serverType: 'LIVE'}},
      }),
    );
    mockNavigation = {goBack: jest.fn(), popToTop: jest.fn()};
    useStackNavigation.mockReturnValue(mockNavigation);
    Geolocation.getCurrentPosition.mockClear();
    createPaymentIntent.mockClear();
    getSavedCards.mockClear();
    confirmPayment.mockClear();
    showModal.mockClear();
    sendNotifications.mockClear();
    jest.clearAllMocks();
  });

  // Test 1: Initial State
  it('initializes with correct default states', () => {
    const mockData = {
      uid: 'pro123',
      date: [{timestamp: new Date()}],
      time: ['10:00'],
    };
    const {result} = renderHook(() => useBookingCheckout(mockData));

    expect(result.current.bookingDetails).toBe(mockData);
    expect(result.current.bookingTime).toContain('Monday January 1 at');
    expect(result.current.loading).toBe(false);
    expect(result.current.locationLoading).toBe(false);
    expect(result.current.savedCards).toBeUndefined();
    expect(result.current.formik.values).toEqual({
      note: '',
      orderAddress: null,
    });
  });

  // Test 2: Fetches Saved Cards on Mount
  it('fetches saved cards on mount', async () => {
    getSavedCards.mockResolvedValueOnce([{id: 'card1', brand: 'visa'}]);
    await act(async () => {
      renderHook(() =>
        useBookingCheckout({
          uid: 'pro123',
          date: [{timestamp: new Date()}],
          time: ['10:00'],
        }),
      );
    });

    expect(getSavedCards).toHaveBeenCalledWith('user123', 'LIVE');
    expect(sendNotifications).toHaveBeenCalledTimes(0);
  });

  // Test 3: Updates Selected Card When Saved Cards Change
  it('updates selectedCardId when savedCards are fetched', async () => {
    getSavedCards.mockResolvedValueOnce([{id: 'card1', brand: 'visa'}]);
    const {result} = renderHook(() =>
      useBookingCheckout({
        uid: 'pro123',
        date: [{timestamp: new Date()}],
        time: ['10:00'],
      }),
    );

    await act(async () => {
      await Promise.resolve(); // Wait for useEffect
    });

    expect(result.current.cardId.selectedCardId).toEqual({
      id: 'card1',
      brand: 'visa',
    });
  });

  // Test 4: Gets Current Location on Mount
  it('requests current location on mount', async () => {
    requestLocationPermission.mockResolvedValue(true);
    Geolocation.getCurrentPosition.mockImplementation(success =>
      success({coords: {latitude: 40.7128, longitude: -74.006}}),
    );
    getCompleteAddressByLatLong.mockResolvedValue({city: 'New York'});

    const mockMapRef = {current: {animateToRegion: jest.fn()}};
    const {result} = renderHook(() =>
      useBookingCheckout(
        {uid: 'pro123', date: [{timestamp: new Date()}], time: ['10:00']},
        mockMapRef,
      ),
    );

    await act(async () => {
      await Promise.resolve(); // Wait for useEffect
    });

    expect(requestLocationPermission).toHaveBeenCalled();
    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(mockMapRef.current.animateToRegion).toHaveBeenCalled();
    expect(result.current.currentLocation).toEqual({city: 'New York'});
    expect(result.current.formik.values.orderAddress).toEqual({
      city: 'New York',
    });
  });

  // Test 5: Form Submission - Successful Payment
  it('handles successful booking submission', async () => {
    getSavedCards.mockResolvedValueOnce([{id: 'card1', brand: 'visa'}]);
    createPaymentIntent.mockResolvedValueOnce({
      clientSecret: 'secret123',
      paymentIntent: {id: 'pi123'},
    });
    confirmPayment.mockResolvedValueOnce({error: null});
    firebase.database().ref().set.mockResolvedValueOnce(undefined);
    sendNotifications.mockResolvedValueOnce(undefined);

    const {result} = renderHook(() =>
      useBookingCheckout({
        uid: 'pro123',
        date: [{timestamp: new Date(), dateString: '2023-01-01'}],
        time: ['10:00'],
        item: {serviceName: 'Test Service'},
        default_currency: 'USD',
      }),
    );

    await act(async () => {
      result.current.formik.setFieldValue('orderAddress', {city: 'New York'});
      await result.current.formik.submitForm();
    });

    expect(createPaymentIntent).toHaveBeenCalled();
    expect(firebase.database().ref).toHaveBeenCalledWith(
      'pendingBooking/pi123',
    );
    expect(confirmPayment).toHaveBeenCalledWith(
      'secret123',
      expect.any(Object),
    );
    expect(showNotifications).toHaveBeenCalled();
    expect(showModal).toHaveBeenCalledWith({
      message: 'customWords:updatedSuccessfully',
      type: 'success',
    });
    expect(mockNavigation.popToTop).toHaveBeenCalled();
  });

  // Test 6: Form Submission - Payment Error
  it('handles payment confirmation error', async () => {
    getSavedCards.mockResolvedValueOnce([{id: 'card1', brand: 'visa'}]);
    createPaymentIntent.mockResolvedValueOnce({
      clientSecret: 'secret123',
      paymentIntent: {id: 'pi123'},
    });
    confirmPayment.mockResolvedValueOnce({error: {message: 'Payment failed'}});

    const {result} = renderHook(() =>
      useBookingCheckout({
        uid: 'pro123',
        date: [{timestamp: new Date(), dateString: '2023-01-01'}],
        time: ['10:00'],
      }),
    );

    await act(async () => {
      result.current.formik.setFieldValue('orderAddress', {city: 'New York'});
      await result.current.formik.submitForm();
    });

    expect(showModal).toHaveBeenCalledWith({
      message: 'Payment failed',
      type: 'error',
    });
    expect(mockNavigation.popToTop).not.toHaveBeenCalled();
  });

  // Test 7: Remove Pending Booking Times
  it('removes pending booking times correctly', async () => {
    const mockData = {
      uid: 'pro123',
      date: [{dateString: '2023-01-01'}],
      time: ['10:00'],
    };
    firebase
      .database()
      .ref()
      .once.mockImplementation((_, callback) =>
        callback({val: () => ({key1: {date: '2023-01-01', time: '10:00'}})}),
      );
    firebase.database().ref().remove.mockResolvedValueOnce(undefined);

    const {result} = renderHook(() => useBookingCheckout(mockData));

    await act(async () => {
      await result.current.removePendingBookingTimes(mockData);
    });

    expect(firebase.database().ref).toHaveBeenCalledWith('bookingTimes/pro123');
    expect(firebase.database().ref().remove).toHaveBeenCalled();
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  // Test 8: Location Change Event
  it('updates location when event is triggered', async () => {
    const mockMapRef = {current: {animateToRegion: jest.fn()}};
    requestLocationPermission.mockResolvedValue(true);
    const {result} = renderHook(() =>
      useBookingCheckout(
        {uid: 'pro123', date: [{timestamp: new Date()}], time: ['10:00']},
        mockMapRef,
      ),
    );

    await act(async () => {
      EventRegister.addEventListener.mock.calls[0][1]({
        latitude: 40.7128,
        longitude: -74.006,
      });
    });

    expect(result.current.userLocationData).toEqual({
      latitude: 40.7128,
      longitude: -74.006,
    });
    expect(mockMapRef.current.animateToRegion).toHaveBeenCalled();
  });

  // Test 9: Cleanup
  it('cleans up event listeners on unmount', () => {
    const {unmount} = renderHook(() =>
      useBookingCheckout({
        uid: 'pro123',
        date: [{timestamp: new Date()}],
        time: ['10:00'],
      }),
    );
    EventRegister.addEventListener.mockReturnValue('listener123');

    act(() => {
      unmount();
    });

    expect(EventRegister.removeEventListener).toHaveBeenCalledWith(
      'listener123',
    );
  });
});

// Mock setup file (jest.setup.js)
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});
