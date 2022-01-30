import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';


const dataValues = [
    // {
    //   "title": "Calories",
    //   "type": "com.google.calories.expended"
    // },
    {
        "title": "Heart",
        "type": "com.google.heart_minutes"
    },
    {
        "title": "Move",
        "type": "com.google.active_minutes"
    },
    {
        "title": "Steps",
        "type": "com.google.step_count.delta"
    },
];




export default function GoogleFitPoints(props) {
    const [data, setData] = useState([])
    const [sessionData, setSession] = useState([])


    useEffect(() => {

        getGoogleFitData()
        requestCameraPermission()
    }, [])



    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Mobile location access",
                    message:
                        "GPS location access to your mobile ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getGoogleFitData = async () => {
        var googleData = await AsyncStorage.getItem('@GoogleFit');
        let authState = JSON.parse(googleData)

        console.log("googleData---->", authState);

        // const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';

        const url = 'https://www.googleapis.com/fitness/v1/users/me/dataSources';
        const today = new Date().getTime();

        const body = {
            "aggregateBy": [{
                "dataTypeName": "com.google.activity.segment",
                "dataSourceId": "derived:com.google.heart_rate.bpm:com.google.android.gms:estimated_steps"
            }],
            "bucketByTime": { "durationMillis": 86400000 }, // This is 24 hours
            "startTimeMillis": today, //start time
            "endTimeMillis": 54 // End Time
        }
        console.log('body----->', body);

        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState.accessToken}`,
        }



        console.log('header--->', header)

        const req = await fetch(url, {
            method: 'get',
            headers: header,
            // 'payload' : JSON.stringify(request, null, 2)
            // body: JSON.stringify(body, null, 2)
        });

        const resp = await req.json();


        setData(resp)
        const header1 = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState.accessToken}`,
        }

        const url1 = 'https://www.googleapis.com/fitness/v1/users/me/sessions';
        const reqSession = await fetch(url1, {
            method: 'get',
            headers: header1,
            // body: JSON.stringify(body, null, 2)
        });
        const respSession = await reqSession.json();
        setSession(respSession)
        console.log('resp----->', respSession)

    }

    return (
        <View style={styles.container}>
            { console.log("data===>", data)}

            <ScrollView showsVerticalScrollIndicator={true}>
                <View style={{ width: WIDTH * 0.8, height: HEIGHT * 0.99 }}>
                    {data && data.dataSource && data.dataSource.map((item) => {
                        return (
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.EXTRALARGE }}>{item.dataStreamName}</Text>
                                <Text style={{ fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }}>{item.dataType.name}</Text>
                            </View>
                        )
                    })}

                    <Text style={{ fontSize: 24, paddingTop: 30, paddingBottom: 20, fontFamily: FONT.FAMILY.ROBOTO_Regular, color: COLORS.SECONDARY }}>Session type</Text>

                    {sessionData && sessionData.session && sessionData.session.map((item) => {
                        return (
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.EXTRALARGE }}>{item.name}</Text>
                                {/* <Text style={{ fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }}>{item.dataType.name}</Text> */}
                            </View>
                        )
                    })}


                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        // height: HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    }
})