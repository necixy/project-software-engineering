// // This code renders the component for the flatlist inside the home screen of the application.
// import { View, Text, Pressable, StyleSheet } from 'react-native';
// import React from 'react';
// import FastImage from 'react-native-fast-image';
// import { globalStyles } from '../../../constants/globalStyles.style';
// import CustomText from '../../../shared/components/customText/CustomText';
// import { colors } from '../../../theme/colors';
// import { SCREEN_WIDTH } from '../../../constants/deviceInfo';
// import LinearGradient from 'react-native-linear-gradient';
// import Avatar from 'src/shared/components/imageComponent/Avatar';
// import ImageComponent from 'src/shared/components/imageComponent/ImageComponent';
// import { t } from 'i18next';
// import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
// import { searchStackName } from 'src/navigation/constant/searchStackRouteName';
// import { useAppSelector } from 'src/redux/reducer/reducer';
// import { tabStackRouteName } from 'src/navigation/constant/tabNavRouteName';
// import { rootStackName } from 'src/navigation/constant/rootStackName';
// import { databaseRef } from 'src/utils/useFirebase/useFirebase';
// import useSearchCard from './useSearchCard';

// //Functional component code for the search screen feed component.
// const SearchedCardComponent = ( searchedCardObject : AlgoliaResult ) => {
//   const { navigate } = useStackNavigation();
//   const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid)
//   // const { uid, saveToSearchHistory } = useSearchCard(searchedCardObject);
//   return (
//     <Pressable
//       onPress={() => {
//         uid !== searchedCardObject?.uid
//           ? navigate(searchStackName.VIEW_PROFILE, {
//             uid: searchedCardObject?.uid,
//           })
//           : navigate(tabStackRouteName.USER_PROFILE_STACK);
//       }}
//       style={{ flex: 0.5, margin: 5 }}>
//       <View style={{ width: SCREEN_WIDTH / 2.1, aspectRatio: 2 / 3 }}>
//         <LinearGradient
//           colors={['rgba(45, 155, 240, 0.5)', 'rgba(255, 255, 255, 0.5)']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={{
//             ...StyleSheet.absoluteFillObject,
//           }}
//         />
//         <ImageComponent
//           source={
//             searchedCardObject?.frontImage
//               ? { uri: searchedCardObject?.frontImage }
//               : undefined
//           }
//           style={{ width: SCREEN_WIDTH / 2.1, aspectRatio: 2 / 3 }}
//         />
//       </View>
//       <View>
//         <View
//           style={[
//             globalStyles.circleImage,
//             {
//               aspectRatio: 1,
//               zIndex: 1,
//               position: 'absolute',
//               top: -32.5,
//               left: 10,
//             },
//           ]}>
//           <LinearGradient
//             colors={['rgba(45, 155, 240, 0.5)', 'rgba(255, 255, 255, 0.5)']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={[
//               globalStyles.circleImage,
//               {
//                 ...StyleSheet.absoluteFillObject,
//               },
//             ]}
//           />
//           <Avatar
//             source={
//               searchedCardObject?.photoURL
//                 ? { uri: searchedCardObject?.photoURL }
//                 : undefined
//             }
//             style={[
//               globalStyles.circleImage,
//               {
//                 width: 45,
//                 aspectRatio: 1,
//                 zIndex: 1,
//                 // position: 'absolute',
//                 // top: -32.5,
//                 // left: 10,
//               },
//             ]}
//           />
//         </View>
//       </View>
//       <View style={{ marginTop: 20, flexDirection: 'row', width: '100%' }}>
//         <View style={[globalStyles.flex]}>
//           <CustomText
//             fontSize={12}
//             fontFamily="openSansBold"
//             style={{
//               marginBottom: 3,
//               color: colors?.defaultBlack,
//             }}>
//             {searchedCardObject?.displayName}
//           </CustomText>
//         </View>
//         {searchedCardObject?.rating ? (
//           <>
//             <ImageComponent
//               resizeMode="cover"
//               source={require('../../../assets/png/yelloStar.png')}
//               style={{
//                 aspectRatio: 1,
//                 width: 21,
//                 bottom: 3,
//                 backgroundColor: colors.secondary,
//               }}
//             />
//             <CustomText
//               fontSize={12}
//               fontFamily="openSansRegular"
//               style={{ color: colors?.defaultBlack, bottom: 2.5 }}>
//               {String(Number(searchedCardObject?.rating).toFixed(1))}{' '}
//             </CustomText>
//           </>
//         ) : null}
//       </View>
//       {searchedCardObject?.price && (
//         <CustomText
//           fontSize={12}
//           fontFamily="openSansRegular"
//           style={{ marginVertical: 3 }}>
//           {searchedCardObject.price} / {t('common:Session')}
//         </CustomText>
//       )}
//       <CustomText
//         fontSize={12}
//         fontFamily="openSansRegular"
//         style={{ marginVertical: 3 }}>
//         {searchedCardObject?.proPersonalInfo?.address?.city
//           ? searchedCardObject?.proPersonalInfo?.address?.city
//           : ''}
//       </CustomText>
//     </Pressable>
//   );
// };

