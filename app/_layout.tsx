import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, } from './custom-components/theme-context';

export default function Layout() {
    return (
    <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="marker-details/cctv-details"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="marker-details/lcs-details"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="custom-styles/marker-details-style-base"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="custom-styles/marker-details-style-dark"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="custom-styles/global-safe-view"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="marker-details/cc-details"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="settings/index"
                    options={{
                        title: 'Settings',
                    }}
                />
            </Stack>
        </GestureHandlerRootView>
    </ThemeProvider>
    );
}