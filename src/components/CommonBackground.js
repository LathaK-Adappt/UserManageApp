import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CommonBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images.jpeg')}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Ensures that children are positioned over the image
  },
  background: {
    ...StyleSheet.absoluteFillObject, // This makes the image fill the entire container
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)', // Dark overlay for better readability
  },
});

export default CommonBackground;
