import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import CustomFeedPostComponent from 'src/screens/home/customFeedPostComponent/CustomFeedPostComponent';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import useFetchHomePosts from 'src/screens/home/useHome/useFetchHomePosts';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import Container from 'src/shared/components/container/Container';
import useViewPost from './useViewPost';

const ViewPost = ({route, navigation}: any) => {
  const {isLoading, posts} = useViewPost(route);

  return (
    <Container isLoading={isLoading}>
      <CustomHeader
        back
        leftIconColor="black"
        fontFamily={fonts?.openSansBold}
        fontSize={18}
        lineHeight={30}
        title={'Posts'}
        titleColor="black"
        // titleStyle={{
        //   color: colors.defaultBlack,
        // }}
        // headerContainer={{
        //   alignItems: 'center',
        //   paddingBottom: 10,
        // }}
        rightIcon
      />
      <CustomFeedPostComponent
        screen={'viewPost'}
        navigation={navigation}
        // data={posts}
        post={posts?.feedPostObject! ?? route?.params?.feedPostId!}
      />
    </Container>
  );
};

export default ViewPost;
