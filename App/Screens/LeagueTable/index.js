import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Pressable, Alert, ImageBackground, Share, Image, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import Loader from "./../../Components/Common/Loader"
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Button from "./../../Components/Common/button";
import moment from 'moment';





export default function LeagueTable(props) {
    const [loading, setLoading] = useState(true);
    const [leagueList, setLeagueList] = useState([]);
    const [lowleagueList,setLowLeagueList]=useState([])
    const [leagueName, setLeagueName] = useState('')
    const [leagueData, setLeagueDate] = useState('')
    const [userId, setUser] = useState("")
    const [modalVisibleShare, setModalVisibleShare] = useState(false)
    const [UniqueCode, setUniqueCode] = useState(null)
    const [modalVisibleCongo, setModalVisibleCongo] = useState(false)
    const [modalDoneShare,setModalDoneShare]=useState(false);
    const [toggle,setToggle]=useState(false)


    useEffect(() => {
        getApiCalling()
        handleOpenShare()
    }, [])

    //........This comment add for User unique team code  

    const sendDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        return today
      }
    const handleOpenShare = async () => {
        const userMe = await AsyncStorage.getItem('@user')
        if (userMe) {
            setLoading(true);
            const { params } = props.route;
            const data = {
                authToken: JSON.parse(userMe).authtoken
            };
            Network('league/get-unique-team-code?league_id=' + params.leagueData.league_id, 'get', data)
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


    const getApiCalling = async () => {
        props.navigation.addListener("focus", async () => {
            const userMe = await AsyncStorage.getItem('@user')
            var now = moment();
            var WeekStartDate = now.startOf('isoWeek');
            WeekStartDate = new Date(WeekStartDate.format('YYYY-MM-DD'))
            WeekStartDate.setHours(0, 0, 0, 0)
            var WeekEndDate = new Date(WeekStartDate);
            WeekEndDate.setDate(WeekStartDate.getDate() + 6);
            WeekEndDate.setHours(23, 59, 59, 999)
            console.log("date fot all", WeekStartDate, WeekEndDate);
            if (userMe) {
                setUser(JSON.parse(userMe)._id)
                const { params } = props.route;
                setLeagueDate(params.leagueData)
                setLeagueName(params.leagueData.league.league_name)
                setLoading(true);
                const data = {
                    league_id: params.leagueData.league_id,
                    date: sendDate(),
                    weekStartDate: moment(WeekStartDate).format('YYYY-MM-DD'),
                    weekEndDate: moment(WeekEndDate).format('YYYY-MM-DD'),
                    authToken: JSON.parse(userMe).authtoken
                };
                console.log('date update',data)
                Network('league/league_member_list', 'post', data)
                    .then(async (res) => {
                        console.log("league_member_list ,,,--->", res);
                        if (res.success) {
                            if (res.response.docs.length != 0) {
                                // setLeagueList(res.response.docs)
                            let data=res.response.docs;
                            data.sort( function ( a, b ) { return b.total_point - a.total_point; } );
                            let highPoints=data.filter(item => item.total_point >= 150);
                            let lowPoints=data.filter(item => item.total_point < 150);
                            setLeagueList(highPoints);
                            setLowLeagueList(lowPoints);
                            // alert(lowleagueList.length);
                            // alert(leagueList.length)
                            console.log('detail', lowleagueList)

                            } else {
                                Toast.show('Data not founds!')
                            }
                        }
                        setLoading(false);

                    })
                    .catch((error) => {
                        setLoading(false);
                    });
            }
        })
    }


    const handleDelete = (item) => {
        Alert.alert(
            "Are you sure you want to delete this member",
            `Member name:-${item.name}`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "YES", onPress: () => deleteApi(item) }
            ],
            { cancelable: false }
        );
    }


    const deleteApi = async (item) => {
        const userMe = await AsyncStorage.getItem('@user')
        if (userMe) {
            setLoading(true);
            const { params } = props.route;
            const data = {
                league_id: params.leagueData.league_id,
                authToken: JSON.parse(userMe).authtoken,
                member_id: item.member_id,
                user_id: JSON.parse(userMe)._id
            };
            console.log("data", data);
            Network('league/delete_member', 'post', data)
                .then(async (res) => {
                    console.log(res);
                    if (res.success) {
                        // getApiCalling()
                        props.navigation.navigate("Team")
                        Toast.show("Member removed from this team");
                    } else {
                        Toast.show(res.message);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);

                });
        }
    }



    const handleTUniqueTeamCode = async () => {
        try {
            const result = await Share.share({
                title: 'Join my TeamUp team!',
                // message: `Join me on TeamUp! Get TeamUp :https://play.google.com/store/apps/details?id=com.teamup,\r\n My team code - ${UniqueCode}`,
               message: `I want you in my team!\r\n\r\nhttps://www.teamup-theapp.com/jointeam\r\n\r\nTeam code:${UniqueCode}\r\n\r\nLet's get moving!`,
            //   url: 'https://play.google.com/store/apps/details?id=com.teamup',
            url:'https://www.teamup-theapp.com/jointeam'
            });
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
            console.log(error.message);
        }
    }

    return (
        <>
            <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />

            <Loader loading={loading} />

            <ImageBackground
                source={require('./../../Assets/Images/Background.png')}
                style={styles.imageContainer}
                // resizeMode='stretch'
            >
                <Heading
                    title={leagueName}
                    leagueData={leagueData}
                    userId={userId}
                    onPressBack={() => props.navigation.navigate('Team')}
                    onPressEdit={() => props.navigation.navigate('EditTeam', { 'leagueData': leagueData })}
                />


                <View style={{ height: HEIGHT * 0.58, marginTop: 45, paddingHorizontal: 25 }}>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: WIDTH * 0.9, paddingBottom: 20 }}>
                        <View style={{ width: WIDTH * 0.72, paddingLeft: 20 }}>
                            <Text style={{ color: '#B1B0B7', fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE, textAlign: 'center' }}>This week’s standings</Text>
                        </View>

                        <TouchableOpacity style={{ right: 0 }} onPress={() => props.navigation.navigate('TeamMemberEdit', { 'leagueData': leagueData })}>
                            <Text style={{ color: COLORS.APPCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>Edit team</Text>
                        </TouchableOpacity>

                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {leagueList.length != 0 &&
                           <View>
                            <ListCell
                                leagueList={leagueList}
                                leagueData={leagueData}
                                userId={userId}
                                onPress={(value) => handleDelete(value)}
                            />
                            
                         </View>
                       }
                       {(leagueList.length != 0 || lowleagueList.length != 0 )&& 
                           <View style={{flexDirection:'row'}}>
                           <Text style={{color: '#B1B0B7',fontSize:16}}>- - - - - - - - -   </Text>
                           <Image source={require('../../Assets/acheivement.png')} style={{width:16,height:25}}/>
                           <Text style={{color:'#FF6B3C',textAlign:'center',fontSize:16,fontFamily:FONT.FAMILY.ROBOTO_Medium}}> 150 Points Achieved </Text>
                           <Text style={{color: '#B1B0B7',fontSize:16}}> - - - - - - - - - - - - - </Text>

                           </View>
                        }
                       {lowleagueList.length != 0 &&
                           <View>
                           {lowleagueList.map((item, index) => {
                        return (
            
            <View style={{ width: WIDTH * 0.87, flexDirection: 'row', marginVertical: 15, }}>

                <View style={{ width: WIDTH * 0.75, flexDirection: "row" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.cellText}>{index+leagueList.length+1 + ". "}</Text>
                        <View style={{ backgroundColor: '#C1C1C1', height: HEIGHT * 0.03, width: 0.8, marginLeft: 5, marginRight: 5 }} />
                    </View>
                    <Text style={[styles.cellText, { width: WIDTH * 0.54 }]} numberOfLines={1}>{item.name}{leagueData && (leagueData.league.creator_id == item.member_id) && <Text> {" (C)"}</Text>}</Text>
                </View>

                <View style={{ alignItems: 'center', width: WIDTH * 0.12, }}>
                    <Text style={[styles.PtsText, {color:'#272728'}]}>{ item.total_point}</Text>
                </View>
                {/* {props.leagueData && (props.leagueData.league.creator_id != item.member_id) &&
                    <AntDesign name="close" size={20} color={COLORS.HEADERCOLOR} onPress={()=> props.onPress(item)} />
                } */}
            </View>
        )})}
            
                        
                         </View>
                       }

                       {leagueList.length == 0 && lowleagueList.length==0 &&

                            <View style={{ backgroundColor: '#F9FAFB', height: HEIGHT * 0.6, width: WIDTH * 0.85, justifyContent: 'center', alignItems: 'center' }}>

                                <Text style={{ color: '#B1B0B7', fontSize: FONT.SIZE.EXTRALARGE, fontFamily: FONT.FAMILY.ROBOTO_Regular }}>No team members yet</Text>

                            </View>
                        }
                        
                    </ScrollView>
                </View>
                {leagueData && (leagueData.league.creator_id == userId) ?
                    <Button
                        buttonWidth={WIDTH * 0.85}
                        lable="Add team members"
                        topStyles={true}
                        onPress={() => {setModalVisibleShare(true);setToggle(true)}}
                    />
                    :
                    null
                }
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
                                    // alert(modalVisibleCongo)
                                    if(!toggle){
                                        setModalDoneShare(false)
                                        setModalVisibleCongo(true)
                                        }else{
                                        setModalDoneShare(false)
                                        }
                                // }
                                }} />

                            </View>


                            <Text style={styles.modalText}>Unique team code</Text>

                            <Text style={{ color: '#B1B0B7', width: WIDTH * 0.7, fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: HEIGHT * 0.03 }}>Invite friends to your team via the code or through the share button below</Text>


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
        <View style={[styles.modalView]}>
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


            {props.leagueData && (props.leagueData.league.creator_id == props.userId) ?

                <TouchableOpacity onPress={() => props.onPressEdit()} style={{ alignItems: 'flex-end', width: WIDTH * 0.1 }}>
                    <Image source={require('./../../Assets/Images/edit.png')} resizeMode='contain' style={{ width: 20, height: 20 }} />
                </TouchableOpacity>

                : null
            }

        </View>
    )
}


