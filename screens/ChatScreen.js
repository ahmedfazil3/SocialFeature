import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {getAuth} from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

export default function ChatScreen({route}) {
  const {chatRoomId} = route.params;

  const auth = getAuth();
  const firestore = getFirestore();

  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const messagesCollection = collection(
      firestore,
      'chats',
      chatRoomId,
      'messages',
    );
    const messagesQuery = query(
      messagesCollection,
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(messagesQuery, snapshot => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return unsubscribe;
  }, [chatRoomId, firestore]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageData = {
      text: input,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    };

    setInput('');

    try {
      const messagesCollection = collection(
        firestore,
        'chats',
        chatRoomId,
        'messages',
      );
      await addDoc(messagesCollection, messageData);

      const chatDocRef = doc(firestore, 'chats', chatRoomId);
      await setDoc(
        chatDocRef,
        {
          lastMessage: input,
          lastMessageTime: serverTimestamp(),
        },
        {merge: true},
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderItem = ({item}) => {
    const isMe = item.senderId === currentUser.uid;
    return (
      <View
        style={[
          styles.messageBubble,
          {
            alignSelf: isMe ? 'flex-end' : 'flex-start',
            backgroundColor: isMe ? '#dcf8c6' : '#eee',
          },
        ]}>
        <Text>{item.text}</Text>
        <Text>
          {item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : ''}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#0b81ff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageBubble: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
});
