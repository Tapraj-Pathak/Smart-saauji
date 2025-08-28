import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      setAuthed(!!token);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!authed ? (
          <Stack.Screen name="Login">
            {() => <Login onAuthed={() => setAuthed(true)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Dashboard" component={Dashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
