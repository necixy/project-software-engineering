import {CommonActions} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, View} from 'react-native';
import {IS_IOS} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import {homeScreenStackName} from 'src/navigation/constant/homeScreenStackRouteName';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {tabStackRouteName} from 'src/navigation/constant/tabNavRouteName';
import useProfileHeaderButtons from 'src/screens/viewProfile/viewProfileHeader/component/useProfileHeaderButtons';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const FollowingListComponent = ({item: proData}: {item: TViewProfileData}) => {
  const {t} = useTranslation();

  const {navigate} = useStackNavigation();

  const {handleFollow, isButtonLoading, isFollowing, uid, navigation} =
    useProfileHeaderButtons(proData?.uid, 'following');
  return (
    <View
      style={[
        globalStyles.row,
        {alignItems: 'center', justifyContent: 'space-between'},
      ]}>
      <CustomButton
        type="unstyled"
        disabledWithoutOpacity={!proData?.isPro}
        onPress={() => {
          if (proData?.isPro) {
            navigation.navigate(rootStackName.BOTTOM_TABS, {
              screen: tabStackRouteName.HOME_STACK,
              params: {
                screen: homeScreenStackName.VIEW_USER,
                params: {uid: proData?.uid},
              },
            });
          }
        }}
        style={{flexDirection: 'row', width: '60%'}}>
        <Avatar
          source={proData?.photoURL ? {uri: proData?.photoURL} : undefined}
          style={[
            globalStyles.circleImage,
            globalStyles.mh1,
            globalStyles.mv1,
            {width: 45, height: 45},
          ]}
        />
        <View style={[globalStyles.flex, {marginEnd: 10}]}>
          <CustomText
            fontSize={12}
            numberOfLines={2}
            onPress={() => {
              navigate(homeScreenStackName.VIEW_USER, {
                uid: proData?.uid,
              });
            }}
            fontFamily={'openSansBold'}>
            {proData?.displayName}
          </CustomText>
          {proData?.proPersonalInfo ? (
            <CustomText fontSize={12} color="grey" fontFamily="openSansRegular">
              {proData?.proPersonalInfo?.first_name}{' '}
              {proData?.proPersonalInfo?.last_name}
            </CustomText>
          ) : null}
        </View>
      </CustomButton>
      <CustomButton
        style={[
          {
            marginRight: 20,
            alignSelf: 'center',
            height: 30,
          },
        ]}
        type={isFollowing || isFollowing === undefined ? 'grey' : 'blue'}
        isLoading={isFollowing === undefined || isButtonLoading.followLoading}
        onPress={handleFollow}
        textProps={{style: {color: colors.defaultBlack}}}
        fontSize={12}>
        {isFollowing === undefined
          ? ''
          : isFollowing
          ? t('common:following')
          : t('common:follow')}
      </CustomButton>
    </View>
  );
};

export default FollowingListComponent;
