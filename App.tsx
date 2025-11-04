import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { HomeScreen } from './src/screens/HomeScreen';

// Initialize Convex client
// You'll need to replace this with your actual Convex deployment URL
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL || '');

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <ThemeProvider>
          <HomeScreen />
        </ThemeProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}
