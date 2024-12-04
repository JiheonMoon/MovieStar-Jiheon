import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, Text, TextInput,Button } from "react-native";




const LoginScreen = () => {
    const [formData, setFormData] = useState({ userName: "", userPwd: "" });
    const [error, setError] = useState("")
    const navigation = useNavigation();


        // 로고 클릭 시 메인화면 띄우기
    const handleLogoClick = () => {
        navigation.navigate("Home");
    };


    // 네이버 로그인
    const handleNaverLogin = () => {
        const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_LOGIN_CLIENT_ID;
        const REDIRECT_URI = 'http://localhost:9090/oauth';
        const STATE = "false";
        const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
        window.location.href = NAVER_AUTH_URL;
    };

    // 카카오 로그인
    const handleKakaoLogin = () => {
        const Rest_api_key = process.env.REACT_APP_KAKAO_LOGIN_API_KEY;
        const REDIRECT_URI = 'http://localhost:9090/oauth';
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = KAKAO_AUTH_URL;
    };

    // 구글 로그인
    const handleGoogleLogin = () => {
        const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;
        const REDIRECT_URI = 'http://localhost:9090/oauth';
        const SCOPE = "email profile";
        const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;
        window.location.href = GOOGLE_AUTH_URL;
    };

    // 입력값 업데이트
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // 폼 제출 처리
    const handleSubmit = (e) => {
        e.preventDefault();

        // localStorage에서 유저 정보 가져오기
        const storedUser = JSON.parse(
        localStorage.getItem(
            Object.keys(window.localStorage).find(
            key => JSON.parse(localStorage.getItem(key)).userName === formData.userName
            )
        )
        );

        // 유저 정보 확인
        if (storedUser && storedUser.userPwd === formData.userPwd) {
        // 로그인 성공 시
        setUser({
            userName: storedUser.userName,
            userEmail: storedUser.userEmail,
            userNick: storedUser.userNick,
            userLikeList: storedUser.userLikeList,
        }); // 사용자 정보를 Context에 저장
        navigation.navigate("Home"); // MainScreen으로 이동
        } else {
        // 에러 메시지 출력
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    };

    return(
        <View>
            {/* <View>
                <TouchableOpacity onPress={()=>{}}>
                <Image source={}/>
                </TouchableOpacity>
            </View> */}

            <View>
                <Text>로그인</Text>

                {/* 로그인 폼 */}
                <View>
                <Text>아이디</Text>
                <TextInput
                    placeholder="아이디를 입력하세요"
                    value={formData.userName}
                    onChangeText={(value) => setFormData({ ...formData, userName: value })}
                />
                </View>

                <View>
                <Text>비밀번호</Text>
                    <TextInput
                        placeholder="비밀번호를 입력하세요"
                        value={formData.userPwd}
                        onChangeText={(value) => setFormData({ ...formData, userPwd: value })}
                        secureTextEntry
                    />
                </View>

                <Button title="로그인" onPress={()=>{}} />

                {/* 에러 메시지 */}
                {error && <Text>{error}</Text>}

                {/* 소셜 로그인 섹션 */}
                <View>
                    <Text>소셜 로그인</Text>
                        <View>
                            <Button title="네이버 로그인" onPress={handleNaverLogin} />
                            <Button title="카카오 로그인" onPress={handleKakaoLogin} />
                            <Button title="구글 로그인" onPress={handleGoogleLogin} />
                        </View>
                </View>

                {/* 링크 섹션 */}
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate("FindId")}>
                        <Text>아이디 찾기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("FindPassword")}>
                        <Text>비밀번호 찾기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                        <Text>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};


export default LoginScreen;
