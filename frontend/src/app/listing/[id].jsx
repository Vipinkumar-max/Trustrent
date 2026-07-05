import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getListing, createRental, getUser } from '../../services/api';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900';

export default function ListingDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [listing, setListing] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const showMessage = (message) => {
    if (typeof window !== 'undefined') {
      window.alert(message);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setUser(getUser());

        const res = await getListing(id);
        setListing(res.data.listing);
      } catch (err) {
        showMessage('Could not load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleRentalRequest = async () => {
    if (!listing?._id) {
      return showMessage('Listing not found');
    }

    if (user?.role !== 'tenant') {
      return showMessage('Only tenants can request rentals');
    }

    setRequesting(true);

    try {
      await createRental({
        listingId: listing._id,
        startDate: new Date(),
        endDate: null
      });

      router.replace('/rentals');
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Please login first to request rental'
      );
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#185FA5" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={s.center}>
        <Text>Listing not found</Text>
      </View>
    );
  }

  const isTenant = user?.role === 'tenant';
  const photo = listing.photos?.[0] || FALLBACK_IMAGE;
  const isAvailable = listing.available !== false;

  return (
    <ScrollView style={s.wrap}>
      <View>
        <Image source={{ uri: photo }} style={s.img} />

        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backTxt}>‹ Back</Text>
        </TouchableOpacity>

        <View style={s.statusBadge}>
          <Text style={s.statusTxt}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      <View style={s.body}>
        <Text style={s.title}>{listing.title}</Text>
        <Text style={s.loc}>📍 {listing.address}, {listing.city}</Text>

        <View style={s.priceRow}>
          <View>
            <Text style={s.rent}>₹{listing.rent?.toLocaleString()}</Text>
            <Text style={s.month}>per month</Text>
          </View>

          <View style={s.badge}>
            <Text style={s.badgeTxt}>{listing.type}</Text>
          </View>
        </View>

        <View style={s.infoGrid}>
          <View style={s.infoBox}>
            <Text style={s.infoLabel}>Deposit</Text>
            <Text style={s.infoVal}>
              ₹{listing.deposit?.toLocaleString() || 0}
            </Text>
          </View>

          <View style={s.infoBox}>
            <Text style={s.infoLabel}>Furnishing</Text>
            <Text style={s.infoVal}>{listing.furnishing || 'N/A'}</Text>
          </View>

          <View style={s.infoBox}>
            <Text style={s.infoLabel}>Views</Text>
            <Text style={s.infoVal}>{listing.views || 0}</Text>
          </View>
        </View>

        {listing.description ? (
          <View style={s.card}>
            <Text style={s.secTitle}>Description</Text>
            <Text style={s.desc}>{listing.description}</Text>
          </View>
        ) : null}

        {listing.amenities?.length > 0 ? (
          <View style={s.card}>
            <Text style={s.secTitle}>Amenities</Text>

            <View style={s.amenityRow}>
              {listing.amenities.map((item, index) => (
                <View key={index} style={s.amenityBadge}>
                  <Text style={s.amenityTxt}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={s.card}>
          <Text style={s.secTitle}>Landlord</Text>
          <Text style={s.landlordName}>👤 {listing.landlord?.name}</Text>
          <Text style={s.trustScore}>
            🏅 Trust Score: {listing.landlord?.trustScore}
          </Text>
        </View>

        {isTenant && isAvailable ? (
          <TouchableOpacity
            style={s.requestBtn}
            onPress={handleRentalRequest}
            disabled={requesting}
          >
            <Text style={s.requestTxt}>
              {requesting ? 'Sending Request...' : 'Request Rental'}
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={s.contactBtn}
          onPress={() =>
            showMessage(`Call: ${listing.landlord?.phone || 'Not available'}`)
          }
        >
          <Text style={s.contactTxt}>Contact Landlord</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: '100%',
    height: 270
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  backTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  statusBadge: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#E6F1FB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  statusTxt: {
    color: '#185FA5',
    fontSize: 12,
    fontWeight: '700'
  },
  body: {
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    marginBottom: 6
  },
  loc: {
    fontSize: 13,
    color: '#777',
    marginBottom: 14
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  rent: {
    fontSize: 25,
    fontWeight: '800',
    color: '#185FA5'
  },
  month: {
    fontSize: 12,
    color: '#777'
  },
  badge: {
    backgroundColor: '#E6F1FB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  badgeTxt: {
    fontSize: 12,
    color: '#185FA5',
    fontWeight: '700'
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#e0e0e0'
  },
  infoLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4
  },
  infoVal: {
    fontSize: 13,
    color: '#222',
    fontWeight: '700'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: '#e0e0e0'
  },
  secTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
    color: '#222'
  },
  desc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  amenityBadge: {
    backgroundColor: '#EAF3DE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  amenityTxt: {
    fontSize: 12,
    color: '#3B6D11',
    fontWeight: '600'
  },
  landlordName: {
    fontSize: 14,
    marginBottom: 4,
    color: '#222',
    fontWeight: '600'
  },
  trustScore: {
    fontSize: 13,
    color: '#3B6D11'
  },
  requestBtn: {
    backgroundColor: '#185FA5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10
  },
  requestTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  },
  contactBtn: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30
  },
  contactTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  }
});