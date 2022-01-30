import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, FONT, HEIGHT, WIDTH } from '../../Utils/constants';
import { loginUser } from '../../Redux/Actions/authAction'
import { useSelector, useDispatch } from 'react-redux'
import AppIntroSlider from 'react-native-app-intro-slider';
// import { TouchableOpacity } from 'react-native-gesture-handler';


const slides = [
    {
        key: 1,
        title: 'Get social - motivation and inspire other to move more',
        text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
        image: require('./../../Assets/Images/Slide-2.png'),
        // backgroundColor: '#22bcb5',
    },
    {
        key: 2,
        title: 'Hit 150 points!',
        text: 'Description.\nSay something cool',
        image: require('./../../Assets/Images/Slide.png'),
        backgroundColor: '#59b2ab',
    },
    {
        key: 3,
        title: 'TeamUp with friends, family and wokmates !',
        text: 'Other cool stuff',
        image: require('./../../Assets/Images/Slide-1.png'),
        // backgroundColor: '#febe29',
    },
    
    // {
    //     key: 4,
    //     title: 'Library',
    //     text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    //     image: require('./../../Assets/Images/Slide-3.png'),
    //     // backgroundColor: '#22bcb5',
    // }
]


export default function Splash({ navigation }) {
    const dispatch = useDispatch()

    useEffect(() => {
        setTimeout(() => {
            //   checkLogin()
        }, 1000)
    }, [])

    const checkLogin = async () => {
        const isSignin = await AsyncStorage.getItem('@user')
        if (!isSignin) {
            navigation.replace('Login')
        } else {
            await dispatch(loginUser(JSON.parse(isSignin)))
            navigation.replace('Home')
        }
    }

    const _onDone = () => {
        // alert("Hello")
        checkLogin()
    }

    /*******************************Slide render********************************** */

    const _renderItem = ({ item, index }) => {
        console.log('item------>', item);
        return (
            <ImageBackground style={styles.slide}
                source={slides[index].image}
            >

                <View style={{ top: HEIGHT * 0.53, justifyContent: 'center' }}>

                    <Text style={{ color: COLORS.APPCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center',width:'90%',alignSelf:'center',marginTop:30}}>{item.title}</Text>


                    <View style={{ padding: 30, alignItems: 'center' }}>
                        {index == 1 &&
                            <>
                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Medium }}>Your target is 150 points a week</Text>


                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Medium }}>One minute of exrcise = 1 point</Text>


                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Medium ,marginTop:20}}>Fresh start every Monday!</Text>


                                {/* <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.LARGE, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular }}>equals a point, earn 150 points<Text style={{ color: COLORS.APPCOLORS }}>{' when, '}</Text></Text> */}



                                {/* <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.LARGE, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular }}>

                                    <Text style={{ color: COLORS.APPCOLORS }}>{'where,'}<Text style={{ color: COLORS.TEXTCOLORS }}>{' and '}</Text><Text style={{ color: COLORS.APPCOLORS }}>how<Text> you like.</Text></Text></Text>
                                </Text> */}

                            </>


                        }
                        {
                            index == 2 &&

                            <>
                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Bold }}>
                                    {'You acheive more when you do it with others.'}
                                </Text>

                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Bold  }}>
                                    {'Create team with friends and family to help '}
                                </Text>

                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Bold  }}>
                                    {'support and motivate each other to hit your.'}
                                </Text>

                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Bold  }}>
                                    {'point every week.'}
                                </Text>

                                {/* <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular }}>
                                    {'friends and family to success '}
                                </Text> */}
                            </>
                        }


                        {
                            index == 0 &&

                            <>
                                 <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Bold }}>
                                    {'Seeing friend and family achieve will motivate'}
                                </Text>

                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Bold }}>
                                    {'you to go out and earn more pointe'}
                                </Text>

                            </>
                        }


{
                            index == 3 &&

                            <>
                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Bold }}>
                                    {'Seeing friend and family achieve will motivate'}
                                </Text>

                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Bold }}>
                                    {'you to go out and earn more pointe'}
                                </Text>

                                {/* <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.LARGE, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular }}>
                                    {'keep you motivated. We have parented with'}
                                </Text>

                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.LARGE, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular }}>
                                    {'amazing health and fitness specialists to '}
                                </Text>

                                <Text style={{ color: COLORS.TEXTCOLORS, paddingTop: 5, fontSize: FONT.SIZE.LARGE, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular }}>
                                    {'bring you incredible content'}
                                </Text> */}

                            </>
                        }

                    </View>

                </View>
            </ImageBackground>
        );
    }

    /*********************************Next Button************************************/

    const _renderNextButton = () => {
        return (
            <View style={{ backgroundColor: COLORS.APPCOLORS, left: -20, width: WIDTH * 0.12, height: WIDTH * 0.12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>

                <Image source={require('./../../Assets/Images/Arrow.png')} style={{ width: 20, height: 20 }} />

            </View>
        )
    }

    /******************************Done button*****************************************/

    const _renderDoneButton = () => {
        return (
            <View style={{ backgroundColor: COLORS.APPCOLORS, left: -20, width: WIDTH * 0.12, height: WIDTH * 0.12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>

                <Image source={require('./../../Assets/Images/Arrow.png')} style={{ width: 20, height: 20 }} />

            </View>
        )
    }

    /*********************************************************************************** */

    return (
        <>
            <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
            <View style={styles.container}>
                <AppIntroSlider
                    renderItem={_renderItem}
                    data={slides}
                    onDone={_onDone}
                    activeDotStyle={styles.activeDotStyle}
                    renderNextButton={_renderNextButton}
                    renderDoneButton={_renderDoneButton}
                />
            </View>
        </>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    slide: {
        height: HEIGHT,
        width: WIDTH,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    activeDotStyle: {
        backgroundColor: COLORS.APPCOLORS
    }
})