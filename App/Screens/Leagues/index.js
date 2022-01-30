import React, {useState, useEffect} from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH, IAMGE_URL} from './../../Utils/constants';
// import TextInput from './../../Components/Common/InputText';
import Loader from './../../Components/Common/Loader';
import * as Animatable from 'react-native-animatable';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from './../../Components/Common/button';
import AsyncStorage from '@react-native-community/async-storage';
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {setUserProfiles} from '../../Redux/Actions/authAction';
import JoinTeamModal from './../../Components/Common/JoinTeam';

import ProgressiveImage from '../../Components/Common/PrograssiveImage';
import { registerPlaybackService } from 'react-native-track-player';



export default function LeaguesScreens(props) {
  const [loading, setLoading] = useState(true);
  const [leagueList, setLeagueList] = useState([]);
  const [userId, setUser] = useState('');
  const [teamCode, setTeamcode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleShare, setModalVisibleShare] = useState(false);
  const [UniqueCode, setUniqueCode] = useState(null);
  const [modalDoneShare,setModalDoneShare]=useState(false)
  const [modalVisibleCongo, setModalVisibleCongo] = useState(false)


  useEffect(() => {
    getApiCalling();
  }, []);

  const getApiCalling = async () => {
    props.navigation.addListener('focus', async () => {
      const userMe = await AsyncStorage.getItem('@user');

      if (userMe) {
        setUser(JSON.parse(userMe)._id);
        setLoading(true);
        const data = {
          authToken: JSON.parse(userMe).authtoken,
        };
        Network('league/league_list', 'post', data)
          .then(async (res) => {
            console.log('league_list--->', res);
            if (res.success) {
              if (res.data.docs.length != 0) {
                setLeagueList(res.data.docs);
              }
            } else {
              Toast.show(res.message);
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Toast.show('error');
          });
      }
    });
  };

  const ApiCalling = async () => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      setLoading(true);
      const data = {
        authToken: JSON.parse(userMe).authtoken,
      };
      Network('league/league_list', 'post', data)
        .then(async (res) => {
          console.log('res--->', res);
          if (res.success) {
            if (res.data.docs.length != 0) {
              setLeagueList(res.data.docs);
            }
          } else {
            Toast.show(res.message);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toast.show('error');
        });
    }
  };

  const handleLeagueList = (item) => {
    props.navigation.navigate('TeamMember', {leagueData: item});
  };

  const deleteApi = async (value) => {
    const userMe = await AsyncStorage.getItem('@user');
    if (userMe) {
      setLoading(true);
      const data = {
        league_id: value.league_id,
        authToken: JSON.parse(userMe).authtoken,
      };

      Network('league/delete_league', 'post', data)
        .then(async (res) => {
          console.log('res delete league--->', JSON.stringify(res));
          if (res.success) {
            ApiCalling();
            Toast.show('Team deleted');
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toast.show('error');
        });
    }
  };

  // ...............................................................................

  const handleTeamCode = async () => {
    if (teamCode.length == 0) {
      Toast.show('Please enter you team code!');
    } else {
      const userMe = await AsyncStorage.getItem('@user');
      if (userMe) {
        setLoading(true);
        const data = {
          unique_team_code: teamCode,
          member_id: JSON.parse(userMe)._id,
          authToken: JSON.parse(userMe).authtoken,
        };
        console.log('data--->', data);

        Network('league/join-member-by-unique-team-code', 'post', data)
          .then(async (res) => {
            console.log('res team code-->', JSON.stringify(res));
            if (res.success) {
              Toast.show('' + res.message);
              setModalVisible(false);
              ApiCalling();
            } else {
              setModalVisible(false);
              setLoading(false);
              Toast.show('' + res.message);
            }
          })
          .catch((error) => {
            setModalVisible(false);
            setLoading(false);
            Toast.show('error');
          });
      }
    }
  };

  const handleTUniqueTeamCode = async () => {
    try {
      // const result = await Share.share({
      //   message: `This is a unique team code:- ${UniqueCode}`,
      //   url: 'https://play.google.com/store/apps/details?id=com.teamup',
      //   title: 'Join my TeamUp team',
      // });
      const result = await Share.share({
        title: 'Join my TeamUp team!',
        // message: `Join me on TeamUp! Get TeamUp :https://play.google.com/store/apps/details?id=com.teamup,\r\n My team code - ${UniqueCode}`,
       message: `I want you in my team!\r\n\r\nhttps://www.teamup-theapp.com/jointeam\r\n\r\nTeam code:${UniqueCode}\r\n\r\nLet's get moving!`,
      //   url: 'https://play.google.com/store/apps/details?id=com.teamup',
        url:'https://www.teamup-theapp.com/jointeam'
      })
      setModalDoneShare(true)
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <Loader loading={loading} />

      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.imageContainer}
        resizeMode="stretch">
        <Heading onPress={() => props.navigation.toggleDrawer()} />

        <View
          style={{
            width: WIDTH,
            alignItems: 'center',
            marginTop: 45,
            backgroundColor: '#F9FAFB',
          }}>
          <View style={{height: HEIGHT * 0.575}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {leagueList.length != 0 ? (
                leagueList.map((item) => {
                  return (
                    <View style={{marginBottom: 15}}>
                      <View style={styles.liststyle}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            width: WIDTH * 0.75,
                            alignItems: 'center',
                          }}
                          onPress={() => handleLeagueList(item)}
                          activeOpacity={0.6}>
                          <View style={styles.imageComponent}>
                            {item && item.league.image == null ? (
                              <Image
                                resizeMode="cover"
                                source={{
                                  uri: 'https://i.stack.imgur.com/l60Hf.png',
                                }}
                                style={styles.imagestyle}
                              />
                            ) : (
                              <ProgressiveImage
                                defaultImageSource={require('./../../Assets/UserIcon.png')}
                                source={{
                                uri: item.league.image,
                                }}
                                style={{height: 70, width: 70, borderRadius: 70 / 2}}
                                resizeMode="cover"
                            />
                              
                            )}
                          </View>

                          <View style={{paddingLeft: 10}}>
                            <Text style={styles.cellText}>
                              {item.league.league_name}
                            </Text>
                            <Text
                              style={{
                                color: '#B1B0B7',
                                paddingTop: 8,
                                fontFamily: FONT.FAMILY.ROBOTO_Regular,
                                fontSize: FONT.SIZE.MEDIUM,
                              }}>
                              Leader
                            </Text>
                            <Text style={styles.lowerText}>
                              {item && JSON.stringify(item.winner) == '{}'
                                ? ''
                                : item.winner && item.winner.name}
                              <Text style={{color: COLORS.BLACK }}>
                                {' '}
                                {item && JSON.stringify(item.winner) == '{}'
                                  ? ''
                                  : item.winner.point < 150
                                  ? item.winner.point + ' Points'
                                  : item.winner.point + ' Points'}
                              </Text>
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              ) : (
                <>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: HEIGHT * 0.6,
                      width: WIDTH,
                    }}>
                    <Text
                      style={{
                        color: '#B1B0B7',
                        fontFamily: FONT.FAMILY.ROBOTO_Regular,
                        fontSize: FONT.SIZE.LARGE,
                      }}>
                      Get started by joining or creating a team!
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>

          {leagueList.length != 0 ? (
            <View
              style={{
                width: WIDTH * 0.85,
                height: HEIGHT * 0.15,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalVisible(true)}
                style={{
                  backgroundColor: COLORS.APPCOLORS,
                  borderRadius: 10,
                  width: WIDTH * 0.4,
                  height: HEIGHT * 0.08,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.WHITE,
                    fontSize: FONT.SIZE.LARGE,
                    fontFamily: FONT.FAMILY.ROBOTO_Regular,
                  }}>
                  Join team
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => props.navigation.navigate('CreateTeam')}
                style={{
                  borderColor: COLORS.APPCOLORS,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: WIDTH * 0.4,
                  height: HEIGHT * 0.08,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.APPCOLORS,
                    fontSize: FONT.SIZE.LARGE,
                    fontFamily: FONT.FAMILY.ROBOTO_Regular,
                  }}>
                  Create team
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                width: WIDTH * 0.85,
                height: HEIGHT * 0.15,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalVisible(true)}
                style={{
                  backgroundColor: COLORS.APPCOLORS,
                  borderRadius: 10,
                  width: WIDTH * 0.4,
                  height: HEIGHT * 0.08,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.WHITE,
                    fontSize: FONT.SIZE.LARGE,
                    fontFamily: FONT.FAMILY.ROBOTO_Regular,
                  }}>
                  Join team
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => props.navigation.navigate('CreateTeam')}
                style={{
                  borderColor: COLORS.APPCOLORS,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: WIDTH * 0.4,
                  height: HEIGHT * 0.08,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.APPCOLORS,
                    fontSize: FONT.SIZE.LARGE,
                    fontFamily: FONT.FAMILY.ROBOTO_Regular,
                  }}>
                  Create team
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          
          {/* <KeyboardAvoidingView style={styles.centeredView}
          keyboardVerticalOffset={10}
          behavior="padding"> */}
                    <View style={styles.centeredView}>

            <View style={[styles.modalView,{height:HEIGHT*0.45}]}>
              <View
                style={{
                  width: WIDTH * 0.86,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  padding: 15,
                }}>
                <View />
                <AntDesign
                  name="close"
                  size={30}
                  color={COLORS.HEADERCOLOR}
                 onPress={() => {setModalVisibleShare(false);
                  setModalVisible(false)
                    if(modalDoneShare){
                        // alert(modalVisibleCongo)
                        setModalVisibleCongo(true)
                        setModalDoneShare(false)
                    }
                    }} 
                />
              </View>

              <Text style={[styles.modalText,{marginTop:-30}]}>Enter team code</Text>

              <Text
                style={{
                  color: '#B1B0B7',
                  width: WIDTH * 0.7,
                  fontSize: FONT.SIZE.MEDIUM,
                  fontFamily: FONT.FAMILY.ROBOTO_Regular,
                  textAlign: 'center',
                  
                }}>
                {/* This is a unique code that the team captain will have access to */}
                If you have not received the team code in a message, please ask the Team Captain for it.
              </Text>

              {/* <View style={{height: HEIGHT * 0.15, justifyContent: 'center'}}>
                <TextInput
                  style={{
                    width: WIDTH * 0.7,
                    height: 60,
                    paddingLeft: 15,
                    borderColor: COLORS.APPCOLORS,
                    borderRadius: 10,
                    borderWidth: 1,
                  }}
                  placeholder="Enter team code"
                  onChangeText={(val) => setTeamcode(val)}
                  // capitalize="characters"
                  // autoCapitalize="characters"
                  maxLength={4}
                  keyboard="number-pad"
                />
              </View> */}

<View style={{
                // width: '70%',
                // backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderColor:COLORS.APPCOLORS,
                borderWidth:1,
                // borderWidth:1,
                // borderColor:COLORS.APPCOLORS,
                marginTop:20
            }}>
                <TextInput
                    style={[{ height: 60, borderRadius: 5,width: WIDTH * 0.7, fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: 22,
                      borderWidth:0, 
                    letterSpacing:2,textAlign:'center',color:COLORS.APPCOLORS,borderBottomColor:'rgba(255,255,255,0)'}]}
                    onChangeText={(val) => setTeamcode(val)}
                    placeholder=''
                    // // placeholderTextColor={placeholderTextColor}
                    // value={value}
                    // onBlur={onBlur}
                    keyboardType='default'
                    autoCorrect={false}
                    spellCheck={false}
                    // underlineColorAndroid='white'
                    // autoCompleteType='off'
                    // editable={editable}
                     autoCapitalize= "characters" 
                    // secureTextEntry={secureTextEntry}
                    returnKeyType='done'
                     maxLength={4}
                />
              
            </View>

              <Pressable
                onPress={() => handleTeamCode()}
                style={{
                  width: WIDTH * 0.7,
                  marginTop: 15,
                  height: HEIGHT * 0.07,
                  backgroundColor: COLORS.APPCOLORS,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop:30
                }}>
                <Text
                  style={{
                    color: COLORS.WHITE,
                    fontFamily: FONT.FAMILY.ROBOTO_Regular,
                    fontSize: FONT.SIZE.MEDIUM,
                  }}>
                  Join team
                </Text>
              </Pressable>
            </View>
            </View>
          {/* </KeyboardAvoidingView> */}
        </Modal>
      </View>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleShare}
          onRequestClose={() => setModalVisibleShare(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  width: WIDTH * 0.86,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  padding: 15,
                }}>
                <View />
                <AntDesign
                  name="close"
                  size={30}
                  color={COLORS.HEADERCOLOR}
                  onPress={() => setModalVisibleShare(false)}
                />
              </View>

              <Text style={styles.modalText}>Unique team code</Text>

              <Text
                style={{
                  color: '#B1B0B7',
                  width: WIDTH * 0.7,
                  fontSize: FONT.SIZE.MEDIUM,
                  fontFamily: FONT.FAMILY.ROBOTO_Regular,
                  textAlign: 'center',
                  margin: HEIGHT * 0.03,
                }}>
                Invite friends to your team via the code or through the share
                button below
              </Text>

              <View style={{height: HEIGHT * 0.15, justifyContent: 'center'}}>
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: COLORS.APPCOLORS,
                    width: WIDTH * 0.7,
                    height: HEIGHT * 0.07,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.APPCOLORS,
                      fontSize: FONT.SIZE.EXTRALARGE,
                      fontFamily: FONT.FAMILY.ROBOTO_Bold,
                    }}>
                    {UniqueCode}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => handleTUniqueTeamCode()}
                style={{
                  width: WIDTH * 0.7,
                  flexDirection: 'row',
                  marginTop: HEIGHT * 0.03,
                  height: HEIGHT * 0.07,
                  backgroundColor: COLORS.APPCOLORS,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign
                  name="sharealt"
                  size={15}
                  color={COLORS.WHITE}
                  style={{padding: 5}}
                />
                <Text
                  style={{
                    color: COLORS.WHITE,
                    fontFamily: FONT.FAMILY.ROBOTO_Regular,
                    fontSize: FONT.SIZE.LARGE,
                  }}>
                  Share code
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.centeredView}>

<Modal
    animationType="slide"
    transparent={true}
    visible={modalVisibleCongo}
    onRequestClose={() => setModalVisibleCongo(false)}
>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Text style={[styles.modalText,{fontSize:18,fontFamily:FONT.FAMILY.ROBOTO_Bold}]}>Congratulations on your{'\n'}new team!</Text>

            <Text style={{ color: '#B1B0B7', fontSize: 16, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: HEIGHT * 0.02 }}>As the Team Captain you will be represented with a (C)</Text>
            <Text style={{ color: '#B1B0B7', fontSize: 16, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: HEIGHT * 0.02 }}>When others accept your invitations you'll be notified and you'll see them listed in your team.</Text>
            <Text style={{ color: '#B1B0B7',fontSize: 16, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: HEIGHT * 0.01 }}>You can invite members to your team at anytime.</Text>
           

            <Pressable onPress={() => setModalVisibleCongo(false)} style={{ width: WIDTH * 0.7, flexDirection: 'row', marginTop: HEIGHT * 0.03, height: HEIGHT * 0.07, backgroundColor: COLORS.APPCOLORS, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: COLORS.WHITE, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>Close</Text>
            </Pressable>
        </View>
    </View>
</Modal>
</View>

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
        style={{padding: 25, width: '18%'}}>
        <Image
          source={require('./../../Assets/Images/Menu.png')}
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
        Teams
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    backgroundColor: COLORS.BACKGROUNDCOLOR,
    alignItems: 'center',
    paddingBottom: 30,
  },
  subContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    backgroundColor: COLORS.BACKGROUNDCOLOR,
    flex: 1,
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
  headingSubText: {
    color: '#909090',
    fontSize: FONT.SIZE.LARGE,
    textAlign: 'center',
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
    paddingTop: 5,
  },
  liststyle: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: WIDTH * 0.9,
    height: HEIGHT * 0.17,
    borderRadius: 5,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 7,
  },
  lowerText: {
    color: COLORS.TEXTCOLORS,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: FONT.SIZE.SMALL,
    paddingTop: 8,
  },
  cellText: {
    color: COLORS.TEXTCOLORS,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: FONT.SIZE.LARGE,
  },
  ptsImage: {
    width: 26,
    height: 26,
  },
  imagestyle: {
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
    borderRadius: (WIDTH * 0.2) / 2,
  },
  imageComponent: {
    width: WIDTH * 0.22,
    height: HEIGHT * 0.115,
    margin: 10,
  },
  imageContainer: {
    width: WIDTH,
    height: HEIGHT,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    // padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: WIDTH * 0.86,
    height: HEIGHT * 0.50,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
    fontSize: FONT.SIZE.EXTRALARGE,
  },
});
