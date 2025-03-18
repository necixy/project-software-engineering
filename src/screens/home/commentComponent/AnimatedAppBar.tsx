import {Animated} from 'react-native';
import {CustomHeader} from '../Home';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
export const AnimatedAppBar = (translateY: any, navigation: any) => {
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
        width: '100%',

        //for animation
        height: SCREEN_WIDTH * 0.1,
        transform: [{translateY: translateY}],
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        elevation: 4,
        zIndex: 1,
      }}>
      {<CustomHeader />}
    </Animated.View>
  );
};

//You can use your component for header.
// CustomAppBar(
//   '',
//   ['play-circle-outline', 'share-variant-outline', 'dots-vertical'],
//   [],
//   navigation,
// )
