import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PickImage from './PickImage';

export default function UnderLineTextWithImage({text, image}) {

    const imageSource = PickImage(image);

    return (
        <View style={styles.container}>
          <View style={styles.textImageContainer}>
            <Text style={styles.text}>{text}</Text>
            <Image source={imageSource} style={styles.image} />
          </View>
          <View style={styles.underline} />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        alignItems: 'center',
      },
      textImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      text: {
        color: '#09263B',
        fontSize: 16,
      },
      image: {
        width: 24, // Adjust the size as needed
        height: 24, // Adjust the size as needed
        marginLeft: 5,
      },
      underline: {
        borderBottomWidth: 2,
        borderBottomColor: '#09263B',
        width: '100%',
        position: 'absolute',
        bottom: 0,
      },
    });