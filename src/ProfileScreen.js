import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ProfileScreen({ route, navigation }) {
  const [lastRequest, setLastRequest] = React.useState(null);
  const [userProfileDetails, setUserProfileDetails] = React.useState(null);
  const {user} = route.params;

  React.useEffect(() => {
    if(user){
    firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then(snapshot => {
      setUserProfileDetails(snapshot.data());

    })
    .catch(err => {
      //
    })
    .finally(() => {
      firestore()
      .collection("requests")
      .orderBy('timestamp', 'desc')
      .where("user", "==", user.uid)
      .limit(1)
      .get()
      .then(res => {
        res.forEach(element => {
          setLastRequest({
            id: element.id,
            ...element.data()
          })
        });
      })
      .catch(err => {
        console.log(err);
        
      });
    })
      
  }
  }, [user]);

  return (<ScrollView style={{ backgroundColor: "#ffffff" }}>
    <Text style={{ fontSize: 22, color: "#000000", fontWeight: 'bold', margin: 15 }}>Account Details:</Text>
    {userProfileDetails && <View style={{ padding: 15 }}>
      <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>Name:</Text>
      <Text style={{ fontSize: 16, color: "#000000", }}>{userProfileDetails.name}</Text>  
      <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>Mobile:</Text>
      <Text style={{ fontSize: 16, color: "#000000", }}>{userProfileDetails.mobile}</Text>  
      <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>E-mail:</Text>
      <Text style={{ fontSize: 16, color: "#000000", }}>{userProfileDetails.email}</Text>
    </View>}
    <Text style={{ fontSize: 22, color: "#000000", fontWeight: 'bold', margin: 15 }}>Last Request:</Text>
    {lastRequest && <View style={{ padding: 15 }}>
    <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>Request Date</Text>
    <Text style={{ fontSize: 16, color: "#000000", }}>{lastRequest.date.toDate().toLocaleString('en-DE')}</Text>
    <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>Car Type</Text>
    <Text style={{ fontSize: 16, color: "#000000", }}>{lastRequest.carType}</Text>
    <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>Condition</Text>
    <Text style={{ fontSize: 16, color: "#000000", }}>{lastRequest.carCondition}</Text>
    <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>Request Status</Text>
    <Text style={{ fontSize: 16, color: "#000000", }}>{lastRequest.status}</Text>
    </View>}
    
  </ScrollView>)
}
