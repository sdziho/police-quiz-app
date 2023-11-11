/* eslint-disable max-len */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Linking,
  Platform,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Button, List, Text, useTheme} from 'react-native-paper';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import OverviewModal from '../../CommonComponents/OverviewModal';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {getQuestions} from '../../Questions/questionsSlice';
import {getAds} from '../../Questions/adsSlice';
import HyperlinkedText from 'react-native-hyperlinked-text';
import LinearGradient from 'react-native-linear-gradient';

function CategoriesList({
  filteredSubcategories,
  hasButtons,
  isTestSelected = false,
  selectedCategory,
}) {
  const user = useSelector(state => state.user.data);
  const {isPremium, id, paymentDetails} = user ?? {};
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {colors} = useTheme();

  const [selectedButton, setSelectedButton] = useState(
    hasButtons ? 'Za policajca' : null,
  );
  const [selectedTestNumber, setSelectedTestNumber] = useState(30);
  const onPress = useCallback(
    item => {
      const params = {
        categoryId: selectedCategory.id,
        subcategoryId: isTestSelected ? 'TEST' : item,
        ...(selectedButton === 'Za inspoktera' && {isForInspector: true}),
        ...(selectedButton === 'Za policajca' && {isForPoliceman: true}),
        ...(isTestSelected && {numberOfQuestions: selectedTestNumber}),
        isPremium,
        paymentDetails,
      };

      dispatch(getQuestions(params));
      dispatch(getAds());
      navigation.navigate('Questions');
    },
    [dispatch],
  );
  const handleButtonPress = buttonName => {
    setSelectedButton(buttonName);
  };

  return (
    <>
      {hasButtons && (
        <View style={buttonStyles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => handleButtonPress('Za policajca')}
            style={[
              buttonStyles.button,
              styles.shadowBox,
              {
                backgroundColor:
                  selectedButton === 'Za policajca' ? colors.primary : 'white',
              },
            ]}>
            <Text
              style={[
                buttonStyles.buttonText,
                {
                  color: selectedButton === 'Za policajca' ? 'white' : 'black',
                },
              ]}>
              Za policajca
            </Text>
            {selectedButton === 'Za policajca' && (
              <Ionicons
                name="checkmark-sharp"
                size={20}
                color={colors.accent}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonPress('Za inspektora')}
            style={[
              buttonStyles.button,
              styles.shadowBox,
              {
                backgroundColor:
                  selectedButton === 'Za inspektora' ? colors.primary : 'white',
              },
            ]}>
            <Text
              style={[
                buttonStyles.buttonText,
                {
                  color: selectedButton === 'Za inspektora' ? 'white' : 'black',
                },
              ]}>
              Za inspektora
            </Text>

            {selectedButton === 'Za inspektora' && (
              <Ionicons
                name="checkmark-sharp"
                size={20}
                color={colors.accent}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
      {!isTestSelected && <Text>Potkategorije: </Text>}
      {isTestSelected && (
        <View>
          <Text>Broj pitanja: </Text>
          <View style={[buttonStyles.circleWrapper]}>
            <TouchableOpacity
              style={[
                styles.shadowBox,
                buttonStyles.circle,
                {
                  backgroundColor:
                    selectedTestNumber === 20 ? colors.primary : 'white',
                },
              ]}
              onPress={() => setSelectedTestNumber(20)}>
              <Text
                style={[
                  buttonStyles.circleText,
                  {
                    color: selectedTestNumber === 20 ? 'white' : 'black',
                  },
                ]}>
                20
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.shadowBox,
                buttonStyles.circle,
                {
                  backgroundColor:
                    selectedTestNumber === 30 ? colors.primary : 'white',
                },
              ]}
              onPress={() => setSelectedTestNumber(30)}>
              <Text
                style={[
                  buttonStyles.circleText,
                  {
                    color: selectedTestNumber === 30 ? 'white' : 'black',
                  },
                ]}>
                30
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.shadowBox,
                buttonStyles.circle,
                {
                  backgroundColor:
                    selectedTestNumber === 50 ? colors.primary : 'white',
                },
              ]}
              onPress={() => setSelectedTestNumber(50)}>
              <Text
                style={[
                  buttonStyles.circleText,
                  {
                    color: selectedTestNumber === 50 ? 'white' : 'black',
                  },
                ]}>
                50
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!isTestSelected &&
        filteredSubcategories?.map(subcategory => (
          <TouchableOpacity
            style={[styles.categories, styles.shadowBox]}
            onPress={() => onPress(subcategory.id)}>
            <View key={subcategory.id} style={styles.flexRow}>
              <Text>{subcategory.name}</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={20}
                color={colors.darkerShade}
              />
            </View>
          </TouchableOpacity>
        ))}
      {isTestSelected && (
        <TouchableOpacity
          style={[
            styles.shadowBox,
            buttonStyles.test,
            {
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => onPress('TEST')}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.primary,
              fontSize: 20,
            }}>
            Pokreni test
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

function HomeCard({data, title}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};
  const navigation = useNavigation();
  const colors = useTheme();
  const subctg = useSelector(state => state.subcategories);
  const categoryObject =
    title === 'Kategorije' ||
    title === 'Zakoni' ||
    title === 'Test' ||
    title == 'Državni ispiti';
  const swipableObject =
    title === 'Kategorije' ||
    title === 'Zakoni' ||
    title === 'Aktuelni konkursi' ||
    title === 'Test' ||
    title == 'Državni ispiti';
  useEffect(() => {
    let filteredSubcategories;
    if (categoryObject)
      filteredSubcategories = subctg.data.filter(category =>
        selectedCategory?.subcategories.includes(category.id),
      );
    switch (title) {
      case 'Kategorije':
        setSelectedChild(
          <CategoriesList
            filteredSubcategories={filteredSubcategories}
            selectedCategory={selectedCategory}
            hasButtons={selectedCategory?.hasSubcategory}
          />,
        );
        break;
      case 'Zakoni':
        setSelectedChild(
          <ScrollView>
            <HyperlinkedText>
              {selectedCategory?.law || 'https://www.facebook.com'}
            </HyperlinkedText>
          </ScrollView>,
        );
        break;
      case 'Test':
        setSelectedChild(
          <CategoriesList
            isTestSelected={true}
            selectedCategory={selectedCategory}
            hasButtons={selectedCategory?.hasSubcategory}
          />,
        );
        break;
      case 'Aktuelni konkursi':
        setSelectedChild(
          <View>
            <Text>{selectedCategory?.description}</Text>
            <Text>{selectedCategory?.url}</Text>
          </View>,
        );
        break;
      case 'Video fizičke spreme':
        {
          setSelectedChild(
            <View>
              {data.map(item => {
                return (
                  <TouchableOpacity
                    key={item?.name}
                    style={[styles.shadowBox, styles.action]}
                    onPress={() => {
                      Linking.openURL(item?.link);
                    }}>
                    <View style={styles.flexRow}>
                      <View style={styles.flexRow}>
                        <Text style={[styles.secondaryText, styles.ml]}>
                          {item?.name}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward-sharp"
                        size={20}
                        color={colors.darkerShade}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>,
          );
        }
        break;
      case 'Plan ishrane':
        setSelectedChild(
          <View>
            {data.map(item => {
              return (
                <List.Accordion
                  theme={{colors: {background: 'white'}}}
                  style={[styles.shadowBox, {backgroundColor: 'white'}]}
                  title={item?.day}
                  key={item?.day}
                  left={props => (
                    <List.Icon {...props} icon="calendar-clock" />
                  )}>
                  <Text
                    style={{
                      margin: 10,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    {item?.plan}
                  </Text>
                </List.Accordion>
              );
            })}
          </View>,
        );
        break;
      default:
        setSelectedChild(<Text>NO DATA</Text>);
    }
  }, [subctg, selectedCategory]);

  const handlePressObject = () => {
    if (title === 'Video fizičke spreme' || title === 'Plan ishrane') {
      setModalVisible(true);
    }
    if (title === 'Uplata premium paketa') {
      navigation.navigate('Payment');
    }
  };
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
        {swipableObject && (
          <SwiperFlatList
            data={data}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[styles.child, styles.shadowBox]}
                onPress={() => {
                  setSelectedCategory(item);
                  setModalVisible(true);
                }}>
                <ImageBackground
                  source={{uri: item.imageURL ?? image.uri}}
                  style={styles.backgroundImage}>
                  <Text style={styles.insideSwiper}>{item.name}</Text>
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
                    style={styles.gradientOverlay}
                  />
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        )}
        {!swipableObject && (
          <TouchableOpacity
            style={[styles.oneElement, styles.shadowBox]}
            onPress={() => handlePressObject()}>
            <ImageBackground source={image} style={styles.backgroundImage}>
              <Text style={styles.insideSwiper}>{title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      </View>
      <OverviewModal
        title={title}
        subtitle={selectedCategory?.name}
        headerImage={selectedCategory?.imageURL}
        imageVisible={true}
        isVisible={modalVisible}
        hideModal={() => setModalVisible(false)}
        children={selectedChild}
      />
    </View>
  );
}
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  //box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  container: {
    height: 250,
    flex: 1,
    backgroundColor: 'white',
  },
  child: {
    width: width * 0.6,
    justifyContent: 'center',
  },
  oneElement: {
    width: width * 0.95,
    justifyContent: 'center',
    height: 200,
  },
  action: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust the height of the darkened area as needed
  },
  accordion: {
    backgroundColor: 'white',
  },
  insideSwiper: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    fontSize: 20,
    color: 'white',
    zIndex: 100,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 10,
  },
  shadowBox: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categories: {
    padding: 20,
    display: 'flex',
    width: width * 0.8,
  },
});
const buttonStyles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    marginTop: -10,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    rowGap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    margin: 10,
  },
  buttonText: {
    marginHorizontal: 3,
    color: 'white',
    textAlign: 'center',
  },
  circleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    fontSize: 25,
    width: 40,
    height: 40,
  },
  circleText: {
    fontSize: 18,
    textAlign: 'center',
  },
  test: {
    marginLeft: 70,
    marginRight: 70,
    paddingVertical: 10,
  },
});
export default HomeCard;
