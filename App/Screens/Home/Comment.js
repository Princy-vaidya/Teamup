import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  Text,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  Share,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH, IAMGE_URL} from './../../Utils/constants';
import Network from './../../Services/Network';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './../../Components/Common/Loader';
import ProgressiveImage from '../../Components/Common/PrograssiveImage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeedComments from './../../Components/Common/commenting';
import Toast from 'react-native-root-toast';


const HEADER_MAX_HEIGHT = 285;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

function Comment(props) {
    const [userData, setUserName] = useState(null)
    const [comment, setComment] = useState("")
    const [feedComment, setFeedComment] = useState("")
    const [feed, setFeed] = useState([]);
    const videoRef = React.createRef();
    const [highlightSend,setHighlightSend]=useState(false);
    const [toggle,setToggle]=useState(false);
    const [loading,setLoading]=useState(false)
  
  
    // *******************************************************************************************************
  
  
    
  
    // *******************************************************************************************************************
  
  
    useEffect(() => {
  
     getPointApiCalling()
  
    }, [])
  
    const getPointApiCalling = async () => {
      const userMe = await AsyncStorage.getItem('@user');
      console.log('user token',JSON.parse(userMe).authtoken)
      if (userMe) {
        // var data = {
        //     authToken: JSON.parse(userMe).authtoken
        // }
        const authToken = JSON.parse(userMe).authtoken;
        setLoading(true);
        Network(
          'common/user_feed_list_by_id?point_id=61ea7199af9ed2184faf542a' ,
          'get',
          {authToken},
        )
          .then((res) => {
            console.log('feed list comment', res.response_data.docs[0].user_details);
            if (res.response_code == 2000) {
              setLoading(false);
               setFeed(res.response_data.docs)
                console.log('arry',feed[0])
              
            } else {
              // Toast.show('' + res.message);
              setLoading(false);
              
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log('error loading',error)
          });
      }
    };
  
  
    /**********************************************All API callinf********************************* */
  
   
    /********************************************************************************************** */
    
    /********************************************************************************************** */
  
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
              console.log('object comment---->', res);
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
  
  
    /**********************************weekly_point get API Calling******************************** */
  
     /********************************************************************************************************* */
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
                    // props.navigation.navigate('Comment')}
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
  
   
  
     const Heading = (props) => {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', height: HEIGHT * 0.13 }}>
          <TouchableOpacity onPress={props.onPress} style={{ marginLeft:'20%' }}>
            <Image source={require('./../../Assets/Images/arrow_back.png')} resizeMode='contain' style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.WHITE, width: '50%', fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center' }}>Post</Text>
        </View>
    
      )
    }
  
   
  
    //...send email from user,,,,,,,,,,,,
  
   
   
  
  
    return (
console.log('hshsbxhb',feed),
      <>
       <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.imageContainer}
        resizeMode="stretch"
       >
        <Heading onPress={() => props.navigation.navigate('TabHome')} />
     

        <KeyboardAvoidingView
          // style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
          behavior="padding">
             
          {/* <ScrollView showsVerticalScrollIndicator={false}
          style={{}}> */}

  
    
{feed.map(renderListItem)}

      {/* <CommentInputText
        onChangeText={(value) => setFeedComment(value)}
        handleCommentFeed={() => handleCommentFeed(item)}
      /> */}
  
         
        </KeyboardAvoidingView>
       

      </ImageBackground>
   
   

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
  container: {
    backgroundColor: '#F9FAFB',
    width: WIDTH,
    paddingBottom: 20
  },
  imageContainer: {
    width: WIDTH,
    height: HEIGHT,
  },
  imageContainerHeader: {
    width: WIDTH,
    height: HEIGHT * 0.15,
  },
  subContainer: {
    height: HEIGHT * 0.4,
    padding: 25
  },
  menuIcon: { width: 25, height: 25 },
  Pointcontainer: { color: '#B1B0B7', fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM, textAlign: 'center', paddingTop: 20 },
  pointMainContainer: { width: WIDTH * 0.9, padding: 20, marginTop: 20, marginBottom: 10, borderRadius: 10, backgroundColor: COLORS.WHITE, elevation: 2 ,alignSelf:'center'},
  pointCell: { flexDirection: 'row', alignItems: 'center' },
  pointSubcell: { width: WIDTH * 0.6, flexDirection: 'row', alignItems: 'center' },
  pointUserName: { color: COLORS.TEXTCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE },
  pointActivity: { color: COLORS.TEXTCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.SMALL },
  pointSubpoint: { borderRadius: 10, borderColor: COLORS.APPCOLORS, borderWidth: 3, height: HEIGHT * 0.1, width: HEIGHT * 0.1, justifyContent: 'center' },
  pointText: { color: COLORS.APPCOLORS, fontSize: FONT.SIZE.EXTRALARGE, fontFamily: FONT.FAMILY.ROBOTO_Bold, textAlign: 'center' },
  textPoint: { color: COLORS.APPCOLORS, fontSize: FONT.SIZE.LARGE, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center' },
  commentContainer: { padding: 10, justifyContent: 'center', flexDirection: 'row', paddingTop: 30 },
  imageBox: { height: HEIGHT * 0.2, width: WIDTH * 0.85 },
  workout: { color: '#F0F0F0', fontSize: FONT.SIZE.SMALL, fontFamily: FONT.FAMILY.ROBOTO_Regular },
  fullBody: { color: '#FFFFFF', fontSize: FONT.SIZE.LARGE, fontFamily: FONT.FAMILY.ROBOTO_Regular },
  getStarted: { color: '#FFFFFF', fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, paddingTop: 10 },
  AmazingComponents: { borderRadius: 5, backgroundColor: '#fff', elevation: 2, shadowOpacity: Platform.OS == "ios" ? 0.2 : 2, marginTop: 10, width: WIDTH * 0.9 },
  amazingSubView: { width: WIDTH * 0.9, height: HEIGHT * 0.24, alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: COLORS.APPCOLORS, borderWidth: 1 },
  amazingImage: { width: WIDTH * 0.85, height: HEIGHT * 0.18 },
  amazingContainer: { margin: 10, alignItems: 'center' },
  hitText: { color: COLORS.APPCOLORS, paddingBottom: 8, fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular },
  amazingUser: { width: 70, height: 70, borderRadius: 70 / 2 },
  amazingUserName: { color: '#272728', paddingHorizontal: 5, fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.LARGE },
  amazingComment: { padding: 10, justifyContent: 'center', flexDirection: 'row' },


  container: {
    marginLeft: 10,
    flexDirection: 'row',
    width: WIDTH * 0.65,
    borderRadius: 10,
    backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: WIDTH * 0.55,
    paddingLeft: 10
  },
  icon: {
    width: 20,
    height: 20
  }

});

export default Comment;








