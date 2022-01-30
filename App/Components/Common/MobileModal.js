import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONT, HEIGHT, WIDTH } from "../../Utils/constants";

const ModalScreen = (props) => {

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    props.onRequestClose()
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Mobile Access</Text>
                        <Text style={{ width: WIDTH * 0.53, fontSize: FONT.SIZE.LARGE, textAlign: 'center', fontFamily: FONT.FAMILY.ROBOTO_Regular, paddingVertical: 10 }}>Your mobile number will be used to connect you with friends and family within the Teamup app.</Text>

                        <TouchableOpacity onPress={()=>props.onPress()} activeOpacity={0.8} style={{ borderColor: COLORS.APPCOLORS, borderWidth: 1, borderRadius: 5, marginVertical: 40, alignItems: 'center', justifyContent: 'center', width: WIDTH * 0.5, height: HEIGHT * 0.075 }}>

                            <Text style={{ fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.LARGE, color: COLORS.APPCOLORS }}>Close</Text>

                        </TouchableOpacity>

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
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: WIDTH * 0.7,
        height: HEIGHT * 0.35
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
        fontFamily: FONT.FAMILY.ROBOTO_Medium,
        fontSize: FONT.SIZE.LARGE
    }
});

export default ModalScreen;