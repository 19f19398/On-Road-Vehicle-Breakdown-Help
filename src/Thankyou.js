import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Thankyou({ navigation }) {
  return (
    <View
      style={{
        backgroundColor: '#ffc500',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25
      }}>
      <Image
        source={require('./images/logo.png')}
        style={{width: 200, height: 200, resizeMode: 'contain'}}
      />
      <Text style={{textAlign: 'center', fontSize: 24, color: '#000000', fontWeight: 'bold'}}>
        Thank You!
      </Text>
      <Text style={{textAlign: 'center', fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
        We've recived you request and we'll be in touch with you as soon as posible.
      </Text>
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
      onPress={() => navigation.navigate("Home")}>
      <Text style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>
        Home
      </Text>
    </TouchableOpacity>
    </View>)
}
