import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useTransition} from 'react';
import {globalStyles} from 'src/constants/globalStyles.style';
import {colors} from 'src/theme/colors';
import CustomText from 'src/shared/components/customText/CustomText';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import Container from 'src/shared/components/container/Container';
import SearchFilterHeader from './searchFilterComponent/SearchFilterHeader';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {updateCategory} from 'src/redux/reducer/searchFilterReducer';
import database from '@react-native-firebase/database';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import {useTranslation} from 'react-i18next';

const CategoryFilter = () => {
  const {t} = useTranslation();
  const {goBack} = useStackNavigation();
  const dispatch = useAppDispatch();
  const alreadySetCategory = useAppSelector(
    state => state?.searchFilterReducer?.category,
  );
  console.log({alreadySetCategory});
  const [filter, setFilter] = useState<string[]>(alreadySetCategory ?? []);
  const [temp, setTemp] = useState<string>('');
  // State to hold the list of professions
  const [professions, setProfessions] = useState([]);

  // State to manage loading status
  const [isProfessionLoading, setIsProfessionLoading] = useState(false);

  // Function to fetch professions from the Firebase database
  const getProfession = async () => {
    try {
      setIsProfessionLoading(true);
      await database()
        .ref('/Categories')
        .once('value', snapshot => {
          setProfessions(snapshot.val());
        });
    } catch (error) {
      console.error('Error in getting professions', error);
    } finally {
      setIsProfessionLoading(false);
    }
  };

  // useEffect to call getProfession when the component mounts
  useEffect(() => {
    getProfession();
  }, []);
  useEffect(() => {
    temp == '' || filter.includes(temp)
      ? null
      : filter.includes('All')
      ? setFilter([temp])
      : setFilter([...filter, temp]);
  }, [temp]);

  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{backgroundColor: colors.secondary}}>
      <SearchFilterHeader name={t('filter:category')} />
      {isProfessionLoading ? (
        <LoadingSpinner textDisable={true} />
      ) : (
        <FlatList
          data={professions}
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
          style={{flex: 0.9}}
          contentContainerStyle={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderBottomWidth: 2,
            borderColor: colors.lightGrey,
          }}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setTemp(item);
                }}
                style={[
                  globalStyles.flexRow,
                  globalStyles.ph2,
                  globalStyles.alignCenter,
                  // {backgroundColor: 'red'},
                ]}>
                <CustomText
                  fontFamily="openSansRegular"
                  fontSize={11}
                  color={filter.includes(item) ? 'primary' : 'defaultBlack'}
                  style={[globalStyles.flex]}>
                  {item}
                </CustomText>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <View style={{flex: 0.1}}>
        <CustomButton
          alignSelf="center"
          style={{width: '80%', position: 'absolute', bottom: 20}}
          onPress={() => {
            console.log('filter?.length', filter?.length);
            if (filter?.length > 0) {
              dispatch(updateCategory(filter));
            }
            goBack();
          }}>
          {t('common:save')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default CategoryFilter;
