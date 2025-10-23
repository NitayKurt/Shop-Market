import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './screens/Login';
import ShopList from './screens/ShopList';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState("");

  const checkUser = async () => {
    try {
      const value = await AsyncStorage.getItem('savedUser');
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      console.log('Error reading user from AsyncStorage:', e);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

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
            {(props) => <ShopList {...props} setUser={setUser} user={user}/>}
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