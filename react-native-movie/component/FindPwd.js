import React,{useState } from "react";
import { View,Text,TextInput,TouchableOpacity,StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FindPwdScreen = () => {
    const [email,setEmail] = useState("")
    const [pwMessage,setPwMessage] = useState("")
    const [takePwdCode,setTakePwdCode] = useState("")
    const navigation = useNavigation();
    
    const sendEmail = async () => {
        if (!email) {
            setPwMessage('이메일을 입력해주세요');
            return;
        }
        setPwMessage("이메일 발송중입니다...")

        try {
            const response = await axios.post(`http://192.168.3.22:9090/user/request_verification?email=${email}`);
            
            if (response.data.success) {
                setPwMessage(response.data.message || "인증코드를 이메일로 발송했습니다.");
            } else {
                setPwMessage(response.data.message || "인증코드 발송에 에러가 발생했습니다.");
            }
        } catch (error) {
            setPwMessage("해당 이메일로 등록된 아이디를 찾을 수 없습니다.");
            console.error("Error sending email:", error);
        }
    };

    // 인증 코드 확인
    const handleFindPassword = async () => {
        if (!takePwdCode) {
            setPwMessage('인증코드를 입력해주세요');
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`http://192.168.3.22:9090/user/verify_email?email=${email}&code=${takePwdCode}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    withCredentials: true,
                }
            );
    
            if (response.status === 200) {
                setPwMessage(response.data.message || '인증 성공');
                alert('인증 성공');
                navigation.navigate('ChangePwd'); 
            } else {
                setPwMessage(response.data.message || '인증코드가 일치하지 않습니다.');
            }
        } catch (error) {
            setPwMessage("서버 오류가 발생했습니다.");
            console.error("Error verifying code:", error.response || error.message);
        } 
    };
    
    


    return(
        <View style={styles.background}>
            <View style={styles.container}>
                <View style={styles.contentcontainer}>
                    <View style={styles.header}>
                        <TouchableOpacity  onPress={() => navigation.navigate('LoginStack')}>
                            <Text style={styles.backButton}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.titlecontent}>비밀번호 찾기</Text>
                    </View>
                    <Text style={styles.content}>이메일</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="이메일을 입력하세요"
                        placeholderTextColor="#A6A6A6"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        required
                    />
                    <TouchableOpacity onPress={sendEmail}>
                        <Text style={styles.button}>임시 비밀번호 받기</Text>
                    </TouchableOpacity>
                    {pwMessage && (
                        <View>
                            <Text style={styles.to}>{}</Text>

                            {/* 인증코드를 이메일로 발송한 경우 */}
                            {pwMessage === "인증코드를 이메일로 발송했습니다." && (
                                <View>
                                    <Text style={styles.content}>인증코드를 입력하세요</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="이메일로 받은 인증코드를 입력하세요"
                                        placeholderTextColor="#ddd"
                                        value={takePwdCode}
                                        onChangeText={setTakePwdCode}
                                        required
                                    />
                                    <TouchableOpacity
                                        onPress={handleFindPassword}
                                    >
                                        <Text style={styles.button}>인증코드확인</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                    {pwMessage && <Text style={styles.message}>{pwMessage}</Text>}
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0, 0, 0, 0.8)'
    },
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding:35,
        marginBottom:40,
        borderRadius:35,
        height:500
    },
    header: {
        flexDirection:'row',
        margin:5,
        paddingBottom:5

    },
    contentcontainer:{
        justifyContent:'center',
        width:280 ,
        paddingTop:30
    },
    content:{
        color:'#fff',
        fontSize:14,
        marginBottom:5,
        marginTop:35
    },
    titlecontent:{
        color:'#fff',
        fontSize:22,
        paddingLeft:55, 
    },
    input: {
        fontSize:12,
        color:'#fff',
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft:10,
        borderRadius: 8,
      },
    button:{
        backgroundColor:'red',
        textAlign:'center',
        fontSize: 14,
        padding:10,
        color:'white',
        borderRadius:10,
    },
    backButton: {
        color:'#fff',
        fontSize:30,
        justifyContent:'center',
        marginTop:-10
        
    },
    message: {
        color: 'red',
        padding:10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize:12
      },
    to: {
        padding:5
    }
  });
export default FindPwdScreen;