import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import UserListScreen from '../screens/UserListScreen';
import UserDetailScreen from '../screens/UserDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#76166C', // Vibrant header background color
          },
          headerTintColor: '#fff', // Color for header back button and title text
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen 
          name="UserList" 
          component={UserListScreen} 
          options={{ title: 'Users' }} 
        />
        <Stack.Screen 
          name="UserDetailScreen" 
          component={UserDetailScreen} 
          options={{ title: 'User Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
