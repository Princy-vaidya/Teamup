import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, ImageBackground, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import TextInput from "./../../Components/Common/InputText"
import Loader from "./../../Components/Common/Loader"
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from "./../../Components/Common/button"
import Network from './../../Services/Network';
import AsyncStorage from '@react-native-community/async-storage';
import { loginUser, setLocation } from '../../Redux/Actions/authAction';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-root-toast';
import Md5 from 'md5';
import messaging from '@react-native-firebase/messaging';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


export default function LoginScreens(props) {
    const [loading, setLoading] = useState(false);
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const dispatch = useDispatch()



    useEffect(() => {
    }, [])


    const loginSubmit = async(values) => {
        setLoading(true);
        console.log(await AsyncStorage.getItem("fcmtoken"))
        const emailAdd = values.username.toLowerCase()
        const data = {
            email: emailAdd.replace(/ /g, ''),
            md_password: Md5(values.password),
            devicetoken: await AsyncStorage.getItem("fcmtoken"),
            apptype: Platform.OS == 'ios' ? 'IOS' : 'ANDROID'
        };
    console.log("i love jayantu----------",data)

        Network('user/user_login', 'post', data)
            .then(async (res) => {
                setLoading(false);
                if (res.success) {
                    console.log('hhh',res)
                    setLoading(false);
                    if (res.data.user_details._id) {
                        dispatch(loginUser(res.data.user_details));
                    } else {
                        Toast.show('Something went wrong !');
                    }
                    await AsyncStorage.setItem(
                        '@user',
                        JSON.stringify(res.data.user_details),
                    );
                    props.navigation.replace('Splash')
                } else {
                    Toast.show('Wrong email or password !');
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const Validate = Yup.object().shape({
        username: Yup.string().trim()
            .email('Not a valid email')
            .required('Email is required!'),
        password: Yup.string().required('Password is required!'),
    });



    return (
        <>
            <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
            <Loader loading={loading} />


            <ImageBackground
                source={require('./../../Assets/Images/Background.png')}
                style={styles.container}
                resizeMode='stretch'
            >
                    <Logo />

                    <View style={styles.subView}>
                    <ScrollView keyboardShouldPersistTaps='always'>
        <Loader loading={loading} />
        <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}
        extraScrollHeight={50}
        >
       
          <Animatable.View animation="fadeInDown" style={styles.subContainer}>
                                <View style={styles.signUp}>
                                    <Text style={styles.signupText}>Not a member yet? <Text onPress={() => props.navigation.navigate("Signup")} style={{ color: COLORS.APPCOLORS }}>Sign up</Text></Text>
                                </View>

                                <Formik
                                    initialValues={{ username: '', password: "" }}
                                    onSubmit={(values) => loginSubmit(values)}
                                    validationSchema={Validate}>
                                    {({
                                        values,
                                        handleChange,
                                        errors,
                                        handleSubmit,
                                        setFieldTouched,
                                        touched,
                                    }) => (
                                        <>
                                            <View style={{ paddingVertical: 20 }}>
                                                {values.username.length != 0 && (
                                                    <Text style={styles.placeholderText}>{'Email'}</Text>
                                                )}


                                                <TextInput
                                                    placeholder="Email"
                                                    placeholderTextColor={COLORS.GRAY}
                                                    screenwidth={'85%'}
                                                    capitalize={true}
                                                    value={values.username}
                                                    onChangeText={handleChange('username')}
                                                    onBlur={() => setFieldTouched('username')}
                                                />


                                                {touched.username && errors.username && (
                                                    <Text style={styles.formError}>{errors.username}</Text>
                                                )}

                                                {values.password.length != 0 && (
                                                    <Text style={styles.placeholderText}>{'Password'}</Text>
                                                )}

                                                <TextInput
                                                    placeholder="Password"
                                                    placeholderTextColor={COLORS.GRAY}
                                                    screenwidth={'85%'}
                                                    value={values.password}
                                                    onChangeText={handleChange('password')}
                                                    onBlur={() => setFieldTouched('password')}
                                                    secureTextEntry={true}
                                                />

                                                {touched.password && errors.password && (
                                                    <Text style={styles.formError}>{errors.password}</Text>
                                                )}

                                                <RememberMe
                                                    value={toggleCheckBox}
                                                    onValueChange={(value) => setToggleCheckBox(value)}
                                                    handleOnPress={() => props.navigation.navigate("ForgotPass")}
                                                />

                                                <Button
                                                    buttonWidth="80%"
                                                    lable="Login"
                                                    onPress={handleSubmit}
                                                />

                                            </View>
                                        </>
                                    )}
                                </Formik>
                                </Animatable.View>
              </KeyboardAwareScrollView>      
               </ScrollView>

                    </View>
                
            </ImageBackground>

        </>
    )
}


const RememberMe = (props) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%" }}>
  
        <View style={styles.remembercontainer}>
  
          <CheckBox
            disabled={false}
            value={props.value}
            boxType="square"
            style={{ marginHorizontal: 10, color: "#fff" }}
            tintColors={{ true: COLORS.SECONDARY, false: COLORS.SECONDARY }}
            offAnimationType="flat"
            checkboxSize={10}
            CheckboxIconSize={10}
            onValueChange={(newValue) => props.onValueChange(newValue)}
          />
  
          <Text style={[styles.remText, { color: COLORS.TEXTCOLORS }]}>Remember me</Text>
        </View>
  
        <TouchableOpacity onPress={props.handleOnPress}>
          <Text style={styles.remText}>Forgot password</Text>
        </TouchableOpacity>
      </View>
    )
  }

const Logo = () => {
    return (
        <View style={styles.logoContainer}>
            <Image
                resizeMode="contain"
                source={require('../../Assets/Images/Logo.png')}
                style={styles.logo}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        height: HEIGHT,
        width: WIDTH,
    
    },
    subContainer: {
      alignItems: 'center',
      alignSelf: 'center',
      width: '100%',
      // marginVertical: '15%',
      // width: '100%',
      // marginBottom: HEIGHT * 0.25
     
    },
    logo: {
        width: WIDTH * 0.26,
        height: HEIGHT * 0.08,
    },
    logoContainer: {
        width: WIDTH,
        height: HEIGHT * 0.14,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: 'red'
    },
    formError: {
        color: COLORS.SECONDARY,
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        textAlign: 'center',
        fontSize: FONT.SIZE.SMALL,
    },
    placeholderText: {
        color: COLORS.SECONDARY,
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        textAlign: 'left',
        fontSize: FONT.SIZE.MEDIUM,
        paddingLeft: 35
    },
    remembercontainer: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 25,
    },
    remText: {
        color: COLORS.APPCOLORS,
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        fontSize: FONT.SIZE.MEDIUM
    },
    subView: {
        height: HEIGHT * 0.8,
        width: WIDTH,
    },
    signUp: {
        height: HEIGHT * 0.14,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    signupText: {
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        fontSize: FONT.SIZE.LARGE,
        textAlign: 'center',
        color: COLORS.TEXTCOLORS
    },
})