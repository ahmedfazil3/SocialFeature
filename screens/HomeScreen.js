import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getAuth} from '@react-native-firebase/auth';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const authInstance = getAuth();

  const isMounted = useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      isMounted.current = true;

      const user = authInstance.currentUser;
      if (user) {
        setUserEmail(user.email || 'No email');
      }

      return () => {
        isMounted.current = false;
      };
    }, []),
  );

  const logout = async () => {
    try {
      await authInstance.signOut();
      if (isMounted.current) {
        Toast.show({
          type: 'success',
          text1: 'Logout Successful',
          text2: 'You have been logged out successfully.',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      if (isMounted.current) {
        Alert.alert('Logout Failed', error.message);
      }
    }
  };

  const simulatePushNotification = () => {
    Alert.alert('Simulated FCM', 'This is a simulated push notification', [
      {
        text: 'View',
        onPress: () =>
          navigation.navigate('Notifications', {
            data: {
              message: 'This is the message data',
              time: new Date().toISOString(),
            },
          }),
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>
      <Text style={styles.userInfo}>Email: {userEmail}</Text>

      <View style={[styles.buttonContainer, {marginTop: 30}]}>
        <Button title="Inbox" onPress={() => navigation.navigate('Inbox')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Watch Reels"
          onPress={() => navigation.navigate('Reels')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Simulate Notification"
          onPress={simulatePushNotification}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Logout" color="red" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  userInfo: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  buttonContainer: {marginBottom: 16, borderRadius: 8, overflow: 'hidden'},
});
