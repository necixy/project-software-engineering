import React from 'react';
import {View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {globalStyles} from 'src/constants/globalStyles.style';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import useTimeCalculation from 'src/utils/useTimeCalculation/useTimeCalculation';
import useReviewReply from './useReviewReply';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
const RenderReviewReply = (replyData: {
  id: string;
  reviewReply: string;
  uploadTime: string;
  proId: string;
  reviewId: string;
}) => {
  const {image, likes, name, uid, like, unLike} = useReviewReply(
    replyData,
    replyData.proId,
  );
  return (
    <View
      style={[
        globalStyles.row,
        {
          marginLeft: 20,
          marginTop: 5,
          paddingLeft: 25,
          paddingRight: 10,
          width: '100%',
        },
      ]}>
      <Avatar
        source={image !== '' ? {uri: image} : undefined}
        style={{height: 35, width: 35}}
      />
      <View
        style={[
          globalStyles.justifyContent,
          globalStyles.flex,
          {marginLeft: 10},
        ]}>
        <CustomText color="defaultBlack" fontSize={10} fontFamily="arialBold">
          {name}
        </CustomText>
        <CustomText fontFamily="openSansRegular" fontSize={10}>
          {replyData.reviewReply}
        </CustomText>
        <CustomText fontFamily="arialRegular" fontSize={10} color="grey">
          {useTimeCalculation({
            time: Number(replyData.uploadTime),
            short: true,
          })}
        </CustomText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',marginRight:10
        }}>
        <CustomText
          fontFamily="arialBold"
          fontSize={12}
          color="defaultBlack"
          style={{marginEnd: 7}}>
          {likes.length > 0 ? likes.length : ''}
        </CustomText>
        <CustomButton
          hitSlop={30}
          type="unstyled"
          onPress={() => {
            likes.includes(uid) ? unLike() : like();
          }}>
          <AntDesign
            name={likes.includes(uid) ? 'heart' : 'hearto'}
            color={likes.includes(uid) ? 'red' : 'black'}
            size={20}
          />
        </CustomButton>
      </View>
    </View>
  );
};

export default RenderReviewReply;
