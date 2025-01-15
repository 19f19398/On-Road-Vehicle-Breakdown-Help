import React from 'react';
import {Alert, BackHandler, Image, ScrollView, Text, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';

export default function Dashboard({route, navigation}) {
  const [userDetails, setUserDetails] = React.useState(null);
  const {user} = route.params;

  const backAction = () => {
    if (navigation.isFocused()) {
      Alert.alert("Exit", "Are you sure you want to Exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    }
  };
  
  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  React.useEffect(() => {
    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(snapshot => {
          setUserDetails(snapshot.data());
        })
        .catch(err => {
          //
        });
    }
  }, []);
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#ffffff', padding: 15}}>
    <Image
      source={require('./images/logo.png')}
      style={{width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center'}}
    />
      <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold', padding: 15, margin: 3, textAlign: 'center' }}>Hello, {userDetails && userDetails.name}</Text>
      <TouchableOpacity
        style={{
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#cccccc',
          margin: 5,
        }}
        onPress={() => navigation.navigate("Requests List")}
        >
        <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
          Breakdown Requests
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#cccccc',
          margin: 5,
        }}
        onPress={() => navigation.navigate("Membership List")}
        >
        <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
          Membership Requests
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#cccccc',
          margin: 5,
        }}
        onPress={() => navigation.navigate("Merchants List")}
        >
        <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
          Merchants List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#cccccc',
          margin: 5,
        }}
        onPress={() => navigation.navigate("Drivers")}
        >
        <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
          Drivers List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#cccccc',
          margin: 5,
        }}
        onPress={() => {
          auth()
          .signOut()
          .then(() => {
            RNRestart.restart();
          })
          .catch(() => {
            RNRestart.restart();
          })
        }}
        >
        <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
