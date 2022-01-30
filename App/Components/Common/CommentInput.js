import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH, IAMGE_URL } from './../../Utils/constants';



export default function CommentInputText(props) {

    const {value, handleCommentFeed, onChangeText} = props;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder='Add comment....'
                onChangeText={onChangeText}
            />
            <TouchableOpacity onPress={handleCommentFeed}>
                <Image source={require('./../../Assets/Images/Message.png')} style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        flexDirection: 'row',
        width: WIDTH * 0.65,
        borderRadius: 10,
        backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: WIDTH * 0.55,
        paddingLeft: 10
    },
    icon: {
        width: 20,
        height: 20
    }
})