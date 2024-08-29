import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Animated } from 'react-native';
import { GREEN_THEME_COLOR, LIGHT_THEME_COLOR, RED_THEME_COLOR, DARK_THEME_COLOR } from '../constants/theme-colors';
import { useTheme } from '../custom-components/theme-context';
import SunIcon from '../../assets/sun_icon.svg';
import SunIconDark from '../../assets/sun_dark_icon.svg';
import MoonIcon from '../../assets/moon_icon.svg';
import MoonIconDark from '../../assets/moon_dark_icon.svg';
import PhoneIcon from '../../assets/phone_icon.svg';
import PhoneIconDark from '../../assets/phone_dark_icon.svg';
import GlobeIcon from '../../assets/globe_icon.svg';
import GlobeIconDark from '../../assets/globe_dark_icon.svg';
import HighwayIcon from '../../assets/highway_icon.svg';
import HighwayIconDark from '../../assets/highway_dark_icon.svg';
import MailIcon from '../../assets/mail_icon.svg';
import MailIconDark from '../../assets/mail_dark_icon.svg';
import HeartIcon from '../../assets/heart_icon.svg';
import ShieldIcon from '../../assets/shield_check_icon.svg'
import ShieldIconDark from '../../assets/shield_check_dark_icon.svg'
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import SupportModal from '../custom-components/support-modal';


