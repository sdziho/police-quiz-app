/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */

import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import {List, Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {getCategories} from '../categoriesSlice';
import {getSubcategories} from '../subcategoriesSlice';
import {getSettings} from '../../Settings/settingsSlice';
import {STATUS_TYPES} from '../../utils/constants';
import SubcategoryItem from './SubcategoryItem';
import NoData from '../../CommonComponents/NoData';

const {height} = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;
function CategoryItem({item, notificationModal}) {
  const {name, hasSubcategory, id, subcategories, law} = item ?? {};

  let subcategoryData = subcategories;
  if (!subcategories) subcategoryData = [];
  const notifications = useSelector(state => state.notifications);
  const dispatch = useDispatch();

  const {isPremium, paymentDetails} =
    useSelector(state => state.user.data) ?? {};
  const offset = useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: offset}}}],
    {useNativeDriver: false},
  );
  const keyExtractor = useCallback(item => item.id, []);
  const [expanded, setExpanded] = useState(false);
  const subctg = useSelector(state => state.subcategories);
  const isLoading = subctg.status === STATUS_TYPES.PENDING;
  const onRefresh = useCallback(() => {
    dispatch(getCategories());
    dispatch(getSubcategories());
    dispatch(getSettings());
  }, [dispatch]);
  const handlePress = useCallback(() => {
    setExpanded(prevExpanded => {
      const newExpanded = !prevExpanded;
      notifications.data?.forEach((item, index) => {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        item.category.forEach(element => {
          if (
            element === id &&
            item.startingAt._seconds < nowInSeconds &&
            item.endingAt._seconds > nowInSeconds
          ) {
            if (newExpanded) {
              notificationModal(item.message);
            }
          }
        });
      });

      return newExpanded;
    });
  }, [id, notifications.data, notificationModal]);

  const renderItem = useCallback(({item}) => {
    return (
      <SubcategoryItem
        item={item}
        hasSubcategory={hasSubcategory}
        categoryId={id}
        law={law}
      />
    );
  }, []);
  const dataList = [...subcategoryData];
  dataList.push('TEST');
  if (law && law != '') dataList.push('Zakoni');

  return (
    <>
      <List.Accordion
        title={name}
        left={props => <List.Icon {...props} icon="record" />}
        right={props => {
          let showPremium = false;
          if (isPremium && paymentDetails.categories.includes(id))
            showPremium = true;
          return (
            <View style={styles.main}>
              {showPremium && (
                <View style={styles.premium}>
                  <List.Icon {...props} icon={'diamond-stone'} />
                  <Text style={styles.premiumText}>PREMIUM</Text>
                  <Text style={styles.premiumSubtext}>DOSTUPAN</Text>
                </View>
              )}
              <List.Icon
                {...props}
                icon={props.isExpanded ? 'chevron-down' : 'chevron-right'}
              />
            </View>
          );
        }}
        expanded={expanded}
        onPress={handlePress}>
        <FlatList
          onScroll={onScroll}
          stickyHeaderIndices={[0]}
          keyExtractor={keyExtractor}
          data={dataList}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={() => <NoData />}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={isLoading} />
          }
        />
      </List.Accordion>
    </>
  );
}
const styles = StyleSheet.create({
  mainContainer: backgroundColor => ({
    backgroundColor,
    flex: 1,
  }),
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 200,
    width: 200,
  },
  contentContainer: {
    paddingTop: HEADER_HEIGHT,
  },
  testContainer: testColor => ({
    color: testColor,
    fontWeight: 'bold',
  }),
  modal: {
    position: 'relative',
  },
  container: {
    backgroundColor: '#e5f4f9',
    borderRadius: 14,
    padding: 10,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 3,
  },
  message: {
    color: '#005a76',
    paddingRight: 15,
  },
  mainModalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
  premium: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 6,
    marginTop: -15,
  },
  premiumSubtext: {
    fontSize: 6,
  },
});
export default CategoryItem;
