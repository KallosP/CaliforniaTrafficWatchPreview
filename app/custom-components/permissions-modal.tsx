import React from 'react';
import { Modal, View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../custom-components/theme-context';
import PermissionsModalStyle from '../custom-styles/permissions-modal-style';

interface LocationPermissionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ isVisible, onClose }) => {
  const { isDarkMode } = useTheme();

  const themeStyle = isDarkMode ? PermissionsModalStyle.darkModal : PermissionsModalStyle.lightModal;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={themeStyle.modalBackground}>
        <View style={themeStyle.modalContainer}>
          <Text style={themeStyle.title}>Location Permission</Text>
          <Text style={themeStyle.message}>Permission to access location was denied. Please enable it in your device settings.</Text>
          <View style={themeStyle.buttonContainer}>
            <TouchableOpacity style={themeStyle.button} onPress={onClose}>
              <Text style={themeStyle.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={themeStyle.button} onPress={() => {
              onClose();
              Linking.openSettings();
            }}>
              <Text style={themeStyle.buttonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocationPermissionModal;