import React, { useState, useEffect } from 'react';
import { View, StatusBar, Image, StyleSheet, ScrollView, TouchableOpacity ,ActivityIndicator} from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from '../../Utils/constants';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';


export default function LibaryScree(props) {
    const [link,setLink]=useState('');
    const [visible,setVisible]=useState(true)

    const isFocussed=props.navigation.isFocused();

    useFocusEffect(
        
        React.useCallback(async() => {

            props.navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity style={{ paddingRight: 20, alignItems: "center" }} onPress={() => props.navigation.toggleDrawer()}>
                        <Image source={require("./../../Assets/CreateLeague/menu.png")} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                )
            });

            if(isFocussed){  
                setVisible(true)
         setLink('https://www.teamup-theapp.com/motivation');
            }
         return () => {
            setLink('https://www.teamup-theapp.com/motivation');
          };
         
        }, [link,isFocussed]),
      );



const hideSpinner =()=>{
 setVisible(false)
}

    return (
        <>
            <StatusBar backgroundColor={COLORS.APPCOLORS} barStyle="light-content" />
            <WebView
        //  onLoad={() => hideSpinner()}

                source={{
                    uri: link
                }}
            />
             {visible && (
        <ActivityIndicator
        //   style={{ color:'green' }}
        color="red"
          size="large"
        />
      )}

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        fontSize: FONT.SIZE.EXTRALARGE,
        fontFamily: FONT.FAMILY.ROBOTO_Regular
    },

})