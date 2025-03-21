import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import StarIcon from './StarIcon';
import {getStars} from './utils';
// import {IS_RTL} from 'src/constants/deviceInfo';

type AnimationConfig = {
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
  scale?: number;
};

type StarRatingProps = {
  rating: number;
  onChange: (rating: number) => void;
  minRating?: number;
  color?: string;
  emptyColor?: string;
  maxStars?: number;
  starSize?: number;
  enableHalfStar?: boolean;
  enableSwiping?: boolean;
  style?: StyleProp<ViewStyle>;
  starStyle?: StyleProp<ViewStyle>;
  animationConfig?: AnimationConfig;
  testID?: string;
  readonly?: boolean;
};

const defaultColor = '#fdd835';
const defaultAnimationConfig: Required<AnimationConfig> = {
  easing: Easing.elastic(2),
  duration: 300,
  scale: 1.2,
  delay: 300,
};

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  starSize = 18,
  onChange,
  color = defaultColor,
  emptyColor = color,
  enableHalfStar = true,
  enableSwiping = true,
  animationConfig = defaultAnimationConfig,
  style,
  starStyle,
  testID,
  readonly = false,
  minRating,
}) => {
  const width = useRef<number>();
  const ref = useRef<View>(null);
  const [isInteracting, setInteracting] = useState(false);

  const handleInteraction = useCallback(
    (x: number) => {
      if (width.current) {
        const newRating = Math.max(
          0,
          Math.min(
            Math.round((x / width.current) * maxStars * 2 + 0.2) / 2,
            maxStars,
          ),
        );
        if (minRating && minRating >= Math.ceil(newRating)) {
          return onChange(minRating);
        }

        !readonly &&
          onChange(enableHalfStar ? newRating : Math.ceil(newRating));
      }
    },
    [enableHalfStar, readonly, minRating],
  );
  const [panResponder, setPanResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: e => {
        if (enableSwiping) {
          handleInteraction(e.nativeEvent.locationX);
        }
      },
      onPanResponderStart: e => {
        handleInteraction(e.nativeEvent.locationX);
        setInteracting(true);
      },
      onPanResponderEnd: () => {
        setTimeout(() => {
          setInteracting(false);
        }, animationConfig.delay || defaultAnimationConfig.delay);
      },
    }),
  );

  useEffect(() => {
    setPanResponder(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderMove: e => {
          if (enableSwiping && !readonly) {
            handleInteraction(e.nativeEvent.locationX);
          }
        },
        onPanResponderStart: e => {
          handleInteraction(e.nativeEvent.locationX);
          setInteracting(true);
        },
        onPanResponderEnd: () => {
          setTimeout(() => {
            setInteracting(false);
          }, animationConfig.delay || defaultAnimationConfig.delay);
        },
      }),
    );
  }, [enableSwiping, readonly, enableHalfStar, minRating]);
  let a = {};
  return !readonly ? (
    <View
      ref={ref}
      style={[styles.starRating, style]}
      {...panResponder.panHandlers}
      onLayout={() => {
        if (ref.current) {
          ref.current.measure((_x, _y, w, _h) => (width.current = w));
        }
      }}
      testID={testID}>
      {getStars(rating, maxStars).map((starType, i) => {
        return (
          <AnimatedIcon
            key={i}
            active={isInteracting && rating - i >= 0.5}
            animationConfig={animationConfig}
            style={starStyle}
            readonly={readonly}>
            <StarIcon
              type={starType}
              size={starSize}
              color={starType === 'empty' ? emptyColor : color}
            />
          </AnimatedIcon>
        );
      })}
    </View>
  ) : (
    <View
      ref={ref}
      style={[styles.starRating, style]}
      onLayout={() => {
        if (ref.current) {
          ref.current.measure((_x, _y, w, _h) => (width.current = w));
        }
      }}
      testID={testID}>
      {getStars(rating, maxStars).map((starType, i) => {
        return (
          <AnimatedIcon
            key={i}
            active={isInteracting && rating - i >= 0.5}
            animationConfig={animationConfig}
            style={starStyle}
            readonly={readonly}>
            <StarIcon
              type={starType}
              size={starSize}
              color={starType === 'empty' ? emptyColor : color}
            />
          </AnimatedIcon>
        );
      })}
    </View>
  );
};

type AnimatedIconProps = {
  active: boolean;
  children: React.ReactElement;
  animationConfig: AnimationConfig;
  style?: StyleProp<ViewStyle>;
  readonly?: boolean;
};

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  active,
  animationConfig,
  children,
  style,
  readonly,
}) => {
  const {
    scale = defaultAnimationConfig.scale,
    easing = defaultAnimationConfig.easing,
    duration = defaultAnimationConfig.duration,
  } = animationConfig;

  const animatedSize = useRef(new Animated.Value(active ? scale : 1));

  useEffect(() => {
    const animation = Animated.timing(animatedSize.current, {
      toValue: active ? scale : 1,
      useNativeDriver: true,
      easing,
      duration,
    });

    animation.start();
    return animation.stop;
  }, [active, scale, easing, duration]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.star,
        style,
        !readonly && {
          transform: [
            {
              scale: animatedSize.current,
            },
          ],
        },
      ]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  starRating: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  star: {
    marginHorizontal: 0,
  },
});

export default StarRating;
