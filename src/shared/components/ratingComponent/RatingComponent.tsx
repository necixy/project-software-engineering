import React, {memo} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import StarRating from './src';
import {colors} from 'src/theme/colors';
type TRatingComponent = {
  size?: number;
  onChange?: (rating: number) => void;
  value?: number;
  enableHalfStar?: boolean;
  readonly?: boolean;
  starStyle?: StyleProp<ViewStyle>;
  color?: string;
  minRating?: number;
};
const RatingComponent = ({
  size = 18,
  onChange,
  color,
  value = 0,
  starStyle,
  enableHalfStar,
  readonly,
  minRating,
}: TRatingComponent) => {
  return (
    <StarRating
      minRating={minRating}
      onChange={(_value: number) => {
        // setRating(_value);
        onChange && onChange(_value);
      }}
      rating={value}
      readonly={readonly}
      starSize={size}
      starStyle={[
        {
          marginHorizontal: 0,
        },
        starStyle,
      ]}
      enableHalfStar={enableHalfStar}
      color={color ?? colors.yellow}
    />
  );
};
function reverseRTLRating(originalRating: number) {
  const maxRating = 5;
  return maxRating - (originalRating - 1);
}

export default memo(RatingComponent);
