import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

export default function InboxScreen({navigation}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const app = getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const currentUser = auth.currentUser;

  const generateChatId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const usersRef = collection(firestore, 'users');
      const unsubscribe = onSnapshot(
        usersRef,
        snapshot => {
          if (!snapshot?.docs) {
            console.error('Snapshot is null:', snapshot);
            setUsers([]);
            setLoading(false);
            return;
          }

          const fetchedUsers = snapshot.docs
            .map(doc => ({id: doc.id, ...doc.data()}))
            .filter(user => user.id !== currentUser.uid);

          setUsers(fetchedUsers);
          setLoading(false);
        },
        error => {
          console.error('Error fetching users:', error);
          setUsers([]);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    }, [currentUser?.uid]),
  );

  const handleChat = async selectedUser => {
    const chatId = generateChatId(currentUser.uid, selectedUser.id);

    const chatRef = doc(firestore, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [currentUser.uid, selectedUser.id],
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastMessageTime: null,
      });
    }

    navigation.navigate('Chat', {chatRoomId: chatId});
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0b81ff" />
        </View>
      )}

      {!loading && users.length === 0 && <Text>No users found.</Text>}

      {!loading && users.length > 0 && (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => handleChat(item)}>
              <View style={styles.userInfo}>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f9f9f9'},
  title: {fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#222'},
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
