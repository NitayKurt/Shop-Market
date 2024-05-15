import React, { useState } from 'react';
import { StyleSheet,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Login from './screens/Login';
import ShopList from './screens/ShopList';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

export default function App() {

  const [user, setUser] = useState('');

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#82BDC1" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide header
          cardStyle: { backgroundColor: '#82BDC1' }, // Set background color for screens
        }}>
        {user ? (
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name={'ShopList'} component={ShopList} />
          </Stack.Group>
        ) : (
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name={'Login'}>
                {(props) => <Login {...props} setUser={setUser} />}
              </Stack.Screen>
            </Stack.Group>
          )}
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const styles = StyleSheet.create({

});
