import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, ImageBackground ,ScrollView} from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import TextInput from "./../../Components/Common/InputText"
import Loader from "./../../Components/Common/Loader"
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from "./../../Components/Common/button"
import Toast from 'react-native-root-toast';
import Network from './../../Services/Network';


export default function LoginScreens(props) {
    const [loading, setLoading] = useState(false);


    const Validate = Yup.object().shape({
        username: Yup.string()
            .email('Not a valid email !')
            .required('Email is required !'),
    });


    const forgotSubmit = (value) => {

        setLoading(true)
        Network('user/forget_password_email', 'post', { email: value.username.toLowerCase() })
            .then(async (res) => {
                console.log("res fo--->", res);
                setLoading(false);
                if (res.success) {
                    setLoading(false);
                    props.navigation.navigate('ResetPassword', { reset: value.username.toLowerCase() })
                    Toast.show(res.message);
                } else {
                    Toast.show(res.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                Toast.show('error');
            });
    }


    return (
        <>
            <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
            <Loader loading={loading} />

            <ImageBackground
                source={require('./../../Assets/Images/Background.png')}
                style={styles.imageContainer}
                resizeMode='stretch'
            >
                <Heading onPress={()=> props.navigation.navigate('Login')}/>

                <Animatable.View animation="slideInDown" style={styles.subContainer}>
                    
                    <View style={styles.container}>
                    {/* <ScrollView style={{flexGrow:1}}> */}
                        <Formik
                            initialValues={{ username: '' }}
                            onSubmit={(values) => forgotSubmit(values)}
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

                                    {values.username.length != 0 && (
                                        <Text style={styles.placeholderText}>{'Email'}</Text>
                                    )}


                                    <TextInput
                                        placeholder="Email"
                                        placeholderTextColor={COLORS.GRAY}
                                        screenwidth="80%"
                                        value={values.username}
                                        autoCorrect={false}
                                        capitalize={true}
                                        onChangeText={handleChange('username')}
                                        onBlur={() => setFieldTouched('username')}
                                    />

                                    {touched.username && errors.username && (
                                        <Text style={styles.formError}>{errors.username}</Text>
                                    )}



                                    <Button
                                        buttonWidth="80%"
                                        lable="Forgot password"
                                        onPress={handleSubmit}
                                    />
                                      
                                    
                                </>
                            )}
                        </Formik>
                        {/* </ScrollView> */}
                    </View>
                   

                </Animatable.View>

            </ImageBackground>

            {/* <Animatable.View animation="slideInDown" style={styles.subContainer}>
                <View style={styles.container}>

                    <Logo />
                    <Formik
                        initialValues={{ username: '' }}
                        onSubmit={(values) => forgotSubmit(values)}
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

                                <TextInput
                                    placeholder="Username"
                                    placeholderTextColor={COLORS.LOGOCOLOR}
                                    screenwidth="80%"
                                    value={values.username}
                                    autoCorrect={false}
                                    capitalize={true}
                                    onChangeText={handleChange('username')}
                                    onBlur={() => setFieldTouched('username')}
                                />

                                {touched.username && errors.username && (
                                    <Text style={styles.formError}>{errors.username}</Text>
                                )}



                                <Button
                                    buttonWidth="80%"
                                    lable="forgot"
                                    onPress={handleSubmit}
                                />
                            </>
                        )}
                    </Formik>

                </View>
            </Animatable.View> */}
        </>
    )
}
const Heading = (props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', height: HEIGHT * 0.13 }}>
            <TouchableOpacity onPress={props.onPress} style={{ padding: 25, width: '3%' }}>
                <Image source={require('./../../Assets/Images/arrow_back.png')} resizeMode='contain' style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
            <Text style={{ color: COLORS.WHITE, width: '76%', fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center' }}>Forgot password</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT * 0.6,
        width: WIDTH,
        justifyContent: 'center',
        // backgroundColor: COLORS.BACKGROUNDCOLOR,
        // justifyContent: "center",
        // alignItems: "center"
    },
    placeholderText: {
        color: COLORS.SECONDARY,
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        textAlign: 'left',
        fontSize: FONT.SIZE.MEDIUM,
        paddingLeft: 50
    },
    imageContainer: {
        width: WIDTH,
        height: HEIGHT,
    },
    subContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
    },
    logo: {
        width: WIDTH * 0.45,
        height: HEIGHT * 0.2,
    },
    logoContainer: {
        width: WIDTH,
        height: HEIGHT * 0.4,
        justifyContent: "center",
        alignItems: "center"
    },
    formError: {
        color: COLORS.SECONDARY,
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        textAlign: 'center',
        fontSize: FONT.SIZE.SMALL,
    },
    remembercontainer: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 25
    },
    remText: {
        color: "#e9e9e9",
        fontFamily: FONT.FAMILY.ROBOTO_Regular,
        fontSize: FONT.SIZE.MEDIUM
    }
})