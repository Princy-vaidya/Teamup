import React, { useEffect, useState } from 'react';
import { Image, View, Text } from 'react-native';
import Home from './../Screens/Home';
import SignupScreen from './../Screens/AuthScreens/signup';
import Splash from './../Screens/splash';
import LoginScreen from "./../Screens/AuthScreens/Login";
import { createStackNavigator } from '@react-navigation/stack';
import ForgotPassword from "./../Screens/AuthScreens/ForgotPassword";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HEIGHT, COLORS, WIDTH, FONT } from './constants';
import CreateLeague from "./../Screens/CreateLeague";
import YourFeed from "./../Screens/Feed/index";
import LeagueTable from "./../Screens/LeagueTable";
import Leagues from "./../Screens/Leagues";
import LogNow from "./../Screens/LogNow";
import Points from './../Screens/Points';
import { useSelector } from 'react-redux';
import DrawerComponent from '../Components/Common/DrawerComponent';
import ProfileScreens from "./../Screens/Setting";
import AboutUs from '../Screens/TermAndCondition/AboutUs';
import FaqScreen from './../Screens/TermAndCondition/Faq';
import Challenge from './../Screens/Challenge';
import FeedScreen from './../Components/Feed';
import TeamEdit from "./../Screens/TeamEdit";
import FulVideo from "./../Screens/Feed/fullVideo";
import PointsList from './../Screens/PointsList';
import PointsEdit from "./../Screens/PointsEdit";
import ResetPassword from "./../Screens/AuthScreens/Reset";
import LabaryScreen from './../Screens/Libary/index'
import Feedback from "./../Screens/Feedback";
import Facebook from "./../Screens/Facebook";
import IntroScreen from "./../Screens/Onboarding";
import TeamMemberEdit from "./../Screens/TeamMemberEdit";
import TeamsProfile from "./../Screens/TeamProfile";
import AddTeamMember from "./../Screens/AddTeamMember";
import PointGraph from '../Screens/PointsGraph';
import Comment from "../Screens/Home/Comment";
import ProfileUpload  from '../Screens/AuthScreens/ProfileUpload';
import EditPost  from '../Screens/Home/EditPost';
import NewPostScreen from '../Screens/Home/NewPost';
import NewAdminPostScreen from "../Screens/Home/NewAdminPost"
// import Testing from "./../../Testing";



import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const HomeStackNav = createStackNavigator();  //.......This stack use for Home Tab navigation.....
const PointStack = createStackNavigator();  //.........This stack use for Point Tab navigation....
const TeamStack = createStackNavigator();   //........This stack use for Team tab navigation......
const LabaryStack = createStackNavigator();   //........This stack use for Team tab navigation......




