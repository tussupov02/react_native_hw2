import { LogBox, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const AppNavigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home"
          screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home' options={{headerShow: false}} component={HomeScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation

const styles = StyleSheet.create({
   
})