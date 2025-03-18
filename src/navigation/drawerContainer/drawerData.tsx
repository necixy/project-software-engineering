import Icon from 'src/assets/svg';
import {tabStackRouteName} from '../constant/tabStackRouteName';
import {rootStackName} from '../constant/rootStackName';
import * as NavigationService from 'react-navigation-helpers';
import {screenStackName} from '../constant/screenStackName';
import {Image} from 'react-native';

export type TDrawerItem = {
  _id: number;
  screenName?: string;
  label: string;
  icon: JSX.Element; // Assuming Icon is a React component
  subTab?: TDrawerItem[];
  navigation?: any;
};
export const drawerListData: TDrawerItem[] = [
  // Example
  // {
  //   _id: 1,
  //   screenName: tabStackRouteName.HOME,
  //   label: 'Home',
  //   icon: <Icon name="home" fill="#58CC02" />,
  //   navigation: () => NavigationService.navigate(tabStackRouteName.HOME),
  // },
];
