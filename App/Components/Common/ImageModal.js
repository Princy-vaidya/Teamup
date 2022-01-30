import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Modal, TouchableHighlight} from 'react-native';
import { COLORS, FONT } from '../../Utils/constants';


export default function ImageModal({visible, bannerText, cameraClick, libreryClick, close}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setmodal(!modal);
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalBody}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 15,
                fontSize: FONT.SIZE.LARGE,
              }}>
              {bannerText}
            </Text>
            <View style={styles.privacyContainer}>
              <TouchableOpacity
                onPress={cameraClick}
                style={{
                  paddingVertical: 20,
                  borderColor: '#cccccc',
                  borderWidth: 1,
                  width: '100%',
                  backgroundColor: '#e6e6e6',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: FONT.SIZE.MEDIUM,
                    color: COLORS.PRIMARY,
                  }}>
                  {'Upload from camera'.toUpperCase()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={libreryClick}
                style={{
                  paddingVertical: 20,
                  borderColor: '#cccccc',
                  borderWidth: 1,
                  width: '100%',
                  backgroundColor: '#e6e6e6',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: FONT.SIZE.MEDIUM,
                    color: COLORS.PRIMARY,
                  }}>
                  {'Upload from Library'.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableHighlight
            style={styles.privacycloseIcon}
            onPress={close}>
            <Image
              source={require('../../Assets/Images/close.png')}
              style={{width: 25, height: 25}}
            />
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalCloseIcon: {
        height: 25,
        width: 25,
        resizeMode: 'contain'
      },
      modalBody: {
        justifyContent: 'center',
        alignItems: 'center',
        // height: Audio,
        width: '75%',
        height: 180,
        backgroundColor: '#fff',
        marginHorizontal: 50,
        marginVertical: 50,
        // borderRadius: 15,
        // overflow: 'hidden',
        // resizeMode:"contain"
      },
      modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: ' rgba(0,0,0,0.8)'
      },
      closeIcon: {
        paddingTop: 30
      },
      privacycloseIcon: {
        position: "absolute",
        top: -10,
        right: -5,
        backgroundColor: "#fff",
        padding: 6,
        zIndex: 99999,
        borderRadius: 25,
        shadowOffset: { width: 1, height: 2 }, shadowColor: '#d8d8d8', shadowOpacity: 1, shadowRadius: 5,
      },
      ModalInnerContainer: {
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      privacyContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        // paddingVertical: 15,
        flex: 1,
        position: "relative"
      },
});
