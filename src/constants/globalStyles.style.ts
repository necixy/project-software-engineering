import {StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from './deviceInfo';
import {colors} from '../theme/colors';

export const globalStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  screenCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyContent: {
    justifyContent: 'center',
  },
  justifyContentSB: {
    justifyContent: 'space-between',
  },
  mt1: {
    marginTop: 10,
  },
  mt2: {
    marginTop: 20,
  },
  mt3: {
    marginTop: 30,
  },
  mb1: {
    marginBottom: 10,
  },
  mv1: {
    marginVertical: 10,
  },
  mv2: {
    marginVertical: 20,
  },
  mt4: {
    marginTop: 40,
  },
  mb30: {
    marginBottom: 30,
  },
  mb5: {
    marginBottom: 50,
  },
  mh1: {
    marginHorizontal: 10,
  },
  mh2: {
    marginHorizontal: 20,
  },
  p2: {
    padding: 20,
  },
  pb2: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ph2: {
    paddingHorizontal: 20,
  },
  pv2: {
    paddingVertical: 20,
  },
  mhv: {
    marginHorizontal: 20,
    marginVertical: 40,
  },
  dashBoarder: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: colors?.secondary,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mb2: {
    marginBottom: 20,
  },
  upperCase: {
    textTransform: 'uppercase',
  },
  lineBorder: {
    borderBottomWidth: 1,
    width: SCREEN_WIDTH * 0.8,
    marginVertical: SCREEN_HEIGHT * 0.04,
    alignSelf: 'center',
  },
  lineBorderFull: {
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: SCREEN_HEIGHT * 0.04,
    alignSelf: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleImage: {
    borderRadius: 100,
  },
});
