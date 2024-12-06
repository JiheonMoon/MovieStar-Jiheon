import React,{useState } from "react";
import { View,Text,TextInput,TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";


const FindIdScreen = () => {
    const [email,setEmail] = useState("")
    const [message,setMessage] = useState("")
    const navigation = useNavigation();

    // const handleFindId = (e) => {
    //     e.preventDefault();
    //     if (email === "example@example.com") {
    //         setMessage("회원님의 아이디는 exampleUser 입니다.");
    //     } else {
    //         setMessage("입력하신 정보와 일치하는 아이디가 없습니다.");
    //     }
    // };


    return(
        <View>
            <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
                <Text>←</Text>
            </TouchableOpacity>

            <Text>아이디 찾기</Text>
            <Text>가입한 이메일</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="이메일을 입력해주세요"
                placeholderTextColor="white"
                keyboardType="email-address"
                    autoCapitalize="none"
                    required
            />
            <TouchableOpacity onPress={handleFindId}>
                <Text>아이디 찾기</Text>
            </TouchableOpacity>
            {message && <Text>{message}</Text>}
        </View>

    )
}

export default FindIdScreen;