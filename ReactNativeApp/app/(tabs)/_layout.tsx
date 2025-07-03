import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#1e1e1e',
          borderTopWidth: 0,
          paddingVertical: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="webcam"
  options={{
    title: 'Webcams',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="videocam" size={size} color={color} />
    ),
  }}
/>
      <Tabs.Screen
        name="glossary"
        options={{
          title: 'Glossary',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="live-data"
        options={{
          title: 'Live Data',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="tourism-guide"
  options={{
    title: "Tourism Guide",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="globe" size={size} color={color} />
    ),
  }}
/>
    </Tabs>
  );
}