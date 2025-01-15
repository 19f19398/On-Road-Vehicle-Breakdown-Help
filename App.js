// In App.js in a new project
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';

import HomeScreen from './src/Home';
import ProfileScreen from './src/ProfileScreen';
import AboutScreen from './src/AboutScreen';
import LoginScreen from './src/Login';
import RegisterScreen from './src/Register';
import StartupScreen from './src/Startup';
import Thankyou from './src/Thankyou';
import Breakdown from './src/Breakdown';
import Merchants from './src/Merchants';
import Dashboard from './src/Dashboard';
import DriversList from './src/DriversList';
import MerchantsList from './src/MerchantsList';
import RequestsList from './src/RequestsList';
import RequestDetails from './src/RequestDetails';
import MembershipLists from './src/MembershipLists';
import Membership from './src/Membership';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function UserScreens({ route, navigation }) {
  const { user, setUser } = route.params;
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="Logout" onPress={() => {
          auth()
          .signOut()
          .then(err => {
            RNRestart.restart();
            //navigation.navigate('Login');
          })
          .catch(err => {
            //
          })
        }} />
      </DrawerContentScrollView>
    );
  }
  return (
    <Drawer.Navigator drawerPosition="right" drawerContent={props => <CustomDrawerContent {...props} />} options={{ drawerActiveBackgroundColor: "#ffc500" }}>
      <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false, title: "Home" }} initialParams={{ user: user }} />
      <Drawer.Screen name="Profile" options={{ title: "My Account" }} component={ProfileScreen} initialParams={{ user: user }} />
      <Drawer.Screen name="Membership" component={Membership} initialParams={{ user: user }} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
}

function App() {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged((userDetails) => {
      if(userDetails){
        setUser(userDetails)
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Startup" component={StartupScreen} options={{ headerShown: false, }} initialParams={{ user: user }} />
        <Stack.Screen name="Home" component={UserScreens} options={{ headerShown: false, }} initialParams={{ user: user }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, }} initialParams={{ user: user, setUser: setUser }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, }} initialParams={{ user: user }} />
        <Stack.Screen name="Thank You" component={Thankyou} options={{ headerShown: false, }} initialParams={{ user: user }} />
        <Stack.Screen name="Breakdown" component={Breakdown} options={{ headerShown: false, }} initialParams={{ user: user }} />
        <Stack.Screen name="Merchants" component={Merchants} options={{ headerShown: false, }} initialParams={{ user: user }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false, }} initialParams={{ user: user }} />
        <Stack.Screen name="Drivers" component={DriversList} options={{ headerShown: true, title: "Drivers List" }} initialParams={{ user: user }} />
        <Stack.Screen name="Merchants List" component={MerchantsList} options={{ headerShown: true, }} initialParams={{ user: user }} />
        <Stack.Screen name="Requests List" component={RequestsList} options={{ headerShown: true, }} initialParams={{ user: user }} />
        <Stack.Screen name="Request Details" component={RequestDetails} options={{ headerShown: true, }} initialParams={{ user: user }} />
        <Stack.Screen name="Membership List" component={MembershipLists} options={{ headerShown: true, title: "Membership Requests List" }} initialParams={{ user: user }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;