import React, { useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Image,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH, IAMGE_URL } from './../../Utils/constants';


function Comment(props) {

    const [flag, setFlag] = React.useState(true)


    const handlePress = () => {
        if (flag) {
            setFlag(true)
        } else {
            setFlag(false)
        }
    }


    return (
        <>

            {/* <TouchableOpacity onPress={() => handlePress()} style={{ alignItems: 'center', marginTop: 15 }}>
              <Text style={{ color: '#B1B0B7', fontFamily: FONT.FAMILY.ROBOTO_Regular }}>View all {props.comments !== undefined && props.comments.length != 0 && props.comments.length} comments</Text>
            </TouchableOpacity> */}

            {flag &&
                <>
                    {props.comments.length != 0 && props.comments.map((item) => {
                        return (
                            <View style={{ justifyContent: 'center', marginTop: 15, flexDirection: 'row' }}>
                                <Image source={{ uri: item.commenterProfile }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                <View style={{  marginLeft: 10, width: WIDTH * 0.65, borderRadius: 10, paddingVertical: 8 }}>
                                <Text style={{ color: COLORS.TEXTCOLORS, paddingLeft: 7, fontFamily: FONT.FAMILY.ROBOTO_Regular, fontSize: FONT.SIZE.MEDIUM }}>
                                <Text style={{ color: COLORS.TEXTCOLORS,  fontFamily: FONT.FAMILY.ROBOTO_Bold, fontSize: FONT.SIZE.MEDIUM }}>{item.commenterName + '  '}</Text>

                                    {item.comment}</Text>
                                </View>
                            </View>
                        )
                    })
                    }
                </>
             } 

        </>
    )

}

export default Comment;