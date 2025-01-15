import React from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Merchants({route, navigation}) {
  const [updated, setUpdated] = React.useState(Date.now());
  const [userDetails, setUserDetails] = React.useState(null);
  const [requestList, setRequestsList] = React.useState(null);
  const {user} = route.params;

  React.useEffect(() => {
    if (user) {
        firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then(snapshot => {
            setUserDetails(snapshot.data());
        })
        .catch(err => {
          //
        })
        .finally(() => {
      firestore()
        .collection('requests')
        .where('merchant', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .get()
        .then(snapshots => {
          let snapList = [];

          snapshots.forEach(snap => {
            snapList.push({
              id: snap.id,
              ...snap.data(),
            });
          });

          setRequestsList(snapList);
        })
        .catch(err => {
          console.log(err);
        })
        });
    }
  }, [user, updated]);

  function handleRequestStatus(item, status) {
    firestore()
      .collection('requests')
      .doc(item)
      .update({
        status: status,
      })
      .then(res => {
        ToastAndroid.show('Request status changed', ToastAndroid.SHORT);
        setUpdated(Date.now());
      })
      .catch(err => {
        ToastAndroid.show(
          'Error while changing status, try again...',
          ToastAndroid.SHORT,
        );
      });
  }

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#cccccc',}}>
        <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold' }}>Hello, {userDetails && userDetails.name}</Text>
        <TouchableOpacity onPress={() => auth().signOut()}>
            <Text style={{ color: '#000000', fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>
    </View>
      <FlatList
        data={requestList}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#cccccc',
              margin: 5,
            }}>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              Request Date
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              {item.date.toDate().toLocaleString('en-DE')}
            </Text>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              Car Type
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>{item.carType}</Text>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              Condition
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              {item.carCondition}
            </Text>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              Request Status
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>{item.status}</Text>
            {item.status == 'In Progress' && (
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    margin: 3,
                    marginTop: 25,
                    borderRadius: 15,
                    backgroundColor: '#ffc500',
                    width: '45%',
                  }}
                  onPress={() =>
                    handleRequestStatus(item.id, 'Merchant Accept')
                  }>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#000000',
                      textAlign: 'center',
                    }}>
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    margin: 3,
                    marginTop: 25,
                    borderRadius: 15,
                    backgroundColor: '#000000',
                    width: '45%',
                  }}
                  onPress={() =>
                    handleRequestStatus(item.id, 'Merchant Decline')
                  }>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#ffffff',
                      textAlign: 'center',
                    }}>
                    Decline
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
