import axios, {AxiosResponse} from 'axios';
import {Alert} from 'react-native';

const GOOGLE_MAP_API_KEY = 'AIzaSyBhOGkiELZM12WF5H1xywo3E6hB4dnRUkk';

const fetchAddressAutocomplete = async (
  latitude: number,
  longitude: number,
) => {
  const apiKey: string = GOOGLE_MAP_API_KEY;
  const input: string = `${latitude},${longitude}`;

  const url: string = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${input}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.status === 'OK') {
      let data1 = getAddressData(
        response.data?.results?.[0],
        latitude,
        longitude,
      );

      //   return data.predictions.map(
      //     (prediction: PredictionType) => prediction.description,
      //   );
    } else {
      Alert.alert('Error fetching autocomplete suggestions.');
    }
  } catch (error: any) {
    Alert.alert(`Error fetching address autocomplete: ${error.message}`);
  }
};

async function getCompleteAddressByLatLong(
  latitude: number,
  longitude: number,
): Promise<AddressInfo | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`;
  try {
    const response: AxiosResponse = await axios.get(url);
    const data = response.data;

    if (data?.status === 'OK') {
      if (data?.results?.length > 0) {
        const addressComponents = data.results[0].address_components;

        let address: AddressInfo = {
          zip: null,
          stateInShort: null,
          countryInShort: null,
          country: null,
          state: null,
          city: null,
          unit: null,
          formattedAddress: null,
          longitude: longitude,
          latitude: latitude,
          completeAddress: null,
        };

        for (let i = 0; i < addressComponents.length; i++) {
          const component = addressComponents[i];
          if (component.types.includes('postal_code')) {
            address.zip = component.short_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            address.stateInShort = component.short_name;
            address.state = component.long_name;
          } else if (component.types.includes('country')) {
            address.countryInShort = component.short_name;
            address.country = component.long_name;
          } else if (component.types.includes('locality')) {
            address.city = component.long_name;
          } else if (component.types.includes('sublocality_level_1')) {
            address.unit = component.long_name;
          }
        }

        address.formattedAddress = data.results[0].formatted_address;
        address.completeAddress = address.formattedAddress;

        return address;
      }
    }
    return null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

const getAddressData = (details: any, lat: Number, lng: Number) => {
  let formattedAddress = details?.formatted_address;
  let unit =
    details?.address_components?.find((x: any) =>
      x?.types?.includes('street_number'),
    )?.long_name ||
    details?.address_components?.find((x: any) =>
      x?.types?.includes('plus_code'),
    )?.long_name ||
    details?.address_components?.find((x: any) =>
      x?.types?.includes('subpremise'),
    )?.long_name ||
    '';
  let zip =
    details?.address_components?.find((x: any) =>
      x?.types?.includes('postal_code'),
    )?.long_name || '';
  let country =
    details?.address_components?.find((x: any) => x?.types?.includes('country'))
      ?.long_name || '';
  let state =
    details?.address_components?.find((x: any) =>
      x?.types?.includes('administrative_area_level_1'),
    )?.long_name || '';
  let city =
    details?.address_components?.find((x: any) =>
      x?.types?.includes('locality'),
    )?.long_name ||
    details?.address_components?.find((x: any) =>
      x?.types?.includes('administrative_area_level_3'),
    )?.long_name ||
    '';
  let stateInShort =
    details?.address_components?.find((x: any) =>
      x?.types?.includes('administrative_area_level_1'),
    )?.short_name || '';
  let countryInShort =
    details?.address_components?.find((x: any) => x?.types?.includes('country'))
      ?.short_name || '';
  // let countryCode =
  //   details?.international_phone_number?.split(' ') ?? '';

  let completeAddress = formattedAddress;
  formattedAddress = formattedAddress
    .replace(country, '')
    .replace(city, '')
    .replace(state, '')
    .replace(zip, '')
    .trim()
    .replace(/^[,\s]+|[\s,]+$/, '');

  let data = {
    zip,
    stateInShort,
    countryInShort,
    country,
    state,
    city,
    unit,
    formattedAddress,
    longitude: lng,
    latitude: lat,
    completeAddress,
  };
  return data;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

const findNearestOne = (
  locations: any[],
  givenLat: Number,
  givenLon: Number,
) => {
  let closestLocation = null;
  let minDistance = Infinity;

  locations.forEach(item => {
    const {location} = item?.geometry;

    const distance = calculateDistance(
      givenLat,
      givenLon,
      location.lat,
      location.lng,
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestLocation = item;
    }
  });

  // The closest location object
  if (closestLocation) {
    return closestLocation;
  } else {
    return null;
  }
};

export {fetchAddressAutocomplete, getAddressData, getCompleteAddressByLatLong};
