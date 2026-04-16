import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import CreateTicketScreen from './src/screens/CreateTicketScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <StatusBar style="auto" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
{user ? (
  <>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
  </>
) : (
  <Stack.Screen name="Login" component={LoginScreen} />
)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
