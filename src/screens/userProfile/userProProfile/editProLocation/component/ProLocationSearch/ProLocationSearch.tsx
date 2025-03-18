import React from 'react';
import {FlatList, View} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import CustomSearch from 'src/shared/components/customSearch/CustomSearch';
import {colors} from 'src/theme/colors';
import useProLocationSearch from './useProLocationSearch';
import {useTranslation} from 'react-i18next';
import Empty from 'src/shared/components/placeholder/Empty';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const GOOGLE_PACES_API_BASE_URL =
  'https://maps.googleapis.com/maps/api/place';

const ProLocationSearch = () => {
  const {
    onChangeText,
    value,
    onPredictionTapped,
    predictions,
    isLoading,
    setSearch,
  } = useProLocationSearch();

  const {t} = useTranslation();

  const renderPredictions = ({item}: {item: PredictionType}) => {
    return (
      value && (
        <CustomButton
          type="unstyled"
          onPress={() => {
            onPredictionTapped(item.place_id, item.description);
          }}>
          <View
            style={{
              paddingBottom: 15,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 35,
            }}>
            <View>
              <CustomText
                numberOfLines={1}
                style={{paddingBottom: 10, width: SCREEN_WIDTH * 0.85}}
                fontFamily="openSansRegular"
                fontSize={15}>
                {item?.description}
              </CustomText>
            </View>
          </View>
        </CustomButton>
      )
    );
  };

  return (
    <View>
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
        textStyle={{
          color: colors.primary,
          fontSize: 16,
          marginHorizontal: 10,
        }}
        onChangeText={onChangeText}
        searchContainer={{
          width: SCREEN_WIDTH,
          borderBottomWidth: 1,
          height: SCREEN_WIDTH * 0.1,
          backgroundColor: 'white',
          borderRadius: 0,
          borderBottomColor: colors.lightGrey,
        }}
      />

      <FlatList
        data={predictions}
        renderItem={renderPredictions}
        keyExtractor={item => item.place_id}
        keyboardShouldPersistTaps="handled"
        style={{
          marginTop: 40,
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

export default ProLocationSearch;
