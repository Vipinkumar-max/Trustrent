import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  getLandlordRentals,
  updateRentalStatus,
  getToken,
  getUser
} from '../../services/api';

export default function RequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const router = useRouter();

  const showMessage = (message) => {
    if (typeof window !== 'undefined') {
      window.alert(message);
    } else {
      Alert.alert('Message', message);
    }
  };

  const loadRequests = async () => {
    setLoading(true);

    try {
      const res = await getLandlordRentals();
      setRequests(res.data.rentals || []);
    } catch (err) {
      showMessage(err.response?.data?.message || 'Could not load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {


    try {
      setUpdatingId(id);

      await updateRentalStatus(id, status);

      
      await loadRequests();
    } catch (err) {
      showMessage(
        err.response?.data?.message || err.message || 'Could not update status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token) {
      setCheckingAuth(false);
      setLoading(false);
      router.replace('/auth/login');
      return;
    }

    if (user?.role !== 'landlord') {
      setCheckingAuth(false);
      setLoading(false);
      showMessage('Only landlords can view requests');
      router.replace('/');
      return;
    }

    setCheckingAuth(false);
    loadRequests();
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
      <Text style={s.heading}>Rental Requests</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
       ListEmptyComponent={
  <View style={s.emptyBox}>
    <Text style={s.emptyTitle}>No requests yet</Text>
    <Text style={s.emptyText}>
      Rental requests from tenants will appear here.
    </Text>
  </View>
}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.title}>{item.listing?.title || 'Property'}</Text>

            <Text style={s.text}>
              Tenant: {item.tenant?.name || 'Unknown'}
            </Text>

            <Text style={s.text}>
              Phone: {item.tenant?.phone || 'Not available'}
            </Text>

            <Text style={s.text}>
              Rent: ₹{item.rent?.toLocaleString()}/mo
            </Text>

            <Text style={s.status}>Status: {item.status}</Text>

            {item.status === 'pending' ? (
              <View style={s.btnRow}>
                <Pressable
                  style={s.approveBtn}
                  disabled={updatingId === item._id}
                  onPress={() => handleStatus(item._id, 'approved')}
                >
                  <Text style={s.btnTxt}>
                    {updatingId === item._id ? 'Updating...' : 'Approve'}
                  </Text>
                </Pressable>

                <Pressable
                  style={s.rejectBtn}
                  disabled={updatingId === item._id}
                  onPress={() => handleStatus(item._id, 'rejected')}
                >
                  <Text style={s.btnTxt}>
                    {updatingId === item._id ? 'Updating...' : 'Reject'}
                  </Text>
                </Pressable>
              </View>
            ) : null}
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
  status: {
    fontSize: 14,
    fontWeight: '700',
    color: '#185FA5',
    textTransform: 'capitalize',
    marginTop: 6
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center'
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#C62828',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center'
  },
  btnTxt: {
    color: '#fff',
    fontWeight: '700'
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