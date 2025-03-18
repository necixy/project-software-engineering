import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Platform, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {IS_IOS, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import useProfileHeaderButtons from './useProfileHeaderButtons';
import BottomSheetPicker from 'src/shared/components/customPicker/BottomSheetPicker';
import {globalStyles} from 'src/constants/globalStyles.style';
import CustomText from 'src/shared/components/customText/CustomText';

const ProfileHeaderButtons = ({
  // setModalOpen,
  proUid: opponentUserId,
  proData,
}: {
  // setModalOpen: SetStateAction<boolean> | any;
  proUid: string;
  proData?: any;
}) => {
  const [proUserData, setProUserData] = useState(proData!);
  // const loginUserUid: any = firebase.auth().currentUser?.uid;
  // const channelId = useMemo(() => {
  //   if (proData) {
  //     if (proData?.channels) {
  //       for (let id in proData?.channels) {
  //         if (
  //           Object.keys(proData?.channels[id]?.participants ?? {}).includes(
  //             loginUserUid,
  //           )
  //         ) {
  //           return id ?? '';
  //         }
  //       }
  //     }
  //   }
  //   return '';
  // }, [proData?.channels, loginUserUid]);

  const {navigate} = useNavigation<any>();
  const {t} = useTranslation();

  const {
    isButtonLoading,
    uid,
    handleFollow,
    isFollowing,
    handleUserFunctions,
    modalOpen,
    setModalOpen,
    // userFunctionsList,
    userFunctionStatus,
    setUserFunctionStatus,
  } = useProfileHeaderButtons(opponentUserId!, 'following');

  return proData! || proUserData ? (
    <>
      <View
        style={{
          flexDirection: 'row',
          width: SCREEN_WIDTH * 0.94,
          alignItems: 'center',
          height: 35,
          marginVertical: 10,
          // borderWidth: 1,
        }}>
        {/* Pro User Follow button */}
        <CustomButton
          // isLoading={isButtonLoading}
          textProps={{
            style: {
              fontFamily: fonts?.openSansBold,
              color: isFollowing ? colors?.defaultBlack : colors?.secondary,
            },
          }}
          type={isFollowing ? 'grey' : 'blue'}
          alignSelf="stretch"
          // onPress={() => {
          //   setModalOpen && setModalOpen(true);
          // }}
          onPress={handleFollow}
          style={{flex: 1, marginEnd: 5, height: 30}}>
          {isFollowing ? t('common:following') : t('common:follow')}
        </CustomButton>
        {/* <CustomButton
          isLoading={isButtonLoading?.followLoading}
          textProps={{
            style: {
              fontFamily: IS_IOS ? fonts?.openSansBold : fonts.arialBold,
              color: isFollowing ? colors?.defaultBlack : colors?.secondary,
            },
          }}
          type={isFollowing ? 'grey' : 'blue'}
          alignSelf="stretch"
          // onPress={() => {
          //   // setModalOpen && setModalOpen(true);
          // }}
          onPress={handleFollow}
          style={{
            flex: 1,
            marginEnd: 5,
            marginBottom: 5,
            flexDirection: 'row',
          }}>
          <>
            {/* <IonIcons
                  name="chevron-down"
                  color={isFollowing ? colors?.defaultBlack : colors?.secondary}
                  style={{marginEnd: 10}}
                /> */}
        {/* <CustomText
              style={{
                fontFamily: IS_IOS ? fonts?.openSansBold : fonts.arialBold,
                color: isFollowing ? colors?.defaultBlack : colors?.secondary,
              }}>
              {isFollowing ? t('common:following') : t('common:follow')}
            </CustomText>
          </>
        </CustomButton> */}
        {/* <BottomSheetPicker
          adjustToContentHeight={true}
          // keyboardAvoidingBehavior={
          //   Platform.OS == 'ios' ? 'padding' : 'padding'
          // }
          modalStyle={{
            borderWidth: 1,
            // marginTop: 100,
            bottom: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
            // paddingHorizontal: 20,
            // bottom: Platform?.OS == 'ios' ? 20 : 30,
          }}
          onClose={() => setModalOpen(false)}
          isOpen={modalOpen}
          pressableStyle={{flex: 1.2, alignSelf: 'flex-start'}}
          actionElement={
            <CustomButton
              isLoading={isButtonLoading?.followLoading}
              textProps={{
                style: {
                  fontFamily: IS_IOS ? fonts?.openSansBold : fonts.arialBold,
                  color: isFollowing ? colors?.defaultBlack : colors?.secondary,
                },
              }}
              type={isFollowing ? 'grey' : 'blue'}
              alignSelf="stretch"
              // onPress={() => {
              //   // setModalOpen && setModalOpen(true);
              // }}
              onPress={handleFollow}
              style={{
                flex: 1,
                marginEnd: 5,
                marginBottom: 5,
                flexDirection: 'row',
              }}>
              <>
                <CustomText
                  style={{
                    fontFamily: IS_IOS ? fonts?.openSansBold : fonts.arialBold,
                    color: isFollowing
                      ? colors?.defaultBlack
                      : colors?.secondary,
                  }}>
                  {isFollowing ? t('common:following') : t('common:follow')}
                </CustomText>
              </>
            </CustomButton>
          }
          HeaderComponent={
            <View style={[globalStyles.alignCenter, globalStyles.mv2]}>
              <CustomText fontSize={15}> {proData?.displayName}</CustomText>
            </View>
          }
          flatListProps={{
            data: userFunctionStatus,
            ItemSeparatorComponent: () => <View style={{height: 5}} />,
            contentContainerStyle: {marginBottom: 40},
            renderItem: ({item, index}) => {
              return (
                <CustomButton
                  isLoading={
                    item?.id == 1
                      ? isButtonLoading?.followLoading
                      : item?.id == 2
                      ? isButtonLoading?.blockLoading
                      : item?.id == 3
                      ? isButtonLoading?.reportLoading
                      : false
                  }
                  type="white"
                  textProps={{
                    style: {
                      color:
                        item?.status || (item?.name == 'follow' && isFollowing)
                          ? colors?.grey
                          : colors?.primary,
                    },
                  }}
                  style={{paddingVertical: 2}}
                  onPress={() => {
                    handleUserFunctions(item);
                    // Alert.alert(`${item?.label}`);
                  }}>
                  {(item?.name == 'follow' && isFollowing) || item?.status
                    ? item?.label2
                    : item?.label1}
                </CustomButton>
              );
            },
          }}
        /> */}

        {/* Pro User Booking Screen Navigation button */}
        <CustomButton
          textProps={{
            style: {fontFamily: IS_IOS ? fonts?.openSansBold : fonts.arialBold},
          }}
          hitSlop={10}
          alignSelf="stretch"
          onPress={() => {
            navigate(rootStackName.SCREEN_STACK, {
              screen: screenStackName.USER_BOOKING_MENU,
              params: {
                name: proData?.displayName! ?? proUserData?.displayName!,
                profile: proData?.photoURL! ?? proUserData?.photoURL!,
                uid: opponentUserId!,
                rating: proData?.rating! ?? proUserData?.rating!,
                fcmTokens: proData?.fcmTokens! ?? proUserData?.fcmTokens!,
                default_currency: proData?.default_currency!,
              },
            });
          }}
          style={{flex: 1, marginEnd: 5, height: 30}}>
          {t('common:booking')}
        </CustomButton>
        <CustomButton
          onPress={() => {
            if (isFollowing) {
              navigate(rootStackName.SCREEN_STACK, {
                screen: screenStackName.Chat,
                params: {
                  name: proData?.displayName! ?? proUserData?.displayName!,
                  profile: proData?.photoURL! ?? proUserData?.photoURL!,
                  uid: opponentUserId,
                  channelId: null,
                },
              });
            } else {
              showModal({message: t('message:followUserBeforeChat')});
            }
          }}
          hitSlop={10}
          type="unstyled"
          style={{
            backgroundColor: colors?.lightGrey,
            borderRadius: 7,
            height: 30,
            // flex: 0.3,
            width: 30,
          }}>
          <IonIcons
            name="paper-plane-outline"
            color={colors?.defaultBlack}
            size={20}
          />
        </CustomButton>
      </View>
    </>
  ) : (
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
  );
};
export default ProfileHeaderButtons;
