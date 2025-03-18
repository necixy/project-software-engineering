import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from 'src/api/root_api/axiosInstance.service';
import { useAppSelector } from 'src/redux/reducer/reducer';
import { setInitial } from 'src/redux/reducer/searchFilterReducer';

const useAlgoliaApi = () => {
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  const dispatch = useDispatch();
  const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid)
  console.log(uid)
  const citiesFilter = useAppSelector(state => state?.searchFilterReducer?.location);
  const availabilityFilter = useAppSelector(state => state?.searchFilterReducer?.availability);
  const ratingFilter = useAppSelector(state => state?.searchFilterReducer?.grade);
  const priceFilter = useAppSelector(state => state?.searchFilterReducer?.price);
  const categoryFilter = useAppSelector(state => state?.searchFilterReducer?.category);
  // console.log(categoryFilter)
  // console.log(priceFilter)
  const sortByFilter = useAppSelector(state => state?.searchFilterReducer?.sortBy)
  const sortBy = sortByFilter == "Descending Price" ? "_price_desc" : (sortByFilter == "Ascending Price" ? (serverType == "STAGING" ? "_price_asce" : "_price_asc") : (sortByFilter == "Grade" ? "_rating_desc" : ""))
  console.log(sortBy, 'sortBy')
  const rating = ratingFilter == "All" ? "" : ratingFilter
  const price = priceFilter == "All" ? "" : priceFilter
  const category = categoryFilter[0] == "All" ? "" : categoryFilter.map(ele => `profession:${ele.replace(/ /g, '_')}`).join(` OR `)
  console.log(category, 'category')
  const makeFilter = () => {
    const unBookedSlots: string[] = [];
    if (availabilityFilter?.availabilityArray) {
      availabilityFilter?.availabilityArray?.forEach(date => {
        availabilityFilter?.availabilityTimeArray.forEach(time => {
          unBookedSlots.push(`unbookedTime:${date}-${time.replace(/:/g, '_')}`);
        });
      });
    }
    return unBookedSlots;
  };
  const convertSlotsToFilterString = (slots: string[]): string => {
    const output = `${slots.join(" OR ")}`;
    return output;
  };

  // Example Usage
  const [availabilityFilterString, setAvailabilityFilterString] = useState('')

  // const availabilityFilterString = convertSlotsToFilterString(makeFilter());
  // console.log(availabilityFilterString)
  // console.log(availabilityFilter.availabilityArray, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  const cities = citiesFilter[0] === "All" ? "" : citiesFilter
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<AlgoliaResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [cityFilter, setCityFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const API_URL = 'https://c363-2402-e280-230c-597-5c23-ced3-5b8f-106e.ngrok-free.app/vita-abe0f/us-central1/api/algolia/search'; // Replace with your Cloud Function URL

  // const search = async (searchQuery: string, pageNum: number, city: string | string[] = cities) => {
  //   console.log(searchQuery, 'qmn')
  //   // setResults([])
  //   try {
  //     setIsLoading(true);

  //     const response = await axiosInstance.post("algolia/search", {}, {
  //       params: {
  //         search: searchQuery,
  //         page: pageNum,
  //         city,
  //       },

  //     });
  //     // console.log(response.data, "res.dataaaaa");
  //     const { data, totalPages: apiTotalPages } = response.data;

  //     // Update states
  //     setResults((prevResults) => (pageNum === 0 ? data : [...prevResults, ...data]));
  //     // console.log(data.map(obj => obj.uid), 'ressssssssssssssssssssssssssssssss')
  //     setTotalPages(apiTotalPages);
  //     setPage(pageNum);
  //     setHasSearched(true);
  //   } catch (err) {
  //     console.error('Error searching:', err);
  //     setError('Search failed. Please try again.');
  //   } finally {
  //     setIsLoading(false);

  //   }
  // };

  const search = async (searchQuery: string, pageNum: number, city: string | string[] = cities) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post(
        "algolia/search",
        {},
        {
          params: {
            search: searchQuery,
            page: pageNum, // Pass page number here
            city,
            availability: availabilityFilterString,
            rating,
            price,
            category,
            sortBy,
            uid
          },
        }
      );

      const { data, totalPages: apiTotalPages } = response.data;

      // Update states: Append data for infinite scroll
      setResults(prevResults => (pageNum === 0 ? data : [...prevResults, ...data]));
      setTotalPages(apiTotalPages);
      setPage(pageNum);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = () => {
    setPage(0);
    setTotalPages(0);
    setResults([]);
    search(query, 0);
  };

  const loadMore = async () => {
    if (isLoading || page >= totalPages - 1) return; // Prevent duplicate or unnecessary requests

    await search(query, page + 1); // Fetch the next page
  };
  // useEffect(() => {
  //   if (hasSearched) {
  //     setPage(0);
  //     search(query, 0, cityFilter);
  //   }
  // }, [query, cityFilter]);
  useEffect(() => {
    dispatch(setInitial())
    search(query, 0);
  }, [])



  useEffect(() => {
    setAvailabilityFilterString(convertSlotsToFilterString(makeFilter()))
    if (query == "")
      search(query, 0);
  }, [
    query, citiesFilter, availabilityFilter, ratingFilter, priceFilter, categoryFilter, sortByFilter
  ])

  return {
    query,
    setQuery,
    results,
    isLoading,
    handleSearch,
    loadMore,
    setCityFilter,
    error,
    hasSearched
  };
};

export default useAlgoliaApi;