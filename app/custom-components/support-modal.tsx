import React from 'react';
import { Modal, View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../custom-components/theme-context';
import PermissionsModalStyle from '../custom-styles/support-modal-style';
import { Platform } from 'react-native';

interface SupportModal{
  isVisible: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModal> = ({ isVisible, onClose }) => {
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
          <Text style={themeStyle.title}>Buy me a coffee!</Text>
          {Platform.OS === 'android' ? 
            <>
                {/* TODO: change to this text when pro version is available
                    Thank you for your support! The best way to help the developer is by switching to the pro version. This helps
                    fund development of the app and removes ads. It's just a small one-time fee (no subscription). Would
                    you like to take a look on the Google Play Store? 
                 */}
                <Text style={themeStyle.message}>
                    The best way to help the developer is by switching to the pro version once it becomes 
                    available on the Google Play Store. In the meantime, you can help by simply using the app. 
                    Thank you for your support!
                </Text>
                <View style={themeStyle.buttonContainer}>
                    <TouchableOpacity style={themeStyle.button} onPress={onClose}>
                        <Text style={themeStyle.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    {/* TODO: Add link to google play store */}
                    <TouchableOpacity style={themeStyle.button} onPress={onClose/*() => Linking.openURL('https://link-to-app-on-google-play')*/}>
                        <Text style={themeStyle.buttonText}>Ok</Text>
                    </TouchableOpacity>
                </View>
            </> :
            <>

                {/* TODO: change to this text when pro version is available
                    Thank you for your support! The best way to help the developer is by switching to the pro version. This helps
                    fund development of the app and removes ads. It's just a small one-time fee (no subscription). Would
                    you like to take a look on the App Store? 
                 */}
                <Text style={themeStyle.message}>
                    The best way to help the developer is by switching to the pro version once it becomes 
                    available on the App Store. In the meantime, you can help by simply using the app. 
                    Thank you for your support!
                </Text>
                <View style={themeStyle.buttonContainer}>
                    <TouchableOpacity style={themeStyle.button} onPress={onClose}>
                        <Text style={themeStyle.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    {/* TODO: Add link to app store */}
                    <TouchableOpacity style={themeStyle.button} onPress={onClose/*() => Linking.openURL('https://link-to-app-on-app-store')*/}>
                        <Text style={themeStyle.buttonText}>Ok</Text>
                    </TouchableOpacity>
                </View>
            </>
            }
        </View>
      </View>
    </Modal>
  );
};

export default SupportModal;