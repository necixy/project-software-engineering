import {firebase} from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {priceWith2Decimal} from 'src/@types/regex/regex';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import * as yup from 'yup';

const useMenuList = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const userType = useAppSelector(
    state => state?.userReducer?.userDetails?.userType,
  );
  const {uid, default_currency} = useAppSelector(
    state => state?.userReducer?.userDetails,
  );
  const [focusedId, setFocusedId] = useState<{
    id?: string | undefined;
    title?: string | undefined;
  }>({});
  const [fetching, setFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [menuData, setMenuData] = useState<menuListType[] | null>(null);
  const [addNewSec, setAddNewSec] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // for removing complete titleId with only one secId
  // const [removeCompleteTitleSec, setRemoveCompleteTitleSec] = useState<{titleId: string, secId: string}>({titleId: '', secId: ''})

  // temp menu sections created for multiple adding sections
  const [tempMenu, setTempMenu] = useState<tempMenu[]>([]);

  // Get Price Range frm database
  const updatePriceRange = async (price?: string) => {
    try {
      // let finalPricesRange: [string, string] | any;
      await databaseRef(`users/${uid}/price`).once('value', snapshot => {
        let pricesRange = snapshot.val();
        if (pricesRange !== null && !!pricesRange && !!price) {
          if (pricesRange?.includes('_')) {
            pricesRange = pricesRange.split('_')[0];
          }
          if (price! < pricesRange) {
            // finalPricesRange = price;
            databaseRef(`users/${uid}/price`).set(price);
          }
          // if (pricesRange[1] && price > pricesRange[1]) {
          //   finalPricesRange[1] = price;
          // }

          // if (
          //   finalPricesRange[0] !== pricesRange[0] &&
          //   finalPricesRange[1] !== pricesRange[1]
          // ) {
          //   let ranges = finalPricesRange.join('_');
          //   databaseRef(`users/${uid}`).update({price: ranges});
          // } else if (finalPricesRange[0] !== pricesRange[0]) {
          //   let ranges = `${finalPricesRange[0]}_${pricesRange[1]}`;
          //   databaseRef(`users/${uid}`).update({price: ranges});
          // } else if (finalPricesRange[1] !== pricesRange[1]) {
          //   let ranges = `${pricesRange[0]}_${finalPricesRange[1]}`;
          //   databaseRef(`users/${uid}`).update({price: ranges});
          // } else if (pricesRange) {
          //   databaseRef(`users/${uid}`).update({price});
          // }
        } else if (pricesRange == null && !!price) {
          databaseRef(`users/${uid}/price`).set(price);
        } else {
          let minPrice: string | number = 0;
          if (menuData?.length! > 0) {
            menuData?.map((section: menuListType) => {
              if (!!section?.subSection) {
                let secList = Object.values(section?.subSection);
                if (secList?.length > 0) {
                  secList?.map((item: menuServiceDetails) => {
                    if (minPrice == 0) {
                      minPrice = item?.servicePrice;
                    } else {
                      if (minPrice > item?.servicePrice) {
                        minPrice = item?.servicePrice;
                      }
                    }
                  });
                }
              }
            });

            databaseRef(`users/${uid}/price`).set(minPrice);
          } else {
            databaseRef(`users/${uid}/price`).set(null);
          }
          // if (menuData?.length > 0) {
          // }
        }
      });
    } catch (error) {
      console.error('updatePriceRange', error);
    }
  };

  // Get Menu Data from DatabaseRef
  const getMenuData = async () => {
    !loading && setFetching(true);
    try {
      await databaseRef(`menu/${uid}`).once('value', snapshot => {
        let getUserMenu = snapshot.val();
        if (!!snapshot.val()) {
          // let fetchedData: any = !!getUserMenu
          //   ? Object.values(getUserMenu)
          //   : null;

          // Convert data object to array and sort by createdAt
          const sortedData = Object.keys(getUserMenu)
            .map(key => ({
              key,
              ...getUserMenu[key],
            }))
            .sort((a, b) => {
              return b.createdAt - a.createdAt;
            }); // Sort by createdAt descending

          // // Compare new sorted data with currentUserData to find changes
          // const changedData = {};
          // sortedData.forEach(item => {
          //   if (currentUserData[item.key] !== item) {
          //     changedData[item.key] = item;
          //   }
          // });
          setMenuData(sortedData.reverse());
        } else if (snapshot?.val() == null) {
          setMenuData([]);
        }
      });
    } catch (err) {
      console.error({err});
    } finally {
      // rmOnlyTitles();
      setLoading(false);
      !loading && setFetching(false);
    }
  };

  //remove the title with no child
  const rmOnlyTitles = async () => {
    try {
      let menuArr: menuListType[] | undefined;
      if (menuData?.length! > 0) {
        let onlyTitleSec = menuData?.filter(
          val => !val?.subSection || val?.title === undefined,
        );
        if (onlyTitleSec?.length! > 0) {
          onlyTitleSec?.map(async (item: any) => {
            await databaseRef(`menu/${uid}/${item?.id}`).remove();
            menuArr = menuData?.filter(val => val?.id !== item?.id);
            setMenuData(menuArr!);
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      getMenuData();
    }
  };

  // remove section from DatabaseRef
  const removeSection = async ({id}: any) => {
    setLoading(true);
    const secId: string = id;
    let titleId: string | undefined;

    try {
      const removingTitleSec = menuData?.filter((item: any) => {
        if (item?.subSection) {
          let subSectionKeys: string[] = Object.keys(item?.subSection!);

          if (subSectionKeys?.includes(secId)) {
            return item;
          }
        }
      });
      titleId = removingTitleSec?.[0]?.id;
      if (titleId) {
        // await databaseRef(`menu/${uid}`)?.once('value', async snapshot => {
        //   if (snapshot?.val()) {
        await databaseRef(`menu/${uid}/${titleId}/subSection`).once(
          'value',
          async snap => {
            if (snap?.val()) {
              let sectionList: any = Object.values(snap?.val());
              // let res: menuServiceDetails[]| void;
              if (sectionList?.length > 1) {
                await databaseRef(
                  `menu/${uid}/${titleId}/subSection/${secId}`,
                ).remove();
                // if (res == null) {
                //    menuData?.filter((value: any) => {
                //     let remainingSec = Object.values(value?.subSection)?.filter(item => {
                //  return( item?.id !== id)});
                //   });
                // }
              } else if (sectionList?.length == 1) {
                if (sectionList?.[0]?.id === id) {
                  await databaseRef(`menu/${uid}/${titleId}`).remove();
                }
              }
            }
          },
        );
        // }
        //   }
        // });
      }
    } catch (error) {
      console.error(`removeSection: ${error}`);
    } finally {
      rmOnlyTitles();
      formik?.resetForm();
      // getMenuData();
      // setLoading(false);
      updatePriceRange();
    }
  };

  useEffect(() => {
    formik?.resetForm();
    getMenuData();
  }, []);

  // validation for formik values
  const validationMenu = yup.object().shape({
    title: yup
      ?.string()
      ?.trim()
      ?.max(20, t('customWords:max20Chars'))
      ?.required(t('customWords:titleRequired')),
    // ?.required(t('customWords:titleRequired')),
    // ?.when('serviceName', ([serviceName], schema) => {
    //   if (serviceName && serviceName?.length > 0)
    //     return yup
    //       ?.string()
    //       ?.max(20, t('customWords:max20Chars'))
    //       ?.notRequired();
    //   return yup
    //     ?.string()
    //     ?.max(20, t('customWords:max20Chars'))
    //     ?.required(t('customWords:titleRequired'));
    // }),

    serviceName: yup
      ?.string()
      ?.trim()
      ?.max(40, t('customWords:max40Chars'))
      ?.notRequired()
      ?.when('title', ([title], schema) => {
        if (title && title?.length > 0)
          return yup
            ?.string()
            ?.max(40, t('customWords:max40Chars'))
            ?.required(t('customWords:serviceNameRequired'));
        return yup
          ?.string()
          ?.max(40, t('customWords:max40Chars'))
          ?.notRequired();
      }),

    servicePrice: yup
      ?.string()
      ?.when('serviceName', ([serviceName], schema) => {
        if (serviceName && serviceName?.length < 40)
          return yup
            ?.string()
            .required(t('customWords:servicePriceRequired'))
            ?.max(10000, t('customWords:max1000Amount'))
            ?.matches(priceWith2Decimal);
        return yup
          ?.string()
          ?.max(10000, t('customWords:max1000Amount'))
          ?.matches(priceWith2Decimal)
          ?.notRequired();
      }),

    serviceDetails: yup
      ?.string()
      ?.trim()
      ?.max(150, t('customWords:max150Chars'))
      ?.notRequired(),

    id: yup?.string()?.trim()?.notRequired(),
  });

  // finds if the title already exists
  const existingDetails = (title?: any) => {
    if (
      title?.trim() &&
      formik?.values?.title?.trim() &&
      formik?.values?.id == null
    ) {
      let titleExists = menuData?.filter(
        item =>
          item?.title?.trim()?.toLocaleLowerCase() ===
          formik?.values?.title?.trim()?.toLocaleLowerCase(),
      );

      if (titleExists?.length > 0 ?? 0) {
        showModal({message: `${formik?.values?.title?.trim()} already exists`});
        return titleExists;
      }
    }
  };

  const formik = useFormik<menuFormType>({
    initialValues: {
      id: null,
      title: focusedId?.title ?? null,
      serviceName: null,
      servicePrice: null,
      serviceDetails: null,
    },
    validationSchema: validationMenu,
    onSubmit: async values => {
      setAddNewSec(false);
      let menuDataRef;
      existingDetails();
      try {
        setLoading(true);
        if (focusedId?.id && focusedId?.title) {
          // finds the same service names under the same title and id
          let oldData = menuData?.filter(val => val?.id === focusedId?.id);

          let oldSec = oldData?.[0]?.subSection
            ? Object.values(oldData?.[0]?.subSection)
            : null;

          let existData = oldSec?.filter(
            val =>
              val?.serviceName?.trim()?.toLowerCase() ===
              values?.serviceName?.trim()?.toLowerCase(),
          );
          if (existData?.length! > 0 ?? 0) {
            showModal({
              message: `${values?.serviceName?.trim()} already exists! Do you want to update it? `,
              showCancelButton: true,
              successFn() {
                let existedSectionRef = databaseRef(
                  `menu/${uid}/${focusedId?.id}/subSection/${existData?.[0]?.id}`,
                );
                let newSubSection =
                  values?.serviceDetails !== null
                    ? {
                        serviceName: values?.serviceName,
                        servicePrice: values?.servicePrice,
                        serviceDetails: values?.serviceDetails,
                        id: existData?.[0]?.id,
                      }
                    : {
                        serviceName: values?.serviceName,
                        servicePrice: values?.servicePrice,
                        id: existData?.[0]?.id,
                      };
                existedSectionRef?.update(newSubSection);
                updatePriceRange(values?.servicePrice!);

                getMenuData();
                return;
              },
            });
          } else {
            let subSectionRef = databaseRef(
              `menu/${uid}/${focusedId?.id}/subSection`,
            );

            let newSectionRef = subSectionRef?.push();
            let newSubSection =
              values?.serviceDetails !== null
                ? {
                    serviceName: values?.serviceName,
                    servicePrice: values?.servicePrice,
                    serviceDetails: values?.serviceDetails,
                    id: newSectionRef?.key!,
                  }
                : {
                    serviceName: values?.serviceName,
                    servicePrice: values?.servicePrice,
                    id: newSectionRef?.key!,
                  };
            newSectionRef?.set(newSubSection);
            updatePriceRange(values?.servicePrice!);
          }
        } else {
          const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
          const menuRef = databaseRef(`menu/${uid}`);
          const newMenuDataRef = menuRef.push();
          menuDataRef = newMenuDataRef?.key!;

          let menuListData = {
            id: newMenuDataRef?.key!,
            title: formik?.values?.title ?? focusedId?.title,
            createdAt: firebaseTimestamp,
          };
          newMenuDataRef.set(menuListData);
        }
      } catch (error: any) {
        console.error('error', error);
        handleMenuError(error.code);
      } finally {
        if (!focusedId?.title && !focusedId?.id) {
          let subSectionRef = databaseRef(
            `menu/${uid}/${menuDataRef}/subSection`,
          );

          let newSectionRef = subSectionRef?.push();
          let newSubSection =
            values?.serviceDetails !== null
              ? {
                  serviceName: values?.serviceName,
                  servicePrice: values?.servicePrice,
                  serviceDetails: values?.serviceDetails,
                  id: newSectionRef?.key!,
                }
              : {
                  serviceName: values?.serviceName,
                  servicePrice: values?.servicePrice,
                  id: newSectionRef?.key!,
                };
          newSectionRef?.set(newSubSection);
          updatePriceRange(values?.servicePrice!);
        }

        rmOnlyTitles();
        setModalOpen(false);
        setAddNewSec(false);
        getMenuData();
        setLoading(false);
        setFocusedId({});
        formik.resetForm();
        showModal({
          message: t('customWords:updatedSuccessfully'),
          type: 'success',
        });
      }
    },
  });

  // add section process
  const addSectionSubmit = () => {
    if (formik?.values?.title !== null) {
      // let data = existingDetails();
      let titleExists = menuData?.filter(
        item =>
          item?.title?.trim()?.toLocaleLowerCase() ===
          formik?.values?.title?.trim()?.toLocaleLowerCase(),
      );

      if (titleExists?.length! > 0 ?? 0) {
        showModal({
          message: `${formik?.values?.title?.trim()} already exists`,
        });
        setFocusedId({});
        setModalOpen(false);
        // resetForm();
        return titleExists;
      }
      if (
        (titleExists !== undefined && (titleExists?.length > 0 ?? 0)) ||
        (formik?.values?.title?.trim()?.toLowerCase() ===
          focusedId?.title?.trim()?.toLowerCase() &&
          !!focusedId?.id)
      ) {
        // resetForm();
        setFocusedId({});
        setModalOpen(false);
        showModal({
          message: `${formik?.values?.title?.trim()} already exists`,
        });
      } else {
        if (!formik?.errors?.title) {
          setAddNewSec(true);
          setFocusedId({});
          setModalOpen(false);
        } else {
          errHandling('title');
        }
      }
    } else {
      setModalOpen(false);
    }
  };

  // Function to handle errors
  const handleMenuError = (errorCode: any) => {
    console.error(errorCode);
  };

  const errHandling = (value: string) => {
    let error: string | false | undefined;
    switch (value) {
      case 'title':
        error = formik?.errors?.title;
        break;

      case 'id':
        error = formik?.touched?.id && formik?.errors?.id;
        break;

      case 'serviceName':
        error = formik?.touched?.serviceName && formik?.errors?.serviceName;
        break;

      case 'servicePrice':
        error = formik?.touched?.servicePrice && formik?.errors?.servicePrice;
        if (
          formik?.errors?.servicePrice ===
          'servicePrice must match the following: "/^(?!(0|0\\.0{1,2}|200000|200000\\.00))(0*[1-9]\\d{0,4}|0*\\d{1,5}\\.\\d{1,2})$/"'
        ) {
          return t('customWords:enterValidAmount');
        }
        break;

      case 'serviceDetails':
        error =
          formik?.touched?.serviceDetails && formik?.errors?.serviceDetails;
        break;

      default:
        error = t('customWords:somethingWentWrong');
        break;
    }

    return error;
  };

  // const saveTitle = () => {
  //   {

  //     formik.handleSubmit();

  //     // let arr = !!(menuData?.length > 0) ? [...menuData, { title: title }] : [{ title: title }]
  //     // setMenuData(arr)
  //     // console.error('errors?.title', errors?.title)
  //     // if (!errors?.title || errors?.title === undefined) {
  //     //   setModalOpen(false);
  //     //   getMenuData()
  //     // }
  //   }
  // }

  return {
    t,
    formik,
    menuData,
    setMenuData,
    addNewSec,
    setAddNewSec,
    navigation,
    fetching,
    focusedId,
    setFocusedId,
    removeSection,
    loading,
    errHandling,
    modalOpen,
    setModalOpen,
    getMenuData,
    userType,
    tempMenu,
    setTempMenu,
    existingDetails,
    rmOnlyTitles,
    addSectionSubmit,
    default_currency,
  };
};

export default useMenuList;
