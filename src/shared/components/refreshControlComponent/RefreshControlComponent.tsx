import React from 'react';
import {RefreshControl} from 'react-native';
import {colors} from 'src/theme/colors';
type TRefreshControlComponent = {
  refreshing: boolean;
  onRefresh?: () => void;
};
const RefreshControlComponent = ({
  refreshing,
  onRefresh,
  ...props
}: TRefreshControlComponent) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
      progressBackgroundColor={colors.secondary}
      tintColor={colors.primary}
      titleColor={colors.primary}
      {...props}
    />
  );
};

export default RefreshControlComponent;
