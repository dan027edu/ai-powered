import { Stack } from 'expo-router';

export default function FacultyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#E2E2E2' },
        animation: 'none',
        presentation: 'transparentModal',
      }}
    />
  );
}