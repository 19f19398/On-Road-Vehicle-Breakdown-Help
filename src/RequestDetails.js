import React from 'react';
import {FlatList, Modal, ScrollView, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function RequestDetails({route, navigation}) {
  const [userDetails, setUserDetails] = React.useState(null);
  const [userType, setUserType] = React.useState(null);
  const [usersList, setUsersList] = React.useState(null)
  const [modalList, setModalList] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const {details} = route.params;

  React.useEffect(() => {
    if(details){
        firestore()
        .collection("users")
        .get()
        .then(snapshots => {
            let snapList = [];
            snapshots.forEach(snapshot => {
                snapList.push({
                    id: snapshot.id,
                    ...snapshot.data()
                });
                if(snapshot.id == details.user){
                    setUserDetails(snapshot.data());
                }
            });
            setUsersList(snapList);
        })
        .catch(err => {
            console.log(err);
        })
    }
  }, [details])

  function handleAssign(assignType) {
    setModalVisible(true);
    setUserType(assignType);
    let tmpUserList = []

    tmpUserList = usersList.filter(item => item.userType == assignType);
    setModalList(tmpUserList)
  }

  function handleAssignUser(user) {
    let payload = null;
    if(userType == 'driver'){
        payload = {
            driver: user
        }
    } else {
        payload = {
            merchant: user
        }
    }

    firestore()
      .collection('requests')
      .doc(details.id)
      .update(payload)
      .then(res => {
        ToastAndroid.show('Request has been assigned.', ToastAndroid.SHORT);
      })
      .catch(err => {
        ToastAndroid.show(
          'Error while changing status, try again...',
          ToastAndroid.SHORT,
        );
      });
    
  }

  return (
    <ScrollView style={{backgroundColor: '#ffffff', padding: 15}}>

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
              data={modalList}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    borderColor: '#ccc',
                    borderBottomColor: '#cccccc',
                    borderBottomWidth: 1,
                  }}
                  onPress={() => {
                    handleAssignUser(item.id)
                    setModalVisible(false);
                  }}>
                  <Text
                    style={{
                      marginBottom: 15,
                      textAlign: 'center',
                      color: '#000',
                    }}>
                    {item.name}
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
      <Text
        style={{
          fontSize: 22,
          color: '#000000',
          fontWeight: 'bold',
          margin: 15,
        }}>
        Request Details:
      </Text>
        {userDetails && <View style={{ padding: 15 }}>
      <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>Name:</Text>
      <Text style={{ fontSize: 16, color: "#000000", }}>{userDetails.name}</Text>  
      <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>Mobile:</Text>
      <Text style={{ fontSize: 16, color: "#000000", }}>{userDetails.mobile}</Text>  
      <Text style={{ fontSize: 18, color: "#000000", fontWeight: 'bold' }}>E-mail:</Text>
      <Text style={{ fontSize: 16, color: "#000000", }}>{userDetails.email}</Text>
    </View>}
      {details && (
        <View style={{padding: 15}}>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            Request Date
          </Text>
          <Text style={{fontSize: 16, color: '#000000'}}>
            {details.date.toDate().toLocaleString('en-DE')}
          </Text>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            Car Type
          </Text>
          <Text style={{fontSize: 16, color: '#000000'}}>
            {details.carType}
          </Text>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            Condition
          </Text>
          <Text style={{fontSize: 16, color: '#000000'}}>
            {details.carCondition}
          </Text>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            Request Status
          </Text>
          <Text style={{fontSize: 16, color: '#000000'}}>{details.status}</Text>
        </View>
      )}

      <Text
        style={{
          fontSize: 22,
          color: '#000000',
          fontWeight: 'bold',
          margin: 15,
        }}>
        Request Merchant:
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#000000',
          margin: 15,
        }}>
      {details && (details.merchant ? "Assigned":"Not assigned")}
      </Text>
    {details && !details.merchant && <TouchableOpacity
      style={{
        width: '25%',
        backgroundColor: '#000000',
        padding: 5,
        margin: 3,
        marginTop: 15,
        borderRadius: 15,
      }}
      onPress={() => handleAssign('merchant')}
      >
      <Text style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>
        Assign
      </Text>
    </TouchableOpacity>}
      

      <Text
        style={{
          fontSize: 22,
          color: '#000000',
          fontWeight: 'bold',
          margin: 15,
        }}>
        Request Driver:
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#000000',
          margin: 15,
        }}>
      {details && (details.driver ? "Assigned":"Not assigned")}
      </Text>
    {details && !details.driver && <TouchableOpacity
      style={{
        width: '25%',
        backgroundColor: '#000000',
        padding: 5,
        margin: 3,
        borderRadius: 15,
      }}
      onPress={() => handleAssign('driver')}
      >
      <Text style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>
        Assign
      </Text>
    </TouchableOpacity>}
    <View style={{paddingBottom: 65}}></View>
    </ScrollView>
  );
}
