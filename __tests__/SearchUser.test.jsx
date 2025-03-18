// __tests__/useAlgoliaApi.test.js
import {renderHook, act} from '@testing-library/react-hooks';
import useAlgoliaApi from '../useAlgoliaApi';
import {useDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {axiosInstance} from 'src/api/root_api/axiosInstance.service';
import {setInitial} from 'src/redux/reducer/searchFilterReducer';

// Mock dependencies
jest.mock('src/redux/reducer/reducer', () => ({
  useDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('src/api/root_api/axiosInstance.service', () => ({
  axiosInstance: {
    post: jest.fn(),
  },
}));

jest.mock('src/redux/reducer/searchFilterReducer', () => ({
  setInitial: jest.fn(),
}));

describe('useAlgoliaApi Hook', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useAppSelector.mockImplementation(selector =>
      selector({
        serverReducer: {baseUrl: {serverType: 'LIVE'}},
        userReducer: {userDetails: {uid: 'test-uid'}},
        searchFilterReducer: {
          location: ['All'],
          availability: {availabilityArray: [], availabilityTimeArray: []},
          grade: 'All',
          price: 'All',
          category: ['All'],
          sortBy: '',
        },
      }),
    );
    axiosInstance.post.mockClear();
    mockDispatch.mockClear();
    jest.clearAllMocks();
  });

  // Test 1: Initial State and Setup
  it('initializes with correct default states', () => {
    const {result} = renderHook(() => useAlgoliaApi());

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.page).toBe(0);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.error).toBeNull();
    expect(result.current.hasSearched).toBe(false);
  });

  // Test 2: Initial Search on Mount
  it('performs initial search on mount', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {data: [], totalPages: 1},
    });

    await act(async () => {
      renderHook(() => useAlgoliaApi());
    });

    expect(mockDispatch).toHaveBeenCalledWith(setInitial());
    expect(axiosInstance.post).toHaveBeenCalledWith(
      'algolia/search',
      {},
      expect.objectContaining({
        params: expect.objectContaining({
          search: '',
          page: 0,
          city: '',
        }),
      }),
    );
  });

  // Test 3: Handle Search
  it('handles search correctly', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {data: [{id: 1}], totalPages: 2},
    });

    const {result} = renderHook(() => useAlgoliaApi());

    await act(async () => {
      result.current.setQuery('test');
      await result.current.handleSearch();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.results).toEqual([{id: 1}]);
    expect(result.current.page).toBe(0);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.hasSearched).toBe(true);
  });

  // Test 4: Load More
  it('loads more results correctly', async () => {
    axiosInstance.post
      .mockResolvedValueOnce({data: {data: [{id: 1}], totalPages: 2}})
      .mockResolvedValueOnce({data: {data: [{id: 2}], totalPages: 2}});

    const {result} = renderHook(() => useAlgoliaApi());

    await act(async () => {
      await result.current.handleSearch(); // Page 0
      await result.current.loadMore(); // Page 1
    });

    expect(result.current.results).toEqual([{id: 1}, {id: 2}]);
    expect(result.current.page).toBe(1);
  });

  // Test 5: Prevents Duplicate Load More
  it('prevents load more when already loading or at last page', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {data: [{id: 1}], totalPages: 1},
    });

    const {result} = renderHook(() => useAlgoliaApi());

    await act(async () => {
      await result.current.handleSearch(); // Page 0, totalPages = 1
    });

    await act(async () => {
      await result.current.loadMore(); // Should not trigger as page (0) >= totalPages - 1 (0)
    });

    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
  });

  // Test 6: Filter Generation
  it('generates availability filter string correctly', async () => {
    useAppSelector.mockImplementation(selector =>
      selector({
        serverReducer: {baseUrl: {serverType: 'LIVE'}},
        userReducer: {userDetails: {uid: 'test-uid'}},
        searchFilterReducer: {
          location: ['All'],
          availability: {
            availabilityArray: ['2023-01-01'],
            availabilityTimeArray: ['10:00'],
          },
          grade: 'All',
          price: 'All',
          category: ['All'],
          sortBy: '',
        },
      }),
    );

    const {result} = renderHook(() => useAlgoliaApi());

    expect(result.current.availabilityFilterString).toBe(
      'unbookedTime:2023-01-01-10_00',
    );
  });

  // Test 7: Error Handling
  it('handles search errors correctly', async () => {
    axiosInstance.post.mockRejectedValueOnce(new Error('Network Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const {result} = renderHook(() => useAlgoliaApi());

    await act(async () => {
      result.current.setQuery('test');
      await result.current.handleSearch();
    });

    expect(result.current.error).toBe('Search failed. Please try again.');
    expect(result.current.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error searching:',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  // Test 8: Filter Updates
  it('triggers search on filter changes', async () => {
    axiosInstance.post.mockResolvedValue({data: {data: [], totalPages: 1}});

    const {result, rerender} = renderHook(() => useAlgoliaApi());

    // Change a filter
    useAppSelector.mockImplementation(selector =>
      selector({
        serverReducer: {baseUrl: {serverType: 'LIVE'}},
        userReducer: {userDetails: {uid: 'test-uid'}},
        searchFilterReducer: {
          location: ['New York'],
          availability: {availabilityArray: [], availabilityTimeArray: []},
          grade: 'All',
          price: 'All',
          category: ['All'],
          sortBy: '',
        },
      }),
    );

    await act(async () => {
      rerender();
    });

    expect(axiosInstance.post).toHaveBeenCalledTimes(2); // Initial + filter change
  });
});

// Mock setup file (jest.setup.js)
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});
