import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';

export default function FeedScreen(props) {
    const [paused, setPaused] = React.useState(true)

    const handlePaused = () => {
        if (paused) {
            setPaused(false)
            props.onPress(false)
        } else {
            setPaused(true)
            props.onPress(true)
        }

    }
    return (
        // <TouchableWithoutFeedback onPress={() => handlePaused()}>
        //     {paused ? <Image source={require('./../../Assets/Feed/Play.png')} style={{ width: 80, height: 80 }} />
        //         : <Image source={require('./../../Assets/Feed/Pause.png')} style={{ width: 80, height: 80 }} />}
        // </TouchableWithoutFeedback>

        <View style={{ alignItems: "center", width: WIDTH, paddingVertical: 10 }}>

            <View style={{ backgroundColor: COLORS.APPCOLORS, width: WIDTH * 0.9, elevation:2, borderRadius: 15, flexDirection: 'row' }}>
                <View style={{ width: WIDTH * 0.55, padding: 15 }}>
                    <Text style={{ color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.MEDIUM }}>{"Post From " + new Date(props.item.date).toDateString()}</Text>

                    <View style={{ marginVertical: 10 }}>

                        <Text numberOfLines={1} style={{ color: COLORS.WHITE, width: WIDTH * 0.6, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>{props.item.name}</Text>

                    </View>

                    <Text style={{ color: COLORS.LOGOCOLOR, paddingVertical: 5, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }} numberOfLines={2}>{props.item.description}</Text>

                    <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 5 }} onPress={() => props.handleEmail()}>

                        <Image source={require('./../../Assets/Feed/IconMAIL.png')} style={{ width: 25, height: 25 }} />

                        <Text style={{ color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE, paddingLeft: 5 }}>Email audio link to yourself</Text>
                    </TouchableOpacity>

                </View>


                <TouchableOpacity style={{ height: HEIGHT * 0.2, width: WIDTH *0.3, alignItems: 'center', justifyContent: 'center' }} onPress={() => handlePaused()}>
                    {/* <Image source={require('./../../Assets/Feed/IconVIDEO.png')} resizeMode='cover' style={{ width: WIDTH * 0.3, height: WIDTH * 0.3, borderTopRightRadius: 15, borderBottomRightRadius: 15 }} /> */}
                    {paused ? <Image source={require('./../../Assets/Feed/Play.png')} style={{  width: WIDTH * 0.22, height: WIDTH * 0.22,}} />
                        : <Image source={require('./../../Assets/Feed/Pause.png')} style={{  width: WIDTH * 0.22, height: WIDTH * 0.22 }} />
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}