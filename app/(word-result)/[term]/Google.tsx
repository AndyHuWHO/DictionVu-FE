// app/(word-result)/[term]/google.tsx
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { useRef, useState } from "react";

export default function GoogleScreen() {
  const { term } = useLocalSearchParams();
  const searchTerm = Array.isArray(term) ? term[0] : term ?? "";
  const initialUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;

  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: initialUrl }}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        onLoadEnd={() => setLoading(false)}
        onShouldStartLoadWithRequest={(request) => {
          // Allow only the initial URL
          return request.url === initialUrl;
        }}
        injectedJavaScript={`
          const anchors = document.querySelectorAll("a");
          anchors.forEach(a => {
            a.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
            };
            a.removeAttribute("href");
            a.style.pointerEvents = "none";
            a.style.color = "gray";
          });
          true;
        `}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 10,
  },
});

