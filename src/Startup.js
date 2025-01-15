import React from 'react';
import {View, Image, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function StartupScreen({route, navigation}) {
  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userDetails => {
      if (userDetails) {        
        firestore()
          .collection('users')
          .doc(userDetails.uid)
          .get()
          .then(res => {
            if (res.data()) {
              switch (res.data().userType) {
                case 'user':
                  navigation.navigate('Home');
                break;

                case 'driver':
                  navigation.navigate('Breakdown');
                break;

                case 'merchant':
                  navigation.navigate('Merchants');
                break;

                case 'admin':
                  navigation.navigate('Dashboard');
                break;

                default:
                  navigation.navigate('Home');
                break;
              }
            } else {
              navigation.navigate('Login');
            }
          })
          .catch(err => {
            navigation.navigate('Login');
          });
      } else {
        navigation.navigate('Login');
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#ffc500',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('./images/logo.png')}
        style={{width: 200, height: 200, resizeMode: 'contain'}}
      />
      <Text
        style={{
          textAlign: 'center',
          fontSize: 24,
          color: '#000000',
          fontWeight: 'bold',
        }}>
        Breakdown Oman
      </Text>
    </View>
  );
}
