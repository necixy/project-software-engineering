import moment from 'moment';
import React, {useLayoutEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {sendNotifications} from 'src/api/notification/notification';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import StarIcon from 'src/shared/components/ratingComponent/src/StarIcon';
import {
  bookingCompleted,
  bookingRequestAccepted,
  bookingRequestCanceled,
  bookingRequestOnDecline,
} from 'src/shared/notificationPayload/NotificationPayload';
import {colors} from 'src/theme/colors';
import {capitalizeString} from 'src/utils/developmentFunctions';
import CancelBookingModal from '../component/CancelBookingModal';
import customBoxStyle from '../component/CustomBox.style';
import renderCustomCard from '../component/CustomCard.style';
import {statusType} from '../component/RequestsJSON';
import LocationMapOptions from '../component/locationMapOptions/LocationMapOptions';
import useRequestDetails from './useRequestDetails';
import CompleteMissionModal from '../component/CompleteMissionModal';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {setGestureState} from 'react-native-reanimated';
import {debounce} from 'src/utils/useDebounce';
import {useAppSelector} from 'src/redux/reducer/reducer';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {getCurrencySymbol} from 'src/utils/getCurrencySymbol';

const RequestDetail = ({
  route,
  navigation,
}: {
  route: {
    params: {
      headingText?: string;
      badgeText?: string;
      displayButton?: boolean;
      displayComplete?: boolean;
      displayCancel?: boolean;
      details?: TBookingHistory;
      displayBadge?: boolean;
    };
  };
  navigation: any;
}) => {
  const {
    userDetails,
    userType,
    headingText,
    badgeText,
    displayBadge,
    displayButton,
    displayComplete,
    displayCancel,
    details,
    t,
    pop,
    bookingDetails,
    loading,
    modalOpen,
    setModalOpen,
    cancelBooking,
    toUpdateBookings,
    existingReview,
    missionModalOpen,
    setMissionModalOpen,
    showMap,
    setShowMap,
  } = useRequestDetails(route);
  const [isLoading, setIsLoading] = useState({
    acceptLoading: false,
    declineLoading: false,
    cancelLoading: false,
    completeLoading: false,
  });
  console.log({headingText});
  const [missionLoading, setMissionLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const proUserName = useAppSelector(
    state => state?.userReducer?.userDetails?.displayName,
  );
  const {goBack, navigate} = useStackNavigation();
  const onAcceptPress = async () => {
    setIsLoading(prev => ({...prev, acceptLoading: true}));
    const {message, title, data, type} = bookingRequestAccepted;
    let messageDetail = message + ' ' + proUserName;

    await toUpdateBookings(statusType.accepted, setModalOpen).then(() => {
      sendNotifications({
        type,
        userIds: [bookingDetails?.clientUserUId ?? details?.clientUserUId],
        message: messageDetail,
        title,
        data: {
          status: data?.status,
          bookingKey: details?.id,
        },
      });
      setIsLoading(prev => ({...prev, acceptLoading: false}));
    });
  };

  const onDeclinePress = async () => {
    setIsLoading(prev => ({...prev, declineLoading: true}));

    const {message, title, data, type} = bookingRequestOnDecline;
    let messageDetail = message + ' ' + proUserName;
    // debounce(
    await toUpdateBookings(statusType.canceled, setModalOpen).then(() => {
      sendNotifications({
        type,
        userIds: [bookingDetails?.clientUserUId ?? details?.clientUserUId],
        message: messageDetail,
        title,
        data: {
          status: data?.status,
          bookingKey: details?.id,
        },
      });
      // goBack();
      setIsLoading(prev => ({...prev, declineLoading: false}));
    });
    //   5000,
    // );
  };

  const onCancelPress = async () => {
    try {
      setIsLoading(prev => ({...prev, cancelLoading: true}));
      const {message, title, data, type} = bookingRequestCanceled;
      let messageDetail = message + ' ' + proUserName;
      let res = await toUpdateBookings(statusType.canceled, setModalOpen).then(
        () => {
          sendNotifications({
            type,
            userIds: [
              userDetails?.uid ==
              (bookingDetails?.clientUserUId ?? details?.clientUserUId)
                ? details?.proUserUId
                : bookingDetails?.clientUserUId ?? details?.clientUserUId,
            ],
            message: messageDetail,
            title,
            data: {
              status: data?.status,
              canceledBy:
                userDetails?.uid == bookingDetails?.clientUserUId ||
                userDetails?.uid == details?.clientUserUId
                  ? 'client'
                  : 'pro',
            },
          });

          setIsLoading(prev => ({...prev, cancelLoading: false}));
        },
      );
    } catch (error) {
      showModal({message: 'canceled already!'});
    }
  };

  const onCompletePress = async () => {
    setIsLoading(prev => ({...prev, completeLoading: true}));

    await toUpdateBookings(statusType.completed, setModalOpen).then(() => {
      const {message, title, data, type} = bookingCompleted;
      let messageDetail = message + ' ' + proUserName;

      sendNotifications({
        type,
        userIds: [bookingDetails?.clientUserUId ?? details?.clientUserUId],
        message: messageDetail,
        title,
        data: {
          status: data?.status,
          bookingKey: details?.id,
        },
      });
      setMissionLoading(false);
      setIsLoading(prev => ({...prev, completeLoading: true}));
    });
  };

  useLayoutEffect(() => {
    navigation?.setOptions({
      header: () => (
        <CustomHeader
          headerContainer={{
            alignItems: 'center',
          }}
          leftIconColor="black"
          back
          titleStyle={{width: '100%'}}
          fontFamily={
            //   bookingDetails?.proUserUId == userDetails?.uid &&
            //   (bookingDetails?.status == statusType.accepted ||
            //     bookingDetails?.status == statusType.accepted)
            //     ? 'openSansBold'
            //     : bookingDetails?.proUserUId == userDetails?.uid &&
            //       (bookingDetails?.status == statusType.accepted ||
            //         bookingDetails?.status == statusType.accepted)
            //     ? 'fredokaSemiBold'
            //     : 'arialBold'
            // }
            route?.params?.headingText == t('common:bookingDetails')
              ? 'fredokaSemiBold'
              : 'openSansBold'
          }
          fontSize={20}
          lineHeight={30}
          titleColor={
            route?.params?.headingText == t('common:bookingDetails')
              ? 'blue'
              : 'black'
          }
          rightIcon
          title={
            // bookingDetails?.clientUserUId == userDetails?.uid &&
            // (bookingDetails?.status == statusType?.requested ||
            //   bookingDetails?.status == statusType?.accepted)?

            route?.params?.headingText == t('common:bookingDetails')
              ? t('common:vita')
              : route?.params?.headingText
          }
          navigation={navigation}
        />
      ),
    });
  }, []);

  console.log(details?.default_currency);

  return (
    <Container isLoading={loading}>
      <View style={customBoxStyle.requestContainer}>
        <Avatar
          style={customBoxStyle.userImage}
          source={
            details?.otherUserProfileImg || bookingDetails?.photoUrl
              ? {
                  uri: details?.otherUserProfileImg ?? bookingDetails?.photoUrl,
                }
              : undefined
          }
        />
        <CustomText fontSize={15} style={customBoxStyle.userTitle}>
          {capitalizeString(details?.otherUserName ?? bookingDetails?.name)}
        </CustomText>

        {__DEV__ && (
          <CustomText fontSize={15} style={[customBoxStyle.userTitle]}>
            {details?.id}
          </CustomText>
        )}

        <View style={[customBoxStyle.detailsBox]}>
          <CustomText
            fontSize={16}
            style={[
              customBoxStyle.detailHeading,
              {
                color:
                  headingText == t('common:missions') ||
                  badgeText == t('common:accepted')
                    ? colors?.primary
                    : 'grey',
              },
            ]}>
            {headingText == t('common:requests')
              ? t('common:requestDetails')
              : headingText == t('common:missions')
              ? t('common:missionDetails')
              : headingText ?? t('common:bookingDetails')}
          </CustomText>

          {displayBadge && bookingDetails?.status !== statusType.completed ? (
            <View
              style={[
                renderCustomCard.badge,
                {
                  alignSelf: 'flex-end',
                  backgroundColor:
                    badgeText === t('common:onHold')
                      ? // ||
                        // bookingDetails?.status == statusType.completed
                        '#fac711'
                      : badgeText === t('common:accepted')
                      ? // ||
                        //   bookingDetails?.status == statusType.accepted
                        '#52b963'
                      : 'transparent',
                },
              ]}>
              <CustomText
                fontSize={10}
                style={[
                  renderCustomCard.badgeText,
                  {
                    color:
                      badgeText == t('common:canceled') ||
                      badgeText == statusType?.canceled
                        ? colors?.red
                        : colors?.defaultBlack,
                  },
                ]}>
                {badgeText == statusType?.canceled
                  ? capitalizeString(badgeText)
                  : badgeText}
              </CustomText>
            </View>
          ) : details?.rating?.grade || details?.rating ? (
            <>
              <CustomButton
                disabledWithoutOpacity={
                  userDetails?.uid !== bookingDetails?.clientUserUId
                }
                onPress={() => {
                  if (userDetails?.uid == bookingDetails?.clientUserUId) {
                    navigate(rootStackName.SCREEN_STACK, {
                      screen: screenStackName.BOOKING_RATINGS,
                      params: {
                        screenName: 'RequestDetail',
                        imageUrl: bookingDetails?.photoUrl,
                        name: bookingDetails?.name,
                        proId: bookingDetails?.proUserUId,
                        orderId: bookingDetails?.id,
                      },
                    });
                  }
                }}
                type="unstyled"
                style={[
                  // renderCustomCard.bookingsBtn,
                  renderCustomCard.rateProBtn,
                  {
                    justifyContent: 'flex-end',
                    marginVertical: 0,
                    alignSelf: 'flex-end',
                  },
                ]}
                textProps={{style: renderCustomCard.btnText}}>
                <StarIcon type={'full'} size={25} color={colors?.yellow} />
                <CustomText
                  style={{marginStart: 5}}
                  fontFamily="openSansRegular"
                  fontSize={15}>
                  {
                    details?.rating?.grade ?? details?.rating
                    // existingReview?.rating ??
                    // t('common:rateThePro')
                  }
                </CustomText>
              </CustomButton>
            </>
          ) : null}
          <View style={customBoxStyle.descriptionBox}>
            <FontAwesome6
              name="calendar-check"
              size={20}
              color={colors.primary}
              style={customBoxStyle.iconDate}
            />
            <CustomText fontSize={15} style={customBoxStyle.description}>
              {`${moment(
                // details?.bookingDate?.date
                details?.orderDate?.date,
              ).format('dddd MMMM D')} at ${moment(details?.orderDate?.time, [
                'HH:mm',
              ]).format('h:mm A')} `}
            </CustomText>
          </View>
          <View style={customBoxStyle.descriptionBox}>
            <FontAwesome6
              name="bell-concierge"
              size={20}
              color={colors.primary}
              style={customBoxStyle.iconBell}
            />
            <CustomText fontSize={15} style={customBoxStyle.description}>
              {details?.orderDetails?.serviceName}
            </CustomText>
          </View>
          <View style={[customBoxStyle.descriptionBox, {left: 4}]}>
            <FontAwesome
              name="dollar"
              size={20}
              color={colors.primary}
              style={customBoxStyle.iconDollar}
            />
            <CustomText fontSize={15} style={customBoxStyle.description}>
              {getCurrencySymbol(details?.default_currency) +
                `${
                  badgeText === t('common:onHold') ||
                  badgeText === t('common:accepted') ||
                  headingText === t('common:bookingHistory')
                    ? Math.abs(
                        Number(details?.orderDetails?.servicePrice),
                      ).toFixed(2)
                    : details?.orderDetails?.servicePrice
                }`}
            </CustomText>
          </View>

          <Pressable
            style={[renderCustomCard.iconBox, {left: 3, marginVertical: 15}]}
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
              {details?.orderAddress?.completeAddress}
            </CustomText>
          </Pressable>
          <LocationMapOptions
            latitude={details?.orderAddress?.latitude}
            longitude={details?.orderAddress?.longitude}
            isVisible={showMap}
            onClose={() => setShowMap(false)}
          />
          {details?.note && (
            <View style={customBoxStyle.descriptionBox}>
              <FontAwesome5
                name="edit"
                size={20}
                color={colors.primary}
                style={customBoxStyle.iconEdit}
              />
              <CustomText fontSize={15} style={customBoxStyle.description}>
                {details?.note}
              </CustomText>
            </View>
          )}
          {displayButton ? (
            <View style={customBoxStyle.btnContainer}>
              <CustomButton
                disabled={isLoading?.acceptLoading}
                onPress={async () => {
                  onAcceptPress();
                  // showModal({title: t({})})
                  // const {message, title, data, type} = bookingRequestAccepted;
                  // toUpdateBookings(statusType.accepted).then(() => {
                  //   // pop(2);
                  //   sendNotifications({
                  //     type,
                  //     userIds: [bookingDetails?.clientUserUId],
                  //     message,
                  //     title,
                  //     data: {
                  //       status: data?.status,
                  //       bookingKey: details?.id,
                  //     },
                  //   });
                  //   goBack();
                  // });
                }}
                style={[
                  customBoxStyle.bookingBtn,
                  {
                    backgroundColor: '#4fd97a',
                  },
                ]}
                textProps={{style: customBoxStyle.btnText}}>
                {t('common:accept')}
              </CustomButton>
              <CustomButton
                disabled={isLoading?.declineLoading}
                onPress={() => {
                  // setDeclineByPro(true);
                  setModalOpen(true);

                  // showModal({
                  //   showCancelButton: true,
                  //   message: t('message:cancelBooking'),
                  //   successFn: async () => {
                  //     setStatusLoading(true);
                  //     const {message, title, data} = bookingRequestOnDecline;
                  //     toUpdateBookings(statusType.canceled).then(() => {
                  //       sendNotifications(
                  //         [bookingDetails?.clientUserUId],
                  //         message,
                  //         title,
                  //         data,
                  //       );
                  //       goBack();
                  //       setStatusLoading(false);
                  //     });
                  //   },
                  // });
                }}
                style={[
                  customBoxStyle.bookingBtn,
                  {backgroundColor: colors?.red},
                ]}
                textProps={{style: customBoxStyle.btnText}}>
                {t('common:decline')}
              </CustomButton>
              {modalOpen && (
                <CancelBookingModal
                  disableCancelBtn={isLoading.declineLoading}
                  onCancelPress={async () => {
                    setCancelLoading(true);
                    onDeclinePress();
                    // onCancelPress();

                    // const {message, title, data} = bookingRequestOnDecline;
                    // toUpdateBookings(statusType.canceled).then(() => {
                    //   sendNotifications(
                    //     [bookingDetails?.clientUserUId],
                    //     message,
                    //     title,
                    //     data,
                    //   );
                    // });
                  }}
                  setModalOpen={setModalOpen}
                  modalOpen={modalOpen}
                />
              )}
            </View>
          ) : null}
        </View>

        {displayComplete ? (
          <View>
            <CustomButton
              type="white"
              isLoading={missionLoading}
              disabled={missionModalOpen}
              onPress={() => {
                // showModal({
                //   message: t('message:completeBookingMessage'),
                //   secondMessage: t('customWords:confirmServiceCompleted'),
                //   successTitle: t('customWords:completeTheMission'),
                //   cancelTitle: t('common:back'),
                //   successFn() {
                //     onCompletePress();
                //   },
                //   showCancelButton: true,
                //   containerStyle: {
                //     width: SCREEN_WIDTH,
                //     backgroundColor: 'pink',
                //   },
                // });
                // setStatusLoading(true);
                setMissionModalOpen(true);
                // showModal({
                //   title: t('message:completeTheMission'),
                //   message: t('message:confirmOnlyWhenServiceFullyCompleted'),
                //   successFn: async () => {
                //     toUpdateBookings(statusType.completed).then(() => {
                //       // goBack();
                //     });
                //   },
                //   showCancelButton: true,
                // });
              }}
              style={[customBoxStyle.bookingCancel]}
              textProps={{
                style: [customBoxStyle.cancelText, {color: colors?.primary}],
              }}>
              {t('customWords:completeTheMission')}
            </CustomButton>
            {missionModalOpen && (
              <CompleteMissionModal
                disableCompleteBtn={isLoading?.completeLoading}
                setModalOpen={setMissionModalOpen}
                modalOpen={missionModalOpen}
                successFn={() => {
                  // setMissionLoading(true);
                  // showModal({
                  //   message: t('message:completeBookingMessage'),
                  //   secondMessage: t('customWords:confirmServiceCompleted'),
                  //   successTitle: t('customWords:completeTheMission'),
                  //   cancelTitle: t('common:back'),
                  // });
                  onCompletePress();
                  // toUpdateBookings(statusType.completed).then(() => {
                  //   const {message, title, data, type} = bookingCompleted;
                  //   sendNotifications({
                  //     type,
                  //     userIds: [bookingDetails?.clientUserUId],
                  //     message,
                  //     title,
                  //     data: {
                  //       status: data?.status,
                  //       bookingKey: details?.id,
                  //     },
                  //   });
                  // });
                }}
              />
            )}
          </View>
        ) : bookingDetails?.status == statusType?.completed &&
          bookingDetails?.clientUserUId == userDetails?.uid &&
          !details?.rating?.grade &&
          !details?.rating ? (
          <CustomButton
            onPress={() => {
              navigate(rootStackName.SCREEN_STACK, {
                screen: screenStackName.BOOKING_RATINGS,
                params: {
                  screenName: 'RequestDetail',
                  imageUrl: bookingDetails?.photoUrl,
                  name: bookingDetails?.name,
                  proId: bookingDetails?.proUserUId,
                  orderId: bookingDetails?.id,
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
        ) : null}

        {displayCancel ? (
          <View>
            <CustomButton
              type="white"
              isLoading={cancelLoading}
              disabled={modalOpen}
              onPress={() => {
                setModalOpen(true);
              }}
              style={[customBoxStyle.bookingCancel, {marginTop: 10}]}
              textProps={{
                style: customBoxStyle.cancelText,
              }}>
              {t('common:cancelBooking')}
            </CustomButton>
            {modalOpen && (
              <CancelBookingModal
                disableCancelBtn={isLoading.cancelLoading}
                onCancelPress={async () => {
                  true;
                  onCancelPress();

                  // const {message, title, data} = bookingRequestOnDecline;
                  // toUpdateBookings(statusType.canceled).then(() => {
                  //   sendNotifications(
                  //     [bookingDetails?.clientUserUId],
                  //     message,
                  //     title,
                  //     data,
                  //   );
                  // });
                }}
                setModalOpen={setModalOpen}
                modalOpen={modalOpen}
              />
            )}
          </View>
        ) : null}
        {/* {modalOpen && (
          <CancelBookingModal
            onCancelPress={async () => {
              const {message, title, data, type} = bookingRequestCanceled;
              toUpdateBookings(statusType.canceled).then(() => {
                sendNotifications({
                  type,
                  userIds: [
                    userDetails?.uid == bookingDetails?.clientUserUId
                      ? details?.proUserUId
                      : bookingDetails?.clientUserUId,
                  ],
                  message,
                  title,
                  data: {
                    status: data?.status,
                    canceledBy:
                      userDetails?.uid == bookingDetails?.clientUserUId
                        ? 'client'
                        : 'pro',
                  },
                });
              });
            }}
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
          />
        )} */}
      </View>
    </Container>
  );
};

export default RequestDetail;
