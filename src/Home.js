import * as React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ToastAndroid,
  BackHandler,
  Alert
} from 'react-native';
// leaflet map
import {
  AnimationType,
  INFINITE_ANIMATION_ITERATIONS,
  LeafletView,
} from 'react-native-leaflet-view';
import Geolocation from '@react-native-community/geolocation';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import firestore, {serverTimestamp} from '@react-native-firebase/firestore';

export default function HomeScreen({route, navigation}) {
  const [carType, setCartType] = React.useState('');
  const [carCondition, setCarCondition] = React.useState('');
  const [date, setDate] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [coordinate, setCoordinate] = React.useState({
    lat: 23.597866,
    lng: 58.4525362,
  });

  const {user} = route.params;

  const carBrands = [
    'Toyota',
    'Ford',
    'Honda',
    'Chevrolet',
    'Nissan',
    'BMW',
    'Mercedes-Benz',
    'Volkswagen',
    'Audi',
    'Hyundai',
    'Kia',
    'Subaru',
    'Mazda',
    'Lexus',
    'Porsche',
    'Jaguar',
    'Land Rover',
    'Tesla',
    'Volvo',
    'Fiat',
    'Other',
  ];

  React.useEffect(() => {
    const watchID = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCoordinate({lat: latitude, lng: longitude});
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );
    return () => Geolocation.clearWatch(watchID);
  }, []);

  const selectTime = () => {
    DateTimePickerAndroid.open({
      value: date ? date : new Date(),
      onChange: (event, selectedDate) => {
        setDate(selectedDate);
      },
      mode: 'time',
      is24Hour: true,
    });
  };

  const handleBook = () => {
    if (carType == '') {
      ToastAndroid.show('Please select car type..', ToastAndroid.SHORT);

      return false;
    }

    if (carCondition == '') {
      ToastAndroid.show(
        'Please write the car condition first..',
        ToastAndroid.SHORT,
      );
      return false;
    }

    firestore()
      .collection('requests')
      .add({
        date: date ? date : new Date(),
        user: user.uid,
        position: coordinate,
        carCondition: carCondition,
        carType: carType,
        timestamp: serverTimestamp(),
        merchant: 'none',
        status: 'In Progress'
      })
      .then(res => {
        setCartType("");
        setCarCondition("");
        setDate(null);
        navigation.navigate('Thank You');
      })
      .catch(err => {
        ToastAndroid.show(
          'There was some error while sending you request, try again...',
          ToastAndroid.SHORT,
        );
      });
  };

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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        margin: 0,
        overflow: 'hidden',
      }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 35,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              width: '60%',
            }}>
            <FlatList
              style={{height: 300, flexGrow: 0, width: '100%'}}
              data={carBrands}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    borderColor: '#ccc',
                    borderBottomColor: '#cccccc',
                    borderBottomWidth: 1,
                  }}
                  onPress={() => {
                    setCartType(item);
                    setModalVisible(false);
                  }}>
                  <Text
                    style={{
                      marginBottom: 15,
                      textAlign: 'center',
                      color: '#000',
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                borderRadius: 20,
                padding: 10,
                elevation: 2,
              }}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text
                style={{
                  color: '#000000',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={{
          padding: 15,
          borderRadius: 15,
          position: 'absolute',
          zIndex: 1,
          top: 3,
          right: 1,
          margin: 5,
        }}
        onPress={() => navigation.toggleDrawer()}>
        <Image
          source={require('./images/menuicon.png')}
          style={{width: 20, height: 20, padding: 5}}
        />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 15,
          borderRadius: 15,
          position: 'absolute',
          zIndex: 1,
          bottom: 3,
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 5,
            marginVertical: 15,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
            }}
            onPress={selectTime}>
            <Image
              source={require('./images/caretdown.png')}
              style={{width: 20, height: 20, marginHorizontal: 15}}
            />
            <Text>{date ? date.toLocaleTimeString() : 'Now'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#cccccc',
              padding: 3,
              paddingHorizontal: 15,
              borderRadius: 15,
            }}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text>Car Type: {carType}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={{
            borderRadius: 15,
            borderWidth: 1,
            borderColor: '#cccccc',
            margin: 5,
            marginVertical: 15,
            padding: 15,
          }}
          placeholder="Car condition description"
          onChangeText={setCarCondition}
          value={carCondition}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#ffc500',
            padding: 15,
            borderRadius: 15,
          }}
          onPress={handleBook}>
          <Text style={{fontSize: 16, color: '#000000', textAlign: 'center'}}>
            Send Request
          </Text>
        </TouchableOpacity>
      </View>

      {coordinate && <LeafletView
        mapMarkers={[
          {
            position: coordinate,
            icon: '📍',
            size: [32, 32],
          },
        ]}
        mapCenterPosition={coordinate}
        doDebug={false}
        zoom={14}
        onError={err => {
          console.log(err);
        }}
        zoomControl={false}
      />}
    </View>
  );
}
