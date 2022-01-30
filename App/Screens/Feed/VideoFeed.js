import React, {useState, useRef} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Video from 'react-native-video';
import {COLORS, FONT, HEIGHT, WIDTH} from './../../Utils/constants';

export default function VideoScreen(props) {
  const [paused, setPaused] = React.useState(true);
  const [show, setShow] = React.useState(true);
  const player = useRef(null);
  const [muted, setMuted] = useState(false);

  const handlePaused = () => {
    if (paused) {
      setPaused(false);
      props.onPress(false);
    } else {
      setPaused(true);
      props.onPress(true);
    }
  };

  return (
    <View style={{alignItems: 'center', width: WIDTH}}>
      <ImageBackground
        source={require('../../Assets/Admin_card.png')}
        style={{width: WIDTH * 0.9, borderRadius: 15, flexDirection: 'row'}}>
        {' '}
        <View style={{width: WIDTH * 0.55, padding: 15, paddingTop: 5}}>
          {/* <Text style={{ color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.MEDIUM }}>{"Post From " + new Date(props.item.date).toDateString()}</Text> */}

          <View style={{marginVertical: 10}}>
            <Text
              numberOfLines={1}
              style={{
                color: COLORS.APPCOLORS,
                width: WIDTH * 0.6,
                fontFamily: FONT.FAMILY.ROBOTO_Bold,
                fontSize: FONT.SIZE.LARGE,
              }}>
              {props.item.name}
            </Text>
          </View>

          <Text
            style={{
              color: COLORS.LOGOCOLOR,
              paddingVertical: 5,
              fontFamily: FONT.FAMILY.ROBOTO_Regular,
              fontSize: FONT.SIZE.MEDIUM,
            }}
            numberOfLines={2}>
            {props.item.description}
          </Text>

          <TouchableOpacity
            style={{flexDirection: 'row', paddingTop: 5}}
            onPress={() => props.handleEmail()}>
            {/* <Image source={require('./../../Assets/Feed/IconMAIL.png')} style={{ width: 25, height: 25 }} /> */}

            <Text
              style={{
                color: COLORS.LOGOCOLOR,
                fontFamily: FONT.FAMILY.ROBOTO_Regular,
                fontSize: FONT.SIZE.LARGE,
                paddingLeft: 5,
                textDecorationLine: 'underline',
                color: COLORS.APPCOLORS,
                fontFamily: FONT.FAMILY.ROBOTO_Bold,
              }}>
            {props.item.link_text}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={props.onPress}>
          <Image
            source={require('./../../Assets/Feed/IconVIDEO.png')}
            resizeMode="cover"
            style={{
              width: WIDTH * 0.2,
              height: WIDTH * 0.2,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              tintColor: COLORS.APPCOLORS,
            }}
          />
        </TouchableOpacity>
      </ImageBackground>

      {/* <Video source={{ uri: props.item }}   // Can be a URL or a local file.
                ref={player}
                paused={paused}
                style={styles.backgroundVideo}
                controls={true}
                resizeMode="none"
                controls={false}
                hideShutterView={false}
                fullscreen={true}
                // muted={muted}
            /> */}

      {/* <View style={styles.controls}>
                <View style={{
                    justifyContent: 'center', width: WIDTH * 0.89,
                    height: WIDTH * 0.5525, alignItems: 'center'
                }}>
                    <TouchableWithoutFeedback onPress={() => handlePaused()}>
                        {paused ? <Image source={require('./../../Assets/Feed/Play.png')} style={{ width: 80, height: 80 }} />
                            : <Image source={require('./../../Assets/Feed/Pause.png')} style={{ width: 80, height: 80 }} />}
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ top: -40, right: 10 }}>
                    <TouchableWithoutFeedback onPress={() => props.handleFullScreen()}>
                        <Image source={require('./../../Assets/Feed/fullsceens.png')} style={{ width: 25, height: 25 }} />
                    </TouchableWithoutFeedback>
                </View>
            </View> */}
    </View>
  );
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
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginRight: 20,
  },
  headingText: {
    color: COLORS.WHITE,
    fontSize: 28,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
  },
  backgroundVideo: {
    // position: 'absolute',

    width: WIDTH * 0.89,
    height: WIDTH * 0.5525,
    borderColor: COLORS.SECONDARY,
    borderWidth: 2,
    borderRadius: 5,
    zIndex: 1,
    // backgroundColor: 'black',
  },
  controls: {
    // position: "absolute",
    // justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'flex-end',
    width: WIDTH * 0.89,
    height: WIDTH * 0.5525,
    borderColor: COLORS.SECONDARY,
    borderWidth: 2,
    borderRadius: 5,
    zIndex: 1,
  },
});

