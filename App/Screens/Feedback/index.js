import React, { useState, useEffect } from 'react';
import { View, StatusBar, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from '../../Utils/constants';
import { WebView } from 'react-native-webview';


export default function Feedback(props) {
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingRight: 20, alignItems: "center" }} onPress={() => props.navigation.toggleDrawer()}>
                    <Image source={require("./../../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            )
        });
    }, [])



    return (
        <>
            <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
            <WebView
                source={{
                    uri: 'https://www.teamup-theapp.com/feedback'
                }}
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