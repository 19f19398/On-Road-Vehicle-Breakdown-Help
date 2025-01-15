import React from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Linking,
  ScrollView,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore, {
  serverTimestamp,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';

export default function Breakdown({route, navigation}) {
  const [name, setName] = React.useState('');
  const [lastRequest, setLastRequest] = React.useState(null);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const {user} = route.params;

  const backAction = () => {
    if (navigation.isFocused()) {
      Alert.alert('Exit', 'Are you sure you want to Exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            handleAvailable(false);
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    }
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  React.useEffect(() => {
    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(snapshot => {
          setName(snapshot.data().name);
          setIsEnabled(snapshot.data().status);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          loadRequest()
        });
    }
  }, [user]);

  function loadRequest() {
    firestore()
      .collection('requests')
      .where('driver', '==', user.uid)
      .where('status', "not-in", ['Done'])
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get()
      .then(res => {
        res.forEach(element => {
          setLastRequest({
            id: element.id,
            ...element.data(),
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  function handleAvailable(status) {
    toggleSwitch(status);
    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        status: status,
        lastUpdate: serverTimestamp(),
      })
      .then(res => {
        ToastAndroid.show(
          'You changed you availability status.',
          ToastAndroid.SHORT,
        );
      })
      .catch(err => {
        ToastAndroid.show(
          'Error while changing status, try again...',
          ToastAndroid.SHORT,
        );
      });
  }

  function handleDone() {
    if (lastRequest) {
      firestore()
        .collection('requests')
        .doc(lastRequest.id)
        .update({
          status: 'Done',
        })
        .then(res => {
          ToastAndroid.show(
            'You changed request status to done.',
            ToastAndroid.SHORT,
          );
          setLastRequest(null);
          loadRequest();
        })
        .catch(err => {
          ToastAndroid.show(
            'Error while changing status, try again...',
            ToastAndroid.SHORT,
          );
        });
    }
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
          fontSize: 25,
          color: '#000000',
          fontWeight: 'bold',
          margin: 15,
        }}>
        Hello, {name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 25,
          padding: 5,
        }}>
        <Text
          style={{
            fontSize: 18,
            color: '#000000',
            fontWeight: 'bold',
          }}>
          Ready for Request?
        </Text>
        <Switch
          trackColor={{false: '#767577', true: 'green'}}
          thumbColor={isEnabled ? 'lime' : '#f4f3f4'}
          onValueChange={handleAvailable}
          value={isEnabled}
          style={{
            //transform: [{scaleX: 3}, {scaleY: 3}],
            alignSelf: 'center',
          }}
        />
      </View>
      <View>
        <Text
          style={{
            color: '#000000',
            fontSize: 18,
            fontWeight: 'bold',
            padding: 5,
          }}>
          Current Job
        </Text>

        {!lastRequest && (
          <Text style={{color: '#000000', textAlign: 'center', fontSize: 16}}>
            There are no current jobs
          </Text>
        )}

        {lastRequest && (
          <View style={{padding: 15}}>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              Request Date
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              {lastRequest.date.toDate().toLocaleString('en-DE')}
            </Text>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              Car Type
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              {lastRequest.carType}
            </Text>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              Condition
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              {lastRequest.carCondition}
            </Text>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              Request Status
            </Text>
            <Text style={{fontSize: 16, color: '#000000'}}>
              {lastRequest.status}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#000000',
                  padding: 15,
                  margin: 3,
                  marginTop: 15,
                  borderRadius: 15,
                  width: '45%',
                }}
                onPress={() =>
                  Linking.openURL(
                    `https://maps.google.com?q=${lastRequest.position.lat},${lastRequest.position.lng}`,
                  )
                }>
                <Text
                  style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>
                  Location
                </Text>
              </TouchableOpacity>
              {lastRequest.position && (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#000000',
                    padding: 15,
                    margin: 3,
                    marginTop: 15,
                    borderRadius: 15,
                    width: '45%',
                    //alignSelf: 'center'
                  }}
                  onPress={handleDone}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#ffffff',
                      textAlign: 'center',
                    }}>
                    Done
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={{
            padding: 5,
            margin: 3,
            marginTop: 25,
            borderRadius: 15,
            //alignSelf: 'center'
          }}
          onPress={() =>{ 
            auth()
            .signOut()
            .then(() => {
              RNRestart.restart();
            })
            .catch(err => {
              RNRestart.restart();
            })
          }}>
          <Text style={{fontSize: 16, color: '#000000', textAlign: 'center'}}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
