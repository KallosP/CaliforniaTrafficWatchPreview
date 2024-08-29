import { Text, View, } from "react-native";
import { CHPLog } from "../custom-types/url-types";
import React from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MarkerDetailStyleBase from "../custom-styles/marker-details-style-base";
import MarkerDetailsStyleDark from "../custom-styles/marker-details-style-dark";
import { useTheme } from '../custom-components/theme-context'; 

export default function ChpDetail({ log }: CHPLog) {
  const { isDarkMode } = useTheme();
  const themeStyle = isDarkMode ? MarkerDetailsStyleDark : MarkerDetailStyleBase;

  const renderDetailText = (label: string, value: string) => (
    <Text style={themeStyle.detailsText}>
      {label}: {value ? value : <Text style={{ fontStyle: 'italic' }}>Not Available</Text>}
    </Text>
  );

  return (
    <>
      <View style={themeStyle.titleContainer}>
        <Text style={themeStyle.title}>CHP Incident</Text>
      </View>

      <View style={themeStyle.divider} />

      <BottomSheetScrollView> 
        <View style={themeStyle.detailsContainer}>
          <Text style={themeStyle.detailsTitle}>Details</Text>
                {renderDetailText("Log ID", log[0].id)}
                {renderDetailText("Log Time", log[0].logTime)}
                {renderDetailText("Log Type", log[0].logType)}
                {renderDetailText("Location", log[0].location)}
                {renderDetailText("Location Desc", log[0].locationDesc)}
                {renderDetailText("Area", log[0].area)}
                {log[0].logDetails[0].details.map((detail, index) => (
                  <View key={index}>
                    {renderDetailText("Detail Time", detail.detailTime)}
                    {renderDetailText("Incident Detail", detail.incidentDetail)}
                  </View>
                ))}

                {log[0].logDetails[0].units.map((unit, index) => (
                  <View key={index}>
                    {renderDetailText("Unit Time", unit.unitTime)}
                    {renderDetailText("Unit Detail", unit.unitDetail)}
                  </View>
                ))}
        </View>
      </BottomSheetScrollView>
    </> 
  );
}