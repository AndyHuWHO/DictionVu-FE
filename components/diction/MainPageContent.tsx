// components/diction/MainPageContent.tsx
import { ThemedView } from "@/components/themed/ThemedView";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { memo } from "react";

function MainPageContent() {
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.tabBar}>
                <ThemedView style={[styles.tab, {backgroundColor: "#0bd3f1ff"}]}></ThemedView>
                <ThemedView style={[styles.tab, {backgroundColor: "#ff9d00ff"}]}></ThemedView>
                <ThemedView style={[styles.tab, {backgroundColor: "#f878daff"}]}></ThemedView>
            </ThemedView>
            <ThemedView style={styles.imageContainer}>
                <Image source={require('@/assets/tab1.jpg')} style={styles.image} />
            </ThemedView>
        </ThemedView>
    );
}

export default memo(MainPageContent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth:1,
        // borderColor: "#f71616ff",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
        // borderWidth: 1,
        // borderColor: "#c7f60eff",
    },
    tab: {
        flex: 1,
        padding: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginHorizontal: 26,
    },
    imageContainer: {
        width: "100%",
        height: "90%",
        // margin: 10,
        // padding: 10,
        // borderWidth:1,
        // borderColor: "#e302b2ff",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        borderRadius: 8,
    },

});