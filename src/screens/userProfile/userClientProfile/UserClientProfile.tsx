import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Share, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'src/assets/svg';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import {comingSoonAlert} from 'src/utils/developmentFunctions';
import LogoutModal from '../component/LogoutModal';
import UserRenderItem from '../component/UserRenderItem';
import UserProfileHeader from '../userProfileHeader/UserProfileHeader';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import Container from 'src/shared/components/container/Container';
import {globalStyles} from 'src/constants/globalStyles.style';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {fonts} from 'src/theme/fonts';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';

const UserClientProfile = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const navigation = useStackNavigation();
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);
  const profileScreenType = [
    {
      id: 1,
      icon: <AntDesign name="setting" size={20} color={colors?.defaultBlack} />,
      name: t('common:setting'),
      navFunction: () => {
        navigation.navigate(rootStackName?.SCREEN_STACK, {
          screen: screenStackName.USER_SETTINGS,
        });
      },
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
      // navigation: screenStackName.HELP_SUPPORT,
      navFunction: () => {
        navigation.navigate(rootStackName?.SCREEN_STACK, {
          screen: screenStackName.HELP_SUPPORT,
        });
      },
    },
    {
      id: 3,
      icon: (
        <AntDesign
          name="exclamationcircleo"
          style={{transform: [{rotate: '180deg'}], marginEnd: 4}}
          size={17}
          color={colors?.defaultBlack}
        />
      ),
      name: t('common:aboutVita'),
      // navigation: screenStackName.ABOUT_VITA,
      navFunction: () => {
        navigation.navigate(rootStackName?.SCREEN_STACK, {
          screen: screenStackName.ABOUT_VITA,
        });
      },
    },
    {
      id: 4,
      icon: (
        <Icon
          name="pro_account"
          width={24}
          height={24}
          color={colors?.defaultBlack}
          style={{marginEnd: 0, marginStart: -2}}
        />
      ),
      name: t('common:switchProAccount'),
      // navigation: (),
      navFunction: () => {
        navigation.navigate(rootStackName.SCREEN_STACK, {
          screen: screenStackName.SWITCH_PRO,
          params: {type: 'user'},
        });
      },
    },
  ];
  const handleNavigate = (data: any) => {
    // if (data?.navigation)
    //   return navigation.navigate(rootStackName.SCREEN_STACK, {
    //     screen: data?.navigation,
    //   });
    if (data?.navFunction) return data?.navFunction();

    // comingSoonAlert();
  };
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: colors?.secondary,
        paddingHorizontal: 17,
      }}>
      <CustomHeader
        headerContainer={{
          marginTop: -5,
        }}
        back={navigation.getState().index == 0 ? false : true}
        leftIconColor="blue"
        leftIcon
        title="Vita"
        fontSize={24}
        fontFamily={fonts?.fredokaSemiBold}
        lineHeight={30}
        rightIcon
        // rightIcon={
        //   <Feather
        //     name="share-2"
        //     color={colors?.primary}
        //     // style={{marginEnd: 18}}
        //     size={24}
        //   />
        // }
        // handleRight={handleShare}
      />
      {serverType !== 'LIVE' ? (
        <CustomText textAlign="center" fontSize={8}>
          {uid}
        </CustomText>
      ) : null}
      {/* User Client Profile Clickable Components including Setting, Help and support, About Vita, Switch to professional account */}
      <View>
        <FlatList
          scrollEnabled={false}
          // ListHeaderComponentStyle={{height: '40%'}}
          ListHeaderComponent={<UserProfileHeader />}
          data={profileScreenType}
          contentContainerStyle={[globalStyles.ph2, {marginTop: 20}]}
          renderItem={({item}) => (
            <UserRenderItem
              item={item}
              onPressHandle={() => {
                handleNavigate(item);
              }}
            />
          )}
          keyExtractor={item => item?.id?.toString()}
          // ListFooterComponentStyle={{
          //   position: 'absolute',
          //   bottom: 20,
          //   // bottom: 0,
          // }}
          // ListFooterComponent={}
        />
      </View>
      <CustomButton
        type="unstyled"
        style={{
          width: SCREEN_WIDTH - 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          marginVertical: 10,
          position: 'absolute',
          bottom: 0,
        }}
        onPress={() => {
          // comingSoonAlert();
          if (!modalOpen) {
            setTimeout(() => {
              setModalOpen(true);
            }, 500);
          }
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
      {/* Logout Button used for client account logout */}
      {modalOpen && (
        <LogoutModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
      )}
    </Container>
  );
};

export default UserClientProfile;
