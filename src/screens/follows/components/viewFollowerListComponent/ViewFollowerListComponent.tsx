import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, View} from 'react-native';
import {IS_IOS} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import {homeScreenStackName} from 'src/navigation/constant/homeScreenStackRouteName';
import {searchStackName} from 'src/navigation/constant/searchStackRouteName';
import {tabStackRouteName} from 'src/navigation/constant/tabNavRouteName';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const ViewFollowerListComponent = ({proData}: {proData: TViewProfileData}) => {
  // const {data: proData   ,isLoading} = useViewProfileHeader(item);
  const {t} = useTranslation();
  const navigation = useStackNavigation();

  return (
    <View
      style={[
        globalStyles.row,
        {
          alignItems: 'center',
          justifyContent: 'space-between',
          // borderWidth: 1,
          // backgroundColor: 'pink',
        },
      ]}>
      <CustomButton
        disabledWithoutOpacity={!proData?.isPro}
        type="unstyled"
        onPress={() => {
          if (proData?.isPro) {
            navigation.navigate(searchStackName.VIEW_PROFILE, {
              uid: proData?.uid,
            });
          }
          // if (proData?.isPro) {
          //   navigation.navigate(tabStackRouteName.EXPLORER, {
          //     screen: searchStackName.VIEW_PROFILE,
          //     params: {uid: proData?.uid},
          //   });
          // }
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
      <CustomButton
        disabledWithoutOpacity
        style={[
          {
            backgroundColor: colors.inputGrey,
            marginRight: 20,
            alignSelf: 'center',
            height: 30,
          },
        ]}
        textProps={{style: {color: colors.defaultBlack}}}
        fontSize={12}>
        {t('common:following')}
      </CustomButton>
    </View>
  );
};

export default ViewFollowerListComponent;
