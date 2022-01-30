import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, FlatList, ImageBackground, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import TextInput from "./../../Components/Common/InputText"
import Loader from "./../../Components/Common/Loader"
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import Button from "./../../Components/Common/button"
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from 'moment';
import Commondate from '../../Components/Common/Commondate';
import FlashMessage from "react-native-flash-message";
import { useRoute } from '@react-navigation/native';

const WEEKDATA = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Points(props) {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [pointsList, setPointsList] = useState([])
  const [totalPoint, setTotalPoints] = useState('')

  useEffect(() => {
    console.log("Commondate", Commondate);
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ paddingRight: 20, alignItems: "center" }} onPress={() => props.navigation.toggleDrawer()}>
          <Image source={require("./../../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      )
    });
    getPointsApi()

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("remote message----", remoteMessage)
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
      if (remoteMessage) {
        const joinTeam = remoteMessage.data.league_id
        console.log("remote message", remoteMessage)
        showMessage({
          message: remoteMessage.notification.title,
          description: remoteMessage.notification.body,
          type: "default",
          backgroundColor: "red",
          color: COLORS.APPCOLORS,
          duration: 2000
        });
        if (joinTeam) {
          props.navigation.navigate("Team")
        }
      }
    });

    return unsubscribe;
  }, [])

  // useEffect(()=>{
  //   const lognow = route.params;
  //   if(lognow != undefined){
  //     props.navigation.navigate("TabHome")
  //   }
  // }, [route])

  Date.prototype.getWeek = function () {
    var dt = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - dt) / 86400000) + dt.getDay() + 1) / 7);
  };


  const sendDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
  }


  const getPointsApi = async () => {
    props.navigation.addListener("focus", async () => {
      const userMe = await AsyncStorage.getItem('@user')
      var now = moment();
      var WeekStartDate = now.startOf('isoWeek');
      WeekStartDate = new Date(WeekStartDate.format('YYYY-MM-DD'))
      WeekStartDate.setHours(0,0,0,0)
      var WeekEndDate = new Date(WeekStartDate);
      WeekEndDate.setDate(WeekStartDate.getDate()+6);
      WeekEndDate.setHours(23,59,59,999)
      console.log("date fot all", WeekStartDate, WeekEndDate);
      let object = {
        date: sendDate(),
        weekStartDate: moment(WeekStartDate).format('YYYY-MM-DD'),
        weekEndDate: moment(WeekEndDate).format('YYYY-MM-DD'),
        authToken: JSON.parse(userMe).authtoken
      }
      console.log("main object", object);
      setLoading(true)
      Network('point/weekly_point', 'post', object)
        .then((res) => {
          console.log('point week points---->', res);
          if (res.success) {
            setLoading(false);
            setPointsList(res.response.docs)
            setTotalPoints(res.response.sum)
          } else {
            Toast.show("" + res.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          Toast.show("Something went wrong !");
        });
    })
  }

  const handlePressLoglist = (item) => {
    console.log("item with date", item);
    props.navigation.navigate("pointsList", { 'LogData': item })
  }


  return (
    <>
      <FlashMessage position="top" />
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <Loader loading={loading} />    
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.container}>

            <ImageBackground
              source={require('./../../Assets/Images/Test.png')}
              style={styles.imageContainer}
              resizeMode='cover'
            >
              <View style={styles.subContainer}>
                <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                  <Image source={require('./../../Assets/Images/Menu.png')} resizeMode='contain' style={{ width: 25, height: 25 }} />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                  <AnimatedCircularProgress
                    size={WIDTH * 0.47}
                    width={12}
                    backgroundWidth={30}
                    fill={totalPoint && (totalPoint / 1.5)}
                    tintColor={COLORS.APPCOLORS}
                    backgroundColor='#FFEDE8'
                  >
                    {
                      (fill) => (
                        <View style={styles.circularView}>
                          <Text style={styles.circularText}>
                            {totalPoint && totalPoint}<Text style={{ color: COLORS.APPCOLORS, fontSize: FONT.SIZE.SMALL }}>/150</Text>
                          </Text>
                          <Text style={styles.total}>TOTAL</Text>
                        </View>
                      )
                    }
                  </AnimatedCircularProgress>

                  <Text style={styles.pointtext}>Points needed by Sunday night: {totalPoint <= 150 ? (150 - totalPoint) : "0"}</Text>

                </View>
              </View>
            </ImageBackground>


            <View style={{ height: HEIGHT * 0.5 }}>
              <Text style={styles.subtext}>Select day to view/edit points</Text>

              <View style={styles.weekview}>
                {pointsList.length != 0 && pointsList.map((item, index) => {
                  return (
                    <TouchableOpacity activeOpacity={0.8} style={styles.weekSubview} onPress={() => handlePressLoglist(item)}>
                      <View style={styles.weekdaysview}>
                        <Text style={styles.weekdaytext}>{WEEKDATA[index]}</Text>
                      </View>

                      <View style={styles.pointsView}>
                        <Text style={styles.pointssubView}>{item.point == undefined ? '000' : item.point}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })
                }
              </View>

              {/* <Button
                buttonWidth="82%"
                lable="Log points"
                onPress={() => props.navigation.navigate('pointAdd')}
              /> */}
 <View style={{alignItems:"center"}}>
              <View
                style={{
                  width: WIDTH * 0.85,
                  height: HEIGHT * 0.15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems:"center"
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => props.navigation.navigate('pointAdd')}
                  style={{
                    backgroundColor: COLORS.APPCOLORS,
                    borderRadius: 10,
                    width: WIDTH * 0.4,
                    height: HEIGHT * 0.08,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.WHITE,
                      fontSize: FONT.SIZE.LARGE,
                      fontFamily: FONT.FAMILY.ROBOTO_Regular,
                    }}>
                   Log points
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => props.navigation.navigate('PointGraph')}
                  style={{
                    borderColor: COLORS.APPCOLORS,
                    borderWidth: 1,
                    borderRadius: 10,
                    width: WIDTH * 0.4,
                    height: HEIGHT * 0.08,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.APPCOLORS,
                      fontSize: FONT.SIZE.LARGE,
                      fontFamily: FONT.FAMILY.ROBOTO_Regular,
                    }}>
                    Points history
                  </Text>
                </TouchableOpacity>
              </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  )
}




const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    width: WIDTH,
    paddingBottom: 20
  },
  subContainer: {
    height: HEIGHT * 0.4, padding: 25
  },
  imageContainer: {
    width: WIDTH,
    height: HEIGHT * 0.46,
    top: 0,
    // backgroundColor: COLORS.APPCOLORS
  },
  circularView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: '100%',
    backgroundColor: '#fff'
  },
  pointssubView: { textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE, color: COLORS.APPCOLORS },
  pointsView: { alignItems: 'center', justifyContent: 'center', height: HEIGHT * 0.13 },
  weekdaytext: { color: '#B1B0B7', fontSize: FONT.SIZE.EXTRALARGE, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center' },
  weekdaysview: { borderRadius: WIDTH * 0.10 / 2, borderColor: COLORS.APPCOLORS, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, width: WIDTH * 0.1, height: WIDTH * 0.1 },
  weekSubview: { height: HEIGHT * 0.20, width: WIDTH * 0.1, marginRight: 10, borderWidth: 0.1, elevation: 2, borderRadius: 50, backgroundColor: COLORS.WHITE },
  weekview: { paddingHorizontal: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  circularText: { color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: 30, paddingLeft: 25 },
  total: { color: COLORS.TEXTCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE },
  pointtext: { color: COLORS.WHITE, fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, paddingTop: 15 },
  subtext: { color: '#B1B0B7', textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM, paddingVertical: 10 },
  headingCont: {
    height: HEIGHT * 0.15,
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
})