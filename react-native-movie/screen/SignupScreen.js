import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator,TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPwd: "",
    userPwdCheck: "",
    userNick: "",
    userName: "",
    userLikeList: [],
  });

  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    // 폼 검증
    if (!formData.userName) {
      setMessage("아이디를 입력해주세요");
      setDisabled(true);
    } else if (!formData.userEmail) {
      setMessage("이메일을 입력해주세요.");
      setDisabled(true);
    } else if (!emailCheck.test(formData.userEmail)) {
      setMessage("이메일 형식을 확인해주세요.");
      setDisabled(true);
    } else if (!formData.userNick) {
      setMessage("닉네임을 입력해주세요.");
      setDisabled(true);
    } else if (!formData.userPwd) {
      setMessage("비밀번호를 입력해주세요.");
      setDisabled(true);
    } else if (formData.userPwd !== formData.userPwdCheck) {
      setMessage("비밀번호가 일치하지 않습니다.");
      setDisabled(true);
    } else {
      setMessage("");
      setDisabled(false);
    }
  }, [formData]);

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e });
  };

  const handleSubmit = async () => {
        if (!disabled) {
            setLoading(true); // 로딩 시작
            try {
                const newUser = {
                userName: formData.userName,
                userPwd: formData.userPwd,
                userEmail: formData.userEmail,
                userNick: formData.userNick,
                userLikeList: [],
                };

                const existingUsers = await AsyncStorage.getItem('users');
                const users = existingUsers ? JSON.parse(existingUsers) : [];
                
                if (users.some(user => user.userEmail === formData.userEmail)) {
                    setMessage("이미 등록된 이메일입니다.");
                    setDisabled(true);
                    return;
                }

                // Save new user
                users.push(newUser);
                await AsyncStorage.setItem('users', JSON.stringify(users));

                // Success message
                Alert.alert("회원가입 완료");
                navigation.navigate("Login"); // 로그인 화면으로 이동

                // Clear form data
                setFormData({
                    userEmail: "",
                    userPwd: "",
                    userPwdCheck: "",
                    userNick: "",
                    userName: "",
                    userLikeList: [],
                });

            } catch (error) {
                console.error(error);
                Alert.alert("회원가입 오류", "회원가입에 실패했습니다.");
            } finally {
                setLoading(false); // 로딩 종료
            }
        }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>

        <Text style={styles.header}>회원가입</Text>

        <TextInput
            style={styles.input}
            placeholder="아이디를 입력하세요"
            value={formData.userName}
            onChangeText={(text) => handleChange(text, "userName")}
        />

        <TextInput
            style={styles.input}
            placeholder="이메일을 입력하세요"
            value={formData.userEmail}
            onChangeText={(text) => handleChange(text, "userEmail")}
        />

        <TextInput
            style={styles.input}
            placeholder="닉네임을 입력하세요"
            value={formData.userNick}
            onChangeText={(text) => handleChange(text, "userNick")}
        />

        <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry
            value={formData.userPwd}
            onChangeText={(text) => handleChange(text, "userPwd")}
        />

        <TextInput
            style={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
            secureTextEntry
            value={formData.userPwdCheck}
            onChangeText={(text) => handleChange(text, "userPwdCheck")}
        />
        

        {message && <Text style={styles.message}>{message}</Text>}

        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <Button title="회원가입" onPress={handleSubmit} disabled={disabled} />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
    },
    message: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    backButton: {
        color:'black',
        fontSize:30,
        marginBottom: 5,
    },
});

export default Signup;
