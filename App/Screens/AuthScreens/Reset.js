import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground,KeyboardAvoidingView } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import TextInputComponents from "./../../Components/Common/InputText"
import Loader from "./../../Components/Common/Loader"
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from "./../../Components/Common/button"
import Toast from 'react-native-root-toast';
import Network from './../../Services/Network';
import Md5 from 'md5';

export default function ResetScreens(props) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')

    useEffect(() => {
        const { params } = props.route;
        setEmail(params.reset)
    }, [])

    const Validate = Yup.object().shape({
        otp: Yup.string()
            .required('Otp is required !'),
        password: Yup.string().required('Password is required !'),
        confirmpassword: Yup.string()
            .required('Confirm password is required !')
            .oneOf(
                [Yup.ref('password'), null],
                'Passwords must match',
            ),
    });


    const forgotSubmit = (value) => {

        let objectData = {
            email: email.toLowerCase(),
            md_otp: Md5(value.otp),
            otp: value.otp,
            md_password: Md5(value.password)
        }

        console.log("objectData====>", objectData)

        Network('user/reset_password', 'post', objectData)
            .then(async (res) => {
                console.log("res fo--->", res);
                setLoading(false);
                if (res.success) {
                    setLoading(false);
                    props.navigation.navigate('Login')
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
                    <KeyboardAvoidingView
                       style={styles.container}
                       keyboardVerticalOffset={HEIGHT * 0.16}
                       behavior="padding"
                    >
                    <ScrollView>
                        <View style={styles.container}>

                            <Formik
                                initialValues={{ email: email }}
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

                                        <TextInputComponents
                                            placeholder="USERNAME"
                                            placeholderTextColor={COLORS.GRAY}
                                            screenwidth="80%"
                                            value={email}
                                            editable={false}
                                        />


                                        <TextInputComponents
                                            placeholder="Enter pin code"
                                            placeholderTextColor={COLORS.GRAY}
                                            screenwidth="80%"
                                            value={values.otp}
                                            keyboardType={'phone-pad'}
                                            onChangeText={handleChange('otp')}
                                            onBlur={() => setFieldTouched('otp')}
                                        />

                                        {touched.otp && errors.otp && (
                                            <Text style={styles.formError}>{errors.otp}</Text>
                                        )}

                                        <TextInputComponents
                                            placeholder="New Password"
                                            placeholderTextColor={COLORS.GRAY}
                                            screenwidth="80%"
                                            capitalize={true}
                                            value={values.password}
                                            onChangeText={handleChange('password')}
                                            secureTextEntry={true}
                                            onBlur={() => setFieldTouched('password')}
                                        />

                                        {touched.password && errors.password && (
                                            <Text style={styles.formError}>{errors.password}</Text>
                                        )}


                                        <TextInputComponents
                                            placeholder="Confirm Password"
                                            placeholderTextColor={COLORS.GRAY}
                                            screenwidth="80%"
                                            value={values.confirmpassword}
                                            secureTextEntry={true}
                                            onChangeText={handleChange('confirmpassword')}
                                            onBlur={() => setFieldTouched('confirmpassword')}
                                        />

                                        {touched.confirmpassword && errors.confirmpassword && (
                                            <Text style={styles.formError}>{errors.confirmpassword}</Text>
                                        )}



                                        <Button
                                            buttonWidth="80%"
                                            lable="Reset password"
                                            onPress={handleSubmit}
                                        />
                                    </>
                                )}
                            </Formik>

                        </View>
                    </ScrollView>
                    </KeyboardAvoidingView>
                </Animatable.View>

            </ImageBackground>

            {/* <Animatable.View animation="slideInDown" style={styles.subContainer}>
                <ScrollView>
                    <View style={styles.container}>

                        <Logo />
                        <Formik
                            initialValues={{ email: email }}
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

                                    <TextInputComponents
                                        placeholder="USERNAME"
                                        placeholderTextColor={COLORS.LOGOCOLOR}
                                        screenwidth="80%"
                                        value={email}
                                        editable={false}
                                    />


                                    <TextInputComponents
                                        placeholder="Enter otp"
                                        placeholderTextColor={COLORS.LOGOCOLOR}
                                        screenwidth="80%"
                                        value={values.otp}
                                        keyboardType={'phone-pad'}
                                        onChangeText={handleChange('otp')}
                                        onBlur={() => setFieldTouched('otp')}
                                    />

                                    {touched.otp && errors.otp && (
                                        <Text style={styles.formError}>{errors.otp}</Text>
                                    )}


                                    <TextInputComponents
                                        placeholder="New Password"
                                        placeholderTextColor={COLORS.LOGOCOLOR}
                                        screenwidth="80%"
                                        capitalize={true}
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        secureTextEntry={true}
                                        onBlur={() => setFieldTouched('password')}
                                    />

                                    {touched.password && errors.password && (
                                        <Text style={styles.formError}>{errors.password}</Text>
                                    )}


                                    <TextInputComponents
                                        placeholder="Confirm Password"
                                        placeholderTextColor={COLORS.LOGOCOLOR}
                                        screenwidth="80%"
                                        value={values.confirmpassword}
                                        secureTextEntry={true}
                                        onChangeText={handleChange('confirmpassword')}
                                        onBlur={() => setFieldTouched('confirmpassword')}
                                    />

                                    {touched.confirmpassword && errors.confirmpassword && (
                                        <Text style={styles.formError}>{errors.confirmpassword}</Text>
                                    )}



                                    <Button
                                        buttonWidth="80%"
                                        lable="save"
                                        onPress={handleSubmit}
                                    />
                                </>
                            )}
                        </Formik>

                    </View>
                </ScrollView>
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
            <Text style={{ color: COLORS.WHITE, width: '79%', fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center' }}>Reset password</Text>
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        height: HEIGHT * 0.8,
        width: WIDTH,
        justifyContent: 'center'
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