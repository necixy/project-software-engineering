import axios from 'axios';
import {useState} from 'react';
import {Alert, Keyboard} from 'react-native';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {getAddressData} from 'src/screens/viewMap/component/googlePlaceInput/getCompleteAddress';
import {useDebounceMap} from 'src/screens/viewMap/component/googlePlaceInput/useDebounceMap';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from 'src/shared/components/modalProvider/ModalProvider';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const GOOGLE_MAP_API_KEY = 'AIzaSyBhOGkiELZM12WF5H1xywo3E6hB4dnRUkk';

const useProLocationSearch = () => {
  const {navigate} = useStackNavigation();

  const [search, setSearch] = useState<any>({
    term: '',
    fetchPredictions: false,
  });

  const [predictions, setPredictions] = useState<PredictionType[]>([]);

  const onChangeText = async () => {
    if (search.term.trim() === '') {
      setSearch({...search, fetchPredictions: false});
      return;
    }
    if (!search.fetchPredictions) {
      return;
    }

    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_MAP_API_KEY}&input=${search.term}`;

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

  const onPredictionTapped = async (placeId: string, description: string) => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/details/json?key=${GOOGLE_MAP_API_KEY}&place_id=${placeId}`;

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

        Keyboard.dismiss();

        setSearch({term: description});

        navigate(screenStackName.VIEW_PRO_MAP, {
          location: data,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      hideLoadingSpinner();
    }
  };

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
    setSearch,
  };
};

export default useProLocationSearch;

export const GOOGLE_PACES_API_BASE_URL =
  'https://maps.googleapis.com/maps/api/place';
