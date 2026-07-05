import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateListingScreen() {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent]               = useState('');
  const [city, setCity]               = useState('');
  const [address, setAddress]         = useState('');
  const [bedrooms, setBedrooms]       = useState('');
  const [type, setType]               = useState('flat');
  const [loading, setLoading]         = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!title || !rent || !city || !address) {
      window.alert('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const user = userStr ? JSON.parse(userStr) : null;

      const res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          rent: Number(rent),
          city,
          address,
          bedrooms: Number(bedrooms) || 1,
          type,
          landlord: user?._id
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create listing');
      window.alert('Listing created successfully!');
      router.replace('/(tabs)');
    } catch (err) {
      window.alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.heading}>List Your Property</Text>

      <TextInput style={s.input} placeholder="Title (e.g. 2BHK Near Market)"
        value={title} onChangeText={setTitle}/>

      <TextInput style={[s.input, s.textArea]} placeholder="Description"
        value={description} onChangeText={setDescription}
        multiline numberOfLines={4}/>

      <TextInput style={s.input} placeholder="Monthly Rent (₹)"
        value={rent} onChangeText={setRent} keyboardType="numeric"/>

      <TextInput style={s.input} placeholder="City"
        value={city} onChangeText={setCity}/>

      <TextInput style={s.input} placeholder="Full Address"
        value={address} onChangeText={setAddress}/>

      <TextInput style={s.input} placeholder="Bedrooms"
        value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric"/>

      <View style={s.typeRow}>
        {['flat', 'pg', 'room'].map((t) => (
          <TouchableOpacity key={t}
            style={[s.typeBtn, type === t && s.typeActive]}
            onPress={() => setType(t)}>
            <Text style={[s.typeTxt, type === t && s.typeTxtActive]}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.btn} onPress={handleCreate}>
        <Text style={s.btnTxt}>
          {loading ? 'Creating...' : 'Create Listing'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap:        { padding: 24, backgroundColor: '#fff', flexGrow: 1 },
  heading:     { fontSize: 22, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  input:       { borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
                 padding: 13, fontSize: 14, marginBottom: 12 },
  textArea:    { height: 90, textAlignVertical: 'top' },
  typeRow:     { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn:     { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1,
                 borderColor: '#ddd', alignItems: 'center' },
  typeActive:  { backgroundColor: '#185FA5', borderColor: '#185FA5' },
  typeTxt:     { fontSize: 13, color: '#666' },
  typeTxtActive: { color: '#fff', fontWeight: '600' },
  btn:         { backgroundColor: '#185FA5', borderRadius: 10, padding: 15,
                 alignItems: 'center' },
  btnTxt:      { color: '#fff', fontSize: 15, fontWeight: '600' },
});