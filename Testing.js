import React, { useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Image,
    View,
    Text,
    Animated,
} from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH, IAMGE_URL } from './App/Utils/constants';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const HEADER_MAX_HEIGHT = 285;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const DATA = Array(10)
    .fill(null)
    .map((_, idx) => ({
        id: idx,
        avatar: 'https://images.ctfassets.net/hrltx12pl8hq/3MbF54EhWUhsXunc5Keueb/60774fbbff86e6bf6776f1e17a8016b4/04-nature_721703848.jpg?fit=fill&w=480&h=270',
        fullName: `vivek`,
    }));

function App() {
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE],
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });
    const imageTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0.9],
        extrapolate: 'clamp',
    });
    const titleTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, -8],
        extrapolate: 'clamp',
    });

    const renderListItem = (item) => (
        <View key={item.id} style={styles.card}>
            <Image style={styles.avatar} source={{ uri: item.avatar }} />
            <Text style={styles.fullNameText}>{item.fullName}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.saveArea}>
            <Animated.ScrollView
                contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT - 32 }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true },
                )}>



                {DATA.map(renderListItem)}




            </Animated.ScrollView>
            <Animated.View
                style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
                <Animated.Image
                    style={[
                        styles.headerBackground,
                        {
                            opacity: imageOpacity,
                            transform: [{ translateY: imageTranslateY }],
                        },
                    ]}
                    source={require('./App/Assets/Images/Test.png')}
                />

                <View style={[styles.headerBackground, { justifyContent: 'center', alignItems: "center", top: -35 }]}>
                    <AnimatedCircularProgress
                        size={WIDTH * 0.5}
                        width={12}
                        backgroundWidth={30}
                        fill={10}
                        tintColor={COLORS.APPCOLORS}
                        backgroundColor='#FFEDE8'
                    >
                        {
                            (fill) => (
                                <View style={{ alignItems: "center", justifyContent: "center", flex: 1, width: '100%', backgroundColor: '#fff' }}>
                                    <Text style={{ color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: 34, paddingLeft: 25 }}>
                                        {10}<Text style={{ color: COLORS.APPCOLORS, fontSize: FONT.SIZE.SMALL }}>/150</Text>
                                    </Text>
                                    <Text style={{ color: COLORS.SECONDARY, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>TOTAL</Text>
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>
            </Animated.View>
            <Animated.View
                style={[
                    styles.topBar,
                    {
                        transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
                    },
                ]}>
                <Image source={require('./App/Assets/Images/Menu.png')} resizeMode='contain' style={styles.menuIcon} />
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    saveArea: {
        flex: 1,
        backgroundColor: '#eff3fb',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#402583',
        backgroundColor: '#ffffff',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 1,
        borderRadius: 10,
        marginHorizontal: 12,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.APPCOLORS,
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover'
    },
    topBar: {
        marginTop: 20,
        height: 50,
        marginLeft: 15,
        // alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        color: 'white',
        fontSize: 20,
    },
    avatar: {
        height: 54,
        width: 54,
        resizeMode: 'contain',
        borderRadius: 54 / 2,
    },
    fullNameText: {
        fontSize: 16,
        marginLeft: 24,
    },
    ///......sssssssssssssssssssssssssssss

    menuIcon: {
        width: 20,
        height: 20
    },
});

export default App;