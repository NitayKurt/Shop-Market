import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'

export default function EmptyListCase() {
  return (
    <View style={styles.container}>
    <Text style={styles.text}>הרשימה ריקה כרגע</Text>
    <Image source={require('../assets/marketCart.png')} style={{ width: 200, height: 200 }} />
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})