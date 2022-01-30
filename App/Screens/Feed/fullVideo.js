import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import Orientation from 'react-native-orientation-locker';

export default function FeedScreen(props) {
    const [paused, setPaused] = React.useState(true)
    const [urlData, setUrl] = React.useState("")
    const player = useRef(null);
    const [muted, setMuted] = useState(false)
    

    useEffect(() => {
        const { params } = props.route;

        console.log('params.videoUrl--->', params)
        setUrl(params.videoUrl)
        StatusBar.setHidden(true);
        Orientation.lockToLandscapeLeft()
    }, [])


    const handlePaused = () => {
        if (paused) {
            setPaused(false)            
        } else {
            setPaused(true)            
        }
    }


    

    return (
        <View style={{ width: '100%', height: '100%' }}>
       
        <Video source={{ uri: urlData }}   // Can be a URL or a local file.
            ref={player}
            paused={paused}
            style={styles.backgroundVideo}
            resizeMode='cover'
            controls={false}
            // hideShutterView={false}
            // onEnd={handleEnd}
            // onLoad={handleLoad}
            // onProgress={handleProgress}
            fullscreen={true}
            muted={muted}
        />

        <View style={styles.controls}>
            <View style={{
                justifyContent: 'center', width: "100%",
                height: "100%", alignItems: 'center'
            }}>
                <TouchableWithoutFeedback onPress={() => handlePaused()} >
                    {paused ? <Image source={require('./../../Assets/Feed/Play.png')} style={{ width: 80, height: 80 }} />
                        : <Image source={require('./../../Assets/Feed/Pause.png')} style={{ width: 80, height: 80 }} />}
                </TouchableWithoutFeedback>
            </View>
            <View style={{ top: -40, right: 10 }}>
                <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
                    <Image source={require('./../../Assets/Feed/fullsceens.png')} style={{ width: 25, height: 25 }} />
                </TouchableWithoutFeedback>
            </View>
        </View>

    </View>
    )
}



const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
        width: WIDTH,
        backgroundColor: COLORS.PRIMARY,
    },
    subContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
    },
    headingCont: {
        height: HEIGHT * 0.15,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row',
        marginRight: 20
    },
    headingText: {
        color: COLORS.WHITE,
        fontSize: 28,
        textAlign: "center",
        textTransform: 'uppercase',
        fontFamily: FONT.FAMILY.ROBOTO_Bold
    },
    backgroundVideo: {
        // position: 'absolute',

        width: "100%",
        height: "100%",
        // minWidth: '100%',
        // minHeight: '100%'
        // borderColor: COLORS.SECONDARY,
        // borderWidth: 2,
        // borderRadius: 5,
        zIndex: 1,
        // backgroundColor: 'black',
    },
    controls: {
        position: "absolute",
        // justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'flex-end',
        width: "100%",
        height: "100%",
        // borderColor: COLORS.SECONDARY,
        // borderWidth: 2,
        // borderRadius: 5,
        zIndex: 1,
    }
})