export default Navigation = () => {
  const userdata = useSelector((state) => state.userdata);
  const [userMe, setUser] = useState(null);

  useEffect(() => {
    let user = userdata && userdata._id ? true : false
    setUser(user);
  }, [userdata]);

  // .............................Home stack navigation.............................

  const HomeTabStack = () => {
    return (
      <HomeStackNav.Navigator initialRouteName='TabHome'>
        <HomeStackNav.Screen name="TabHome" component={Home} options={{ headerShown: false }} />
        <HomeStackNav.Screen name="Comment" component={Comment} options={{ headerShown: false }} />
        <HomeStackNav.Screen name="NewPost" component={NewPostScreen} options={{ headerShown: false }} />
        <HomeStackNav.Screen name="adminPost" component={NewAdminPostScreen} options={{ headerShown: false }} />

        <HomeStackNav.Screen name="EditPost" component={EditPost} options={{ headerShown: false }} />
        <HomeStackNav.Screen name="Profiles" component={ProfileScreens} options={{ headerShown: false }} />
        <HomeStackNav.Screen name="Feedback" component={Feedback} options={{ headerShown: false }} />
        <HomeStackNav.Screen name="AboutUs" component={AboutUs} options={{ headerShown: false }} />
        <HomeStackNav.Screen name="Faq" component={FaqScreen} options={{ headerShown: false }} />

        <HomeStackNav.Screen name='fulVideo' component={FulVideo} options={{ headerShown: false }} /> 
      </HomeStackNav.Navigator>
    )
  }

  // ..............................................................................

  const PointsTabStack = () => {
    return (
      <PointStack.Navigator initialRouteName='PointsTab'>
        <PointStack.Screen name='PointsTab' component={Points} options={{ headerShown: false }} />
        <PointStack.Screen name='pointAdd' component={LogNow} options={{ headerShown: false }} />
        <PointStack.Screen name='pointsList' component={PointsList} options={{ headerShown: false }} />
        <PointStack.Screen name='pointsEdit' component={PointsEdit} options={{ headerShown: false }} />
        <PointStack.Screen name="PointGraph" component={PointGraph} options={{ headerShown: false }} />

      </PointStack.Navigator>
    )
  }

  // ..............................................................................

  const TeamTabStack = () => {
    return (
      <TeamStack.Navigator initialRouteName='Team'>
        <TeamStack.Screen name='Team' component={Leagues} options={{ headerShown: false }} />
        <TeamStack.Screen name='CreateTeam' component={CreateLeague} options={{ headerShown: false }} />
        <TeamStack.Screen name='EditTeam' component={TeamEdit} options={{ headerShown: false }} />
        <TeamStack.Screen name='TeamMember' component={LeagueTable} options={{ headerShown: false }} />
        <TeamStack.Screen name='TeamMemberEdit' component={TeamMemberEdit} options={{ headerShown: false }} />
        <TeamStack.Screen name='TeamsProfile' component={TeamsProfile} options={{ headerShown: false }} />
        <TeamStack.Screen name='AddTeamMember' component={AddTeamMember} options={{ headerShown: false }} />
      </TeamStack.Navigator>
    )
  }

  // ..............................................................................

  const LabaryTabScreen = () => {
    return (
      <LabaryStack.Navigator initialRouteName='Library'>
        <LabaryStack.Screen name='Library' component={LabaryScreen} options={{ headerShown: false }} />
      </LabaryStack.Navigator>
    )
  }

  // ........................................................................



  const HomeStack = () => {
    return (
      <Tab.Navigator initialRouteName="HomeScreen"
        tabBarOptions={{
          style: {
            height:65,
            paddingTop:22
          },
          activeTintColor: COLORS.APPCOLORS,
          inactiveTintColor: COLORS.TEXTCOLORS
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HomeTabStack') {
              iconName = focused
                ? require('./../Assets/Images/HomeActive.png')
                : require('./../Assets/Images/HomeInactive.png');
            } else if (route.name === 'Points') {
              iconName = focused
                ? require('./../Assets/Images/PointsA.png')
                : require('./../Assets/Images/Points.png');
            } else if (route.name === 'Teams') {
              iconName = focused
                ? require('./../Assets/Images/TeamsA.png')
                : require('./../Assets/Images/Teams.png');
            } else if (route.name === 'Library') {
              iconName = focused
                ? require('./../Assets/Images/LibraryA.png')
                : require('./../Assets/Images/Library.png');
            }
            // You can return any component that you like here!
            return (
              <>
                <Image source={iconName} style={{ width: 65, height: 65 }} resizeMode='contain' />
              </>
            );
          },
        })}
      >

        {/* ********************************************************* */}

        <Tab.Screen
          name="HomeTabStack"
          component={HomeTabStack}
          options={{
            tabBarLabel: '',
            headerShown: false
          }}
        />

        {/* *******************************Points************************************* */}

        <Stack.Screen
          name="Points"
          component={PointsTabStack}
          options={{
            tabBarLabel: '',
          }}
        />

        {/* *****************************Team *************************************** */}

        <Tab.Screen
          name="Teams"
          component={TeamTabStack}
          options={{
            tabBarLabel: '',
          }}
        />

        {/* *************************************************************************** */}

        <Tab.Screen
          name="Library"
          component={LabaryTabScreen}
          options={{
            tabBarLabel: '',
          }}
          
          
        />






        {/* <Stack.Screen
          name="pointsEdit"
          component={PointsEdit}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />


        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />

        <Stack.Screen
          name="Facebook"
          component={Facebook}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        /> */}



        {/* 
        <Stack.Screen
          name="pointsList"
          component={PointsList}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        /> */}

        {/* 
        <Stack.Screen
          name="fulVideo"
          component={FulVideo}
          options={{
            headerShown: false
          }}
        /> */}

        {/* <Stack.Screen
          name="TeamEdit"
          component={TeamEdit}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />

        <Stack.Screen
          name="Challenge"
          component={Challenge}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />


        <Stack.Screen
          name="ProfileScreens"
          component={ProfileScreens}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        /> */}






        {/* <Stack.Screen
          name="CreateLeague"
          component={CreateLeague}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />




        <Stack.Screen
          name="YourFeed"
          component={YourFeed}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />

        <Stack.Screen
          name="LeagueTable"
          component={LeagueTable}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        /> */}




        {/* <Stack.Screen
          name="LogNow"
          component={LogNow}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />

        <Stack.Screen
          name="FaqScreen"
          component={FaqScreen}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />


        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 20, alignItems: "center" }}>
                <Image source={require("./../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
              </View>
            )
          }}
        />


        <Stack.Screen
          name="FeedScreen"
          component={FeedScreen}
          options={{
            headerShown: true,
            title: '',
            headerStyle: { height: HEIGHT * 0.09, backgroundColor: COLORS.BACKGROUNDCOLOR },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: "center",
              color: "#737373",
              fontSize: FONT.SIZE.EXTRALARGE,
              fontFamily: FONT.FAMILY.ARIMOREGULAR
            },
            headerLeft: () => (
              <View style={{ paddingLeft: 15 }}>
                <Image source={require("./../Assets/TEAMUP_LOGO.png")} resizeMode="contain" style={{ width: WIDTH * 0.27, height: HEIGHT * 0.06 }} />
              </View>
            ),
          }}
        /> */}

      </Tab.Navigator>
    );
  };



  return (
    <>
      {userMe ? (
        <>
          <Drawer.Navigator drawerContent={(props) => (<DrawerComponent {...props} />)} initialRouteName="Home" >
            <Drawer.Screen
              name="Home"
              component={HomeStack}
            />
          </Drawer.Navigator>
        </>
      ) : (
        <>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"Splash"}>
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name="intro" component={IntroScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPass" component={ForgotPassword} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Picupload" component={ProfileUpload} options={{ headerShown: false }} />
          </Stack.Navigator>
        </>
      )}
    </>
  );
};
