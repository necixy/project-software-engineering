import {ActivityIndicator, View} from 'react-native';
import React, {useRef} from 'react';
import MapView, {MarkerAnimated} from 'react-native-maps';
import CustomText from 'src/shared/components/customText/CustomText';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {colors} from 'src/theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import proMapStyle from './ProLocationMap.style';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import useProLocationMap from './useProLocationMap';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {useTranslation} from 'react-i18next';
import Container from 'src/shared/components/container/Container';

const initialRegion = {
  latitude: 37.80601921164026,
  latitudeDelta: 86.27230894334494,
  longitude: 112.04053742811084,
  longitudeDelta: 74.44852966815233,
};

const ProLocationMap = (location: any) => {
  const locationDetails = location?.route?.params?.location;

  const proMapRef = useRef<MapView>();

  const {navigate} = useStackNavigation();

  const {
    getCurrentLocation,
    isLocationLoading,
    address,
    changePinLocation,
    triggerEvent,
  } = useProLocationMap(proMapRef, locationDetails);

  const {t} = useTranslation();

  return (
    <Container>
      <CustomHeader
        back
        leftIconColor="blue"
        fontFamily={fonts?.openSansBold}
        fontSize={fontSizePixelRatio(18)}
        title="Location"
        titleColor="black"
        headerContainer={{
          alignItems: 'center',
          zIndex: 9,
        }}
        rightIcon={
          <CustomText
            onPress={() => {
              navigate(screenStackName.EDIT_PRO_PROFILE);
              triggerEvent();
            }}
            color="primary">
            {t('common:done')}
          </CustomText>
        }
        rightIconStyle={{width: '90%', paddingRight: 10}}
      />

      <View style={proMapStyle.container}>
        <MapView
          ref={proMapRef}
          style={proMapStyle.map}
          initialRegion={initialRegion}
          onPress={event => changePinLocation(event.nativeEvent.coordinate)}>
          {address ? (
            <MarkerAnimated
              pinColor={colors.primary}
              coordinate={{
                latitude: address?.latitude,
                longitude: address?.longitude,
              }}
            />
          ) : null}
        </MapView>

        <View style={proMapStyle.pin}>
          {isLocationLoading ? (
            <ActivityIndicator color={colors.defaultBlack} />
          ) : (
            <Ionicons
              name="navigate-outline"
              size={20}
              color={colors.defaultBlack}
              onPress={getCurrentLocation}
            />
          )}
        </View>

        <CustomButton
          type="unstyled"
          onPress={() => {
            navigate(screenStackName.EDIT_PRO_LOCATION);
          }}
          style={{
            bottom: SCREEN_HEIGHT * 0.06,
            alignSelf: 'center',
            width: SCREEN_WIDTH * 0.9,
            borderRadius: 100,
            backgroundColor: '#F5F5F5',
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            {!address ? (
              <EvilIcons
                name="search"
                size={20}
                color="#6c6c6c"
                style={{top: -1, paddingRight: 5}}
              />
            ) : null}
            <CustomText
              numberOfLines={1}
              fontSize={15}
              fontFamily="openSansBold"
              style={{
                color: '#6C6C6C',
                marginHorizontal: 20,
                paddingVertical: 1,
              }}>
              {address
                ? address?.formattedAddress
                : t('customWords:searchByStreet')}
            </CustomText>
          </View>
        </CustomButton>
      </View>
    </Container>
  );
};

export default ProLocationMap;
