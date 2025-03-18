import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {sendNotifications} from 'src/api/notification/notification';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {useAppSelector} from 'src/redux/reducer/reducer';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import StarIcon from 'src/shared/components/ratingComponent/src/StarIcon';
import {
  bookingRequestAccepted,
  bookingRequestOnDecline,
} from 'src/shared/notificationPayload/NotificationPayload';
import {colors} from 'src/theme/colors';
import {capitalizeString} from 'src/utils/developmentFunctions';
import useCustomCard from '../hooks/useCustomCard';
import customBoxStyle from './CustomBox.style';
import renderCustomCard from './CustomCard.style';
import {statusType} from './RequestsJSON';
import LocationMapOptions from './locationMapOptions/LocationMapOptions';
import CancelBookingModal from './CancelBookingModal';
import {getCurrencySymbol} from 'src/utils/getCurrencySymbol';

type TRenderRequestType = {
  request: TBookingHistory;
  // | TBookingDetails;
  displayButton?: boolean;
  displayBadge?: boolean;
  badgeText?: string;
  onNavigation?: () => void;
  ratePro?: boolean;
};

const CustomCard = ({
  ratePro,
  request,
  displayButton,
  displayBadge,
  badgeText,
  onNavigation,
}: TRenderRequestType) => {
  const {
    // otherUserDetails,
    // existingReview,
    uid,
    // isLoading,
    toUpdateBookings,
    navigate,
    goBack,
    t,
    showMap,
    setShowMap,
    modalOpen,
    setModalOpen,
  } = useCustomCard({
    data: request,
    status: badgeText,
  });
  const [isLoading, setIsLoading] = useState({
    acceptLoading: false,
    declineLoading: false,
  });

  const proUserName = useAppSelector(
    state => state?.userReducer?.userDetails?.displayName,
  );
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );

  const onAcceptPress = () => {
    setIsLoading(prev => ({...prev, acceptLoading: true}));
    const {message, title, data, type} = bookingRequestAccepted;
    let messageDetail = message + ' ' + proUserName;
    toUpdateBookings(statusType.accepted, setModalOpen).then(() => {
      sendNotifications({
        type,
        userIds: [request?.otherUserUId],
        message: messageDetail,
        title,
        data: {
          status: data?.status,
          bookingKey: request?.id,
        },
      });
      setIsLoading(prev => ({...prev, acceptLoading: false}));
    });
  };

  const onDeclinePress = () => {
    setIsLoading(prev => ({...prev, declineLoading: true}));
    const {message, title, data, type} = bookingRequestOnDecline;
    let messageDetail = message + ' ' + proUserName;
    toUpdateBookings(statusType.canceled, setModalOpen).then(() => {
      sendNotifications({
        type,
        userIds: [request?.clientUserUId],
        message: messageDetail,
        title,
        data: {
          status: data?.status,
          bookingKey: request?.id,
        },
      });
      setIsLoading(prev => ({...prev, declineLoading: false}));
      // goBack();
    });
  };

  return (
    <CustomButton
      type="unstyled"
      onPress={onNavigation}
      style={[renderCustomCard.userContainer, {borderWidth: 1}]}>
      {/* ONLY FOR DEVELOPMENT PURPOSE */}
      {/* {__DEV__ && (
        <CustomText
          fontSize={12}
          style={[{left: 10, color: '#7F7F7F', top: 2}]}>
          {`${request?.id} `}
          {`${request?.status}`}
        </CustomText>
      )} */}

      {serverType !== 'LIVE' ? (
        <CustomText
          fontSize={12}
          style={[{left: 10, color: '#7F7F7F', top: 2}]}>
          {`${request?.id} `}
          {`${request?.status}`}
        </CustomText>
      ) : null}
      <View style={renderCustomCard.userImageBox}>
        <Avatar
          style={renderCustomCard.userImage}
          source={
            request?.otherUserProfileImg
              ? {
                  uri: request?.otherUserProfileImg,
                }
              : undefined
          }
        />
        <CustomText
          numberOfLines={2}
          fontSize={15}
          style={renderCustomCard.userBoldDetails}>
          {capitalizeString(request?.otherUserName ?? '')}
        </CustomText>
        {displayBadge && request?.status !== statusType.completed ? (
          <View
            style={[
              renderCustomCard.badge,
              {
                backgroundColor:
                  request?.status == statusType.requested ||
                  badgeText === t('common:onHold')
                    ? '#fac711'
                    : badgeText === t('common:accepted') ||
                      request?.status == statusType.accepted
                    ? '#52b963'
                    : 'transparent',
              },
            ]}>
            <CustomText
              fontSize={badgeText == statusType?.canceled ? 12 : 10}
              style={[
                renderCustomCard.badgeText,
                {
                  color:
                    badgeText == t('common:canceled') ||
                    badgeText == statusType?.canceled
                      ? 'red'
                      : 'black',
                },
              ]}>
              {badgeText == statusType?.canceled
                ? capitalizeString(badgeText)
                : badgeText}
            </CustomText>
          </View>
        ) : request?.rating?.grade || request?.rating ? (
          <>
            <CustomButton
              disabledWithoutOpacity={uid !== request?.clientUserUId}
              // disabledWithoutOpacity
              onPress={() => {
                if (uid == request?.clientUserUId) {
                  navigate(rootStackName.SCREEN_STACK, {
                    screen: screenStackName.BOOKING_RATINGS,
                    params: {
                      screenName: 'CustomCard',
                      imageUrl: request?.otherUserProfileImg,
                      name: request?.otherUserName,
                      proId: request?.proUserUId,
                      orderId: request?.id,
                    },
                  });
                }
              }}
              type="unstyled"
              style={[
                // renderCustomCard.bookingsBtn,
                renderCustomCard.rateProBtn,
                {justifyContent: 'flex-end', marginVertical: 0},
              ]}
              textProps={{style: renderCustomCard.btnText}}>
              <StarIcon type={'full'} size={25} color={colors?.yellow} />
              <CustomText
                style={{marginStart: 5}}
                fontFamily="openSansRegular"
                fontSize={15}>
                {
                  String(
                    Number(request?.rating?.grade ?? request?.rating).toFixed(
                      1,
                    ),
                  )
                  // existingReview?.rating ??
                  // t('common:rateThePro')
                }
              </CustomText>
            </CustomButton>
          </>
        ) : null}
      </View>
      <View style={renderCustomCard.iconBox}>
        <FontAwesome6
          name="bell-concierge"
          size={20}
          color={colors.primary}
          style={renderCustomCard.iconBell}
        />
        <CustomText fontSize={14} style={renderCustomCard.userDetails}>
          {request?.orderDetails?.serviceName}
        </CustomText>
      </View>
      <View style={[renderCustomCard.iconBox, {left: 4}]}>
        <FontAwesome
          name="dollar"
          size={20}
          color={colors.primary}
          style={renderCustomCard.iconDollar}
        />
        <CustomText fontSize={14} style={renderCustomCard.userDetails}>
          {getCurrencySymbol(request?.default_currency) +
            ` ${
              badgeText === t('common:onHold') ||
              badgeText === t('common:accepted') ||
              request?.clientUserUId == uid
                ? Math.abs(Number(request?.orderDetails?.servicePrice)).toFixed(
                    2,
                  )
                : request?.orderDetails?.servicePrice
            }`}
        </CustomText>
      </View>
      <Pressable
        style={[renderCustomCard.iconBox, {left: 3}]}
        onPress={() => setShowMap(true)}>
        <FontAwesome6
          name="location-dot"
          size={20}
          color={colors.primary}
          style={renderCustomCard.iconPin}
        />
        <CustomText
          fontSize={14}
          style={[
            renderCustomCard.userBoldDetails,
            renderCustomCard.userAddress,
          ]}>
          {request?.orderAddress?.completeAddress}
        </CustomText>
      </Pressable>
      <LocationMapOptions
        latitude={request?.orderAddress?.latitude}
        longitude={request?.orderAddress?.longitude}
        isVisible={showMap}
        onClose={() => setShowMap(false)}
      />
      {displayButton ? (
        <View style={[renderCustomCard.btnContainer]}>
          <CustomButton
            disabled={isLoading.acceptLoading}
            onPress={async () => {
              onAcceptPress();
              // const {message, title, data} = bookingRequestAccepted;
              // toUpdateBookings(statusType.accepted).then(() => {
              //   sendNotifications(
              //     [request?.otherUserUId],
              //     message,
              //     title,
              //     data,
              //   );
              // });
              // const {message, title, data, type} = bookingRequestAccepted;

              // toUpdateBookings(statusType.accepted).then(() => {
              //   // goBack();

              //   sendNotifications({
              //     type,
              //     userIds: [request?.otherUserUId],
              //     message,
              //     title,
              //     data: {
              //       status: data?.status,
              //       bookingKey: request?.id,
              //     },
              //   });
              // });
            }}
            style={[
              renderCustomCard.bookingsBtn,
              {
                backgroundColor: '#4fd97a',
              },
            ]}
            textProps={{style: renderCustomCard.btnText}}>
            {t('common:accept')}
          </CustomButton>
          <CustomButton
            disabled={isLoading.declineLoading}
            onPress={() => {
              // setModalOpen(true);
              // showModal({
              //   showCancelButton: true,
              //   message: t('message:cancelBooking'),
              //   successFn: async () => {
              //     toUpdateBookings(statusType.canceled);
              //     const {message, title, data} = bookingRequestOnDecline;

              //     sendNotifications(
              //       [request?.otherUserUId],
              //       message,
              //       title,
              //       data,
              //     );
              //   },
              // });
              showModal({
                showCancelButton: true,
                title: t('common:cancelBooking'),
                message: t('message:cancelBooking'),
                successFn: async () => {
                  setIsLoading(prev => ({...prev, declineLoading: true}));
                  const {message, title, data, type} = bookingRequestOnDecline;
                  let messageDetail = message + ' ' + proUserName;
                  toUpdateBookings(statusType.canceled, setModalOpen).then(
                    () => {
                      sendNotifications({
                        type,
                        userIds: [request?.clientUserUId],
                        message: messageDetail,
                        title,
                        data: {
                          status: data?.status,
                          bookingKey: request?.id,
                        },
                      });
                      setIsLoading(prev => ({...prev, declineLoading: false}));
                      // goBack();
                    },
                  );
                  // toUpdateBookings(statusType.canceled);
                  // const {message, title, data, type} = bookingRequestOnDecline;

                  // sendNotifications({
                  //   type,
                  //   userIds: [request?.otherUserUId],
                  //   message,
                  //   title,
                  //   data: {
                  //     status: data?.status,
                  //     bookingKey: request?.id,
                  //   },
                  // });
                },
              });
            }}
            style={[customBoxStyle.bookingBtn, {backgroundColor: colors?.red}]}
            textProps={{style: customBoxStyle.btnText}}>
            {t('common:decline')}
          </CustomButton>
        </View>
      ) : null}
      {request?.status == statusType?.completed &&
        request?.clientUserUId == uid &&
        !request?.rating?.grade &&
        !request?.rating && (
          // existingReview == null &&
          <CustomButton
            // isLoading={isLoading}
            onPress={() => {
              navigate(rootStackName.SCREEN_STACK, {
                screen: screenStackName.BOOKING_RATINGS,
                params: {
                  screenName: 'CustomCard',
                  imageUrl: request?.otherUserProfileImg,
                  name: request?.otherUserName,
                  proId: request?.proUserUId,
                  orderId: request?.id,
                },
              });
            }}
            type="unstyled"
            style={[renderCustomCard.bookingsBtn, renderCustomCard.rateProBtn]}
            textProps={{style: renderCustomCard.btnText}}>
            <StarIcon type={'empty'} size={25} color={colors?.defaultBlack} />
            <CustomText fontFamily="openSansRegular" fontSize={15}>
              {t('common:rateThePro')}
            </CustomText>
          </CustomButton>
        )}
      {modalOpen && (
        <CancelBookingModal
          disableCancelBtn={isLoading.declineLoading}
          onCancelPress={async () => {
            onDeclinePress();
            // const {message, title, data, type} = bookingRequestOnDecline;
            // let messageDetail = message + ' ' + proUserName;
            // toUpdateBookings(statusType.canceled).then(() => {
            //   sendNotifications({
            //     type,
            //     userIds: [request?.otherUserUId],
            //     message: messageDetail,
            //     title,
            //     data: {
            //       status: data?.status,
            //       bookingKey: request?.id,
            //     },
            //   });
            // });
          }}
          setModalOpen={setModalOpen}
          modalOpen={modalOpen}
        />
      )}
    </CustomButton>
  );
};

export default CustomCard;
