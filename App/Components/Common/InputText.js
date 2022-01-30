import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { color } from 'react-native-reanimated';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';



export default function TextinputComponent(props) {


    const { value, onChangeText, onPress,maxLength ,rightIcon,returnKeyType, lefImage,colorValue,widthValue,textAlign,placeholder, capitalize, editable, onBlur, keyboard, placeholderTextColor, screenwidth, secureTextEntry,letterSpacing,type,onFocus} = props;

    return (
        <View style={styles.container}>
            <View style={{
                width: screenwidth,
                backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <TextInput
                    style={[{ height: 60, borderRadius: 5,width: WIDTH * 0.8, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM, paddingHorizontal: 15},{ borderColor: colorValue,borderWidth:widthValue,textAlign:textAlign,letterSpacing:letterSpacing}]}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    value={value}
                    onBlur={onBlur}
                    keyboardType={keyboard ? keyboard : 'default'}
                    autoCorrect={false}
                    autoCompleteType='off'
                    editable={editable}
                    autoCapitalize={capitalize == "characters" ? "characters" :type==="name"?'words':type==="caps letter"?"sentences":
                    'none'}
                    secureTextEntry={secureTextEntry}
                    returnKeyType={returnKeyType}
                    maxLength={maxLength}
                    onFocus={onFocus}
                />
                {/* {rightIcon && <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                    <Image source={lefImage} style={{ width: 25, height: 25, margin: 10 }} />
                </TouchableOpacity>} */}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        alignItems: 'center',
        paddingVertical: 15
    }
})