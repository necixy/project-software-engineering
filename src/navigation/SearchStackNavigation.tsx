// This stack involves all the screens that need to be showed inside the explorer screen inside the tab navigation.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IS_IOS } from 'src/constants/deviceInfo';
import Followers from 'src/screens/follows/followers/Followers';
import SearchFilter from 'src/screens/search/SearchFilter';
import SearchResult from 'src/screens/search/SearchResult';
import AvailabilityFilter from 'src/screens/search/searchFilter/AvailabilityFilter';
import CategoryFilter from 'src/screens/search/searchFilter/CategoryFilter';
import GradeFilter from 'src/screens/search/searchFilter/GradeFilter';
import LocationFilter from 'src/screens/search/searchFilter/LocationFilter';
import PriceFilter from 'src/screens/search/searchFilter/PriceFilter';
import SortByFilter from 'src/screens/search/searchFilter/SortByFilter';
import ViewProfile from 'src/screens/viewProfile/ViewProfile';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import { fonts } from 'src/theme/fonts';
import { fontSizePixelRatio } from 'src/utils/developmentFunctions';
import { searchStackName } from './constant/searchStackRouteName';
import { searchStackParams } from './params/searchStackParams';
import ViewPost from 'src/screens/viewProfile/component/ViewPost';

const Stack = createNativeStackNavigator<searchStackParams>();

const SearchStackNavigation = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName={searchStackName.SEARCH_SUGGESTION}
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        headerShown: true,
        header: ({ route, navigation }) => {
          return (
            <CustomHeader
              headerContainer={{
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}
              color={'defaultBlack'}
              fontSize={20}
              fontFamily={'openSansBold'}
              lineHeight={20}
              titleColor={'black'}
              navigation={navigation}
              route={route}
            />
          );
        },
      }}>
      <Stack.Screen
        name={searchStackName.SEARCH_SUGGESTION}
        component={SearchResult}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={searchStackName.SEARCH_FILTER}
        component={SearchFilter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={searchStackName.SORTBY_FILTER}
        component={SortByFilter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={searchStackName.CATEGORY_FILTER}
        component={CategoryFilter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={searchStackName.LOCATION_FILTER}
        component={LocationFilter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={searchStackName.GRADE_FILTER}
        component={GradeFilter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={searchStackName.PRICE_FILTER}
        component={PriceFilter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={searchStackName.AVAILABILITY_FILTER}
        component={AvailabilityFilter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={searchStackName.VIEW_PROFILE}
        component={ViewProfile}
        options={{ headerShown: false, headerShadowVisible: false }}
      />
      <Stack.Screen
        name={searchStackName.FOLLOWERS}
        component={Followers}
        options={{
          header: ({ navigation }) => (
            <CustomHeader
              title={t('common:followers')}
              back
              textAlignTitle="center"
              fontSize={20}
              fontFamily={!IS_IOS ? fonts?.arialBold : fonts.openSansBold}
              titleColor="black"
              rightIcon
            />
          ),
        }}
      />
      <Stack.Screen
        name={searchStackName.VIEW_POST}
        component={ViewPost}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigation;
