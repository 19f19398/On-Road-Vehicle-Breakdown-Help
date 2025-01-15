import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleLogin() {

    if(email == "" || password == ""){
      ToastAndroid.show('Please enter your email and password..', ToastAndroid.SHORT);

      return false;
    }  

    auth()
    .signInWithEmailAndPassword(email, password)
    .then(userDetails => {
      firestore()
      .collection("users")
      .doc(userDetails.user.uid)
      .get()
      .then(res => {
        if(res.data()){
          if(res.data().enable){
            RNRestart.restart();
            //navigation.navigate("Startup")
          } else {
            auth().signOut();
            ToastAndroid.show(
              'This account is deactivated.',
              ToastAndroid.SHORT,);
          }
        } else {
          auth().signOut();
          ToastAndroid.show(
            'Error while signing, try again...',
            ToastAndroid.SHORT,);
          }
      })
      .catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      ToastAndroid.show('Worng email or password..', ToastAndroid.SHORT);
    })
  }
  
  return (
    <ScrollView style={{backgroundColor: '#ffc500', padding: 15}}>
      <Image
        source={require('./images/logo.png')}
        style={{
          width: 200,
          height: 200,
          resizeMode: 'contain',
          alignSelf: 'center',
        }}
      />
      <Text
        style={{
          color: '#000000',
          fontSize: 24,
          fontWeight: 'bold',
          padding: 15,
          textAlign: 'center',
        }}>
        Login to your account
      </Text>
      <Text style={{color: '#000000', margin: 15}}>E-mail</Text>
      <TextInput
        style={{
          borderRadius: 15,
          borderWidth: 1,
          borderColor: '#cccccc',
          margin: 5,
          padding: 15,
          color: '#000000',
          backgroundColor: '#ffffff',
        }}
        onChangeText={setEmail}
        value={email}
      />
      <Text style={{color: '#000000', margin: 15}}>Password</Text>
      <TextInput
        style={{
          borderRadius: 15,
          borderWidth: 1,
          borderColor: '#cccccc',
          margin: 5,
          padding: 15,
          color: '#000000',
          backgroundColor: '#ffffff',
        }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <TouchableOpacity
          style={{
            width: '45%',
            backgroundColor: '#000000',
            padding: 15,
            margin: 3,
            borderRadius: 15,
          }}
          onPress={handleLogin}>
          <Text style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '45%',
            backgroundColor: '#000000',
            padding: 15,
            margin: 3,
            borderRadius: 15,
          }}
          onPress={() => navigation.navigate('Register')}>
          <Text style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
