import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER1, USER2, USER3, USER4 } from '@env';

export default function Login({ setUser, navigation }) {
  const [userInput, setUserInput] = useState(null);
  const keyboardProgress = useRef(new Animated.Value(0)).current;
  const users = [USER1, USER2, USER3, USER4];
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const animateForKeyboard = toValue => {
      Animated.timing(keyboardProgress, {
        toValue,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    };
    const showSubscription = Keyboard.addListener(showEvent, () => animateForKeyboard(1));
    const hideSubscription = Keyboard.addListener(hideEvent, () => animateForKeyboard(0));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardProgress]);
  
  const savedUser = async () => {
    try {
      const value = await AsyncStorage.getItem('savedUser');
      if (value !== null) {
        if (users.includes(value.trim().toLowerCase()) || users.includes(value.trim())) {
          setUser(value);
          setAuthSuccess(true);
        }
      }
    } catch (e) {
      console.log('Error reading user from AsyncStorage:', e);
      Alert.alert("Error ❌",'Error reading user from AsyncStorage');
    }
  };
  
  useEffect(() => {
    savedUser();
  }, []);

  useEffect(() => {
    if (authSuccess) {
      navigation.navigate('ShopList');
    }
  }, [authSuccess, navigation]);

  const headerFontSize = keyboardProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 34],
  });
  const circleSize = keyboardProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 165],
  });
  const imageSize = keyboardProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 125],
  });
  const circleMargin = keyboardProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 32],
  });
  const headerMargin = keyboardProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 24],
  });

  const checkUser = async () => {
    if (!userInput) {
      Alert.alert("Error ❌",'Please enter a user name');
      return;
    }
    if (users.includes(userInput.trim().toLowerCase()) || users.includes(userInput.trim())) {
      try {
        await AsyncStorage.setItem('savedUser', userInput);
      } catch (error) {
        console.log('Error saving user to AsyncStorage:', error);
      }
      Alert.alert("Success 😁",'Welcome back ' + userInput);
      setUser(userInput);
      setAuthSuccess(true);
      return;
    }
    else {
      Alert.alert("Error ❌",'Wrong User Name!');
      setUserInput(null);
      return;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.headerContainer, { marginBottom: headerMargin }]}>
            <Animated.Text style={[styles.header, { fontSize: headerFontSize }]}>
              Shop Market 🛒
            </Animated.Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.circle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: Animated.divide(circleSize, 2),
                marginBottom: circleMargin,
              },
            ]}
          >
            <Animated.Image
              source={require('../assets/groceriesBag.png')}
              style={{ width: imageSize, height: imageSize, resizeMode: 'contain' }}
            />
          </Animated.View>

          <View style={styles.content}>
            <TextInput
              style={styles.textInput}
              autoFocus={true}
              value={userInput}
              placeholderTextColor={'#82BDC1'}
              placeholder="שם משתמש"
              textAlign="center"
              onChangeText={(text) => setUserInput(text)}
            />
            <TouchableOpacity style={styles.buttonContainer} mode="contained" onPress={checkUser}>
              <Text style={styles.buttonText}>התחברות</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82BDC1',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerContainer: {
  },
  header: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'Roboto',
    fontStyle: 'italic',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#1E92C4',
    marginBottom: 48,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  textInput: {
    position: 'relative',
    width: 250,
    height: 50,
    marginBottom: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderColor: "#1E92C4",
    borderWidth: 1,
  },
  buttonContainer: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#1E92C4',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});