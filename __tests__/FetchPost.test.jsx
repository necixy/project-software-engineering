// __tests__/useFetchPost.test.js
import {renderHook, act} from '@testing-library/react-hooks';
import useFetchPost from '../useFetchPost';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('react-native', () => ({
  Alert: {alert: jest.fn()},
}));
jest.mock('react-native-event-listeners', () => ({
  EventRegister: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));
jest.mock('src/redux/reducer/reducer', () => ({
  useAppSelector: jest.fn(),
}));
jest.mock('src/utils/useFirebase/useFirebase', () => ({
  databaseRef: jest.fn(() => ({
    once: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  })),
}));
jest.mock('src/utils/useStackNavigation/useStackNavigation', () => jest.fn());

describe('useFetchPost Hook', () => {
  let mockT;

  beforeEach(() => {
    mockT = jest.fn(key => key);
    useTranslation.mockReturnValue({t: mockT});
    useAppSelector.mockImplementation(selector =>
      selector({
        userReducer: {
          userDetails: {uid: 'user123', displayName: 'Test User'},
        },
      }),
    );
    useStackNavigation.mockReturnValue({isFocused: true});
    databaseRef().once.mockReset();
    EventRegister.addEventListener.mockReset();
    Alert.alert.mockReset();
    jest.clearAllMocks();
  });

  // Test 1: Initial State
  it('initializes with correct default states', () => {
    const {result} = renderHook(() => useFetchPost());

    expect(result.current.feedPosts).toEqual([]);
    expect(result.current.renderablePostData).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefetching).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.mostVisibleIndex).toBe(0);
    expect(result.current.viewabilityConfig).toEqual({
      minimumViewTime: 10,
      viewAreaCoveragePercentThreshold: 70,
    });
  });

  // Test 2: Fetches Posts on Mount
  it('fetches posts on mount successfully', async () => {
    databaseRef()
      .once.mockResolvedValueOnce({val: () => ({follow1: true})}) // following
      .mockResolvedValueOnce({val: () => ({displayName: 'User1'})}) // user123
      .mockResolvedValueOnce({val: () => ({displayName: 'Follow1'})}) // follow1
      .mockResolvedValueOnce({val: () => ({post1: 12345})}) // user123 posts
      .mockResolvedValueOnce({val: () => ({post2: 12346})}) // follow1 posts
      .mockResolvedValueOnce({val: () => ({id: 'post1', createdBy: 'user123'})}) // post1
      .mockResolvedValueOnce({
        val: () => ({id: 'post2', createdBy: 'follow1'}),
      }); // post2

    const {result} = renderHook(() => useFetchPost());

    await act(async () => {
      await Promise.resolve(); // Wait for useEffect
    });

    expect(databaseRef).toHaveBeenCalledWith('following/user123');
    expect(result.current.feedPosts).toEqual([
      {id: 'post1', createdBy: 'user123', userDetails: {displayName: 'User1'}},
      {
        id: 'post2',
        createdBy: 'follow1',
        userDetails: {displayName: 'Follow1'},
      },
    ]);
    expect(result.current.isLoading).toBe(false);
  });

  // Test 3: Filters Out Reported Posts
  it('filters out posts reported by the user', async () => {
    databaseRef()
      .once.mockResolvedValueOnce({val: () => ({follow1: true})})
      .mockResolvedValueOnce({val: () => ({displayName: 'User1'})})
      .mockResolvedValueOnce({val: () => ({displayName: 'Follow1'})})
      .mockResolvedValueOnce({val: () => ({post1: 12345})})
      .mockResolvedValueOnce({val: () => ({post2: 12346})})
      .mockResolvedValueOnce({
        val: () => ({
          id: 'post1',
          createdBy: 'user123',
          reportedBy: {user123: true},
        }),
      })
      .mockResolvedValueOnce({
        val: () => ({id: 'post2', createdBy: 'follow1'}),
      });

    const {result} = renderHook(() => useFetchPost());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.feedPosts).toEqual([
      {
        id: 'post2',
        createdBy: 'follow1',
        userDetails: {displayName: 'Follow1'},
      },
    ]);
  });

  // Test 4: Pagination
  it('paginates posts correctly', async () => {
    const posts = Array.from({length: 15}, (_, i) => ({
      id: `post${i}`,
      createdBy: 'user123',
    }));
    databaseRef()
      .once.mockResolvedValueOnce({val: () => ({})})
      .mockResolvedValueOnce({val: () => ({displayName: 'User1'})})
      .mockResolvedValueOnce({val: () => ({post1: 12345, post2: 12346})})
      .mockImplementationOnce(() =>
        Promise.all(posts.map(post => ({val: () => post}))),
      );

    const {result} = renderHook(() => useFetchPost());

    await act(async () => {
      await Promise.resolve(); // Wait for useEffect
    });

    expect(result.current.renderablePostData.length).toBe(10);
    expect(result.current.renderablePostData[9].id).toBe('post9');
  });

  // Test 5: On Refresh
  it('refreshes posts correctly', async () => {
    databaseRef()
      .once.mockResolvedValueOnce({val: () => ({})})
      .mockResolvedValueOnce({val: () => ({displayName: 'User1'})})
      .mockResolvedValueOnce({val: () => ({post1: 12345})})
      .mockResolvedValueOnce({
        val: () => ({id: 'post1', createdBy: 'user123'}),
      });

    const {result} = renderHook(() => useFetchPost());

    await act(async () => {
      await Promise.resolve(); // Initial fetch
      await result.current.onRefresh();
    });

    expect(result.current.isRefetching).toBe(false);
    expect(result.current.feedPosts.length).toBe(1);
  });

  // Test 6: Delete or Report Post Event
  it('handles deleteOrReportPost event', async () => {
    databaseRef()
      .once.mockResolvedValueOnce({val: () => ({})})
      .mockResolvedValueOnce({val: () => ({displayName: 'User1'})})
      .mockResolvedValueOnce({val: () => ({post1: 12345, post2: 12346})})
      .mockResolvedValueOnce({val: () => ({id: 'post1', createdBy: 'user123'})})
      .mockResolvedValueOnce({
        val: () => ({id: 'post2', createdBy: 'user123'}),
      });

    const {result} = renderHook(() => useFetchPost());

    await act(async () => {
      await Promise.resolve(); // Initial fetch
      EventRegister.addEventListener.mock.calls[1][1]({postId: 'post1'});
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'deleteOrReportThePost pro',
      'post1',
    );
    expect(result.current.feedPosts.some(post => post.id === 'post1')).toBe(
      false,
    );
  });

  // Test 7: Upload Post Event
  it('handles uploadPost event', async () => {
    databaseRef()
      .once.mockResolvedValueOnce({val: () => ({})})
      .mockResolvedValueOnce({val: () => ({displayName: 'User1'})})
      .mockResolvedValueOnce({val: () => ({post1: 12345})})
      .mockResolvedValueOnce({
        val: () => ({id: 'post1', createdBy: 'user123'}),
      });

    const {result} = renderHook(() => useFetchPost());

    await act(async () => {
      await Promise.resolve(); // Initial fetch
      EventRegister.addEventListener.mock.calls[2][1]();
    });

    expect(Alert.alert).toHaveBeenCalledWith('uploadPost pro');
    expect(result.current.refetchAgain).toBe(false);
  });

  // Test 8: Error Handling
  it('handles fetch error gracefully', async () => {
    databaseRef().once.mockRejectedValueOnce(new Error('Fetch error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const {result} = renderHook(() => useFetchPost());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isError).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.any(Error),
      'Error fetching posts',
    );
    consoleSpy.mockRestore();
  });

  // Test 9: Viewability Config
  it('updates mostVisibleIndex on viewable items change', () => {
    const {result} = renderHook(() => useFetchPost());

    act(() => {
      result.current.viewabilityConfigCallbackPairs[0].onViewableItemsChanged({
        viewableItems: [{index: 5}],
      });
    });

    expect(result.current.mostVisibleIndex).toBe(5);
  });

  // Test 10: Cleanup
  it('cleans up event listeners on unmount', () => {
    EventRegister.addEventListener
      .mockReturnValueOnce('newPostsListener')
      .mockReturnValueOnce('deleteListener')
      .mockReturnValueOnce('uploadListener');

    const {unmount} = renderHook(() => useFetchPost());

    act(() => {
      unmount();
    });

    expect(EventRegister.removeEventListener).toHaveBeenCalledWith(
      'newPostsListener',
    );
    expect(EventRegister.removeEventListener).toHaveBeenCalledWith(
      'deleteListener',
    );
    expect(EventRegister.removeEventListener).toHaveBeenCalledWith(
      'uploadListener',
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
