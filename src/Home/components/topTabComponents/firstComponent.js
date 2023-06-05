import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export const data = [
    { id: '1', title: 'Element 1' },
    { id: '2', title: 'Element 2' },
    { id: '3', title: 'Element 3' },
    { id: '4', title: 'Element 4' },
    { id: '5', title: 'Element 5' },
    { id: '6', title: 'Element 6' },
    { id: '7', title: 'Element 7' },
    { id: '8', title: 'Element 8' },
    { id: '9', title: 'Element 9' },
    { id: '10', title: 'Element 10' },
    { id: '11', title: 'Element 11' },
    { id: '12', title: 'Element 12' },
    { id: '13', title: 'Element 13' },
    { id: '14', title: 'Element 14' },
    { id: '15a', title: 'Element 15' },
    { id: '15b', title: 'Element 15' },
    { id: '15c', title: 'Element 15' },
    { id: '15d', title: 'Element 15' },
    { id: '15e', title: 'Element 15' },
    { id: '15f', title: 'Element 15' },
    { id: '15g', title: 'Element 15' },
    { id: '15h', title: 'Element 15' },
    { id: '15i', title: 'Element 15' },
  ];

  export const ListItem = ({ title }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{title}</Text>
    </View>
  );

const FirstComponent = ({onScroll}) =>{

    const renderItem =useCallback(({ item }) => (<ListItem title={item.title} />),[])
  
    return (
        <View style={styles.container}>
      <FlatList
        onScroll={onScroll}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
       
      />
      </View>
    );
    
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    itemContainer: {
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      marginBottom: 8,
      padding: 16,
    },
    itemText: {
      fontSize: 16,
      color: '#333',
    },
  });


export default FirstComponent