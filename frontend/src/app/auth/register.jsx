import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../../services/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const showMessage = (message) => {
    if (typeof window !== 'undefined') {
      window.alert(message);
    }
  };

  const handleRegister = async () => {
    console.log('Create account button clicked');

    if (!name || !email || !phone || !password) {
      showMessage('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser({
        name,
        email,
        phone,
        password,
        role
      });

      console.log('Register success:', res.data);

      showMessage('Account created successfully. Now login.');
      router.replace('/auth/login');
    } catch (err) {
      console.log('Register error:', err.response?.data || err.message);

      showMessage(
        err.response?.data?.message || 'Registration failed. Check backend.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.logo}>🏠 TrustRent</Text>
      <Text style={s.sub}>Create your account</Text>

      <TextInput
        style={s.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={s.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={s.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={s.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={s.roleRow}>
        <TouchableOpacity
          style={[s.roleBtn, role === 'tenant' && s.roleActive]}
          onPress={() => setRole('tenant')}
        >
          <Text style={[s.roleTxt, role === 'tenant' && s.roleTxtActive]}>
            🏠 Tenant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.roleBtn, role === 'landlord' && s.roleActive]}
          onPress={() => setRole('landlord')}
        >
          <Text style={[s.roleTxt, role === 'landlord' && s.roleTxtActive]}>
            🔑 Landlord
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleRegister}>
        <Text style={s.btnTxt}>
          {loading ? 'Creating...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={s.link}>Already have account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 6
  },
  sub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 13,
    fontSize: 14,
    marginBottom: 12
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  roleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  roleActive: {
    backgroundColor: '#185FA5',
    borderColor: '#185FA5'
  },
  roleTxt: {
    fontSize: 14,
    color: '#666'
  },
  roleTxtActive: {
    color: '#fff',
    fontWeight: '600'
  },
  btn: {
    backgroundColor: '#185FA5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12
  },
  btnTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  link: {
    textAlign: 'center',
    color: '#185FA5',
    fontSize: 14
  }
});