const Settings = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const animatedScaleLight = useRef(new Animated.Value(1)).current;
    const animatedScaleDark = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [showSupportModal, setShowSupportModal] = React.useState(false);


    useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: isDarkMode ? '#333333' : LIGHT_THEME_COLOR,
            },
            headerTitleStyle: {
                color: isDarkMode ? 'white' : 'black',
            },
            headerTintColor: isDarkMode ? 'white' : 'black',
        });
    }, [isDarkMode]);

    // Set theme to light or dark
    const handleThemeChange = debounce((theme: 'light' | 'dark') => {
        toggleTheme(theme === 'dark');
    }, 25);

    // Animate on selection change
    useEffect(() => {
        // Radio dark animation
        Animated.spring(animatedScaleDark, {
            // Only carry on with animation if not using match device theme
            toValue: (isDarkMode) ? 1.2 : 1,
            stiffness: 1000,
            damping: 200,
            mass: 0.11,
            useNativeDriver: true,
        }).start(() => {
            Animated.spring(animatedScaleDark, {
                toValue: 1,
                stiffness: 1000,
                damping: 200,
                mass: 0.6,
                useNativeDriver: true,
            }).start();
        });

        // Radio light animation
        Animated.spring(animatedScaleLight, {
            // Only carry on with animation if not using match device theme
            toValue: (!isDarkMode) ? 1.2 : 1,
            stiffness: 1000,
            damping: 200,
            mass: 0.11,
            useNativeDriver: true,
        }).start(() => {
            Animated.spring(animatedScaleLight, {
                toValue: 1,
                stiffness: 1000,
                damping: 200,
                mass: 0.6,
                useNativeDriver: true,
            }).start();
        });

    }, [isDarkMode]);


    const handleContactCopy = async () => {
        setShowContactInfo(false);
        await Clipboard.setStringAsync('california.traffic.watch@gmail.com').then(() => {
            Toast.show('Copied to clipboard', {
                duration: Toast.durations.SHORT,
            })
        });
    };

    return (
        <RootSiblingParent>
            <ScrollView overScrollMode='never' style={[styles.container, isDarkMode ? styles.darkContainer : {}]}>
                <View style={styles.section}>
                    {/* Preferences */}
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.sectionTitleDark : {}]}>Preferences</Text>
                    {/* Dark */}
                    <TouchableOpacity
                        style={[styles.option, isDarkMode ? styles.optionDark : {}]}
                        onPress={() => handleThemeChange('dark')}
                        disabled={isDarkMode}
                    >
                        {isDarkMode ? <MoonIconDark height={30} width={30} style={styles.icon} /> : <MoonIcon height={30} width={30} style={styles.icon} />}
                        <Text style={[styles.optionText, isDarkMode ? styles.optionTextDark : {}]}>Dark</Text>
                        <Animated.View
                            style={[
                                styles.radio,
                                {
                                    // Ensure match device theme doesn't affect dark mode
                                    borderColor: (isDarkMode) ? GREEN_THEME_COLOR : 'grey',
                                    transform: [{ scale: animatedScaleDark }],
                                },
                            ]}
                        >
                            {(isDarkMode) && <View style={styles.radioSelected} />}
                        </Animated.View>
                    </TouchableOpacity>
                    {/* Light */}
                    <TouchableOpacity
                        style={[styles.option, isDarkMode ? styles.optionDark : {}]}
                        onPress={() => handleThemeChange('light')}
                        disabled={!isDarkMode}
                    >
                        {isDarkMode ? <SunIconDark height={30} width={30} style={styles.icon} /> : <SunIcon height={30} width={30} style={styles.icon} />}
                        <Text style={[styles.optionText, isDarkMode ? styles.optionTextDark : {}]}>Light</Text>
                        <Animated.View
                            style={[
                                styles.radio,
                                {
                                    // Ensure match device theme doesn't affect dark mode
                                    borderColor: (!isDarkMode) ? GREEN_THEME_COLOR : 'grey',
                                    transform: [{ scale: animatedScaleLight }],
                                },
                            ]}
                        >
                            {(!isDarkMode) && <View style={styles.radioSelected} />}
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    {/* Resources */}
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.sectionTitleDark : {}]}>Resources</Text>
                    {/* Caltrans Highway Conditions */}
                    <TouchableOpacity
                        style={[styles.option, isDarkMode ? styles.optionDark : {}]}
                        onPress={() => WebBrowser.openBrowserAsync('https://roads.dot.ca.gov/')}
                    >
                        {isDarkMode ? <HighwayIconDark height={30} width={30} style={styles.icon} /> : <HighwayIcon height={30} width={30} style={styles.icon} />}
                        <Text style={[styles.optionText, isDarkMode ? styles.optionTextDark : {}]}>Caltrans Highway Conditions</Text>
                    </TouchableOpacity>
                    {/* Caltrans Website */}
                    <TouchableOpacity
                        style={[styles.option, isDarkMode ? styles.optionDark : {}]}
                        onPress={() => WebBrowser.openBrowserAsync('https://dot.ca.gov/')}
                    >
                        {isDarkMode ? <GlobeIconDark height={30} width={30} style={styles.icon} /> : <GlobeIcon height={30} width={30} style={styles.icon} />}
                        <Text style={[styles.optionText, isDarkMode ? styles.optionTextDark : {}]}>Caltrans Website</Text>
                    </TouchableOpacity>
                    {/* CHP Website */}
                    <TouchableOpacity
                        style={[styles.option, isDarkMode ? styles.optionDark : {}]}
                        onPress={() => WebBrowser.openBrowserAsync('https://chp.ca.gov/')}
                    >
                        {isDarkMode ? <GlobeIconDark height={30} width={30} style={styles.icon} /> : <GlobeIcon height={30} width={30} style={styles.icon} />}
                        <Text style={[styles.optionText, isDarkMode ? styles.optionTextDark : {}]}>CHP Website</Text>
                    </TouchableOpacity>

                </View>
                <View style={styles.section}>
                    {/* About */}
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.sectionTitleDark : {}]}>About</Text>

                    {/* Contact */}
                    {showContactInfo ?
                        /* Copy contact info */
                        <View
                            style={[styles.option, styles.copyContact, isDarkMode ? styles.optionDark : {}]}
                        >
                            <Text style={[styles.optionText, styles.copyText, isDarkMode ? styles.optionTextDark : {}]}>california.traffic.watch@gmail.com</Text>
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={handleContactCopy}
                            >
                                <Text style={[styles.copyButtonText, isDarkMode ? styles.copyButtonTextDark : {}]}>Copy</Text>
                            </TouchableOpacity>
                        </View> :
                        /* Show contact info */
                        <TouchableOpacity
                            style={[styles.option, isDarkMode ? styles.optionDark : {}]}
                            onPress={() => setShowContactInfo(true)}
                        >
                            {isDarkMode ? <MailIconDark height={30} width={30} style={styles.icon} /> : <MailIcon height={30} width={30} style={styles.icon} />}
                            <Text style={[styles.optionText, isDarkMode ? styles.optionTextDark : {}]}>Contact Support</Text>
                        </TouchableOpacity>}

                    <TouchableOpacity
                        style={[styles.option, isDarkMode ? styles.optionDark : {}]}
                        onPress={() => WebBrowser.openBrowserAsync('https://www.privacypolicies.com/live/a29adbeb-f7f2-427d-bc62-2eeceaa087ce')}
                    >
                        {isDarkMode ? <ShieldIconDark height={30} width={30} style={styles.icon} /> : <ShieldIcon height={30} width={30} style={styles.icon} />}
                        <Text style={[styles.optionText, isDarkMode ? styles.optionTextDark : {}]}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <SupportModal isVisible={showSupportModal} onClose={() => setShowSupportModal(false)} />
        </RootSiblingParent>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
    },
    darkContainer: {
        backgroundColor: DARK_THEME_COLOR,
    },
    section: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    sectionTitleDark: {
        color: 'white',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ebe8e8',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        height: 60,
    },
    optionDark: {
        backgroundColor: '#444444',
    },
    icon: {
    },
    optionText: {
        fontSize: 17,
        marginLeft: 10,
        flex: 1,
    },
    optionTextDark: {
        color: 'white',
    },
    switch: {
    },
    radio: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioSelected: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: GREEN_THEME_COLOR,
    },
    copyText: {
        fontSize: 16,
        marginLeft: 0,
    },
    copyContact: {
        paddingVertical: 0,
    },
    copyButton: {
        backgroundColor: GREEN_THEME_COLOR,
        borderRadius: 5,
        padding: 8,
        paddingHorizontal: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    copyButtonText: {
        textAlign: 'center',
    },
    copyButtonTextDark: {
        color: 'white',
    },

});

export default Settings;
