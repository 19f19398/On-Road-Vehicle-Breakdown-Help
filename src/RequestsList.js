import React from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function RequestsList({route, navigation}) {
  const [lists, setLists] = React.useState(null);

  React.useEffect(() => {
    firestore()
      .collection('requests')
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
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff', padding: 15}}>
        {lists && lists.length == 0 && <Text style={{fontSize: 16, color: '#000000', textAlign: 'center'}}>There is no available requests, try again later...</Text>}
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#cccccc',
              margin: 5,
            }}
            onPress={() => navigation.navigate("Request Details", {details: item})}
            >
            <Text style={{fontSize: 16, color: '#000000'}}>
                {item.date.toDate().toLocaleString('en-DE')}
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              Car Type: {item.carType}
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
            Request Status: {item.status}
            </Text>

            
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
