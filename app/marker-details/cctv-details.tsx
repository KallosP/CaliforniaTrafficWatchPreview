import { ActivityIndicator, StyleSheet, Text, View, Image } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef } from 'react';
import { CCTV } from "../custom-types/url-types";
import MarkerDetailStyleBase from "../custom-styles/marker-details-style-base";
import MarkerDetailsStyleDark from "../custom-styles/marker-details-style-dark";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from '../custom-components/theme-context'; 
import { GREEN_THEME_COLOR } from "../constants/theme-colors";


let keyCtr = 0;
// NOTE: rough template of cctv details page, will change in future
export default function CctvDetail({ cctv }: CCTV) { 
  // Variable for managing the display of live video or a recent image (used when video source exists)
  const [showVideo, setShowVideo] = React.useState(true);
  // Variable for allowing video (is based on whether or not a video source exists)
  const [allowVideo, setAllowVideo] = React.useState(true);
  // Manages disabling button; is disabled when no video source available
  const [disableButton, setDisableButton] = React.useState(false);
  // Dynamic caption text top
  const [captionTextTop, setCaptionTextTop] = React.useState('Most Recent Image');
  // Dynamic caption text bottom 
  const [captionTextBottom, setCaptionTextBottom] = React.useState('Live Video');
  const { isDarkMode } = useTheme();

  const themeStyle = isDarkMode ? MarkerDetailsStyleDark : MarkerDetailStyleBase;

  const videoRef = useRef<Video | null>(null);

  const videoSource = cctv.imageData.streamingVideoURL;
  const imgSource = cctv.imageData.static.currentImageURL;
  const county = cctv.location.county;
  const locationName = cctv.location.locationName;
  const nearbyPlace = cctv.location.nearbyPlace;
  const latlng = `${cctv.location.latitude}, ${cctv.location.longitude}`;
  const elevation = cctv.location.elevation;
  const direction = cctv.location.direction;
  const route = cctv.location.route;
  const routeSuffix = cctv.location.routeSuffix;
  const postmilePrefix = cctv.location.postmilePrefix;
  const postmile = cctv.location.postmile;
  const alignment = cctv.location.alignment;
  const milepost = cctv.location.milepost;

  const renderDetailText = (label: string, value: string) => (
    <Text style={themeStyle.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  useEffect(() => {
    // Manage whether or not video is allowed to be displayed
    if (videoSource === "") {
      setAllowVideo(false);
      setDisableButton(true);
    } 
    else{
      setAllowVideo(true);
      setDisableButton(false);
    }
  }, [videoSource])

  function handleCaptionButtonPress() {
    if (captionTextTop === "Live Video") {
      setShowVideo(true);
      setCaptionTextTop("Most Recent Image");
      setCaptionTextBottom("Live Video");
    }
    else{
      setShowVideo(false);
      setCaptionTextTop("Live Video");
      setCaptionTextBottom("Most Recent Image");
    }
  }

  // Default to live video as top caption and most recent image as bottom
  // when video source is not available
  function showCaptionTop() {
    return (videoSource === "") ? 'Live Video' : captionTextTop
  }
  function showCaptionBottom() {
    return (videoSource === "") ? 'Most Recent Image' : captionTextBottom
  }

  return (
    <>
      <View style={isDarkMode ? MarkerDetailsStyleDark.titleContainer : themeStyle.titleContainer}>
        <Text style={themeStyle.title}>CCTV</Text>

        {!allowVideo && (
          <Text style={themeStyle.cctvText}>
            No live video available for this camera.
          </Text>
        )}

      </View>

      <View style={themeStyle.divider}/>

      <BottomSheetScrollView>
        <View style={styles.spacingContainer}>
          <View style={[styles.mediaContainerBase, isDarkMode ? styles.mediaContainerDark : styles.mediaContainerLight]}>
            {(showVideo && allowVideo) ? (
              <Video
                key={++keyCtr}
                ref={videoRef}
                source={{ uri: videoSource }}
                style={styles.media}
                useNativeControls={false}
                shouldPlay={true}
                isLooping={true}
                resizeMode={ResizeMode.STRETCH}
              >
                <ActivityIndicator size="small" color={GREEN_THEME_COLOR}/>
              </Video>
            ) : (
              <Image
                source={{ uri: imgSource }}
                style={styles.media}
                resizeMode="stretch"
              />
            )}
            <View style={styles.captionContainer}>
              <TouchableOpacity disabled={disableButton} style={[styles.buttonCaptionDisabled, disableButton ? styles.buttonCaptionDisabled : styles.buttonCaption]} onPress={() => disableButton ? alert("Video not available") : handleCaptionButtonPress()}>
                <Text style={styles.buttonCaptionText}>
                  {showCaptionTop()}
                </Text>
              </TouchableOpacity>
              <Text style={styles.caption}>
                  {showCaptionBottom()}
              </Text>

            </View>
          </View>
        </View>

        <View style={themeStyle.detailsContainer}>
          <Text style={themeStyle.detailsTitle}>Details</Text>
          {renderDetailText("Location", locationName)}
          {renderDetailText("County", county)}
          {renderDetailText("Nearby Place", nearbyPlace)}
          {renderDetailText("Latitude/Longitude", latlng)}
          {renderDetailText("Elevation", elevation)}
          {renderDetailText("Direction", direction)}
          {renderDetailText("Route", route)}
          {renderDetailText("Route Suffix", routeSuffix)}
          {renderDetailText("Postmile Prefix", postmilePrefix)}
          {renderDetailText("Postmile", postmile)}
          {renderDetailText("Alignment", alignment)}
          {renderDetailText("Milepost", milepost)}
        </View>
      </BottomSheetScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  spacingContainer: {
    marginTop: 16,
  },
  mediaContainerBase: {
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  mediaContainerLight: {},
  mediaContainerDark: {
    borderWidth: 1,
    borderColor: 'black',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    width: 120,
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonCaption: {
    backgroundColor: 'rgba(80, 255, 179, 1)',
  },
  buttonCaptionDisabled: {
    backgroundColor: 'rgba(80, 255, 179, 0.5)',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  buttonCaptionText: {
    color: 'white',
    fontSize: 12,
  },
  caption: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    width: 120,
    textAlign: 'center',
  },
  noVideoText: {
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 16,
  },
});