// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "@/redux/features/auth/authThunks";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];

  const handleLogin = async () => {
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      router.back(); 
    }
  };

  const handleSkipLogin = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <TouchableOpacity onPress={handleSkipLogin} style={styles.closeButton}>
        <Feather name="x" size={28} color="#000000ff" />
      </TouchableOpacity>
      <Text style={styles.title}>Log In to Dictionvu</Text>

      <Image
        source={require("@/assets/dictionvu-logo2.png")} 
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={[styles.input]}
        placeholder="Email"
        placeholderTextColor={theme.placeholder}
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input]}
        placeholder="Enter password"
        placeholderTextColor={theme.placeholder}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {auth.status === "loading" ? (
        <ActivityIndicator
          size="large"
          color={theme.icon}
          style={styles.loading}
        />
      ) : (
        <TouchableOpacity style={[styles.button]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      )}

      {auth.status === "error" && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {auth.error || "Login failed. Try again."}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    fontSize: 24,
    marginBottom: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#585859ff",
    color: "#060505ff",
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#ff0550ff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffffff",
  },
  loading: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 16,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    paddingTop: 10,
  },
  logo: {
    width: 160,
    height: 80,
    alignSelf: "center",
    margin: 30,
  },
});
