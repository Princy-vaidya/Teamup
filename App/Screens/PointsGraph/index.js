import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Image, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Alert,FlatList } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from '../../Utils/constants';
import Loader from "../../Components/Common/Loader"
import * as Animatable from 'react-native-animatable';
import Network from '../../Services/Network';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage from "react-native-flash-message";
import messaging from '@react-native-firebase/messaging';
import { showMessage, hideMessage } from "react-native-flash-message";
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart} from 'react-native-chart-kit';
import moment from 'moment';
import { set } from 'react-native-reanimated';


export default function PointGraph(props) {
  const [loading, setLoading] = useState(false);
  const [pointsDate, setPointsDate] = useState('')
  const [pointList, setPointsList] = useState([]);
  const [maxPoint,setMaxPoint]=useState(0);
  const [maxPointdate,setMaxPointDate]=useState(moment())
 
  let date = moment();
  let firstDate = date.startOf('isoWeek');
  firstDate = new Date(firstDate.format('YYYY-MM-DD'));
  let secondDate = new Date(firstDate);
  secondDate.setDate(firstDate.getDate() + 1);
  let thirdDate = new Date(firstDate);
  thirdDate.setDate(firstDate.getDate() + 2);
  let fourthDate = new Date(firstDate);
  fourthDate.setDate(firstDate.getDate() + 3);
  let fifthDate = new Date(firstDate);
  fifthDate.setDate(firstDate.getDate() + 4);
  let sixthDate = new Date(firstDate);
  sixthDate.setDate(firstDate.getDate() + 5);
  let seventhDate = new Date(firstDate);
  seventhDate.setDate(firstDate.getDate() + 6);
  


  console.log('new date',moment(firstDate).format('DD-MM-YYYY'))
  useEffect(() => {
    getPointsApi()
    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        let notification = null
        if (Platform.OS === 'ios') {
          showMessage({
            message: remoteMessage.notification.title,
            description: remoteMessage.notification.body,
            type: "default",
            backgroundColor: COLORS.WHITE,
            color: COLORS.APPCOLORS,
            duration: 2000
          });
        } else {
          showMessage({
            message: remoteMessage.notification.title,
            description: remoteMessage.notification.body,
            type: "default",
            backgroundColor: COLORS.WHITE,
            color: COLORS.APPCOLORS,
            duration: 2000,
          });
        }
      }
    });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      showMessage({
        message: remoteMessage.notification.title,
        description: remoteMessage.notification.body,
        type: "default",
        backgroundColor: COLORS.WHITE,
        color: COLORS.APPCOLORS,
        duration: 2000
      });
    });

    return unsubscribe;
  }, [])


  Date.prototype.getWeek = function () {
    var dt = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - dt) / 86400000) + dt.getDay() + 1) / 7);
  };


  const sendDate = (val) => {
    var today = new Date(val);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
  }

  // const sendDate = () => {
  //   var today = new Date();
  //   var dd = String(today.getDate()).padStart(2, '0');
  //   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //   var yyyy = today.getFullYear();

  //   today = yyyy + '-' + mm + '-' + dd;
  //   return today
  // }


  const getPointsApi = async () => {
    const userMe = await AsyncStorage.getItem('@user')
    var now = moment();
      var WeekStartDate = now.startOf('isoWeek');
      WeekStartDate = new Date(WeekStartDate.format('YYYY-MM-DD'))
      WeekStartDate.setHours(0, 0, 0, 0)
      var WeekEndDate = new Date(WeekStartDate);
      WeekEndDate.setDate(WeekStartDate.getDate() + 6);
      WeekEndDate.setHours(23, 59, 59, 999)
      console.log("date for all", WeekStartDate, WeekEndDate);
      console.log('Id',userMe)
    if (userMe) {
      let object = {
        weekStartDate: moment(WeekStartDate).format('YYYY-MM-DD'),
        weekEndDate: moment(WeekEndDate).format('YYYY-MM-DD'),
        authToken: JSON.parse(userMe).authtoken
       
      }
      const { params } = props.route;
      setLoading(true)
      Network('point/points_history', 'post', object)
        .then((res) => {
          console.log("res points list------>", res);
          if (res.success) {
            setLoading(false);
            setPointsList(res.response_data);
          
            let MaxPoint=Math.max.apply(Math, res.response_data.map(function(item) { return item.total_point; }));
            // console.log('high',Math.max(...res.response_data))
           setMaxPoint(MaxPoint);
           let maxPointdate=res.response_data.filter((item)=>item.total_point===MaxPoint);
           setMaxPointDate(maxPointdate[0].start_date)
         
          } else {
            Toast.show("" + res.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          Toast.show("Something went wrong !");
        });
      }
    
  }


  // const getPointsApi = async () => {
  //   props.navigation.addListener("focus", async () => {
  //     const userMe = await AsyncStorage.getItem('@user')
  //     var now = moment();
  //     var WeekStartDate = now.startOf('isoWeek');
  //     WeekStartDate = new Date(WeekStartDate.format('YYYY-MM-DD'))
  //     WeekStartDate.setHours(0,0,0,0)
  //     var WeekEndDate = new Date(WeekStartDate);
  //     WeekEndDate.setDate(WeekStartDate.getDate()+6);
  //     WeekEndDate.setHours(23,59,59,999)
  //     console.log("date fot all", WeekStartDate, WeekEndDate);
  //     let object = {
  //       date: sendDate(),
  //       weekStartDate: moment(WeekStartDate).format('YYYY-MM-DD'),
  //       weekEndDate: moment(WeekEndDate).format('YYYY-MM-DD'),
  //       authToken: JSON.parse(userMe).authtoken
  //     }
  //     console.log("main object", object);
  //     setLoading(true)
  //     Network('point/weekly_point', 'post', object)
  //       .then((res) => {
  //         console.log('point week points---->', res);
  //         if (res.success) {
  //           setLoading(false);
  //           setPointsList(res.response.docs);
  //           let maxArray=[];
  //           maxArray.push(res.response.docs.map((item)=>item.point))
         
  //           let MaxPoint=Math.max(...maxArray[0]);
  //           console.log('high',maxArray[0])
  //           setMaxPoint(MaxPoint)
  //         } else {
  //           Toast.show("" + res.message);
  //           setLoading(false);
  //         }
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         Toast.show("Something went wrong !");
  //       });
  //   })
  // }

  const MyWeekChart = () => {
    return (
      <>
        <LineChart
          data={{
            labels: ['1', '2', '3','4', '5', '6','7','8'],
            datasets: [
              {
                data: pointList.length == 0 ? [0, 0, 0, 0, 0, 0, 0, 0] : pointList,
                strokeWidth: 3,
              },
            ],
            // legend: ["Rainy Days"] // optional
          }}
          width={WIDTH / 1.15}
          height={HEIGHT * 0.40}
          fromZero={true}
          onDataPointClick={({ value, getColor }) =>
            Alert.alert(
              `${value}`,
              "You selected this value",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            )
            // showMessage({
            //   message: `${value}`,
            //   description: "You selected this value",
            //   backgroundColor: getColor(0.9)
            // })
          }
          chartConfig={{
            backgroundColor: COLORS.PRIMARY,
            backgroundGradientFrom: "#f57247",
            backgroundGradientTo: "#f57247",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "3",
              strokeWidth: "3",
            }
          }}
          style={{
            
          }}
        />
        <View style={{position:"relative",}}>
          <Text style={{color:"#000", backgroundColor:"#f57247", textAlign:"center", transform: [{ rotate: '90deg'}], position:"absolute", left:-WIDTH/2.55, top:-HEIGHT*0.198, width:WIDTH * 0.75, height:15}}>Points</Text>
        </View>
        <Text style={{color:"#000", backgroundColor:"#f57247", textAlign:"center"}}>Week 1-8</Text>
      </>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
      <Loader loading={loading} />
      <FlashMessage position="top" />

      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.imageContainer}
        resizeMode='stretch'
      >
        <Heading onPress={() => props.navigation.goBack()} />
      <View style={{flex:1,marginBottom:50}}>
        <ScrollView showsVerticalScrollIndicator={false}
        >
            {/* {MyWeekChart()} */}
            <ImageBackground
        source={require('./../../Assets/Images/historypoint.png')}
        style={{height:HEIGHT*0.26,width:WIDTH*0.9,alignSelf:'center',marginTop:20}}
        resizeMode='contain'
      >
        <View style={{alignSelf:'center',justifyContent:'center',marginTop:'11%',alignItems:'center'}}>
        <Text style={{color:'white',fontSize:20,fontFamily:FONT.FAMILY.ROBOTO_Regular}}>
          Personal best</Text>
          <View style={{flexDirection:'row',marginTop:10}}>
        <Text style={{color:'white',fontSize:38,fontFamily:FONT.FAMILY.ROBOTO_Medium}}>
          {maxPoint}
          </Text>
          <Text style={{color:'white',fontSize:16,fontFamily:FONT.FAMILY.ROBOTO_Regular,alignSelf:'center',marginLeft:5,marginTop:10}}>pts</Text>
          </View>
        <Text
        style={{color:'white',fontSize:16,fontFamily:FONT.FAMILY.ROBOTO_Regular}}>Week of {moment(maxPointdate).format('DD MMM')}</Text>
        </View>

      </ImageBackground>
     
<View style={{marginLeft:20}}>
      <View >
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'75%',alignSelf:'center',marginLeft:'5%'}}>
          <Text style={{color:'gray',fontFamily:FONT.FAMILY.ROBOTO_Regular}}>0</Text>
          <Text style={{color:'gray',fontFamily:FONT.FAMILY.ROBOTO_Regular}}>50</Text>
          <Text style={{color:'gray',fontFamily:FONT.FAMILY.ROBOTO_Regular}}>100</Text>
          <Text style={{color:'gray',fontFamily:FONT.FAMILY.ROBOTO_Regular}}>150</Text>
        </View>
      </View>
    {/* <View style={{flexDirection:'row'}}>
    
        */}
         <View style={{position:'absolute',alignItems:'center',top:-10,left:-10}}>
        <Text style={{color:'gray',fontFamily:FONT.FAMILY.ROBOTO_Regular}}>Week</Text>
        <Text style={{color:'gray',fontFamily:FONT.FAMILY.ROBOTO_Regular}}>Starting</Text>
      </View>
      <View style={{width:'75%',borderBottomWidth:1,alignSelf:'center',marginTop:5,borderColor:'#D3D3D3',marginLeft:'7%'
    }}/>
     {/* </View> */}
    
    
        <FlatList
                data={pointList}
              
                renderItem={({ item,index}) => 
               {
                 let percentage=JSON.stringify(item.total_point*75/150)+'%'
                return(
                 <View>
                   {index!==0 && <View
                      style={{
                        flexDirection: 'row',
                       height:60,
                      
                        
                      }}
                    >
                      
      <View style={{marginLeft:10}}>
        <View style={{height:60,justifyContent:'center',borderRightWidth:1,borderRightColor:'#D3D3D3',width:70,marginLeft:-20}}>
        <Text style={{fontFamily:FONT.FAMILY.ROBOTO_Medium,textAlign:'center'}}>{moment(item.start_date).format('DD MMM')}</Text>
        </View>
        </View>
                      <View style={{flexDirection:'row',marginLeft:10,marginTop:5}}>
                        {item.total_point >=150 &&
                        <View style={{width:'75%',backgroundColor:COLORS.APPCOLORS,height:10,marginTop:20,marginRight:-1}}/>
                        }
                        {item.total_point <150 &&
                                <View style={{width:percentage,backgroundColor:'#FFB4A2',height:10,marginTop:20,marginRight:-1}}/>
                        }
                       {item.total_point !=0 && <View
                        style={{borderWidth:2,borderRadius:40,marginTop:5,alignContent:'center',justifyContent:'center',alignContent:'center',height:40,width:40,borderColor:COLORS.APPCOLORS}}>
                      <Text
                        style={{
                        alignSelf:'center',
                        fontFamily:FONT.FAMILY.ROBOTO_Bold
                        }}
                      >
                        {item.total_point}
                      </Text>
                      </View>}
                      </View>
                    </View>}
                    </View>
                  
                )
                }}
              />
        </View>
        
      {/* </View> */}
      
      {/* </View> */}
        </ScrollView>
        </View>
      </ImageBackground>

    </>
  )
}

