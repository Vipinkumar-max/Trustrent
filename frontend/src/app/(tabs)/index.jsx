import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { getListings } from '../../services/api';
import ListingCard from '../../components/ListingCard';

export default function HomeScreen() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');

  const fetchListings = async (customParams) => {
    setLoading(true);

    try {
      const params = customParams || {};

      if (!customParams) {
        if (city) params.city = city;
        if (type) params.type = type;
        if (minRent) params.minRent = minRent;
        if (maxRent) params.maxRent = maxRent;
      }

      const res = await getListings(params);
      setListings(res.data.listings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCity('');
    setType('');
    setMinRent('');
    setMaxRent('');
    fetchListings({});
  };

  useEffect(() => {
    fetchListings({});
  }, []);

  return (
    <View style={s.wrap}>
      <Text style={s.heading}>🏠 Find Your Room</Text>

      <TextInput
        style={s.input}
        placeholder="Search by city..."
        placeholderTextColor="#777"
        value={city}
        onChangeText={setCity}
        onSubmitEditing={() => fetchListings()}
      />

      <Text style={s.label}>Property Type</Text>
      <View style={s.typeRow}>
        {['flat', 'PG', 'room', '1BHK', '2BHK'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[s.chip, type === item && s.activeChip]}
            onPress={() => setType(type === item ? '' : item)}
          >
            <Text style={[s.chipText, type === item && s.activeChipText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.rentRow}>
        <TextInput
          style={[s.input, s.rentInput]}
          placeholder="Min rent"
          placeholderTextColor="#777"
          value={minRent}
          onChangeText={setMinRent}
          keyboardType="numeric"
        />

        <TextInput
          style={[s.input, s.rentInput]}
          placeholder="Max rent"
          placeholderTextColor="#777"
          value={maxRent}
          onChangeText={setMaxRent}
          keyboardType="numeric"
        />
      </View>

      <View style={s.btnRow}>
        <TouchableOpacity style={s.searchBtn} onPress={() => fetchListings()}>
          <Text style={s.searchTxt}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.clearBtn} onPress={clearFilters}>
          <Text style={s.clearTxt}>Clear</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#185FA5"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <Text style={s.emptyTitle}>No listings found</Text>
              <Text style={s.emptyText}>
                Try changing city, rent range, or property type.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
     color: '#111827'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
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
  rentRow: {
    flexDirection: 'row',
    gap: 10
  },
  rentInput: {
    flex: 1
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  searchBtn: {
    flex: 1,
    backgroundColor: '#185FA5',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center'
  },
  searchTxt: {
    color: '#fff',
    fontWeight: '700'
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#E6F1FB',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center'
  },
  clearTxt: {
    color: '#185FA5',
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