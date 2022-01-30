import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Pressable, ImageBackground, Image, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH, base_url } from './../../Utils/constants';
import Loader from "./../../Components/Common/Loader"
import Network from './../../Services/Network';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';


export default function LeagueTable(props) {
  const [loading, setLoading] = useState(true);
  const [leagueList, setLeagueList] = useState([])
  const [leagueName, setLeagueName] = useState('')
  const [leagueData, setLeagueDate] = useState('')
  const [userId, setUser] = useState("")
  const [modalVisibleConf, setModalVisibleConf] = useState(false)
  const [memberData, setMemberData] = useState(null)
  const [modalVisibleLeave, setModalVisibleLeave] = useState(false)
  const [modalVisibleDeleteTeam, setModalVisibleDeleteTeam] = useState(false)


  useEffect(() => {
    getApiCalling()         //......This api calling team list
  }, [])

  const sendDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today
  }
  
  const getApiCalling = async () => {

    const userMe = await AsyncStorage.getItem('@user')
    if (userMe) {
      setUser(JSON.parse(userMe)._id)
      const { params } = props.route;
      setLeagueDate(params.leagueData)
      setLeagueName(params.leagueData.league.league_name)
      setLoading(true);
      const data = {
        league_id: params.leagueData.league_id,
        authToken: JSON.parse(userMe).authtoken
      };

      Network('league/league_member_list', 'post', data)
        .then(async (res) => {
          if (res.success) {
            if (res.response.docs.length != 0) {
              setLeagueList(res.response.docs)
            } else {
              Toast.show('Data not founds!')
            }
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }

  //..................................Delete team member .....................................

  const handleDelete = (item) => {
    setMemberData(item)
    setModalVisibleConf(true)
  }

  //..........................................................................................


  //..............................Leave team member............................................

  const handleLeaveTeam = async () => {
    setModalVisibleLeave(true)
  }

  //...........................................................................................


  //.........................Leave team member Api calling.....................................

  const handleMemberLeaveSuccess = async () => {

    const userMe = await AsyncStorage.getItem('@user')
    if (userMe) {
      setLoading(true);
      const { params } = props.route;
      let formdata = new FormData();
      formdata.append("user_id", JSON.parse(userMe)._id)
      formdata.append("team_id", params.leagueData.league_id)

      console.log("formdata====>", formdata);

      fetch(base_url + 'league/user-leave-team', {
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
          if (responseJson.success) {
            setLoading(false)
            setTimeout(() => {
              setModalVisibleLeave(false)
            }, 500)
            props.navigation.navigate('Team')
            Toast.show("Member has left team");
          } else {
            setLoading(false)
          }
        })
        .catch((error) => {
          setLoading(false)
          console.error(error);
        });
    }
  }

  //********************************************************************************************** */

  const handleMemberDelete = () => {
    deleteApi(memberData)
  }

  // *******************************Delete team member api calling**********************************

  const deleteApi = async (item) => {
    const userMe = await AsyncStorage.getItem('@user')
    if (userMe) {
      setLoading(true);
      const { params } = props.route;
      const data = {
        league_id: params.leagueData.league_id,
        authToken: JSON.parse(userMe).authtoken,
        member_id: item.member_id
      };
      setModalVisibleConf(false)
      Network('league/delete_member', 'post', data)
        .then(async (res) => {
          if (res.success) {
            // setTimeout(()=>{
            //     setModalVisibleConf(false)
            // },100)
            getApiCalling()
            Toast.show("Member removed from this team");
          } else {
            Toast.show(res.message);
            setLoading(false);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);

        });
    }
  }

  //***********************************************************************************************/

  // ************************************Delete team Api calling************************************

  const handleDeleteTeam = async () => {
    setModalVisibleDeleteTeam(true)
  }


  const handleTeamDelete = async () => {
    const userMe = await AsyncStorage.getItem('@user')
    if (userMe) {
      setLoading(true);
      const data = {
        league_id: leagueData.league_id,
        authToken: JSON.parse(userMe).authtoken,
        member_id: leagueData.member_id,
        user_id: JSON.parse(userMe)._id
      };
      Network('league/delete_league', 'post', data)
        .then(async (res) => {
          setTimeout(() => {
            setModalVisibleDeleteTeam(false)
          }, 100)
          if (res.success) {
            Toast.show("Team deleted");
            props.navigation.navigate('Team')
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toast.show('error');
        });
    }
  }


  return (
    <>
      <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />

      <Loader loading={loading} />

      <ImageBackground
        source={require('./../../Assets/Images/Background.png')}
        style={styles.imageContainer}
        resizeMode='stretch'
      >
        <Heading
          title={leagueName}
          leagueData={leagueData}
          userId={userId}
          onPressBack={() => props.navigation.navigate('Team')}
          onPressEdit={() => props.navigation.navigate('EditTeam', { 'leagueData': leagueData, 'page': '1' })}
        />


        <View style={{ height: HEIGHT * 0.53, marginTop: 45, paddingHorizontal: 25 }}>

          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: WIDTH * 0.9, paddingBottom: 20 }}>
            <View style={{ width: WIDTH * 0.72, paddingLeft: 20 }}>
              <Text style={{ color: '#B1B0B7', fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE, textAlign: 'center' }}>This week’s standings</Text>
            </View>
            <TouchableOpacity style={{ right: 0 }} onPress={() => props.navigation.navigate('Team')}>
              <Text style={{ color: COLORS.APPCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE }}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {leagueList.length != 0 ?

              <ListCell
                leagueList={leagueList}
                leagueData={leagueData}
                userId={userId}
                onPress={(value) => handleDelete(value)}
              />

              :

              <View style={{ backgroundColor: '#F9FAFB', height: HEIGHT * 0.6, width: WIDTH * 0.85, justifyContent: 'center', alignItems: 'center' }}>

                <Text style={{ color: '#B1B0B7', fontSize: FONT.SIZE.EXTRALARGE, fontFamily: FONT.FAMILY.ROBOTO_Regular }}>No team members yet</Text>

              </View>

            }
          </ScrollView>
        </View>


        {leagueData && (leagueData.league.creator_id == userId) ?
          <View style={{ width: WIDTH, height: HEIGHT * 0.13, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => handleDeleteTeam()} style={{ width: WIDTH * 0.85, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', height: HEIGHT * 0.07, borderRadius: 10, borderWidth: 1, borderColor: COLORS.APPCOLORS }}>

              <Text style={{ color: COLORS.APPCOLORS, fontSize: FONT.SIZE.LARGE, fontFamily: FONT.FAMILY.ROBOTO_Regular }}>Delete team</Text>

            </TouchableOpacity>
          </View>

          :
          <View style={{ width: WIDTH, height: HEIGHT * 0.13, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => handleLeaveTeam()} style={{ width: WIDTH * 0.85, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', height: HEIGHT * 0.07, borderRadius: 10, borderWidth: 1, borderColor: COLORS.APPCOLORS }}>

              <Text style={{ color: COLORS.APPCOLORS, fontSize: FONT.SIZE.LARGE, fontFamily: FONT.FAMILY.ROBOTO_Regular }}>Leave team</Text>

            </TouchableOpacity>
          </View>
        }
      </ImageBackground>



      {/* **************************Delete team modal************************************** */}



      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleDeleteTeam}
          onRequestClose={() => {
            setModalVisibleDeleteTeam(false)
          }}
        >
          <View style={styles.centeredView1}>
            <View style={styles.modalView1}>
              <Text style={styles.modalText}>Delete Team</Text>

              <Text style={{ fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, color: '#272728', paddingVertical: 5 }}>
              Are you sure you wish to delete this team?

              </Text>

              <View style={{ height: HEIGHT * 0.2, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisibleDeleteTeam(false)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonDelete]}
                  onPress={() => handleTeamDelete()}
                >
                  <Text style={[styles.textStyle, { color: COLORS.APPCOLORS }]}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>




      {/* *********************************************************************************************** */}



      {/* *************************************Delete team member modal box****************************** */}



      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleConf}
          onRequestClose={() => {
            setModalVisibleConf(false)
          }}
        >
          <View style={styles.centeredView1}>
            <View style={styles.modalView1}>
              <Text style={styles.modalText}>Delete Team Member?</Text>

              <Text style={{ fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, color: '#272728', paddingVertical: 5 }}>
              Are you sure you wish to delete this memeber from the team?

              </Text>

              <View style={{ height: HEIGHT * 0.2, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisibleConf(false)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonDelete]}
                  onPress={() => handleMemberDelete()}
                >
                  <Text style={[styles.textStyle, { color: COLORS.APPCOLORS }]}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* ******************************************************************************************************** */}



      {/* ******************************************Leave team member modal box********************************** */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleLeave}
          onRequestClose={() => {
            setModalVisibleLeave(false)
          }}
        >
          <View style={styles.centeredView1}>
            <View style={styles.modalView1}>
              <Text style={styles.modalText}>Leave Team</Text>

              <Text style={{ fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, color: '#272728', paddingVertical: 5 }}>
              Are you sure you want to leave this team?
              </Text>

              <View style={{ height: HEIGHT * 0.2, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisibleLeave(false)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonDelete]}
                  onPress={() => handleMemberLeaveSuccess()}
                >
                  <Text style={[styles.textStyle, { color: COLORS.APPCOLORS }]}>Leave</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>


      {/* ************************************************************************************************* */}

    </>
  )
}

const Heading = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: HEIGHT * 0.13 }}>
      <TouchableOpacity onPress={() => props.onPressBack()} style={{ alignItems: 'flex-end', width: WIDTH * 0.1 }}>
        <Image source={require('./../../Assets/Images/arrow_back.png')} resizeMode='contain' style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

      <Text style={{ color: COLORS.WHITE, width: '75%', fontFamily: FONT.FAMILY.ROBOTO_Medium, fontSize: FONT.SIZE.EXTRALARGE, textAlign: 'center' }}>{props.title}</Text>


      {props.leagueData && (props.leagueData.league.creator_id == props.userId) ?

        <TouchableOpacity onPress={() => props.onPressEdit()} style={{ alignItems: 'flex-end', width: WIDTH * 0.1 }}>
          <Image source={require('./../../Assets/Images/edit.png')} resizeMode='contain' style={{ width: 20, height: 20 }} />
        </TouchableOpacity>

        : null
      }

    </View>
  )
}


const ListCell = (props) => {
  return props.leagueList.map((item, index) => {
    return (
      <View style={{ width: WIDTH * 0.87, flexDirection: 'row', marginVertical: 15 }}>

        <View style={{ width: WIDTH * 0.70, flexDirection: "row" }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.cellText}>{index + 1 + ". "}</Text>
            <View style={{ backgroundColor: '#C1C1C1', height: HEIGHT * 0.03, width: 0.8, marginLeft: 5, marginRight: 5 }} />
          </View>
          <Text style={[styles.cellText, { width: WIDTH * 0.54 }]} numberOfLines={1}>{item.name}{props.leagueData && (props.leagueData.league.creator_id == item.member_id) && <Text> {" (C)"}</Text>}</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.PtsText, { color: item.total_point <= '150' ? COLORS.SECONDARY : COLORS.BLACK }]}>{item.total_point < '150' ? item.total_point : '150'}</Text>
        </View>

        {props.leagueData && (props.leagueData.league.creator_id == props.userId) ?
          item.member_id != props.userId &&
          <TouchableOpacity onPress={() => props.onPress(item)}>
            <AntDesign name="close" size={20} color={COLORS.TEXTCOLORS} />
          </TouchableOpacity>
          : null
        }
      </View>
    )
  })
}


