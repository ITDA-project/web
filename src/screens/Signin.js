import React, { useContext, useState } from "react";
import { Image, ActivityIndicator } from "react-native";
import { Button } from "../components";
import styled, { ThemeContext } from "styled-components/native";
import Logo from "../../assets/logo.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  login,
  getProfile as getKakaoProfile,
} from "@react-native-seoul/kakao-login";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 30px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const DividerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const DividerText = styled.Text`
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.grey};
  margin: 0px 20px;
`;

const Signin = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const signInWithKakao = async () => {
    try {
      setLoading(true);

      // 1. 카카오 로그인
      const token = await login();

      const loginData = {
        accessToken: token.accessToken,
        idToken: token.idToken,
        refreshToken: token.refreshToken,
      };

      console.log("백엔드로 보낼 로그인 데이터", loginData);

      // 2. 카카오 프로필 가져오기
      const profile = await getKakaoProfile();

      // 3. 필요한 정보 추출
      const userData = {
        name: profile.name,
        email: profile.email,
        gender: profile.gender,
        phoneNumber: profile.phoneNumber,
      };

      console.log("백엔드로 보낼 데이터", userData);

      // 4. 백엔드로 전달 (예시: fetch 사용)
      const response = await fetch("http://<백엔드-URL>/auth/kakao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      console.log("백엔드 응답", responseData);

      // 5. 필요하면 토큰 저장 등 후처리
      setResult(JSON.stringify(responseData));
    } catch (err) {
      console.error("카카오 로그인 실패", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container insets={insets}>
      {loading && (
        <ActivityIndicator
          size="large"
          color={theme.colors.red}
          style={{ position: "absolute", top: "50%", zIndex: 2 }}
        />
      )}

      <Logo style={{ marginBottom: 50 }} />

      <DividerContainer>
        <Image source={require("../../assets/line.png")} />
        <DividerText>로그인/회원가입</DividerText>
        <Image source={require("../../assets/line.png")} />
      </DividerContainer>

      <Button
        title="카카오로 시작하기"
        onPress={signInWithKakao}
        icon={require("../../assets/kakao.png")}
        containerStyle={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#FFDE00",
          marginTop: 0,
          marginBottom: 30,
        }}
        textStyle={{
          color: "#3B1E1E",
          fontSize: 16,
          fontFamily: theme.fonts.bold,
        }}
      />

      <Button
        title="네이버로 시작하기"
        onPress={() => console.log("네이버 로그인 준비 중!")}
        icon={require("../../assets/naver.png")}
        containerStyle={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#00C73C",
          marginTop: 0,
          marginBottom: 30,
        }}
        textStyle={{
          color: "#ffffff",
          fontSize: 16,
          fontFamily: theme.fonts.bold,
        }}
      />

      <Button
        title="이메일로 시작하기"
        onPress={() => navigation.navigate("이메일로 시작하기")}
        icon={require("../../assets/mail.png")}
        containerStyle={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#E3F0FF",
          marginTop: 0,
          marginBottom: 60,
        }}
        textStyle={{
          color: "#3F9AFE",
          fontSize: 16,
          fontFamily: theme.fonts.bold,
        }}
      />
    </Container>
  );
};

export default Signin;
