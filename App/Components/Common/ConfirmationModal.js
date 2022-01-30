import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { COLORS, FONT, HEIGHT, WIDTH } from "../../Utils/constants";


const ConfirmModal = (props) => {


    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisibleConf}
                onRequestClose={() => {
                   props.onRequestClose
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure?</Text>

                        <Text style={{ fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Regular, color: '#272728', paddingVertical: 5 }}>
                           Are you sure you want to leave this team?
                        </Text>

                        <View style={{ height: HEIGHT * 0.2, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={props.onPressCancel}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonDelete]}
                                onPress={props.onPressDelete}
                            >
                                <Text style={[styles.textStyle, { color: COLORS.APPCOLORS }]}>Delete</Text>
                            </Pressable>
                        </View>
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
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: WIDTH * 0.74,
        height: HEIGHT * 0.32
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
});

export default ConfirmModal;