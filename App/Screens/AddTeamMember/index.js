import React, { useState, useEffect } from 'react';
import { View, StatusBar, Share, Text, Image, ImageBackground, Pressable, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import Loader from "./../../Components/Common/Loader"
import Button from "./../../Components/Common/button"
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import Network from './../../Services/Network';
import AntDesign from 'react-native-vector-icons/AntDesign';


export default function AddTeamMember(props) {
    const [loading, setLoading] = useState(false);
    const [teamList, setTeamList] = useState(null)
    const [modalVisibleShare, setModalVisibleShare] = useState(false)
    const [UniqueCode, setUniqueCode] = useState(null)
    const [modalVisibleCongo, setModalVisibleCongo] = useState(false)
    const [modalDoneShare,setModalDoneShare]=useState(false)
    const [toggle,setToggle]=useState(false)

    useEffect(() => {
        getTeamList()
    }, [])

    // ************************************Team list*********************************************

    const getTeamList = async () => {
        const userMe = await AsyncStorage.getItem('@user')
        if (userMe) {
            setLoading(true);
            const data = {
                authToken: JSON.parse(userMe).authtoken
            };
            Network('league/league_list', 'post', data)
                .then(async (res) => {
                    console.log("league_list--->", res);
                    if (res.success) {
                        if (res.data.docs.length != 0) {
                            setTeamList(res.data.docs[0])
                            getUniqueTeamCode(res.data.docs[0])
                        }
                    } else {
                        Toast.show(res.message);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    Toast.show('error');
                });
        }
    }



    /******************************Skip***********************************/
    const getUniqueTeamCode = async (item) => {
        setModalVisibleShare(true)
        const userMe = await AsyncStorage.getItem('@user')
        if (userMe) {
            setLoading(true);
            const data = {
                authToken: JSON.parse(userMe).authtoken
            };

            Network('league/get-unique-team-code?league_id=' + item.league_id, 'get', data)
                .then(async (res) => {
                    console.log("res team code get-->", JSON.stringify(res));
                    if (res.success) {
                        setUniqueCode(res.response.unique_team_code)
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    Toast.show('error');
                });
        }
    }


    const handleTUniqueTeamCode = async () => {
        try {
            // const result = await Share.share({
            //     message:
            //         `This is a unique team code:- ${UniqueCode}`,
            // });
            const result = await Share.share({
                title: 'Join my TeamUp team!',
                // message: `Join me on TeamUp! Get TeamUp :https://play.google.com/store/apps/details?id=com.teamup,\r\n My team code - ${UniqueCode}`,
               message: `I want you in my team!\r\n\r\nhttps://www.teamup-theapp.com/jointeam\r\n\r\nTeam code:${UniqueCode}\r\n\r\nLet's get moving!`,
            //   url: 'https://play.google.com/store/apps/details?id=com.teamup',
            url:'https://www.teamup-theapp.com/jointeam'
            });
            // setTimeout(() => {
            //     setModalVisibleCongo(true)
            // },500)

            setModalDoneShare(true)
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <>
            <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
            <Loader loading={loading} />

            <ImageBackground
                source={require('./../../Assets/Images/Background.png')}
                style={styles.imageContainer}
                resizeMode='stretch'
            >
                <Heading
                    title={teamList && teamList.league.league_name}
                    onPressBack={() => props.navigation.navigate('Team')}
                    onPressEdit={() => props.navigation.navigate('EditTeam', { 'leagueData': teamList })}
                />


                <ScrollView>

                    <View style={styles.subContainer}>

                        <View style={{ justifyContent: 'center', alignItems: 'center', height: HEIGHT * 0.5 }}>

                            <Text style={{ color: '#B1B0B7', fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }}>Start your team by adding friends below!</Text>

                        </View>

                        <Button
                            buttonWidth={WIDTH * 0.8}
                            lable="Add team members"
                            onPress={() => {setModalVisibleShare(true);setToggle(true)}}
                        />

                    </View>

                </ScrollView>
            </ImageBackground>



            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleShare}
                    onRequestClose={() => setModalVisibleShare(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ width: WIDTH * 0.86, flexDirection: 'row', justifyContent: 'flex-end', padding: 15 }}>
                                <View />
                                <AntDesign name="close" size={30} color={COLORS.HEADERCOLOR} onPress={() => {setModalVisibleShare(false);
                                // if(modalDoneShare){
                                    if(!toggle){
                                        setModalDoneShare(false)
                                        setModalVisibleCongo(true)
                                        }else{
                                        setModalDoneShare(false)
                                        }
                                // }
                                }} 
                                />

                            </View>


                            <Text style={styles.modalText}>Unique team code</Text>

                            <Text style={{ color: '#B1B0B7', width: WIDTH * 0.7, fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: HEIGHT * 0.02 }}>Invite friends to your team via the code or through the share button below</Text>


                            <View style={{ height: HEIGHT * 0.15, justifyContent: 'center' }}>
                                <View style={{ borderRadius: 10, borderWidth: 1, flexDirection: 'row', borderColor: COLORS.APPCOLORS, width: WIDTH * 0.7, height: HEIGHT * 0.07, alignItems: 'center', justifyContent: 'center' }}>
                                    {UniqueCode && UniqueCode.split('').map((item) => {
                                        return (
                                            <Text style={{ color: COLORS.APPCOLORS, paddingHorizontal: 5, fontSize: 24, fontFamily: FONT.FAMILY.ROBOTO_Bold }}>{item}</Text>
                                        )
                                    })
                                    }
                                </View>
                            </View>

                            <Pressable onPress={() => handleTUniqueTeamCode()} style={{ width: WIDTH * 0.7, flexDirection: 'row', marginTop: HEIGHT * 0.03, height: HEIGHT * 0.07, backgroundColor: COLORS.APPCOLORS, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <AntDesign name="sharealt" size={15} color={COLORS.WHITE} style={{ padding: 5 }} />
                                <Text style={{ color: COLORS.WHITE, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>Share code</Text>

                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>


            <View style={styles.centeredView}>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleCongo}
                    onRequestClose={() => setModalVisibleCongo(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView,{height:HEIGHT*0.58,padding:20}]}>
                            <Text style={[styles.modalText,{fontSize:18,fontFamily:FONT.FAMILY.ROBOTO_Bold}]}>Congratulations on your{'\n'}new team!</Text>

                            <Text style={{ color: '#B1B0B7', fontSize: 16, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: HEIGHT * 0.02 }}>As the Team Captain you will be represented with a (C)</Text>
                            <Text style={{ color: '#B1B0B7', fontSize: 16, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: HEIGHT * 0.02 }}>When others accept your invitations you'll be notified and you'll see them listed in your team.</Text>
                            <Text style={{ color: '#B1B0B7',fontSize: 16, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: HEIGHT * 0.01 }}>You can invite members to your team at anytime.</Text>
                           

                            <Pressable onPress={() => setModalVisibleCongo(false)} style={{ width: WIDTH * 0.7, flexDirection: 'row', marginTop: HEIGHT * 0.03, height: HEIGHT * 0.07, backgroundColor: COLORS.APPCOLORS, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: COLORS.WHITE, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    )
}


const Heading = (props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', height: HEIGHT * 0.13 }}>
            <TouchableOpacity onPress={() => props.onPressBack()} style={{ alignItems: 'flex-end', width: WIDTH * 0.1 }}>
                <Image source={require('./../../Assets/Images/arrow_back.png')} resizeMode='contain' style={{ width: 25, height: 25 }} />
            </TouchableOpacity>

            <Text style={{ color: COLORS.WHITE, width: '75%', fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center' }}>{props.title}</Text>

            <TouchableOpacity onPress={() => props.onPressEdit()} style={{ alignItems: 'flex-end', width: WIDTH * 0.1 }}>
                <Image source={require('./../../Assets/Images/edit.png')} resizeMode='contain' style={{ width: 20, height: 20 }} />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
        width: WIDTH,
        backgroundColor: COLORS.BACKGROUNDCOLOR
    },
    subContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: WIDTH,
        height: HEIGHT * 0.8
    },
    centeredView: {
        height: HEIGHT,
        width: WIDTH,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        height: HEIGHT * 0.4,
        width: WIDTH * 0.9,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    imageContainer: {
        width: WIDTH,
        height: HEIGHT
    },
    placeholderText: {
        color: COLORS.SECONDARY,
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        textAlign: 'left',
        fontSize: FONT.SIZE.MEDIUM,
        paddingLeft: 45
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        // padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: WIDTH * 0.86,
        height: HEIGHT * 0.55
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        marginTop:20,
        textAlign: "center",
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        fontSize: FONT.SIZE.EXTRALARGE
    }
})