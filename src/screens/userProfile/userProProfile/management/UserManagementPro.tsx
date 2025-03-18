import React from 'react';
import {View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Icon from 'src/assets/svg';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {colors} from 'src/theme/colors';
import {capitalizeString} from 'src/utils/developmentFunctions';
import LogoutModal from '../../component/LogoutModal';
import UserRenderItem from '../../component/UserRenderItem';
import useManagementPro from './useManagementPro';

const UserManagementPro = () => {
  const {
    t,
    handleNavigate,
    userDetails,
    modalOpen,
    setModalOpen,
    dispatch,
    navigate,
    goBack,
  } = useManagementPro();

  const managementScreenType = [
    {
      id: 1,
      icon: (
        <View
          style={{
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: colors?.defaultBlack,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Octicons name="three-bars" size={10} color={colors?.defaultBlack} />
        </View>
      ),
      name: t('common:manageMenu'),
      navigation: screenStackName.MANAGE_MENU,
    },
    {
      id: 2,
      icon: (
        <MaterialCommunity
          name="calendar-outline"
          size={20}
          color={colors?.defaultBlack}
        />
      ),
      name: t('common:manageAvailability'),
      navigation: screenStackName.MANAGE_AVAILABILITY,
    },
    {
      id: 3,
      icon: (
        <Icon
          name="dashboardIcon"
          width={24}
          height={24}
          color={colors?.defaultBlack}
          style={{marginEnd: -4}}
        />
      ),
      name: t('common:dashboard'),
      navigation: screenStackName.DASHBOARD,
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
      name: t('common:missionsHistory'),
      navFunction: () => {
        navigate(screenStackName.MISSION_HISTORY, {
          headerName: t('common:missionsHistory'),
        });
      },
    },
    {
      id: 5,
      icon: <Icon name="userOutline" width={20} height={30} />,
      name: t('common:following'),
      navFunction: () => {
        navigate(rootStackName.SCREEN_STACK, {
          screen: screenStackName.FOLLOWING,
        });
      },
    },
  ];
  const profileScreenType = [
    {
      id: 1,
      icon: <AntDesign name="setting" size={20} color={colors?.defaultBlack} />,
      name: t('common:setting'),
      navigation: screenStackName.USER_SETTINGS,
    },
    {
      id: 2,
      icon: (
        <Icon
          name="help_support"
          width={20}
          height={20}
          color={colors?.defaultBlack}
        />
      ),
      name: t('common:helpAndSupport'),
      navigation: screenStackName.HELP_SUPPORT,
    },
    {
      id: 3,
      icon: (
        <AntDesign
          name="exclamationcircleo"
          style={{transform: [{rotate: '180deg'}], marginEnd: 2}}
          size={17}
          color={colors?.defaultBlack}
        />
      ),
      name: t('common:aboutVita'),
      navigation: screenStackName.ABOUT_VITA,
    },
  ];

  return (
    <Container isScrollable={true}>
      <Avatar
        source={
          userDetails?.photoURL
            ? {
                uri: userDetails?.photoURL,
              }
            : undefined
        }
        style={{
          width: 80,
          height: 80,
          zIndex: 99,
          borderRadius: 50,
          alignSelf: 'center',
          marginTop: 10,
        }}
      />
      <CustomText
        color="defaultBlack"
        fontFamily="openSansBold"
        fontSize={16}
        style={{
          marginVertical: 10,
          paddingHorizontal: 10,
          alignSelf: 'center',
          marginBottom: 50,
          textAlign: 'center',
        }}>
        {capitalizeString(
          userDetails?.displayName ??
            userDetails?.displayName ??
            userDetails?.name,
        )}
      </CustomText>
      <View
        style={{
          width: SCREEN_WIDTH,
          borderBottomColor: colors.lightGrey,
          borderBottomWidth: 1,
        }}
      />

      <View style={{marginTop: 20, marginBottom: 30, paddingHorizontal: 20}}>
        {managementScreenType?.map(item => (
          <UserRenderItem
            key={item?.id}
            item={item}
            onPressHandle={() => handleNavigate(item)}
          />
        ))}
      </View>

      <View style={{marginTop: 20, marginBottom: 60, paddingHorizontal: 20}}>
        {profileScreenType?.map(item => (
          <UserRenderItem
            key={item?.id}
            item={item}
            onPressHandle={() => {
              handleNavigate(item);
            }}
          />
        ))}
      </View>

      <CustomButton
        type="unstyled"
        style={{
          width: '90%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          marginVertical: 10,
          position: 'absolute',
          bottom: 1,
        }}
        onPress={() => {
          setModalOpen(true);
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Feather
            name="log-out"
            color={colors?.defaultBlack}
            style={{marginEnd: 12, marginStart: 3}}
            size={20}
          />
          <CustomText
            fontSize={16}
            fontFamily="arialRegular"
            color={'red'}
            style={{lineHeight: 20}}>
            {t('common:logOut')}
          </CustomText>
        </View>
        <Entypo
          name="chevron-thin-right"
          size={20}
          color={colors?.defaultBlack}
        />
      </CustomButton>

      {modalOpen && (
        <LogoutModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
      )}
    </Container>
  );
};

export default UserManagementPro;
