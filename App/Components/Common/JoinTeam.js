import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput } from "react-native";
import { HEIGHT, WIDTH, COLORS, FONT } from "../../Utils/constants";
import AntDesign from 'react-native-vector-icons/AntDesign';



const JoinTeamComponents = (props) => {
    const [modalVisible, setModalVisible] = useState(true);



    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ width: WIDTH * 0.86, flexDirection: 'row', justifyContent: 'flex-end', padding: 15 }}>
                            <View />
                            <AntDesign name="close" size={30} color={COLORS.HEADERCOLOR} onPress={() => setModalVisible(false)} />

                        </View>


                        <Text style={styles.modalText}>Enter team code</Text>

                        <Text style={{ color: '#B1B0B7', width: WIDTH * 0.7, fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, textAlign: 'center', margin: 25 }}>If you have not received the team code in a message, please ask the Team Captain for it.</Text>


                        <View style={{ height: HEIGHT * 0.15, justifyContent: 'center',alignItems:'center'}}>
                            <TextInput
                                style={{ width: WIDTH * 0.7, height: 60, paddingLeft: 15, borderColor: COLORS.APPCOLORS, borderRadius: 10, borderWidth: 1,  color:COLORS.APPCOLORS, }}
                                placeholder="Enter team code"
                                onChangeText={(val)=>props.onChangeText(val)}
                                autoCapitalize="characters"
                                maxLength={4}
                                 keyboardType="default"
                                returnKeyType="done"
                            />
                        </View>

                        <Pressable onPress={()=> props.onPress()} style={{ width: WIDTH * 0.7, marginTop: 30, height: HEIGHT * 0.07, backgroundColor: COLORS.APPCOLORS, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{ color: COLORS.WHITE, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }}></Text>

                        </Pressable>

                        {/* <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable> */}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        // padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: WIDTH * 0.86,
        height: HEIGHT * 0.55
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: FONT.FAMILY.ROBOTO_Bold,
        fontSize: FONT.SIZE.EXTRALARGE
    }
});

export default JoinTeamComponents;