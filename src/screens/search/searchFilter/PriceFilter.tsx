import {View, Text} from 'react-native';
import React, {useState} from 'react';
import Container from 'src/shared/components/container/Container';
import {colors} from 'src/theme/colors';
import CustomText from 'src/shared/components/customText/CustomText';
import {globalStyles} from 'src/constants/globalStyles.style';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import SearchFilterHeader from './searchFilterComponent/SearchFilterHeader';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {useAppDispatch} from 'src/redux/reducer/reducer';
import {updatePrice} from 'src/redux/reducer/searchFilterReducer';
import {max} from 'moment';
import {useTranslation} from 'react-i18next';

const PriceFilter = () => {
  const {t} = useTranslation();
  const {goBack} = useStackNavigation();
  const [bottomColor1, setBottomColor1] =
    React.useState<keyof typeof colors>('grey');
  const [bottomColor2, setBottomColor2] =
    React.useState<keyof typeof colors>('grey');
  const [minLimit, setMinLimit] = useState<number>(0);
  const [maxLimit, setMaxLimit] = useState<number>(0);
  const dispatch = useAppDispatch();
  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{backgroundColor: colors.secondary}}>
      <SearchFilterHeader name={t('filter:price')} hasBottomBorder />
      <View
        style={[
          globalStyles.mh2,
          globalStyles.row,
          {flex: 0.9, justifyContent: 'space-between', paddingTop: 15},
        ]}>
        <View>
          <CustomText fontSize={12}>{t('common:minimumPrice')}</CustomText>
          <CustomInput
            value={String(minLimit)}
            onChangeText={num => setMinLimit(num)}
            placeHolderText="£ 0,00"
            textInputProps={{cursorColor: colors[bottomColor1]}}
            performOnBlur={() => {
              setBottomColor1('grey');
            }}
            performOnFocus={() => {
              setBottomColor1('primary');
            }}
            keyboardType="number-pad"
            inputContainer={{
              borderWidth: 0,
              borderBottomWidth: 1,
              borderColor: colors[bottomColor1],
            }}
          />
        </View>
        <View>
          <CustomText fontSize={12}>{t('common:maximumPrice')}</CustomText>
          <CustomInput
            value={String(maxLimit)}
            onChangeText={num => setMaxLimit(num)}
            placeHolderText="£ 0,00"
            textInputProps={{cursorColor: colors[bottomColor2]}}
            performOnBlur={() => {
              setBottomColor2('grey');
            }}
            performOnFocus={() => {
              setBottomColor2('primary');
            }}
            keyboardType="number-pad"
            inputContainer={{
              borderWidth: 0,
              borderBottomWidth: 1,
              borderColor: colors[bottomColor2],
            }}
          />
        </View>
      </View>
      <View style={{flex: 0.1}}>
        <CustomButton
          alignSelf="center"
          style={{width: '80%', position: 'absolute', bottom: 20}}
          onPress={() => {
            dispatch(updatePrice([Number(minLimit), Number(maxLimit)]));
            goBack();
          }}>
          {t('common:save')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default PriceFilter;
