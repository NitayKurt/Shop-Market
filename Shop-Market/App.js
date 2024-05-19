import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import ShopList from './screens/ShopList';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(""); // Initially user is not authenticated

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#82BDC1" />
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#82BDC1' },
        }}>
        {user ? (
          <Stack.Screen name='ShopList' >
            {(props) => <ShopList {...props} setUser={setUser} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name='Login'>
            {(props) => <Login {...props} setUser={setUser} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
