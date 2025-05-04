import { Stack } from 'expo-router';
import { useNavigationContainerRef } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

const { Navigator } = Stack;

export const unstable_settings = {
  initialRouteName: 'index',
  screens: {
    'in': 'in',
    'log': 'log',
    'role': 'role',
    'signup': 'signup',
    'forgotpass': 'forgotpass',
    'newpass': 'newpass',
    'securitypin': 'securitypin',
    'profile': 'profile',
    'notification': 'notification',
    '(registrar)': '(registrar)/*',
    '(faculty)': '(faculty)/*'
  }
};

export default function ScreenLayout() {
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
      <Stack.Screen name="in" />
      <Stack.Screen name="log" />
      <Stack.Screen name="role" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgotpass" />
      <Stack.Screen name="newpass" />
      <Stack.Screen name="securitypin" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="notification" />
      <Stack.Screen 
        name="documentviewer/[id]"
        options={{
          animation: 'slide-from-right',
          presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'horizontal'
        }}
      />
      <Stack.Screen 
        name="(registrar)"
        options={{
          animation: 'none',
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="(faculty)" 
        options={{
          animation: 'none',
          presentation: 'transparentModal',
        }}
      />
    </Stack>
  );
}