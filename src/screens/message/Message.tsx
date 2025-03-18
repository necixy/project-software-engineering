import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Empty from 'src/shared/components/placeholder/Empty';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import renderMessage from './Message.style';
import SwipeList from './component/SwipeList';
import useSwipeList from './component/useSwipeList';
import {Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Message = () => {
  const {navigate} = useNavigation<any>();
  const {t} = useTranslation();
  const {channelList, channelDetails, userId, archiveList, isLoading} =
    useSwipeList();
  const archiveNavigation = () =>
    navigate(rootStackName.SCREEN_STACK, {
      screen: screenStackName.ARCHIVES,
    });

  return (
    <Container
      // isLoading={isLoading}
      isScrollable={false}
      contentContainerStyle={renderMessage.container}>
      <CustomButton
        style={renderMessage.box}
        type="unstyled"
        onPress={archiveNavigation}
        // onPress={() => {
        //   comingSoonAlert();
        // }}
      >
        <EvilIcons
          size={25}
          name="archive"
          style={[
            renderMessage.icon,
            {borderWidth: Platform.OS == 'ios' ? 0 : 1, borderColor: '#fff'},
          ]}
        />
        <CustomText fontSize={15} style={renderMessage.title}>
          {t('common:archives')}
        </CustomText>
        <CustomText fontSize={12} style={renderMessage.titleCount}>
          {archiveList?.length ? archiveList?.length : ''}
        </CustomText>
      </CustomButton>
      {isLoading ? (
        <LoadingSpinner />
      ) : channelList?.length ? (
        <SwipeList
          archiveList={archiveList}
          channelDetails={channelDetails}
          channelList={channelList}
          userId={userId}
        />
      ) : (
        <Empty
          style={{flex: 1}}
          iconElement={
            <Ionicons
              name="chatbox-ellipses"
              size={40}
              style={{color: '#808080'}}
            />
          }
          text={t('customWords:noChannelFound')}
        />
      )}
    </Container>
  );
};

export default Message;
