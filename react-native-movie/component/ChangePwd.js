import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PwdChangeScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');



    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChangePassword = () => {
        if (!newPassword || !confirmNewPassword) {
            setErrorMessage('모든 항목을 입력해주세요');
            return false;
        }

        if (newPassword !== confirmNewPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return false;
        }
        if (newPassword.length < 6) {
            setErrorMessage('비밀번호는 최소 6자 이상이여야합니다.');
            return false;
        }
        if (!passwordCheck.test(newPassword)) {
            setErrorMessage('비밀번호는 최소 8자 이상이며, 대소문자, 숫자, 특수문자가 포함되어야 합니다.');
            return false;
        }

        setErrorMessage('');
        return true;
    }

    const handleSubmit = async () => {
        if (handleChangePassword()) {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.put(
                    `http://192.168.3.22:9090/user/modifyPwd?email=${email}`, 
                    {userPwd: newPassword,},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    console.log('비밀번호가 변경되었습니다.');
                    alert("비밀번호가 변경되었습니다.");

                    navigation.navigate('LoginStack');
                } else {
                    setErrorMessage(response.data.message || '비밀번호 변경에 실패했습니다.');
                }

            } catch (error) {
                setErrorMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
                console.error('로그인 실패: ', error);
            }
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'black',paddingBottom:50 }}>
            <View style={{ width: '80%' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center',color:'#fff',marginBottom:20}}>비밀번호 변경</Text>
                
                <View style={{ marginBottom: 5}}>
                    <Text style={{color:'#fff', marginBottom:5, padding:5 }}>이메일</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderRadius:10,
                            borderColor: 'gray',
                            marginBottom: 10,
                            paddingHorizontal: 10,
                            height: 40,
                            color:'#fff'
                        }}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="이메일 입력"
                        placeholderTextColor='#bbb'
                    />
                </View>
                
                <View style={{ marginBottom: 20 }}>
                    <Text style={{color:'#fff', marginBottom:5, padding:5 }}>새 비밀번호</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderRadius:10,
                            borderColor: 'gray',
                            color:'#fff',
                            paddingHorizontal: 10,
                            height: 40,
                        }}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="새 비밀번호 입력"
                        secureTextEntry
                        placeholderTextColor='#bbb'
                    />
                </View>
                
                <View style={{ marginBottom: 20 }}>
                    <Text style={{color:'#fff', marginBottom:5, padding:5}}>새 비밀번호 확인</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderRadius:10,
                            borderColor: 'gray',
                            marginBottom: 12,
                            paddingHorizontal: 10,
                            height: 40,
                            color:'#fff'
                        }}
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        placeholder="새 비밀번호 다시 입력"
                        secureTextEntry
                        placeholderTextColor='#bbb'
                    />
                </View>

                <TouchableOpacity onPress={handleSubmit} style={{
                    backgroundColor: 'red',
                    padding: 15,
                    borderRadius: 8,
                    marginBottom: 20,
                    alignItems: 'center',
                }}>
                    <Text style={{ color: 'white' }}>비밀번호 변경</Text>
                </TouchableOpacity>

                {errorMessage && <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>}
            </View>
        </View>
    );
};

export default PwdChangeScreen;
