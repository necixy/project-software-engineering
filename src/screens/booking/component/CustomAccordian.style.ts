import {StyleSheet} from 'react-native';
import {fonts} from 'src/theme/fonts';

const renderAccordian = StyleSheet.create({
  tabContainer: {marginBottom: 10, zIndex: 99},

  header: {
    backgroundColor: '#D7ECFD',
    paddingLeft: 10,
    paddingVertical: 13,
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: '#D7ECFD',
  },

  tabData: {
    fontFamily: fonts.openSansBold,
    paddingRight: 10,
    textAlign: 'right',
  },

  bodyContainer: {
    borderRadius: 7,
    backgroundColor: '#D7ECFD',
    overflow: 'hidden',
    borderWidth: 0,
    marginTop: 0,
    zIndex: 99,
  },

  body: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 10,
    // borderWidth: 1,
  },
});

export default renderAccordian;
