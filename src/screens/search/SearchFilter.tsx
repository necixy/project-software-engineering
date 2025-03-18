import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {isString} from 'formik';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  EmitterSubscription,
  FlatList,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {globalStyles} from 'src/constants/globalStyles.style';
import {searchStackName} from 'src/navigation/constant/searchStackRouteName';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {setApplyFilter} from 'src/redux/reducer/searchFilterReducer';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import {comingSoonAlert} from 'src/utils/developmentFunctions';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import SearchFilterHeader from './searchFilter/searchFilterComponent/SearchFilterHeader';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const SearchFilter = ({route}: any) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {filterData} = route.params ?? {};
  const {navigate, goBack} = useStackNavigation();
  const {applyFilter, availability, category, grade, location, price, sortBy} =
    useAppSelector(state => state.searchFilterReducer);
  const tabBarHeight = useBottomTabBarHeight();
  const [oldLocation, setOldLocation] = useState<string | string[]>([]);
  const [bottom, setBottom] = useState(0);
  const [bottomP, setBottomP] = useState(20);

  // console.log({availability, category, grade, location, price, sortBy});

  const filterList = useMemo(() => [
    {
      id: 1,
      name: 'SortBy',
      navigation: searchStackName.SORTBY_FILTER,
      value: sortBy,
      label: t('filter:sortBy'),
    },
    {
      id: 2,
      label: t('filter:category'),

      name: 'Category',
      navigation: searchStackName.CATEGORY_FILTER,
      value: category,
    },
    {
      id: 3,
      name: 'Location',
      label: t('filter:location'),

      navigation: searchStackName.LOCATION_FILTER,
      value: location,
    },
    {
      id: 4,
      name: 'Grade',
      navigation: searchStackName.GRADE_FILTER,
      value: grade,
      label: t('filter:grade'),
    },
    {
      id: 5,
      name: 'Price',
      label: t('filter:price'),

      navigation: searchStackName.PRICE_FILTER,
      value: price,
    },
    {
      id: 6,
      label: t('filter:availability'),

      name: 'Availability',
      navigation: searchStackName.AVAILABILITY_FILTER,
      value: availability,
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      if (bottomP == 90) {
        if (location !== oldLocation) {
          if (location?.includes('All') || location?.length < 1) {
            setBottom(0);
            setBottomP(20);
          }
          setOldLocation(location);
        } else {
          setBottom(0);
          setBottomP(20);
        }
      }
    }, []),
  );
  useEffect(() => {
    let keyboardDidShowListener: EmitterSubscription;

    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setBottom(0);
      setBottomP(20);
    });
    keyboardDidShowListener = Keyboard.addListener('keyboardDidHide', () => {
      setBottom(-20);
      setBottomP(90);
    });
    return () => {
      if (keyboardDidShowListener) keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Container
      // disableKeyboardAvoidingView
      isScrollable={false}
      contentContainerStyle={{
        backgroundColor: colors.secondary,
        flex: 1,
        paddingBottom: 20,
      }}>
      {/* <SearchFilterHeader name="Filter" hasBack /> */}
      <View style={{flex: 1}}>
        <FlatList
          // scrollEnabled={false}
          data={filterList}
          // ItemSeparatorComponent={() => {
          //   return (
          //     <View
          //       style={{
          //         borderBottomWidth: 1,
          //         marginVertical: 15,
          //         borderColor: colors.lightGrey,
          //       }}
          //     />
          //   );
          // }}
          // ListHeaderComponent={<View></View>}
          ListHeaderComponentStyle={{
            borderBottomWidth: 1,
            borderColor: colors?.lightGrey,
          }}
          ListHeaderComponent={
            <SearchFilterHeader name={t('filter:filter')} hasBack />
          }
          // style={{backgroundColor: 'orange'}}
          contentContainerStyle={{
            // paddingVertical: 20,
            // borderTopWidth: 0,
            // borderBottomWidth: 1,
            // borderColor: colors.lightGrey,
            // backgroundColor: 'pink',
            flexGrow: 1,
          }}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item?.navigation) {
                    navigate(item?.navigation);
                  } else {
                    comingSoonAlert();
                  }
                }}
                style={[
                  globalStyles.flexRow,
                  globalStyles.ph2,
                  {
                    borderBottomWidth: 1,
                    borderColor: colors.lightGrey,
                    paddingVertical: 15,
                  },
                ]}>
                <CustomText
                  fontFamily="openSansRegular"
                  fontSize={11}
                  style={[globalStyles.flex]}>
                  {item.label}
                </CustomText>
                <CustomText
                  fontFamily="openSansRegular"
                  fontSize={12}
                  color={
                    item.value == 'All' || item?.value[0] == 'All'
                      ? 'defaultBlack'
                      : 'primary'
                  }
                  style={[globalStyles.alignCenter, {alignSelf: 'center'}]}>
                  {isString(item.value)
                    ? item?.name === 'SortBy'
                      ? t(`filter:${convertToCamelCase(item.value)}`)
                      : item.value === 'All'
                      ? t('filter:all')
                      : item.value
                    : item.name == 'Availability'
                    ? `${item.value.availabilityArray[0]}`
                    : item.name == 'Grade' || item.name == 'Price'
                    ? `${item.value[0]}-${item.value[1]}`
                    : `${
                        item.value[0] === 'All'
                          ? t('filter:all')
                          : item.value[0]
                      }`}
                </CustomText>
                <EvilIcons
                  name="chevron-right"
                  size={30}
                  // style={{bottom: 2.5}}
                  color={colors.defaultBlack}
                />
              </TouchableOpacity>
            );
          }}
          // ListFooterComponentStyle={{
          //   height: 50,
          //   position: 'absolute',
          //   width: '100%',
          //   bottom: 0,
          //   marginBottom: 20,
          //   // borderWidth: 1,
          //   // bottom: tabBarHeight + 10,
          //   // bottom: Platform.OS == 'ios' ? tabBarHeight : 10,
          // }}
          // ListFooterComponent={}
        />

        <CustomButton
          alignSelf="center"
          style={{
            width: '80%',
            position: 'absolute',
            bottom: Platform.OS == 'ios' ? bottom : 0,
            marginBottom: Platform.OS == 'ios' ? bottomP : 20,
          }}
          onPress={() => {
            try {
              dispatch(setApplyFilter(true));
              goBack();
            } catch (error) {
              console.error({error});
            }
          }}>
          {t('common:save')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default SearchFilter;

function convertToCamelCase(str: string) {
  return str
    .split(' ') // Split string by spaces
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase(); // Keep the first word lowercase
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter of subsequent words
    })
    .join(''); // Join the words back into a single string
}
