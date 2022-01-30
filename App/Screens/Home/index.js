import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  Animated,
  Linking,
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH, IAMGE_URL} from './../../Utils/constants';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './../../Components/Common/Loader';
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import CommentInputText from './../../Components/Common/CommentInput';
import FeedComponents from './../Feed/feed';
import Sound from 'react-native-sound';
import TrackPlayer from 'react-native-track-player';
import VideoPlayer from './../Feed/VideoFeed';
import Orientation from 'react-native-orientation-locker';
import GoogleCast, {CastButton} from 'react-native-google-cast';
import CommentList from './../../Components/Common/commentList';
import FeedComments from './../../Components/Common/FeedCommentlist';
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import {showMessage, hideMessage} from 'react-native-flash-message';
// import SoundPlayer from 'react-native-sound-player'
import Axios from 'axios';
import ProgressiveImage from '../../Components/Common/PrograssiveImage';
import moment from 'moment';
import Video from 'react-native-video';
import {useFocusEffect} from '@react-navigation/native';
import ImageLoad from 'react-native-image-placeholder';

const HEADER_MAX_HEIGHT = 285;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

function HomeComponents(props) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [userData, setUserName] = useState(null);
  const [totalPoint, setTotalPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [userFeed, setUserFeed] = useState([]);
  const [pointsList, setPointsList] = useState([]);
  const [comment, setComment] = useState('');
  const [feedComment, setFeedComment] = useState('');
  const [feedList, setFeedList] = useState([]);
  const videoRef = React.createRef();
  const [highlightSend, setHighlightSend] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [welcomeArray, setWelcomeArray] = useState('');
  const [todayDate, setTodayDate] = useState(moment());

  // *******************************************************************************************************

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

  // *******************************************************************************************************************
  useFocusEffect(
    React.useCallback(() => {
      getUserFeedApi();
      getPointApiCalling();
      updateFeedApi();
      getUserDetails();

      registerListeners();
      getFeedListApi();
      Sound.setCategory('Playback', true); // true = mixWithOthers

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log('remote message----', remoteMessage);
        if (remoteMessage) {
          let notification = null;
          if (Platform.OS === 'ios') {
            showMessage({
              message: remoteMessage.notification.title,
              description: remoteMessage.notification.body,
              type: 'default',
              backgroundColor: COLORS.WHITE,
              color: COLORS.APPCOLORS,
              duration: 2000,
            });
          } else {
            showMessage({
              message: remoteMessage.notification.title,
              description: remoteMessage.notification.body,
              type: 'default',
              backgroundColor: COLORS.WHITE,
              color: COLORS.APPCOLORS,
              duration: 2000,
            });
          }
        }
      });

      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        if (remoteMessage) {
          const joinTeam = remoteMessage.data.league_id;
          console.log('remote message', remoteMessage);
          showMessage({
            message: remoteMessage.notification.title,
            description: remoteMessage.notification.body,
            type: 'default',
            backgroundColor: 'red',
            color: COLORS.APPCOLORS,
            duration: 2000,
          });
          if (joinTeam) {
            props.navigation.navigate('Team');
          }
        }
      });

      return unsubscribe;
    }, []),
  );

  // useEffect(() => {
  //   getUserFeedApi()
  //   getPointApiCalling()
  //   updateFeedApi()
  //   getUserDetails()

  //   registerListeners()
  //   getFeedListApi()
  //   Sound.setCategory('Playback', true); // true = mixWithOthers

  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log("remote message----", remoteMessage)
  //     if (remoteMessage) {
  //       let notification = null
  //       if (Platform.OS === 'ios') {
  //         showMessage({
  //           message: remoteMessage.notification.title,
  //           description: remoteMessage.notification.body,
  //           type: "default",
  //           backgroundColor: COLORS.WHITE,
  //           color: COLORS.APPCOLORS,
  //           duration: 2000
  //         });
  //       } else {
  //         showMessage({
  //           message: remoteMessage.notification.title,
  //           description: remoteMessage.notification.body,
  //           type: "default",
  //           backgroundColor: COLORS.WHITE,
  //           color: COLORS.APPCOLORS,
  //           duration: 2000,
  //         });
  //       }
  //     }
  //   });

  //   messaging().onNotificationOpenedApp(async remoteMessage => {
  //     if (remoteMessage) {
  //       const joinTeam = remoteMessage.data.league_id
  //       console.log("remote message", remoteMessage)
  //       showMessage({
  //         message: remoteMessage.notification.title,
  //         description: remoteMessage.notification.body,
  //         type: "default",
  //         backgroundColor: "red",
  //         color: COLORS.APPCOLORS,
  //         duration: 2000
  //       });
  //       if (joinTeam) {
  //         props.navigation.navigate("Team")
  //       }
  //     }
  //   });

  //   return unsubscribe;

  // }, [])

  /**********************************************All API callinf********************************* */

  const getUserFeedApi = async () => {
    props.navigation.addListener('focus', async () => {
      const userMe = await AsyncStorage.getItem('@user');
      if (userMe) {
        var data = {
          authToken: JSON.parse(userMe).authtoken,
        };
        const authToken = JSON.parse(userMe).authtoken;
        console.log('jjj', userMe);
        setLoading(true);
        Network(
          'common/user_feed_list?user_id=' + JSON.parse(userMe)._id,
          'get',
          {authToken},
        )
          .then((res) => {
            console.log('user data feed list  vvv===>', res);
            if (res.response_code == 2000) {
              setLoading(false);
              if (res.response_data.docs) {
                setWelcomeArray(res.response_data.docs.length);
              }
              console.log('welcome', res.response_data.total);
            } else {
              Toast.show('' + res.message);
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      }
    });
  };

  /********************************************************************************************** */
  const getPointApiCalling = async () => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      // var data = {
      //     authToken: JSON.parse(userMe).authtoken
      // }
      const authToken = JSON.parse(userMe).authtoken;
      setLoading(true);
      Network(
        'common/user_feed_list?user_id=' + JSON.parse(userMe)._id,
        'get',
        {authToken},
      )
        .then((res) => {
          console.log('feed list', res);
          if (res.response_code == 2000) {
            setLoading(false);

            let array = res.response_data.docs.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
            setUserFeed(array);
            console.log('data feed', array);

            if (res.response_data.docs) {
              setWelcomeArray(res.response_data.docs.length);
            }
            console.log('welcome', res.response_data.total);
          } else {
            Toast.show('' + res.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };
  /********************************************************************************************** */

  const updateFeedApi = async () => {
    console.log('update feed api hit');
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      // var data = {
      //     authToken: JSON.parse(userMe).authtoken
      // }
      const authToken = JSON.parse(userMe).authtoken;
      setLoading(true);
      Network(
        'common/user_feed_list?user_id=' + JSON.parse(userMe)._id,
        'get',
        {authToken},
      )
        .then((res) => {
          console.log('feed list', res);

          setComment(null);
          setFeedComment(null);
          console.log('update feed api response', res);
          if (res.response_code == 2000) {
            setLoading(false);
            let array = res.response_data.docs.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
            setUserFeed(array);

            console.log('data feed', array);
          } else {
            Toast.show('' + res.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  /**********************************weekly_point get API Calling******************************** */

  const getUserDetails = async () => {
    props.navigation.addListener('focus', async () => {
      const userMe = await AsyncStorage.getItem('@user');
      var now = moment();
      var WeekStartDate = now.startOf('isoWeek');
      WeekStartDate = new Date(WeekStartDate.format('YYYY-MM-DD'));
      WeekStartDate.setHours(0, 0, 0, 0);
      var WeekEndDate = new Date(WeekStartDate);
      WeekEndDate.setDate(WeekStartDate.getDate() + 6);
      WeekEndDate.setHours(23, 59, 59, 999);
      console.log('date fot all', WeekStartDate, WeekEndDate);
      let object = {
        date: sendDate(),
        weekStartDate: moment(WeekStartDate).format('YYYY-MM-DD'),
        weekEndDate: moment(WeekEndDate).format('YYYY-MM-DD'),
        authToken: JSON.parse(userMe).authtoken,
      };

      console.log('time', object);
      setLoading(true);
      Network('point/weekly_point', 'post', object)
        .then((res) => {
          if (res.success) {
            setLoading(false);
            setPointsList(res.response.docs);
            setTotalPoints(res.response.sum);
          } else {
            Toast.show('' + res.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    });
  };

  /********************************************************************************************************* */

  const sendDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  };

  const next14Days = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const f = new Date(year, month, day - 14); // PLUS 1 DAY
    return f;
  };

  const registerListeners = () => {
    const events = `
                  SESSION_STARTING SESSION_STARTED SESSION_START_FAILED SESSION_SUSPENDED
                  SESSION_RESUMING SESSION_RESUMED SESSION_ENDING SESSION_ENDED
            
                  MEDIA_STATUS_UPDATED MEDIA_PLAYBACK_STARTED MEDIA_PLAYBACK_ENDED MEDIA_PROGRESS_UPDATED
            
                  CHANNEL_CONNECTED CHANNEL_DISCONNECTED CHANNEL_MESSAGE_RECEIVED
                `
      .trim()
      .split(/\s+/);
    console.log(events);

    events.forEach((event) => {
      GoogleCast.EventEmitter.addListener(GoogleCast[event], function () {
        console.log(event, arguments);
      });
    });
  };

  const getFeedListApi = async () => {
    props.navigation.addListener('focus', async () => {
      Orientation.lockToPortrait();
    });

    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      setLoading(true);
      setUserName(JSON.parse(userMe));
      var data = {
        from_date: next14Days(),
        to_date: sendDate(),
        authToken: JSON.parse(userMe).authtoken,
      };

      Network('common/feed_List', 'post', data)
        .then((res) => {
          console.log('feed api aaa', res);
          if (res.success) {
            setLoading(false);
            setFeedList(res.response.docs);
          } else {
            Toast.show('' + res.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  const handleComment = async (val) => {
    if (comment.length == 0) {
      Toast.show('Please enter your comment!');
    } else {
      const userMe = await AsyncStorage.getItem('@user');
      if (userMe) {
        let object = {
          authToken: JSON.parse(userMe).authtoken,
          commenter_id: JSON.parse(userMe)._id,
          point_id: val._id,
          comment: comment,
        };
        setLoading(false);
        Network('common/add-comment-on-feed', 'post', object)
          .then((res) => {
            setComment('');
            setFeedComment('');
            if (res.response_code == 2000) {
              setLoading(false);
              updateFeedApi();
              Toast.show('' + res.message);
            } else {
              Toast.show('' + res.message);
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      }
    }
  };

  const handleCommentFeed = async (val) => {
    console.log('handle commit feed');
    setToggle(!toggle);
    if (feedComment.length == 0) {
      Toast.show('Please enter your comment!');
    } else {
      const userMe = await AsyncStorage.getItem('@user');
      if (userMe) {
        let object = {
          authToken: JSON.parse(userMe).authtoken,
          commenter_id: JSON.parse(userMe)._id,
          point_id: val._id,
          comment: feedComment,
        };
        setLoading(true);
        Network('common/add-comment-on-feed', 'post', object)
          .then((res) => {
            setFeedComment('');
            setComment('');
            console.log('object---->', res);
            if (res.response_code == 2000) {
              setLoading(false);
              // setFeedComment('')
              updateFeedApi();
              Toast.show('' + res.message);
            } else {
              Toast.show('' + res.message);
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      }
    }
  };

  const handlePaused = (val, item, index) => {
    console.log(item);
    if (item.feed_type == 'video') {
      GoogleCast.getCastState().then((res) => {
        if (res == 'Connected') {
          cast(item);
        } else if (res == 'NoDevicesAvailable') {
          // setPaused(val)

          props.navigation.navigate('fulVideo', {videoUrl: item.video_path});
        } else if (res == 'NotConnected') {
          // setPaused(val)
          props.navigation.navigate('fulVideo', {videoUrl: item.video_path});
        } else {
          // setPaused(val)
          props.navigation.navigate('fulVideo', {videoUrl: item.video_path});
        }
      });
    } else {
      try {
        TrackPlayer.setupPlayer().then(async () => {
          await TrackPlayer.add({
            id: 'trackId',
            url: item.audio_path,
            title: '200 Club Feed Audio',
            artist: item.name,
            artwork: require('./../../Assets/TEAMUP_LOGO.png'),
          });
          if (val) {
            await TrackPlayer.stop();
          } else {
            await TrackPlayer.play();
          }
        });
        //play the file tone.mp3
        // SoundPlayer.playSoundFile('tone', 'mp3')
        // // or play from url
        // SoundPlayer.playUrl(item.audio_path)
        // <Video
        //     ref={videoRef}
        //     source={{
        //       uri: item.audio_path,
        //     }}
        //     controls={false}
        //     paused={val ? true: false}
        //     fullscreen={false}
        //     audioOnly={true}
        //   />
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    }
  };

  const cast = (item) => {
    GoogleCast.getCastDevice().then(console.log);
    GoogleCast.castMedia({
      mediaUrl: String(item.video_path),
      imageUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/480x270/BigBuckBunny.jpg',
      title: String(item.name),
      subtitle: String(item.description),
      studio: String(item.name),
      contentType: 'video/mp4', // Optional, default is "video/mp4"
      playPosition: 10, // seconds
      customData: {
        customKey: 'customValue',
      },
    });
    GoogleCast.launchExpandedControls();
    GoogleCast.showCastPicker();
    sendMessage();
  };

  const sendMessage = () => {
    const channel = 'urn:x-cast:com.club';
    GoogleCast.initChannel(channel).then(() => {
      GoogleCast.sendMessage(channel, JSON.stringify({message: 'Hello'}));
    });
  };

  //...send email from user,,,,,,,,,,,,

  const handleEmailVideo = async (item) => {
    // const userMe = await AsyncStorage.getItem('@user')
    // const message = `This is feed video link:- ${item.video_path}\n ${item.link_url}`;
    // console.log(`${JSON.parse(userMe).email}?subject=TeamUp App link&body=${message}`);
    // Linking.openURL(`mailto:${JSON.parse(userMe).email}?subject=TeamUp App link&body=${message}`)
    props.navigation.navigate('adminPost', {link: item.link_text});
  };

  const handleEmailAudio = async (item) => {
    // const userMe = await AsyncStorage.getItem('@user')
    // const message = `This is feed audio link:- ${item.audio_path}\n ${item.link_url}`;
    // console.log(`${JSON.parse(userMe).email}?subject=TeamUp App link&body=${message}`);
    // Linking.openURL(`mailto:${JSON.parse(userMe).email}?subject=TeamUp App link&body=${message}`)
    props.navigation.navigate('adminPost', {link: item.link_text});
  };

  const handleEmailText = async (item) => {
    // const userMe = await AsyncStorage.getItem('@user')
    // const message = `${item.description}\n ${item.link_url}`;
    // console.log(`${JSON.parse(userMe).email}?subject=TeamUp App link&body=${message}`);
    // Linking.openURL(`mailto:${JSON.parse(userMe).email}?subject=TeamUp App link&body=${message}`)
    props.navigation.navigate('adminPost', {link: item.link_text});
  };

  const renderListItem = (item) => (
    console.log('hhh',item.others_activity),
    <View style={{alignItems: 'center'}}>
      {item.data_type == 'congratulations' ? (
        <>
          <View style={styles.AmazingComponents}>
            <View style={{}}>
          
              <ImageBackground
                source={require('./../../Assets/Congratulations.png')}
                style={styles.amazingImage}
                resizeMode="contain">
                <View style={styles.amazingContainer}>
                  <Text style={styles.hitText}>
                    Congratulations 150 points!
                  </Text>
                  <View style={styles.amazingUser}>
                    {item.user_details.prfile_image !==
                    'http://3.135.167.66/app/public/uploads/user/' ? (
                      <ProgressiveImage
                        defaultImageSource={require('./../../Assets/UserIcon.png')}
                        source={{
                          uri:
                            item.user_details && item.user_details.prfile_image,
                        }}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 80 / 2,
                          borderWidth: 3,
                          borderColor: 'white',
                          marginTop: 5,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 80 / 2,
                          backgroundColor: COLORS.APPCOLORS,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 30,
                            fontFamily: FONT.FAMILY.ROBOTO_Bold,
                          }}>
                          {item.user_details.first_name.charAt(0)}
                          {item.user_details.last_name.charAt(0)}
                        </Text>
                      </View>
                    )}
                    {/* <Image source={{ uri: item.user_details && item.user_details.prfile_image }} resizeMode='cover' style={{ width: 65, height: 65, borderRadius: 65 / 2 }} /> */}
                  </View>
                  <Text style={styles.amazingUserName}>
                    {item.user_details.first_name +
                      ' ' +
                      item.user_details.last_name}
                  </Text>
                </View>
              </ImageBackground>
            </View>
            {item.comments.length != 0 ? (
              <CommentList
                comments={item.comments !== undefined && item.comments}
              />
            ) : null}

            <View style={styles.amazingComment}>
              <Image
                source={{
                  uri: item.user_details && item.user_details.prfile_image,
                }}
                resizeMode="cover"
                style={{width: 40, height: 40, borderRadius: 40 / 2}}
              />

              <View style={styles.container}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Add comment..."
                  onChangeText={(value) => setComment(value)}
                  value={comment}
                />
                <TouchableOpacity 
              onPress={() => handleComment(item)}
               
                >
                  <Image
                    source={require('./../../Assets/Images/Message.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>

              {/* <CommentInputText
                                onChangeText={(value) => setComment(value)}
                                handleCommentFeed={() => handleComment(item)}
                            /> */}
            </View>
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity
          // onPress={()=>props.navigation.navigate('EditPost')}
          >
            <Text style={styles.Pointcontainer}>
              {new Date(item.date).toDateString()}
            </Text>
            <View style={styles.pointMainContainer}>
              <View style={styles.pointCell}>
                <View style={styles.pointSubcell}>
                  {item.user_details.prfile_image !==
                  'http://3.135.167.66/app/public/uploads/user/' ? (
                    <ProgressiveImage
                      defaultImageSource={require('./../../Assets/UserIcon.png')}
                      source={{
                        uri: item.user_details.prfile_image,
                      }}
                      style={{height: 70, width: 70, borderRadius: 70 / 2}}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 70 / 2,
                        backgroundColor: COLORS.APPCOLORS,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 28,
                          fontFamily: FONT.FAMILY.ROBOTO_Bold,
                        }}>
                        {item.user_details.first_name.charAt(0)}
                        {item.user_details.last_name.charAt(0)}
                      </Text>
                    </View>
                  )}

                  <View style={{paddingLeft: 10, marginTop: 10}}>
                    <Text
                      style={
                        ([styles.pointUserName],
                        {width: WIDTH * 0.34, fontSize: 18})
                      }
                      numberOfLines={1}>
                      {item.user_details.first_name +
                        ' ' +
                        item.user_details.last_name}
                    </Text>
                    {item.activity_details.activity.length > 15 ||
                    (item.activity_details.activity === 'Write your own' &&
                    item.others_activity && item.others_activity!=null && item.others_activity.length) > 15 ? (
                      <Text
                        style={[
                          styles.pointUserName,
                          {
                            fontSize: 14,
                            marginTop: 5,
                            color: COLORS.APPCOLORS,
                            fontFamily: FONT.FAMILY.ROBOTO_Bold,
                            width: '42%',
                          },
                        ]}>
                        {item.activity_details.activity === 'Write your own' && item.others_activity && item.others_activity!=null
                          ? item.others_activity.charAt(0).toUpperCase() +
                            item.others_activity.slice(1)
                          : item.activity_details.activity
                              .charAt(0)
                              .toUpperCase() +
                            item.activity_details.activity.slice(1)}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.pointUserName,
                          {
                            fontSize: 14,
                            marginTop: 5,
                            color: COLORS.APPCOLORS,
                            fontFamily: FONT.FAMILY.ROBOTO_Bold,
                            width: '100%',
                          },
                        ]}>
                        {item.activity_details.activity === 'Write your own' && item.others_activity && item.others_activity!=null
                          ? item.others_activity.charAt(0).toUpperCase() +
                            item.others_activity.slice(1)
                          : item.activity_details.activity
                              .charAt(0)
                              .toUpperCase() +
                            item.activity_details.activity.slice(1)}
                      </Text>
                    )}
                    {/* <Text style={styles.pointActivity}>{item.others_activity == '' ? item.activity_details.activity : item.others_activity}</Text> */}
                  </View>
                </View>
                <View style={styles.pointSubpoint}>
                  <Text style={styles.pointText}>{item.point}</Text>
                  <Text style={styles.textPoint}>Points</Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: '6%',
                  borderBottomWidth: 0.5,
                  paddingBottom: 20,
                  borderColor: COLORS.GRAY,
                }}>
                {item.note !== '' && (
                  <Text style={{fontFamily: FONT.FAMILY.ROBOTO_Regular}}>
                    {item.note}
                  </Text>
                )}
                {
                  item.image && (
                    <ImageLoad
                      source={{uri: item.image}}
                      resizeMode="cover"
                      style={{
                        width: '100%',
                        height: 225,
                        borderRadius: 10,
                        marginTop: 10,
                      }}
                      borderRadius={10}
                      loadingStyle={{size: 'small', color: 'green'}}
                    />
                  )

                  //   <Image source={{uri:item.image}}
                  // style={{width:'100%',height:150,marginTop:10,borderRadius:10}}
                  // />
                }
              </View>
              {item.comments.length != 0 ? (
                <FeedComments
                  comments={item.comments !== undefined && item.comments}
                />
              ) : null}

              <View style={styles.commentContainer}>
                {item.user_details.prfile_image !==
                'http://3.135.167.66/app/public/uploads/user/' ? (
                  <ProgressiveImage
                    defaultImageSource={require('./../../Assets/UserIcon.png')}
                    source={{
                      uri: userData.image,
                    }}
                    style={{width: 40, height: 40, borderRadius: 40 / 2}}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40 / 2,
                      backgroundColor: COLORS.APPCOLORS,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                        fontFamily: FONT.FAMILY.ROBOTO_Bold,
                      }}>
                      {item.user_details.first_name.charAt(0)}
                      {item.user_details.last_name.charAt(0)}
                    </Text>
                  </View>
                )}

                {/* <Image source={{ uri: userData.image }} resizeMode='cover' style={{ width: 40, height: 40, borderRadius: 40 / 2 }} /> */}
                <View style={styles.container}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Add comment...."
                    onChangeText={(value) => setFeedComment(value)}
                    value={feedComment}
                    onFocus={() => setHighlightSend(true)}
                    onBlur={() => setHighlightSend(false)}
                  />
                  <TouchableOpacity onPress={() => 
                    handleCommentFeed(item)}
                    >
                    <Image
                      source={require('./../../Assets/Images/Message.png')}
                      style={[
                        styles.icon,
                        highlightSend
                          ? {tintColor: COLORS.APPCOLORS}
                          : {tintColor: '#c6c6c6'},
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                {/* <CommentInputText
                onChangeText={(value) => setFeedComment(value)}
                handleCommentFeed={() => handleCommentFeed(item)}
              /> */}
              </View>
              {/* <TouchableOpacity
            onPress={()=>props.navigation.navigate('EditPost')}
            style={{alignItems:'center'}}
          >
        <Image source={require('../../Assets/Images/editPoint.png')}
        style={{width:20,height:20,marginTop:10}}/>
          </TouchableOpacity> */}
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <>
      <Loader loading={loading} />
      <FlashMessage position="top" />

      <SafeAreaView style={styles.saveArea}>
        
        <Animated.ScrollView
          contentContainerStyle={{paddingTop: HEADER_MAX_HEIGHT - 32}}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true},
          )}
          keyboardShouldPersistTaps="always">
          <View style={{alignItems: 'center', marginTop: 25}}>
            {userFeed.map(renderListItem)}

            {welcomeArray === 0 && (
              <View style={{marginVertical: 20}}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    fontFamily: FONT.FAMILY.ROBOTO_Bold,
                    color: 'gray',
                  }}>
                  {moment(todayDate).format('dddd Do MMMM')}
                </Text>
                <View
                  style={{
                    width: '90%',
                    marginTop: 15,
                    backgroundColor: 'white',
                    padding: 35,
                    borderRadius: 20,
                  }}>
                  {/* <Text style={{fontSize:20,color:COLORS.APPCOLORS,fontFamily:FONT.FAMILY.ROBOTO_Bold}}>Welcome to TeamUp</Text>
           
          
             <Text style={{fontSize:16,fontFamily:FONT.FAMILY.ROBOTO_Regular,marginTop:30}}>We're pleased you decided to come on board with us</Text>

             <Text style={{fontSize:16,fontFamily:FONT.FAMILY.ROBOTO_Regular,marginTop:20}}>Got two minutes for a quick intro video to get you started?</Text>
            <TouchableOpacity
            onPress={()=>props.navigation.navigate('NewPost')}>
             <Image style={{width:'100%',height:350,marginTop:25,borderWidth:0.5,resizeMode:'cover',borderRadius:10}}
             source={require('../../Assets/feedtime.png')}/>
             </TouchableOpacity> */}
                  <Text
                    style={{
                      fontSize: 30,
                      color: COLORS.APPCOLORS,
                      fontFamily: FONT.FAMILY.ROBOTO_Bold,
                    }}>
                    You're new here
                  </Text>
                  {/* <Text style={{fontSize:30,fontFamily:FONT.FAMILY.ROBOTO_Bold,marginTop:25}}>Let's get straight to the point</Text> */}

                  <Text
                    style={{
                      fontSize: 30,
                      fontFamily: FONT.FAMILY.ROBOTO_Bold,
                      marginTop: 25,
                      lineHeight: 40,
                    }}>
                    Do you know how much exercise you should do every week?
                  </Text>
                  {/* <Text style={{fontSize:16,fontFamily:FONT.FAMILY.ROBOTO_Bold,marginTop:20}}>Here's the answer and the TeamUp House Rules (yes, we love rules...)</Text> */}

                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('NewPost')}
                    style={{
                      alignItems: 'center',
                      height: 80,
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignSelf: 'center',
                      width: '100%',
                    }}>
                    <Image
                      style={{
                        width: 70,
                        height: 70,
                        marginTop: 25,
                        borderWidth: 0.5,
                        resizeMode: 'cover',
                        borderRadius: 10,
                        tintColor: COLORS.APPCOLORS,
                      }}
                      source={require('../../Assets/Feed/IconVIDEO.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {feedList.length != 0 &&
              feedList.map((item, index) => {
                return (
                  <View style={{paddingVertical: 5}}>
                    {item && item.feed_type == 'video' && (
                      <VideoPlayer
                        item={item}
                        onPress={(val) => handlePaused(val, item, index)}
                        handleEmail={() => handleEmailVideo(item)}
                      />
                    )}

                    {item && item.feed_type == 'audio' && (
                      <FeedComponents
                        item={item}
                        onPress={(val) => handlePaused(val, item, index)}
                        handleEmail={() => handleEmailAudio(item)}
                      />
                    )}

                    {item && item.feed_type == 'text' && (
                      <View
                        style={{
                          alignItems: 'center',
                          width: WIDTH,
                          paddingVertical: 10,
                        }}>
                        <ImageBackground
                          source={require('../../Assets/Admin_card.png')}
                          style={{
                            width: WIDTH * 0.9,
                            borderRadius: 15,
                            flexDirection: 'row',
                          }}>
                          <View style={{width: WIDTH * 0.9, padding: 15}}>
                            {/* <Text style={{ color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.MEDIUM }}>{"Post From " + new Date(item.date).toDateString()}</Text> */}
                            <Text
                              style={{
                                color: COLORS.APPCOLORS,
                                fontFamily: FONT.FAMILY.ROBOTO_Bold,
                                fontSize: FONT.SIZE.LARGE,
                              }}>
                              {item.name}
                            </Text>

                            {/* <View style={{ marginVertical: 10, }}>

                              <Text numberOfLines={1} style={{ color: COLORS.WHITE, width: WIDTH * 0.6, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>{item.name}</Text>

                            </View> */}

                            <Text
                              style={{
                                color: COLORS.LOGOCOLOR,
                                paddingVertical: 5,
                                fontFamily: FONT.FAMILY.ROBOTO_Regular,
                                fontSize: FONT.SIZE.MEDIUM,
                              }}
                              numberOfLines={3}>
                              {item.description}
                            </Text>

                            <TouchableOpacity
                              style={{flexDirection: 'row', paddingTop: 5}}
                              onPress={() => handleEmailText(item)}>
                              {/* <Image source={require('./../../Assets/Feed/IconMAIL.png')} style={{ width: 25, height: 25 }} /> */}

                              {/* <Text style={{ color: COLORS.LOGOCOLOR, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE, paddingLeft: 5 }}>Email text link to yourself.</Text> */}
                              <Text
                                style={{
                                  color: COLORS.LOGOCOLOR,
                                  fontFamily: FONT.FAMILY.ROBOTO_Bold,
                                  fontSize: FONT.SIZE.LARGE,
                                  textDecorationLine: 'underline',
                                  color: COLORS.APPCOLORS,
                                }}>
                                {item.link_text}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </ImageBackground>
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        </Animated.ScrollView>
        <Animated.View
          style={[
            styles.header,
            {transform: [{translateY: headerTranslateY}]},
          ]}>
          <Animated.Image
            style={[
              styles.headerBackground,
              {
                opacity: imageOpacity,
                transform: [{translateY: imageTranslateY}],
              },
            ]}
            source={require('./../../Assets/Images/Test.png')}
          />


          <View
            style={[
              styles.headerBackground,
              {justifyContent: 'center', alignItems: 'center', top: 0},
            ]}>
            <AnimatedCircularProgress
              size={WIDTH * 0.5}
              width={12}
              backgroundWidth={30}
              fill={totalPoint && totalPoint / 1.5}
              tintColor={COLORS.APPCOLORS}
              backgroundColor="#FFEDE8">
              {(fill) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    width: '100%',
                    backgroundColor: '#fff',
                  }}>
                  <Text
                    style={{
                      color: COLORS.LOGOCOLOR,
                      fontFamily: FONT.FAMILY.ROBOTO_Bold,
                      fontSize: 34,
                      paddingLeft: 25,
                    }}>
                    {totalPoint && totalPoint}
                    <Text
                      style={{
                        color: COLORS.APPCOLORS,
                        fontSize: FONT.SIZE.SMALL,
                      }}>
                      /150
                    </Text>
                  </Text>
                  <Text
                    style={{
                      color: COLORS.SECONDARY,
                      fontFamily: FONT.FAMILY.ROBOTO_Regular,
                      fontSize: FONT.SIZE.LARGE,
                    }}>
                    TOTAL
                  </Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.topBar,
            {
              transform: [{scale: titleScale}, {translateY: titleTranslateY}],
            },
          ]}>
          <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
            <Image
              source={require('./../../Assets/Images/Menu.png')}
              resizeMode="contain"
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </>
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
    alignItems: 'center',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
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
    height: 20,
  },
  container: {
    backgroundColor: '#F9FAFB',
    width: WIDTH,
    paddingBottom: 20,
  },
  imageContainer: {
    width: WIDTH,
    height: HEIGHT * 0.46,
  },
  imageContainerHeader: {
    width: WIDTH,
    height: HEIGHT * 0.15,
  },
  subContainer: {
    height: HEIGHT * 0.4,
    padding: 25,
  },
  menuIcon: {width: 25, height: 25},
  Pointcontainer: {
    color: '#B1B0B7',
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: FONT.SIZE.MEDIUM,
    textAlign: 'center',
    paddingTop: 20,
  },
  pointMainContainer: {
    width: WIDTH * 0.9,
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    elevation: 2,
  },
  pointCell: {flexDirection: 'row', alignItems: 'center'},
  pointSubcell: {
    width: WIDTH * 0.6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointUserName: {
    color: COLORS.TEXTCOLORS,
    fontFamily: FONT.FAMILY.ROBOTO_Medium,
    fontSize: FONT.SIZE.LARGE,
  },
  pointActivity: {
    color: COLORS.TEXTCOLORS,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: FONT.SIZE.SMALL,
  },
  pointSubpoint: {
    borderRadius: 10,
    borderColor: COLORS.APPCOLORS,
    borderWidth: 3,
    height: HEIGHT * 0.1,
    width: HEIGHT * 0.1,
    justifyContent: 'center',
  },
  pointText: {
    color: COLORS.APPCOLORS,
    fontSize: FONT.SIZE.EXTRALARGE,
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
    textAlign: 'center',
  },
  textPoint: {
    color: COLORS.APPCOLORS,
    fontSize: FONT.SIZE.SMALL,
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
    textAlign: 'center',
  },
  commentContainer: {
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 30,
  },
  imageBox: {height: HEIGHT * 0.2, width: WIDTH * 0.85},
  workout: {
    color: '#F0F0F0',
    fontSize: FONT.SIZE.SMALL,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
  },
  fullBody: {
    color: '#FFFFFF',
    fontSize: FONT.SIZE.LARGE,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
  },
  getStarted: {
    color: '#FFFFFF',
    fontSize: FONT.SIZE.MEDIUM,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    paddingTop: 10,
  },
  AmazingComponents: {
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
    shadowOpacity: Platform.OS == 'ios' ? 0.2 : 2,
    marginTop: 10,
    width: WIDTH * 0.9,
  },
  amazingSubView: {
    width: WIDTH * 0.9,
    height: HEIGHT * 0.24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: COLORS.APPCOLORS,
    borderWidth: 1,
  },
  amazingImage: {width: '100%', height: 200, alignSelf: 'center'},
  amazingContainer: {margin: 10, alignItems: 'center'},
  hitText: {
    color: 'white',
    paddingBottom: 8,
    fontSize: 20,
    fontFamily: FONT.FAMILY.ROBOTO_Medium,
    marginTop: 15,
  },
  amazingUser: {width: 70, height: 70, borderRadius: 70 / 2},
  amazingUserName: {
    color: 'white',
    paddingHorizontal: 5,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: 14,
    marginTop: 20,
  },
  amazingComment: {padding: 10, justifyContent: 'center', flexDirection: 'row'},

  container: {
    marginLeft: 10,
    flexDirection: 'row',
    width: WIDTH * 0.65,
    borderRadius: 10,
    backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: WIDTH * 0.55,
    paddingLeft: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default HomeComponents;
