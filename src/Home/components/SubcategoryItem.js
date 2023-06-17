/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {List, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {getAds} from '../../Questions/adsSlice';
import {getQuestions} from '../../Questions/questionsSlice';

function SubcategoryItem(item) {
  console.log(item);
  const {isPoliceman, isInspector} = item ?? {};
  const {name, hasSubcategory, id} = item.item ?? {};
  const subcategoriesData = useSelector(state => state.subcategories.data);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {isPremium} = useSelector(state => state.user.data) ?? {};

  const [expanded, setExpanded] = useState(false);

  const {colors} = useTheme();

  const handlePress = useCallback(() => {
    if (!hasSubcategory) {
      onPress({});
    } else {
      setExpanded(!expanded);
    }
  }, [expanded, hasSubcategory, onPress]);
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

  return (
    <List.Accordion
      title={nameExtractor(item)}
      left={props => <List.Icon {...props} icon="record" />}
      right={props => (
        <List.Icon
          {...props}
          icon={props.isExpanded ? 'chevron-down' : 'chevron-right'}
        />
      )}
      expanded={expanded}
      onPress={handlePress}>
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
}

export default SubcategoryItem;
