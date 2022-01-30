/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './App/Utils/Navigation'
import { Provider } from 'react-redux';
import reduxStore from './App/Redux/reduxConfig'
const store = reduxStore()
import { RootSiblingParent } from 'react-native-root-siblings';
import messaging from '@react-native-firebase/messaging';
import { fcmService } from './App/Components/Notification/FCMService';
import { localNotificationService } from './App/Components/Notification/LocalNotificationService';
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage,{ showMessage, hideMessage } from "react-native-flash-message";
import { Platform,LogBox } from 'react-native';
import { COLORS } from './App/Utils/constants';
import * as NotifyNavigator from './App/Utils/NotifyNavigator';
import {navigationRef} from './App/Utils/NotifyNavigator';
import {Text,TouchableOpacity} from "react-native";

const App = () => {
  const [type,setType]=useState('');
  const [pointId,setPointsId]=useState('')


  useEffect(() => {
    requestUserPermission()
    registerAppWithFCM()    
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
            //  duration: 25000,
            //  onPress: NotifyNavigator.navigate('PointGraph')

          });

         setType(remoteMessage.notification.type)
         setPointsId(remoteMessage.notification.point_id)
        } else {
          showMessage({
            message: remoteMessage.notification.title,
            description: remoteMessage.notification.body,
            type: "default",
            backgroundColor: COLORS.WHITE,
            color: COLORS.APPCOLORS,
            // duration: 25000,
            // onPress: NotifyNavigator.navigate('PointGraph')

          });
          setType(remoteMessage.notification.type);
          setPointsId(remoteMessage.notification.point_id)


        }
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) {
        const joinTeam = remoteMessage.data.league_id
        console.log("remote message", remoteMessage)
        showMessage({
          message: remoteMessage.notification.title,
          description: remoteMessage.notification.body,
          type: "default",
          backgroundColor: COLORS.WHITE,
          color: COLORS.APPCOLORS,
           duration: 25000,
          //  onPress: NotifyNavigator.navigate('PointGraph')
        });
        setType(remoteMessage.notification.type);
        setPointsId(remoteMessage.notification.point_id)


        // if (joinTeam) {
        //   props.navigation.navigate("Team")
        // }
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
          backgroundColor: COLORS.WHITE,
          color: COLORS.APPCOLORS,
          //  duration: 25000,
          //  onPress: NotifyNavigator.navigate('PointGraph')
        });
        setType(remoteMessage.notification.type)
        setPointsId(remoteMessage.notification.point_id)


        // if (joinTeam) {
        //   props.navigation.navigate("Team")
        // }
      }
    });


    return unsubscribe;


    // messaging().onMessage(async remoteMessage => {

    //   // alert(JSON.stringify(remoteMessage))
    
    //    showMessage({
    //    message:remoteMessage.notification.title,
    //    description:remoteMessage.notification.body,
    //    type: "info"
    //   });   
  
 
    // });
  }, [])


  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  const requestUserPermission = async () => {    
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    const token = await messaging().getToken()
    await AsyncStorage.setItem("fcmtoken",token)
    console.log('token---->', token);
  }


  return (
    <RootSiblingParent>
    
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
        {/* <TouchableOpacity
        onPress={()=>
          NotifyNavigator.navigate('PointGraph')
         }
         style={{height:50}}>
      <Text>HHHH</Text>
      </TouchableOpacity> */}
          <Navigation />
          <FlashMessage position="top"
          autoHide={false}
          onPress={()=>
           type==='Added comment'
            && NotifyNavigator.navigate('Comment',{point_id:pointId})
           }
      />
     
        </NavigationContainer>
       
      </Provider>
    </RootSiblingParent>
  );
};

LogBox.ignoreAllLogs();

export default App;