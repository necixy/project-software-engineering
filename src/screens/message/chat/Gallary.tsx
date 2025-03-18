import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';

type Props = {
  data?: any;
  onPress?: any;
  isLoading: boolean;
};

const Gallary = ({data, onPress, isLoading}: Props) => {
  const renderItem = ({item}: {item: any}) => {
    return (
      <Image
        source={{uri: item?.path}}
        style={{height: SCREEN_HEIGHT * 0.75, width: SCREEN_WIDTH}}
        resizeMode="contain"
      />
    );
  };
  return (
    <View style={styles.container}>
      <FlatList horizontal pagingEnabled data={data} renderItem={renderItem} />
      {/* <TextInput placeholder="message" style={styles.textInput} /> */}
      {isLoading ? (
        <ActivityIndicator
          size={35}
          color={colors.primary}
          style={{marginBottom: 20}}
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Icon name="send-outline" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Gallary;

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'white',
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  textInput: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    paddingLeft: 10,
  },
  button: {
    width: 50,
    backgroundColor: colors.primary,
    borderRadius: 30,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
    alignSelf: 'center',
    height: 50,
    marginBottom: 20,
  },
});
