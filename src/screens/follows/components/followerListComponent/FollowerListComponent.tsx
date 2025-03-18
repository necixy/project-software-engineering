import {Platform, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import CustomText from 'src/shared/components/customText/CustomText';
import {globalStyles} from 'src/constants/globalStyles.style';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {colors} from 'src/theme/colors';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'src/redux/reducer/reducer';
import useViewProfileHeader from 'src/screens/viewProfile/viewProfileHeader/useViewProfileHeader';
import useProfileHeaderButtons from 'src/screens/viewProfile/viewProfileHeader/component/useProfileHeaderButtons';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import {tabStackRouteName} from 'src/navigation/constant/tabNavRouteName';
import {searchStackName} from 'src/navigation/constant/searchStackRouteName';
import {homeScreenStackName} from 'src/navigation/constant/homeScreenStackRouteName';
import {IS_IOS} from 'src/constants/deviceInfo';

const FollowerListComponent = ({
  proData,
}: {
  proData: TViewProfileData;
  index: number;
}) => {
  const {t} = useTranslation();
  const {handleFollowers, isFollowers, uid, isButtonLoading, navigation} =
    useProfileHeaderButtons(proData?.uid, 'follower');

  return (
    <View
      style={[
        globalStyles.row,
        {alignItems: 'center', justifyContent: 'space-between'},
      ]}>
      <CustomButton
        disabledWithoutOpacity={!proData?.isPro}
        type="unstyled"
        onPress={() => {
          if (proData?.isPro) {
            navigation.navigate(tabStackRouteName.HOME_STACK, {
              screen: homeScreenStackName.VIEW_USER,
              params: {uid: proData?.uid},
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
        <View style={[globalStyles.flex]}>
          <CustomText fontSize={12} fontFamily={'openSansBold'}>
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
      {isFollowers ? (
        <CustomButton
          style={[
            {
              marginRight: 20,
              alignSelf: 'center',
              height: 30,
            },
          ]}
          type={isFollowers ? 'grey' : 'blue'}
          isLoading={isButtonLoading?.followLoading}
          onPress={handleFollowers}
          // onPress={() => {
          //   false ? removeFollower() : addFollower();
          // }}
          textProps={{style: {color: colors.defaultBlack}}}
          fontSize={12}>
          {isFollowers ? t('customWords:remove') : t('customWords:add')}
        </CustomButton>
      ) : null}
    </View>
  );
};

export default FollowerListComponent;
