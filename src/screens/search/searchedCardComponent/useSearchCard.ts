import { View, Text } from 'react-native'
import React from 'react'
import { useAppSelector } from 'src/redux/reducer/reducer'
import { databaseRef } from 'src/utils/useFirebase/useFirebase'

const useSearchCard = ({ searchedCardObject }: TSearchCardProps) => {
    const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid)
    const saveToSearchHistory = async () => {
        try {
            await databaseRef(`searchHistory/${uid}/${searchedCardObject?.uid}`).set(true)
        }
        catch (error) {
            console.error(error);
        }
    }
    return {
        uid,
        saveToSearchHistory,
    }
}

export default useSearchCard