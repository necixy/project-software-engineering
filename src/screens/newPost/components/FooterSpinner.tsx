// This code renders the loading icon if there are images left in the selected album.
import { ActivityIndicator } from 'react-native'
import React from 'react'

const FooterSpinner = ({ noMore }:any) => {
    if (noMore) {
        return null
    }
    else {
        return (
            <ActivityIndicator />
        )
    }

}

export default FooterSpinner