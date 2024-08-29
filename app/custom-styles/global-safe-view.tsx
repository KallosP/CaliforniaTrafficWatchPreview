import { StyleSheet, Platform, StatusBar } from "react-native";

// SafeAreaView style for iOS and Android
export default StyleSheet.create({
  GlobalSafeArea: {
    flex: 1,
    backgroundColor: "white",
    // Status bar height only factored in on Android, otherwise set to 0 for iOS
    // since SafeAreaView automatically takes into account iOS status bar height
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});