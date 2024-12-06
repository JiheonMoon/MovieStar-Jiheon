import React,{useState } from "react";
import { View,Text,Touchable,TextInput } from "react-native";



const FindPwdScreen = () => {
    const [email,setEmail] = useState("")
    const [message,setMessage] = useState("")
    


    return(
        <View>
            <Text>비밀번호 찾기</Text>
        </View>

    )
}

export default FindPwdScreen;