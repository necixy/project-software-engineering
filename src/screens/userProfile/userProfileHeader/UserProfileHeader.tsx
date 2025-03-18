import React from 'react';
import {View} from 'react-native';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {userProfileStackName} from 'src/navigation/constant/userProfileStackName';
import Container from 'src/shared/components/container/Container';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {capitalizeString} from 'src/utils/developmentFunctions';
import {IS_IOS, SCREEN_WIDTH} from '../../../constants/deviceInfo';
import {globalStyles} from '../../../constants/globalStyles.style';
import CustomButton from '../../../shared/components/customButton/CustomButton';
import CustomText from '../../../shared/components/customText/CustomText';
import HeaderButtons from './component/HeaderButtons';
import useProfileHeader from './useProfileHeader';

/* User Profile Header used for both client and pro user type */

const UserProfileHeader = () => {
  const {navigate, userDetails, profileAds, t, goBack, likedBy, likes} =
    useProfileHeader();

  return (
    <>
      <Container
        isScrollable={false}
        contentContainerStyle={[
          {
            backgroundColor: colors?.secondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 5,
          },
          globalStyles?.ph2,
        ]}>
        {/* <CustomHeader
        headerContainer={{
          marginBottom: 10,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: SCREEN_WIDTH,
          paddingTop: 10,
        }}
        title="Vita"
        back={userType === 'pro' ? false : true}
        titleStyle={{alignSelf: 'center'}}
        leftIconColor="black"
        leftIconStyle={{alignSelf: 'center'}}
        fontSize={fontSizePixelRatio(30)}
        fontFamily={fonts?.fredokaSemiBold}
        lineHeight={fontSizePixelRatio(35)}
        titleColor={'blue'}
      /> */}

        <Avatar
          source={
            userDetails?.photoURL
              ? {
                  uri: userDetails?.photoURL,
                }
              : undefined
          }
          style={{
            width: 100,
            height: 100,
            zIndex: 99,
            borderRadius: 50,
            alignSelf: 'center',
          }}
        />
        <CustomText
          numberOfLines={2}
          fontSize={15}
          color="defaultBlack"
          fontFamily="openSansBold"
          style={{
            marginVertical: 10,
            textAlign: 'center',
            marginHorizontal: 20,
          }}>
          {capitalizeString(userDetails?.displayName)}
        </CustomText>

        <View style={[globalStyles?.flexRow, {width: '100%', height: 70}]}>
          {profileAds?.map(
            (item: {label: string; value: string; id: string}, index: any) => {
              return (
                <CustomButton
                  hitSlop={20}
                  disabledWithoutOpacity={
                    item?.label !== 'Following' && item?.label !== 'Followers'
                  }
                  type="unstyled"
                  key={index}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: (SCREEN_WIDTH * 0.8) / 3,
                    height: '80%',
                    // marginEnd: 10,
                    zIndex: 9999,
                  }}
                  onPress={() => {
                    userDetails?.isPro
                      ? navigate(userProfileStackName.FOLLOWERS, {
                          uid: userDetails?.uid,
                        })
                      : navigate(userProfileStackName.FOLLOWING);
                  }}>
                  <>
                    <CustomText
                      color="defaultBlack"
                      fontFamily={IS_IOS ? 'openSansBold' : 'arialBold'}
                      fontSize={18}
                      style={{marginBottom: 2}}>
                      {/* {__DEV__ && item?.label} */}
                      {Number(item?.value) && item?.label == 'Stars'
                        ? String(Number(item?.value).toFixed(1))
                        : item?.label == t('common:likes')
                        ? userDetails?.isPro === true
                          ? likes
                          : likedBy
                        : item?.value ?? (item?.id === 'Stars' ? '-' : '0')}
                    </CustomText>

                    <View style={{alignSelf: 'center'}}>
                      <CustomText
                        color="grey"
                        // fontFamily="openSansRegular"
                        fontFamily="arial"
                        fontSize={12}>
                        {item?.label}
                      </CustomText>
                    </View>

                    {index !== profileAds?.length - 1 && (
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
                    )}
                  </>
                </CustomButton>
              );
            },
          )}
        </View>

        {userDetails?.isPro && <HeaderButtons />}

        {userDetails?.isPro &&
          (userDetails?.bio ? (
            <CustomText
              fontFamily="arial"
              textAlign="center"
              style={{alignSelf: 'center', marginVertical: 24}}>
              {userDetails?.bio}
            </CustomText>
          ) : (
            <CustomButton
              style={{
                marginVertical: 24,
                alignSelf: 'center',
                height: 30,
                // width: 120,
              }}
              onPress={() =>
                navigate(rootStackName.SCREEN_STACK, {
                  screen: screenStackName.EDIT_PRO_PROFILE,
                })
              }
              textProps={{
                style: {
                  color: colors?.defaultBlack,
                  fontFamily: fonts?.openSansRegular,
                  fontSize: 14,
                },
              }}
              type="grey">
              {`+ ${t('common:addABio')}`}
            </CustomButton>
          ))}
      </Container>
    </>
  );
};

export default UserProfileHeader;
