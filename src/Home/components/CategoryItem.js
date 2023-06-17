/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import {List, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {getAds} from '../../Questions/adsSlice';
import {getQuestions} from '../../Questions/questionsSlice';
import {getCategories} from '../categoriesSlice';
import {getSubcategories} from '../subcategoriesSlice';
import {getSettings} from '../../Settings/settingsSlice';
import {STATUS_TYPES} from '../../utils/constants';
const {height} = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;
function CategoryItem({item}) {
  const {name, hasSubcategory, id, subcategories} = item ?? {};

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {isPremium} = useSelector(state => state.user.data) ?? {};
  const offset = useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: offset}}}],
    {useNativeDriver: false},
  );
  const keyExtractor = useCallback(item => item.id, []);
  const [expanded, setExpanded] = useState(false);
  const [expandedSubcategory, setExpandedsubcategory] = useState(false);
  const subctg = useSelector(state => state.subcategories);
  const subcategoriesData = subctg.data;

  const isLoading = subctg.status === STATUS_TYPES.PENDING;

  const {colors} = useTheme();
  const onRefresh = useCallback(() => {
    dispatch(getCategories());
    dispatch(getSubcategories());
    dispatch(getSettings());
  }, [dispatch]);
  const handlePress = useCallback(() => {
    if (!hasSubcategory) {
      onPress({});
    } else {
      setExpanded(!expanded);
    }
  }, [expanded, hasSubcategory, onPress]);
  const handlePressSub = useCallback(() => {
    if (!hasSubcategory) {
      onPress({});
    } else {
      setExpandedsubcategory(!expandedSubcategory);
    }
  }, [expandedSubcategory, hasSubcategory, onPress]);

  const nameExtractor = useCallback(item => {
    return subcategoriesData.find(element => {
      return element.id == item;
    }).name;
  }, []);
  const onPress = useCallback(
    ({isForInspector, isForPoliceman}) => {
      const params = {
        categoryId: id,
        ...(isForInspector && {isForInspector}),
        ...(isForPoliceman && {isForPoliceman}),
        isPremium,
      };
      dispatch(getQuestions(params));
      dispatch(getAds());
      navigation.navigate('Questions');
    },
    [dispatch, id, isPremium, navigation],
  );
  const renderItem = useCallback(
    ({item}) => {
      return (
        <List.Accordion
          title={nameExtractor(item)}
          left={props => <List.Icon {...props} icon="equal" />}
          style={{backgroundColor: colors.surface}}
          right={props => {
            return (
              <List.Icon
                {...props}
                icon={props.isExpanded ? 'chevron-down' : 'chevron-right'}
              />
            );
          }}
          expanded={expandedSubcategory}
          onPress={handlePressSub}>
          {hasSubcategory ? (
            <View>
              <List.Item
                onPress={() => onPress({isForInspector: true})}
                style={{backgroundColor: colors.surface}}
                title="Za inspektora"
              />
              <List.Item
                onPress={() => onPress({isForPoliceman: true})}
                style={{backgroundColor: colors.surface}}
                title="Za policajca"
              />
            </View>
          ) : null}
        </List.Accordion>
      );
    },
    [expandedSubcategory],
  );

  return (
    <List.Accordion
      title={name}
      left={props => <List.Icon {...props} icon="record" />}
      right={props => (
        <List.Icon
          {...props}
          icon={props.isExpanded ? 'chevron-down' : 'chevron-right'}
        />
      )}
      expanded={expanded}
      onPress={handlePress}>
      <FlatList
        onScroll={onScroll}
        stickyHeaderIndices={[0]}
        keyExtractor={keyExtractor}
        data={subcategories}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={() => <NoData />}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={isLoading} />
        }
      />
    </List.Accordion>
  );
}
const styles = StyleSheet.create({
  mainContainer: backgroundColor => ({
    backgroundColor,
    flex: 1,
  }),
  logoContainer: height => ({
    height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
  }),
  logo: {
    height: 200,
    width: 200,
  },
  contentContainer: {
    paddingTop: HEADER_HEIGHT,
  },
});
export default CategoryItem;
