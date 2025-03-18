import {ActivityIndicator, Pressable, SafeAreaView, View} from 'react-native';
import React, {useRef} from 'react';
import mapStyle from './ViewMap.styles';
import MapView, {MarkerAnimated} from 'react-native-maps';
import BottomSheetPicker from 'src/shared/components/customPicker/BottomSheetPicker';
import CustomText from 'src/shared/components/customText/CustomText';
import {globalStyles} from 'src/constants/globalStyles.style';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {colors} from 'src/theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import GooglePlacesInput from './component/googlePlaceInput/GooglePlacesInput';
import useViewMap from 'src/screens/viewMap/useViewMap';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';

const ViewMap = (location: any) => {
  const locationData: AddressInfo = location?.route?.params?.location;

  const initialRegion = locationData
    ? {
        latitude: locationData?.latitude,
        latitudeDelta: 0.01,
        longitude: locationData?.longitude,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 37.80601921164026,
        latitudeDelta: 86.27230894334494,
        longitude: 112.04053742811084,
        longitudeDelta: 74.44852966815233,
      };

  const mapRef = useRef<MapView>();

  const {
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
  } = useViewMap(mapRef, locationData);

  const {navigate, goBack} = useStackNavigation();

  return (
    <View style={mapStyle.container}>
      <MapView
        ref={mapRef}
        style={mapStyle.map}
        initialRegion={initialRegion}
        onPress={event => {
          changePinLocation(event.nativeEvent.coordinate);
        }}>
        {locationDetails ? (
          <MarkerAnimated
            pinColor={colors.primary}
            coordinate={{
              latitude: locationDetails.latitude,
              longitude: locationDetails.longitude,
            }}
          />
        ) : currentLocation ? (
          <MarkerAnimated
            pinColor={colors.primary}
            coordinate={currentLocation}
          />
        ) : null}
      </MapView>

      <View
        style={{
          flexDirection: 'row',
          width: SCREEN_WIDTH * 0.95,
          justifyContent: 'space-between',
          top: 20,
          borderWidth: 1,
        }}>
        <Pressable
          hitSlop={30}
          style={[mapStyle.topButtons]}
          onPressIn={() => navigate(screenStackName.BOOKING_CHECKOUT)}>
          <Entypo
            // onPressIn={() => navigate(screenStackName.BOOKING_CHECKOUT)}
            name="cross"
            size={25}
            color={colors.defaultBlack}
            // onPress={getCurrentLocation}
          />
        </Pressable>

        <Pressable
          hitSlop={30}
          onPressIn={() => {
            if (!currentLocation && !locationDetails) {
              showModal({message: t('message:selectLocation')});
              return;
            }
            goBack();
            triggerEvent();
          }}
          // onPress={getCurrentLocation}
          style={mapStyle.topButtons}>
          <Entypo name="check" size={20} color={colors.defaultBlack} />
        </Pressable>
      </View>

      <Pressable
        hitSlop={30}
        style={[mapStyle.pin]}
        onPress={getCurrentLocation}>
        {isLocationLoading ? (
          <ActivityIndicator color={colors.defaultBlack} />
        ) : (
          <Ionicons
            name="navigate-outline"
            size={20}
            color={colors.defaultBlack}
          />
        )}
      </Pressable>

      <BottomSheetPicker
        rootStyle={{backgroundColor: 'none'}}
        overlayStyle={{backgroundColor: 'none'}}
        alwaysOpen={isModalOpen ? SCREEN_HEIGHT : SCREEN_HEIGHT * 0.28}
        adjustToContentHeight={false}
        modalHeight={SCREEN_HEIGHT}
        withHandle={!isModalOpen}
        keyboardAvoidingBehavior="height"
        modalStyle={{
          marginTop: 0,
        }}
        onClose={() => setIsModalOpen(false)}
        isOpen={true}
        HeaderComponent={
          <View style={[globalStyles.mt3, globalStyles.mb2]}>
            {!isModalOpen ? (
              <CustomText
                fontSize={18}
                fontFamily="openSansBold"
                style={{
                  alignSelf: 'center',
                  color: '#6D6D6D',
                  marginBottom: 20,
                }}>
                {t('customWords:markServicePoint')}
              </CustomText>
            ) : null}

            {!isModalOpen ? (
              <CustomButton
                type="unstyled"
                onPress={() => setIsModalOpen(true)}
                style={{
                  alignSelf: 'center',
                  width: SCREEN_WIDTH * 0.9,
                  borderRadius: 100,
                  backgroundColor: '#F5F5F5',
                  flexDirection: 'row',
                  paddingVertical: 10,
                }}>
                {!locationDetails ? (
                  <EvilIcons
                    name="search"
                    size={18}
                    color="#6c6c6c"
                    style={{left: 10}}
                  />
                ) : null}
                <CustomText
                  numberOfLines={1}
                  fontSize={15}
                  fontFamily="openSansRegular"
                  style={{
                    color: '#6C6C6C',
                    paddingVertical: 1,
                    paddingHorizontal: 20,
                  }}>
                  {locationDetails
                    ? locationDetails?.completeAddress
                    : address
                    ? address.formattedAddress
                    : t('customWords:searchByStreet')}
                </CustomText>
              </CustomButton>
            ) : (
              <SafeAreaView
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}>
                <View>
                  <MaterialIcons
                    onPress={() => setIsModalOpen(false)}
                    name="navigate-before"
                    size={40}
                    color={colors.defaultBlack}
                  />
                </View>

                <GooglePlacesInput
                  setIsModalOpen={setIsModalOpen}
                  changeLocation={changeLocation}
                />
              </SafeAreaView>
            )}
          </View>
        }
      />
    </View>
  );
};

export default ViewMap;
