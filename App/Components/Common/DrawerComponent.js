
import * as React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../../Redux/Actions/authAction'
import ProgressiveImage from './PrograssiveImage';


function HomeScreen(props) {
  const userdata = useSelector((state) => state.userdata);
  const [userMe, setUser] = React.useState(null)
  const dispatch = useDispatch()

  React.useEffect(() => {
    let user = userdata && userdata
    setUser(user);
    console.log('user me',userMe)
  }, [userdata]);




  // *******************************logout user details*************************************


  const handleLogout = async () => {
    const isSignin = await AsyncStorage.removeItem('@user')
    dispatch(logoutUser(isSignin))
  }

  //..**************************************************************************************


  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>

        <TouchableOpacity style={{ alignItems: 'flex-end', width: '100%', padding: 10 }} onPress={() => props.navigation.toggleDrawer()}>
          <Image source={require('./../../Assets/Images/close.png')} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>

        <View style={styles.profile}>
        {userMe && userMe.image===""?
          <View style={{width:120,height:120,borderRadius:120/2,backgroundColor:COLORS.APPCOLORS,alignItems:'center',justifyContent:'center'}}>
          <Text style={{color:'white',fontSize:34,fontFamily:FONT.FAMILY.ROBOTO_Bold}}
          >{userMe.first_name.charAt(0)}{userMe.last_name.charAt(0)}</Text>
          </View>
          :
          <ProgressiveImage
            defaultImageSource={require('./../../Assets/UserIcon.png')}
            source={{
              uri: userMe && userMe.image,
            }}
            style={styles.profileImage} 
            resizeMode="cover"
          />}
          {/* <Image resizeMode="cover" source={userMe && userMe.image == '' ? require('./../../Assets/CreateLeague/image-3.png') : { uri: userMe && userMe.image }} style={styles.profileImage} /> */}
        </View>

        <Text style={styles.profileName}>{`${userMe && userMe.first_name + ' ' + userMe.last_name}`}</Text>
      </View>

    
      <TouchableOpacity onPress={() => props.navigation.navigate('Profiles')} style={{ height: HEIGHT * 0.07, justifyContent: "center" }}>
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate('Faq')} style={{ height: HEIGHT * 0.07, justifyContent: "center" }}>
        <Text style={styles.menuText}>FAQ</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => props.navigation.navigate('Feedback')} style={{ height: HEIGHT * 0.07, justifyContent: "center" }}>
        <Text style={styles.menuText}>Help</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate('AboutUs')} style={{ height: HEIGHT * 0.07, justifyContent: "center" }}>
        <Text style={styles.menuText}>T&C's, Privacy</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => props.navigation.navigate('PointGraph')} style={{ height: HEIGHT * 0.07, justifyContent: "center" }}>
        <Text style={styles.menuText}>Point History</Text>
      </TouchableOpacity> */}

      <View style={{ height: HEIGHT * 0.3, paddingTop: 40, justifyContent: "center" }}>
        <TouchableOpacity onPress={() => handleLogout()}>
          <Text style={{color:"#FF6B3C",fontSize: FONT.SIZE.LARGE,fontFamily: FONT.FAMILY.ROBOTO_Regular,textAlign:"center"}}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  menuStyle: {
    height: HEIGHT * 0.07,
    justifyContent: "center",
    marginLeft: 20
  },
  menuText: {
    color: COLORS.TEXTCOLORS,
    fontSize: FONT.SIZE.LARGE,
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    textAlign: 'center'
  },
  profile: {
    height: HEIGHT * 0.25,
    justifyContent: "center"
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2
  },
  profileName: { color: COLORS.SECONDARY, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE, textAlign: 'center' },
  profileEmail: { color: COLORS.SECONDARY, paddingTop: 5, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }
})
export default HomeScreen;