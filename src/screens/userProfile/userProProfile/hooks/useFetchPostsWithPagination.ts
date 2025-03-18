import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useEffect, useRef, useState} from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase'; // Adjust this import as per your project structure
const PAGE_SIZE = 50;

const useFetchPostsWithPagination = (otherUsersId?: string) => {
  const uid = otherUsersId!
    ? otherUsersId
    : useAppSelector(state => state?.userReducer?.userDetails?.uid);
  const detail = useAppSelector(state => state?.userReducer?.userDetails);
  const [posts, setPosts] = useState<TFeedPostObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // For initial fetch
  const [isRefreshing, setIsRefreshing] = useState(false); // For refresh
  const [isFetchingMore, setIsFetchingMore] = useState(false); // For loading more
  const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null); // Track the last fetched createdAt timestamp

  const fetchPosts = async (
    query: FirebaseDatabaseTypes.Query,
    isLoadMore?: boolean,
  ) => {
    setIsError(false);
    setIsLoading(true);
    setIsFetching(true);

    try {
      const snapshot = await query.once('value');
      const fetchedPosts: TFeedPostObject[] =
        snapshot.val() !== null ? Object.values(snapshot.val()) : [];

      const sortedPosts = fetchedPosts?.sort(
        (a, b) => b?.createdAt - a?.createdAt,
      ); // Sort by createdAt in descending order

      setPosts(isLoadMore ? [...posts, ...sortedPosts] : sortedPosts);

      if (sortedPosts?.length >= PAGE_SIZE) {
        setLastCreatedAt(sortedPosts[sortedPosts?.length - 1]?.id); // Set the last fetched createdAt
      } else {
        setLastCreatedAt(null);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const refreshPosts = async () => {
    setIsError(false);
    setIsRefreshing(true);

    try {
      const query = databaseRef('posts')
        .orderByChild('createdBy')
        .equalTo(uid)
        .limitToLast(PAGE_SIZE);
      fetchPosts(query);
    } catch (error) {
      console.error('Error refreshing posts:', error);
      setIsError(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    if (!lastCreatedAt) return; // No more posts to load

    setIsError(false);
    setIsFetchingMore(true);

    try {
      const query = databaseRef('posts')
        .orderByChild('createdBy')
        .startAt(uid)
        .endAt(uid, lastCreatedAt)
        .limitToLast(PAGE_SIZE + 1);
      fetchPosts(query, true);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setIsError(true);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    // Initial fetch when component mounts
    const initialQuery = databaseRef('posts')
      .orderByChild('createdBy')
      .equalTo(uid)
      .limitToLast(PAGE_SIZE);
    fetchPosts(initialQuery);
  }, [uid, detail?.posts?.length]);

  return {
    posts,
    isLoading,
    isError,
    isFetching,
    isRefreshing,
    isFetchingMore,
    refreshPosts,
    loadMorePosts,
  };
};

export default useFetchPostsWithPagination;
