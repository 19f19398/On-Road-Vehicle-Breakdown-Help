import React from 'react';
import {
  Alert,
  FlatList,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function MembershipLists({route, navigation}) {
  const [lists, setLists] = React.useState(null);
  const [updated, setUpdated] = React.useState(Date.now());
  const {user} = route.params;

  React.useEffect(() => {
    firestore()
      .collection('membership')
      .where('upgrade', '==', false)
      .get()
      .then(snapshots => {
        let snapList = [];
        snapshots.forEach(snap => {
          snapList.push({
            id: snap.id,
            ...snap.data(),
          });
        });
        setLists(snapList);
      })
      .catch(err => {
        //
      });
  }, [updated]);

  function handleUpgrade(item) {
    Alert.alert('User Membership Upgrade', 'Are you sure you want to upgrade this user?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          firestore()
            .collection('users')
            .doc(item.user)
            .update({
               userType: item.membershipType,
            })
            .then(res => {
                firestore()
                .collection('membership')
                .doc(item.id)
                .update({
                    upgrade: true,
                })
                .then(res => {
                    ToastAndroid.show('User membership has been changed', ToastAndroid.SHORT);
                    setUpdated(Date.now());
                })
                .catch(err => {
                  ToastAndroid.show(
                    'Error while changing membership, try again...',
                    ToastAndroid.SHORT,
                  );
                });

            })
            .catch(err => {
              ToastAndroid.show(
                'Error while changing membership, try again...',
                ToastAndroid.SHORT,
              );
            });
        },
      },
    ]);
  }
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff', padding: 15}}>
        {lists && lists.length == 0 && <Text style={{fontSize: 16, color: '#000000', textAlign: 'center'}}>There is no membership requests, try again later...</Text>}
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#cccccc',
              margin: 5,
            }}>
            <Text style={{fontSize: 16, color: '#000000'}}>
              Name: {item.date.toDate().toLocaleString('en-DE')}
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              Name: {item.userDetails.name}
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              Mobile: {item.userDetails.mobile}
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              E-mail: {item.userDetails.email}
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
            Membership Type: {item.membershipType}
            </Text>

            <TouchableOpacity
              style={{
                padding: 5,
                margin: 5,
                borderRadius: 15,
                backgroundColor: '#000000',
                width: '25%',
              }}
              onPress={() => handleUpgrade(item)}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#ffffff',
                  textAlign: 'center',
                }}>
                Upgrade
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
