/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {List, Text, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {getAds} from '../../Questions/adsSlice';
import {getQuestions} from '../../Questions/questionsSlice';
import {randomIntFromInterval, replaceAll} from '../../utils/helpers';
import Modal from '../../CommonComponents/Modal';
import PaymentModal from './PaymentModal';

function SubcategoryItem(props) {
  const {item, hasSubcategory, categoryId} = props ?? {};
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const user = useSelector(state => state.user.data);
  const {paymentSettings} = useSelector(state => state.settings.data) ?? {};
  const {isPremium, id} = user ?? {};

  const orderNumber = `${replaceAll(id, '-', '')}_${randomIntFromInterval(
    100000,
    999999,
  )}`;
  //const {name, hasSubcategory, id} = item.item ?? {};
  const subcategoriesData = useSelector(state => state.subcategories.data);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState(false);

  const {colors} = useTheme();

  const handlePress = useCallback(() => {
    if (!(!isPremium && item == 'TEST')) {
      if (!hasSubcategory) {
        onPress({});
      } else {
        setExpanded(!expanded);
      }
    } else {
      setIsPaymentModalVisible(true);
    }
  }, [expanded, hasSubcategory, onPress, isPaymentModalVisible]);
  const nameExtractor = useCallback(item => {
    if (item == 'TEST') return item;
    return subcategoriesData.find(element => {
      return element.id == item;
    }).name;
  }, []);
  const onPress = useCallback(
    ({isForInspector, isForPoliceman}) => {
      const params = {
        categoryId: categoryId,
        subcategoryId: item,
        ...(isForInspector && {isForInspector}),
        ...(isForPoliceman && {isForPoliceman}),
        isPremium,
      };

      dispatch(getQuestions(params));
      dispatch(getAds());
      navigation.navigate('Questions');
    },
    [dispatch, categoryId, isPremium, navigation, item],
  );

  return (
    <>
      <List.Accordion
        title={nameExtractor(item)}
        left={props => <List.Icon {...props} icon="equal" />}
        style={{backgroundColor: colors.surface}}
        right={props => {
          let showLock = false;
          if (!isPremium && item == 'TEST') showLock = true;
          return (
            <View style={styles.main}>
              {showLock && (
                <View style={styles.container}>
                  <Text style={styles.message}>PREMIUM</Text>
                </View>
              )}
              <List.Icon
                {...props}
                icon={
                  showLock
                    ? 'lock'
                    : props.isExpanded
                    ? 'chevron-down'
                    : 'chevron-right'
                }
              />
            </View>
          );
        }}
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
      <Modal
        isVisible={isPaymentModalVisible}
        hideModal={() => setIsPaymentModalVisible(false)}>
        <PaymentModal
          orderNumber={orderNumber}
          price={paymentSettings?.price}
          hide={() => setIsPaymentModalVisible(false)}
        />
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ff8551',
    borderRadius: 14,
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    height: 25,
    alignItems: 'center',
  },
  message: {
    color: 'white',
    fontSize: 10,
  },
});
export default SubcategoryItem;
