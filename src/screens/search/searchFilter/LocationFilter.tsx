import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import useGooglePlaceInput from 'src/screens/viewMap/component/googlePlaceInput/useGooglePlaceInput';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomSearch from 'src/shared/components/customSearch/CustomSearch';
import CustomText from 'src/shared/components/customText/CustomText';
import Empty from 'src/shared/components/placeholder/Empty';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import SearchFilterHeader from './searchFilterComponent/SearchFilterHeader';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {updateLocation} from 'src/redux/reducer/searchFilterReducer';
import Container from 'src/shared/components/container/Container';
import {EventRegister} from 'react-native-event-listeners';

const LocationFilter = () => {
  const {goBack} = useStackNavigation();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  // const alreadySetLocation = useAppSelector(
  //   state => state?.searchFilterReducer?.location,
  // );
  // console.log({alreadySetLocation});

  // State to hold the array of selected addresses
  const [addressArray, setAddressArray] = useState<any>([]);

  // Function to change the location
  const changeLocation = async (
    data: AddressInfo,
    title: string | undefined,
  ) => {
    try {
      // Check if the address already exists, if not, add it to the array
      if (
        addressArray.every(
          (value: AddressInfo) =>
            value.latitude !== data.latitude &&
            value.longitude !== data.longitude,
        )
      ) {
        setAddressArray((prevAddress: AddressInfo[]) =>
          [{...data, placeTitle: title}, ...prevAddress].slice(0, 5),
        );
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to remove a place from the array
  const removePlace = (latitude: number | null, longitude: number | null) => {
    setAddressArray(
      addressArray.filter(
        (address: AddressInfo) =>
          address?.latitude !== latitude && address.longitude !== longitude,
      ),
    );

    addressArray.length === 1 &&
      setSearch({
        term: '',
        fetchPredictions: false,
      });
  };

  const {
    onChangeText,
    value,
    onPredictionTapped,
    predictions,
    isLoading,
    setSearch,
  } = useGooglePlaceInput(changeLocation);

  // Function to render the list of predictions
  const renderPredictions = ({item}: {item: PredictionType}) => {
    return value?.length > 0 ? (
      <CustomButton
        type="unstyled"
        onPress={() =>
          onPredictionTapped(
            item.place_id,
            item.description,
            item.structured_formatting.main_text,
          )
        }>
        <View
          style={{
            paddingVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 5,
          }}>
          <Octicons
            name="location"
            size={20}
            style={{color: colors.defaultBlack, marginRight: 20}}
          />
          <View>
            <CustomText
              numberOfLines={1}
              style={{paddingBottom: 3, width: SCREEN_WIDTH * 0.7}}
              fontFamily="openSansRegular"
              fontSize={15}>
              {item?.structured_formatting?.main_text}
            </CustomText>
          </View>
        </View>
      </CustomButton>
    ) : null;
  };

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const keyboardDidShowEvent = () => {
    EventRegister.emit('keyboardDidShow');
  };

  const keyboardDidHideEvent = () => {
    EventRegister.emit('keyboardDidHide');
  };
  if (isKeyboardVisible) {
    keyboardDidShowEvent();
  }
  if (!isKeyboardVisible) {
    keyboardDidHideEvent();
  }

  return (
    <Container
      // disableKeyboardAvoidingView
      isScrollable={false}>
      <SearchFilterHeader
        name={t('filter:location')}
        setAddressArray={setAddressArray}
        setSearch={setSearch}
      />
      <View
        style={[
          globalStyles.rowCenter,
          {
            padding: 10,
            paddingBottom: 0,
          },
        ]}>
        <CustomSearch
          onFocus={() => setIsKeyboardVisible(true)}
          onBlur={() => setIsKeyboardVisible(false)}
          isLoading={isLoading}
          onChangeText={onChangeText}
          value={value}
          color="secondary"
          searchContainer={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.lightGrey,
            height: 40,
          }}
          textStyle={{marginHorizontal: 10}}
          onCancel={() =>
            setSearch({
              term: '',
              fetchPredictions: false,
            })
          }
          showCancel={true}
          placeholderText={t('customWords:enterLocation')}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 5,
        }}>
        {addressArray.length
          ? addressArray.map((address: AddressInfo) => {
              return (
                <View
                  key={`${address.latitude}${address.longitude}`}
                  style={[
                    {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#C1E2FB',
                      borderRadius: 5,
                      margin: 5,
                      padding: 7,
                    },
                  ]}>
                  <CustomText fontFamily="openSansRegular" fontSize={12}>
                    {address?.placeTitle}
                  </CustomText>
                  <CustomButton
                    type="unstyled"
                    onPress={() =>
                      removePlace(address?.latitude, address?.longitude)
                    }>
                    <AntDesign
                      size={15}
                      style={{marginLeft: 10, color: colors.defaultBlack}}
                      name="closecircleo"
                    />
                  </CustomButton>
                </View>
              );
            })
          : null}
      </View>

      <FlatList
        data={predictions}
        renderItem={renderPredictions}
        keyExtractor={item => item.place_id}
        keyboardShouldPersistTaps="handled"
        style={{
          marginTop: 40,
          marginLeft: 10,
        }}
        ListEmptyComponent={
          <Empty
            style={{height: SCREEN_HEIGHT / 3}}
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
      {addressArray.length != 0 ? (
        <CustomButton
          alignSelf="center"
          style={{marginVertical: 20, width: '80%'}}
          onPress={() => {
            try {
              dispatch(updateLocation(addressArray.map(obj => obj.placeTitle)));
              goBack();
            } catch (error) {
              console.error({error});
            }
          }}>
          {t('common:save')}
        </CustomButton>
      ) : null}
    </Container>
  );
};

export default LocationFilter;
