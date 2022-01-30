import React, { useState, useEffect } from 'react';
import { View, StatusBar, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from '../../Utils/constants';
import { WebView } from 'react-native-webview';


export default function NewPostScreen(props) {

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
            <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
           
         
               <WebView
                source={{
                    uri: 'https://www.teamup-theapp.com/welcome'
                }}
            />
            <View style={{position:'absolute',top:10,left:10}} >
            <TouchableOpacity
        onPress={()=>props.navigation.goBack()}
        style={{}}>
        <Image
          source={require('./../../Assets/Images/arrow_back.png')}
          resizeMode="contain"
          style={{width: 30, height: 30,tintColor:COLORS.APPCOLORS}}
        />
      </TouchableOpacity>
            </View>
           

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        fontSize: FONT.SIZE.EXTRALARGE,
        fontFamily: FONT.FAMILY.ROBOTO_Regular
    },

})