const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: COLORS.BACKGROUNDCOLOR,
    alignItems: "center"
  },
  subContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  headingCont: {
    height: HEIGHT * 0.15,
    width: WIDTH * 0.75,
    alignItems: "center",
    justifyContent: "center"
  },
  headingText: {
    color: COLORS.LOGOCOLOR,
    fontSize: FONT.SIZE.EXTRALARGE,
    textAlign: "center",
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.ROBOTO_Bold
  },
  headingSubText: {
    color: COLORS.LOGOCOLOR,
    fontSize: FONT.SIZE.LARGE,
    textAlign: "center",
    fontFamily: FONT.FAMILY.ROBOTO_Bold,
    paddingTop: 5
  },

  subCellstyle: {
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-between"
  },
  cellcomponent: {
    width: 10,
    marginRight: 8,
    height: 10,
    borderRadius: 10 / 2,
    borderColor: "#6d6d6d",
    borderWidth: 1
  },
  cellText: {
    color: COLORS.LOGOCOLOR,
    fontSize: FONT.SIZE.LARGE,

  },
  PtsText: {
    textTransform: 'uppercase',
    color: COLORS.LOGOCOLOR,
    fontSize: FONT.SIZE.LARGE,
    paddingRight: 12
  },
  ptsImage: {
    width: 26,
    height: 26
  },
  centeredView: {
    height: HEIGHT,
    width: WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    height: HEIGHT * 0.82,
    width: WIDTH * 0.9,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    width: WIDTH * 0.78,
    height: HEIGHT * 0.4,
    elevation: 5
  },
  centeredViewEmail: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalViewEmail: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    height: HEIGHT * 0.52,
    width: WIDTH * 0.8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  imageContainer: {
    width: WIDTH,
    height: HEIGHT,
  },
  centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView1: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: WIDTH * 0.78,
    height: HEIGHT * 0.4,
  },
  button: {
    borderRadius: 10,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: COLORS.APPCOLORS,
    width: WIDTH * 0.28,
    height: HEIGHT * 0.065,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDelete: {
    borderColor: COLORS.APPCOLORS,
    borderWidth: 1,
    width: WIDTH * 0.28,
    height: HEIGHT * 0.065,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: FONT.FAMILY.ROBOTO_Regular,
    fontSize: FONT.SIZE.MEDIUM
  },
  modalText: {
    marginBottom: 15,
    color: COLORS.TEXTCOLORS,
    fontFamily: FONT.FAMILY.ROBOTO_Medium,
    fontSize: FONT.SIZE.LARGE,
  }
})