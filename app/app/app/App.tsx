import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { TicketsScreen } from './src/screens/TicketsScreen';
import { SupportDashboardScreen } from './src/screens/SupportDashboardScreen';

const RootNavigator = () => {
  const { isLoading, isSignout, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isSignout) {
    return <LoginScreen />;
  }

  // Show Support Dashboard if user is support staff
  if (user?.isSupport) {
    return <SupportDashboardScreen />;
  }

  // Show regular Tickets screen for regular users
  return <TicketsScreen />;
};

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
