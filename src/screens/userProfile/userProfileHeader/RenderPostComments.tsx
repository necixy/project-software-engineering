import React, {Dispatch, SetStateAction, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCREEN_WIDTH} from '../../../constants/deviceInfo';
import {globalStyles} from '../../../constants/globalStyles.style';
import CustomButton from '../../../shared/components/customButton/CustomButton';
import CustomImage from '../../../shared/components/customImage/CustomImage';
import CustomText from '../../../shared/components/customText/CustomText';
import StarRating from '../../../shared/components/ratingComponent/src';
import {t} from 'i18next';
import useUserReview from './component/useUserReview';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import useTimeCalculation from 'src/utils/useTimeCalculation/useTimeCalculation';
import BottomSheetPicker from 'src/shared/components/customPicker/BottomSheetPicker';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import Icon from 'src/assets/svg';
import {colors} from 'src/theme/colors';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import RenderReviewReply from './RenderReviewReply';
import {useAppSelector} from 'src/redux/reducer/reducer';

interface TRenderPostComment {
  item: any;
  index: number;
  like?: boolean;
  setLike?: (prev: any) => void;
  setReplyTo: Dispatch<
    SetStateAction<{profileName: string; reviewId: string; uid: string}>
  >;
  reviewReply?: string;
  setReviewRelpy: React.Dispatch<React.SetStateAction<string>>;
  submit: () => Promise<void>;
  replyTo?: {
    profileName: string;
    reviewId: string;
    uid: string;
  };
}

const RenderPostComments = ({
  index,
  setLike,
  item,
  setReplyTo,
  reviewReply,
  setReviewRelpy,
  submit,
  replyTo,
}: TRenderPostComment) => {
  const {clientImage, clientName, like, unLike, likes, uid, reviewsReplies} =
    useUserReview(item);
  const [modalOpen, setModalOpen] = useState(false);
  const detail = useAppSelector(state => state?.userReducer?.userDetails);
  return (
    <View
      style={[
        {
          width: SCREEN_WIDTH,
          paddingHorizontal: 15,
          paddingTop: 20,
        },
      ]}>
      <View
        style={[
          globalStyles?.flexRow,
          {width: '100%', paddingHorizontal: 15, alignItems: 'flex-start'},
        ]}>
        <Avatar source={clientImage == '' ? undefined : {uri: clientImage}} />

        <View style={{width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 5,
              alignItems: 'center',
            }}>
            <CustomText
              fontFamily="arialBold"
              fontSize={12}
              color="defaultBlack"
              style={{marginStart: 7, marginEnd: 7}}>
              {clientName}
            </CustomText>
            <StarRating rating={item?.rating} onChange={() => undefined} />
          </View>
          <View>
            <CustomText
              fontFamily="openSansRegular"
              fontSize={10}
              color="defaultBlack"
              style={{marginStart: 7}}>
              {item?.review}
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginVertical: 5,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <CustomText
                fontFamily="arialRegular"
                fontSize={10}
                color="grey"
                style={{marginStart: 7, marginVertical: 5}}>
                {useTimeCalculation({time: item?.uploadTime, short: true})}
              </CustomText>
              {reviewsReplies.length < 1 && uid == item?.proId && (
                <BottomSheetPicker
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  actionElement={
                    <CustomButton
                      type="unstyled"
                      onPress={() => {
                        setReplyTo({
                          profileName: clientName,
                          reviewId: item?.id,
                          uid: item?.clientName,
                        });
                        setModalOpen(true);
                      }}>
                      <CustomText
                        fontFamily="arialBold"
                        fontSize={10}
                        color="grey"
                        style={{marginStart: 7, marginVertical: 5}}>
                        {t('customWords:Reply')}
                      </CustomText>
                    </CustomButton>
                  }
                  FooterComponent={
                    <View style={{}}>
                      <View
                        style={{
                          padding: 5,
                          paddingLeft: 50,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <CustomText
                          fontFamily="arialRegular"
                          fontSize={18}
                          color="grey">
                          {t('customWords:replyingTo')} : {replyTo?.profileName}
                        </CustomText>
                        <Icon
                          name="cancel"
                          height={20}
                          width={20}
                          onPress={() => {
                            setModalOpen(false);
                            setReplyTo({
                              profileName: '',
                              reviewId: '',
                              uid: '',
                            });
                          }}
                        />
                      </View>

                      <View
                        style={[
                          globalStyles.row,
                          {
                            paddingHorizontal: 10,
                            paddingBottom: 30,
                            marginTop: 10,
                          },
                        ]}>
                        <Avatar
                          style={{height: 45, width: 45, marginRight: 10}}
                          source={
                            detail?.photoURL
                              ? {uri: detail?.photoURL}
                              : undefined
                          }
                        />
                        <CustomInput
                          value={reviewReply}
                          autoFocus
                          onChangeText={text => {
                            setReviewRelpy(text);
                          }}
                          onBlur={() => setModalOpen(false)}
                          textInputProps={{
                            onSubmitEditing: () => {
                              submit();
                              setModalOpen(false);
                            },
                          }}
                          placeHolderText={t('customWords:addComment')}
                          containerStyle={[
                            globalStyles.flex,
                            globalStyles.justifyContent,
                          ]}
                          inputBoxStyle={{
                            fontSize: fontSizePixelRatio(14),
                            alignItems: 'center',
                            paddingLeft: 20,
                          }}
                          inputContainer={{
                            height: 45,
                            borderRadius: 25,
                            borderWidth: 1,
                            padding: 10,
                          }}
                        />
                      </View>
                    </View>
                  }
                />
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 10,
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
        </View>
      </View>
      {reviewsReplies.length > 0 && (
        <FlatList
          data={reviewsReplies}
          renderItem={elem => {
            // console.log(elem,item,'elem,item')
            return (
              <RenderReviewReply
                proId={item?.proId}
                id={elem?.item?.id}
                reviewReply={elem?.item?.reviewReply}
                uploadTime={elem?.item?.uploadTime}
                reviewId={item?.id}
              />
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 30,
    height: 30,
    margin: 1,
    zIndex: 99,
    marginTop: 5,
  },
});

export default RenderPostComments;
