import {SetStateAction, useLayoutEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import EditProfileInputs from '../../component/EditProfileInputs';
import useEditClientProfile from './useEditClientProfile';

const EditClientProfile = ({navigation, route}: any) => {
  const {
    formik: {
      values: {displayName, email, phoneNumber, countryCode},
      handleChange,
      handleSubmit,
      errors,
    },
    userData,
    handleProfilePicker,
    profileImg,
    country,
  } = useEditClientProfile();

  const {t} = useTranslation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return (
          <CustomHeader
            headerContainer={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            back
            color={'defaultBlack'}
            fontSize={18}
            fontFamily={fonts?.arialBold}
            lineHeight={20}
            titleColor={'black'}
            rightIcon={
              <CustomButton
                style={{
                  height: 30,
                  width: '120%',
                  alignSelf: 'flex-end',
                  marginEnd: 5,
                  paddingRight: 0,
                  // borderWidth: 1,
                }}
                fontSize={14}
                onPress={handleSubmit}
                type="unstyled"
                textProps={{
                  style: {
                    fontFamily: fonts?.arialBold,
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
  }, [profileImg, displayName, email, phoneNumber]);

  const [selection, setSelection] = useState<
    SetStateAction<{
      start: number;
      end: number;
    } | null>
  >({
    start: 0,
    end: 0,
  });
  const handleFocus = () => {
    setSelection(null);
  };
  const handleBlur = () => {
    setSelection({start: 0, end: 0});
  };

  return (
    <Container>
      <CustomButton
        onPress={handleProfilePicker}
        type="unstyled"
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 50,
        }}>
        <Avatar
          source={
            profileImg
              ? {uri: profileImg}
              : userData?.photoURL
              ? {uri: userData?.photoURL}
              : undefined
          }
          style={{
            width: 100,
            height: 100,
            zIndex: 99,
            marginBottom: 10,
            borderRadius: 50,
          }}
        />
        <CustomText color="primary" fontSize={12} fontFamily="arialBold">
          {t('common:editPicture')}
        </CustomText>
      </CustomButton>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors?.lightGrey,
          paddingTop: 10,
          paddingBottom: 1,
          width: SCREEN_WIDTH * 0.8,
        }}>
        <EditProfileInputs
          value={displayName}
          label={t('common:name')}
          // error={errors?.displayName}
          onChangeText={handleChange('displayName')}
          inputBoxStyle={{width: '80%'}}
          inputContainerStyle={{borderBottomWidth: 0}}
        />
        <View
          style={{
            width: SCREEN_WIDTH * 0.8,
            borderBottomWidth: 1,
            borderColor: colors?.lightGrey,
          }}
        />
        <EditProfileInputs
          keyboardType="email-address"
          value={email}
          readOnly
          label={t('common:email')}
          onChangeText={handleChange('email')}
          inputBoxStyle={{width: '80%'}}
          inputContainerStyle={{
            borderBottomWidth: 0,
          }}
          readOnly
          handleBlur={handleBlur}
          handleFocus={handleFocus}
          selection={selection}
          containerStyle={{paddingTop: 10}}
        />
        <View
          style={{
            width: SCREEN_WIDTH * 0.8,
            borderBottomWidth: 1,
            borderColor: colors?.lightGrey,
          }}
        />
        <EditProfileInputs
          dialCode={countryCode ?? country?.dial_code}
          name="phone"
          keyboardType="numeric"
          value={phoneNumber}
          label={t('common:phone')}
          onChangeText={handleChange('phoneNumber')}
          inputContainerStyle={{borderBottomWidth: 0}}
          inputBoxStyle={{width: '80%'}}
          containerStyle={{paddingTop: 10}}
          error={errors?.phoneNumber}
        />
      </View>
    </Container>
  );
};

export default EditClientProfile;
