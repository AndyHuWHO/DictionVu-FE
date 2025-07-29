// app/(tabs)/profile/index.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logoutThunk } from "@/redux/features/auth/authThunks";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function ProfileTabScreen() {
  const user = useSelector((state: RootState) => state.user.profile);
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

 useEffect(() => {
  if (!auth.token) {
    router.push("/(tabs)/diction"); 
  }
}, [auth.token]);

  return (
    <ThemedView style={styles.container}>
      <Image
        source={
          user?.profileImageUrl
            ? { uri: user.profileImageUrl }
            : require("@/assets/favicon.png") // fallback image
        }
        style={styles.avatar}
      />

      <ThemedText style={styles.nameText}>
        {user?.profileName || "Momo"}
      </ThemedText>

      <ThemedText style={styles.idText}>ID: {user?.publicId}</ThemedText>
      <ThemedText style={styles.idText}>Bio: {user?.bio}</ThemedText>

      <TouchableOpacity onPress={handleLogout} style={{ margin: 20 }}>
        <ThemedText style={{ fontSize: 16 }}>Log Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: "#ccc",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  idText: {
    fontSize: 14,
    color: "#888",
    paddingBottom: 8,
  },
});
