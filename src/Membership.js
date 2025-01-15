import React from 'react';
import {
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore, { serverTimestamp } from '@react-native-firebase/firestore';

export default function Membership({route, navigation}) {
  const [userDetails, setuserDetails] = React.useState(null);
  const [membershipType, setMembershipType] = React.useState('driver');
  const {user} = route.params;

  React.useEffect(() => {
    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(snapshot => {
          setuserDetails(snapshot.data());
        })
        .catch(err => {
          //
        });
    }
  }, [user]);

  function handleUpgrade() {
    firestore()
      .collection('membership')
      .add({
        userDetails: userDetails,
        date: serverTimestamp(),
        membershipType: membershipType,
        user: user.uid,
        upgrade: false,
      })
      .then(res => {
        navigation.navigate('Thank You');
      })
      .catch(err => {
        ToastAndroid.show(
          'Error while sending your request, try again...',
          ToastAndroid.SHORT,
        );
      });
  }

  return (
    <ScrollView style={{backgroundColor: '#ffffff'}}>
      <Text
        style={{
          fontSize: 22,
          color: '#000000',
          fontWeight: 'bold',
          margin: 15,
        }}>
        Upgrade your membership:
      </Text>
      <Text style={{
          fontSize: 16,
          color: '#000000',
          margin: 15,
        }}>If you own a car repair shop or operate a breakdown service, now is the perfect time to upgrade your account! Enhance your visibility and make it easy to connect with new customers who need your services. Attract more business. Don’t miss out on the opportunity to grow your customer base and improve your service experience. Upgrade today and watch your business thrive!.</Text>
      {userDetails && (
        <View style={{padding: 15}}>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            Name:
          </Text>
          <Text style={{fontSize: 16, color: '#000000'}}>
            {userDetails.name}
          </Text>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            Mobile:
          </Text>
          <Text style={{fontSize: 16, color: '#000000'}}>
            {userDetails.mobile}
          </Text>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            E-mail:
          </Text>
          <Text style={{fontSize: 16, color: '#000000'}}>
            {userDetails.email}
          </Text>
        </View>
      )}

      <Text style={{padding: 15, margin: 2, fontSize: 18}}>Upgrade your account to:</Text>
      <View style={{flexDirection: 'row', padding: 15, alignSelf: 'center'}}>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: membershipType == 'driver' ? '#ffc500' : '#ffffff',
            borderRadius: 15,
            margin: 2,
          }}
          onPress={() => setMembershipType('driver')}>
          <Text style={{}}>Breakdown Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor:
              membershipType == 'merchant' ? '#ffc500' : '#ffffff',
            borderRadius: 15,
            margin: 2,
          }}
          onPress={() => setMembershipType('merchant')}>
          <Text>Car Repear Merchant</Text>
        </TouchableOpacity>
      </View>
        <TouchableOpacity
          style={{
            width: '45%',
            backgroundColor: '#000000',
            padding: 15,
            margin: 3,
            marginTop: 15,
            borderRadius: 15,
            alignSelf: 'center',
          }}
          onPress={handleUpgrade}>
          <Text style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>
            Upgrade
          </Text>
        </TouchableOpacity>
    </ScrollView>
  );
}
