// __tests__/useRequestDetails.test.js
import {renderHook, act} from '@testing-library/react-hooks';
import useRequestDetails from '../useRequestDetails';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {useTranslation} from 'react-i18next';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import updateBookingStatus from '../hooks/updateBookingStatus';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

// Mock dependencies
jest.mock('src/redux/reducer/reducer', () => ({
  useAppSelector: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('src/utils/useFirebase/useFirebase', () => ({
  databaseRef: jest.fn(() => ({
    once: jest.fn(),
    update: jest.fn(),
    orderByChild: jest.fn(() => ({
      equalTo: jest.fn(() => ({
        once: jest.fn(),
      })),
    })),
  })),
}));
jest.mock('src/shared/components/modalProvider/ModalProvider', () => ({
  showModal: jest.fn(),
}));
jest.mock('../hooks/updateBookingStatus', () => jest.fn());
jest.mock('src/utils/useStackNavigation/useStackNavigation', () => jest.fn());
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
  useNavigation: jest.fn(),
}));

describe('useRequestDetails Hook', () => {
  let mockT;
  let mockGoBack;
  let mockPop;

  beforeEach(() => {
    mockT = jest.fn(key => key);
    useTranslation.mockReturnValue({t: mockT});
    mockGoBack = jest.fn();
    mockPop = jest.fn();
    useStackNavigation.mockReturnValue({goBack: mockGoBack, pop: mockPop});
    useAppSelector.mockImplementation(selector =>
      selector({
        userReducer: {
          userDetails: {uid: 'user123', displayName: 'Test User'},
          userType: 'client',
        },
      }),
    );
    databaseRef.mockClear();
    showModal.mockClear();
    updateBookingStatus.mockReturnValue({toUpdateBookings: jest.fn()});
    jest.clearAllMocks();
  });

  // Test 1: Initial State
  it('initializes with correct default states', () => {
    const route = {
      params: {
        headingText: 'Request Details',
        badgeText: 'onHold',
        displayButton: true,
        displayComplete: false,
        displayCancel: true,
        details: {
          id: 'booking123',
          clientUserUId: 'user123',
          proUserUId: 'pro456',
        },
        displayBadge: true,
      },
    };
    const {result} = renderHook(() => useRequestDetails(route));

    expect(result.current.headingText).toBe('Request Details');
    expect(result.current.badgeText).toBe('onHold');
    expect(result.current.displayButton).toBe(true);
    expect(result.current.displayComplete).toBe(false);
    expect(result.current.displayCancel).toBe(true);
    expect(result.current.details).toEqual(route.params.details);
    expect(result.current.bookingDetails).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.modalOpen).toBe(false);
    expect(result.current.missionModalOpen).toBe(false);
    expect(result.current.existingReview).toBeNull();
    expect(result.current.showMap).toBe(false);
  });

  // Test 2: Fetches Other User Details for Client
  it('fetches pro user details when user is client', async () => {
    const route = {
      params: {
        details: {
          id: 'booking123',
          clientUserUId: 'user123',
          proUserUId: 'pro456',
          status: 'requested',
        },
      },
    };
    databaseRef().once.mockImplementation((path, callback) =>
      callback({
        val: () => ({
          displayName: 'Pro User',
          photoURL: 'pro.jpg',
          uid: 'pro456',
        }),
      }),
    );

    const {result} = renderHook(() => useRequestDetails(route));

    await act(async () => {
      await Promise.resolve(); // Wait for useEffect
    });

    expect(databaseRef).toHaveBeenCalledWith('users/pro456');
    expect(result.current.bookingDetails).toMatchObject({
      name: 'Pro User',
      photoUrl: 'pro.jpg',
      userUId: 'pro456',
    });
  });

  // Test 3: Fetches Other User Details for Pro
  it('fetches client user details when user is pro', async () => {
    useAppSelector.mockImplementation(selector =>
      selector({
        userReducer: {
          userDetails: {uid: 'pro456', displayName: 'Pro User'},
          userType: 'pro',
        },
      }),
    );
    const route = {
      params: {
        details: {
          id: 'booking123',
          clientUserUId: 'user123',
          proUserUId: 'pro456',
          status: 'requested',
        },
      },
    };
    databaseRef().once.mockImplementation((path, callback) =>
      callback({
        val: () => ({
          displayName: 'Client User',
          photoURL: 'client.jpg',
          uid: 'user123',
        }),
      }),
    );

    const {result} = renderHook(() => useRequestDetails(route));

    await act(async () => {
      await Promise.resolve(); // Wait for useEffect
    });

    expect(databaseRef).toHaveBeenCalledWith('users/user123');
    expect(result.current.bookingDetails).toMatchObject({
      name: 'Client User',
      photoUrl: 'client.jpg',
      userUId: 'user123',
    });
  });

  // Test 4: Fetches Rating for Completed Booking
  it('fetches existing review for completed booking', async () => {
    const route = {
      params: {
        details: {
          id: 'booking123',
          clientUserUId: 'user123',
          proUserUId: 'pro456',
          status: 'completed',
        },
      },
    };
    databaseRef()
      .once.mockImplementationOnce((path, callback) =>
        callback({val: () => ({})}),
      ) // users
      .mockImplementationOnce((path, callback) =>
        callback({val: () => ({review1: {rating: 5}})}),
      ); // reviews

    const {result} = renderHook(() => useRequestDetails(route));

    await act(async () => {
      await Promise.resolve(); // Wait for useEffect
    });

    expect(databaseRef).toHaveBeenCalledWith('reviews');
    expect(result.current.existingReview).toEqual([{rating: 5}]);
  });

  // Test 5: Cancels Booking
  it('cancels booking successfully', async () => {
    const route = {
      params: {
        details: {
          id: 'booking123',
          clientUserUId: 'user123',
          proUserUId: 'pro456',
        },
      },
    };
    databaseRef().update.mockResolvedValueOnce(undefined);

    const {result} = renderHook(() => useRequestDetails(route));

    await act(async () => {
      await result.current.cancelBooking();
    });

    expect(databaseRef).toHaveBeenCalledWith('booking/booking123');
    expect(databaseRef().update).toHaveBeenCalledWith({
      clientUserUId_status: 'user123_canceled',
      proUserUId_status: 'pro456_canceled',
      status: 'canceled',
    });
    expect(showModal).toHaveBeenCalledWith({
      message: 'message:canceledSuccessfully',
      type: 'success',
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  // Test 6: Updates Booking Status
  it('updates booking status via toUpdateBookings', async () => {
    const mockToUpdateBookings = jest.fn().mockResolvedValue(undefined);
    updateBookingStatus.mockReturnValue({
      toUpdateBookings: mockToUpdateBookings,
    });
    const route = {
      params: {
        details: {
          id: 'booking123',
          clientUserUId: 'user123',
          proUserUId: 'pro456',
        },
      },
    };

    const {result} = renderHook(() => useRequestDetails(route));

    await act(async () => {
      await result.current.toUpdateBookings('accepted');
    });

    expect(mockToUpdateBookings).toHaveBeenCalledWith('accepted');
  });

  // Test 7: Handles Error in Fetching Rating
  it('handles error when fetching rating', async () => {
    const route = {
      params: {
        details: {
          id: 'booking123',
          clientUserUId: 'user123',
          proUserUId: 'pro456',
          status: 'completed',
        },
      },
    };
    databaseRef().once.mockRejectedValueOnce(new Error('Fetch error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const {result} = renderHook(() => useRequestDetails(route));

    await act(async () => {
      await Promise.resolve(); // Wait for useEffect
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.existingReview).toBeNull();
    consoleSpy.mockRestore();
  });

  // Test 8: Sets Additional Details Based on Status
  it('sets additional details for requested status', async () => {
    const route = {
      params: {
        details: {
          id: 'booking123',
          clientUserUId: 'user123',
          proUserUId: 'pro456',
          status: 'requested',
        },
      },
    };
    databaseRef().once.mockImplementation((path, callback) =>
      callback({
        val: () => ({
          displayName: 'Pro User',
          photoURL: 'pro.jpg',
          uid: 'pro456',
        }),
      }),
    );

    const {result} = renderHook(() => useRequestDetails(route));

    await act(async () => {
      await result.current.getBookingDetails();
    });

    expect(result.current.additionalDetails.displayCancel).toBe(true);
    expect(result.current.additionalDetails.displayBadge).toBe(true);
  });
});

// Mock setup file (jest.setup.js)
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});
