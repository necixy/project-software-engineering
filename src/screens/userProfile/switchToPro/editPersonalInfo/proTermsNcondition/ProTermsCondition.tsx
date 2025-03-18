import {View, Text} from 'react-native';
import React from 'react';
import CustomText from 'src/shared/components/customText/CustomText';
import Container from 'src/shared/components/container/Container';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

export default function ProTermsCondition() {
  const {t} = useTranslation();
  return (
    <Container
      contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
      }}>
      <FastImage
        resizeMode="contain"
        source={require('src/assets/png/vita_logo.png')}
        style={{height: 60, width: '100%', marginTop: 20}}
      />
      <CustomText
        style={{marginVertical: 5}}
        fontFamily="openSansRegular"
        // marginTop={5}
        marginVertical={-1}
        fontSize={18}
        color="grey">
        x
      </CustomText>
      <FastImage
        resizeMode="contain"
        source={require('src/assets/png/stripe_logo.png')}
        style={{height: 40, width: '100%'}}
      />

      <CustomText fontFamily="openSansRegular" marginTop={20}>
        Payment processing services for professionals on Vita are provided by
        Stripe and are subject to the
        <CustomText color="primary" style={{textDecorationLine: 'underline'}}>
          {' '}
          Stripe Connected Account Agreement
        </CustomText>
         , which includes the 
        <CustomText color="primary" style={{textDecorationLine: 'underline'}}>
          {' '}
          Stripe Terms of Service
        </CustomText>{' '}
        (collectively, the “Stripe Services Agreement”). By agreeing to these
        terms or continuing to operate as a professional on Vita, you agree to
        be bound by the Stripe Services Agreement, as the same may be modified
        by Stripe from time to time. As a condition of Vita enabling payment
        processing services through Stripe, you agree to provide Vita accurate
        and complete information about you and your business, and you authorize
        Vita to share it and transaction information related to your use of the
        payment processing services provided by Stripe.
      </CustomText>
      {/* <CustomText fontFamily="openSansRegular" marginTop={20}>
        {t('customWords:termsParagraph')}
      </CustomText> */}
    </Container>
  );
}
