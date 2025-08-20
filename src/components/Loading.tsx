import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../styles/AppStyles';

/**
 * Loading component that displays a spinner in the center of the screen.
 * Used to indicate loading state in various parts of the application.
 */
const Loading = () => {
  return (
    <View style={Styles.layerLoading}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
    </View>
  );
}

const Styles = StyleSheet.create({
  layerLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  }
});

export default Loading;