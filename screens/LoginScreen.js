import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const login = async (email, password, navigation) => {
    if (!email.trim() || !password) {
      showToast(
        'error',
        'Validation Error',
        'Email and password are required.',
      );
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      showToast('success', 'Login Successful', 'Welcome back!');
      navigation.replace('Home');
    } catch (err) {
      console.log('LOGIN ERROR:', err);

      let errorMessage = 'Something went wrong.';

      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        errorMessage = 'Incorrect email or password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else {
        errorMessage = err.message || 'Something went wrong.';
      }

      showToast('error', 'Login Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />
      <Button
        title="Login"
        onPress={() => login(email, password, navigation)}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.loginText}>
          Don't have an account? <Text style={styles.link}>Signup</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  loginText: {
    marginTop: 30,
    color: 'blue',
    textAlign: 'center',
  },
  link: {
    fontWeight: 'bold',
  },
});
