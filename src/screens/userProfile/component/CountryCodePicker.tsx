import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {globalStyles} from 'src/constants/globalStyles.style';
import {updateCategory} from 'src/redux/reducer/searchFilterReducer';
import SearchFilterHeader from 'src/screens/search/searchFilter/searchFilterComponent/SearchFilterHeader';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomSearch from 'src/shared/components/customSearch/CustomSearch';
import CustomText from 'src/shared/components/customText/CustomText';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import {colors} from 'src/theme/colors';
import useCountryCdePicker from './useCountryCdePicker';
import {updateCountry} from 'src/redux/reducer/countryReducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const CountryCodePicker = () => {
  const {
    countryCode,
    isCountryCodeLoading,
    setIsKeyboardVisible,
    onChangeText,
    // value,
    search,
    setSearch,
    // setTemp,
    filter,
    t,
    goBack,
    dispatch,
    selectedCountry,
    setSelectedCountry,
    handleGoBack,
    setCountryCodeFB,
  } = useCountryCdePicker();

  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{backgroundColor: colors.secondary}}>
      <SearchFilterHeader
        onBackPress={() => handleGoBack({selectedCountry})}
        name="Country"
        rightSideButton={false}
      />
      {isCountryCodeLoading ? (
        <LoadingSpinner textDisable={true} />
      ) : (
        <FlatList
          data={filter.length > 0 && search !== '' ? filter : countryCode}
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
          ListHeaderComponent={
            <View
              style={[
                globalStyles.rowCenter,
                {
                  padding: 10,
                  paddingBottom: 0,
                  marginBottom: 30,
                },
              ]}>
              <CustomSearch
                onFocus={() => setIsKeyboardVisible(true)}
                onBlur={() => setIsKeyboardVisible(false)}
                isLoading={isCountryCodeLoading}
                onChangeText={onChangeText}
                value={search!}
                color="secondary"
                searchContainer={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: colors.lightGrey,
                  height: 40,
                }}
                textStyle={{marginHorizontal: 10}}
                showCancel={true}
                placeholderText={t('customWords:enterCountry')}
              />
            </View>
          }
          style={{flex: 0.9}}
          contentContainerStyle={{
            paddingVertical: 20,
            // borderTopWidth: 1,
            // borderBottomWidth: 2,
            // borderColor: colors.lightGrey,
          }}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCountry(item);
                }}
                style={[
                  globalStyles.flexRow,
                  globalStyles.ph2,
                  globalStyles.alignCenter,
                ]}>
                <CustomText
                  fontFamily="openSansRegular"
                  fontSize={11}
                  color={
                    selectedCountry?.name == item?.name
                      ? 'primary'
                      : 'defaultBlack'
                  }
                  style={[globalStyles.flex]}>
                  {` ${item?.dial_code},  ${item?.name}`}
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
            setCountryCodeFB();
            // if (filter?.length > 0) {
            //   dispatch(updateCountry(selectedCountry!));
            // }
            // goBack();
          }}>
          {t('common:save')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default CountryCodePicker;
