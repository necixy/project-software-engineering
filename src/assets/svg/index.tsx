import {ColorValue, StyleProp, ViewStyle} from 'react-native';
import * as React from 'react';
import {svgName} from './svgName';
import Home from './home.svg';
import HomeOutline from './homeOutline.svg';
import UserOutline from './userProfile.svg';
import Love from './love.svg';
import Comment from './comment.svg';
import IsLiked from './isLiked.svg';
import Check from './check.svg';
import Down from './down.svg';
import Right from './right.svg';
import Filter from './filter.svg';
import HelpSupport from './help_support.svg';
import ProAccount from './pro_account.svg';
import Cancel from './cancel.svg';
import Search from './search.svg';
import DashboardIcon from './dashboardIcon.svg';
import Calendar from './calendar.svg';
import franceFlag from './france_flag.svg';
import locker from './locker.svg';
import Eye from './eye.svg';
import EyeClose from './eye_close.svg';

interface IconProps {
  name: keyof typeof svgName;
  color?: ColorValue;
  width?: number;
  height?: number;
  fill?: ColorValue;
  stroke?: ColorValue;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
interface IObjectKeys {
  [key: string]: any;
}

const Icon = (props: IconProps) => {
  const icons: IObjectKeys = {
    [svgName.homeOutline]: HomeOutline,
    [svgName.home]: Home,
    [svgName.love]: Love,
    [svgName.comment]: Comment,
    [svgName.userOutline]: UserOutline,
    [svgName.isLiked]: IsLiked,
    [svgName.check]: Check,
    [svgName.down]: Down,
    [svgName.right]: Right,
    [svgName.filter]: Filter,
    [svgName.help_support]: HelpSupport,
    [svgName.pro_account]: ProAccount,
    [svgName.cancel]: Cancel,
    [svgName.search]: Search,
    [svgName.dashboardIcon]: DashboardIcon,
    [svgName.calendar]: Calendar,
    [svgName.franceFlag]: franceFlag,
    [svgName.locker]: locker,
    [svgName.eye]: Eye,
    [svgName.eye_close]: EyeClose,
  };
  const IconToRender = icons[props?.name] || HomeOutline;
  return <IconToRender {...props} />;
};

export default Icon;
