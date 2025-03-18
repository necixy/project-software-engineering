import {View, Text} from 'react-native';
import React, {useState} from 'react';
import Container from 'src/shared/components/container/Container';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import CustomText from 'src/shared/components/customText/CustomText';
import StarRating from 'src/shared/components/ratingComponent/src';
import renderRatings from 'src/screens/booking/bookingRatings/BookingRatings.style';
import SearchFilterHeader from './searchFilterComponent/SearchFilterHeader';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {updateGrade} from 'src/redux/reducer/searchFilterReducer';
import {useTranslation} from 'react-i18next';

const GradeFilter = () => {
  const {t} = useTranslation();
  const {goBack} = useStackNavigation();
  const dispatch = useAppDispatch();
  const alreadySetGrade = useAppSelector(
    state => state?.searchFilterReducer?.grade,
  );
  const [minLimit, setMinLimit] = useState<number>(
    Number(alreadySetGrade?.[0]) > 0 ? Number(alreadySetGrade?.[0]) : 1,
  );
  const [maxLimit, setMaxLimit] = useState<number>(5);
  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{backgroundColor: colors.secondary}}>
      <SearchFilterHeader name={t('filter:grade')} hasBottomBorder />
      <View style={{flex: 0.9, marginHorizontal: 10, marginTop: 15}}>
        <View>
          <CustomText fontSize={12} color="grey" style={{marginBottom: 10}}>
            {t('common:minimumGrade')}
          </CustomText>
          <StarRating
            onChange={num => {
              setMinLimit(num);
            }}
            rating={minLimit}
            starSize={50}
            style={renderRatings.star}
            starStyle={{marginRight: 17}}
            minRating={1}
          />
        </View>
        <View>
          <CustomText fontSize={12} color="grey" style={{marginBottom: 10}}>
            {t('common:maximumGrade')}
          </CustomText>
          <StarRating
            onChange={num => {
              setMaxLimit(num);
            }}
            rating={maxLimit}
            starSize={50}
            style={renderRatings.star}
            starStyle={{marginRight: 17}}
            minRating={1}
          />
        </View>
      </View>
      <View style={{flex: 0.1}}>
        <CustomButton
          alignSelf="center"
          style={{width: '80%', position: 'absolute', bottom: 20}}
          onPress={() => {
            dispatch(updateGrade([minLimit, maxLimit]));
            goBack();
          }}>
          {t('common:save')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default GradeFilter;
