import {View, Text, FlatList, ScrollView} from 'react-native';
import React, {useState} from 'react';

import CustomText from 'src/shared/components/customText/CustomText';
import {t} from 'i18next';
import Icon from 'src/assets/svg';
import {globalStyles} from 'src/constants/globalStyles.style';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {useAppSelector} from 'src/redux/reducer/reducer';
import useFetchReviews from './hooks/useFetchReviews';
import RenderPostComments from '../userProfileHeader/RenderPostComments';
import Empty from 'src/shared/components/placeholder/Empty';
import CustomImage from 'src/shared/components/customImage/CustomImage';
import {colors} from 'src/theme/colors';
import {SCREEN_HEIGHT} from 'src/constants/deviceInfo';
import {Tabs} from 'react-native-collapsible-tab-view';
const ReviewList = ({proId}: {proId: string | undefined}) => {
  const [like, setLike] = useState(false);
  const uid = useAppSelector(state => state.userReducer.userDetails.uid);
  const {reviews, replyTo, setReplyTo, reviewReply, setReviewRelpy, submit} =
    useFetchReviews(proId ? proId : uid);
  return (
    <FlatList
      contentContainerStyle={{
        padding: 4,
        backgroundColor: '#fff',
        flex: 1,
        // height:SCREEN_HEIGHT
      }}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      data={reviews}
      renderItem={({item, index}) => {
        return (
          <RenderPostComments
            item={item}
            index={index}
            like={like}
            setLike={setLike}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            reviewReply={reviewReply}
            setReviewRelpy={setReviewRelpy}
            submit={submit}
          />
        );
      }}
      keyExtractor={(item, index) => index + ''}
      ListEmptyComponent={
        <Empty
          text={t('common:noReviewYet')}
          iconElement={
            <CustomImage
              source={require('src/assets/images/emptyPost.png')}
              style={{borderRadius: 0}}
            />
          }
        />
      }
      // ListFooterComponent={() => {
      //     if (replyTo.uid == '') {
      //         return null;
      //     }
      //     return (
      //         <View style={{ borderTopWidth: 0.4, borderColor: colors.inputGrey, bottom: 0 }}>
      //             <View
      //                 style={{
      //                     padding: 5,
      //                     paddingLeft: 50,
      //                     flexDirection: 'row',
      //                     justifyContent: 'space-between',
      //                 }}>
      //                 <CustomText
      //                     fontFamily="arialRegular"
      //                     fontSize={18}
      //                     color="grey">
      //                     {t('customWords:replyingTo')} : {replyTo.profileName}
      //                 </CustomText>
      //                 <Icon
      //                     name="cancel"
      //                     height={20}
      //                     width={20}
      //                     onPress={() => setReplyTo({ profileName: '', reviewId: '', uid: '' })}
      //                 />
      //             </View>

      //             <View
      //                 style={[
      //                     globalStyles.row,
      //                     { paddingHorizontal: 10, paddingBottom: 30, marginTop: 10 },
      //                 ]}>
      //                 <Avatar
      //                     style={{ height: 45, width: 45, marginRight: 10 }}
      //                 // source={profile ? {uri: profile} : undefined}
      //                 />
      //                 <CustomInput
      //                     value={reviewReply}
      //                     onChangeText={text => {
      //                         setReviewRelpy(text);
      //                     }}
      //                     textInputProps={{ onSubmitEditing: submit }}
      //                     placeHolderText={t('customWords:addComment')}
      //                     containerStyle={[
      //                         globalStyles.flex,
      //                         globalStyles.justifyContent,
      //                     ]}
      //                     inputBoxStyle={{
      //                         fontSize: fontSizePixelRatio(14),
      //                         alignItems: 'center',
      //                         paddingLeft: 20,
      //                     }}
      //                     inputContainer={{
      //                         height: 45,
      //                         borderRadius: 25,
      //                         borderWidth: 1,
      //                         padding: 10,
      //                     }}
      //                 />
      //             </View>
      //         </View>
      //     )
      // }}
      // ListFooterComponent={
      //   <View style={{borderWidth: 1}}>
      //     <CustomImage
      //       source={{
      //         uri: `${'https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png'}`,
      //       }}
      //       style={{
      //         width: 30,
      //         height: 30,
      //         margin: 1,
      //         zIndex: 99,
      //         marginTop: 5,
      //       }}
      //     />
      //   </View>
      // }
    />
  );
};

export default ReviewList;
