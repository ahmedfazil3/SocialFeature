import React, { useRef, useState } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import { useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const reels = [
  {
    id: '1',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 10,
  },
  {
    id: '2',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    likes: 20,
  },
];

export default function ReelsScreen() {
  const flatListRef = useRef(null);
  const [likeStates, setLikeStates] = useState(
    reels.map((item) => ({ liked: false, count: item.likes }))
  );
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(true);

  // Handle screen focus and blur
  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false); // Pauses video when screen unfocuses
    }, [])
  );

  const onLikePress = (index) => {
    setLikeStates((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              liked: !item.liked,
              count: item.liked ? item.count - 1 : item.count + 1,
            }
          : item
      )
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item.videoUrl }}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={index !== currentVisibleIndex || !isFocused}
      />
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => onLikePress(index)}
        >
          <Image
            source={
              likeStates[index]?.liked
                ? require('../assets/heartfilled.png')
                : require('../assets/heartoutline.png')
            }
            style={styles.heartIcon}
          />
          <Text style={styles.likeText}>{likeStates[index]?.count}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleIndex(viewableItems[0].index);
    }
  });

  return (
    <FlatList
      ref={flatListRef}
      data={reels}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
    />
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    height,
    width,
    backgroundColor: 'black',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  likeButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heartIcon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  likeText: {
    color: 'white',
    marginTop: 5,
    fontWeight: 'bold',
  },
});
