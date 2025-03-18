// This code renders the drawer that contains the screens and logic for adding new images as posts.
import {View, Text} from 'react-native';
import React, {useRef} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigation from './TabNavigation';
import NewPost from 'src/screens/newPost/NewPost';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import Home from 'src/screens/home/Home';
import {Portal} from 'react-native-portalize';
import {globalStyles} from 'src/constants/globalStyles.style';
import {tabNavParam} from './params/tabNavParam';
import {rootStackName} from './constant/rootStackName';
import {rootStackParams} from './params/rootStackParams';

//Functional component code for the Drawer (The bottom tab navigation is nested inside it).
const Drawer = createDrawerNavigator<rootStackParams>();

const HomeDrawerNavigation = () => {
  const [isHomeActive, setIsHomeActive] = React.useState(false);
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {width: SCREEN_WIDTH},
        headerShown: false,
        drawerType: 'slide',
        swipeEnabled: isHomeActive,
        swipeEdgeWidth: 50,
        swipeMinDistance: 100,
      }}
      drawerContent={() => (
        <View style={[globalStyles.flex]}>
          <NewPost />
        </View>
      )}>
      <Drawer.Screen
        name={rootStackName.BOTTOM_TABS}
        component={BottomTabNavigation}
      />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigation;
