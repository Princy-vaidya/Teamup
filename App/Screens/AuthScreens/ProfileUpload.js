import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH,base_url} from './../../Utils/constants';
import TextInput from './../../Components/Common/InputText';
import Loader from './../../Components/Common/Loader';
import * as Animatable from 'react-native-animatable';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import Button from './../../Components/Common/button';
import Network from './../../Services/Network';
import AsyncStorage from '@react-native-community/async-storage';
import {loginUser, setLocation} from '../../Redux/Actions/authAction';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-root-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';

import messaging from '@react-native-firebase/messaging';

// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from "react-native-image-picker";

import Md5 from 'md5';
import ImageModal from '../../Components/Common/ImageModal';

export default function ProfileUpload(props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [modal,setModal]= useState(false);
  const [sourseImage, setImages] = useState('');


  const dispatch = useDispatch();

  useEffect(() => {
    // const userMe = await AsyncStorage.getItem('@user')
    requestCameraPermission();
     console.log('user email',props.route.params.email,props.route.params.md_password)
  }, []);

  
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message:"App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onSkip = async() => {
    setLoading(true);
    const data = {
        email: props.route.params.email.replace(/ /g, ''),
        md_password: props.route.params.md_password,
        devicetoken: await AsyncStorage.getItem("fcmtoken"),
        apptype: Platform.OS == 'ios' ? 'IOS' : 'ANDROID'
    };

console.log("skip----------",data)

    Network('user/user_login', 'post', data)
        .then(async (res) => {
            setLoading(false);
            console.log('skip',res)
            if (res.success) {
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
                // Toast.show('Wrong email or password !');
            }
        })
        .catch((error) => {
            setLoading(false);
        });
}

