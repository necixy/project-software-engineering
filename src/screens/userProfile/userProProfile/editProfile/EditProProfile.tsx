import React, { useEffect, useLayoutEffect } from 'react';
import { Platform, View, PixelRatio } from 'react-native';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import ImageComponent from 'src/shared/components/imageComponent/ImageComponent';
import { colors } from 'src/theme/colors';
import { fonts } from 'src/theme/fonts';
import EditProfileInputs from '../../component/EditProfileInputs';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import { fontSizePixelRatio } from 'src/utils/developmentFunctions';
import useEditProProfile from './useEditProProfile';
import { useTranslation } from 'react-i18next';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import { screenStackName } from 'src/navigation/constant/screenStackName';
import { IS_IOS, SCREEN_WIDTH } from 'src/constants/deviceInfo';
import { useRoute } from '@react-navigation/native';

const EditProProfile = ({ navigation }: any) => {
  const {
    handleProfilePicker,
    handleFrontPicker,
    profileImg,
    frontImg,
    userData,
    formik: {
      values: { displayName, profession, bio, location },
      handleChange,
      handleSubmit,
      errors,
      touched,
    },
  } = useEditProProfile();
  const route = useRoute();

  // useEffect(() => {
  //   if (route.params?.selectedCountry!) {
  //     console.log(route?.params?.selectedCountry!?.dial_code);
  //   }
  // }, [route.params]);

  const { t } = useTranslation();

  const { navigate } = useStackNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        // let size = PixelRatio.get();
        // console.log({size});
        return (
          <CustomHeader
            headerContainer={{ alignItems: 'center' }}
            back
            textAlignTitle="center"
            titleColor={'black'}
            fontSize={17}
            fontFamily={fonts?.openSansBold}
            lineHeight={30}
            rightIconStyle={{
              width: '120%',
              paddingRight: 10,
            }}
            rightIcon={
              <CustomButton
                style={{
                  height: 30,
                  alignSelf: 'flex-end',
                  marginEnd: 2,
                  width: '150%',
                }}
                onPress={handleSubmit}
                type="unstyled"
                fontSize={12}
                textProps={{
                  style: {
                    fontFamily: fonts?.openSansBold,
                    // fontSize: fontSizePixelRatio(6),
                    // PixelRatio.get() > 2
                    //   ? fontSizePixelRatio(10)
                    //   : fontSizePixelRatio(16),
                    color: colors?.primary,
                  },
                }}>
                {t('common:done')}
              </CustomButton>
            }
            navigation={navigation}
            route={route}
          />
        );
      },
    });
  }, [profileImg, frontImg, displayName, profession, location, bio]);

  return (
    <Container isScrollable>
      {/* Edit Profile Picture and Edit Front Picture */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 40,
        }}>
        <CustomButton
          onPress={handleProfilePicker}
          type="unstyled"
          style={{ alignSelf: 'center', marginEnd: 50, alignItems: 'center' }}>
          <Avatar
            source={
              profileImg
                ? { uri: profileImg }
                : userData?.photoURL
                  ? { uri: userData?.photoURL }
                  : undefined
            }
            style={{
              width: 100,
              height: 100,
              zIndex: 99,
              marginBottom: 20,
              borderRadius: 50,
            }}
          />
          <CustomText color="primary" fontSize={12} fontFamily="openSansBold">
            {t('common:editProfilePicture')}
          </CustomText>
        </CustomButton>
        <CustomButton
          onPress={handleFrontPicker}
          type="unstyled"
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <ImageComponent
            source={
              frontImg
                ? { uri: frontImg }
                : userData?.frontImage
                  ? { uri: userData?.frontImage }
                  : undefined
            }
            resizeMode="contain"
            style={{
              width: 150,
              height: 200,
              zIndex: 99,
              marginBottom: 20,
              alignSelf: 'center',
            }}
          />
          <CustomText color="primary" fontSize={12} fontFamily="openSansBold">
            {t('common:editFrontPic')}
          </CustomText>
        </CustomButton>
      </View>

      {/* Edit Profile Data Inputs */}
      <View
        style={{
          borderWidth: 1,
          borderColor: colors?.lightGrey,
          paddingVertical: 5,
          marginTop: 30,
          alignItems: 'flex-end',
        }}>
        <EditProfileInputs
          value={displayName}
          label={t('common:name')}
          error={touched?.displayName && errors?.displayName}
          onChangeText={handleChange('displayName')}
        />

        <CustomButton
          type="unstyled"
          style={{ marginStart: -2 }}
          onPress={() =>
            navigate(screenStackName.EDIT_PROFESSION, {
              professionVal: profession,
            })
          }>
          <View pointerEvents="none">
            <EditProfileInputs
              value={profession}
              readOnly={true}
              label={t('common:profession')}
              inputContainerStyle={{
                borderBottomWidth: 1,
                borderRadius: 0,
              }}
            />
          </View>
        </CustomButton>

        <CustomButton
          type="unstyled"
          onPress={() => navigate(screenStackName.EDIT_PRO_LOCATION)}>
          <View
            pointerEvents="none"
            style={{
              flexDirection: 'row',
              paddingHorizontal: 5,
              paddingVertical: 12,
            }}>
            <CustomText
              fontFamily="openSansBold"
              fontSize={15}
              allowFontScaling={false}>
              {t('common:location')}
            </CustomText>
            <CustomText
              allowFontScaling={false}
              fontSize={14}
              fontFamily="openSansRegular"
              color={location ? 'grey' : 'lightGrey'}
              style={{
                paddingLeft: IS_IOS ? SCREEN_WIDTH * 0.15 : SCREEN_WIDTH * 0.13,
                width: SCREEN_WIDTH * 0.82,
              }}>
              {location ?? t('common:location')}
            </CustomText>
            {/* <EditProfileInputs
              readOnly={true}
              value={location}
              multiline={true}
              label={t('common:location')}
              containerStyle={{alignItems: 'flex-start'}}
              labelContainer={{
                paddingBottom: 10,
              }}
              inputBoxStyle={{
                height: 100,
                textAlignVertical: 'top',
              }}
              inputContainerStyle={{
                height: 100,
                borderRadius: 0,
                paddingHorizontal: 5,
              }}
            /> */}
          </View>
        </CustomButton>

        <EditProfileInputs
          value={bio}
          label={t('common:bio')}
          error={touched?.bio && errors?.bio}
          containerStyle={{ alignItems: 'flex-start' }}
          onChangeText={handleChange('bio')}
          multiline
          inputBoxStyle={{
            height: Platform.OS == 'ios' ? 80 : 95,
            textAlignVertical: 'top',
          }}
          inputContainerStyle={{
            height: 100,
            borderRadius: 0,
            borderBottomWidth: 0,
            borderTopWidth: 1,
          }}
        />
      </View>
    </Container>
  );
};

export default EditProProfile;
