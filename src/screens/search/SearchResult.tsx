import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IS_IOS, SCREEN_HEIGHT } from 'src/constants/deviceInfo';
import { globalStyles } from 'src/constants/globalStyles.style';
import { searchStackName } from 'src/navigation/constant/searchStackRouteName';
import { useAppSelector } from 'src/redux/reducer/reducer';
import CustomSearch from 'src/shared/components/customSearch/CustomSearch';
import CustomText from 'src/shared/components/customText/CustomText';
import ImageComponent from 'src/shared/components/imageComponent/ImageComponent';
import { colors } from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import SearchedCardComponent from './searchedCardComponent/SearchedCardComponent';
import useSearch from './utils/useSearch';
import useAlgoliaSearch from './utils/useAlgoliaApi';
import useAlgoliaApi from './utils/useAlgoliaApi';

const filterObject = {
  SortBy: 'Relevance',
  Category: 'Barber',
  Location: 'All',
  Grade: 'All',
  Price: 'All',
  Availability: 'All',
};

const SearchResult = ({ route }: any) => {
  const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid);
  const [filterData, setFilterData] = React.useState(filterObject);
  const { t } = useTranslation();
  const { navigate } = useStackNavigation();
  const data = route.params;
  // const searchResult: TSearchCard[] = data != null ? Object.values(data) : [];
  // const {
  //   searchResult,
  //   search,
  //   searchQuery,
  //   setSearchQuery,
  //   randomSearch,
  //   hasSearched,
  //   // isLoading,
  // } = useSearch();
  const {
    query,
    setQuery,
    results,
    isLoading,
    handleSearch,
    loadMore,
    setCityFilter,
    error,
    hasSearched
  } = useAlgoliaApi();
  // Remove items with matching uid from searchResult
  // console.log({ hasSearched });
  // const {results, handleSearch, setQuery} = useAlgoliaSearch();
  // handleSearch();
  // console.log('This is data from the new hook.', results, isLoading);
  return (
    <View
      style={{
        paddingTop: IS_IOS ? 60 : 0,
        backgroundColor: colors.secondary,
        flex: 1,
      }}>
      <FlatList
        onEndReached={loadMore} // Trigger loadMore when reaching the bottom
        onEndReachedThreshold={0.5}
        // data={
        //   searchResult?.length == 0 && !hasSearched ? results : results //change this result to search result coming from useSearch hook if need to rollback.
        // }
        numColumns={2}
        ListEmptyComponent={
          isLoading ? (
            <View
              style={{
                height: SCREEN_HEIGHT - 150,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator />
            </View>
          ) : hasSearched ? (
            <View
              style={[
                globalStyles.screenCenter,
                // globalStyles.alignCenter,
                // globalStyles.justifyContent,
                { height: SCREEN_HEIGHT - 130 },
              ]}>
              <ImageComponent
                source={require('src/assets/images/not-found.png')}
                resizeMode="contain"
                style={{ aspectRatio: 1, width: 50, backgroundColor: '#fff' }}
              />
              <CustomText style={{ marginTop: 10 }}>
                {t('customWords:notFound')}
              </CustomText>
            </View>
          ) : (
            <View
              // style={[
              //   globalStyles.screenCenter,
              //   // globalStyles.alignCenter,
              //   // globalStyles.justifyContent,
              //   {height: SCREEN_HEIGHT - 130},
              // ]}>
              // <ImageComponent
              //   source={require('src/assets/images/not-found.png')}
              //   resizeMode="contain"
              //   style={{aspectRatio: 1, width: 50, backgroundColor: '#fff'}}
              // />
              // <CustomText style={{marginTop: 10}}>
              //   {t('customWords:notFound')}
              // </CustomText>
              style={{
                height: SCREEN_HEIGHT - 150,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {results?.length == 0 ? (
                <View style={{ alignItems: 'center' }}>
                  <ImageComponent
                    source={require('src/assets/images/not-found.png')}
                    resizeMode="contain"
                    style={{ aspectRatio: 1, width: 50, backgroundColor: '#fff' }}
                  />
                  <CustomText style={{ marginTop: 10 }}>
                    {t('customWords:notFound')}
                  </CustomText>
                </View>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          )
        }
        ListHeaderComponent={
          <View
            style={[
              globalStyles.rowCenter,
              {
                padding: 5,
                paddingStart: 15,
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'space-around',
                backgroundColor: colors.secondary,
                marginBottom: 5,
                paddingBottom: 10,
                borderColor: '#E6E6E6',
              },
            ]}>
            <CustomSearch
              isLoading={isLoading}

              value={query}
              // onChangeText={setQuery}
              // value={searchQuery?.toLowerCase()}
              onChangeText={text => {
                // setSearchQuery(text);
                setQuery(text);
              }}
              onSubmit={() => {

                handleSearch();
              }}
            />
            <Ionicons
              onPress={() => {
                navigate(searchStackName.SEARCH_FILTER, { filterData });
              }}
              name="filter"
              size={24}
              style={{
                height: 30,
                marginHorizontal: 10,
                alignSelf: 'center',
                color: colors.defaultBlack,
              }}
            />
          </View>
        }

        data={results}
        keyExtractor={(item, index) => `${item.objectID}-${index}`}
        // renderItem={renderItem}
        ListFooterComponent={isLoading ? <ActivityIndicator size="small" /> : null}
        renderItem={({ item, index }) => {
          console.log(item);
          return <SearchedCardComponent searchedCardObject={item} key={index} />;
        }}
      />
    </View>
  );
};

export default SearchResult;
