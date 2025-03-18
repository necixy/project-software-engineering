import Geolocation from '@react-native-community/geolocation';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {EventRegister} from 'react-native-event-listeners';
import MapView from 'react-native-maps';
import {useAppDispatch} from 'src/redux/reducer/reducer';
import {updateSearchedPlaces} from 'src/redux/reducer/userReducer';
import {requestLocationPermission} from 'src/screens/newPost/hooks/UsePermission';
import {getCompleteAddressByLatLong} from 'src/screens/viewMap/component/googlePlaceInput/getCompleteAddress';

const useViewMap = (
  mapRef?: React.MutableRefObject<MapView | undefined>,
  locationData?: AddressInfo,
) => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>();

  const {t} = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState<any>(locationData);
  const [address, setAddress] = useState<AddressInfo | null | undefined>();

  // Getting current location
  const getCurrentLocation = async () => {
    try {
      const result = await requestLocationPermission(t);

      if (result) {
        console.log({result});
        setIsLocationLoading(true);
        Geolocation.getCurrentPosition(
          async position => {
            console.log({position});
            setCurrentLocation({...position?.coords});
            setLocationDetails(null);
            if (mapRef?.current) {
              mapRef.current.animateToRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });

              const addressData = await getCompleteAddressByLatLong(
                position.coords.latitude,
                position.coords.longitude,
              );

              setAddress(addressData);
            }

            setIsLocationLoading(false);
          },
          error => {
            console.error(error.message);
            setIsLocationLoading(false);
          },
          {
            enableHighAccuracy: false, // disabled high accuracy
            timeout: 15000,
            maximumAge: 1000,
          },
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Setting new location
  const changeLocation = async (data: AddressInfo, title: string) => {
    try {
      const result = await requestLocationPermission(t);

      if (result) {
        setIsLocationLoading(true);
        setCurrentLocation(null);
        setLocationDetails({...data});
        if (mapRef?.current) {
          mapRef.current.animateToRegion({
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          });

          const addressData = await getCompleteAddressByLatLong(
            data.latitude,
            data.longitude,
          );

          setAddress(addressData);

          dispatch(updateSearchedPlaces({...data, placeTitle: title}));
        }

        setIsLocationLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Setting new location on basis of pin̦
  const changePinLocation = async (data: any) => {
    try {
      const result = await requestLocationPermission(t);

      if (result) {
        setIsLocationLoading(true);
        setCurrentLocation(null);
        if (mapRef?.current) {
          mapRef.current.animateToRegion({
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          const addressData = await getCompleteAddressByLatLong(
            data.latitude,
            data.longitude,
          );

          setLocationDetails(addressData);
          setAddress(addressData);
        }

        setIsLocationLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const triggerEvent = () => {
    // Emit an event with some data
    EventRegister.emit('getUserLocationEvent', address);
  };

  return {
    currentLocation,
    isLocationLoading,
    getCurrentLocation,
    address,
    changeLocation,
    changePinLocation,
    t,
    isModalOpen,
    setIsModalOpen,
    triggerEvent,
    locationDetails,
  };
};

export default useViewMap;
