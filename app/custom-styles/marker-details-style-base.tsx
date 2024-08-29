import { StyleSheet } from "react-native";

const MarkerDetailsStyleBase = StyleSheet.create({
  detailsContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 16,
    marginBottom: 16,
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
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  titleContainer: {
    marginBottom: 10,
    marginLeft: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cctvText: {
    marginTop: 5,
  },
  divider: {
    borderRadius: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default MarkerDetailsStyleBase;