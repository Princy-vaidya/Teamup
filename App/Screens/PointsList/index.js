import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import Loader from "./../../Components/Common/Loader"
import * as Animatable from 'react-native-animatable';
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage from "react-native-flash-message";
import messaging from '@react-native-firebase/messaging';
import { showMessage, hideMessage } from "react-native-flash-message";



export default function Points(props) {
  const [loading, setLoading] = useState(false);
  const [pointsDate, setPointsDate] = useState('')
  const [pointList, setPointsList] = useState(null)


  useEffect(() => {
    getPointsApi()
    const { params } = props.route;
    setPointsDate(params.LogData)
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        let notification = null
        if (Platform.OS === 'ios') {
          showMessage({
            message: remoteMessage.notification.title,
            description: remoteMessage.notification.body,
            type: "default",
            backgroundColor: COLORS.WHITE,
            color: COLORS.APPCOLORS,
            duration: 2000
          });
        } else {
          showMessage({
            message: remoteMessage.notification.title,
            description: remoteMessage.notification.body,
            type: "default",
            backgroundColor: COLORS.WHITE,
            color: COLORS.APPCOLORS,
            duration: 2000,
          });
        }
      }
    });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      showMessage({
        message: remoteMessage.notification.title,
        description: remoteMessage.notification.body,
        type: "default",
        backgroundColor: COLORS.WHITE,
        color: COLORS.APPCOLORS,
        duration: 2000
      });
    });

    return unsubscribe;
  }, [])


  Date.prototype.getWeek = function () {
    var dt = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - dt) / 86400000) + dt.getDay() + 1) / 7);
  };


  const sendDate = (val) => {
    var today = new Date(val);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
  }


  const getPointsApi = async () => {
    const userMe = await AsyncStorage.getItem('@user')
    if (userMe) {
      let object = {
        authToken: JSON.parse(userMe).authtoken
      }
      const { params } = props.route;
      setLoading(true)
      Network('point/list-points-by-date?user_id=' + JSON.parse(userMe)._id + "&date=" + sendDate(params.LogData.date), 'get', object)
        .then((res) => {
          console.log("res points list------>", res);
          if (res.success) {
            setLoading(false);
            setPointsList(res.response_data)
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
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <Loader loading={loading} />
      <FlashMessage position="top" />

      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.imageContainer}
        resizeMode='stretch'
      >
        <Heading onPress={() => props.navigation.navigate('PointsTab')} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignSelf: "center", marginTop: 35, backgroundColor: '#F9FAFB' }}>
            {
              pointList && pointList.length != 0 ?
                <>
                  {
                    pointList.map((item) => {
                      return (
                        <View style={styles.points}>
                          <View style={styles.pointsContainer}>
                            <Text style={styles.pointsText}>{item.others_activity == null ? item.activity.name : item.others_activity}</Text>
                            <Text style={styles.pointsDate}>{item.point + ' points!'}</Text>
                          </View>

                          <View style={styles.editcontainer}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate("pointsEdit", { 'PointsData': item })}>
                              <Image source={require("./../../Assets/Images/editPoint.png")} style={styles.ptsImage} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    })
                  }
                </>
                :
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: COLORS.BOARDERCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: FONT.SIZE.EXTRALARGE }}>No data found!</Text>
                </View>
            }
          </View>
        </ScrollView>
      </ImageBackground>

    </>
  )
}

const Heading = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: HEIGHT * 0.13 }}>
      <TouchableOpacity onPress={props.onPress} style={{ width: '18%', alignItems: 'center' }}>
        <Image source={require('./../../Assets/Images/arrow_back.png')} resizeMode='contain' style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
      <Text style={{ color: COLORS.WHITE, width: '64%', fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center' }}>Points list</Text>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: COLORS.BACKGROUNDCOLOR,
  },
  subContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  imageContainer: {
    width: WIDTH,
    height: HEIGHT,
  },
  headingCont: {
    height: HEIGHT * 0.15,
    alignItems: "center",
    justifyContent: "center"
  },
  headingText: {
    color: COLORS.BOARDERCOLOR,
    fontSize: FONT.SIZE.EXTRALARGE,
    textAlign: "center",
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.ROBOTO_Bold
  },
  ptsImage: {
    width: 20,
    height: 20
  },
  editcontainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  points: { margin: 10, flexDirection: 'row', backgroundColor: '#fff', elevation: 2, height: HEIGHT * 0.12, width: WIDTH * 0.83, borderRadius: 5 },
  pointsContainer: { width: WIDTH * 0.7, height: HEIGHT * 0.12, paddingHorizontal: 15, justifyContent: 'center' },
  pointsText: { color: COLORS.TEXTCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.EXTRALARGE },
  pointsDate: { color: COLORS.APPCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM, paddingTop: 5 }
})