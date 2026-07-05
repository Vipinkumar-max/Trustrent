import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  getMyListings,
  getToken,
  getUser,
  deleteListing,
  updateListing
} from '../../services/api';
import ListingCard from '../../components/ListingCard';

export default function MyListingsScreen() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const showMessage = (message) => {
    if (typeof window !== 'undefined') {
      window.alert(message);
    } else {
      Alert.alert('Message', message);
    }
  };

  const loadListings = async () => {
    setLoading(true);

    try {
      const res = await getMyListings();
      setListings(res.data.listings || []);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Could not load your listings'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete =
      typeof window !== 'undefined'
        ? window.confirm('Delete this listing?')
        : true;

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteListing(id);
      
      loadListings();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Could not delete listing');
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      const nextValue = item.available === false ? true : false;

      await updateListing(item._id, {
        available: nextValue
      });

    

      loadListings();
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Could not update availability'
      );
    }
  };

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token) {
      router.replace('/auth/login');
      return;
    }

    if (user?.role !== 'landlord') {
      showMessage('Only landlords can view this page');
      router.replace('/');
      return;
    }

    loadListings();
  }, []);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#185FA5" />
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <Text style={s.heading}>🏘️ My Listings</Text>

      <FlatList
        data={listings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={s.itemWrap}>
            <ListingCard listing={item} />

            <View style={s.actions}>
              <TouchableOpacity
                style={s.editBtn}
                onPress={() => router.push(`/listing/edit/${item._id}`)}
              >
                <Text style={s.editTxt}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.deleteBtn}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={s.deleteTxt}>Delete</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={item.available === false ? s.availableBtn : s.hideBtn}
              onPress={() => handleToggleAvailable(item)}
            >
              <Text style={s.availableTxt}>
                {item.available === false
                  ? 'Mark Available'
                  : 'Mark Unavailable'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
  <View style={s.emptyBox}>
    <Text style={s.emptyTitle}>No listings yet</Text>
    <Text style={s.emptyText}>
      Add your first property to start receiving rental requests.
    </Text>
  </View>
}
        showsVerticalScrollIndicator={false}
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
  itemWrap: {
    marginBottom: 18
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -4,
    marginBottom: 10
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#185FA5',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center'
  },
  editTxt: {
    color: '#fff',
    fontWeight: '700'
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center'
  },
  deleteTxt: {
    color: '#fff',
    fontWeight: '700'
  },
  hideBtn: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center'
  },
  availableBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center'
  },
  availableTxt: {
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