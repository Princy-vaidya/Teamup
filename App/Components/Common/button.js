import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';

export default function ButtonComponent(props) {

    const { buttonWidth, lable, onPress, topStyles } = props;

    return (
        <View style={[styles.containerMain, topStyles && { paddingTop: 0 }]}>
            <TouchableOpacity style={[styles.container, { width: buttonWidth }]} activeOpacity={0.6} onPress={onPress}>
                <Text style={styles.buttonText}>{lable}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT * 0.08,
        width: WIDTH,
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.APPCOLORS,
        borderRadius: 9,
    },
    buttonText: {
        fontSize: FONT.SIZE.LARGE,
        color: COLORS.WHITE,
        fontFamily: FONT.FAMILY.ROBOTO_Medium,
        // textTransform: 'uppercase'
    },
    containerMain: { paddingTop: HEIGHT * 0.06 }
})