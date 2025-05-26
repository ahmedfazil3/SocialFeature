import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NotificationScreen = ({route}) => {
  const {data} = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Details</Text>
      <Text>Message: {data?.message}</Text>
      <Text>Time: {data?.time}</Text>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  title: {fontSize: 24, marginBottom: 10},
});
