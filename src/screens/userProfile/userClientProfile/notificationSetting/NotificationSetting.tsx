import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import Container from 'src/shared/components/container/Container';
import SwitchListItem from '../../component/SwitchListItem';
import useNotification from './useNotification';

const NotificationSetting = () => {
  const {data, handlePress} = useNotification();
  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{paddingHorizontal: 10}}>
      <FlatList
        data={data}
        keyExtractor={item => item?.name?.toString() ?? ''}
        contentContainerStyle={{marginTop: 30}}
        renderItem={({item, index}: any) => (
          <SwitchListItem
            key={index}
            item={item}
            onPressHandle={() => handlePress(item)}
            toggleSwitch={() => handlePress(item)}
            labelStyle={{color: '#000'}}
            containerStyle={{
              alignSelf: 'flex-start',
              // marginHorizontal: 30,
              paddingHorizontal: 20,
            }}
            isEnabled={item?.status}

            // isEnabled={activeNotifications?.includes(item?.name)}
          />
        )}
      />
    </Container>
  );
};

export default NotificationSetting;