const Heading = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: HEIGHT * 0.13 }}>
      <TouchableOpacity onPress={props.onPress} style={{ width: '18%', alignItems: 'center' }}>
        <Image source={require('./../../Assets/Images/arrow_back.png')} resizeMode='contain' style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
      <Text style={{ color: COLORS.WHITE, width: '64%', fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center' }}>Points History</Text>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: COLORS.BACKGROUNDCOLOR,
  },
  subContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  imageContainer: {
    width: WIDTH,
    height: HEIGHT,
  },
  headingCont: {
    height: HEIGHT * 0.15,
    alignItems: "center",
    justifyContent: "center"
  },
  headingText: {
    color: COLORS.BOARDERCOLOR,
    fontSize: FONT.SIZE.EXTRALARGE,
    textAlign: "center",
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.ROBOTO_Bold
  },
  ptsImage: {
    width: 20,
    height: 20
  },
  editcontainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  points: { margin: 10, flexDirection: 'row', backgroundColor: '#fff', elevation: 2, height: HEIGHT * 0.12, width: WIDTH * 0.83, borderRadius: 5 },
  pointsContainer: { width: WIDTH * 0.7, height: HEIGHT * 0.12, paddingHorizontal: 15, justifyContent: 'center' },
  pointsText: { color: COLORS.TEXTCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.EXTRALARGE },
  pointsDate: { color: COLORS.APPCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM, paddingTop: 5 }
})