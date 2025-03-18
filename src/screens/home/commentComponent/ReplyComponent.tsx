import { View, Text } from 'react-native'
import React, { useTransition } from 'react'
import Avatar from 'src/shared/components/imageComponent/Avatar'
import CustomText from 'src/shared/components/customText/CustomText'
import CustomButton from 'src/shared/components/customButton/CustomButton'
import { globalStyles } from 'src/constants/globalStyles.style'
import useReply from '../useHome/useReply'
import { useTranslation } from 'react-i18next'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { colors } from 'src/theme/colors'

const ReplyComponent = ({ item, replyTo, setReplyTo, commentId, author }:TReplyComponentProps) => {
    const { profileName, profileImage, isLiked, repliedUser, setIsLiked, timeString, like, likeArray, uid, unLike } = useReply({ item, commentId })
    const { t } = useTranslation()
    return (
        <View style={[globalStyles.row, { marginLeft: 50, marginTop: 5, marginRight: 10 }]}>
            <Avatar source={profileImage != '' ? { uri: profileImage } : undefined} style={{ height: 35, width: 35 }} />
            <View style={[globalStyles.justifyContent, globalStyles.flex, { marginLeft: 10 }]}>
                <CustomText fontSize={12} fontFamily='arialRoundedBold'>
                    {profileName}
                    <CustomText color='grey' fontFamily='arialRegular' fontSize={12}>
                        {" "}{timeString}{item.uid == author ? ` ${'\u2022'} ${t('customWords:author')}` : null}{likeArray.includes(author) ? <> {'\u2022'} <MaterialCommunityIcons name='heart' style={{ color: 'red' }} /> {t('customWords:byAuthor')}</> : null}
                    </CustomText>
                </CustomText>
                <CustomText fontFamily='arialRegular' fontSize={14}>
                    <CustomText color='primary' fontSize={14} fontFamily='arialRegular'>{item?.profileName} </CustomText>
                    {item.comment}
                </CustomText>
                <CustomButton onPress={() => {
                    setReplyTo({ profileName, repliedUser: item.uid, commentId: commentId })
                }} type='unstyled' >
                    <CustomText fontSize={12} fontFamily='arialRoundedBold'>
                        {t('customWords:Reply')}
                    </CustomText>
                </CustomButton>
            </View>
            <View style={[{ alignSelf: 'center', marginLeft: 10 }]}>
                <CustomButton type='unstyled'  onPress={() => {
                    setIsLiked(!isLiked);
                    likeArray.includes(uid) ? unLike() : like()
                }}>
                {likeArray.length > 0 &&
                    <CustomText textAlign='center' style={{position:'absolute',top:15}}>
                        {likeArray.length}
                    </CustomText>
                }
                <MaterialCommunityIcons name={likeArray.includes(uid) ? 'heart' : 'heart-outline'} style={[{ alignSelf: 'center', color: likeArray.includes(uid) ? 'red' : colors.grey ,}]}  size={15} />
                </CustomButton>
            </View>
        </View>
    )
}

export default ReplyComponent