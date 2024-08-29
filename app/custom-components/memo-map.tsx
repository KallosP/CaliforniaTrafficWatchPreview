// React 
import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, } from 'expo-router';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar, StyleSheet, View, Text, ScrollView, unstable_batchedUpdates } from 'react-native';
// Clustering
import MapView from "react-native-map-clustering";
// Bottom Sheet
import BottomSheetModal from '@gorhom/bottom-sheet';
// Marker Types
import { CCTV, LCS, CC, CHP } from "../custom-types/url-types";
import CctvDetail from "../marker-details/cctv-details";
//import CctvDetailDebug from "../marker-details/cctv-details-debug";
import LcsDetail from "../marker-details/lcs-details";
import CcDetail from "../marker-details/cc-details";
import ChpDetail from "../marker-details/chp-details";
// Light
import XIcon from '../../assets/x_icon.svg';
import CctvIcon from '../../assets/cctv_icon.svg';
import FullLcsIcon from '../../assets/full_lcs_icon.svg';
import OtherLcsIcon from '../../assets/other_lcs_icon.svg';
import TrafficIcon from '../../assets/traffic_icon.svg';
import CenterUserIcon from '../../assets/center_user_icon.svg'
import CCIcon from '../../assets/cc_icon.svg';
import ChpIcon from '../../assets/chp_icon.svg';
import Ripple from 'react-native-material-ripple';
import CctvMarkerIcon from '../../assets/cam_marker.svg';
import FullMarkerIcon from '../../assets/full_marker.svg';
import OtherMarkerIcon from '../../assets/other_marker.svg';
import CCMarkerIcon from '../../assets/cc_marker.svg';
import ChpMarkerIcon from '../../assets/chp_marker.svg';
import EndMarkerIcon from '../../assets/end_marker.svg';
import SettingsIcon from '../../assets/settings_icon.svg'
// Dark
import XIconDark from '../../assets/x_dark_icon.svg';
import CctvIconDark from '../../assets/cctv_dark_icon.svg';
import FullLcsIconDark from '../../assets/full_closure_dark_icon.svg';
import OtherLcsIconDark from '../../assets/other_dark_icon.svg';
import TrafficIconDark from '../../assets/traffic_dark_icon.svg';
import CenterUserIconDark from '../../assets/center_user_dark_icon.svg'
import CCIconDark from '../../assets/cc_dark_icon.svg';
import ChpIconDark from '../../assets/chp_dark_icon.svg';
import CctvMarkerIconDark from '../../assets/cam_marker_dark.svg';
import FullMarkerIconDark from '../../assets/full_marker_dark.svg';
import OtherMarkerIconDark from '../../assets/other_marker_dark.svg';
import CCMarkerIconDark from '../../assets/cc_marker_dark.svg';
import ChpMarkerIconDark from '../../assets/chp_marker_dark.svg';
import EndMarkerIconDark from '../../assets/end_marker_dark.svg';
import SettingsIconDark from '../../assets/settings_icon_dark.svg'
// Location
import * as Location from 'expo-location';
import LocationPermissionsModal from '../custom-components/permissions-modal';
// Misc
import { useTheme } from './theme-context'; 
import lightMapStyle from '../../assets/lightMapStyle.json';
import darkMapStyle from '../../assets/darkMapStyle.json';
import { MARKER_COLOR, GREEN_THEME_COLOR, DARK_THEME_COLOR, LIGHT_THEME_COLOR } from '../constants/theme-colors';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INITIAL_REGION = {
  latitude: 36.59862922932531,
  longitude: -119.86163764755294,
  latitudeDelta: 10,
  longitudeDelta: 10,
}

interface MemoizedMapViewProps {
  cams: CCTV[]
  lcsFull: LCS[]
  lcsOther: LCS[]
  cc: CC[]
  chpIncs: CHP[]
}

type MarkerType = { type: 'cctv'; marker: CCTV; } | { type: 'lcsFull'; marker: LCS; }
  | { type: 'lcsOther'; marker: LCS; } | { type: 'cc'; marker: CC; }
  | { type: 'chpInc'; marker: CHP; }

// Main color for all markers/filters

