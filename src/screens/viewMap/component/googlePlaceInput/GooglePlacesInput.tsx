import React, {Dispatch, SetStateAction} from 'react';
import {FlatList, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import useGooglePlaceInput from './useGooglePlaceInput';

import {useTranslation} from 'react-i18next';
import CustomSearch from 'src/shared/components/customSearch/CustomSearch';
import Empty from 'src/shared/components/placeholder/Empty';
export const GOOGLE_PACES_API_BASE_URL =
  'https://maps.googleapis.com/maps/api/place';

type SearchBarProps = {
  changeLocation: (data: AddressInfo) => Promise<void>;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
};

const GooglePlacesInput = ({
  setIsModalOpen,
  changeLocation,
}: SearchBarProps) => {
  const {
    onChangeText,
    value,
    onPredictionTapped,
    predictions,
    isLoading,
    searchedPlacesArray,
    onSearchedTapped,
    setSearch,
  } = useGooglePlaceInput(changeLocation, setIsModalOpen);

  const {t} = useTranslation();

  const renderPredictions = ({item}: {item: PredictionType | any}) => {
    return (
      <CustomButton
        type="unstyled"
        onPress={() => {
          if (item?.place_id && item?.description) {
            onPredictionTapped(
              item.place_id,
              item.description,
              item.structured_formatting.main_text,
            );
          } else {
            onSearchedTapped(item, item?.placeTitle);
          }
        }}>
        <View
          style={{
            paddingBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 5,
          }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              backgroundColor: '#f5f5f5',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 20,
            }}>
            {item?.place_id && item?.description ? (
              <FontAwesome5
                name="search-location"
                size={15}
                style={{color: '#6E6E6E'}}
              />
            ) : (
              <MaterialIcons
                name="history"
                size={15}
                style={{color: '#6E6E6E'}}
              />
            )}
          </View>
          <View>
            <CustomText
              numberOfLines={1}
              style={{paddingBottom: 3, width: SCREEN_WIDTH * 0.7}}
              fontFamily="openSansRegular"
              fontSize={15}>
              {item?.structured_formatting?.main_text ?? item?.placeTitle}
            </CustomText>
            <CustomText
              fontSize={13}
              style={{color: '#6E6E6E', width: SCREEN_WIDTH * 0.72}}
              fontFamily="openSansRegular"
              numberOfLines={2}>
              {item.description ?? item?.completeAddress}
            </CustomText>
          </View>
        </View>
      </CustomButton>
    );
  };

  return (
    <View style={{marginTop: SCREEN_HEIGHT * 0.025}}>
      <CustomSearch
        isLoading={isLoading}
        value={value}
        showCancel={true}
        onCancel={() =>
          setSearch({
            term: '',
            fetchPredictions: false,
          })
        }
        textStyle={{marginHorizontal: 10}}
        onChangeText={onChangeText}
        searchContainer={{
          width: SCREEN_WIDTH * 0.85,
          marginLeft: 5,
          borderRadius: 20,
          height: SCREEN_WIDTH * 0.1,
        }}
      />
      <FlatList
        ListHeaderComponent={
          !predictions.length && searchedPlacesArray.length ? (
            <CustomText style={{marginBottom: 10}}>
              {t('customWords:searchHistory')}
            </CustomText>
          ) : null
        }
        data={predictions.length ? predictions : searchedPlacesArray}
        renderItem={renderPredictions}
        keyExtractor={item =>
          predictions.length ? item.place_id : item.completeAddress
        }
        keyboardShouldPersistTaps="handled"
        style={{
          marginTop: 60,
        }}
        ListEmptyComponent={
          <Empty
            text={t('customWords:nothingToShow')}
            iconElement={
              <MaterialCommunityIcons
                name="map-search"
                size={40}
                style={{color: '#808080'}}
              />
            }
          />
        }
      />
    </View>
  );
};

export default GooglePlacesInput;
