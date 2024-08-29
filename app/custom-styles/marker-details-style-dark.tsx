import { StyleSheet } from "react-native";
import MarkerDetailsStyleBase from "./marker-details-style-base";
import { DARK_THEME_COLOR } from '../constants/theme-colors';

export default StyleSheet.create({
  detailsContainer: {
    ...MarkerDetailsStyleBase.detailsContainer,
    backgroundColor: DARK_THEME_COLOR,
    borderWidth: 1,
    borderColor: 'black',
  },
  detailsTitle: {
    ...MarkerDetailsStyleBase.title,
    color: 'white',
  },
  detailsText: {
    ...MarkerDetailsStyleBase.detailsText,
    color: 'white',
  },
  titleContainer: {
    ...MarkerDetailsStyleBase.titleContainer,
  },
  title: {
    ...MarkerDetailsStyleBase.title,
    color: 'white',
  },
  cctvText: {
    ...MarkerDetailsStyleBase.cctvText,
    color: 'white',
  },
  divider: {
    ...MarkerDetailsStyleBase.divider,
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});