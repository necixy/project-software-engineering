import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Share, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {goBack} from 'react-navigation-helpers';
import {IS_IOS, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import {searchStackName} from 'src/navigation/constant/searchStackRouteName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import ProfileHeaderButtons from './component/ProfileHeaderButtons';
import useViewProfileHeader from './useViewProfileHeader';
import BottomSheetPicker from 'src/shared/components/customPicker/BottomSheetPicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import CustomModalComponent from 'src/shared/components/customModalComponent/CustomModalComponent';

const ViewProfileHeader = (uid: string, params: any) => {
  const [followersCount, setFollowersCount] = useState(0);
  const {
    t,
    data,
    modalOpen,
    setModalOpen,
    userFunctionStatus,
    // setUserFunctionStatus,
    handleUserFunctions,
    isButtonLoading,
    setIsButtonLoading,
    reported,
    setReported,
    reportModal,
    setReportModal,
    reportSuccessModal,
    setReportSuccessModal,
    handleReportedPro,
  } = useViewProfileHeader(uid);

  const {navigate, replace} = useStackNavigation();

  const [like, setLike] = useState(0);

  const getLikeCount = async () => {
    try {
      await databaseRef(`likes/${uid}`).on('value', snapshot => {
        if (snapshot.exists()) {
          let data = Object.values(snapshot.val()).flat();
          const getCounts = objects => {
            const keysArray = [];

            objects.forEach(obj => {
              keysArray.push(...Object.keys(obj));
            });
            // console.log(keysArray, 'array');
            return keysArray.length;
          };

          const count = getCounts(data);
          setLike(count);
        } else {
          setLike(0);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  const isFocused = useIsFocused();
  const getFollowersCount = async () => {
    try {
      databaseRef(`followers/${uid}/count`).on('value', snapshot => {
        if (snapshot.exists()) {
          setFollowersCount(snapshot.val());
        } else {
          setFollowersCount(0);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLikeCount();
    getFollowersCount();
    return () => {
      databaseRef(`followers/${uid}/count`).off('value');
      databaseRef(`likes/${uid}`).off('value');
    };
  }, [uid, isFocused]);

  return (
    <>
      <CustomHeader
        headerContainer={{
          marginTop: -5,
          alignItems: 'center',
        }}
        title="Vita"
        // back
        // titleStyle={{alignSelf: 'center', marginEnd: 20}}
        leftIconColor="blue"
        leftIcon={
          <CustomButton
            style={[{marginStart: 10}]}
            type="unstyled"
            onPress={() => {
              params?.route?.params?.userId
                ? replace(searchStackName.SEARCH)
                : goBack();
            }}>
            <Entypo name="chevron-left" size={24} color={colors?.primary} />
          </CustomButton>
        }
        // leftIconStyle={{alignSelf: 'center'}}
        fontSize={24}
        fontFamily={fonts?.fredokaSemiBold}
        lineHeight={30}
        rightIcon={
          <Feather
            name="more-horizontal"
            color={colors?.primary}
            size={20}
            // style={{borderWidth: 1, marginTop: 10}}
          />
        }
        // handleRight={handleShare}
        handleRight={() => {
          setModalOpen(true);
        }}
      />
      <BottomSheetPicker
        adjustToContentHeight={true}
        modalStyle={{
          // borderWidth: 1,
          bottom: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 20,
          zIndex: 999,
        }}
        onClose={() => setModalOpen(false)}
        isOpen={modalOpen}
        pressableStyle={{flex: 1.2, alignSelf: 'flex-start'}}
        flatListProps={{
          data: userFunctionStatus,
          ItemSeparatorComponent: () => <View style={{height: 5}} />,
          contentContainerStyle: {marginBottom: 40},
          renderItem: ({item, index}) => {
            return (
              <CustomButton
                isLoading={isButtonLoading}
                type="white"
                // textProps={{
                //   style: {
                //     color: item?.status ? colors?.grey : colors?.primary,
                //   },
                // }}
                style={{
                  paddingHorizontal: 0,
                  paddingVertical: 2,
                  flexDirection: 'row',
                  // borderWidth: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => {
                  handleUserFunctions(item);
                }}>
                {item?.name == 'share' ? (
                  <FontAwesome
                    name="send"
                    size={21}
                    color={colors?.primary}
                    style={{marginEnd: 10}}
                  />
                ) : (
                  <FontAwesome5Icon
                    name="font-awesome-flag"
                    size={21}
                    color={reported ? colors?.primary : colors?.grey}
                    style={{marginEnd: 10}}
                  />
                )}
                <CustomText
                  fontFamily="openSansBold"
                  style={{
                    color:
                      reported && item?.name == 'report'
                        ? colors.primary
                        : colors?.grey,
                  }}>
                  {reported && item?.name == 'report'
                    ? item?.label2
                    : item?.label1}
                </CustomText>
              </CustomButton>
            );
          },
        }}
      />
      {reportModal ? (
        <CustomModalComponent
          title={`${t('customWords:report')}?`}
          message={t('message:reportPostMsg')}
          setModalOpen={setReportModal}
          modalOpen={reportModal}
          successBtnTitle={t('customWords:report')}
          onPress={handleReportedPro}
        />
      ) : reportSuccessModal ? (
        <CustomModalComponent
          title={`${t('customWords:thankyou')}!`}
          message={t('message:reportSuccess')}
          setModalOpen={setReportSuccessModal}
          modalOpen={reportSuccessModal}
          successBtnTitle={t('customWords:ok')}
          onPress={() => {
            setReportSuccessModal(false);
            // setDeleteModalVisible(false);
          }}
          showCancelBtn={false}
          successBtnColor={colors?.primary}
        />
      ) : null}
      <Container
        contentContainerStyle={[
          {
            backgroundColor: colors?.secondary,
            alignItems: 'center',
            justifyContent: 'center',
          },
          globalStyles?.ph2,
        ]}>
        <Avatar
          source={
            data?.photoURL
              ? {
                  uri: data?.photoURL,
                }
              : undefined
          }
          style={{width: 100, height: 100, zIndex: 99, borderRadius: 50}}
        />

        {/* {__DEV__ && (
          <CustomText
            fontSize={9}
            numberOfLines={2}
            color="lightGrey"
            fontFamily="openSansBold"
            style={{
              marginVertical: 10,
              textAlign: 'center',
              marginHorizontal: 10,
            }}>
            {uid}
          </CustomText>
        )} */}

        <CustomText
          fontSize={15}
          numberOfLines={2}
          color="defaultBlack"
          fontFamily="openSansBold"
          style={{
            marginVertical: 10,
            textAlign: 'center',
            marginHorizontal: 10,
          }}>
          {data?.displayName}
        </CustomText>

        <View style={[globalStyles?.flexRow, {width: '100%', height: 70}]}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: (SCREEN_WIDTH * 0.8) / 3,
              height: '80%',
            }}>
            <>
              <CustomText
                color="defaultBlack"
                fontFamily="arialBold"
                fontSize={18}
                style={{marginBottom: 2}}>
                {`${data?.rating ? Number(data.rating).toFixed(1) : '-'}`}
              </CustomText>
              <CustomButton type="unstyled" style={{alignSelf: 'center'}}>
                <CustomText color="grey" fontFamily="arial" fontSize={12}>
                  {t('common:stars')}
                </CustomText>
              </CustomButton>

              <View
                style={{
                  width: 1,
                  height: 10,
                  backgroundColor: 'grey',
                  position: 'absolute',
                  top: '40%',
                  right: 0,
                }}
              />
            </>
          </View>
          <CustomButton
            hitSlop={30}
            type="unstyled"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: (SCREEN_WIDTH * 0.8) / 3,
              height: '80%',
              zIndex: 999,
            }}
            onPress={() => {
              navigate(searchStackName.FOLLOWERS, {
                uid,
              });
            }}>
            <>
              <CustomText
                color="defaultBlack"
                fontFamily="arialBold"
                fontSize={18}
                style={{marginBottom: 2}}>
                {followersCount || 0}
              </CustomText>
              <View style={{alignSelf: 'center'}}>
                <CustomText color="grey" fontFamily="arial" fontSize={12}>
                  {t('common:followers')}
                </CustomText>
              </View>

              <View
                style={{
                  width: 1,
                  height: 10,
                  backgroundColor: 'grey',
                  position: 'absolute',
                  top: '40%',
                  right: 0,
                }}
              />
            </>
          </CustomButton>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: (SCREEN_WIDTH * 0.8) / 3,
              height: '80%',
            }}>
            <>
              <CustomText
                color="defaultBlack"
                fontFamily="arialBold"
                fontSize={18}
                style={{marginBottom: 2}}>
                {like}
              </CustomText>
              <CustomButton type="unstyled" style={{alignSelf: 'center'}}>
                <CustomText color="grey" fontFamily="arial" fontSize={12}>
                  {t('common:likes')}
                </CustomText>
              </CustomButton>
            </>
          </View>
        </View>

        <ProfileHeaderButtons
          // setModalOpen={setModalOpen}
          proUid={uid}
          proData={data}
        />
        {/* 
        <BottomSheetPicker
          adjustToContentHeight={true}
          keyboardAvoidingBehavior={
            Platform.OS == 'ios' ? 'padding' : 'padding'
          }
          modalStyle={{
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
          actionElement={
            <ProfileHeaderButtons
              setModalOpen={setModalOpen}
              proUid={uid}
              proData={data}
            />
            // <TouchableOpacity
            //   onPress={() => setModalOpen(true)}
            //   style={{margin: 2, marginHorizontal: 10}}>
            //   <CustomText fontFamily="openSansRegular" fontSize={10} color="grey">
            //     comments
            //   </CustomText>
            // </TouchableOpacity>
          }
          HeaderComponent={
            <View style={[globalStyles.alignCenter, globalStyles.mv2]}>
              <CustomText fontSize={15}> {data?.displayName}</CustomText>
            </View>
          }
          flatListProps={{
            data: userFunctionsList,
            ItemSeparatorComponent: () => <View style={{height: 5}} />,
            contentContainerStyle: {marginBottom: 40},

            renderItem: ({item, index}) => {
              return (
                <CustomText onPress={() => {

                }}
                // textProps={{
                //   style: {
                //     backgroundColor: 'pink',
                //     margin: 0,
                //     padding: 0,
                //   },
                // }}
                // type="unstyled"
                // style={{
                //   borderWidth: 1,
                //   backgroundColor: 'orange',
                //   margin: 0,
                //   padding: 0,
                // }}
                >
                  {item?.label}
                </CustomText>
              );
            },
          }}
        /> */}

        {data?.bio && (
          <CustomText
            textAlign="center"
            fontFamily="arial"
            style={{alignSelf: 'center', marginVertical: 24}}>
            {data?.bio}
          </CustomText>
        )}
      </Container>
    </>
  );
};
export default ViewProfileHeader;
