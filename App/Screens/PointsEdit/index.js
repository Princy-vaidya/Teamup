import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH} from './../../Utils/constants';
import TextInput from './../../Components/Common/InputText';
import Loader from './../../Components/Common/Loader';
import * as Animatable from 'react-native-animatable';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Button from './../../Components/Common/button';
import RNPickerSelect from 'react-native-picker-select';
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from "react-native-image-picker";
import {base_url} from './../../Utils/constants';
import ImageModal from '../../Components/Common/ImageModal';
import ImageLoad from 'react-native-image-placeholder';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function PointEdit(props) {
  console.log('navigation form pro', props.navigation.navigate);
  const [activity, setActivity] = React.useState(null);
  const [points, setPoints] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [activityList, setActivityList] = useState([]);
  const [otherActivity, setOtherActivity] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDate, setDate] = useState(new Date());
  const [pointsData, setPointsData] = useState('');
  const [note, setNote] = useState('');
  const [image, setImages] = useState('');
  const [point_id, setPointsId] = useState('');
  const [comment, setComment] = useState('');
  const [sourseImage, setSourseImages] = useState('');
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getActivityApi();
  }, []);

  const getActivityApi = async () => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      const {params} = props.route;

      console.log('params--->', params.PointsData);

      setPointsData(params.PointsData);
      setActivity(params.PointsData.activity_id);
      setPoints(params.PointsData.point);
      setDate(params.PointsData.date);
      setComment(params.PointsData.note);
      setImages(params.PointsData.image);
      setSourseImages(params.PointsData.image);

      setPointsId(params.PointsData._id);
      setOtherActivity(params.PointsData.others_activity);
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
          Toast.show('Something went wrong !');
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

  const handleSubmit = async () => {
    const userMe = await AsyncStorage.getItem('@user')
    if (userMe) {
      if (activity == null) {
        Toast.show('Activity is required !')
      } else
        if (points.length == '') {
          Toast.show('Point is required !')
        } else {
          setLoading(true)

          let formdata = new FormData();
          formdata.append('user_id', JSON.parse(userMe)._id)
            formdata.append('_id', point_id)
            formdata.append('activity_id', activity)
            formdata.append('point', points)
            // formdata.append('date', sendDate(isDate))
            formdata.append('others_activity', activity == '5f89a09648b94443130790a1' ? otherActivity : null)
            formdata.append('note', comment)
            if(image =="" || image==null) {
            formdata.append('image', '')
            }else{
            formdata.append('image', {
                  uri:image,
                  name: 'image.jpg',
                  type: 'image/jpeg',
                });
             
              }
          console.log('formdata-->', formdata)
          setLoading(true)


          fetch(base_url + 'point/update-points', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              'x-access-token': JSON.parse(userMe).authtoken
            },
            body: formdata,
          })
            .then((response) => response.json())
            .then(async (responseJson) => {
              setLoading(true)

              console.log("responseJson----------->", responseJson);
              if (responseJson.success) {
                setLoading(false)
                Toast.show('Points logged successfully');
                props.navigation.navigate('PointsTab')
              } else {
                setLoading(false)
                Toast.show('Something went wrong !');
              }
            })
            .catch((error) => {
              setLoading(false)
              // Toast.show('Something went wrong !');
              console.error(error);
            });
        }
    }
  }

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <Loader loading={loading} />
      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.imageContainer}
        resizeMode="stretch"
       >
        <Heading onPress={() => props.navigation.navigate('PointsTab')} />
     

        {/* <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
          behavior="padding">
             
          <ScrollView showsVerticalScrollIndicator={false}
          style={{}}> */}
                    <ScrollView keyboardShouldPersistTaps='always'>

<KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}
        >
       
          <Animatable.View animation="fadeInDown" style={styles.subContainer}>
            {/* <View><Text style={{color:COLORS.GRAY,textAlign:'center',marginTop:'5%',marginBottom:'5%',fontFamily:FONT.FAMILY.ROBOTO_Regular}}>Log your exercise points here</Text></View> */}
            <View style={{flex:1,width:'100%'}}>
                <TouchableOpacity
                  onPress={() => showDatePicker()}
                  style={{
                    backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
                    width: '80%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    height: 60,
                    marginVertical: 10,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: COLORS.BOARDERCOLOR,
                      paddingLeft: 12,
                      fontFamily: FONT.FAMILY.ROBOTO_Regular,
                      fontSize: FONT.SIZE.MEDIUM,
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
                    marginVertical: 5,
                    marginBottom: 5,
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
                          fontSize: 20,
                      
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
                  <View style={{marginTop:-5,marginBottom:-7}}>
                  <TextInput
                    placeholder="What activity?"
                    placeholderTextColor={COLORS.BOARDERCOLOR}
                    screenwidth="80%"
                    value={otherActivity}
                    onChangeText={(value) => setOtherActivity(value)}
                    type="caps letter"

                  />
                
                </View>)}
                <View style={{marginTop:-5}}>

                <TextInput
                  placeholder="Points (1 per minute)"
                  placeholderTextColor={COLORS.GRAY}
                  screenwidth="80%"
                  value={String(points)}
                  keyboard="number-pad"
                  onChangeText={(value) => setPoints(value)}
                  returnKeyType="done"
                />
                </View>

            <View style={{borderBottomWidth:1,borderBottomColor:'#e0e0e0',marginVertical:5,width:'80%',alignSelf:'center'}} />

               <TextInput
                  placeholder="Add comment (Optional)"
                  placeholderTextColor={COLORS.GRAY}
                  screenwidth="80%"
                  value={comment}
                  keyboard="default"
                  onChangeText={(value) => setComment(value)}
                  returnKeyType="done"
                  type="caps letter"
                />
                 {sourseImage == '' || sourseImage == null ? (
                  <TouchableOpacity
                    onPress={() => setModal(true)}
                    style={{
                      backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
                      width: '80%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      height: 185,
                      marginTop: 15,
                      marginBottom: -10,
                      borderRadius: 10,
                    }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        alignSelf: 'center',
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../../Assets/plus.png')}
                        style={{
                          width: 20,
                          height: 20,
                          alignSelf: 'center',
                          tintColor: COLORS.GRAY,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: COLORS.GRAY,
                        textAlign: 'center',
                        marginTop: 5,
                        fontFamily: FONT.FAMILY.ROBOTO_Regular,
                        fontSize: FONT.SIZE.LARGE,
                      }}>
                      Add photo
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{alignItems: 'center'}}>
                    <ImageLoad
                      source={{uri: sourseImage}}
                      resizeMode="cover"
                      style={{width: '80%', height: 200, borderRadius: 10}}
                      borderRadius={10}
                      loadingStyle={{size: 'small', color: 'green'}}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        right: '12%',
                        marginTop: '3%',
                      }}>
                      <TouchableOpacity
                        style={{}}
                        onPress={() => setSourseImages('')}>
                        <Image
                          source={require('../../Assets/LeagueTable/Cross.png')}
                          style={{
                            width: 30,
                            height: 30,
                            tintColor: COLORS.APPCOLORS,
                          }}
                        />
                      </TouchableOpacity>
                      </View>
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
                      includeBase64:true,
                      maxHeight: 200,
                      maxWidth: 200,
                      quality:0.8
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
                        setImages(response.uri);
                        setModal(false);
                      }
                    },
                  )
                }
                libreryClick={() =>
                  ImagePicker.launchImageLibrary(
                    {
                      mediaType: 'photo',
              includeBase64:true,
              maxHeight: 200,
              maxWidth: 200,
              quality:0.8
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
                        setImages(response.uri);
                        setModal(false);
                      }
                    },
                  )
                }
                close={() => setModal(false)}
              />
          {/* </ScrollView>

         
        </KeyboardAvoidingView> */}
       
       </Animatable.View>
              </KeyboardAwareScrollView>      
              </ScrollView>
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
    // <View
    //   style={{
    //     flexDirection: 'row',
    //     backgroundColor:'red',
    //     alignItems: 'center',
    //     height: HEIGHT * 0.13,
    //     marginLeft:20
    //   }}>
    //   <TouchableOpacity
    //     onPress={props.onPress}
    //     style={{width: '30%', alignItems: 'center'}}>
    //     <Image
    //       source={require('./../../Assets/Images/arrow_back.png')}
    //       resizeMode="contain"
    //       style={{width: 30, height: 25}}
    //     />
    //   </TouchableOpacity>
    //   <Text
    //     style={{
    //       color: COLORS.WHITE,
    //       width: '64%',
    //       fontFamily: FONT.FAMILY.ROBOTO_Medium,
    //       fontSize: FONT.SIZE.EXTRALARGE,
    //       textAlign: 'center',
    //     }}>
       
    //    Log Points
       
    //   </Text>
    // </View>

    <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: HEIGHT * 0.13,
          }}>
          <TouchableOpacity
            onPress={props.onPress}
            style={{padding: 25, width: '3%'}}>
            <Image
              source={require('./../../Assets/Images/arrow_back.png')}
              resizeMode="contain"
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: COLORS.WHITE,
              width: '70%',
              fontFamily: FONT.FAMILY.ROBOTO_Medium,
              fontSize: FONT.SIZE.EXTRALARGE,
              textAlign: 'center',
            }}>
            Edit Points
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
    fontSize: 22,
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
  // container: {
  //   flex: 1,
  // },
  // subContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: HEIGHT * 0.75,
  //   marginTop: 30,
  // },

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
