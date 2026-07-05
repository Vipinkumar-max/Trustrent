import { Tabs, useRouter } from 'expo-router';
import { Text } from 'react-native';
import { useEffect, useState } from 'react';
import { getToken, getUser } from '../../services/api';

export default function TabLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();

    if (!token) {
      router.replace('/auth/login');
      return;
    }

    setUser(savedUser);
  }, []);

  const isLandlord = user?.role === 'landlord';
  const isTenant = user?.role === 'tenant';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#185FA5',
        tabBarInactiveTintColor: '#999',
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          )
        }}
      />

      <Tabs.Screen
        name="add-listing"
        options={{
          title: 'Add',
          href: isLandlord ? undefined : null,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>➕</Text>
          )
        }}
      />
      <Tabs.Screen
  name="my-listings"
  options={{
    title: 'Listings',
    href: isLandlord ? undefined : null,
    tabBarIcon: ({ color }) => (
      <Text style={{ fontSize: 20, color }}>🏘️</Text>
    )
  }}
/>

      <Tabs.Screen
        name="rentals"
        options={{
          title: 'Rentals',
          href: isTenant ? undefined : null,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📄</Text>
          )
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          href: isLandlord ? undefined : null,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📩</Text>
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👤</Text>
          )
        }}
      />
    </Tabs>
  );
}