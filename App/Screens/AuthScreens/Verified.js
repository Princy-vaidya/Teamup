import React, { useState, useEffect } from 'react';
import { View, TouchableHighlight, Text, TouchableOpacity, Modal, StyleSheet ,TextInput,Image} from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from './../../Utils/constants';
import OtpInputs from 'react-native-otp-inputs';
import Button from "./../../Components/Common/button"
import { color } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';


export default function VerificationScreens(props) {

    return (
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
                    <View style={{position:'absolute',right:10,top:10}}>
                <AntDesign name="close" size={30} color={COLORS.HEADERCOLOR} onPress={()=>props.onRequestClose()} />
</View>
                    <Text style={{ textAlign: "center", color: COLORS.PRIMARY, fontSize: FONT.SIZE.EXTRALARGE, fontFamily: FONT.FAMILY.ROBOTO_Bold ,marginTop:10}}>Verification code</Text>


                    <Text style={{ textAlign: "center", color: COLORS.GRAY, fontSize: FONT.SIZE.MEDIUM, fontFamily: FONT.FAMILY.ROBOTO_Bold, marginVertical:'5%' }}>
                        We have sent you a code by email. Please check your SPAM if not received.
                    </Text>


                    <View style={{ justifyContent: 'center',  alignItems: "center", justifyContent: "center",marginTop:10 }}>
                        {/* <OtpInputs
                            handleChange={(code) => props.handleChangeVerify(code)}
                            numberOfInputs={4}
                            keyboardType={"phone-pad"}
                            inputContainerStyles={{ borderWidth: 2, borderRadius: 10, margin: 5, borderColor: "grey", height: HEIGHT * 0.1, width: WIDTH * 0.14, alignItems: "center", justifyContent: "center" }}
                            style={{ flexDirection: "row", padding: 5 }}
                            inputStyles={{ fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: 40 }}
                        /> */}
                         <View style={styles.container}>
            <View style={{
                width: '70%',
                backgroundColor: COLORS.TEXTINPUTBACKCOLOR,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderWidth:1,
                borderColor:COLORS.APPCOLORS
            }}>
                <TextInput
                    style={[{ height: 60, borderRadius: 5,width: WIDTH * 0.7, fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: FONT.SIZE.EXTRALARGE, paddingLeft: 15,
                    letterSpacing:4,textAlign:'center',color:COLORS.APPCOLORS},]}
                    onChangeText={(code) => props.handleChangeVerify(code)}
                    placeholder=''
                    // // placeholderTextColor={placeholderTextColor}
                    // value={value}
                    // onBlur={onBlur}
                    keyboardType='number-pad'
                    autoCorrect={false}
                    autoCompleteType='off'
                    // editable={editable}
                    // autoCapitalize={capitalize == "characters" ? "characters" : 'none'}
                    // secureTextEntry={secureTextEntry}
                returnKeyType='done'
                    maxLength={4}
                />
              
            </View>
            <View style={{ flexDirection: 'row' ,marginTop:20}}>
                        <Text style={{ color: COLORS.APPCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }}>Didn't recive a Code?</Text>
                        <TouchableOpacity onPress={props.onPress}>
                            <Text style={{ color: COLORS.APPCOLORS, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }}> Send again</Text>
                        </TouchableOpacity>
                    </View>
        </View>
                    </View>
                    
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: WIDTH * 0.8,
        height: HEIGHT * 0.4
    },
    container: {
        width: WIDTH,
        alignItems: 'center',
        // paddingVertical: 15
    }
})