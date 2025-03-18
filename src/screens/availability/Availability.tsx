import {View, Text} from 'react-native';
import React from 'react';
import CustomCalendar from '../../shared/components/customCalendar/CustomCalendar';
import CustomText from 'src/shared/components/customText/CustomText';
import Container from 'src/shared/components/container/Container';
import {globalStyles} from 'src/constants/globalStyles.style';
import SaveButton from '../search/searchFilter/searchFilterComponent/SaveButton';
import TimeList from './component/TimeList';
import {useTranslation} from 'react-i18next';
import ImageAndNameHeader from 'src/shared/components/imageAndNameHeader/ImageAndNameHeader';
import {colors} from 'src/theme/colors';
import CustomButton from 'src/shared/components/customButton/CustomButton';

const Availability = () => {
  const {t} = useTranslation();
  return (
    <Container contentContainerStyle={[globalStyles.mh2]} isScrollable={false}>
      <ImageAndNameHeader
        name={'Greco_barber'}
        url={
          'https://c0.wallpaperflare.com/preview/705/365/317/adult-barber-barber-shop-boy.jpg'
        }
      />
      <CustomText
        style={{margin: 10, marginVertical: 20}}
        fontFamily="openSansBold"
        color="grey"
        fontSize={14}>
        {t('common:chooseBookingTime')}
      </CustomText>
      <View style={{paddingVertical: 20}}>
        <CustomCalendar />
      </View>
      <TimeList />
      <View>
        <CustomButton
          alignSelf="center"
          style={{width: '80%', position: 'absolute', bottom: 20}}>
          {t('common:save')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default Availability;
