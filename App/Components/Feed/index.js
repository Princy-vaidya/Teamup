import React, { useState, useEffect } from 'react';
import { View, StatusBar, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from '../../Utils/constants';
import { WebView } from 'react-native-webview';


export default function FeedScreen(props) {
    const [uri, setUri] = useState("")

    useEffect(() => {
        // props.navigation.setOptions({ headerShown: false });
        const { params } = props.route;
        console.log("params videoItem------>", params)
        const url = params && params.videoItem.item.video
        setUri(url)
    }, [])

    const jsCode = `document.querySelector('#myContent').style.backgroundColor = 'red';`;

    return (
        <>
            <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
            <WebView
                originWhitelist={['*']}
                source={{
                    uri: uri
                }}
                javaScriptEnabled={true}
                injectedJavaScript={jsCode}
                style={{ top: -50 }}
            />

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        fontSize: FONT.SIZE.EXTRALARGE,
        fontFamily: FONT.FAMILY.ROBOTO_Regular
    },

})