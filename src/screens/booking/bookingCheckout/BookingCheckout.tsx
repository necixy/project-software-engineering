import LottieView from 'lottie-react-native';
import React, {useRef} from 'react';
import {Pressable, View} from 'react-native';
import MapView, {MarkerAnimated} from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {IS_IOS, SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {
  capitalizeString,
  fontSizePixelRatio,
} from 'src/utils/developmentFunctions';
import AddCard from '../component/addCard/AddCard';
import SavedCardsList from '../component/savedCardsList/SavedCardsList';
import renderCheckout from './BookingCheckout.style';
import useBookingCheckout from './useBookingCheckout';
import CountDown from 'src/screens/userProfile/switchToPro/editPersonalInfo/proVerifyCode/component/CountDown';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {getSymbols} from 'src/api/getSymbols';
import BottomSheetPicker from 'src/shared/components/customPicker/BottomSheetPicker';
import {globalStyles} from 'src/constants/globalStyles.style';
import {getCurrencySymbol} from 'src/utils/getCurrencySymbol';

const initialRegion = {
  latitude: 37.80601921164026,
  latitudeDelta: 0.3,
  longitude: 112.04053742811084,
  longitudeDelta: 0.3,
};

const BookingCheckout = ({route}: any) => {
  const mapRef = useRef<MapView>(null);

  const {
    t,
    navigation,
    formik: {
      errors,
      values: {note, orderAddress},
      handleChange,
      handleSubmit,
    },
    bookingDate,
    loading,
    // setLoading,
    proUserRating,
    userLocationData,
    currentLocation,
    locationLoading,
    bookingDetails,
    bookingTime,
    removePendingBookingTimes,
    cards: {savedCards, brandIcons, setSavedCards},
    getCurrentLocation,
    cardId: {selectedCardId, setSelectedCardId},
    // counter,
    showTimer,
    setShowTimer,
    disableBooking,
    setDisableBooking,
    selectedCurrency,
    setSelectedCurrency,
    currencyList,
    setCurrencyList,
    startModalOpen,
    setStartModalOpen,
  } = useBookingCheckout(route?.params?.item!, mapRef!);

  const pickCardItem = (item: any) => {
    setSelectedCardId(item);
  };

  return (
    <Container headerColor="blue">
      {/* Header Section  */}
      <CustomHeader
        leftIcon={
          <CustomButton
            hitSlop={15}
            style={[
              {alignSelf: 'flex-start', marginStart: 10},
              {
                marginRight: route?.name === 'chat' ? 0 : null,
              },
            ]}
            type="unstyled"
            onPress={() => {
              removePendingBookingTimes({
                date: route?.params?.item?.date!,
                time: route?.params?.item?.time!,
                proUid: route?.params?.item?.uid!,
              });
              // navigation?.goBack();
            }}>
            <Entypo name="chevron-left" size={24} color={colors?.secondary} />
          </CustomButton>
        }
        leftIconColor="white"
        leftIconStyle={{width: '10%'}}
        // fontFamily={!IS_IOS ? fonts?.openSansBold : fonts.openSansBold}
        fontFamily={fonts?.openSansBold}
        fontSize={16}
        lineHeight={25}
        titleColor="white"
        titleStyle={{
          color: colors.secondary,
        }}
        headerContainer={{
          marginTop: 0,
          paddingTop: 0,
          backgroundColor: colors?.primary,
          alignItems: 'center',
        }}
        route={route}
        rightIcon
      />
      <View style={renderCheckout.headerContainer}>
        <View
          style={{
            columnGap: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar
            source={
              bookingDetails?.profile
                ? {
                    uri: bookingDetails.profile,
                  }
                : undefined
            }
            style={renderCheckout.headerImg}
          />

          <View style={{width: SCREEN_WIDTH * 0.75}}>
            <CustomText
              fontSize={19}
              style={renderCheckout.headerTitle}
              numberOfLines={2}>
              {capitalizeString(bookingDetails?.name)}
            </CustomText>

            {proUserRating ? (
              <View style={renderCheckout.headerDescriptionBox}>
                <AntDesign name="star" size={15} color="#fff" />
                <CustomText
                  fontSize={15}
                  style={renderCheckout.headerDescription}>
                  {Number(proUserRating).toFixed(2)}
                </CustomText>
              </View>
            ) : null}
          </View>
        </View>
        {showTimer && (
          <View style={{right: 110}}>
            <CountDown
              timerMessage={t('customWords:expiresIn')}
              textColor={'secondary'}
              initialValue={300}
              onCountDownEnd={() => {
                setDisableBooking(true);
                showModal({
                  title: t('message:bookingTimeExpired'),
                  message: t('message:reBookTimeSlot'),
                });
                setShowTimer(false);
                removePendingBookingTimes({
                  date: route?.params?.item?.date!,
                  time: route?.params?.item?.time!,
                  proUid: route?.params?.item?.uid!,
                });
              }}
            />
          </View>
        )}
        {/* <View
          style={{
            // columnGap: 10,
            flexDirection: 'row',
            alignItems: 'center',
            right: 50,
            borderWidth: 1,
          }}>
          <CustomText fontSize={15} style={{color: '#fff'}}>
            {counter}
          </CustomText>
        </View> */}
      </View>
      {/* Booking Details */}
      <View style={renderCheckout.mainBox}>
        <CustomText fontSize={18} style={renderCheckout.mainBoxHeading}>
          {t('common:bookingDetails')}
        </CustomText>
        <View style={renderCheckout.iconBox}>
          <FontAwesome5
            name="concierge-bell"
            color={colors.primary}
            size={16}
          />
          <CustomText fontSize={14} style={renderCheckout.iconText}>
            {bookingDetails?.item?.serviceName}
          </CustomText>
        </View>
        <CustomButton
          disabledWithoutOpacity
          type="unstyled"
          onPress={async () => {
            // let res = await getSymbols();
            // setCurrencyList(res?.symbols);
            // setStartModalOpen(true);
          }}
          style={[
            renderCheckout.iconBox,
            {
              left: 4,
            },
          ]}>
          <Fontisto name="dollar" color={colors.primary} size={17} />
          <CustomText
            fontSize={14}
            style={[
              renderCheckout.iconText,
              {
                marginLeft: 5,
              },
            ]}>
            {getCurrencySymbol(bookingDetails?.default_currency) +
              `${Math.abs(bookingDetails?.item?.servicePrice).toFixed(2)}`}
          </CustomText>
        </CustomButton>

        {/* <BottomSheetPicker
          modalStyle={{
            // marginTop: 300,
            paddingTop: 30,
            borderWidth: 3,
            borderColor: 'red',
            height: SCREEN_HEIGHT * 0.6,
          }}
          pressableStyle={[
            {
              // borderWidth: 1,
              paddingHorizontal: 0,
              gap: 50,
              borderColor: colors.inputGrey,
              borderRadius: 2,
            },
            globalStyles.rowSpaceBetween,
          ]}
          onClosed={() => setStartModalOpen(false)}
          actionElement={
            <CustomButton
              type="unstyled"
              onPress={async () => {
                let res = await getSymbols();
                setCurrencyList(res?.symbols);
                setStartModalOpen(true);
              }}
              style={[
                renderCheckout.iconBox,
                {
                  left: 4,
                },
              ]}>
              <Fontisto name="dollar" color={colors.primary} size={17} />
              <CustomText
                fontSize={14}
                style={[
                  renderCheckout.iconText,
                  {
                    marginLeft: 5,
                  },
                ]}>
                {`£${bookingDetails?.item?.servicePrice}`}
              </CustomText>
            </CustomButton>
          }
          isOpen={startModalOpen}
          flatListProps={{
            // data: currencyList!,
            data: ['1', '2', '3', '4', '5'],
            showsVerticalScrollIndicator: false,
            style: {
              width: 200,
              alignSelf: 'center',
            },
            renderItem: ({item}) => {
              console.log({item});
              return (
                <CustomButton
                  alignSelf="stretch"
                  onPress={() => {
                    // setStartTime(item);
                    setStartModalOpen(false);
                  }}
                  style={[
                    {
                      backgroundColor: colors.secondary,
                      // startTime == item ? colors.secondary : colors.primary,
                      borderRadius: 10,
                      alignItems: 'center',
                      flex: 1,
                      margin: 5,
                      height: 35,
                      width: 200,
                      // borderColor:
                      //   startTime == item ? colors.primary : colors.secondary,
                      // borderWidth: startTime == item ? 2 : 0,
                      alignSelf: 'center',
                    },
                  ]}>
                  <CustomText
                    color={
                      // startTime == item ? 'primary' :
                      'defaultBlack'
                    }>
                    {item}
                  </CustomText>
                </CustomButton>
              );
            },
          }}
        /> */}

        <View
          style={[
            renderCheckout.iconBox,
            {
              left: 1,
            },
          ]}>
          <FontAwesome5 name="edit" color={colors.primary} size={17} />
          <CustomInput
            error={errors?.note}
            errorStyle={{marginTop: note?.length > 80 ? 15 : 5}}
            containerStyle={{
              flex: 1,
            }}
            // multiline
            inputBoxStyle={[
              renderCheckout.iconEdit,
              {
                fontSize: fontSizePixelRatio(14),
                paddingHorizontal: 0,
              },
            ]}
            onChangeText={handleChange('note')}
            value={note}
            inputContainer={{borderWidth: 0}}
            placeHolderText={t('customWords:addANote')}
          />
          {/* <FontAwesome5
            name="angle-right"
            color="#cbcece"
            size={20}
            style={{marginEnd: 5}}
          /> */}
        </View>
        <CustomText fontSize={18} style={renderCheckout.mainBoxHeading}>
          {t('common:serviceDate')}
        </CustomText>
        <View
          style={[
            renderCheckout.iconBox,
            {
              left: 2,
            },
          ]}>
          <FontAwesome5
            name="calendar-check"
            color={colors.primary}
            size={18}
          />
          <CustomText
            fontSize={14}
            style={[
              renderCheckout.iconText,
              {
                marginLeft: 2,
              },
            ]}>
            {bookingTime ?? bookingDate}
          </CustomText>
        </View>
        <CustomText fontSize={18} style={renderCheckout.mainBoxHeading}>
          {t('common:serviceLocation')}
        </CustomText>

        {/* MapView of user location */}
        <View>
          <MapView
            scrollEnabled={false}
            onPress={() =>
              navigation.navigate(screenStackName.VIEW_MAP, {
                location: userLocationData ?? currentLocation,
              })
            }
            ref={mapRef}
            style={{
              width: SCREEN_WIDTH * 0.95,
              height: SCREEN_HEIGHT * 0.18,
              marginTop: 10,
              alignSelf: 'center',
            }}
            initialRegion={initialRegion}>
            {userLocationData ? (
              <MarkerAnimated
                pinColor={colors.primary}
                coordinate={{
                  latitude: userLocationData?.latitude,
                  longitude: userLocationData?.longitude,
                }}
              />
            ) : currentLocation ? (
              <MarkerAnimated
                pinColor={colors.primary}
                coordinate={{
                  latitude: currentLocation?.latitude,
                  longitude: currentLocation?.longitude,
                }}
              />
            ) : null}
          </MapView>

          <View
            style={{
              position: 'absolute',
              right: 5,
              top: 15,
              backgroundColor: colors.secondary,
              height: 30,
              width: 30,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons
              name="reload"
              size={15}
              color={colors.defaultBlack}
              onPress={getCurrentLocation}
            />
          </View>
        </View>

        {/* Displaying address of user location */}
        <CustomButton
          onPress={() =>
            navigation.navigate(screenStackName.VIEW_MAP, {
              location: userLocationData ?? currentLocation,
            })
          }
          type="unstyled"
          style={[
            renderCheckout.iconBox,
            {
              left: 2,
            },
          ]}>
          <MaterialIcons name="location-pin" color={colors.primary} size={22} />
          {!locationLoading ? (
            <CustomText
              fontSize={14}
              style={[renderCheckout.iconText, {flex: 1}]}>
              {userLocationData
                ? userLocationData?.completeAddress
                : currentLocation?.completeAddress ??
                  t('customWords:selectLocation')}
            </CustomText>
          ) : (
            <View style={{width: SCREEN_WIDTH * 0.75}}>
              <LottieView
                source={require('src/assets/lottie/loading.json')}
                autoPlay
                loop
                style={{
                  height: 50,
                  width: 50,
                  alignSelf: 'center',
                }}
              />
            </View>
          )}
          <FontAwesome5
            name="angle-right"
            color="#cbcece"
            size={20}
            style={{marginRight: 5}}
          />
        </CustomButton>

        {errors?.orderAddress && (
          <CustomText
            numberOfLines={2}
            fontFamily="openSansRegular"
            fontSize={12}
            style={[
              {
                paddingBottom: 12,
                marginTop: 5,
                marginStart: 5,
                color: colors.red,
                lineHeight: 15,
              },
              // errorStyle,
            ]}>
            {capitalizeString(errors?.orderAddress)}
          </CustomText>
        )}
        <CustomText fontSize={18} style={renderCheckout.mainBoxHeading}>
          {t('common:paymentMethod')}
        </CustomText>
        {savedCards?.map((item: any, index: number) => (
          <SavedCardsList
            item={item}
            key={index}
            index={index}
            length={savedCards?.length - 1}
            brandIcons={brandIcons}
            isSelected={item?.id === selectedCardId?.id}
            handleSelectedCard={() => pickCardItem(item)}
          />
        ))}
        <AddCard setSavedCards={setSavedCards} />
        <CustomButton
          disabled={
            loading || locationLoading || !savedCards?.length || disableBooking
          }
          type="blue"
          fontSize={17}
          isLoading={loading}
          onPress={handleSubmit}
          style={renderCheckout.blueButton}
          textProps={{
            style: renderCheckout.blueText,
          }}>
          {t('common:confirmBooking')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default BookingCheckout;
