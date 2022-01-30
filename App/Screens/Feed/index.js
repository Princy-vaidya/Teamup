import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import TextInput from "./../../Components/Common/InputText"
import Loader from "./../../Components/Common/Loader"
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import Button from "./../../Components/Common/button"
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import Tts from 'react-native-tts';
import { WebView } from 'react-native-webview';
import FeedScreen from './../../Components/Feed'
import GoogleCast, { CastButton } from 'react-native-google-cast'
import Video from 'react-native-video';
import FeedComponents from './feed';
import Sound from 'react-native-sound';
import TrackPlayer from 'react-native-track-player';
import VideoPlayer from "./VideoFeed";
import Orientation from 'react-native-orientation-locker';

var data = []

var videoArr = []

export default function LoginScreens(props) {
    const [loading, setLoading] = useState(false);
    const [feedList, setFeedList] = useState([])
    const [userFeed, setUserFeed] = useState([])
    const [email, setEmail] = useState('')
    // const [usr, setEmail] = useState('')

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingRight: 20, alignItems: "center" }} onPress={() => props.navigation.toggleDrawer()}>
                    <Image source={require("./../../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            )
        });
        
        getFeedListApi()
        getUserFeedApi()
        registerListeners()
        Sound.setCategory('Playback', true); // true = mixWithOthers
    }, [])


    const registerListeners = () => {
        const events = `
          SESSION_STARTING SESSION_STARTED SESSION_START_FAILED SESSION_SUSPENDED
          SESSION_RESUMING SESSION_RESUMED SESSION_ENDING SESSION_ENDED
    
          MEDIA_STATUS_UPDATED MEDIA_PLAYBACK_STARTED MEDIA_PLAYBACK_ENDED MEDIA_PROGRESS_UPDATED
    
          CHANNEL_CONNECTED CHANNEL_DISCONNECTED CHANNEL_MESSAGE_RECEIVED
        `
            .trim()
            .split(/\s+/)
        console.log(events)

        events.forEach(event => {
            GoogleCast.EventEmitter.addListener(GoogleCast[event], function () {
                console.log(event, arguments)
            })
        })
    }


    const getUserFeedApi = async () => {
        const userMe = await AsyncStorage.getItem('@user')
        if (userMe) {
            console.log("JSON.parse(userMe).email--->", JSON.parse(userMe).email);
            setEmail(JSON.parse(userMe).email)
            var data = {
                authToken: JSON.parse(userMe).authtoken
            }
            setLoading(true);

            Network('common/user_feed_list?user_id=' + JSON.parse(userMe)._id, 'get', data)
                .then((res) => {
                    console.log("res user feed details------>", JSON.stringify(res));
                    if (res.response_code == 2000) {
                        setLoading(false);
                        setUserFeed(res.response_data.docs)
                        // res.response.docs.map((item, i) => {
                        //     videoArr[i] = false
                        // })
                        // setFeedList(res.response.docs)
                    } else {
                        Toast.show("" + res.message);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    Toast.show("Something went wrong !");
                });
        }
    }


    const sendDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        return today
    }

    const next14Days = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const f = new Date(year, month, day - 14) // PLUS 1 DAY
        return f;

    }


    const getFeedListApi = async () => {

        props.navigation.addListener("focus", async () => {
            Orientation.lockToPortrait();
        })


        const userMe = await AsyncStorage.getItem('@user')
        if (userMe) {
            setLoading(true)
            var data = {
                from_date: next14Days(),
                to_date: sendDate(),
                authToken: JSON.parse(userMe).authtoken
            }

            Network('common/feed_List', 'post', data)
                .then((res) => {
                    console.log("res feed details------>", JSON.stringify(res));
                    if (res.success) {
                        setLoading(false);
                        res.response.docs.map((item, i) => {
                            videoArr[i] = false
                        })
                        setFeedList(res.response.docs)
                    } else {
                        Toast.show("" + res.message);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    Toast.show("Something went wrong !");
                });
        }
    }


    const handlePaused = (val, item, index) => {
        if (item.feed_type == "video") {
            GoogleCast.getCastState().then((res) => {
                if (res == "Connected") {
                    cast(item)
                }
                else if (res == "NoDevicesAvailable") {
                    // setPaused(val)

                    props.navigation.navigate("fulVideo", { 'videoUrl': item.video_path })
                }
                else if (res == "NotConnected") {
                    // setPaused(val)
                    props.navigation.navigate("fulVideo", { 'videoUrl': item.video_path })
                }
                else {
                    // setPaused(val)
                    props.navigation.navigate("fulVideo", { 'videoUrl': item.video_path })
                }
            })
        } else {

            TrackPlayer.setupPlayer().then(async () => {
                // Adds a track to the queue
                await TrackPlayer.add({
                    id: 'trackId',
                    url: item.audio_path,
                    title: "200 Club Feed Audio",
                    artist: item.name,
                    artwork: require('./../../Assets/TEAMUP_LOGO.png')
                });
                if (val) {
                    await TrackPlayer.stop();
                } else {
                    await TrackPlayer.play();
                }
            });
        }
    }


    const cast = (item) => {
        GoogleCast.getCastDevice().then(console.log);
        GoogleCast.castMedia({
            mediaUrl: String(item.video_path),
            imageUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/480x270/BigBuckBunny.jpg',
            title: String(item.name),
            subtitle: String(item.description),
            studio: String(item.name),
            contentType: 'video/mp4', // Optional, default is "video/mp4"
            playPosition: 10, // seconds
            customData: {
                customKey: 'customValue',
            },
        })
        GoogleCast.launchExpandedControls();
        GoogleCast.showCastPicker()
        sendMessage()
    }


    const sendMessage = () => {
        const channel = 'urn:x-cast:com.club'
        GoogleCast.initChannel(channel).then(() => {
            GoogleCast.sendMessage(channel, JSON.stringify({ message: 'Hello' }))
        })
    }

    //...send email from user,,,,,,,,,,,,

    const handleEmailVideo = (item) => {
        const message = `This is feed video link:- ${item.video_path}`;
        Linking.openURL(`mailto:${email}?subject=200Club App link&body=${message}`)
    }

    const handleEmailAudio = (item) => {
        const message = `This is feed audio link:- ${item.audio_path}`;
        Linking.openURL(`mailto:${email}?subject=200Club App link&body=${message}`)
    }

    const handleEmailText = (item) => {
        const message = `${item.description}`;
        Linking.openURL(`mailto:${email}?subject=200Club App link&body=${message}`)
    }

    const handleLike = async (item) => {
        const userMe = await AsyncStorage.getItem('@user')
        if (userMe) {
            setLoading(true)
            var data = {
                authToken: JSON.parse(userMe).authtoken,
                user_id: JSON.parse(userMe)._id,
                point_id: item._id
            }

            Network('common/like-user-feed', 'post', data)
                .then((res) => {
                    console.log("res feed like------>", JSON.stringify(res));
                    if (res.response_code == 2000) {
                        setLoading(false);
                        Toast.show("" + res.message);
                        // getFeedListApi()
                        getUserFeedApi()
                    } else {
                        Toast.show("" + res.message);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    Toast.show("Something went wrong !");
                });
        }
    }

    return (
        <>
            <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
            <Loader loading={loading} />
            <View style={styles.container}>
                <Heading />

                <View style={{ height: '83%' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <>
                            {userFeed.length != 0 &&

                                userFeed.map((item) => {
                                    return (
                                        <View style={{ width: WIDTH, marginVertical: 10, alignItems: 'center' }}>
                                            <View style={{ backgroundColor: '#404040', flexDirection: 'row', width: WIDTH * 0.9, borderRadius: 15 }}>

                                                <View style={{ width: WIDTH * 0.6, padding: 15 }}>
                                                    <Text style={{ color: COLORS.SECONDARY, fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: FONT.SIZE.MEDIUM }}>{new Date(item.date).toDateString() + ", " + item.activity_details.activity}</Text>

                                                    <View style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between' }}>

                                                        <Text style={{ color: COLORS.WHITE, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>{item.user_details.first_name + " " + item.user_details.last_name}</Text>

                                                        <View style={{ borderRadius: 3, width: 22, height: 22, marginTop: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.SECONDARY }}>
                                                            <Text style={{ fontSize: FONT.SIZE.SMALL, fontFamily: FONT.FAMILY.ROBOTO_Regular, color: COLORS.WHITE }}>{item.point}</Text>
                                                        </View>
                                                    </View>

                                                    <Text numberOfLines={4} style={{ fontSize: FONT.SIZE.MEDIUM, width: WIDTH * 0.55, fontFamily: FONT.FAMILY.ROBOTO_Regular, color: COLORS.WHITE }}>{item.note}</Text>

                                                    {/* <TouchableOpacity style={{ paddingTop: 5, flexDirection: 'row' }} onPress={() => handleLike(item)}>
                                                        <Image source={require('./../../Assets/Feed/IconFISTBUMP.png')} resizeMode="cover" style={{ width: 30, height: 30 }} />
                                                        <Text style={{ color: COLORS.WHITE, fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, paddingLeft: 5 }}>{item.likes == undefined ? '' : item.likes.length}</Text>
                                                    </TouchableOpacity> */}
                                                </View>

                                                <View>
                                                    {item.image == null ?
                                                        <Image source={{ uri: 'https://i.stack.imgur.com/l60Hf.png' }} resizeMode='cover' style={{ width: WIDTH * 0.3, height: HEIGHT * 0.2, borderTopRightRadius: 15, borderBottomRightRadius: 15 }} />
                                                        :
                                                        <Image source={{ uri: item.image }} resizeMode='cover' style={{ width: WIDTH * 0.3, height: HEIGHT * 0.2, borderTopRightRadius: 15, borderBottomRightRadius: 15 }} />
                                                    }
                                                </View>

                                            </View>
                                        </View>
                                    )
                                })


                            }



                            {feedList.length != 0 &&

                                feedList.map((item, index) => {
                                    return (
                                        <View>
                                            {item && item.feed_type == 'video' &&


                                                <VideoPlayer
                                                    item={item}
                                                    onPress={(val) => handlePaused(val, item, index)}
                                                    handleEmail={() => handleEmailVideo(item)}
                                                // handleFullScreen={() => props.navigation.navigate("fulVideo", { 'videoUrl': item.video_path })}
                                                />

                                            }


                                            {item && item.feed_type == 'audio' &&
                                                // <View style={{ alignItems: "center" }}>
                                                //     <>
                                                //         <View style={styles.backgroundVideo}>
                                                //             <Image source={require('./../../Assets/logo.png')} resizeMode="cover"
                                                //                 style={{
                                                //                     width: WIDTH * 0.89,
                                                //                     height: WIDTH * 0.5525,
                                                //                 }} />
                                                //         </View>
                                                //     </>
                                                //     <View style={styles.controls}>
                                                <FeedComponents
                                                    item={item}
                                                    onPress={(val) => handlePaused(val, item, index)}
                                                    handleEmail={() => handleEmailAudio(item)}
                                                />
                                                //     </View>
                                                // </View>
                                            }

                                            {item && item.feed_type == 'text' &&

                                                <View style={{ alignItems: "center", width: WIDTH, paddingVertical: 10 }}>

                                                    <View style={{ backgroundColor: COLORS.SECONDARY, width: WIDTH * 0.9, borderRadius: 15, flexDirection: 'row' }}>
                                                        <View style={{ width: WIDTH * 0.9, padding: 15 }}>
                                                            <Text style={{ color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.MEDIUM }}>{"Post From " + new Date(item.date).toDateString()}</Text>

                                                            <View style={{ marginVertical: 10, }}>

                                                                <Text numberOfLines={1} style={{ color: COLORS.WHITE, width: WIDTH * 0.6, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>{item.name}</Text>

                                                            </View>

                                                            <Text style={{ color: COLORS.LOGOCOLOR, paddingVertical: 5, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }} numberOfLines={3}>{item.description}</Text>

                                                            <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 5 }} onPress={() => handleEmailText(item)}>

                                                                <Image source={require('./../../Assets/Feed/IconMAIL.png')} style={{ width: 25, height: 25 }} />

                                                                <Text style={{ color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE, paddingLeft: 5 }}>Email text link to yourself </Text>
                                                            </TouchableOpacity>

                                                        </View>
                                                    </View>
                                                </View>




                                                // <View style={{ alignItems: "center" }}>
                                                //     <>
                                                //         <View style={styles.backgroundVideo}>
                                                //             <ScrollView>
                                                //                 <Text style={{ color: COLORS.LOGOCOLOR, fontSize: FONT.SIZE.LARGE, padding: 15 }}>
                                                //                     {
                                                //                         item.description
                                                //                     }
                                                //                 </Text>
                                                //             </ScrollView>
                                                //         </View>

                                                //     </>

                                                // </View>
                                            }

                                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, paddingHorizontal: 25, alignItems: "center", width: WIDTH * 0.97 }}>

                                                <Text style={{ color: COLORS.WHITE, fontSize: FONT.SIZE.EXTRALARGE, fontFamily: FONT.FAMILY.ROBOTO_Bold, textTransform: 'uppercase', width: WIDTH * 0.7 }} numberOfLines={1}>{item.name}</Text>

                                            </View>
                                            <Text style={{ color: COLORS.SECONDARY, paddingHorizontal: 25, fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: FONT.SIZE.MEDIUM }}>{new Date(item.date).toDateString()}</Text>

                                            <Text style={{ paddingHorizontal: 25, color: '#c4c4c4', paddingVertical: 15, fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: FONT.SIZE.MEDIUM, width: WIDTH * 0.97 }}>{item.description}</Text> */}

                                        </View>
                                    )
                                })
                            }

                        </>
                    </ScrollView>
                </View>

            </View>
        </>
    )
}


const Heading = () => {
    return (
        <View style={styles.headingCont}>
            <View style={{ width: WIDTH * 0.9, justifyContent: 'space-between' }}>
                <Text style={styles.headingText}>your feed</Text>
            </View>
            <CastButton style={{ width: 24, height: 24, tintColor: '#ffffff' }} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        backgroundColor: COLORS.BACKGROUNDCOLOR,
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
        color: COLORS.LOGOCOLOR,
        fontSize: FONT.SIZE.EXTRALARGE,
        textAlign: "center",
        textTransform: 'uppercase',
        fontFamily: FONT.FAMILY.ROBOTO_Bold
    },
    backgroundVideo: {
        width: WIDTH * 0.89,
        height: WIDTH * 0.5525,
        borderColor: COLORS.SECONDARY,
        borderWidth: 2,
        borderRadius: 5,
        zIndex: 1,
    },
    controls: {
        position: "absolute",
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        width: WIDTH * 0.89,
        height: WIDTH * 0.5525,
        borderColor: COLORS.SECONDARY,
        borderWidth: 2,
        borderRadius: 5,
        zIndex: 1,
    }
})