// Incremented then assigned to component keys for always unique keys
var keyCtr = 0;
// Memoizing map view for performance improvement (otherwise map along with all markers re-renders every time; slows down app)
export const MemoizeMapView: React.FC<MemoizedMapViewProps> = React.memo(({ cams, cc, lcsFull, lcsOther, chpIncs }) => {

  //console.log(++renderCtr)

  //console.log(cams.length + lcsFull.length + lcsOther.length + cc.length + chpIncs.length) 

  const router = useRouter();

  const sheetRef = useRef<BottomSheetModal>(null);
  const [currMarkerType, setCurrMarkerType] = useState<MarkerType>();
  const [mTypeDisplay, setMTypeDisplay] = useState('All');
  // Percentage of screen bottom sheet takes up/snaps to
  const snapPoints = useMemo(() => ["6.5%", "40%", "90%"], []);

  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const [camPressed, setCamPressed] = useState(false);
  const [lcsFullPressed, setLcsFullPressed] = useState(false);
  const [lcsOtherPressed, setLcsOtherPressed] = useState(false);
  const [ccPressed, setCCPressed] = useState(false);
  const [chpIncPressed, setChpIncPressed] = useState(false);

  const [showTraffic, setTraffic] = useState(false);
  // const [isDarkMode, setDarkMode] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [endLocation, setEndLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [forceUpdate, setForceUpdate] = useState(0);
  const { isDarkMode, toggleTheme } = useTheme();

  const [isNavigating, setIsNavigating] = useState(false);

  StatusBar.setTranslucent(true);
  StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');


  // Resets initial region, fixes zoom on app install/initial startup
  const onMapReady = () => {
    if (mapRef.current) {
      // @ts-ignore
      mapRef.current.animateToRegion(INITIAL_REGION, 10);
      // Force re-toggle traffic layer to ensure it shows up
    }
  };

  const handleMarkerPress = (marker: MarkerType) => {
    setCurrMarkerType(marker);
    setIsOpening(true);
    sheetRef.current?.snapToIndex(1);
  }

  // Debouncing delays function execution by 100ms, helps with responsiveness
  // (e.g. if user spams filter buttons)
  const handleFilterPress = debounce((markerType: string) => {
    // Batching state updates causes re-render after all have been updated
    // Makes filter buttons more responsive
    unstable_batchedUpdates(() => {
      // Check/set pressed state for all filter buttons
      if (markerType === 'cctv') !camPressed ? setCamPressed(true) : setCamPressed(false);
      if (markerType === 'lcsFull') !lcsFullPressed ? setLcsFullPressed(true) : (setLcsFullPressed(false), setEndLocation(null));
      if (markerType === 'lcsOther') !lcsOtherPressed ? setLcsOtherPressed(true) : (setLcsOtherPressed(false), setEndLocation(null));
      if (markerType === 'cc') !ccPressed ? setCCPressed(true) : setCCPressed(false);
      if (markerType === 'chpInc') !chpIncPressed ? setChpIncPressed(true) : setChpIncPressed(false);
      // Clear all filters
      if (markerType === 'clear') {
        setCamPressed(false);
        setLcsFullPressed(false);
        setLcsOtherPressed(false);
        setCCPressed(false);
        setChpIncPressed(false);
        setEndLocation(null);
      }
      // Closes bottom sheet
      sheetRef.current?.close();
      // Set the current marker type (that was pressed for enabling/disabling filter)
      setMTypeDisplay(markerType);
    })
  }, 100)

  useEffect(() => {
    // Manage bottom sheet opening/closing (in useEffect to prevent async side-effect)
    if (isOpening) {
      setBottomSheetIsOpen(true);
      setIsOpening(false);
    }
  }, [isOpening]);

  const handleMapPress = () => {
    if (bottomSheetIsOpen) {
      sheetRef.current?.collapse();
      setBottomSheetIsOpen(false);
    }
  }

  // CCTV Markers
  const displayCamMarkers = useMemo(() => {
    return cams.flatMap((currCam: CCTV, index: number) => (
      <Marker
        key={++keyCtr + (isDarkMode ? 'dark' : 'light')}
        coordinate={{ latitude: parseFloat(currCam.cctv.location.latitude), longitude: parseFloat(currCam.cctv.location.longitude) }}
        onPress={() => { let camAsMarkerType: MarkerType = { type: 'cctv', marker: currCam }; handleMarkerPress(camAsMarkerType) }}
        pinColor={MARKER_COLOR}
        identifier="cctv"
        tracksViewChanges={false}
      >
        {isDarkMode ? <CctvMarkerIconDark /> : <CctvMarkerIcon />}
      </Marker>
   ))
  }, [cams, isDarkMode, forceUpdate]);


  // LCS (Full Closure) Markers
  const displayLcsFullMarkers = useMemo(() => {
    return lcsFull.flatMap((currFullLcsBegin: LCS, index: number) => (
      <Marker
        key={++keyCtr}
        coordinate={{ latitude: parseFloat(currFullLcsBegin.lcs.location.begin.beginLatitude), longitude: parseFloat(currFullLcsBegin.lcs.location.begin.beginLongitude) }}
        onPress={() => { let lcsAsMarkerType: MarkerType = { type: 'lcsFull', marker: currFullLcsBegin }; handleMarkerPress(lcsAsMarkerType) }}
        pinColor={MARKER_COLOR}
        tracksViewChanges={false}
      >
        {isDarkMode ? <FullMarkerIconDark /> : <FullMarkerIcon />}
      </Marker>
    ))
  }, [lcsFull, isDarkMode, forceUpdate]);

  // LCS (Other Closure) Markers
  const displayLcsOtherMarkers = useMemo(() => {
    return lcsOther.flatMap((currOtherLcs: LCS, index: number) => (
      <Marker
        key={++keyCtr}
        coordinate={{ latitude: parseFloat(currOtherLcs.lcs.location.begin.beginLatitude), longitude: parseFloat(currOtherLcs.lcs.location.begin.beginLongitude) }}
        onPress={() => { let lcsAsMarkerType: MarkerType = { type: 'lcsOther', marker: currOtherLcs }; handleMarkerPress(lcsAsMarkerType) }}
        pinColor={MARKER_COLOR}
        tracksViewChanges={false}
      >
        {isDarkMode ? <OtherMarkerIconDark /> : <OtherMarkerIcon />}
      </Marker>
    ))
  }, [lcsOther, isDarkMode, forceUpdate]);

  // CC (Chain Control) Markers
  const displayCCMarkers = useMemo(() => {
    return cc.flatMap((currCC: CC, index: number) => (
      <Marker
        key={++keyCtr}
        coordinate={{ latitude: parseFloat(currCC.cc.location.latitude), longitude: parseFloat(currCC.cc.location.longitude) }}
        onPress={() => { let ccAsMarkerType: MarkerType = { type: 'cc', marker: currCC }; handleMarkerPress(ccAsMarkerType) }}
        pinColor={MARKER_COLOR}
        tracksViewChanges={false}
      >
        {isDarkMode ? <CCMarkerIconDark /> : <CCMarkerIcon />}
      </Marker>
    ))
  }, [cc, isDarkMode, forceUpdate]);

  // CHP (CHP Incident) Markers
  const displayChpIncMarkers = useMemo(() => {
    return chpIncs.flatMap((currChpInc: CHP, index: number) => (
      <Marker
        key={++keyCtr}
        coordinate={{ latitude: parseFloat(currChpInc.center[0].dispatch[0].log[0].lat), longitude: parseFloat(currChpInc.center[0].dispatch[0].log[0].long) }}
        onPress={() => { let chpIncAsMarkerType: MarkerType = { type: 'chpInc', marker: currChpInc }; handleMarkerPress(chpIncAsMarkerType) }}
        pinColor={MARKER_COLOR}
        tracksViewChanges={false}
      >
        {isDarkMode ? <ChpMarkerIconDark /> : <ChpMarkerIcon />}
      </Marker>
    ))
  }, [chpIncs, isDarkMode, forceUpdate]);

  // Called/re-rendered whenever a filter is pressed
  // Renders all markers that are being filtered
  const getMarkers = useCallback(() => {
    let markersArr: React.JSX.Element[] = [];
    if (camPressed) markersArr = markersArr.concat(displayCamMarkers);
    if (lcsFullPressed) markersArr = markersArr.concat(displayLcsFullMarkers);
    if (lcsOtherPressed) markersArr = markersArr.concat(displayLcsOtherMarkers);
    if (ccPressed) markersArr = markersArr.concat(displayCCMarkers);
    if (chpIncPressed) markersArr = markersArr.concat(displayChpIncMarkers);
    return markersArr;
  }, [camPressed, lcsFullPressed, lcsOtherPressed, ccPressed, chpIncPressed, isDarkMode, forceUpdate]);

  const handleCenterUserPress = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setModalVisible(true);
      return;
    }

    // Default to faster location request
    let currentLocation = await Location.getLastKnownPositionAsync({});
    // If results in null value, fall back to slower, more reliable (non-null) location request
    if (!currentLocation) {
      console.log('getting more time consuming location')
      currentLocation = await Location.getCurrentPositionAsync({})
    }

    const { latitude, longitude } = currentLocation.coords;

    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }

    if (mapRef.current)
      //@ts-ignore
      mapRef.current.animateToRegion(region, 1000);
    else
      alert('Something went wrong...')
  }

  const handleSettingsPress = () => {
    // Prevent duplicate settings from opening after spam press
    if(!isNavigating){
      setIsNavigating(true);
      router.push('/settings');
      setTimeout(() => setIsNavigating(false), 1000); 
    }
  }

  const [shouldReRender, setShouldReRender] = useState(false);
  const handleTraffic = () => {
    setTraffic(!showTraffic)
    // Only re-render if app has never been opened before
    if (shouldReRender) {
      setForceUpdate(prev => prev + 1);
    }
  }

  // Checks if app has been opened before, if not, re-render map
  // to re-render traffic layer for functional traffic button.
  // After re-rendering, always toggles traffic layer normally
  // (after second app load and on).
  useEffect(() => {
    const checkAppOpens = async () => {
      try {
        const opens = await AsyncStorage.getItem('appOpens');
        if (!opens && !shouldReRender) {
          setShouldReRender(true);
        }
        else {
          setShouldReRender(false);
        }

      } catch (e) {
        console.error('Failed to load app open count from storage', e);
      }
    };

    checkAppOpens();
  }, [forceUpdate]);

  return (
    <>
      <View style={styles.map}>
        <MapView
          key={forceUpdate}
          ref={mapRef}
          onMapReady={onMapReady}
          style={styles.map}
          customMapStyle={isDarkMode ? darkMapStyle : lightMapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_REGION}
          radius={100}
          minPoints={4}
          extent={512}
          maxZoom={12}
          moveOnMarkerPress={false}
          showsTraffic={showTraffic}
          onTouchStart={() => { handleMapPress() }}
          clusterColor={MARKER_COLOR}
          showsCompass={false}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >

          {getMarkers()}
          {endLocation && (
            <Marker
              coordinate={endLocation}
              tracksViewChanges={false}
              onPress={() => { }}
            >
              {isDarkMode ? <EndMarkerIconDark /> : <EndMarkerIcon />}
            </Marker>
          )}

        </MapView>

        <LocationPermissionsModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />

        <View style={styles.buttonContainer}>
          <ScrollView
            horizontal
            style={styles.filterContainer}
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            >
            <Ripple
              onPress={() => { handleFilterPress('clear') }}
              style={[styles.filterButtonBase, isDarkMode ? [styles.filterButtonXDark, styles.filterButtonBaseDark] : [styles.filterButtonX, styles.filterButtonBaseLight]]}
              rippleContainerBorderRadius={20}
              rippleColor={GREEN_THEME_COLOR}
              rippleDuration={300}
            >
              {isDarkMode ? <XIconDark height={15} width={15} style={styles.filterIcon} /> : <XIcon height={15} width={15} style={styles.filterIcon} />}
              <Text style={isDarkMode ? styles.filterTextDark : styles.filterText}>Clear</Text>
            </Ripple>

            <Ripple
              onPress={() => { handleFilterPress('cctv') }}
              style={[styles.filterButtonBase, isDarkMode ? styles.filterButtonBaseDark : styles.filterButtonBaseLight, camPressed ? styles.filterButtonIn : (isDarkMode ? styles.filterButtonOutDark : styles.filterButtonOut)]}
              rippleContainerBorderRadius={20}
              rippleColor={GREEN_THEME_COLOR}
              rippleDuration={300}
            >
              {isDarkMode ? <CctvIconDark height={15} width={15} style={styles.filterIcon} /> : <CctvIcon height={15} width={15} style={styles.filterIcon} />}
              <Text style={isDarkMode ? styles.filterTextDark : styles.filterText}>Cameras</Text>
            </Ripple>

            <Ripple
              onPress={() => { handleFilterPress('chpInc') }}
              style={[styles.filterButtonBase, isDarkMode ? styles.filterButtonBaseDark : styles.filterButtonBaseLight, chpIncPressed ? styles.filterButtonIn : (isDarkMode ? styles.filterButtonOutDark : styles.filterButtonOut)]}
              rippleContainerBorderRadius={20}
              rippleColor={GREEN_THEME_COLOR}
              rippleDuration={300}
            >
              {isDarkMode ? <ChpIconDark height={15} width={15} style={styles.filterIcon} /> : <ChpIcon height={15} width={15} style={styles.filterIcon} />}
              <Text style={isDarkMode ? styles.filterTextDark : styles.filterText}>CHP Incidents</Text>
            </Ripple>

            <Ripple
              onPress={() => { handleFilterPress('lcsFull') }}
              style={[styles.filterButtonBase, isDarkMode ? styles.filterButtonBaseDark : styles.filterButtonBaseLight, lcsFullPressed ? styles.filterButtonIn : (isDarkMode ? styles.filterButtonOutDark : styles.filterButtonOut)]}
              rippleContainerBorderRadius={20}
              rippleColor={GREEN_THEME_COLOR}
              rippleDuration={300}
            >
              {isDarkMode ? <FullLcsIconDark height={15} width={15} style={styles.filterIcon} /> : <FullLcsIcon height={15} width={15} style={styles.filterIcon} />}
              <Text style={isDarkMode ? styles.filterTextDark : styles.filterText}>Full Closures</Text>
            </Ripple>


            <Ripple
              onPress={() => { handleFilterPress('lcsOther') }}
              style={[styles.filterButtonBase, isDarkMode ? styles.filterButtonBaseDark : styles.filterButtonBaseLight, lcsOtherPressed ? styles.filterButtonIn : (isDarkMode ? styles.filterButtonOutDark : styles.filterButtonOut)]}
              rippleContainerBorderRadius={20}
              rippleColor={GREEN_THEME_COLOR}
              rippleDuration={300}
            >
              {isDarkMode ? <OtherLcsIconDark height={15} width={15} style={styles.filterIcon} /> : <OtherLcsIcon height={15} width={15} style={styles.filterIcon} />}
              <Text style={isDarkMode ? styles.filterTextDark : styles.filterText}>Other Closures</Text>
            </Ripple>


            <Ripple
              onPress={() => { handleFilterPress('cc') }}
              style={[styles.filterButtonBase, isDarkMode ? styles.filterButtonBaseDark : styles.filterButtonBaseLight, ccPressed ? styles.filterButtonIn : (isDarkMode ? styles.filterButtonOutDark : styles.filterButtonOut)]}
              rippleContainerBorderRadius={20}
              rippleColor={GREEN_THEME_COLOR}
              rippleDuration={300}
            >
              {isDarkMode ? <CCIconDark height={15} width={15} style={styles.filterIcon} /> : <CCIcon height={15} width={15} style={styles.filterIcon} />}
              <Text style={isDarkMode ? styles.filterTextDark : styles.filterText}>Chain Control</Text>
            </Ripple>

          </ScrollView>

          <View style={styles.miscButtonContainer}>
            {/* Top row misc buttons */}
            <View style={styles.miscButtonsRow}>
              <Ripple
                onPress={handleTraffic}
                style={[styles.miscButton, styles.filterButtonBase, isDarkMode ? styles.filterButtonBaseDark : styles.filterButtonBaseLight, showTraffic ? styles.filterButtonIn : (isDarkMode ? styles.filterButtonOutDark : styles.filterButtonOut)]}
                rippleContainerBorderRadius={20}
                rippleColor={GREEN_THEME_COLOR}
                rippleDuration={300}
              >
                {isDarkMode ? <TrafficIconDark /> : <TrafficIcon />}
              </Ripple>
              <Ripple
                onPress={() => { handleCenterUserPress() }}
                style={[styles.miscButton, styles.filterButtonBase, isDarkMode ? styles.filterButtonBaseDark : styles.filterButtonBaseLight, (isDarkMode ? styles.filterButtonOutDark : styles.filterButtonOut)]}
                rippleContainerBorderRadius={20}
                rippleColor={GREEN_THEME_COLOR}
                rippleDuration={300}
              >
                {isDarkMode ? <CenterUserIconDark /> : <CenterUserIcon />}
              </Ripple>
            </View>

          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <Ripple
            style={[styles.miscButton, styles.filterButtonBase, isDarkMode ? styles.filterButtonBaseDark : styles.filterButtonBaseLight, (isDarkMode ? styles.filterButtonOutDark : styles.filterButtonOut)]}
            rippleColor={GREEN_THEME_COLOR}
            rippleContainerBorderRadius={20}
            onPress={() => {handleSettingsPress()}}
            rippleDuration={300}
          >
            {isDarkMode ? <SettingsIconDark /> : <SettingsIcon />}
          </Ripple>
        </View>

        <BottomSheetModal
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          // Initiate bottom sheet in closed state
          index={-1}
          onClose={() => setBottomSheetIsOpen(false)}
          backgroundStyle={isDarkMode ? { backgroundColor: DARK_THEME_COLOR } : { backgroundColor: LIGHT_THEME_COLOR }}
          handleIndicatorStyle={isDarkMode ? { backgroundColor: 'white' } : { backgroundColor: 'black' }}
          style={isDarkMode ? { borderWidth: 1, borderColor: 'black', borderRadius: 17 } : {}}
        >
          {currMarkerType?.type === 'cctv' ? <CctvDetail id={currMarkerType?.marker.id} cctv={currMarkerType?.marker.cctv} />
            : currMarkerType?.type === 'lcsFull' ? <LcsDetail id={currMarkerType?.marker.id} lcs={currMarkerType?.marker.lcs} mapRef={mapRef} setEndLocation={setEndLocation} endLocation={endLocation} />
              : currMarkerType?.type === 'lcsOther' ? <LcsDetail id={currMarkerType?.marker.id} lcs={currMarkerType?.marker.lcs} mapRef={mapRef} setEndLocation={setEndLocation} endLocation={endLocation} />
                : currMarkerType?.type === 'cc' ? <CcDetail id={currMarkerType?.marker.id} cc={currMarkerType?.marker.cc} />
                  : currMarkerType?.type === 'chpInc' ? <ChpDetail log={currMarkerType?.marker.center[0].dispatch[0].log} />
                    : <Text>No Data Available</Text>
          }

        </BottomSheetModal>
      </View>


    </>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1 },
  bottomButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: 'absolute',
    marginVertical: 35,
    paddingTop: 10,
    paddingLeft: 0,
  },
  miscButtonContainer: {
    //    marginTop: 20,
  },
  miscButton: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miscButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButtonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  filterButtonBaseDark: {
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
  },
  filterButtonBaseLight: {
    marginBottom: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 5,
  },
  filterButtonX: {
    backgroundColor: 'white',
  },
  filterButtonXDark: {
    backgroundColor: DARK_THEME_COLOR,
  },
  filterButtonIn: {
    backgroundColor: MARKER_COLOR,
  },
  filterButtonOut: {
    backgroundColor: 'white',
  },
  filterButtonOutDark: {
    backgroundColor: DARK_THEME_COLOR,
  },
  filterIcon: {
    marginRight: 10,
    width: '20%',
    height: '80%',
  },
  filterText: {
    fontSize: 15,
  },
  filterTextDark: {
    fontSize: 15,
    color: 'white',
  }
});