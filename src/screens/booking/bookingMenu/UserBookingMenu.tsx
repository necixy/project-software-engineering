// Other user see this menu list and use useMenuList hook

import React, {useLayoutEffect} from 'react';
import {FlatList, ListRenderItemInfo, StatusBar, View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {globalStyles} from 'src/constants/globalStyles.style';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import Empty from 'src/shared/components/placeholder/Empty';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import CustomAccordion from '../component/CustomAccordian';
import renderMenu from './BookingMenu.style';
import renderMenuSwipe from './component/MenuSwipeList.style';
import useUserBooking from './component/useUserBooking';
import {getCurrencySymbol} from 'src/utils/getCurrencySymbol';

const UserBookingMenu = ({
  route: {params},
}: {
  route: {
    params: {
      name?: string;
      profile?: string;
      uid?: string;
      fcmTokens?: any;
      rating?: string;
      default_currency?: string;
    };
  };
}) => {
  const {name, profile, uid, fcmTokens, rating, default_currency} =
    params ?? {};
  const {t, navigation, menuData, fetching} = useUserBooking(uid);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          titleType="custom"
          leftIconColor="white"
          back
          lineHeight={25}
          fontFamily={'openSansBold'}
          fontSize={18}
          titleColor={'black'}
          textAlignTitle="left"
          headerContainer={{
            justifyContent: 'flex-start',
            backgroundColor: colors?.primary,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              alignItems: 'center',
              width: '100%',
            }}>
            <Avatar
              source={
                profile
                  ? {
                      uri: profile,
                    }
                  : undefined
              }
              style={{
                width: 40,
                height: 40,
                zIndex: 99,
                borderRadius: 50,
                marginEnd: 10,
              }}
            />
            <CustomText
              color={'secondary'}
              numberOfLines={2}
              fontFamily="openSansBold"
              style={{width: '80%'}}>
              {name ?? 'user'}
            </CustomText>
          </View>
        </CustomHeader>
      ),
    });
  }, []);

  const renderServiceData = (
    {item}: ListRenderItemInfo<menuServiceDetails>,
    menuId: any,
  ) => {
    return (
      // <Pressable
      //   style={({pressed}) => [
      //     renderMenuSwipe.container,
      //     {
      //       backgroundColor: 'pink',
      //       zIndex: 999,
      //       transform: [{scale: pressed ? 0.98 : 1}],
      //     },
      //   ]}
      //   // onPress={() => {
      //   //   navigation.navigate(screenStackName.BOOK_AVAILABILITY, {
      //   //     item,
      //   //     name,
      //   //     profile,
      //   //     uid,
      //   //     fcmTokens,
      //   //     menuId,
      //   //   });
      //   // }}
      // >
      <CustomAccordion
        onPress={() => {
          navigation.navigate(screenStackName.BOOK_AVAILABILITY, {
            item,
            name,
            profile,
            uid,
            fcmTokens,
            menuId,
            rating,
            default_currency,
          });
        }}
        heading={item?.serviceName}
        amount={getCurrencySymbol(default_currency) + item?.servicePrice}
        children={
          item?.serviceDetails ? (
            <View style={{gap: 3}}>
              <CustomText fontSize={12} style={renderMenuSwipe.includes}>
                {item?.serviceDetails}
              </CustomText>
            </View>
          ) : null
        }
      />
      // </Pressable>
    );
  };
  return (
    <Container
      isScrollable={false}
      isLoading={fetching}
      alwaysBounceVertical={false}
      // contentContainerStyle={{flex: 1}}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={colors?.primary} />
      <FlatList
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={renderMenu.container}
        scrollEnabled
        bounces={false}
        alwaysBounceVertical={false}
        contentContainerStyle={{flexGrow: 1}}
        removeClippedSubviews={false}
        ListHeaderComponent={
          menuData?.length! > 0 ? (
            <CustomButton type="unstyled" style={renderMenu.headerButton}>
              <CustomText fontSize={14} style={renderMenu.heading}>
                {t('common:chooseService')}
              </CustomText>
            </CustomButton>
          ) : null
        }
        data={menuData}
        keyExtractor={(item, index) =>
          item?.id?.toString() ?? index?.toString()
        }
        renderItem={({item}) => (
          <View>
            <CustomText fontSize={12} style={renderMenuSwipe.services}>
              {item?.title ?? 'section name'}
            </CustomText>

            <SwipeListView
              scrollEnabled={false}
              keyExtractor={(item, index) =>
                item?.id + index + '' ?? index + ''
              }
              data={item?.subSection ? Object.values(item?.subSection) : []}
              previewDuration={1000}
              disableRightSwipe
              disableLeftSwipe
              renderItem={(data: menuServiceDetails[] | any) =>
                renderServiceData(data, item?.id)
              }
            />
          </View>
        )}
        ListEmptyComponent={
          // !fetching && (!!menuData || menuData?.length == 0) ? (
          <Empty
            text="No items yet"
            iconElement={
              <Ionicons name="book" size={40} style={{color: '#808080'}} />
            }
            style={[globalStyles.screenCenter]}
          />
          // ) : null
        }
        // ListFooterComponentStyle={[globalStyles.screenCenter]}
        // ListFooterComponent={
        //   !fetching && (menuData == null || menuData == undefined) ? (
        //     <Empty
        //       text={t('customWords:noMenuYet')}
        //       iconElement={
        //         <Ionicons
        //           name="book-sharp"
        //           size={40}
        //           style={{color: '#808080'}}
        //         />
        //       }
        //     />
        //   ) : null
        // }
      />
    </Container>
  );
};

export default UserBookingMenu;
