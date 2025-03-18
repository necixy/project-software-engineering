import Geolocation from '@react-native-community/geolocation';
import {useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import {requestLocationPermission} from 'src/screens/newPost/hooks/UsePermission';
import {getCompleteAddressByLatLong} from 'src/screens/viewMap/component/googlePlaceInput/getCompleteAddress';
import {EventRegister} from 'react-native-event-listeners';
import {useTranslation} from 'react-i18next';

const useProLocationMap = (
  mapRef?: React.MutableRefObject<MapView | undefined>,
  locationDetails?: AddressInfo,
) => {
  const {t} = useTranslation();

  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const [address, setAddress] = useState<AddressInfo | null>();

  const triggerEvent = () => {
    // Emit an event with some data
    EventRegister.emit('getLocationEvent', address);
  };

  // Getting current location from map
  const getCurrentLocation = async () => {
    try {
      const result = await requestLocationPermission(t);

      if (result) {
        setIsLocationLoading(true);
        Geolocation.getCurrentPosition(
          async position => {
            if (mapRef?.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000,
              );

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
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Setting selected location on map
  const changeLocation = async (locationData: AddressInfo) => {
    try {
      const result = await requestLocationPermission(t);

      if (result) {
        setIsLocationLoading(true);

        if (mapRef?.current) {
          mapRef.current.animateToRegion(
            {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              latitudeDelta: 0.06,
              longitudeDelta: 0.06,
            },
            1000,
          );

          const addressData = await getCompleteAddressByLatLong(
            locationData.latitude,
            locationData.longitude,
          );

          setAddress(addressData);
        }

        setIsLocationLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    locationDetails && changeLocation(locationDetails);
  }, [locationDetails]);

  // Set pin on selected location on map
  const changePinLocation = async (data: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      const result = await requestLocationPermission(t);

      if (result) {
        setIsLocationLoading(true);

        if (mapRef?.current) {
          mapRef.current.animateToRegion(
            {
              latitude: data.latitude,
              longitude: data.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000,
          );

          const addressData = await getCompleteAddressByLatLong(
            data.latitude,
            data.longitude,
          );

          setAddress(addressData);
        }

        setIsLocationLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isLocationLoading,
    getCurrentLocation,
    address,
    changeLocation,
    changePinLocation,
    triggerEvent,
  };
};

export default useProLocationMap;
