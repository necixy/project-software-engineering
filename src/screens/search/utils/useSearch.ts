import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/redux/reducer/reducer';
import { setInitial } from 'src/redux/reducer/searchFilterReducer';
import { databaseRef } from 'src/utils/useFirebase/useFirebase';

const useSearch = () => {
  const { category, grade, price, location, availability, sortBy, applyFilter } =
    useAppSelector(state => state.searchFilterReducer);
  const dispatch = useDispatch();
  const { uid } = useAppSelector(state => state.userReducer.userDetails);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [blockedList, setBlockedList] = useState<string[]>();
  const [reportedList, setReportedList] = useState<string[]>();
  const [searchResult, setSearchResult] = useState<TSearchCard[] | undefined>(
    [],
  );
  const [nameSearchResult, setNameSearchResult] = useState<
    TSearchCard[] | undefined
  >([]);
  const [randomSearch, setRandomSearch] = useState<TSearchCard[] | undefined>(
    [],
  );
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchRandom = async () => {
    try {
      setIsLoading(true);
      databaseRef(`users`)
        // .limitToLast(100)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            let data: TSearchCard = snapshot.val();
            let tempSearchData: TSearchCard[] | undefined = Object.values(
              data,
            ).filter(
              elem => elem.uid != uid && elem?.isPro,
              // &&
              // !reportedList?.includes(elem?.uid),
              // &&
              // !blockedList?.includes(elem.uid) &&
            );
            setRandomSearch(tempSearchData);
            useFilter(tempSearchData, setRandomSearch);
            let names = tempSearchData?.map(
              item => (item?.displayName, item?.uid),
            );

            // console.log({names, reportedList});
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const applySortBy = async (commonObjects: TSearchCard[]) => {
    if (!commonObjects || commonObjects.length === 0) return [];

    let sortedObjects: TSearchCard[] = [...commonObjects]; // Create a copy to avoid mutating the original array
    const checkAvail = async (commonObjects: TSearchCard[]) => {
      let sorted: TSearchCard[] = [];
      if (availability != 'All') {
        for (let i = 0; i < commonObjects.length; i++) {
          await databaseRef(`availability/${commonObjects[i].uid}`).once(
            'value',
            snapshot => {
              if (snapshot.exists()) {
                let dateData: string[] = Object.keys(snapshot.val());
                let timeData: string[] = Object.values(snapshot.val());
                for (let j = 0; j < dateData.length; j++) {
                  if (availability?.availabilityArray.includes(dateData[j])) {
                    console.log(
                      availability,
                      timeData,
                      timeData[j].some(timeString =>
                        availability?.availabilityTimeArray.includes(
                          timeString,
                        ),
                      ),
                      'avail',
                    );
                    if (
                      timeData[j].some(timeString =>
                        availability?.availabilityTimeArray.includes(
                          timeString,
                        ),
                      )
                    ) {
                      console.log('object', commonObjects[i]);
                      sorted.push(commonObjects[i]);
                      break;
                    }
                  }
                }
              }
            },
          );
        }
        return sorted;
      } else {
        return commonObjects;
      }
    };
    if (sortBy === 'Relevance') {
      null;
    } else if (sortBy === 'Descending Price') {
      sortedObjects.sort((a, b) => (b?.price || 0) - (a?.price || 0));
    } else if (sortBy === 'Ascending Price') {
      sortedObjects.sort((a, b) => (a?.price || 0) - (b?.price || 0));
    } else if (sortBy === 'Grade') {
      sortedObjects.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
    }
    let result = await checkAvail(sortedObjects);
    return result;
  };
  const getCommonObjects = (arrays: TSearchCard[][]) => {
    if (arrays.length === 0) return [];

    const isEqual = (obj1: TSearchCard, obj2: TSearchCard) =>
      obj1.uid === obj2.uid;
    let commonObjects = arrays[0];

    for (let i = 1; i < arrays.length; i++) {
      if (!arrays[i]) continue;
      commonObjects = commonObjects.filter(obj1 =>
        arrays[i].some(obj2 => isEqual(obj1, obj2)),
      );
    }

    const uniqueObjects = commonObjects.filter(
      (obj, index, self) => index === self.findIndex(t => t.uid === obj.uid),
    );

    return uniqueObjects;
  };
  const useFilter = async (searchedRes: TSearchCard[], setSearch) => {
    let professionalFilterData: TSearchCard[] = [];
    let priceFilterData: TSearchCard[] = [];
    let gradeFilterData: TSearchCard[] = [];
    let locationFilterData: TSearchCard[] = [];

    searchedRes = searchedRes.filter(
      item =>
        // !blockedList?.includes(item?.uid) &&
        !reportedList?.includes(item?.uid),
    );

    const applyProfessionFilter = () => {
      return searchedRes.filter(obj => {
        if (obj?.profession) return category.includes(obj?.profession);
      });
    };

    const applyPriceFilter = () => {
      return searchedRes.filter(obj => {
        if (obj?.price) {
          return (
            Number(obj?.price) > Number(price[0]) &&
            Number(obj?.price) < Number(price[1])
          );
        }
      });
    };

    const applyGradeFilter = () => {
      return searchedRes.filter(obj => {
        if (
          'rating' in obj &&
          obj?.rating > Number(grade[0]) &&
          obj?.rating <= Number(grade[1])
        ) {
          // console.log(obj.rating, 'rate');
          return obj;
        }
      });
    };

    const applyLocationFilter = () => {
      if (!Array.isArray(location) || location.length === 0) {
        return searchedRes;
      }
      return searchedRes.filter(obj => {
        if (obj?.location?.city) {
          if (
            location?.some(elem => Object.values(obj?.location).includes(elem))
          ) {
            return obj;
          }
        }
      });
    };

    if (applyFilter) {
      if (category[0] != 'All') {
        professionalFilterData = applyProfessionFilter();
      }
      if (price != 'All') {
        priceFilterData = applyPriceFilter();
      }
      if (grade != 'All') {
        gradeFilterData = applyGradeFilter();
      }
      if (location[0] != undefined) {
        locationFilterData = applyLocationFilter();
      }

      const getResultantArray = (
        professionalFilterData: TSearchCard[],
        priceFilterData: TSearchCard[],
        gradeFilterData: TSearchCard[],
        locationFilterData: TSearchCard[],
      ): TSearchCard[][] => {
        let resArray: TSearchCard[][] = [];
        if (category[0] != 'All') {
          resArray.push(professionalFilterData);
        }
        if (price != 'All') {
          resArray.push(priceFilterData);
        }
        if (grade != 'All') {
          resArray.push(gradeFilterData);
        }
        if (location[0] != 'All') {
          resArray.push(locationFilterData);
        }
        return resArray;
      };
      const commonObjects = getCommonObjects(
        getResultantArray(
          professionalFilterData,
          priceFilterData,
          gradeFilterData,
          locationFilterData,
        ),
      );
      const isDefaultFilters =
        category[0] === 'All' &&
        price === 'All' &&
        grade === 'All' &&
        location[0] === 'All';
      let result = await applySortBy(commonObjects);
      if (isDefaultFilters && sortBy != 'Relevance') {
        let temp = await applySortBy(searchedRes);
        // temp = temp.filter(
        //   item =>
        //     // !blockedList?.includes(item?.uid) &&
        //     !reportedList?.includes(item?.uid),
        // );
        setSearch(temp);
        setIsLoading(false);
      } else {
        let temp = await applySortBy(result);
        // temp = temp.filter(
        //   item =>
        //     // !blockedList?.includes(item?.uid) &&
        //     !reportedList?.includes(item?.uid),
        // );
        setSearch(temp);
        setIsLoading(false);
      }
    } else {
      console.log(3);
      let result = await applySortBy(searchedRes);
      // result = result.filter(
      //   item =>
      //     // !blockedList?.includes(item?.uid) &&
      //     !reportedList?.includes(item?.uid),
      // );
      setSearch(result);
      setIsLoading(false);
    }
  };

  const searchByName = async () => {
    try {
      let nameRes = [];
      let proRes = [];

      await databaseRef('users')
        .orderByChild('displayName')
        .startAt(searchQuery?.toLowerCase())
        .endAt(searchQuery?.toLowerCase() + 'uf8ff')
        // .endAt('~' + searchQuery + 'uf8ff')
        .once('value', snapshot => {
          if (snapshot.exists()) {
            let searchedRes: TSearchCard[] = Object.values(
              snapshot.val(),
            ).filter(
              obj => obj.uid != uid && obj.isPro,
              // && (reportedList ? !reportedList!.includes(obj?.uid) : null),
              // (blockedList ? !blockedList!.includes(obj.uid) : null) &&
            );
            nameRes = searchedRes;
            // console.log(nameRes, 'NameRes');
            // useFilter(searchedRes);
            // setNameSearchResult(temp);
          } else {
            setNameSearchResult([]);
            setSearchResult([]);
          }
        });
      await databaseRef('users')
        .orderByChild('profession')
        .startAt(searchQuery)
        .endAt(searchQuery + 'uf8ff')
        .once('value', snapshot => {
          if (snapshot.exists()) {
            let searchedRes: TSearchCard[] = Object.values(
              snapshot.val(),
            ).filter(
              obj => obj.uid != uid && obj.isPro,
              // &&
              // !blockedList?.includes(obj.uid) &&
              // !reportedList?.includes(obj.uid),
            );
            proRes = searchedRes;
            // setNameSearchResult(temp);
          } else {
            setNameSearchResult([]);
            setSearchResult([]);
          }
        });

      let names = nameRes?.map(item => item?.displayName);
      let pros = proRes?.map(item => item?.displayName);
      console.log({ names, pros });
      useFilter(uniqueObjects([nameRes, proRes]), setSearchResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };
  const uniqueObjects = arrayOfArrays => {
    const seen = new Set();
    const result = [];

    arrayOfArrays.flat().forEach(obj => {
      if (!seen.has(obj.uid)) {
        seen.add(obj.uid);
        result.push(obj);
      }
    });
    return result;
  };
  const search = async () => {
    if (searchQuery == '') {
      return null;
    } else {
      setIsLoading(true);
      setHasSearched(false);
      await searchByName();
    }
  };

  useEffect(() => {
    dispatch(setInitial());

    // const fetchBlockedIds = async () => {
    //   let blockedList: string[];
    //   databaseRef(`blocked/${uid}`).on('value', snapshot => {
    //     if (snapshot.val()) {
    //       blockedList = Object.keys(snapshot.val());
    //       setBlockedList(blockedList);
    //     } else {
    //       setBlockedList([]);
    //     }
    //   });
    // };

    const fetchReportedIds = async () => {
      let reportedList: string[];
      databaseRef(`reported/${uid}`).on('value', snapshot => {
        if (snapshot.val()) {
          reportedList = Object.keys(snapshot.val());
          // console.log({reportedList});
          setReportedList(reportedList);
        } else {
          setReportedList([]);
        }
      });
    };

    // fetchBlockedIds();
    fetchReportedIds();

    return () => {
      // databaseRef(`blocked/${uid}`).off('value');
      databaseRef(`reported/${uid}`).off('value');
    };
  }, []);
  useEffect(() => {
    // dispatch(setInitial())
    searchRandom();
  }, [
    category,
    grade,
    price,
    location,
    availability,
    sortBy,
    applyFilter,
    blockedList,
    reportedList,
  ]);
  useEffect(() => {
    if (searchQuery != '') {
      search();
    }
  }, [
    category,
    grade,
    price,
    location,
    availability,
    sortBy,
    applyFilter,
    blockedList,
    reportedList,
  ]);
  useEffect(() => {
    if (searchQuery === '') {
      let filteredRandomSearch = randomSearch?.filter(
        item =>
          !blockedList?.includes(item?.uid) &&
          !reportedList?.includes(item?.uid),
      );
      setSearchResult(filteredRandomSearch);
    }
  }, [searchQuery, blockedList, reportedList]);
  return {
    searchResult,
    search,
    setSearchQuery,
    searchQuery,
    randomSearch,
    hasSearched,
    isLoading,
    blockedList,
    reportedList,
  };
};

export default useSearch;
