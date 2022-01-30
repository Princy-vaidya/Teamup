import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH} from './../../Utils/constants';
import TextInputComponents from './../../Components/Common/InputText';
import Loader from './../../Components/Common/Loader';
import * as Animatable from 'react-native-animatable';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Button from './../../Components/Common/button';
import Md5 from 'md5';
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import VerificationScreens from './../AuthScreens/Verified';
import MobileModal from './../../Components/Common/MobileModal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';

export default function LoginScreens(props) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [emailID, setEmailId] = useState('');
  const [passwordShow, setPasswordShow] = useState(true);
  const [modalVisibleMobile, setModalVisibleMobile] = useState(false);

  //*********************************Validation*******************************************

  const Validate = Yup.object().shape({
    email: Yup.string()
      .email('Not a valid email')
      .required('Email is required!'),
    firstname: Yup.string().required('First name is required!'),
    lastname: Yup.string().required('Last name is required!'),
    // mobileno: Yup.string()
    //     .required('Mobile number is required!'),
    password: Yup.string().required('Password is required!'),
  });

  //*********************************submit data*******************************************

  const handleSignUp = async(values) => {
    setLoading(true);
    let email = values.email.toLowerCase().trim();
    setEmailId(email);
console.log('device token',await AsyncStorage.getItem("fcmtoken"))
    const data = {
      email,
      first_name: values.firstname,
      last_name: values.lastname,
      md_password: Md5(values.password),
      devicetoken: await AsyncStorage.getItem("fcmtoken"),
      apptype: Platform.OS == 'ios' ? 'IOS' : 'ANDROID'
      // phone_no: values.mobileno
    };
console.log('data res',data)
    Network('user/register_user', 'post', data)
      .then(async(res) => {
        console.log('res user register----->', res);
        if (res.success) {
          setLoading(false);
          // setModalVisible(true);
          // handleTeamApi(res);
          const data = {
            email: email,
            md_password: Md5(values.password),
            devicetoken: await AsyncStorage.getItem("fcmtoken"),
            apptype: Platform.OS == 'ios' ? 'IOS' : 'ANDROID'
        };
    console.log("i love jayantu----------",data)

    Network('user/user_login', 'post', data)
    .then(async (res) => {
        setLoading(false);
        if (res.success) {
            console.log('hhh',res)
            setLoading(false);
            if (res.data.user_details._id) {
              Toast.show('' + res.message);
              props.navigation.navigate('Picupload',
              {email:values.email,
              md_password:Md5(values.password),
              firstname:values.firstname,
              lastname:values.lastname})
              await AsyncStorage.setItem(
                '@user',
                JSON.stringify(res.data.user_details),
            );
              await AsyncStorage.setItem(
                'userDetail',
                JSON.stringify(res.data),
            );
              }
           
        }
    })
    .catch((error) => {
        setLoading(false);
    });
 
} else {
  Toast.show('' + res.message);
  setLoading(false);
}
})
.catch((error) => {
setLoading(false);
// Toast.show('Something went wrong !');
});
  };

  //@**************************************************************************************

  const handleTeamApi = (val) => {
    if (val !== undefined) {
      const data = {
        authToken: val.data.user_details.authtoken,
      };
      Network(
        'common/check-invite-status?phone_no=' +
          val.data.user_details.phone_no +
          '&email=' +
          val.data.user_details.email,
        'get',
        data,
      )
        .then(async (res) => {
          if (res.response_code == 2000) {
            if (res.response_data.length != 0) {
              /***********************************************************************************/

              handleTeamAdd(
                val.data.user_details.authtoken,
                val.data.user_details._id,
                res.response_data[0].team_id,
              );

              /***********************************************************************************/
            }
          } else {
            Toast.show(res.response_message);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  const handleTeamAdd = (authtoken, userId, team_id) => {
    const data = {
      league_id: team_id,
      authToken: authtoken,
      user_id: userId,
    };

    Network('league/add_member', 'post', data)
      .then(async (res) => {
        if (res.response_code == 2000) {
          Toast.show(res.response_message);
        } else {
          setModalVisible(false);
          Toast.show(res.response_message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  /******************************************************************************************/

  const handleVerify = (val) => {
    if (val.length == 4) {
      let email = emailID.toLowerCase();
      const data = {
        email,
        md_otp: Md5(val),
      };
      setLoading(true);

      Network('user/verify_email', 'post', data)
        .then((res) => {
          if (res.success) {
            setLoading(false);
            setModalVisible(false);
            props.navigation.navigate('Login');
            Toast.show(res.message);
          } else {
            Toast.show(res.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          Toast.show('Something went wrong !');
        });
    }
  };

  /*****************************************************************************************/

  const handleShow = () => {
    if (passwordShow) {
      setPasswordShow(false);
    } else {
      setPasswordShow(true);
    }
  };

  /*****************************************************************************************/

  const handleSend = () => {
    let email = emailID.toLowerCase();
    const data = {
      email,
    };
    setLoading(true);
    Network('user/send_verification_email', 'post', data)
      .then((res) => {
        if (res.success) {
          setLoading(false);
          Toast.show(res.message);
        } else {
          Toast.show(res.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show('Something went wrong !');
      });
  };

  /*****************************************************************************************/

  return (
    <>
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <Loader loading={loading} />

      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.container}
        resizeMode="stretch">
        <Logo />

        {/* <Animatable.View animation="slideInDown" style={styles.subContainer}> */}
          <View style={styles.signUp}>
            <Text style={styles.signupText}>
              Already a member?{' '}
              <Text
                onPress={() => props.navigation.navigate('Login')}
                style={{color: COLORS.APPCOLORS}}>
                Sign in
              </Text>
            </Text>
          </View>
          <ScrollView keyboardShouldPersistTaps='always'>
        <Loader loading={loading} />
        <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}
        extraScrollHeight={50}
        >
       
          <Animatable.View animation="fadeInDown" style={styles.subContainer}>

              <Formik
                initialValues={{
                  email: '',
                  firstname: '',
                  lastname: '',
                  mobileno: '',
                  password: '',
                  confirmpassword: '',
                }}
                onSubmit={(values) => handleSignUp(values)}
                validationSchema={Validate}>
                {({
                  values,
                  handleChange,
                  errors,
                  handleSubmit,
                  setFieldTouched,
                  touched,
                }) => (
                  <>
                    <View style={{paddingVertical: 20}}>
                      {values.firstname.length != 0 && (
                        <Text style={styles.placeholderText}>
                          {'First Name'}
                        </Text>
                      )}

                      <TextInputComponents
                        placeholder="First Name"
                        placeholderTextColor={COLORS.GRAY}
                        screenwidth="80%"
                        value={values.firstname}
                        onChangeText={handleChange('firstname')}
                        onBlur={() => setFieldTouched('firstname')}
                        type="name"
                      />

                      {touched.firstname && errors.firstname && (
                        <Text style={styles.formError}>{errors.firstname}</Text>
                      )}

                      {values.lastname.length != 0 && (
                        <Text style={styles.placeholderText}>
                          {'Last Name'}
                        </Text>
                      )}

                      <TextInputComponents
                        placeholder="Last Name"
                        placeholderTextColor={COLORS.GRAY}
                        screenwidth="80%"
                        value={values.lastname}
                        onChangeText={handleChange('lastname')}
                        onBlur={() => setFieldTouched('lastname')}
                        type="name"
                      />

                      {touched.lastname && errors.lastname && (
                        <Text style={styles.formError}>{errors.lastname}</Text>
                      )}

                      {values.email.length != 0 && (
                        <Text style={styles.placeholderText}>{'Email'}</Text>
                      )}

                      <TextInputComponents
                        placeholder="Email"
                        placeholderTextColor={COLORS.GRAY}
                        screenwidth="80%"
                        value={values.email}
                        capitalize={true}
                        onChangeText={handleChange('email')}
                        onBlur={() => setFieldTouched('email')}
                      />

                      {touched.email && errors.email && (
                        <Text style={styles.formError}>{errors.email}</Text>
                      )}

                      {/* {values.mobileno.length != 0 && (
                                                <Text style={styles.placeholderText}>{'Mobile/Cell Number'}</Text>
                                            )}

                                            <TextInputComponents
                                                placeholder="Mobile/Cell Number"
                                                placeholderTextColor={COLORS.GRAY}
                                                screenwidth="80%"
                                                value={values.mobileno}
                                                onChangeText={handleChange('mobileno')}
                                                onBlur={() => setFieldTouched('mobileno')}
                                                lefImage={require('./../../Assets/Images/Mobile.png')}
                                                rightIcon={true}
                                                onPress={() => setModalVisibleMobile(true)}
                                            />

                                            {touched.mobileno && errors.mobileno && (
                                                <Text style={styles.formError}>{errors.mobileno}</Text>
                                            )} */}

                      {values.password.length != 0 && (
                        <Text style={styles.placeholderText}>{'Password'}</Text>
                      )}

                      <TextInputComponents
                        placeholder="Password"
                        placeholderTextColor={COLORS.GRAY}
                        screenwidth="80%"
                        capitalize={true}
                        value={values.password}
                        onChangeText={handleChange('password')}
                        secureTextEntry={passwordShow}
                        onBlur={() => setFieldTouched('password')}
                        onPress={() => handleShow()}
                        lefImage={require('./../../Assets/Images/Pass.png')}
                        rightIcon={true}
                      />

                      {touched.password && errors.password && (
                        <Text style={styles.formError}>{errors.password}</Text>
                      )}

                      {/* {values.confirmpassword.length != 0 && (
                                                    <Text style={styles.placeholderText}>{'Confirm Password'}</Text>
                                                )}


                                                <TextInputComponents
                                                    placeholder="Confirm Password"
                                                    placeholderTextColor={COLORS.LOGOCOLOR}
                                                    screenwidth="80%"
                                                    value={values.confirmpassword}
                                                    secureTextEntry={true}
                                                    onChangeText={handleChange('confirmpassword')}
                                                    onBlur={() => setFieldTouched('confirmpassword')}
                                                />

                                                {touched.confirmpassword && errors.confirmpassword && (
                                                    <Text style={styles.formError}>{errors.confirmpassword}</Text>
                                                )} REGISTER*/}

                      <Button
                        buttonWidth="80%"
                        onPress={handleSubmit}
                        lable="Register"
                      />
                    </View>
                  </>
                )}
              </Formik>
              </Animatable.View>
              </KeyboardAwareScrollView>      
               </ScrollView>

          <VerificationScreens
            modalVisible={modalVisible}
            handleChangeVerify={(val) => handleVerify(val)}
            onRequestClose={() => setModalVisible(false)}
            onPress={() => handleSend()}
          />

          <MobileModal
            modalVisible={modalVisibleMobile}
            onRequestClose={() => setModalVisibleMobile(false)}
            onPress={() => setModalVisibleMobile(true)}
          />
      </ImageBackground>
    </>
  );
}

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
  logo: {
    width: WIDTH * 0.26,
    height: HEIGHT * 0.08,
  },
  logoContainer: {
    width: WIDTH,
    height: HEIGHT * 0.14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookCom: {
    height: HEIGHT * 0.08,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3152d3',
    borderRadius: 9,
    flexDirection: 'row',
  },
  formError: {
    color: COLORS.SECONDARY,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    textAlign: 'center',
    fontSize: FONT.SIZE.SMALL,
  },
  remembercontainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 25,
  },
  remText: {
    color: '#e9e9e9',
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: FONT.SIZE.MEDIUM,
  },
  fbcomponent: {
    height: HEIGHT * 0.16,
    justifyContent: 'center',
  },
  facebookText: {
    textTransform: 'uppercase',
    fontSize: FONT.SIZE.LARGE,
    fontFamily: FONT.FAMILY.ROBOTO_Medium,
    paddingLeft: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: WIDTH * 0.8,
    height: HEIGHT * 0.5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  subView: {
    height: HEIGHT * 0.8,
    width: WIDTH,
  },
  signUp: {
    height: HEIGHT * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: FONT.SIZE.LARGE,
    textAlign: 'center',
    color: COLORS.TEXTCOLORS,
  },
  placeholderText: {
    color: COLORS.SECONDARY,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    textAlign: 'left',
    fontSize: FONT.SIZE.MEDIUM,
    paddingLeft: 50,
  },
});
