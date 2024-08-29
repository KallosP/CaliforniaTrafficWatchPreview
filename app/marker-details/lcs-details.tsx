import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LCS } from "../custom-types/url-types";
import React, { useEffect } from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MarkerDetailStyleBase from "../custom-styles/marker-details-style-base";
import MarkerDetailsStyleDark from "../custom-styles/marker-details-style-dark";
import { useTheme } from '../custom-components/theme-context'; 
import { GREEN_THEME_COLOR } from "../constants/theme-colors";

export default function LcsDetail({ lcs, mapRef, setEndLocation, endLocation }: LCS) {
  const { isDarkMode } = useTheme();
  const themeStyle = isDarkMode ? MarkerDetailsStyleDark : MarkerDetailStyleBase;

  const [showMarkerText, setShowMarkerText] = React.useState('Show End Location');

  const renderDetailText = (label: string, value: string) => (
    <Text style={themeStyle.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  const handleShowEndLocation = () => {
    if (showMarkerText === 'Show End Location') {
      setShowMarkerText('Hide End Location');
      const endLocation = {
        latitude: parseFloat(lcs.location.end.endLatitude),
        longitude: parseFloat(lcs.location.end.endLongitude),
      };
      setEndLocation(endLocation);
      const beginLocation = {
        latitude: parseFloat(lcs.location.begin.beginLatitude),
        longitude: parseFloat(lcs.location.begin.beginLongitude),
      }

      if(mapRef.current){
        // @ts-ignore
        mapRef.current.fitToCoordinates([beginLocation, endLocation], {
          edgePadding: { top: 150, right: 50, bottom: 350, left: 50 },
          animated: true,
        });
      }
    }
    else{
      setShowMarkerText('Show End Location');
      // @ts-ignore
      setEndLocation(null);
    }
  };

  // Manages disabling button; is disabled when begin and end lat/lngs are the same
  function showLocation() {
    if(lcs.location.end.endLatitude === lcs.location.begin.beginLatitude && lcs.location.end.endLongitude === lcs.location.begin.beginLongitude){
      return false;
    }
    return true;
  }

  // Reset the button text to default when endLocation is changed to null
  useEffect(() => {
    if(!endLocation) setShowMarkerText('Show End Location');
  }, [endLocation]);

  return (
    <>
      <View style={themeStyle.titleContainer}>
        <Text style={themeStyle.title}>Lane Closure</Text>
      </View>

      <View style={themeStyle.divider} />

      <BottomSheetScrollView> 

        {showLocation() ? 
        (
          <TouchableOpacity
            style={styles.showEndLocation}
            onPress={handleShowEndLocation}
          >
            <Text style={styles.showEndLocationText}>{showMarkerText}</Text>
          </TouchableOpacity>
         ) : 
         (
            <TouchableOpacity
              style={[styles.showEndLocation, styles.showEndLocationDisabled]}
              disabled
            >
              <Text style={styles.showEndLocationText}>No End Location. See Details.</Text>
            </TouchableOpacity>
         )}

        <View style={themeStyle.detailsContainer}>
          <Text style={themeStyle.detailsTitle}>Details</Text>
          {renderDetailText("Type Of Closure", lcs.closure.typeOfClosure)}
          {renderDetailText("Facility", lcs.closure.facility)}
          {renderDetailText("Duration Of Closure", lcs.closure.durationOfClosure)}
          {renderDetailText("Estimated Delay", lcs.closure.estimatedDelay)}
          {renderDetailText("Lanes Closed", lcs.closure.lanesClosed)}
          {renderDetailText("Total Existing Lanes", lcs.closure.totalExistingLanes)}
          {renderDetailText("Travel Flow Direction", lcs.location.travelFlowDirection)}
          {renderDetailText("Begin Location Name", lcs.location.begin.beginLocationName)}
          {renderDetailText("Begin Direction", lcs.location.begin.beginDirection)}
          {renderDetailText("Begin County", lcs.location.begin.beginCounty)}
          {renderDetailText("Begin Route", lcs.location.begin.beginRoute)}
          {renderDetailText("End Location Name", lcs.location.end.endLocationName)}
          {renderDetailText("End Direction", lcs.location.end.endDirection)}
          {renderDetailText("End County", lcs.location.end.endCounty)}
          {renderDetailText("End Route", lcs.location.end.endRoute)}
        </View>
      </BottomSheetScrollView>
    </> 
  );
}

const styles = StyleSheet.create({
  showEndLocation: {
    padding: 10,
    backgroundColor: GREEN_THEME_COLOR,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  showEndLocationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  showEndLocationDisabled: {
    backgroundColor: 'rgba(80, 255, 179, 0.6)',
    shadowOpacity: 0.0,
    elevation: 0,
  }
})