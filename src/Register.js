import React from 'react';
import { ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import Auth from '@react-native-firebase/auth';
import firestore, { serverTimestamp } from '@react-native-firebase/firestore';
import RNRestart from 'react-native-restart';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');

  function handleRegister() {
    if(name == "" || mobile == "" || email == "" || password == "" || repeatPassword == ""){
      ToastAndroid.show('Please enter all the required feilds..', ToastAndroid.SHORT);

      return false;
    }  

    if(!email.includes("@")){
      ToastAndroid.show('Please enter a valid E-mail..', ToastAndroid.SHORT);

      return false;
    }

    if(mobile.length < 6){
      ToastAndroid.show('Please enter a valid mobile number..', ToastAndroid.SHORT);

      return false;
    }

    if(password != repeatPassword){
      ToastAndroid.show('Passwords are not matched!', ToastAndroid.SHORT);

      return false;
    }

    Auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userDetails => {
      firestore()
      .collection("users")
      .doc(userDetails.user.uid)
      .set({
        name: name,
        mobile: mobile,
        email: email,
        date: serverTimestamp(),
        userType: "user",
        enable: true,
      })
      .then(res => {
        RNRestart.restart();
      })
      .catch(err => {
        ToastAndroid.show('Error while creating the new user, try again...', ToastAndroid.SHORT);
      })
    })

  }

  return (<ScrollView style={{backgroundColor: '#ffffff', padding: 15}}>
    <Text style={{color: '#000000', margin: 15}}>Name</Text>
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
      onChangeText={setName}
      value={name}
    />
    <Text style={{color: '#000000', margin: 15}}>Mobile</Text>
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
      onChangeText={setMobile}
      value={mobile}
    />
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
    <Text style={{color: '#000000', margin: 15}}>Repeat Password</Text>
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
      onChangeText={setRepeatPassword}
      value={repeatPassword}
      secureTextEntry={true}
    />
    <TouchableOpacity
      style={{
        width: '45%',
        backgroundColor: '#000000',
        padding: 15,
        margin: 3,
        marginTop: 15,
        borderRadius: 15,
        alignSelf: 'center'
      }}
      onPress={handleRegister}>
      <Text style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>
        Register
      </Text>
    </TouchableOpacity>

  </ScrollView>)
}
