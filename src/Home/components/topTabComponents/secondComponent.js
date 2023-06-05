import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { data } from './firstComponent';
import { ListItem } from './firstComponent';


const SecondComponent = ({onScroll}) =>{
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
  




export default SecondComponent