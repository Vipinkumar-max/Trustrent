import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ListingCard({ listing }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={s.card}
      onPress={() => router.push(`/listing/${listing._id}`)}>
      <Image
        source={{
  uri:
    listing.photos?.[0] ||
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900'
}}
        style={s.img}/>
      <View style={s.body}>
        <Text style={s.title} numberOfLines={1}>{listing.title}</Text>
        <Text style={s.loc}>📍 {listing.address}, {listing.city}</Text>
        <View style={s.row}>
          <Text style={s.rent}>₹{listing.rent?.toLocaleString()}/mo</Text>
          <View style={s.badge}>
            <Text style={s.badgeTxt}>{listing.type}</Text>
          </View>
        </View>
        <Text style={s.trust}>
          🏅 Trust Score: {listing.landlord?.trustScore ?? '—'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card:     { backgroundColor:'#fff', borderRadius:12, marginBottom:14,
              borderWidth:0.5, borderColor:'#e0e0e0', overflow:'hidden' },
  img:      { width:'100%', height:170 },
  body:     { padding:12 },
  title:    { fontSize:15, fontWeight:'600', marginBottom:4 },
  loc:      { fontSize:12, color:'#777', marginBottom:8 },
  row:      { flexDirection:'row', justifyContent:'space-between',
              alignItems:'center', marginBottom:6 },
  rent:     { fontSize:16, fontWeight:'700', color:'#185FA5' },
  badge:    { backgroundColor:'#E6F1FB', borderRadius:8,
              paddingHorizontal:8, paddingVertical:2 },
  badgeTxt: { fontSize:11, color:'#185FA5', fontWeight:'500' },
  trust:    { fontSize:12, color:'#3B6D11' },
});