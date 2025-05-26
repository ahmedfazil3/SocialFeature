import React, {useEffect, useState, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getAuth} from '@react-native-firebase/auth';
import {getMessaging, onMessage} from '@react-native-firebase/messaging';
import {ActivityIndicator, Alert, View} from 'react-native';

import useIsAppActive from './hooks/useIsAppActive';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import InboxScreen from './screens/InboxScreen';
import ChatScreen from './screens/ChatScreen';
import ReelsScreen from './screens/ReelsScreen';
import NotificationScreen from './screens/NotificationScreen';

import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const navigationRef = useRef(null);
  const isNavigationReady = useRef(false);

  const authInstance = getAuth();
  const messagingInstance = getMessaging();

  const isAppActive = useIsAppActive();

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onMessage(messagingInstance, remoteMessage => {
      if (isAppActive && isNavigationReady.current && remoteMessage) {
        Alert.alert(
          remoteMessage.notification?.title || 'New Notification',
          remoteMessage.notification?.body || 'You have a new message',
          [
            {
              text: 'View',
              onPress: () => {
                navigationRef.current?.navigate('NotificationScreen', {
                  data: remoteMessage.data,
                });
              },
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
      }
    });

    return unsubscribe;
  }, [messagingInstance, isAppActive]);

  if (initializing) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isNavigationReady.current = true;
        }}>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Inbox" component={InboxScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen
                name="Reels"
                component={ReelsScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
