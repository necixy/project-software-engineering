import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Icon from 'src/assets/svg';
import { screenStackName } from 'src/navigation/constant/screenStackName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import DateAndTimePicker from 'src/shared/components/customCalendar/DateAndTimePicker';
import CheckBox from 'src/shared/components/customCheckBox/CustomCheckBox';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import { colors } from 'src/theme/colors';
import renderPersonalInfo from './PersonalInfo.style';
import usePersonalInfo from './usePersonalInfo';
import CountryPicker from './CountryPicker';
import { MAX_DATE, minimum120Year } from 'src/utils/date';
import { fonts } from 'src/theme/fonts';

const PersonalInfo = ({ route: { params } }: any) => {
  const {
    formik: {
      values: {
        firstName,
        lastName,
        dateOfBirth,
        address,
        city,
        country,
        postCode,
        termsAccepted,
        phoneNumber,
        countryCode,
      },
      errors,
      touched,
      submitForm,
      setFieldValue,
      handleChange,
    },
    userData,
    navigate,
    lang,
  } = usePersonalInfo(params);

  const { t } = useTranslation();
  return (
    <Container contentContainerStyle={{ paddingHorizontal: 20 }}>
      {/* <View style={renderPersonalInfo.container}> */}
      <Avatar
        style={renderPersonalInfo.profileImg}
        source={
          userData?.profileImg
            ? { uri: userData?.profileImg }
            : userData?.photoURL
              ? { uri: userData?.photoURL }
              : undefined
        }
      />
      <CustomText
        fontSize={18}
        fontFamily="openSansBold"
        style={renderPersonalInfo.title}>
        {userData?.displayName}
      </CustomText>
      <CustomText fontFamily="openSansBold" fontSize={16}>
        {t('customWords:enterPersonalInfo')}
      </CustomText>
      <CustomInput
        placeHolderText={t('customWords:firstName')}
        textInputProps={{ placeholderTextColor: colors.grey }}
        inputContainer={renderPersonalInfo.inputContainer}
        inputBoxStyle={renderPersonalInfo.inputBox}
        value={firstName}
        error={touched?.firstName && errors?.firstName}
        errorStyle={renderPersonalInfo.errorStyle}
        onChangeText={handleChange('firstName')}
      />
      <CustomInput
        placeHolderText={t('customWords:lastName')}
        textInputProps={{ placeholderTextColor: colors.grey }}
        inputContainer={renderPersonalInfo.inputContainer}
        inputBoxStyle={renderPersonalInfo.inputBox}
        error={touched?.lastName && errors?.lastName}
        value={lastName}
        errorStyle={renderPersonalInfo.errorStyle}
        onChangeText={handleChange('lastName')}
      />
      <CustomInput
        countryCodeStyle={{ fontFamily: fonts?.openSansBold }}
        name={'phone'}
        dialCode={countryCode}
        keyboardType="numeric"
        placeHolderText={t('customWords:phoneNumber')}
        inputContainer={[renderPersonalInfo.inputContainer, { marginTop: 0 }]}
        textInputProps={{ placeholderTextColor: colors.grey }}
        inputBoxStyle={[
          renderPersonalInfo.inputBox,
          { position: 'relative', alignSelf: 'baseline' },
        ]}
        value={phoneNumber}
        error={touched?.phoneNumber && errors?.phoneNumber}
        errorStyle={renderPersonalInfo.errorStyle}
        onChangeText={handleChange('phoneNumber')}
      />
      <DateAndTimePicker
        actionElement={
          <View
            style={{
              borderWidth: 1,
              flexDirection: 'row',
              borderTopWidth: 0,
              borderEndWidth: 0,
              borderStartWidth: 0,
              borderColor: colors.primary,
              width: '98%',
              marginStart: 5,
              marginTop: 30,
            }}>
            <CustomText
              fontFamily="openSansBold"
              fontSize={15}
              color="grey"
              flex={1}
              marginStart={8}>
              {dateOfBirth
                ? moment(dateOfBirth, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                : t('customWords:dob')}
            </CustomText>
            <Icon
              name="calendar"
              height={20}
              width={20}
              style={{ marginBottom: 5 }}
            />
          </View>
        }
        onChange={value => {
          setFieldValue('dateOfBirth', moment(value).format('YYYY-MM-DD'));
        }}
        value={
          dateOfBirth ? moment(dateOfBirth, 'YYYY-MM-DD').toDate() : new Date()
        }
        onClose={() => { }}
        maxDate={MAX_DATE}
        minDate={minimum120Year}
      />
      <CustomText
        fontFamily="openSansBold"
        fontSize={16}
        style={{ marginTop: 40 }}>
        {t('customWords:enterPersonalAddress')}
      </CustomText>
      <CustomInput
        placeHolderText={t('customWords:address')}
        inputContainer={renderPersonalInfo.inputContainer}
        textInputProps={{ placeholderTextColor: colors.grey }}
        inputBoxStyle={renderPersonalInfo.inputBox}
        value={address}
        error={touched?.address && errors?.address}
        errorStyle={renderPersonalInfo.errorStyle}
        onChangeText={handleChange('address')}
      />

      <CustomInput
        placeHolderText={t('customWords:city')}
        inputContainer={renderPersonalInfo.inputContainer}
        textInputProps={{ placeholderTextColor: colors.grey }}
        inputBoxStyle={renderPersonalInfo.inputBox}
        value={city}
        error={touched?.city && errors?.city}
        errorStyle={renderPersonalInfo.errorStyle}
        onChangeText={handleChange('city')}
      />
      <CountryPicker
        value={country}
        error={touched?.country && errors?.country}
        errorStyle={renderPersonalInfo.errorStyle}
        onChangeText={handleChange('country')}
      // onChange={setFieldValue('country', country)}
      />
      {/* <CustomInput
          placeHolderText={t('customWords:country')}
          inputContainer={renderPersonalInfo.inputContainer}
          textInputProps={{placeholderTextColor: colors.grey}}
          inputBoxStyle={renderPersonalInfo.inputBox}
          value={country}
          error={touched?.country && errors?.country}
          errorStyle={renderPersonalInfo.errorStyle}
          onChangeText={handleChange('country')}
        /> */}
      <CustomInput
        placeHolderText={t('customWords:postCode')}
        inputContainer={[renderPersonalInfo.inputContainer, { marginTop: 25 }]}
        textInputProps={{ placeholderTextColor: colors.grey }}
        inputBoxStyle={renderPersonalInfo.inputBox}
        value={postCode}
        error={touched?.postCode && errors?.postCode}
        errorStyle={renderPersonalInfo.errorStyle}
        onChangeText={handleChange('postCode')}
      />
      <View style={renderPersonalInfo.termsView}>
        <CustomButton
          hitSlop={20}
          style={renderPersonalInfo.checkBox}
          type="unstyled">
          <CheckBox
            isChecked={termsAccepted}
            onPress={() =>
              // termsAccepted
              //   ? setFieldValue('termsAccepted', false)
              //   :
              setFieldValue('termsAccepted', !termsAccepted)
            }
          />
        </CustomButton>
        <View style={renderPersonalInfo.termsTextView}>
          <CustomText style={renderPersonalInfo.termsText}>
            {t('customWords:iHaveReadAndAcceptTheVita')}{' '}
            <CustomText
              style={renderPersonalInfo.termsTextLink}
              onPress={() => {
                // navigate(screenStackName.PRO_TERMS)
                navigate(screenStackName.PDF_VIEWER, {
                  sourceUri: `https://vita-abe0f.web.app/${lang!}/term-condition.pdf`,
                  // sourceUri: 'term-condition',
                });
              }}>
              {t('common:termsOfUse')}
            </CustomText>
            <CustomText fontFamily="openSansRegular">
              {' '}
              {t('common:and')}{' '}
            </CustomText>
            <CustomText
              onPress={() => {
                // navigate(screenStackName.PRO_TERMS)
                navigate(screenStackName.PDF_VIEWER, {
                  sourceUri: `https://vita-abe0f.web.app/${lang!}/privacy-policy.pdf`,
                  // sourceUri: 'privacy-policy',
                });
              }}
              style={renderPersonalInfo.termsTextLink}>
              {t('common:privacyPolicy')}
            </CustomText>
          </CustomText>
        </View>
      </View>
      <CustomButton style={renderPersonalInfo.button} onPress={submitForm}>
        {t('customWords:continue')}
      </CustomButton>
      {/* </View> */}
    </Container>
  );
};

export default PersonalInfo;
