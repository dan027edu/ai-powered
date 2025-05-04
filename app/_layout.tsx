import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after assets are loaded
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#E2E2E2' },
        animation: 'none',
        animationTypeForReplace: 'pop',
        presentation: 'transparentModal',
        gestureEnabled: false
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="(faculty)" 
        options={{ 
          headerShown: false,
          animation: 'none'
        }} 
      />
      <Stack.Screen 
        name="(registrar)" 
        options={{ 
          headerShown: false,
          animation: 'none'
        }} 
      />
      <Stack.Screen 
        name="screen" // This delegates routes starting with /screen/ to app/screen/_layout.tsx
        options={{
          animation: 'none',
          presentation: 'transparentModal',
        }}
      />
    </Stack>
  );
}