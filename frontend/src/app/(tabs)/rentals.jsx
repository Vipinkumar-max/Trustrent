import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { getMyRentals, getToken, getUser } from '../../services/api';

export default function RentalsScreen() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();

  const loadRentals = async () => {
    setLoading(true);

    try {
      const res = await getMyRentals();
      setRentals(res.data.rentals || []);
    } catch (err) {
      window.alert(err.response?.data?.message || 'Could not load rentals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token) {
      router.replace('/auth/login');
      return;
    }

    if (user?.role !== 'tenant') {
      Alert.alert('Not allowed', 'Only tenants can view rentals');
      router.replace('/(tabs)');
      return;
    }

    setCheckingAuth(false);
    loadRentals();
  }, []);

  if (checkingAuth || loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#185FA5" />
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <Text style={s.heading}>📄 My Rentals</Text>

      <FlatList
        data={rentals}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
  <View style={s.emptyBox}>
    <Text style={s.emptyTitle}>No rentals yet</Text>
    <Text style={s.emptyText}>
      Your rental requests and their status will appear here.
    </Text>
  </View>
}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.title}>
              {item.listing?.title || 'Property'}
            </Text>

            <Text style={s.text}>
              📍 {item.listing?.address}, {item.listing?.city}
            </Text>

            <Text style={s.price}>
              ₹{item.rent?.toLocaleString()}/mo
            </Text>

            <Text style={s.text}>
              Deposit: ₹{item.deposit?.toLocaleString()}
            </Text>

            <Text style={s.text}>
              Landlord: {item.landlord?.name}
            </Text>

            <View style={s.statusBox}>
              <Text style={s.status}>
                Status: {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6
  },
  text: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#185FA5',
    marginBottom: 6
  },
  statusBox: {
    backgroundColor: '#E6F1FB',
    borderRadius: 8,
    padding: 8,
    marginTop: 8
  },
  status: {
    color: '#185FA5',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
 emptyBox: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 18,
  alignItems: 'center',
  borderWidth: 0.5,
  borderColor: '#e0e0e0',
  marginTop: 24
},
emptyTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#222',
  marginBottom: 6
},
emptyText: {
  fontSize: 13,
  color: '#777',
  textAlign: 'center'
}
});