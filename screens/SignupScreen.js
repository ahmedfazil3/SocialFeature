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
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

export default function SignupScreen({navigation}) {
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

  const handleSignup = async () => {
    if (!email.trim() || !password) {
      showToast('error', 'Validation Error', 'All fields are required.');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCredential.user.uid;

      await firestore().collection('users').doc(uid).set({email});

      showToast('success', 'Registration Successful');
      navigation.replace('Home');
    } catch (err) {
      let errorMessage = 'Something went wrong.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Permission denied to write to Firestore.';
      }

      console.error('Registration Error:', err);
      showToast('error', 'Registration Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Signup" onPress={handleSignup} />

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signupText}>
          Already have an account? <Text style={styles.link}>Login</Text>
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
  signupText: {
    marginTop: 30,
    color: 'blue',
    textAlign: 'center',
  },
  link: {
    fontWeight: 'bold',
  },
});
