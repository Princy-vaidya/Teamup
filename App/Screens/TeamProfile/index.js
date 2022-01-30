import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  Share,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Permission
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH, base_url} from './../../Utils/constants';
import Loader from './../../Components/Common/Loader';
import Button from './../../Components/Common/button';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import Network from './../../Services/Network';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from "react-native-image-picker";


import ImageModal from '../../Components/Common/ImageModal';

export default function TeamsProfile(props) {
  const [loading, setLoading] = useState(false);
  const [sourseImage, setImages] = useState('');
  const [teamList, setTeamList] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    requestCameraPermission()
    getTeamList();
  }, []);

  // ************************************Team list*********************************************

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
  const getTeamList = async () => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      setLoading(true);
      const data = {
        authToken: JSON.parse(userMe).authtoken,
      };
      Network('league/league_list', 'post', data)
        .then(async (res) => {
          console.log('league_list--->', res);
          if (res.success) {
            if (res.data.docs.length != 0) {
              setTeamList(res.data.docs[0]);
              getUniqueTeamCode(res.data.docs[0]);
            }
          } else {
            Toast.show(res.message);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  const handleSubmit = async () => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      if (sourseImage == '') {
        Toast.show('Image is required');
      } else {
        setLoading(true);
        console.log('teamList====>', teamList.league_id);

        let formdata = new FormData();
        if (sourseImage != '') {
          formdata.append(
            'league_name',
            teamList && teamList.league.league_name,
          );
          formdata.append('league_id', teamList && teamList.league_id);
          formdata.append('image', {
            uri: sourseImage,
            name: 'image.jpg',
            type: 'image/jpeg',
          });
        }

        console.log('formdata=====>', formdata);

        fetch(base_url + 'league/league_add_edit', {
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
              props.navigation.navigate('AddTeamMember');
              Toast.show(responseJson.message);
            } else {
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      }
    }
  };

  //**************************************************************/

  const handleImagepicker = () => {
    const options = {
      title: 'Select team image',
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

  return (
    <>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
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
        style={styles.imageContainer}
        resizeMode="stretch">
        <Heading onPress={() => props.navigation.navigate('Team')} />

        <ScrollView>
          <View style={styles.subContainer}>
            <View
              style={{
                height: HEIGHT * 0.2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#B1B0B7',
                  width: WIDTH * 0.6,
                  fontSize: FONT.SIZE.MEDIUM,
                  textAlign: 'center',
                  fontFamily: FONT.FAMILY.ROBOTO_Regular,
                }}>
                Your team photo will be displayed for all team members
              </Text>
            </View>

            <View
              style={{
                width: HEIGHT * 0.18,
                justifyContent: 'center',
                alignItems: 'center',
                height: HEIGHT * 0.18,
                borderColor: COLORS.APPCOLORS,
                borderRadius: (HEIGHT * 0.18) / 2,
                borderWidth: 2,
                fontFamily: FONT.FAMILY.ROBOTO_Regular,
              }}>
              {sourseImage == '' ? (
                <Image
                  resizeMode="contain"
                  source={require('./../../Assets/Home/IconTeamOrange.png')}
                  style={{width: 80, height: 80}}
                />
              ) : (
                <Image
                  resizeMode="cover"
                  source={{uri: sourseImage}}
                  style={{
                    width: HEIGHT * 0.175,
                    height: HEIGHT * 0.175,
                    borderRadius: (HEIGHT * 0.175) / 2,
                  }}
                />
              )}
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
                borderRadius:30
             }}>
              <AntDesign name="pluscircle" size={45} color={COLORS.APPCOLORS} style={{}} />
            </TouchableOpacity>

            <Button
              buttonWidth={WIDTH * 0.8}
              lable="Create team"
              onPress={() => handleSubmit()}
            />

            <TouchableOpacity
              onPress={() => props.navigation.navigate('AddTeamMember')}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  padding: 25,
                  fontFamily: FONT.FAMILY.ROBOTO_Regular,
                  fontSize: FONT.SIZE.LARGE,
                  color: COLORS.APPCOLORS,
                }}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
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
          width: '75%',
          fontFamily: FONT.FAMILY.ROBOTO_Medium,
          fontSize: FONT.SIZE.EXTRALARGE,
          textAlign: 'center',
        }}>
        Team photo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: COLORS.BACKGROUNDCOLOR,
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: WIDTH,
    height: HEIGHT * 0.8,
  },
  centeredView: {
    height: HEIGHT,
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    height: HEIGHT * 0.4,
    width: WIDTH * 0.9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: WIDTH,
    height: HEIGHT,
  },
  placeholderText: {
    color: COLORS.SECONDARY,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    textAlign: 'left',
    fontSize: FONT.SIZE.MEDIUM,
    paddingLeft: 45,
  },
});
