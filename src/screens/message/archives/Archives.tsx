import React from 'react';
import SwipeList from '../component/SwipeList';
import {View} from 'react-native';
import renderArchive from './Archives.style';
import useSwipeList from '../component/useSwipeList';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Empty from 'src/shared/components/placeholder/Empty';
import {colors} from 'src/theme/colors';

const Archives = () => {
  const {channelList, channelDetails, userId, archiveList, isLoading} =
    useSwipeList();
  return (
    <View style={[renderArchive.container]}>
      {isLoading ? (
        <LoadingSpinner />
      ) : archiveList?.length ? (
        <SwipeList
          archive={true}
          archiveList={archiveList}
          channelDetails={channelDetails}
          channelList={channelList}
          userId={userId}
        />
      ) : (
        <Empty
          style={{flex: 1}}
          text="No Archive found"
          iconElement={
            <EvilIcons
              color={colors.grey}
              size={60}
              name="archive"
              style={{borderWidth: 1, borderColor: '#fff', paddingBottom: 2}}
            />
          }
        />
      )}
    </View>
  );
};

export default Archives;