const ListCell = (props) => {
    return props.leagueList.map((item, index) => {
        return (
            
            <View style={{ width: WIDTH * 0.87, flexDirection: 'row', marginVertical: 15, }}>

                <View style={{ width: WIDTH * 0.75, flexDirection: "row" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.cellText}>{index + 1 + ". "}</Text>
                        <View style={{ backgroundColor: '#C1C1C1', height: HEIGHT * 0.03, width: 0.8, marginLeft: 5, marginRight: 5 }} />
                    </View>
                    <Text style={[styles.cellText, { width: WIDTH * 0.54 }]} numberOfLines={1}>{item.name}{props.leagueData && (props.leagueData.league.creator_id == item.member_id) && <Text> {" (C)"}</Text>}</Text>
                </View>

                <View style={{ alignItems: 'center', width: WIDTH * 0.12, }}>
                    <Text style={[styles.PtsText, {color:'#FF6B3C'}]}>{ item.total_point}</Text>
                </View>
                {/* {props.leagueData && (props.leagueData.league.creator_id != item.member_id) &&
                    <AntDesign name="close" size={20} color={COLORS.HEADERCOLOR} onPress={()=> props.onPress(item)} />
                } */}
            </View>
        )
    })
}

const ListLowCell = (props) => {
    return props.lowleagueList.map((item, index) => {
        return (
            
            <View style={{ width: WIDTH * 0.87, flexDirection: 'row', marginVertical: 15, }}>

                <View style={{ width: WIDTH * 0.75, flexDirection: "row" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.cellText}>{index + 1 + ". "}</Text>
                        <View style={{ backgroundColor: '#C1C1C1', height: HEIGHT * 0.03, width: 0.8, marginLeft: 5, marginRight: 5 }} />
                    </View>
                    <Text style={[styles.cellText, { width: WIDTH * 0.54 }]} numberOfLines={1}>{item.name}{props.leagueData && (props.leagueData.league.creator_id == item.member_id) && <Text> {" (C)"}</Text>}</Text>
                </View>

                <View style={{ alignItems: 'center', width: WIDTH * 0.12, }}>
                    <Text style={[styles.PtsText, {color:'#FF6B3C'}]}>{item.total_point}</Text>
                </View>
                {/* {props.leagueData && (props.leagueData.league.creator_id != item.member_id) &&
                    <AntDesign name="close" size={20} color={COLORS.HEADERCOLOR} onPress={()=> props.onPress(item)} />
                } */}
            </View>
        )
    })
}


const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
        width: WIDTH,
        backgroundColor: COLORS.BACKGROUNDCOLOR,
        alignItems: "center"
    },
    subContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
    },
    headingCont: {
        height: HEIGHT * 0.15,
        width: WIDTH * 0.75,
        alignItems: "center",
        justifyContent: "center"
    },
    headingText: {
        color: COLORS.LOGOCOLOR,
        fontSize: FONT.SIZE.EXTRALARGE,
        textAlign: "center",
        textTransform: 'uppercase',
        fontFamily: FONT.FAMILY.ROBOTO_Bold
    },
    headingSubText: {
        color: COLORS.LOGOCOLOR,
        fontSize: FONT.SIZE.LARGE,
        textAlign: "center",
        fontFamily: FONT.FAMILY.ROBOTO_Bold,
        paddingTop: 5
    },

    subCellstyle: {
        flexDirection: "row",
        paddingHorizontal: 15,
        justifyContent: "space-between"
    },
    cellcomponent: {
        width: 10,
        marginRight: 8,
        height: 10,
        borderRadius: 10 / 2,
        borderColor: "#6d6d6d",
        borderWidth: 1
    },
    cellText: {
        color: COLORS.LOGOCOLOR,
        fontSize: FONT.SIZE.MEDIUM,

    },
    PtsText: {
        textTransform: 'uppercase',
        color: COLORS.LOGOCOLOR,
        fontSize: FONT.SIZE.LARGE,
        paddingRight: 12
    },
    ptsImage: {
        width: 26,
        height: 26
    },

    imageContainer: {
        width: WIDTH,
        height: HEIGHT
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
        textAlign: "center",
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        fontSize: FONT.SIZE.LARGE
    }
})