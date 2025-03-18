import React from 'react';
import {FlatList, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'src/assets/svg';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import DeleteAccountModal from '../../component/DeleteAccountModal';
import UserRenderItem from '../../component/UserRenderItem';
import useUserSetting from './useUserSetting';
import DeleteModalComponent from 'src/screens/home/customFeedPostComponent/DeleteModalComponent';
import CustomModalComponent from 'src/shared/components/customModalComponent/CustomModalComponent';

const UserSetting = () => {
  const {
    t,
    navigation,
    handleNavigation,
    showSubList,
    setShowSubList,
    dispatch,
    userType,
    modalOpen,
    setModalOpen,
    deleteUserAccount,
  } = useUserSetting();

  const profileScreenType =
    userType === 'pro'
      ? [
          {
            id: 2,
            icon: (
              <Fontisto
                name="bell"
                style={{marginStart: 2}}
                size={18}
                color={colors?.defaultBlack}
              />
            ),
            name: t('common:notifications'),
            navigation: screenStackName.CLIENT_NOTIFICATIONS,
          },
          {
            id: 3,
            icon: (
              <Ionicons
                name="language"
                style={{marginStart: 2}}
                size={18}
                color={colors?.defaultBlack}
              />
            ),
            name: t('common:language'),
            navigation: null,
            // navFunction: () => {
            //   dispatch(updateUserLanguage('en'));
            // },
            subList: [
              {
                id: 5,
                name: t('customWords:french'),
              },
            ],
          },
          {
            id: 4,
            icon: (
              <MaterialCommunity
                name="history"
                size={20}
                color={colors?.defaultBlack}
              />
            ),
            name: t('common:bookingHistory'),
            navFunction: () => {
              navigation.navigate(screenStackName.BOOKING_HISTORY, {
                headerName: t('common:bookingHistory'),
              });
            },
          },
        ]
      : [
          {
            id: 1,
            icon: (
              <View
                style={{
                  width: 19,
                  height: 19,
                  borderWidth: 1.5,
                  borderColor: colors?.defaultBlack,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="userOutline"
                  width={18}
                  height={18}
                  stroke={colors?.defaultBlack}
                  color={colors?.defaultBlack}
                />
              </View>
            ),
            name: t('common:editProfile'),
            navigation: screenStackName.EDIT_CLIENT_PROFILE,
            // navigation: null,
          },
          {
            id: 2,
            icon: (
              <Fontisto
                name="bell"
                style={{marginStart: 2}}
                size={18}
                color={colors?.defaultBlack}
              />
            ),
            name: t('common:notifications'),
            navigation: screenStackName.CLIENT_NOTIFICATIONS,
          },
          {
            id: 3,
            icon: (
              <Ionicons
                name="language"
                style={{marginStart: 2}}
                size={18}
                color={colors?.defaultBlack}
              />
            ),
            name: t('common:language'),
            navigation: null,
            // navFunction: () => {
            //   dispatch(updateUserLanguage('en'));
            // },
            subList: [
              {
                id: 5,
                name: t('customWords:french'),
              },
            ],
          },
          {
            id: 4,
            icon: (
              <MaterialCommunity
                name="history"
                size={20}
                color={colors?.defaultBlack}
              />
            ),
            name: t('common:bookingHistory'),
            navFunction: () => {
              navigation.navigate(screenStackName.BOOKING_HISTORY, {
                headerName: t('common:bookingHistory'),
              });
            },
          },
        ];

  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{paddingHorizontal: 20}}>
      <FlatList
        contentContainerStyle={{
          marginTop: 20,
          paddingHorizontal: 16,
          flex: 1,
        }}
        data={profileScreenType}
        ItemSeparatorComponent={() => (
          <View style={{width: SCREEN_WIDTH, height: 6}} />
        )}
        renderItem={({item}) => (
          <UserRenderItem
            item={item}
            showSubList={showSubList}
            setShowSubList={setShowSubList}
            onPressHandle={() => handleNavigation(item)}
          />
        )}
        keyExtractor={(item, index) => item?.id?.toString() ?? ''}
        ListFooterComponentStyle={{
          bottom: 10,
          position: 'absolute',
          width: '100%',
        }}
        ListFooterComponent={
          <CustomButton
            type="unstyled"
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginVertical: 10,
            }}
            onPress={() => {
              setModalOpen(true);
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <FontAwesome
                name="trash"
                color={colors?.red}
                style={{marginEnd: 12, marginStart: 3}}
                size={21}
              />
              <CustomText
                fontSize={16}
                fontFamily="arial"
                color={'red'}
                // style={{lineHeight: 20}}
              >
                {t('customWords:deleteAccount')}
              </CustomText>
            </View>
            <Entypo
              name="chevron-thin-right"
              size={20}
              color={colors?.defaultBlack}
            />
          </CustomButton>
        }
      />
      {modalOpen && (
        <CustomModalComponent
          title={`${t('customWords:deleteAccount')}?`}
          message={t('message:deleteAccount')}
          setModalOpen={setModalOpen}
          modalOpen={modalOpen}
          onPress={deleteUserAccount}
        />
        // <DeleteAccountModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
      )}
    </Container>
  );
};

export default UserSetting;
