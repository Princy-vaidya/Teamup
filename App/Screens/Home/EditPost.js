import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH} from './../../Utils/constants';
import TextInput from './../../Components/Common/InputText';
import Loader from './../../Components/Common/Loader';
import * as Animatable from 'react-native-animatable';
import Button from './../../Components/Common/button';
import RNPickerSelect from 'react-native-picker-select';
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-picker';
import {base_url} from './../../Utils/constants';
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import {showMessage, hideMessage} from 'react-native-flash-message';
import moment from 'moment';
import ImageModal from '../../Components/Common/ImageModal';




export default function EditPost(props) {
  const [activity, setActivity] = React.useState(null);
  const [points, setPoints] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [activityList, setActivityList] = useState([]);
  const [otherActivity, setOtherActivity] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDate, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [image, setImages] = useState('');
  const [modal, setModal] = useState(false);
  const [sourseImage, setSourseImages] = useState('');



  useEffect(() => {
    getActivityApi();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage) {
        console.log("remoteMessage", remoteMessage);
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
      showMessage({
        message: remoteMessage.notification.title,
        description: remoteMessage.notification.body,
        type: 'default',
        backgroundColor: COLORS.WHITE,
        color: COLORS.APPCOLORS,
        duration: 2000,
      });
    });

    return unsubscribe;
  }, []);

  const getActivityApi = async () => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      setLoading(true);
      Network('common/activity_List', 'post', {
        authToken: JSON.parse(userMe).authtoken,
      })
        .then((res) => {
          if (res.success) {
            setLoading(false);
            if (res.response.docs.length != 0) {
              const dataArr = res.response.docs.map((item) => {
                const data = {label: item.activity, value: item._id};
                return data;
              });
              setActivityList(dataArr);
            }
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

  const getDate = (val) => {
    var today = new Date(val);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
  };

  const sendDate = (val) => {
    var today = new Date(val);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '/' + mm + '/' + dd;
    return today;
  };

  const handleProfileImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        setImages(response.uri);
      }
    });
  };

  const handleSubmit = async () => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      if (activity == null) {
        Toast.show('Activity is required !');
      } else if (points.length == '') {
        Toast.show('Point is required !');
      } else if (image == '') {
        Toast.show('Image is required !');
      } else {
        console.log('isDate=====>', new Date(isDate));
        console.log('isDate=====>', String(isDate));
        const date = new Date(isDate);
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = String(date.getFullYear());
        var now = moment();
        var WeekStartDate = now.startOf('isoWeek');
        WeekStartDate = new Date(WeekStartDate.format('YYYY-MM-DD'))
        WeekStartDate.setHours(0, 0, 0, 0)
        var WeekEndDate = new Date(WeekStartDate);
        WeekEndDate.setDate(WeekStartDate.getDate() + 6);
        WeekEndDate.setHours(23, 59, 59, 999);
        // weekStartDate: moment(WeekStartDate).format('YYYY-MM-DD'),
        // weekEndDate: moment(WeekEndDate).format('YYYY-MM-DD'),
        // console.log("to the server", dd+"-"+mm+"-"+yyyy);
        let formdata = new FormData();
        // if (image == '') {
          formdata.append('activity_id', activity);
          formdata.append('point', points);
          formdata.append('date', `${yyyy}-${mm}-${dd}`);
          formdata.append('weekStartDate', moment(WeekStartDate).format('YYYY-MM-DD'));
          formdata.append('weekEndDate', moment(WeekEndDate).format('YYYY-MM-DD'));
          formdata.append('others_activity', otherActivity);
          formdata.append('note', comment);
          // formdata.append('comment',comment)
          formdata.append('image', {
                  uri: image.uri,
                name: 'image.jpg',
                type: 'image/jpeg',
              });
        // } else {
        //   formdata.append('activity_id', activity);
        //   formdata.append('point', points);
        //   formdata.append('date', `${yyyy}-${mm}-${dd}`);
        //   formdata.append('weekStartDate', moment(WeekStartDate).format('YYYY-MM-DD'));
        //   formdata.append('weekEndDate', moment(WeekEndDate).format('YYYY-MM-DD'));
        //   formdata.append('others_activity', otherActivity);
        //   formdata.append('note', note);
        //   formdata.append('image', {
        //     uri: image,
        //     name: 'image.jpg',
        //     type: 'image/jpeg',
        //   });
        // }
        console.log( "formdata log point",formdata);
        setLoading(true);
        fetch(base_url + 'point/log_point', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-access-token': JSON.parse(userMe).authtoken,
          },
          body: formdata,
        })
          .then((response) => response.json())
          .then(async (responseJson) => {
            if (responseJson.success) {
              setLoading(false);
              Toast.show('Points logged successfully.');
              props.navigation.navigate('PointsTab', {lognow:"lognow"});
            } else {
              setLoading(false);
              Toast.show(responseJson.message);
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
          });
      }
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log('point date----->', date);
    setDate(date);
    hideDatePicker();
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <Loader loading={loading} />
      <FlashMessage position="top" />
      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.imageContainer}
        resizeMode="stretch"
       >
        <Heading onPress={() => props.navigation.goBack()} />
     

        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
          behavior="padding">
             
          <ScrollView showsVerticalScrollIndicator={false}
          style={{}}>
            <View><Text style={{color:COLORS.GRAY,textAlign:'center',marginTop:'5%',marginBottom:'2%',fontFamily:FONT.FAMILY.ROBOTO_Regular}}>Log your exercise points here</Text></View>
            <View style={{}}>
                <TouchableOpacity
                  onPress={() => showDatePicker()}
                  style={{
                    backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
                    width: '80%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    height: 60,
                    marginVertical: 15,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: COLORS.BOARDERCOLOR,
                      paddingLeft: 12,
                      fontFamily: FONT.FAMILY.ROBOTO_Regular,
                      fontSize: FONT.SIZE.LARGE,
                    }}>
                    {isDate == '' ? 'Date' : getDate(isDate)}
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    width: '80%',
                    borderRadius: 10,
                    alignSelf: 'center',
                    backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
                    justifyContent: 'center',
                    height: 60,
                    marginVertical: 15,
                    marginBottom: 15,
                  }}>
                  {activityList.length != 0 && (
                    <RNPickerSelect
                      style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                          // top: 20,
                          // right: 10,
                          color: COLORS.WHITE,
                          backgroundColor: COLORS.WHITE,
                        },
                        placeholder: {
                          color:activity===null?COLORS.GRAY: COLORS.BOARDERCOLOR,
                          fontSize: 18,
                      
                        // backgroundColor:'red',
                      //  height:30
                          // fontWeight: 'bold',
                        },
                      }}
                      placeholderTextColor={COLORS.WHITE}
                      placeholder={{
                        label: 'Activity',
                        value: null,
                        color: 'grey',
                      }}
                      value={activity}
                      onValueChange={(value) => setActivity(value)}
                      items={activityList}
                    />
                  )}
                </View>

                {activity == '5f89a09648b94443130790a1' && (
                  <TextInput
                    placeholder="What activity?"
                    placeholderTextColor={COLORS.BOARDERCOLOR}
                    screenwidth="80%"
                    value={otherActivity}
                    onChangeText={(value) => setOtherActivity(value)}
                  />
                )}

                <TextInput
                  placeholder="Points (1 point per minute)"
                  placeholderTextColor={COLORS.GRAY}
                  screenwidth="80%"
                  value={points}
                  keyboard="number-pad"
                  onChangeText={(value) => setPoints(value)}
                  returnKeyType="done"
                />

            <View style={{borderBottomWidth:1,borderBottomColor:'#e0e0e0',marginVertical:10,width:'80%',alignSelf:'center'}} />

               <TextInput
                  placeholder="Add Comment (Optional)"
                  placeholderTextColor={COLORS.GRAY}
                  screenwidth="80%"
                  value={comment}
                  keyboard="default"
                  onChangeText={(value) => setComment(value)}
                  returnKeyType="done"
                />
 {sourseImage == '' ? (
         <TouchableOpacity
                 onPress={()=>setModal(true)}
                  style={{
                    backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
                    width: '80%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    height: 130,
                    marginTop: 15,
                    marginBottom:-10,
                    borderRadius: 10,
                  }}>
                    <View style={{width:20,height:20,alignSelf:'center',borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../Assets/plus.png')} style={{width:20,height:20,alignSelf:'center',tintColor:COLORS.GRAY}}/>
                    </View>
                  <Text
                    style={{
                      color:COLORS.GRAY,
                      textAlign:'center',
                    marginTop:5,
                      fontFamily: FONT.FAMILY.ROBOTO_Regular,
                      fontSize: FONT.SIZE.LARGE,
                    }}>
                    Add photo
                  </Text>
                </TouchableOpacity>
 ):(
   <View style={{alignItems:'center'}}>
    
 <Image source={{uri:sourseImage}} style={{width:'80%',height:180,borderRadius:10}}/>
 <TouchableOpacity style={{position:'absolute',right:'12%',top:'5%'}}
 onPress={()=>setSourseImages('')}>
       <Image source={require('../../Assets/LeagueTable/Cross.png')} style={{width:30,height:30,tintColor:COLORS.APPCOLORS}}/>
     </TouchableOpacity>
 </View>
)}
               
               <View style={{marginBottom:20}}>
                <Button
                  buttonWidth={WIDTH * 0.8}
                  lable="Log points"
                  onPress={() => handleSubmit()}
                  // onPress={()=> props.navigation.navigate("TabHome")}
                />
              </View>
            </View>


            <ImageModal
        visible={modal}
        bannerText={'Select team image'}
        cameraClick={() =>
          ImagePicker.launchCamera(
            {
              mediaType: 'photo',
              includeBase64: false,
              // maxHeight: 200,
              // maxWidth: 200,
            },
            (response) => {
              if (response.didCancel) {
                console.log('User cancelled photo picker');
                setModal(false);
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                setModal(false);
              } else if (response.customButton) {
                console.log(
                  'User tapped custom button: ',
                  response.customButton,
                );
                setModal(false);
              } else {
                // let source = response?.assets[0]?.uri;
                // let name = response?.assets[0]?.fileName;
                // let type = response?.assets[0]?.type;
                // console.log(response?.assets[0]?.uri, 'all data');
               
                setSourseImages(response.uri);
                setImages(response)
                setModal(false);
              }
            },
          )
        }
        libreryClick={() =>
          ImagePicker.launchImageLibrary(
            {
              mediaType: 'photo',
              includeBase64: false,
              // maxHeight: 200,
              // maxWidth: 200,
            },
            (response) => {
              if (response.didCancel) {
                console.log('User cancelled photo picker');
                setModal(false);
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                setModal(false);
              } else if (response.customButton) {
                console.log(
                  'User tapped custom button: ',
                  response.customButton,
                );
                setModal(false);
              } else {
                // let source = response?.assets[0]?.uri;
                // let name = response?.assets[0]?.fileName;
                // let type = response?.assets[0]?.type;
                // console.log(response?.assets[0]?.uri, 'all data');
                setSourseImages(response.uri);
                setImages(response)
                setModal(false);
              }
            },
          )
        }
        close={() => setModal(false)}
      />
          </ScrollView>

         
        </KeyboardAvoidingView>
       

      </ImageBackground>
   
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
}

const Heading = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: HEIGHT * 0.13,
      }}>
      <TouchableOpacity
        onPress={props.onPress}
        style={{width: '18%', alignItems: 'center'}}>
        <Image
          source={require('./../../Assets/Images/arrow_back.png')}
          resizeMode="contain"
          style={{width: 25, height: 25}}
        />
      </TouchableOpacity>
      <Text
        style={{
          color: COLORS.WHITE,
          width: '64%',
          fontFamily: FONT.FAMILY.ROBOTO_Medium,
          fontSize: FONT.SIZE.EXTRALARGE,
          textAlign: 'center',
        }}>
        Log points
      </Text>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    // borderWidth: 0.5,
    // borderColor: COLORS.LOGOCOLOR,
    borderRadius: 4,
    color: COLORS.LOGOCOLOR,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: COLORS.LOGOCOLOR,
    borderRadius: 8,
    color: COLORS.LOGOCOLOR,
    paddingBottom:15,
    // color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: HEIGHT * 0.75,
    marginTop: 30,
  },
  headingCont: {
    height: HEIGHT * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    color: COLORS.LOGOCOLOR,
    fontSize: FONT.SIZE.EXTRALARGE,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
  },
  imageContainer: {
    // width: WIDTH,
    // height: HEIGHT,
    flex:1,
    zIndex:999999
  },

});
