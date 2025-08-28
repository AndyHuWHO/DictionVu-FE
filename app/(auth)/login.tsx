// app/(auth)/login.tsx
import { useState } from "react";
import {
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
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
  const isLoginDisabled = !email || !password;
  const [loginPressed, setLoginPressed] = useState(false);

  const handleLogin = async () => {
    setLoginPressed(true);
    const result = await dispatch(loginThunk({ email, password }));
    setLoginPressed(false);
    if (loginThunk.fulfilled.match(result)) {
      router.dismiss();
    }
  };

  const handleSkipLogin = () => {
    router.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
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
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.placeholder}
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
            onEndEditing={(e) => setEmail(e.nativeEvent.text)}
            keyboardType="email-address"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor={theme.placeholder}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            onEndEditing={(e) => setPassword(e.nativeEvent.text)} 
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          {auth.status === "loading" || loginPressed ? (
            <ActivityIndicator
              size="large"
              color={theme.activity}
              style={styles.loading}
            />
          ) : (
            <TouchableOpacity 
            style={[styles.button, isLoginDisabled && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoginDisabled}
          >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
          )}

          {auth.status === "error" && (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {auth.error || "Login failed. Try again."}
            </Text>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
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
  buttonDisabled: {
  backgroundColor: "#979797ff", 
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
