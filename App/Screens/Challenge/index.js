import React, { useState, useEffect } from 'react';
import { View, StatusBar, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from '../../Utils/constants';
import { WebView } from 'react-native-webview';


export default function Challeges(props) {
    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
                <View style={{ paddingLeft: 15 }}>
                    <Image source={require("./../../Assets/CreateLeague/logo.png")} style={{ width: WIDTH * 0.25, height: HEIGHT * 0.06 }} />
                </View>
            ),
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
                    uri: 'https://www.200clubfitness.com/challenge'
                }}
            />
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        fontSize: FONT.SIZE.EXTRALARGE,
        fontFamily: FONT.FAMILY.ROBOTO_Regular
        // height: HEIGHT,
        // width: WIDTH,
        // backgroundColor: COLORS.PRIMARY,
    },

})