// export default SearchedCardComponent;

import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {globalStyles} from '../../../constants/globalStyles.style';
import CustomText from '../../../shared/components/customText/CustomText';
import {colors} from '../../../theme/colors';
import {SCREEN_WIDTH} from '../../../constants/deviceInfo';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import ImageComponent from 'src/shared/components/imageComponent/ImageComponent';
import {t} from 'i18next';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {searchStackName} from 'src/navigation/constant/searchStackRouteName';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {tabStackRouteName} from 'src/navigation/constant/tabNavRouteName';
import {getCurrencySymbol} from 'src/utils/getCurrencySymbol';

interface SearchedCardProps {
  searchedCardObject: AlgoliaResult;
}

const SearchedCardComponent: React.FC<SearchedCardProps> = ({
  searchedCardObject,
}) => {
  const {navigate} = useStackNavigation();
  const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid);
  console.log(searchedCardObject);

  return (
    <Pressable
      onPress={() => {
        uid !== searchedCardObject?.uid
          ? navigate(searchStackName.VIEW_PROFILE, {
              uid: searchedCardObject?.uid,
            })
          : navigate(tabStackRouteName.USER_PROFILE_STACK);
      }}
      style={{flex: 0.5, margin: 5}}>
      <View style={{width: SCREEN_WIDTH / 2.1, aspectRatio: 2 / 3}}>
        <LinearGradient
          colors={['rgba(45, 155, 240, 0.5)', 'rgba(255, 255, 255, 0.5)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        <ImageComponent
          source={
            searchedCardObject?.frontImage
              ? {uri: searchedCardObject.frontImage}
              : undefined
          }
          style={{width: SCREEN_WIDTH / 2.1, aspectRatio: 2 / 3}}
        />
      </View>
      <View>
        <View
          style={[
            globalStyles.circleImage,
            {
              aspectRatio: 1,
              zIndex: 1,
              position: 'absolute',
              top: -32.5,
              left: 10,
            },
          ]}>
          <LinearGradient
            colors={['rgba(45, 155, 240, 0.5)', 'rgba(255, 255, 255, 0.5)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[
              globalStyles.circleImage,
              {
                ...StyleSheet.absoluteFillObject,
              },
            ]}
          />
          <Avatar
            source={
              searchedCardObject?.photoURL
                ? {uri: searchedCardObject.photoURL}
                : undefined
            }
            style={[
              globalStyles.circleImage,
              {
                width: 45,
                aspectRatio: 1,
                zIndex: 1,
              },
            ]}
          />
        </View>
      </View>
      <View style={{marginTop: 20, flexDirection: 'row', width: '100%'}}>
        <View style={[globalStyles.flex]}>
          <CustomText
            fontSize={12}
            fontFamily="openSansBold"
            style={{
              marginBottom: 3,
              color: colors.defaultBlack,
            }}>
            {searchedCardObject?.displayName}
          </CustomText>
        </View>

        <ImageComponent
          resizeMode="cover"
          source={require('../../../assets/png/yelloStar.png')}
          style={{
            aspectRatio: 1,
            width: 21,
            bottom: 3,
            backgroundColor: colors.secondary,
          }}
        />
        <CustomText
          fontSize={12}
          fontFamily="openSansRegular"
          style={{color: colors.defaultBlack, bottom: 2.5}}>
          {searchedCardObject?.rating
            ? String(Number(searchedCardObject?.rating).toFixed(1))
            : '--'}{' '}
        </CustomText>
      </View>
      {searchedCardObject?.price && (
        <CustomText
          fontSize={12}
          fontFamily="openSansRegular"
          style={{marginVertical: 3}}>
          {getCurrencySymbol(searchedCardObject.default_currency)}
          {searchedCardObject.price} / {t('common:Session')}
        </CustomText>
      )}
      <CustomText
        fontSize={12}
        fontFamily="openSansRegular"
        style={{marginVertical: 3}}>
        {searchedCardObject?.address?.city || ''}
      </CustomText>
    </Pressable>
  );
};

export default SearchedCardComponent;
