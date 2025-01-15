import React from 'react';
import {Image, ScrollView, Text} from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={{backgroundColor: '#ffffff', padding: 15}}>
      <Image
        source={require('./images/logo.png')}
        style={{width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center'}}
      />
      <Text
        style={{
          fontSize: 22,
          color: '#000000',
          fontWeight: 'bold',
          margin: 5,
        }}>
        Breakdown Oman
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#000000',
          margin: 5,
        }}>
        Introducing our straightforward breakdown service app, designed to
        assist you during vehicle emergencies with ease. With just a few taps,
        you can request help for towing, tire changes, or other roadside issues.
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#000000',
          margin: 5,
        }}>
        The app connects you to nearby service providers, ensuring prompt
        assistance when you need it most. You can quickly share your location
        and issue details, making it easier for help to reach you. Whether
        you're on a long drive or in your local area, our breakdown service app
        provides reliable support to get you back on the road in no time.
      </Text>
    </ScrollView>
  );
}
