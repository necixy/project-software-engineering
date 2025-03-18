// User create our own menu list and use useMenuList hook
import React, {useLayoutEffect} from 'react';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IS_IOS} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomModal from 'src/shared/components/customModal/CustomModal';
import CustomText from 'src/shared/components/customText/CustomText';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import Empty from 'src/shared/components/placeholder/Empty';
import RefreshControlComponent from 'src/shared/components/refreshControlComponent/RefreshControlComponent';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import CustomAccordion from '../component/CustomAccordian';
import renderMenu from './BookingMenu.style';
import renderMenuSwipe from './component/MenuSwipeList.style';
import useMenuList from './component/useMenuList';
import {getCurrencySymbol} from 'src/utils/getCurrencySymbol';

const BookingMenu = () => {
  const {
    userType,
    t,
    setAddNewSec,
    setMenuData,
    menuData,
    addNewSec,
    navigation,
    fetching,
    focusedId,
    setFocusedId,
    removeSection,
    loading,
    getMenuData,
    formik: {
      values: {title, serviceDetails, servicePrice, serviceName},
      errors,
      handleBlur,
      validateField,
      touched,
      resetForm,
      setValues,
      handleChange,
      handleSubmit,
      setFieldValue,
    },
    addSectionSubmit,
    errHandling,
    modalOpen,
    setModalOpen,
    existingDetails,
    rmOnlyTitles,
    default_currency,
  } = useMenuList();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          title={t('common:manageMenu')}
          leftIconColor="black"
          back
          leftIconStyle={{flex: 1.5}}
          lineHeight={25}
          fontFamily={!IS_IOS ? fonts?.arialBold : fonts.openSansBold}
          // fontFamily={fonts?.openSansBold}
          fontSize={18}
          titleColor={'black'}
          titleStyle={{alignSelf: 'stretch', width: '100%'}}
          rightIconStyle={{
            flex: 1.7,
            marginEnd: 10,
          }}
          rightIcon={
            <CustomButton
              style={{
                height: 30,
                alignSelf: 'flex-end',
                marginEnd: 2,
              }}
              onPress={handleSubmit}
              type="unstyled"
              fontSize={12}
              textProps={{
                style: {
                  fontFamily: !IS_IOS
                    ? fonts?.openSansBold
                    : fonts.openSansBold,
                  color: colors?.primary,
                },
              }}>
              {t('common:done')}
            </CustomButton>
          }
        />
      ),
    });
  }, [menuData]);

  const renderHiddenData = (data: any) => (
    <CustomButton
      hitSlop={80}
      // type="unstyled"
      type="white"
      onPress={() => {
        showModal({
          message: t('customWords:DoYouWantToDelete'),
          type: 'info',
          successFn() {
            removeSection({id: data?.item?.id});
          },
          showCancelButton: true,
        });
      }}
      style={[renderMenuSwipe.hiddenContainer, {borderWidth: 0, zIndex: 999}]}>
      <FontAwesome5Icon name="minus-circle" size={20} color={'red'} />
    </CustomButton>
  );

  const renderServiceData = ({
    item,
  }: ListRenderItemInfo<menuServiceDetails>) => {
    return (
      <View style={renderMenuSwipe.container}>
        <CustomAccordion
          heading={item?.serviceName}
          amount={getCurrencySymbol(default_currency) + item?.servicePrice}
          children={
            item?.serviceDetails ? (
              <View style={{gap: 3}}>
                <CustomText fontSize={12} style={renderMenuSwipe.includes}>
                  {item?.serviceDetails}
                </CustomText>
              </View>
            ) : null
          }
        />
      </View>
    );
  };

  return (
    <Container
      isScrollable={false}
      isLoading={fetching || loading}
      alwaysBounceVertical={false}>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={renderMenu.container}
        scrollEnabled
        bounces={false}
        alwaysBounceVertical={false}
        contentContainerStyle={{flexGrow: 1}}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControlComponent
            refreshing={fetching}
            onRefresh={() => {
              setAddNewSec(false);
              resetForm();
              rmOnlyTitles();
              getMenuData();
            }}
          />
        }
        stickyHeaderIndices={[0]}
        ListHeaderComponentStyle={{backgroundColor: '#fff'}}
        ListHeaderComponent={
          <>
            <CustomButton
              onPress={() => {
                resetForm();
                setModalOpen(true);
                // setAddNewSec(prev => !prev);
              }}
              type="unstyled"
              style={renderMenu.headerButton}>
              <FontAwesome5Icon
                name="plus"
                color={'#808080'}
                size={13}
                style={{paddingRight: 10}}
              />

              {/* {!focusedId?.title ?
                <CustomInput
                  placeHolderText={t('common:addSection')}
                  textInputProps={{
                    placeholderTextColor: '#808080', fontSize: fontSizePixelRatio(14),
                  }}
                  onSubmitEditing={() => {
                    setAddNewSec(prev => !prev)
                    let newSecValues = serviceDetails ? { title: title, serviceName: serviceName, servicePrice: servicePrice, serviceDetails: serviceDetails } : { title: title, serviceName: serviceName, servicePrice: servicePrice }
                    let newMenu = menuData?.length > 0 ? [...menuData, newSecValues] : [newSecValues];
                    setMenuData[newMenu]
                  }}
                  onChangeText={handleChange('title')}
                  value={focusedId?.title?? title}
                  inputBoxStyle={{
                    fontSize: fontSizePixelRatio(18),
                  }}
                  error={touched.title && errors?.title}
                  inputContainer={{
                    // height: 50,
                    width: SCREEN_WIDTH * 0.7,
                    // backgroundColor: colors.inputBackground,
                    // borderColor: colors.inputBorder,
                    // borderRadius: 10,
                    borderWidth: 0
                  }}
                />
                : */}
              <CustomText fontSize={14} style={renderMenu.heading}>
                {title ?? t('common:addSection')}
              </CustomText>
              {/* }  */}
            </CustomButton>

            {modalOpen && (
              <CustomModal
                onClose={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                isOpen={modalOpen}
                modalContainer={{
                  // height: SCREEN_WIDTH * 0.4,
                  width: '100%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  padding: 20,
                }}>
                <>
                  <CustomText
                    style={{alignSelf: 'flex-start'}}
                    fontFamily="openSansBold"
                    color="grey">
                    {t('common:addSection')}
                  </CustomText>
                  <CustomInput
                    value={title}
                    error={errHandling('title')}
                    errorStyle={{marginTop: 20}}
                    onChangeText={handleChange('title')}
                    textInputProps={{placeholderTextColor: '#808080'}}
                    containerStyle={{width: '100%', paddingTop: 10}}
                    inputBoxStyle={[
                      renderMenuSwipe.boldDetails,
                      {
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1,
                        justifyContent: 'center',
                      },
                    ]}
                    inputContainer={[
                      renderMenuSwipe.input,
                      {
                        backgroundColor: 'transparent',
                        marginBottom: 10,
                      },
                    ]}
                  />
                  <CustomButton
                    disabled={loading || !title || !!errHandling('title')}
                    isLoading={loading}
                    onPress={() => {
                      addSectionSubmit();
                      // if (title !== null) {
                      //   // let data = existingDetails();
                      //   let titleExists = menuData?.filter(
                      //     item =>
                      //       item?.title?.trim()?.toLocaleLowerCase() ===
                      //       title?.trim()?.toLocaleLowerCase(),
                      //   );

                      //   if (titleExists?.length! > 0 ?? 0) {
                      //     showModal({
                      //       message: `${title?.trim()} already exists`,
                      //     });
                      //     setFocusedId({});
                      //     setModalOpen(false);
                      //     // resetForm();
                      //     return titleExists;
                      //   }
                      //   if (
                      //     (titleExists !== undefined &&
                      //       (titleExists?.length > 0 ?? 0)) ||
                      //     (title?.trim()?.toLowerCase() ===
                      //       focusedId?.title?.trim()?.toLowerCase() &&
                      //       !!focusedId?.id)
                      //   ) {
                      //     // resetForm();
                      //     setFocusedId({});
                      //     setModalOpen(false);
                      //     showModal({
                      //       message: `${title?.trim()} already exists`,
                      //     });
                      //   } else {
                      //     if (!errors?.title) {
                      //       setAddNewSec(true);
                      //       setFocusedId({});
                      //       setModalOpen(false);
                      //     } else {
                      //       errHandling('title');
                      //     }
                      //   }
                      // } else {
                      //   setModalOpen(false);
                      // }
                    }}
                    fontSize={18}
                    style={{
                      marginTop: 20,
                      alignSelf: 'center',
                      width: '100%',
                    }}>
                    {t('common:save')}
                  </CustomButton>
                </>
              </CustomModal>
            )}

            {addNewSec && (
              <>
                <View
                  style={[
                    renderMenuSwipe.emptyContainer,
                    {
                      marginHorizontal: 20,
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      overflow: 'hidden',
                    }}>
                    <CustomInput
                      autoFocus={
                        !focusedId?.id && errHandling('serviceName')
                          ? true
                          : false
                      }
                      value={!focusedId?.id && serviceName}
                      onChangeText={handleChange('serviceName')}
                      onSubmitEditing={addSectionSubmit}
                      textInputProps={{
                        maxLength: 40,
                        placeholderTextColor: '#808080',
                      }}
                      containerStyle={{width: '80%'}}
                      inputBoxStyle={renderMenuSwipe.boldDetails}
                      inputContainer={[
                        renderMenuSwipe.input,
                        {
                          borderWidth:
                            !focusedId?.id && errHandling('serviceName')
                              ? 1
                              : 0,
                          borderColor:
                            !focusedId?.id && errHandling('serviceName')
                              ? 'red'
                              : 'transparent',
                        },
                      ]}
                      placeHolderText={t('common:addService')}
                    />
                    <CustomInput
                      autoFocus={
                        !focusedId?.id && errHandling('servicePrice')
                          ? true
                          : false
                      }
                      value={!focusedId?.id && servicePrice}
                      onChangeText={handleChange('servicePrice')}
                      keyboardType="numeric"
                      maxLength={5}
                      textInputProps={{
                        maxLength: 4,
                        placeholderTextColor: '#808080',
                      }}
                      inputContainer={[
                        renderMenuSwipe.input,
                        {
                          borderWidth:
                            !focusedId?.id && errHandling('servicePrice')
                              ? 1
                              : 0,
                          borderColor:
                            !focusedId?.id && errHandling('servicePrice')
                              ? 'red'
                              : 'transparent',
                        },
                      ]}
                      containerStyle={{width: '20%'}}
                      inputBoxStyle={[
                        renderMenuSwipe.boldDetails,
                        {flex: 1, textAlign: 'right'},
                      ]}
                      placeHolderText={t('common:price')}
                    />
                  </View>

                  <CustomInput
                    autoFocus={
                      !focusedId?.id && errHandling('serviceDetails')
                        ? true
                        : false
                    }
                    value={!focusedId?.id && serviceDetails}
                    onChangeText={handleChange('serviceDetails')}
                    textInputProps={{
                      placeholderTextColor: '#808080',
                    }}
                    multiline={true}
                    inputBoxStyle={[renderMenuSwipe.description]}
                    inputContainer={[
                      renderMenuSwipe.input,
                      {
                        height: 100,
                      },
                    ]}
                    placeHolderText={t('common:addDetails')}
                  />
                </View>
                {(errHandling('serviceName') ||
                  errHandling('servicePrice') ||
                  errHandling('serviceDetails')) &&
                !focusedId?.id ? (
                  <CustomText
                    numberOfLines={2}
                    fontFamily="openSansRegular"
                    fontSize={12}
                    style={[
                      {
                        alignSelf: 'flex-start',
                        paddingBottom: 12,
                        marginTop: 5,
                        marginStart: 25,
                        color: colors.red,
                        lineHeight: 15,
                      },
                    ]}>
                    {errHandling('serviceName') ||
                      errHandling('servicePrice') ||
                      errHandling('serviceDetails')}
                  </CustomText>
                ) : null}
              </>
            )}
          </>
        }
        ListEmptyComponent={
          // !loading && (menuData == null || menuData?.length == 0) ? (
          <Empty
            text={t('customWords:notItemsYet')}
            iconElement={
              <Ionicons name="book" size={40} style={{color: '#808080'}} />
            }
          />
          // ) : null
        }
        data={menuData}
        keyExtractor={(item, index) =>
          item?.id?.toString() ?? index?.toString()
        }
        renderItem={({item}) => {
          return (
            <View>
              {item?.title === '' ? (
                <>
                  <CustomInput
                    value={title}
                    error={errHandling('title')}
                    errorStyle={{marginStart: 20}}
                    onChangeText={handleChange('title')}
                    textInputProps={{placeholderTextColor: '#808080'}}
                    containerStyle={{width: '80%'}}
                    inputBoxStyle={renderMenuSwipe.boldDetails}
                    inputContainer={[
                      renderMenuSwipe.input,
                      {
                        backgroundColor: 'transparent',
                        marginLeft: 10,
                        marginBottom: 10,
                      },
                    ]}
                    placeHolderText={t('customWords:addTitle')}
                  />
                </>
              ) : (
                <>
                  <CustomText fontSize={12} style={renderMenuSwipe.services}>
                    {item?.title ?? 'section name'}
                  </CustomText>
                </>
              )}

              <SwipeListView
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) =>
                  item?.id + index + '' ?? index + ''
                }
                bounces={false}
                alwaysBounceHorizontal={false}
                swipeToOpenPercent={20}
                data={
                  item?.subSection
                    ? Object.values(item?.subSection)?.sort(
                        (a: menuServiceDetails, b: menuServiceDetails) => {
                          return a.servicePrice - b.servicePrice;
                        },
                      )
                    : []
                }
                rightOpenValue={-45}
                previewDuration={1000}
                disableRightSwipe
                renderHiddenItem={renderHiddenData}
                renderItem={data => renderServiceData(data)}
                ListFooterComponentStyle={[globalStyles?.ph2]}
                ListFooterComponent={
                  <>
                    <View style={renderMenuSwipe.emptyContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          overflow: 'hidden',
                        }}>
                        <CustomInput
                          autoFocus={errHandling('serviceName') ? true : false}
                          value={item?.id === focusedId?.id ? serviceName : ''}
                          onChangeText={handleChange('serviceName')}
                          textInputProps={{
                            maxLength: 40,
                            placeholderTextColor: '#808080',
                            onFocus: () => {
                              if (addNewSec) {
                                setAddNewSec(false);
                              }
                              if (
                                item?.id !== focusedId?.id ||
                                title !== focusedId?.title
                              ) {
                                setFocusedId({
                                  id: item?.id,
                                  title: item?.title,
                                });
                                setFieldValue('title', item?.title);
                                setFieldValue('id', item?.id);
                              }
                            },
                          }}
                          containerStyle={{width: '70%'}}
                          inputBoxStyle={renderMenuSwipe.boldDetails}
                          inputContainer={[
                            renderMenuSwipe.input,
                            {
                              borderWidth:
                                item?.id === focusedId?.id &&
                                errHandling('serviceName')
                                  ? 1
                                  : 0,
                              borderColor:
                                item?.id === focusedId?.id &&
                                errHandling('serviceName')
                                  ? 'red'
                                  : 'transparent',
                            },
                          ]}
                          placeHolderText={t('common:addService')}
                        />
                        <CustomInput
                          autoFocus={errHandling('servicePrice') ? true : false}
                          value={item?.id === focusedId?.id ? servicePrice : ''}
                          onChangeText={handleChange('servicePrice')}
                          keyboardType="numeric"
                          maxLength={5}
                          textInputProps={{
                            maxLength: 4,
                            placeholderTextColor: '#808080',
                            onFocus: () => {
                              if (addNewSec) {
                                setAddNewSec(false);
                              }

                              if (
                                item?.id !== focusedId?.id ||
                                title !== focusedId?.title
                              ) {
                                setFocusedId({
                                  id: item?.id,
                                  title: item?.title,
                                });

                                setFieldValue('title', item?.title);
                                setFieldValue('id', item?.id);
                              }
                            },
                          }}
                          inputContainer={[
                            renderMenuSwipe.input,
                            {
                              borderWidth:
                                item?.id === focusedId?.id &&
                                errHandling('servicePrice')
                                  ? 1
                                  : 0,
                              borderColor:
                                item?.id === focusedId?.id &&
                                errHandling('servicePrice')
                                  ? 'red'
                                  : 'transparent',
                            },
                          ]}
                          containerStyle={{width: '30%'}}
                          inputBoxStyle={[
                            renderMenuSwipe.boldDetails,
                            {
                              flex: 1,
                              textAlign: 'right',
                              paddingEnd: 0,
                            },
                          ]}
                          placeHolderText={t('common:price')}
                        />
                      </View>

                      <CustomInput
                        autoFocus={errHandling('serviceDetails') ? true : false}
                        value={item?.id === focusedId?.id ? serviceDetails : ''}
                        onChangeText={handleChange('serviceDetails')}
                        textInputProps={{
                          placeholderTextColor: '#808080',
                          onFocus: () => {
                            if (addNewSec) {
                              setAddNewSec(false);
                            }

                            if (
                              item?.id !== focusedId?.id ||
                              title !== focusedId?.title
                            ) {
                              setFocusedId({id: item?.id, title: item?.title});

                              setFieldValue('title', item?.title);
                              setFieldValue('id', item?.id);
                            }
                          },
                        }}
                        multiline={true}
                        inputBoxStyle={[renderMenuSwipe.description]}
                        inputContainer={[
                          renderMenuSwipe.input,
                          {
                            height: 100,
                            borderWidth:
                              item?.id === focusedId?.id &&
                              errHandling('serviceDetails')
                                ? 1
                                : 0,
                            borderColor:
                              item?.id === focusedId?.id &&
                              errHandling('serviceDetails')
                                ? 'red'
                                : 'transparent',
                          },
                        ]}
                        placeHolderText={t('common:addDetails')}
                      />
                    </View>
                    {(errHandling('serviceName') ||
                      errHandling('servicePrice') ||
                      errHandling('serviceDetails')) &&
                    item?.id === focusedId?.id ? (
                      <CustomText
                        numberOfLines={2}
                        fontFamily="openSansRegular"
                        fontSize={12}
                        style={[
                          {
                            alignSelf: 'flex-start',
                            paddingBottom: 12,
                            marginTop: 5,
                            marginStart: 5,
                            color: colors.red,
                            lineHeight: 15,
                          },
                        ]}>
                        {errHandling('serviceName') ||
                          errHandling('servicePrice') ||
                          errHandling('serviceDetails')}
                      </CustomText>
                    ) : null}
                  </>
                }
              />
            </View>
          );
        }}
      />
    </Container>
  );
};

export default BookingMenu;
