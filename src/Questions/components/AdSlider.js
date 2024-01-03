import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

const {width} = Dimensions.get('screen');

function AdSlider({data}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef();

  const onScroll = useCallback(event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  }, []);

  const scrollToIndex = index => {
    flatListRef.current.scrollToIndex({
      animated: true,
      index,
    });
    setActiveIndex(index);
  };

  const keyExtractor = useCallback(item => item.id, []);

  const renderItem = useCallback(({item}) => {
    const {imagePermanent, reddirectUrl} = item ?? {};

    const onPress = () => {
      if (!reddirectUrl) return;

      if (Linking.canOpenURL(reddirectUrl)) {
        Linking.openURL(reddirectUrl);
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.itemContainer}>
        <Image
          resizeMode="cover"
          style={styles.itemImage}
          source={{uri: imagePermanent?.src}}
        />
      </TouchableOpacity>
    );
  }, []);

  useEffect(() => {
    if (!data || !data.length) return;
    const intervalId = setInterval(() => {
      if (activeIndex + 1 < data.length) {
        scrollToIndex(activeIndex + 1);
      } else {
        scrollToIndex(0);
        setActiveIndex(0);
      }
    }, 3 * 60 * 1000); // 3min

    return () => clearInterval(intervalId);
  }, [activeIndex, data]);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      pagingEnabled
      style={styles.mainContainer}
      onScroll={onScroll}
    />
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 0,
    flexShrink: 0,
  },
  itemContainer: {
    height: '100%',
    width,
    paddingBottom: 30,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
});

export default AdSlider;
