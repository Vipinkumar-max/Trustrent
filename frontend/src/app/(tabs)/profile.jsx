import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUser, removeAuth } from '../../services/api';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = getUser();

    if (!savedUser) {
      router.replace('/auth/login');
      return;
    }

    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    removeAuth();
    router.replace('/auth/login');
  };

  return (
    <View style={s.wrap}>
      <View style={s.avatar}>
        <Text style={s.avatarText}>
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </Text>
      </View>

      <Text style={s.name}>{user?.name || 'Guest'}</Text>
      <Text style={s.email}>{user?.email || ''}</Text>

      <View style={s.card}>
        <View style={s.row}>
          <Text style={s.label}>Role</Text>
          <Text style={s.value}>
            {user?.role === 'landlord' ? 'Landlord' : 'Tenant'}
          </Text>
        </View>

        <View style={s.rowLast}>
          <Text style={s.label}>Trust Score</Text>
          <Text style={s.score}>{user?.trustScore || 30} / 100</Text>
        </View>
      </View>

      {user?.role === 'landlord' ? (
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push('/add-listing')}
        >
          <Text style={s.addBtnTxt}>+ Add New Listing</Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Text style={s.logoutTxt}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 22,
    paddingTop: 60
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#185FA5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700'
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4
  },
  email: {
    fontSize: 13,
    color: '#888',
    marginBottom: 26
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee'
  },
  rowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  label: {
    fontSize: 14,
    color: '#555'
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700'
  },
  score: {
    fontSize: 14,
    color: '#2F6B00',
    fontWeight: '700'
  },
  addBtn: {
    width: '100%',
    backgroundColor: '#185FA5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12
  },
  addBtnTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  },
  logoutBtn: {
    width: '100%',
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center'
  },
  logoutTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  }
});