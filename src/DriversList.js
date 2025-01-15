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

export default function DriversList({route, navigation}) {
  const [lists, setLists] = React.useState(null);
  const [updated, setUpdated] = React.useState(Date.now());
  const {user} = route.params;

  React.useEffect(() => {
    firestore()
      .collection('users')
      .where('userType', '==', 'driver')
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

  function handleStatus(item, enable) {
    Alert.alert('Change user status', 'Are you sure you?', [
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
            .doc(item)
            .update({
               enable: !enable,
            })
            .then(res => {
              ToastAndroid.show('User status changed', ToastAndroid.SHORT);
              setUpdated(Date.now());
            })
            .catch(err => {
              ToastAndroid.show(
                'Error while changing status, try again...',
                ToastAndroid.SHORT,
              );
            });
        },
      },
    ]);
  }
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff', padding: 15}}>
        {lists && lists.length == 0 && <Text style={{fontSize: 16, color: '#000000', textAlign: 'center'}}>There is no registered drivers, try again later...</Text>}
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
              Name: {item.name}
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              Mobile: {item.mobile}
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              E-mail: {item.email}
            </Text>

            <TouchableOpacity
              style={{
                padding: 5,
                margin: 5,
                borderRadius: 15,
                backgroundColor: '#000000',
                width: '25%',
              }}
              onPress={() => handleStatus(item.id, item.enable)}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#ffffff',
                  textAlign: 'center',
                }}>
                {item.enable ? 'Disable' : 'Enable'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
