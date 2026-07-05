import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { loginUser, setToken, setUser } from '../../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      window.alert('Fill all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({
        email,
        password
      });

      if (!res.data.token) {
        throw new Error('Token not received from backend');
      }

      setToken(res.data.token);
      setUser(res.data);

      router.replace('/(tabs)');
    } catch (err) {
      window.alert(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.wrap}>
      <Text style={s.logo}>🏠 TrustRent</Text>
      <Text style={s.sub}>Verified rent, zero brokers</Text>

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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
        <Text style={s.btnTxt}>
          {loading ? 'Please wait...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={s.link}>New here? Create account</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff'
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