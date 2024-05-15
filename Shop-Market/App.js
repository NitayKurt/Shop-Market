import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Login from './screens/Login';
import ShopList from './screens/ShopList';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState("Ofri"); // Initially user is not authenticated

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#82BDC1" />
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#82BDC1' },
        }}>
        {user ? (
          <Stack.Screen name={'List'} component={ShopList} />
        ) : (
          <Stack.Screen name={'Login'}>
            {(props) => <Login {...props} setUser={setUser} navigation={useNavigation()} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const styles = StyleSheet.create({

});
