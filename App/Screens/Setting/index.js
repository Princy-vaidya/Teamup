import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  PermissionsAndroid

} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH} from './../../Utils/constants';
import TextInput from './../../Components/Common/InputText';
import Loader from './../../Components/Common/Loader';
import Button from './../../Components/Common/button';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-root-toast';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from "react-native-image-picker";

import {useDispatch} from 'react-redux';
import {userProfiles} from '../../Redux/Actions/authAction';
import * as Animatable from 'react-native-animatable';
import {base_url} from './../../Utils/constants';
import {loginUser, setLocation} from '../../Redux/Actions/authAction';
import ProgressiveImage from '../../Components/Common/PrograssiveImage';
import ImageModal from '../../Components/Common/ImageModal';



export default function ProfileScreens(props) {
  const [userMe, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [sourseImage, setImages] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {

    requestCameraPermission()
    getUser();
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


  const getUser = async () => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      setUser(JSON.parse(userMe));
      setEmail(JSON.parse(userMe).email);

      setLoading(true);
      var data = {
        authToken: JSON.parse(userMe).authtoken,
        user_id: JSON.parse(userMe)._id,
      };

      Network('user/user_details', 'post', data)
        .then(async (res) => {
          console.log('res user profiles details------>', JSON.stringify(res));
          if (res.success) {
            setLoading(false);
            setLastname(res.data.user_details.last_name);
            setFirstname(res.data.user_details.first_name);
            setImages(res.data.user_details.image);
            console.log('image profile',res.data.user_details.image)
            const proflesData = {
              name:
                res.data.user_details.first_name +
                ' ' +
                res.data.user_details.last_name,
              image: res.data.user_details.image,
            };
            await AsyncStorage.setItem(
              '@userProfiles',
              JSON.stringify(proflesData),
            );
            dispatch(userProfiles(proflesData));
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

  const handleProfileImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
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

  const ProfileImage = (props) => {
    return (
      <View>
        <View style={styles.mainImageView}>
          {props.imagePath===""?
          <View style={{width:120,height:120,borderRadius:120/2,backgroundColor:COLORS.APPCOLORS,alignItems:'center',justifyContent:'center'}}>
          <Text style={{color:'white',fontSize:34,fontFamily:FONT.FAMILY.ROBOTO_Bold}}
          >{props.firstname.charAt(0)}{props.lastname.charAt(0)}</Text>
          </View>
          :
          <ProgressiveImage
            defaultImageSource={require('./../../Assets/UserIcon.png')}
            source={{
              uri: props.imagePath,
            }}
            style={{width: 120, height: 120, borderRadius: 120 / 2}}
            resizeMode="cover"
          />}
          {/* <Image
            resizeMode={'cover'}
            source={
              props.imagePath
                ? {uri: props.imagePath}
                : {uri: 'https://i.stack.imgur.com/l60Hf.png'}
            }
            style={{width: 120, height: 120, borderRadius: 120 / 2}}
          /> */}
          <TouchableOpacity onPress={props.onPress} style={[styles.imageIcon,{borderWidth:1,borderColor:'white'}]}>
            <Image
              source={require('./../../Assets/Images/edit.png')}
              style={{width: 15, height: 15,}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleSubmit = () => {
    if (firstname == '') {
      Toast.show('First name is required');
    } else if (lastname == '') {
      Toast.show('Last name is required');
    } else {
      setLoading(true);

      let formdata = new FormData();

      if (sourseImage != '') {
        formdata.append('email', email);
        formdata.append('first_name', firstname);
        formdata.append('last_name', lastname);
        formdata.append('profile_image', {
          uri: sourseImage,
          name: 'image.jpg',
          type: 'image/jpeg',
        });
      } else {
        formdata.append('email', email);
        formdata.append('first_name', firstname);
        formdata.append('last_name', lastname);
      }

      fetch(base_url + 'user/user_update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'x-access-token': userMe.authtoken,
        },
        body: formdata,
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          console.log('responseJson---->', responseJson);
          if (responseJson.response_code == 2000) {
            setLoading(false);
            dispatch(loginUser(responseJson.data.user_details));
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
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
      <Loader loading={loading} />
      <ImageModal
        visible={modal}
        bannerText={"Upload Profile Image"}
        cameraClick={()=> ImagePicker.launchCamera(
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
              setModal(false)
            }
            else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
              setModal(false)
            }
            else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
              setModal(false)
            }
            else {
              // let source = response?.assets[0]?.uri;
              // let name = response?.assets[0]?.fileName;
              // let type = response?.assets[0]?.type;
              setImages(response.uri)
              setModal(false)
            }
          },
        )}
        libreryClick={()=> ImagePicker.launchImageLibrary(
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
              setModal(false)
            }
            else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
              setModal(false)
            }
            else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
              setModal(false)
            }
            else {
              // let source = response?.assets[0]?.uri;
              // let name = response?.assets[0]?.fileName;
              // let type = response?.assets[0]?.type;
              // console.log(response?.assets[0]?.uri, "all data");
              setImages(response.uri)
              setModal(false)
            }
          },
        )}
        close={()=> setModal(false)}
      />
      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.container}
        resizeMode="stretch">
        <Heading onPress={() => props.navigation.navigate('TabHome')} />

        <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
              style={styles.container}
              keyboardVerticalOffset={HEIGHT}
              behavior="padding"
              >
          <View style={styles.container}>
           
            <ProfileImage
              onPress={() => setModal(true)}
              imagePath={sourseImage}
              firstname={firstname}
              lastname={lastname}
            />

            {firstname.length != 0 && (
              <Text style={styles.placeholderText}>{'FIRST NAME'}</Text>
            )}

            <TextInput
              placeholder="FIRST NAME"
              placeholderTextColor="#e9e9e9"
              screenwidth="80%"
              value={firstname}
              onChangeText={(values) => setFirstname(values)}
            />

            {lastname.length != 0 && (
              <Text style={styles.placeholderText}>{'LAST NAME'}</Text>
            )}

            <TextInput
              placeholder="LAST NAME"
              placeholderTextColor="#e9e9e9"
              screenwidth="80%"
              value={lastname}
              onChangeText={(values) => setLastname(values)}
              type="caps letter"

            />

            {email.length != 0 && (
              <Text style={styles.placeholderText}>{'Email'}</Text>
            )}

            <TextInput
              placeholder="Email"
              placeholderTextColor={COLORS.TEXTCOLORS}
              screenwidth="80%"
              value={email}
              editable={false}
              onChangeText={(values) => setEmail(values)}
              type="caps letter"

            />

            <Button
              buttonWidth="80%"
              onPress={() => handleSubmit()}
              lable="SAVE"
            />
          </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>
    </>
  );
}

const Heading = (props) => {
  return (
    <View style={styles.headingCont}>
      <TouchableOpacity
        style={{alignItems: 'flex-start'}}
        onPress={props.onPress}>
        <Image
          source={require('./../../Assets/Images/arrow_back.png')}
          style={{width: 25, height: 25}}
        />
      </TouchableOpacity>
      <View style={{alignItems: 'center', width: WIDTH * 0.85}}>
        <Text style={styles.headingText}>Profile</Text>
      </View>
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
  },
  headingCont: {
    height: HEIGHT * 0.15,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: WIDTH * 0.95,
  },
  headingText: {
    color: COLORS.WHITE,
    fontSize: FONT.SIZE.EXTRALARGE,
    textAlign: 'center',
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
  },
  subContainerView: {
    marginLeft: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  feedView: {
    borderRadius: 5,
    borderColor: '#ffe900',
    borderWidth: 3,
    width: WIDTH * 0.415,
    height: HEIGHT * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  feedText: {
    color: '#e9e9e9',
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
    fontSize: FONT.SIZE.EXTRALARGE,
  },
  boxViewposition: {
    position: 'absolute',
  },
  imageStyle: {
    width: 70,
    height: 70,
  },
  placeholderText: {
    color: COLORS.SECONDARY,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    textAlign: 'left',
    fontSize: FONT.SIZE.MEDIUM,
    paddingLeft: 45,
  },
  mainImageView: {
    height: HEIGHT * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    backgroundColor: COLORS.APPCOLORS,
    borderRadius: 35 / 2,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    top: -30,
    right: -30,
  },
});
