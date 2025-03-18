import {Alert, Keyboard} from 'react-native';
import {useState} from 'react';
import axios from 'axios';
import {useDebounceMap} from './useDebounceMap';
import {getAddressData} from './getCompleteAddress';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from 'src/shared/components/modalProvider/ModalProvider';
import {useAppSelector} from 'src/redux/reducer/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_MAP_API_KEY = 'AIzaSyBhOGkiELZM12WF5H1xywo3E6hB4dnRUkk';

const useGooglePlaceInput = (
  changeLocation: (data: AddressInfo, placeTitle?: string) => Promise<void>,
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>> | any,
) => {
  const searchedPlaces = useAppSelector(
    state => state?.userReducer?.searchedPlaces,
  );

  const searchedPlacesArray = searchedPlaces.slice(0, 5);

  const [search, setSearch] = useState<any>({
    term: '',
    fetchPredictions: false,
  });

  const [predictions, setPredictions] = useState<PredictionType[]>([]);

  // Function to handle changes in the search input
  const onChangeText = async () => {
    if (search.term.trim() === '') {
      setSearch({...search, fetchPredictions: false});
      return;
    }
    if (!search.fetchPredictions) {
      return;
    }
    let language = await AsyncStorage.getItem('user-language');

    // const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_MAP_API_KEY}&input=${search.term}&components=country:iq&sensor=false`;
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_MAP_API_KEY}&input=${search.term}&language=${language}`;

    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });

      if (result) {
        setPredictions(result?.data?.predictions);
        setSearch({...search, fetchPredictions: false});
      }
    } catch (err: any) {
      if (err.message === 'Network Error') {
        Alert.alert(
          'Internet connection error',
          'Please check your internet connection and try again!',
        );
      } else {
        if (err.message) {
          Alert.alert('Error', err.message);
        }
      }
      setSearch({...search, fetchPredictions: false});
    }
  };

  useDebounceMap(onChangeText, 1000, [search.term]);

  // Function to handle the selection of a prediction
  const onPredictionTapped = async (
    placeId: string,
    description: string,
    placeTitle?: string,
  ) => {
    let language = await AsyncStorage.getItem('user-language');

    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/details/json?key=${GOOGLE_MAP_API_KEY}&place_id=${placeId}&language=${language}`;

    try {
      showLoadingSpinner({});
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: {result: details},
        } = result;

        const {
          geometry: {location},
        } = details;
        const {lat, lng} = location;

        let data = getAddressData(details, lat, lng);

        changeLocation(data, placeTitle);
        Keyboard.dismiss();
        setIsModalOpen && setIsModalOpen(false);
        setSearch({term: description});
      }
    } catch (e) {
      console.error(e);
    } finally {
      hideLoadingSpinner();
    }
  };

  // Function to handle the selection of a searched location
  const onSearchedTapped = (locationData: AddressInfo, title: string) => {
    setIsModalOpen && setIsModalOpen(false);
    changeLocation(locationData, title);
  };

  // Function to handle changes in the search input field
  const onHandleSearch = (text: string) => {
    setSearch({term: text, fetchPredictions: true});
  };

  return {
    predictions,
    onPredictionTapped,
    search,
    isLoading: search?.fetchPredictions,
    value: search?.term,
    onChangeText: onHandleSearch,
    searchedPlacesArray,
    onSearchedTapped,
    setSearch,
  };
};

export default useGooglePlaceInput;

export const GOOGLE_PACES_API_BASE_URL =
  'https://maps.googleapis.com/maps/api/place';
