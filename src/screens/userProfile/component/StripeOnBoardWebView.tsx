import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {updateUserType} from 'src/redux/reducer/userReducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {colors} from 'src/theme/colors';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import Container from 'src/shared/components/container/Container';
import {verifyAccountStatus} from 'src/api/stripe/stripeAccountId/stripeAccountId';

export default function StripeOnBoardWebView({route: {params}}: any) {
  const [loading, setLoading] = useState(true);
  const {navigate, goBack} = useStackNavigation();
  const [prevData, setPrevData] = useState<any>({});

  const dispatch = useDispatch();
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);

  const handleNavigationStateChange = async (navState: any) => {
    const {url, loading, title, canGoBack, canGoForward} = navState;
    const returnUrl = url?.split('/');
    const returnType = returnUrl?.[returnUrl?.length - 1];
    if (params?.accountType === 'edit') {
      if (returnType == 'return') {
        goBack();
      }
    } else {
      if (returnType == 'return') {
        let verifyStatus = await verifyAccountStatus(uid);
        if (!verifyStatus?.isFullSetup) {
          navigate(screenStackName.PERSONAL_PRO, {prevData});
        } else {
          navigate(screenStackName.SWITCH_PRO, {type: 'otpVerified'});
          await databaseRef(`users/${uid}/proPersonalInfo`).update({
            proPhoneNumber: params?.proNumber,
          });
          dispatch(updateUserType('pro'));
          await databaseRef(`users/${uid}`).update({
            isPro: true,
          });
        }
      } else if (returnType == 'reauth')
        navigate(screenStackName.PERSONAL_PRO, {prevData});
    }
  };

  return (
    <Container contentContainerStyle={styles.container}>
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <WebView
        source={{uri: params?.url}}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </Container>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: [{translateX: -50}, {translateY: -50}],
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT * 0.85,
    width: SCREEN_WIDTH,
  },
  webview: {
    flex: 1,
  },
});
