import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, HEIGHT, WIDTH } from '../Utils/constants';
import { loginUser, setLocation } from '../Redux/Actions/authAction'
import { useSelector, useDispatch } from 'react-redux'


// const HAS_LAUNCHED = 'hasLaunched';

export default function Splash({ navigation }) {
  const dispatch = useDispatch()
  const [firstLaunch, setFirstLaunch] = useState(null)



  useEffect(() => {
    setTimeout(() => {
       checkMethod();
      // checkLogin()
      // navigation.replace('intro')
    }, 1000)
  }, [])

  

  /**************************Check****************************/

  const checkMethod = async () => {
    const HAS_LAUNCHED = await AsyncStorage.getItem('@alreadyLaunched')
    console.log('HAS_LAUNCHED--->', HAS_LAUNCHED);
    if (HAS_LAUNCHED == null) {
      navigation.replace('intro')
      await AsyncStorage.setItem('@alreadyLaunched', 'true')
    } else {
      checkLogin()
    }
  }

  /***********************************************************/

  const checkLogin = async () => {
    const isSignin = await AsyncStorage.getItem('@user')
    if (!isSignin) {
      navigation.replace('Login')
    } else {
      await dispatch(loginUser(JSON.parse(isSignin)))
      navigation.replace('Home')
    }
  }


  return (
    <>
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <View style={styles.container}>
        <Image source={require('./../Assets/Images/Logo.png')} resizeMode="contain" style={{ height: WIDTH * 0.4, width: WIDTH * 0.4 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.APPCOLORS
  }
})