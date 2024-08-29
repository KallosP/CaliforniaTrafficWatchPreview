import MapView from "react-native-map-clustering";
// Specifying the layout of the cctv data for type checking
export type CCTV = {
  id: number;
  cctv: {
    index: string;
    recordTimestamp: {
      recordDate: string;
      recordTime: string;
      recordEpoch: string;
    };
    location: {
      district: string;
      locationName: string;
      nearbyPlace: string;
      longitude: string;
      latitude: string;
      elevation: string;
      direction: string;
      county: string;
      route: string;
      routeSuffix: string;
      postmilePrefix: string;
      postmile: string;
      alignment: string;
      milepost: string;
    };
    inService: string;
    imageData: {
      imageDescription: string;
      streamingVideoURL: string;
      static: {
        currentImageUpdateFrequency: string;
        currentImageURL: string;
        referenceImageUpdateFrequency: string;
        referenceImage1UpdateAgoURL: string;
        referenceImage2UpdatesAgoURL: string;
        referenceImage3UpdatesAgoURL: string;
        referenceImage4UpdatesAgoURL: string;
        referenceImage5UpdatesAgoURL: string;
        referenceImage6UpdatesAgoURL: string;
        referenceImage7UpdatesAgoURL: string;
        referenceImage8UpdatesAgoURL: string;
        referenceImage9UpdatesAgoURL: string;
        referenceImage10UpdatesAgoURL: string;
        referenceImage11UpdatesAgoURL: string;
        referenceImage12UpdatesAgoURL: string;
      };
    };
  }
}

export type LCS = {
  id: number;
  lcs: {
    index: string;
    recordTimestamp: {
      recordDate: string;
      recordTime: string;
      recordEpoch: string;
    };
    location: {
      travelFlowDirection: string;
      begin: {
        beginDistrict: string;
        beginLocationName: string;
        beginFreeFormDescription: string;
        beginNearbyPlace: string;
        beginLongitude: string;
        beginLatitude: string;
        beginElevation: string;
        beginDirection: string;
        beginCounty: string;
        beginRoute: string;
        beginRouteSuffix: string;
        beginPostmilePrefix: string;
        beginPostmile: string;
        beginAlignment: string;
        beginMilepost: string;
      };
      end: {
        endDistrict: string;
        endLocationName: string;
        endFreeFormDescription: string;
        endNearbyPlace: string;
        endLongitude: string;
        endLatitude: string;
        endElevation: string;
        endDirection: string;
        endCounty: string;
        endRoute: string;
        endRouteSuffix: string;
        endPostmilePrefix: string;
        endPostmile: string;
        endAlignment: string;
        endMilepost: string;
      };
    };
    closure: {
      closureID: string;
      logNumber: string;
      closureTimestamp: {
        closureRequestDate: string;
        closureRequestTime: string;
        closureRequestEpoch: string;
        closureStartDate: string;
        closureStartTime: string;
        closureStartEpoch: string;
        closureEndDate: string;
        closureEndTime: string;
        closureEndEpoch: string;
        isClosureEndIndefinite: string;
      };
      facility: string;
      typeOfClosure: string;
      typeOfWork: string;
      durationOfClosure: string;
      estimatedDelay: string;
      lanesClosed: string;
      totalExistingLanes: string;
      isCHINReportable: string;
      code1097: {
        isCode1097: string;
        code1097Timestamp: {
          code1097Date: string;
          code1097Time: string;
          code1097Epoch: string;
        };
      };
      code1098: {
        isCode1098: string;
        code1098Timestamp: {
          code1098Date: string;
          code1098Time: string;
          code1098Epoch: string;
        };
      };
      code1022: {
        isCode1022: string;
        code1022Timestamp: {
          code1022Date: string;
          code1022Time: string;
          code1022Epoch: string;
        };
      };
    };
  };
  mapRef: React.RefObject<MapView>; // Define mapRef type
  setEndLocation: (location: { latitude: number; longitude: number }) => void; // Define setEndLocation type
  endLocation: { latitude: number; longitude: number } | null;
};

export type CC = {
  id: number;
  cc: {
      index: string;
      recordTimestamp: {
          recordDate: string;
          recordTime: string;
      };
      location: {
          district: string;
          locationName: string;
          nearbyPlace: string;
          longitude: string;
          latitude: string;
          elevation: string;
          direction: string;
          county: string;
          route: string;
          routeSuffix: string;
          postmilePrefix: string;
          postmile: string;
          alignment: string;
          milepost: string;
      };
      inService: string;
      statusData: {
          statusTimestamp: {
              statusDate: string;
              statusTime: string;
          };
          status: string;
          statusDescription: string;
      };
  };
}

export type CHP = {
    center: {
      id: string;
      dispatch: {
        id: string;
        log: {
          id: string;
          logTime: string;
          logType: string;
          location: string;
          locationDesc: string;
          area: string;
          thomasBrothers: string;
          lat: string;
          long: string;
          logDetails: {
            details: {
              detailTime: string;
              incidentDetail: string;
            }[];
            units: {
              unitTime: string;
              unitDetail: string;
            }[];
          }[];
        }[];
      }[];
    }[];
};

export type CHPLog = {
  log: {
          id: string;
          logTime: string;
          logType: string;
          location: string;
          locationDesc: string;
          area: string;
          thomasBrothers: string;
          lat: string;
          long: string;
          logDetails: {
            details: {
              detailTime: string;
              incidentDetail: string;
            }[];
            units: {
              unitTime: string;
              unitDetail: string;
            }[];
          }[];
  }[];
}