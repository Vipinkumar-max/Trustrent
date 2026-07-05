import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { createListing, getToken, getUser } from '../../services/api';

export default function AddListingScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('flat');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [photo, setPhoto] = useState('');
  const [furnishing, setFurnishing] = useState('semi');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();

  const showMessage = (message) => {
    if (typeof window !== 'undefined') {
      window.alert(message);
    } else {
      Alert.alert('Message', message);
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
      showMessage('Only landlords can add listings');
      router.replace('/');
      return;
    }

    setCheckingAuth(false);
  }, []);

  const handleCreateListing = async () => {
    if (!title || !address || !city || !rent) {
      showMessage('Title, address, city and rent are required');
      return;
    }

    setLoading(true);

    try {
      await createListing({
        title,
        description,
        type,
        address,
        city,
        rent: Number(rent),
        deposit: Number(deposit) || 0,
        furnishing,
        amenities: ['wifi', 'parking'],
        photos: photo ? [photo] : []
      });

      

      setTitle('');
      setDescription('');
      setAddress('');
      setCity('');
      setRent('');
      setDeposit('');
      setPhoto('');
      setType('flat');
      setFurnishing('semi');

      router.replace('/');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Could not add listing');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.heading}>➕ Add Property</Text>

      <TextInput
        style={s.input}
        placeholder="Title e.g. 2BHK Near GLA University"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[s.input, s.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={s.label}>Property Type</Text>
      <View style={s.row}>
        {['flat', 'PG', 'room', '1BHK', '2BHK'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[s.chip, type === item && s.activeChip]}
            onPress={() => setType(item)}
          >
            <Text style={[s.chipText, type === item && s.activeChipText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={s.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={s.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      <TextInput
        style={s.input}
        placeholder="Monthly Rent"
        value={rent}
        onChangeText={setRent}
        keyboardType="numeric"
      />

      <TextInput
        style={s.input}
        placeholder="Security Deposit"
        value={deposit}
        onChangeText={setDeposit}
        keyboardType="numeric"
      />
      <TextInput
  style={s.input}
  placeholder="Photo URL"
  value={photo}
  onChangeText={setPhoto}
/>

      <Text style={s.label}>Furnishing</Text>
      <View style={s.row}>
        {['furnished', 'semi', 'unfurnished'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[s.chip, furnishing === item && s.activeChip]}
            onPress={() => setFurnishing(item)}
          >
            <Text style={[s.chipText, furnishing === item && s.activeChipText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[s.btn, loading && s.disabledBtn]}
        onPress={handleCreateListing}
        disabled={loading}
      >
        <Text style={s.btnTxt}>
          {loading ? 'Adding...' : 'Add Listing'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    flexGrow: 1
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 13,
    fontSize: 14,
    marginBottom: 12
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14
  },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  activeChip: {
    backgroundColor: '#185FA5',
    borderColor: '#185FA5'
  },
  chipText: {
    color: '#555',
    fontSize: 13
  },
  activeChipText: {
    color: '#fff',
    fontWeight: '600'
  },
  btn: {
    backgroundColor: '#185FA5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 8
  },
  disabledBtn: {
    opacity: 0.7
  },
  btnTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  }
});