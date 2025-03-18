import {StyleSheet} from 'react-native';

const renderSwitchToPro = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  profileImg: {width: 90, height: 90, marginBottom: 20},
  heading: {textAlign: 'center', marginBottom: 20, marginHorizontal: 40},
  description: {
    color: '#808080',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
    left: '5%',
  },
});

export default renderSwitchToPro;