// import React, { useState, useRef } from 'react';
// import { View, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
// import Video from 'react-native-video';
// import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';

// export default function VideoScreen(props) {
//     const [paused, setPaused] = React.useState(true)
//     const [show, setShow] = React.useState(true)
//     const player = useRef(null);
//     const [muted, setMuted] = useState(false)

//     const handlePaused = () => {
//         if (paused) {
//             setPaused(false)
//             props.onPress(false)
//         } else {
//             setPaused(true)
//             props.onPress(true)
//         }
//     }

//     return (
//         <View style={{ alignItems: "center" }}>
//             <Video source={{ uri: props.item }}   // Can be a URL or a local file.
//                 ref={player}
//                 paused={paused}
//                 style={styles.backgroundVideo}
//                 controls={true}
//                 resizeMode="none"
//                 controls={false}
//                 hideShutterView={false}
//                 fullscreen={true}
//                 // muted={muted}
//             />

//             <View style={styles.controls}>
//                 <View style={{
//                     justifyContent: 'center', width: WIDTH * 0.89,
//                     height: WIDTH * 0.5525, alignItems: 'center'
//                 }}>
//                     <TouchableWithoutFeedback onPress={() => handlePaused()}>
//                         {paused ? <Image source={require('./../../Assets/Feed/Play.png')} style={{ width: 80, height: 80 }} />
//                             : <Image source={require('./../../Assets/Feed/Pause.png')} style={{ width: 80, height: 80 }} />}
//                     </TouchableWithoutFeedback>
//                 </View>
//                 <View style={{ top: -40, right: 10 }}>
//                     <TouchableWithoutFeedback onPress={() => props.handleFullScreen()}>
//                         <Image source={require('./../../Assets/Feed/fullsceens.png')} style={{ width: 25, height: 25 }} />
//                     </TouchableWithoutFeedback>
//                 </View>
//             </View>

//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         height: HEIGHT,
//         width: WIDTH,
//         backgroundColor: COLORS.PRIMARY,
//     },
//     subContainer: {
//         alignItems: 'center',
//         alignSelf: 'center',
//         width: '100%',
//     },
//     headingCont: {
//         height: HEIGHT * 0.15,
//         alignItems: "center",
//         justifyContent: "space-between",
//         flexDirection: 'row',
//         marginRight: 20
//     },
//     headingText: {
//         color: COLORS.WHITE,
//         fontSize: 28,
//         textAlign: "center",
//         textTransform: 'uppercase',
//         fontFamily: FONT.FAMILY.ROBOTO_Bold
//     },
//     backgroundVideo: {
//         // position: 'absolute',

//         width: WIDTH * 0.89,
//         height: WIDTH * 0.5525,
//         borderColor: COLORS.SECONDARY,
//         borderWidth: 2,
//         borderRadius: 5,
//         zIndex: 1,
//         // backgroundColor: 'black',
//     },
//     controls: {
//         position: "absolute",
//         // justifyContent: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         alignItems: 'flex-end',
//         width: WIDTH * 0.89,
//         height: WIDTH * 0.5525,
//         borderColor: COLORS.SECONDARY,
//         borderWidth: 2,
//         borderRadius: 5,
//         zIndex: 1,
//     }
// })
