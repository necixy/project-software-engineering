import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {IS_IOS, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {useAppSelector} from 'src/redux/reducer/reducer';
import BookingCheckout from 'src/screens/booking/bookingCheckout/BookingCheckout';
import BookingHistory from 'src/screens/booking/bookingHistory/BookingHistory';
import MissionHistory from 'src/screens/booking/bookingHistory/MissionHistory';
import BookingMenu from 'src/screens/booking/bookingMenu/BookingMenu';
import UserBookingMenu from 'src/screens/booking/bookingMenu/UserBookingMenu';
import BookingRatings from 'src/screens/booking/bookingRatings/BookingRatings';
import RequestDetail from 'src/screens/booking/requestDetail/RequestDetail';
import Dashboard from 'src/screens/dashboard/Dashboard';
import Following from 'src/screens/follows/following/Following';
import BookAvailability from 'src/screens/manageAvailability/BookAvailability';
import ManageAvailability from 'src/screens/manageAvailability/ManageAvailability';
import Archives from 'src/screens/message/archives/Archives';
import Chat from 'src/screens/message/chat/Chat';
import StripeOnBoardWebView from 'src/screens/userProfile/component/StripeOnBoardWebView';
import SwitchPro from 'src/screens/userProfile/switchToPro/SwitchPro';
import PersonalInfo from 'src/screens/userProfile/switchToPro/editPersonalInfo/PersonalInfo';
import ProPhoneNumber from 'src/screens/userProfile/switchToPro/editPersonalInfo/proPhoneNumber/ProPhoneNumber';
import ProTermsCondition from 'src/screens/userProfile/switchToPro/editPersonalInfo/proTermsNcondition/ProTermsCondition';
import ProVerifyCode from 'src/screens/userProfile/switchToPro/editPersonalInfo/proVerifyCode/ProVerifyCode';
import EditClientProfile from 'src/screens/userProfile/userClientProfile/editProfile/EditClientProfile';
import NotificationSetting from 'src/screens/userProfile/userClientProfile/notificationSetting/NotificationSetting';
import UserSetting from 'src/screens/userProfile/userClientProfile/settings/UserSetting';
import EditProLocation from 'src/screens/userProfile/userProProfile/editProLocation/EditProLocation';
import ProLocationMap from 'src/screens/userProfile/userProProfile/editProLocation/component/ProLocationMap/ProLocationMap';
import EditProfession from 'src/screens/userProfile/userProProfile/editProfession/EditProfession';
import EditProProfile from 'src/screens/userProfile/userProProfile/editProfile/EditProProfile';
import UserManagementPro from 'src/screens/userProfile/userProProfile/management/UserManagementPro';
import ViewMap from 'src/screens/viewMap/ViewMap';
import ViewPost from 'src/screens/viewProfile/component/ViewPost';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {
  capitalizeString,
  fontSizePixelRatio,
} from 'src/utils/developmentFunctions';
import {screenStackName} from './constant/screenStackName';
import {screenStackParams} from './params/screenStackParams';
import PdfViewer from 'src/screens/auth/components/PdfViewer';
import CountryPicker from 'src/screens/userProfile/switchToPro/editPersonalInfo/CountryPicker';
import CountryCodePicker from 'src/screens/userProfile/component/CountryCodePicker';
import AboutVita from 'src/screens/aboutVita/AboutVita';
import HelpSupport from 'src/screens/helpSupport/HelpSupport';

const screenStack = createNativeStackNavigator<screenStackParams>();

const ScreenStackNavigation = () => {
  const {Navigator, Screen} = screenStack;
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state?.userReducer);
  return (
    <Navigator
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        headerShown: true,
        header: ({route, navigation, options}) => {
          return (
            <CustomHeader
              back
              leftIconColor="black"
              color={'defaultBlack'}
              fontSize={19}
              rightIcon
              titleStyle={{width: '100%'}}
              fontFamily={!IS_IOS ? fonts?.openSansBold : fonts.openSansBold}
              // fontFamily={fonts?.openSansBold}
              // fontFamily={fonts.arialBold}
              lineHeight={30}
              titleColor={'black'}
              navigation={navigation}
              route={route}
            />
          );
        },
      }}>
      {/* Pro User Profile */}
      <Screen
        name={screenStackName.EDIT_PRO_PROFILE}
        component={EditProProfile}
      />

      <Screen
        name={screenStackName.USER_MANAGEMENT_PRO}
        component={UserManagementPro}
      />
      <Screen
        name={screenStackName.MANAGE_AVAILABILITY}
        component={ManageAvailability}
      />

      <Screen
        name={screenStackName.BOOK_AVAILABILITY}
        component={BookAvailability}
      />

      {/* Client User Profile */}

      <Screen
        name={screenStackName.EDIT_CLIENT_PROFILE}
        component={EditClientProfile}
      />

      {/* Client User Profile Settings */}

      <Screen
        name={screenStackName.USER_SETTINGS}
        component={UserSetting}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                // headerContainer={{
                //   alignItems: 'flex-end',
                //   justifyContent: 'flex-start',
                // }}
                back
                // leftIconContainer={{
                //   width: '10%',
                // }}
                // leftIconStyle={{width: '100%'}}
                leftIconColor="black"
                textAlignTitle="left"
                titleColor={'black'}
                fontSize={20}
                fontFamily={!IS_IOS ? fonts?.openSansBold : fonts.openSansBold}
                // fontFamily={fonts?.arialBold}
                lineHeight={22}
                navigation={navigation}
                route={route}
              />
            );
          },
        }}
      />
      <Screen
        name={screenStackName.CLIENT_NOTIFICATIONS}
        component={NotificationSetting}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                // headerContainer={{
                //   alignItems: 'flex-end',
                //   justifyContent: 'flex-start',
                // }}
                back
                leftIconColor="black"
                // leftIconContainer={{
                //   width: '10%',
                // }}
                // leftIconStyle={{width: '100%'}}
                textAlignTitle="left"
                titleColor={'black'}
                fontSize={18}
                fontFamily={!IS_IOS ? fonts?.openSansBold : fonts.openSansBold}
                // fontFamily={fonts?.openSansBold}
                lineHeight={fontSizePixelRatio(22)}
                navigation={navigation}
                route={route}
              />
            );
          },
        }}
      />

      {/* Client to Pro profile switch */}
      <Screen
        name={screenStackName.SWITCH_PRO}
        component={SwitchPro}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                headerContainer={{alignItems: 'center', width: SCREEN_WIDTH}}
                leftIconStyle={{
                  width: SCREEN_WIDTH * 0.1,
                  justifyContent: 'center',
                }}
                back
                navigation={navigation}
                route={route}
              />
            );
          },
        }}
      />
      <Screen
        name={screenStackName.PERSONAL_PRO}
        component={PersonalInfo}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                // headerContainer={{alignItems: 'center', width: SCREEN_WIDTH}}
                leftIconStyle={{
                  width: SCREEN_WIDTH * 0.1,
                  justifyContent: 'center',
                }}
                titleColor={'black'}
                fontSize={18}
                // fontFamily={!IS_IOS ? fonts.openSansBold : 'openSansBold'}
                fontFamily={fonts?.openSansBold}
                lineHeight={30}
                title={t('customWords:personalInformations')}
                titleStyle={{
                  alignSelf: 'center',
                  width: '100%',
                }}
                rightIcon
                back
                navigation={navigation}
                route={route}
              />
            );
          },
        }}
      />
      {/* <Screen
        name={screenStackName.PRO_TERMS}
        component={ProTermsCondition}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                headerContainer={{alignItems: 'center', width: SCREEN_WIDTH}}
                leftIconStyle={{
                  width: SCREEN_WIDTH * 0.1,
                  justifyContent: 'center',
                }}
                title={t('common:termsOfUse')}
                titleStyle={{
                  color: '#000',
                  fontSize: fontSizePixelRatio(18),
                  fontFamily: fonts.openSansBold,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  lineHeight: fontSizePixelRatio(30),
                  marginTop: 10,
                }}
                leftIcon={
                  <CustomButton
                    style={{alignSelf: 'center'}}
                    type="unstyled"
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <Entypo
                      name="chevron-left"
                      size={25}
                      color={colors.primary}
                    />
                  </CustomButton>
                }
                navigation={navigation}
                route={route}
              />
            );
          },
        }}
      /> */}
      <Screen
        name={screenStackName.PRO_VERIFY_CODE}
        component={ProVerifyCode}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                headerContainer={{alignItems: 'center', width: SCREEN_WIDTH}}
                leftIconStyle={{
                  width: SCREEN_WIDTH * 0.1,
                  justifyContent: 'center',
                }}
                title=""
                titleStyle={{
                  marginTop: 10,
                }}
                fontSize={18}
                // fontFamily={!IS_IOS ? fonts.openSansBold : 'openSansBold'}
                fontFamily={fonts?.openSansBold}
                lineHeight={30}
                leftIcon={
                  <CustomButton
                    style={{alignSelf: 'center'}}
                    type="unstyled"
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <Entypo
                      name="chevron-left"
                      size={25}
                      color={colors.primary}
                    />
                  </CustomButton>
                }
                navigation={navigation}
                route={route}
              />
            );
          },
        }}
      />
      <Screen
        name={screenStackName.PRO_PHONE_NUMBER}
        component={ProPhoneNumber}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                headerContainer={{alignItems: 'center', width: SCREEN_WIDTH}}
                leftIconStyle={{
                  width: SCREEN_WIDTH * 0.1,
                  justifyContent: 'center',
                }}
                title=""
                titleStyle={{
                  marginTop: 5,
                }}
                back
                navigation={navigation}
                route={route}
              />
            );
          },
        }}
      />
      {/* Pro profile Request details */}
      <Screen
        name={screenStackName.REQUEST_DETAILS}
        component={RequestDetail}
        options={
          {
            // headerShown: false,
            // header: ({navigation, route}: any) => {
            //   return (
            //     <CustomHeader
            //       headerContainer={{
            //         alignItems: 'center',
            //         // marginTop: 2,
            //       }}
            //       leftIconColor="black"
            //       back
            //       titleStyle={{width: '100%'}}
            //       fontFamily={
            //         route?.params?.headingText == t('common:bookingDetails')
            //           ? 'fredokaSemiBold'
            //           : 'openSansBold'
            //       }
            //       fontSize={20}
            //       lineHeight={30}
            //       titleColor={
            //         route?.params?.headingText == t('common:bookingDetails')
            //           ? 'blue'
            //           : 'black'
            //       }
            //       rightIcon
            //       title={
            //         route?.params?.headingText == t('common:bookingDetails')
            //           ? t('common:vita')
            //           : route?.params?.headingText
            //       }
            //       navigation={navigation}
            //     />
            //   );
            // },
          }
        }
      />

      {/* Pro profile mission details */}

      {/* <Screen
        name={screenStackName.MISSION_DETAILS}
        component={MissionDetail}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                headerContainer={{alignItems: 'center'}}
                leftIcon={
                  <CustomButton
                    type="unstyled"
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <Entypo name="chevron-left" size={25} color="#1a1a1a" />
                  </CustomButton>
                }
                titleStyle={{
                  color: '#1a1a1a',
                  fontSize: fontSizePixelRatio(18),
                  fontFamily: fonts?.openSansBold,
                  lineHeight: 24,
                  marginTop: 10,
                }}
                navigation={navigation}
                route={route}
              />
            );
          },
        }}
      /> */}

      <Screen
        name={screenStackName.ARCHIVES}
        component={Archives}
        options={{
          header: ({navigation, route}) => {
            return (
              <CustomHeader
                back
                navigation={navigation}
                route={route}
                textAlignTitle="left"
                titleStyle={{alignSelf: 'flex-start'}}
                fontFamily={'openSansBold'}
                fontSize={20}
              />
            );
          },
        }}
      />

      <Screen
        name={screenStackName.DASHBOARD}
        component={Dashboard}
        options={{
          headerShown: false,
          // header: ({navigation, route}) => {
          //   return (
          //     <View style={{backgroundColor: colors?.primary, zIndex: 1}}>
          //       <CustomHeader
          //         headerContainer={{
          //           alignItems: 'center',
          //           justifyContent: 'flex-start',
          //           backgroundColor: colors?.primary,
          //         }}
          //         textAlignTitle="center"
          //         back
          //         leftIconColor="black"
          //         leftIconContainer={{
          //           width: '10%',
          //           marginEnd: 0,
          //         }}
          //         leftIconStyle={{width: '100%', marginEnd: 0}}
          //         titleStyle={{borderWidth: 0}}
          //         fontFamily="arialBold"
          //         fontSize={18}
          //         titleColor="white"
          //         // titleStyle={{
          //         //   // color: '#2D9BF0',
          //         //   color: colors?.secondary,
          //         //   fontSize: fontSizePixelRatio(18),
          //         //   fontFamily: fonts?.openSansBold,
          //         //   lineHeight: 30,
          //         //   marginTop: 10,
          //         //   // left: -60,
          //         //   // borderWidth: 1,
          //         //   textAlign: 'center',
          //         // }}
          //         navigation={navigation}
          //         route={route}
          //         rightIcon
          //       />
          //     </View>
          //   );
          // },
        }}
      />

      <Screen name={screenStackName.MANAGE_MENU} component={BookingMenu} />
      <Screen
        name={screenStackName.USER_BOOKING_MENU}
        component={UserBookingMenu}
      />

      <Screen
        name={screenStackName.FOLLOWING}
        component={Following}
        options={{
          header: ({navigation}) => (
            <CustomHeader
              back
              leftIconColor="black"
              fontFamily={fonts?.openSansBold}
              fontSize={18}
              lineHeight={30}
              title={capitalizeString(userDetails?.displayName)}
              titleColor="black"
              rightIcon
              titleStyle={{width: '100%'}}
            />
          ),
        }}
      />
      <Screen
        name={screenStackName.Chat}
        component={Chat}
        options={{
          header: ({navigation, route}) => (
            <CustomHeader
              back
              route={route}
              leftIconColor="blue"
              // leftIconStyle={{flex: 4, borderWidth: 2}}
              // leftIcon={
              //   <CustomButton
              //     type="unstyled"
              //     style={{justifyContent: 'center'}}
              //     onPress={() => {
              //       navigation.goBack();
              //     }}>
              //     <Entypo
              //       name="chevron-left"
              //       style={{alignSelf: 'center'}}
              //       size={30}
              //       color={colors?.primary}
              //     />
              //   </CustomButton>
              // }
            />
          ),
        }}
      />

      <Screen
        name={screenStackName.VIEW_POST}
        component={ViewPost}
        options={{headerShown: false}}
      />

      <Screen
        name={screenStackName.BOOKING_CHECKOUT}
        component={BookingCheckout}
        options={{
          headerShown: false,
          // header: ({route}) => (
          //   <CustomHeader
          //     back
          //     leftIconColor="white"
          //     leftIconStyle={{width: '10%'}}
          //     fontFamily={fonts?.openSansBold}
          //     fontSize={fontSizePixelRatio(16)}
          //     lineHeight={fontSizePixelRatio(25)}
          //     // titleColor="white"
          //     // titleStyle={{
          //     //   color: colors.secondary,
          //     // }}
          //     headerContainer={{
          //       backgroundColor: colors?.primary,
          //       alignItems: 'center',
          //     }}
          //     route={route}
          //   />
          // ),
        }}
      />

      <Screen
        name={screenStackName.EDIT_PRO_LOCATION}
        component={EditProLocation}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name={screenStackName.VIEW_PRO_MAP}
        component={ProLocationMap}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name={screenStackName.VIEW_MAP}
        component={ViewMap}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name={screenStackName.EDIT_PROFESSION}
        component={EditProfession}
        options={{
          headerShown: false,
        }}
      />
      {/* Add card screen for payment  */}
      <Screen
        name={screenStackName.WEB_VIEW}
        component={StripeOnBoardWebView}
        options={{headerShown: false}}
        // options={{
        //   header: ({navigation, route}) => {
        //     return (
        //       <CustomHeader
        //         headerContainer={{
        //           alignItems: 'center',
        //         }}
        //         textAlignTitle="center"
        //         leftIcon={
        //           <CustomButton
        //             type="unstyled"
        //             onPress={() => {
        //               navigation.goBack();
        //             }}>
        //             <Entypo
        //               name="chevron-left"
        //               size={25}
        //               color={colors.defaultBlack}
        //             />
        //           </CustomButton>
        //         }
        //         title="Add Card"
        //         titleStyle={{
        //           color: colors.defaultBlack,
        //           fontSize: fontSizePixelRatio(20),
        //           fontFamily: fonts?.openSansBold,
        //           lineHeight: 30,
        //           marginTop: 10,
        //         }}
        //         navigation={navigation}
        //         route={route}
        //       />
        //     );
        //   },
        // }}
      />

      <Screen
        name={screenStackName.BOOKING_HISTORY}
        component={BookingHistory}
        options={{
          headerShadowVisible: false,
          header: ({route}: any) => {
            return (
              <CustomHeader
                // headerContainer={{
                //   alignItems: 'center',
                // }}
                title={route?.params?.headerName ?? t('common:bookingHistory')}
                back
                leftIconColor="blue"
                leftIconContainer={{width: '25%'}}
                // textAlignTitle="center"
                fontFamily="openSansBold"
                fontSize={18}
                titleColor="black"
                lineHeight={25}
                titleStyle={{
                  alignSelf: 'stretch',
                  width: '100%',
                  // fontFamily: fonts?.openSansBold,
                  // fontSize: fontSizePixelRatio(20),
                  // color: colors.defaultBlack,
                }}
                rightIcon
              />
            );
          },
        }}
      />
      <Screen
        name={screenStackName.MISSION_HISTORY}
        component={MissionHistory}
        options={{
          headerShadowVisible: false,
          header: ({route}: any) => {
            return (
              <CustomHeader
                title={route?.params?.headerName ?? t('common:missionHistory')}
                back
                leftIconColor="blue"
                leftIconContainer={{width: '25%'}}
                fontFamily="openSansBold"
                fontSize={18}
                titleColor="black"
                lineHeight={25}
                titleStyle={{
                  alignSelf: 'stretch',
                  width: '100%',
                }}
                rightIcon
              />
            );
          },
        }}
      />

      <Screen
        name={screenStackName.BOOKING_RATINGS}
        component={BookingRatings}
        // options={{
        //   headerShadowVisible: false,
        //   header: ({route}: any) => {
        //     return (
        //       <CustomHeader
        //         headerContainer={{
        //           alignItems: 'center',
        //         }}
        //         title={route?.params?.headerName}
        //         back
        //         leftIconColor="blue"
        //         leftIconContainer={{width: '25%'}}
        //         textAlignTitle="center"
        //         lineHeight={25}
        //         titleStyle={{
        //           fontFamily: fonts?.openSansBold,
        //           fontSize: fontSizePixelRatio(20),
        //           color: colors.defaultBlack,
        //         }}
        //       />
        //     );
        //   },
        // }}
      />

      <Screen
        name={screenStackName.PDF_VIEWER}
        component={PdfViewer}
        options={{headerShown: false}}
      />

      <Screen
        name={screenStackName.COUNTRY_PICKER}
        component={CountryCodePicker}
        options={{headerShown: false}}
      />

      <Screen
        name={screenStackName.ABOUT_VITA}
        component={AboutVita}
        options={{
          header: ({route}: any) => {
            return (
              <CustomHeader
                title={t('common:aboutVita')}
                back
                leftIconColor="black"
                leftIconContainer={{width: '25%'}}
                fontFamily="openSansBold"
                fontSize={18}
                titleColor="black"
                lineHeight={25}
                textAlignTitle="left"
                titleStyle={{
                  alignSelf: 'stretch',
                  width: '100%',
                  fontFamily: fonts?.openSansBold,
                  color: colors.defaultBlack,
                }}
                rightIcon
              />
            );
          },
        }}
      />
      <Screen
        name={screenStackName.HELP_SUPPORT}
        component={HelpSupport}
        options={{
          header: ({route}: any) => {
            return (
              <CustomHeader
                title={t('common:helpAndSupport')}
                back
                leftIconColor="black"
                leftIconContainer={{width: '25%'}}
                fontFamily="openSansBold"
                fontSize={18}
                titleColor="black"
                lineHeight={25}
                textAlignTitle="left"
                titleStyle={{
                  alignSelf: 'stretch',
                  width: '100%',
                  fontFamily: fonts?.openSansBold,
                  color: colors.defaultBlack,
                }}
                rightIcon
              />
            );
          },
        }}
      />
    </Navigator>
  );
};

export default ScreenStackNavigation;