const onUploadPic=async()=>{
  // console.log('image',sourseImage)
  
  //     const userDetail = await AsyncStorage.getItem('userDetail');
    
  //      console.log('userDetail',JSON.parse(userDetail)._id)
  //         setLoading(true);
  //         let formdata = new FormData();
           
  //           formdata.append('image', {
  //             uri: sourseImage,
  //             name: 'image.jpg',
  //             type: 'image/jpeg',
  //           });
  //           formdata.append('user_id',JSON.parse(userDetail)._id );
          
  //          console.log('........>', formdata);

  //         fetch(base_url + '/user/user_image_upload', {
  //           method: 'POST',
  //           headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'multipart/form-data',
  //             // 'x-access-token': JSON.parse(userMe).authtoken,
  //           },
  //           body: JSON.parse(formdata),
  //         })
  //           .then((response) => response.json())
  //           .then(async (responseJson) => {
  //             console.log('responseJson---->', responseJson);
  //             if (responseJson.response_code == 2000) {
  //               setLoading(false);
  //              Toast.show(responseJson.message);
  //              onSkip();
  //             } else {
  //               setLoading(false);
  //             }
  //           })
  //           .catch((error) => {
  //             setLoading(false);
  //             console.log('error',error)
  //           });

  const userMe = await AsyncStorage.getItem('@user')

        
  if (sourseImage == '') {
    Toast.show('Image is required');
  } else {
    setLoading(true);

    let formdata = new FormData();

   
      formdata.append('email',  props.route.params.email.replace(/ /g, ''))
      formdata.append('first_name', props.route.params.firstname);
      formdata.append('last_name', props.route.params.lastname);
      formdata.append('profile_image', {
        uri: sourseImage,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
  

    fetch(base_url + 'user/user_update', {
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
        console.log('responseJson---->', responseJson);
        if (responseJson.response_code == 2000) {
          setLoading(false);
          dispatch(loginUser(responseJson.data.user_details));
          onSkip()
          await AsyncStorage.setItem(
            '@user',
            JSON.stringify(responseJson.data.user_details),
          );
          Toast.show(responseJson.message);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }

}

  return (
    <>
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <Loader loading={loading} />

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
                setImages(response.uri);
                setModal(false);
              }
            },
          )
        }
        close={() => setModal(false)}
      />

      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.container}
        resizeMode="stretch">

         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}> 
         <TouchableOpacity
         onPress={()=>props.navigation.goBack()}>
           <Image source={require('../../Assets/Images/Backarrow.png')}
           style={{width:30,height:20,marginLeft:10}}/>
         </TouchableOpacity>
        <Logo />
        <TouchableOpacity
        style={{marginRight:10}}
        onPress={()=>onSkip()}>
        <Text style={{color:'white',fontSize:18,
        fontFamily:FONT.FAMILY.ROBOTO_Medium}}>Skip</Text>
        </TouchableOpacity>
        </View>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
         
           

          {/* <TouchableOpacity
              onPress={() => setModal(true)}
              style={{
                top: -35,
                alignItems: 'flex-end',
                // width: HEIGHT * 0.15,
                left:30,
                justifyContent: 'center',
                backgroundColor:'white',
                borderRadius:30
             }}>
              <AntDesign name="pluscircle" size={45} color={COLORS.APPCOLORS} style={{}} />
            </TouchableOpacity> */}



     <View
              style={{
                width: HEIGHT * 0.18,
                justifyContent: 'center',
                alignItems: 'center',
                height: HEIGHT * 0.18,
                backgroundColor: COLORS.APPCOLORS,
                borderRadius: (HEIGHT * 0.18) / 2,
                // borderWidth: 2,
                fontFamily: FONT.FAMILY.ROBOTO_Regular,
              }}>
                {sourseImage===""?
 <Text style={{color:'white',fontSize:34,fontFamily:FONT.FAMILY.ROBOTO_Bold}}>
 {props.route.params.firstname.charAt(0)}{props.route.params.lastname.charAt(0)}
 </Text>

                :
                <Image
                resizeMode="cover"
                source={{uri: sourseImage}}
                style={{
                  width: HEIGHT * 0.175,
                  height: HEIGHT * 0.175,
                  borderRadius: (HEIGHT * 0.175) / 2,
                }}
              />}
            </View>

            <TouchableOpacity
              onPress={() => setModal(true)}
              style={{
                top: -35,
                alignItems: 'flex-end',
                // width: HEIGHT * 0.15,
                left:30,
                justifyContent: 'center',
                backgroundColor:'white',
                borderRadius:30,
                borderWidth:1,
                borderColor:'white'
             }}>
              <AntDesign name="pluscircle" size={35} color={COLORS.APPCOLORS} style={{}} 
               onPress={() => setModal(true)}/>
            </TouchableOpacity>
            <View style={{ alignItems: 'center'}}>
            {/* <Text style={{fontFamily:FONT.FAMILY.ROBOTO_Medium,fontSize:20}}>Princy Vaidya</Text> */}
            <Text
              style={{fontFamily: FONT.FAMILY.ROBOTO_Regular, 
              fontSize: 16,
              borderBottomWidth:1,
              borderColor:COLORS.APPCOLORS,
              color:COLORS.APPCOLORS,
              fontFamily:FONT.FAMILY.MEDIUM
              }}>
              Add Profile Picture
            </Text>
          </View>
        </View>
      
        <View style={{marginBottom: 30}}>
          <Button
            buttonWidth="80%"
            onPress={()=>onUploadPic()}
            lable="Register"
          />
        </View>
      </ImageBackground>
    </>
  );
}

const RememberMe = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
      }}>
      <View style={styles.remembercontainer}>
        <CheckBox
          disabled={false}
          value={props.value}
          boxType="square"
          style={{marginHorizontal: 10, color: '#fff'}}
          tintColors={{true: COLORS.SECONDARY, false: COLORS.SECONDARY}}
          offAnimationType="flat"
          checkboxSize={10}
          CheckboxIconSize={10}
          onValueChange={(newValue) => props.onValueChange(newValue)}
        />

        <Text style={[styles.remText, {color: COLORS.TEXTCOLORS}]}>
          Remember me
        </Text>
      </View>

      <TouchableOpacity onPress={props.handleOnPress}>
        <Text style={styles.remText}>Forgot password</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },
  subContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  logo: {
    width: WIDTH * 0.26,
    height: HEIGHT * 0.08,
  },
  logoContainer: {
    // width: WIDTH,
    height: HEIGHT * 0.14,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingLeft: 35,
  },
  remembercontainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 25,
  },
  remText: {
    color: COLORS.APPCOLORS,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: FONT.SIZE.MEDIUM,
  },
  subView: {},
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
    color: COLORS.TEXTCOLORS,
  },
});
