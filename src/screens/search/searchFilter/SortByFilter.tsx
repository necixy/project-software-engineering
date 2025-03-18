import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useMemo, useState} from 'react';
import CustomText from 'src/shared/components/customText/CustomText';
import {globalStyles} from 'src/constants/globalStyles.style';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import Container from 'src/shared/components/container/Container';
import SearchFilterHeader from './searchFilterComponent/SearchFilterHeader';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {updateSortBy} from 'src/redux/reducer/searchFilterReducer';
import {useTranslation} from 'react-i18next';

const SortByFilter = () => {
  const {t} = useTranslation();
  const {goBack} = useStackNavigation();
  const dispatch = useAppDispatch();
  const {sortBy} = useAppSelector(state => state.searchFilterReducer);
  const [selectedSort, setSelectedSort] = useState(sortBy);
  const shortData = useMemo(() => {
    return [
      {
        id: 1,
        value: 'Relevance',
        label: t('filter:relevance'),
      },
      {
        id: 2,
        value: 'Descending Price',
        label: t('filter:descendingPrice'),
      },
      {
        id: 3,
        value: 'Ascending Price',
        label: t('filter:ascendingPrice'),
      },
      {
        id: 4,
        value: 'Grade',
        label: t('filter:grade'),
      },
    ];
  }, []);
  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{backgroundColor: colors.secondary}}>
      <SearchFilterHeader name={t('filter:sortBy')} hasBottomBorder />
      {/* <View style={{height: 20}} /> */}
      <FlatList
        data={shortData}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={[
                globalStyles.mv2,
                {borderBottomWidth: 1, borderColor: colors.lightGrey},
              ]}
            />
          );
        }}
        style={{flex: 0.9, marginTop: 20}}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedSort(item?.value);
              }}
              style={[
                globalStyles.flexRow,
                globalStyles.ph2,
                globalStyles.alignCenter,
                {},
              ]}>
              <CustomText
                fontFamily="openSansRegular"
                fontSize={11}
                style={[globalStyles.flex]}
                color={
                  item?.value == selectedSort ? 'primary' : 'defaultBlack'
                }>
                {item?.label}
              </CustomText>
            </TouchableOpacity>
          );
        }}
      />
      <View style={{flex: 0.1}}>
        <CustomButton
          alignSelf="center"
          style={{width: '80%', position: 'absolute', bottom: 20}}
          onPress={() => {
            dispatch(updateSortBy(selectedSort));
            goBack();
          }}>
          {t('common:save')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default SortByFilter;
