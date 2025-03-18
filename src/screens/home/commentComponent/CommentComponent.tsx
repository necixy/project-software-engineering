import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import useComments from '../useHome/useComments'
import CustomText from 'src/shared/components/customText/CustomText'
import Avatar from 'src/shared/components/imageComponent/Avatar'
import { globalStyles } from 'src/constants/globalStyles.style'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomButton from 'src/shared/components/customButton/CustomButton'
import { useTranslation } from 'react-i18next'
import ReplyComponent from './ReplyComponent'
import { colors } from 'src/theme/colors'
const CommentComponent = ({ item, replyTo, setReplyTo, author, feedPostString }:TCommentComponentProps) => {
  const { profileImage, profileName, isLiked, setIsLiked, replies, setShowReply, showReply, timeString, like, likeArray, uid, unLike } = useComments(item, replyTo, setReplyTo, feedPostString)
  const { t } = useTranslation();
  let commentId = item.id;
  return (
    <>
      <View style={[globalStyles.row, globalStyles.mh1,globalStyles.mv1]}>
        <Avatar source={profileImage != '' ? { uri: profileImage } : undefined} style={{ height: 35, width: 35 }} />
        <View style={[globalStyles.justifyContent, globalStyles.flex, { marginLeft: 10 }]}>
          <CustomText fontSize={12} fontFamily='arialRoundedBold'>
            {profileName}
            <CustomText color='grey' fontFamily='arialRegular' fontSize={12}>
              {" "}{timeString}{item.uid == author ? ` ${'\u2022'} ${t('customWords:author')}` : null}{likeArray.includes(author) ? <> {'\u2022'} <MaterialCommunityIcons name='heart' style={{ color: 'red' }} /> {t('customWords:byAuthor')}</> : null}
            </CustomText>
          </CustomText>
          <CustomText fontFamily='arialRegular' fontSize={14}>
            {item.comment}
          </CustomText>
          <View style={[globalStyles.row]}> 
          <CustomButton onPress={() => {
            setReplyTo({ profileName, repliedUser: item.uid, commentId: item.id })
          }} type='unstyled' >
            <CustomText fontSize={12} fontFamily='arialRoundedBold'color='grey'>
              {t('customWords:Reply')}
            </CustomText>
          </CustomButton>
          {item?.numberOfReplies &&
            <CustomButton onPress={() => {
              setShowReply(!showReply)
            }} type='unstyled' >
              <CustomText fontSize={12} fontFamily='arialRoundedBold' color='grey'>
                {showReply ? `   ${t('customWords:hide')}` :(item.numberOfReplies>1? `   ${t('customWords:show')} ${item.numberOfReplies} ${t('customWords:replies')}`:`   ${t('customWords:show')} ${item.numberOfReplies} ${t('customWords:reply')}`)}
              </CustomText>
            </CustomButton>
          }
          </View>
        </View>
        <View style={[{ alignSelf: 'center', marginLeft: 10 }]}>
        <CustomButton type='unstyled'  onPress={() => {
                    setIsLiked(!isLiked);
                    likeArray.includes(uid) ? unLike() : like()
                }}>
          <MaterialCommunityIcons name={likeArray.includes(uid) ? 'heart' : 'heart-outline'} style={[{ alignSelf: 'center', color: likeArray.includes(uid) ? 'red' : colors.grey }]} size={15} />
          {likeArray.length > 0 &&
            <CustomText textAlign='center' style={{position:'absolute',top:15}}>
              {likeArray.length}
            </CustomText>
          }
          </CustomButton>
        </View>
      </View>
      {
        showReply &&
        <FlatList
          data={replies}
          inverted
          ListEmptyComponent={
            <View>
              <ActivityIndicator/>
            </View>
          }
          ItemSeparatorComponent={()=><View style={{ height: 5 }} />}
          renderItem={({ item, index }) => {
            return (
              <ReplyComponent key={index} item={item} replyTo={replyTo} setReplyTo={setReplyTo} commentId={commentId} author={author} />
            )
          }}
        />
      }
    </>
  )
}

export default CommentComponent