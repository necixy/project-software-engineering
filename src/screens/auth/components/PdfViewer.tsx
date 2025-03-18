import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import Pdf from 'react-native-pdf';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'src/constants/deviceInfo';
import Container from 'src/shared/components/container/Container';
import {WebView} from 'react-native-webview';
import { styles } from 'src/screens/userProfile/component/StripeOnBoardWebView';


const PdfViewer = ({
  route: {
    params: {sourceUri},
  },
}: any) => {
  const [lang, setLang] = useState<'en' | 'fr'>();
  AsyncStorage.getItem('user-language', (err, language) => {
    language && setLang(language! ?? 'en');
  });
  const source = {
    uri: sourceUri!,
    // uri: `https://vita-abe0f.web.app/${lang!}/${sourceUri!}.pdf`,
    cache: true,
  };

  return (
    <Container contentContainerStyle={{flex: 1, backgroundColor: '#fff'}}>
      <Pdf
                          trustAllCerts={false}
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          // console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          // console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.error(error);
        }}
        onPressLink={uri => {
          // console.log(`Link pressed: ${uri}`);
        }}
        style={{
          flex: 1,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          backgroundColor: '#fff',
        }}
      />
    </Container>
  );

  // return(
  //   <Container contentContainerStyle={{
  //     flex: 1,
  //   }}>
  //   {/* {loading && (
  //     <View style={styles.loadingIndicator}>
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   )} */}
  //   <WebView 
  //     source={{uri: source?.uri}}
  //     style={styles.webview}
  //     // onNavigationStateChange={handleNavigationStateChange}
  //     // onLoadStart={() => setLoading(true)}
  //     // onLoadEnd={() => setLoading(false)}
  //     // onError={() => setLoading(false)}
  //   />
  // </Container>
  // )
};

export default PdfViewer;
