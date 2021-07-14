/* eslint-disable react-native/no-inline-styles */
//creator hungpv@hblab.vn
//import liraries
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
const {width, height} = Dimensions.get('screen');
import {useFocusEffect} from '@react-navigation/native';

const API_KEY = '563492ad6f91700001000001866173dfeba249b9a014ff72f00495b5';
const API_URL =
  'https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20';
const ITEM_SIZE = 70;
const SPACING = 10;

const fetchImagesFromPexels = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: API_KEY,
    },
  });

  const {photos} = await data.json();
  return photos;
};

// create a component
const GalleryScreen = () => {
  const [images, setImages] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchImages = async () => {
      const photos = await fetchImagesFromPexels();
      setImages(photos);
    };

    fetchImages();
  }, []);

  const topRef = React.useRef();
  const bottomRef = React.useRef();

  if (images === null) {
    return null;
  }

  const scrollToPosition = index => {
    setActiveIndex(index);

    topRef?.current?.scrollToOffset({
      offset: index * width,
      Animated: true,
    });

    if ((ITEM_SIZE + SPACING) * index > width / 2) {
      bottomRef?.current?.scrollToOffset({
        offset: index * (SPACING + ITEM_SIZE) - width / 2 + ITEM_SIZE / 2,
        Animated: true,
      });
    } else {
      bottomRef?.current?.scrollToOffset({
        offset: 0,
        Animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={topRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={ev => {
          scrollToPosition(Math.floor(ev.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({item}) => {
          return (
            <View style={{width, height}}>
              <Image
                source={{uri: item.src.portrait}}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
          );
        }}
      />

      <FlatList
        ref={bottomRef}
        style={{position: 'absolute', bottom: SPACING}}
        contentContainerStyle={{padding: SPACING}}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity onPress={() => scrollToPosition(index)}>
              <Image
                source={{uri: item.src.portrait}}
                style={{
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  marginRight: SPACING,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? 'white' : 'transparent',
                  borderRadius: SPACING,
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default GalleryScreen;
