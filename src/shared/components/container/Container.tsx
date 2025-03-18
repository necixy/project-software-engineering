import React, {ReactNode, useEffect, useRef} from 'react';
import {
  ColorValue,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Error from 'src/shared/components/placeholder/Error';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import {IS_IOS, SCREEN_HEIGHT} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import RefreshControlComponent from '../refreshControlComponent/RefreshControlComponent';
import {colors} from '../../../theme/colors';
import CustomHeader from 'src/shared/navigation/CustomHeader';

type TContainer = {
  disableKeyboardAvoidingView?: boolean;
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  isPaddingBottomEnabled?: boolean;
  stickyHeaderIndices?: number[];
  isScrollable?: boolean;
  isScrollToBottom?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  alwaysBounceVertical?: boolean;
  headerColor?: 'blue' | 'white';
};
function Container({
  disableKeyboardAvoidingView,
  children,
  contentContainerStyle,
  isLoading,
  isError,
  errorText,
  isPaddingBottomEnabled,
  stickyHeaderIndices,
  isScrollable = true,
  isScrollToBottom = false,
  isRefreshing,
  alwaysBounceVertical,
  onRefresh,
  headerColor = 'white',
}: TContainer) {
  const ref = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      if (isScrollToBottom) {
        ref.current?.scrollToEnd();
      }
    }, 0);

    return clearTimeout(0);
  }, [isLoading]);

  let backgroundColor: ColorValue | undefined;

  // Check if contentContainerStyle is defined and has backgroundColor property
  if (contentContainerStyle && 'backgroundColor' in contentContainerStyle) {
    backgroundColor = contentContainerStyle.backgroundColor;
  } else {
    // Handle case where backgroundColor is not present or contentContainerStyle is falsy
    backgroundColor = undefined; // Or provide a default value
  }
  const render = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (isError) {
      return (
        <View style={globalStyles?.screenCenter}>
          <Error text={errorText} />
        </View>
      );
    }
    return children;
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor:
            headerColor === 'blue' ? colors?.primary : colors?.secondary,
        }}
      />

      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        {/* <CustomHeader /> */}
        <KeyboardAvoidingView
          enabled={disableKeyboardAvoidingView ?? true}
          contentContainerStyle={{backgroundColor: 'pink'}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
          style={{
            flex: 1,
            backgroundColor: '#FFF',
          }}
          behavior={IS_IOS ? 'padding' : undefined}>
          {isScrollable ? (
            <ScrollView
              ref={ref}
              alwaysBounceVertical={alwaysBounceVertical}
              refreshControl={
                onRefresh && (
                  <RefreshControlComponent
                    refreshing={!!isRefreshing}
                    onRefresh={onRefresh}
                  />
                )
              }
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                {
                  flexGrow: 1,
                  paddingBottom: isPaddingBottomEnabled
                    ? SCREEN_HEIGHT * 0.15
                    : 0,
                },
                contentContainerStyle,
              ]}
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: backgroundColor ?? colors?.secondary,
                flex: 1,
              }}
              stickyHeaderIndices={stickyHeaderIndices}>
              {render()}
            </ScrollView>
          ) : (
            render()
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

export default Container;
