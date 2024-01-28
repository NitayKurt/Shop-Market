import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'

export default function EmptyListCase() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>הרשימה ריקה כרגע</Text>
    <Image source={require('../assets/marketCart.png')} style={{ width: 200, height: 200 }} />
  </View>
  )
}

const styles = StyleSheet.create({})