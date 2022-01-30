import React, { useState, useEffect } from 'react';
import { View, StatusBar, Share, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import TextInputComponent from "./../../Components/Common/InputText"
import Loader from "./../../Components/Common/Loader"
import Button from "./../../Components/Common/button"
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import Network from './../../Services/Network';

export default function LeagueScreens(props) {
    const [loading, setLoading] = useState(true);
    const [leagueName, setLeagueName] = useState('')
    const [userList, setUserList] = useState([])


    useEffect(() => {
        getApiCalling()
    }, [])


    const getApiCalling = async () => {
        const userMe = await AsyncStorage.getItem('@user')
        if (userMe) {
            setLoading(true);
            const data = {
                search_key: '',
                authToken: JSON.parse(userMe).authtoken
            };
            Network('user/user_search', 'post', data)
                .then(async (res) => {
                    if (res.success) {
                        if (res.data.docs.user_list.length != 0) {
                            setUserList(res.data.docs.user_list)
                        } else {
                            Toast.show('Data not founds!')
                        }
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    Toast.show('error');
                });
        }
    }





    const handleSubmit = async () => {
        if (leagueName.length == 0) {
            Toast.show('Please enter the team name.');
        } else {

            const userMe = await AsyncStorage.getItem('@user')
            if (userMe) {
                setLoading(true);
                const data = {
                    league_name: leagueName,
                    authToken: JSON.parse(userMe).authtoken
                };
                Network('league/league_add_edit', 'post', data)
                    .then(async (res) => {
                        setLoading(false);
                        console.log("Team create--->", res);
                        if (res.success) {
                            props.navigation.navigate('TeamsProfile')
                        } else {
                            Toast.show(res.message);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        Toast.show('error');
                    });
            }
        }
    }

    const handleSms = async () => {
        try {
            const result = await Share.share({
                title: 'App link',
                message: 'This web link:- https://www.200clubfitness.com',
            });
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

    const handleWhatsUp = async () => {
        try {
            const result = await Share.share({
                message:
                    'This web link:- https://www.200clubfitness.com',
            });
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
                <Heading onPress={() => props.navigation.navigate('Team')} />
                <ScrollView>
                <KeyboardAvoidingView
                    style={styles.container}
                    keyboardVerticalOffset={Platform.OS == 'ios' ? HEIGHT * 0.16 : HEIGHT * 0.02}
                    behavior="padding">
                          <View style={{ height: HEIGHT}}>
                

                        <>
                            <View style={{ height: HEIGHT * 0.2, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ color: '#B1B0B7', width: WIDTH * 0.6, fontSize: FONT.SIZE.MEDIUM, textAlign: "center", fontFamily: FONT.FAMILY.ROBOTO_Regular }}>Your team name will be displayed for
                         all team members</Text>
                            </View>

                            {leagueName.length != 0 && (
                                <Text style={styles.placeholderText}>{'Team name'}</Text>
                            )}
                           
                           <View style={{marginTop:-20,marginBottom:-10}}>
                            <TextInputComponent
                                placeholder="Team name"
                                placeholderTextColor={COLORS.GRAY}
                                screenwidth="80%"
                                type="name"
                                onChangeText={(val) => setLeagueName(val)}
                            />
</View>

                            <Button
                                buttonWidth="80%"
                                lable="Next"
                                onPress={() => handleSubmit()}
                            />


                            
                        </>
                    </View>
                </KeyboardAvoidingView>
                </ScrollView>

            </ImageBackground>
        </>
    )
}

const Heading = (props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', height: HEIGHT * 0.13 }}>
            <TouchableOpacity onPress={props.onPress} style={{ padding: 25, width: '3%' }}>
                <Image source={require('./../../Assets/Images/arrow_back.png')} resizeMode='contain' style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
            <Text style={{ color: COLORS.WHITE, width: '75%', fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center' }}>Name Team</Text>
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
        alignSelf: 'center',
        width: '100%',
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
})