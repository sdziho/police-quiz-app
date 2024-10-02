/* eslint-disable max-len */
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import logo from '../../assets/pqLogo.jpg';
import {setSelectedCategory as setSelectedCtg} from '../../Home/categoriesSlice';
import Hyperlink from 'react-native-hyperlink';

function CategoriesList({
  filteredSubcategories,
  hasButtons,
  isTestSelected = false,
  selectedCategory,
  hideModal,
  fizickaSprema = false,
}) {
  const user = useSelector(state => state.user.data);
  const {isPremium, id, paymentDetails} = user ?? {};
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [selectedButton, setSelectedButton] = useState(
    hasButtons ? 'Za policajca' : null,
  );
  const [selectSuperType, setSelectedSuperType] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('choose-category').then(value => {
      if (value && hasButtons) {
        setSelectedButton(value);
      } else {
        setSelectedButton(hasButtons ? 'Za policajca' : null);
      }
    });
  }, [hasButtons]);
  const [selectedTestNumber, setSelectedTestNumber] = useState(30);
  const onPress = (item, superItem = null) => {
    console.log('selektovani', selectedButton);
    const params = {
      categoryId: selectedCategory.id,
      subcategoryId: isTestSelected ? 'TEST' : item,
      ...(superItem && {superSubcategory: superItem}),
      ...(selectedButton === 'Za inspektora' && {isForInspector: true}),
      ...(selectedButton === 'Za policajca' && {isForPoliceman: true}),
      ...(isTestSelected && {numberOfQuestions: selectedTestNumber}),
      isPremium,
      paymentDetails,
    };

    const mySubctg = isTestSelected
      ? 'TEST'
      : filteredSubcategories?.find(subctg => subctg.id == item).name;

    hideModal();
    dispatch(getQuestions(params));
    dispatch(getAds());
    navigation.navigate('Questions', {
      testName: `${selectedCategory.name} - ${mySubctg}`,
      ctg: selectedCategory,
      subctg: isTestSelected
        ? 'TEST'
        : filteredSubcategories?.find(subctg => subctg.id == item),
    });
  };
  const handleButtonPress = buttonName => {
    setSelectedButton(buttonName);
  };

  return (
    <>
      {!fizickaSprema && (
        <>
          {hasButtons && (
            <View style={buttonStyles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => {
                  handleButtonPress('Za policajca');
                  AsyncStorage.setItem('choose-category', 'Za policajca');
                }}
                style={[
                  buttonStyles.button,
                  styles.shadowBox,
                  {
                    backgroundColor:
                      selectedButton === 'Za policajca'
                        ? colors.primary
                        : 'white',
                  },
                ]}>
                <Text
                  style={[
                    buttonStyles.buttonText,
                    {
                      color:
                        selectedButton === 'Za policajca' ? 'white' : 'black',
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
                onPress={() => {
                  handleButtonPress('Za inspektora');
                  AsyncStorage.setItem('choose-category', 'Za inspektora');
                }}
                style={[
                  buttonStyles.button,
                  styles.shadowBox,
                  {
                    backgroundColor:
                      selectedButton === 'Za inspektora'
                        ? colors.primary
                        : 'white',
                  },
                ]}>
                <Text
                  style={[
                    buttonStyles.buttonText,
                    {
                      color:
                        selectedButton === 'Za inspektora' ? 'white' : 'black',
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
          {selectedCategory?.isSuperSubcategory && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  borderRightWidth: 1,
                  borderRightColor: colors.darkerShade,
                  marginLeft: -20,
                  paddingRight: 15,
                  width: 150,
                }}>
                {filteredSubcategories?.map(subcategory => {
                  return (
                    subcategory.isSuperSubcategory && (
                      <TouchableOpacity
                        style={[
                          styles.shadowBox,
                          styles.superTypes(
                            subcategory.id == selectSuperType?.id
                              ? colors.primary
                              : colors.surface,
                          ),
                        ]}
                        onPress={() => setSelectedSuperType(subcategory)}>
                        <Text
                          key={subcategory.id}
                          style={styles.superName(
                            subcategory.id == selectSuperType?.id
                              ? colors.surface
                              : colors.primary,
                          )}>
                          {subcategory.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  );
                })}
              </View>
              {selectSuperType ? (
                <View style={{paddingLeft: 15}}>
                  {filteredSubcategories?.map(subcategory => {
                    const isSubIncluded =
                      selectSuperType?.superSubcategories?.includes(
                        subcategory.id,
                      ) ?? false;
                    return (
                      !subcategory.isSuperSubcategory &&
                      isSubIncluded && (
                        <TouchableOpacity
                          style={[styles.shadowBox]}
                          onPress={() => {
                            onPress(subcategory.id, selectSuperType.id);
                          }}>
                          <View
                            key={subcategory.id}
                            style={[styles.superSubctg, styles.flexRow]}>
                            <Text>{subcategory.name}</Text>
                            <Ionicons
                              name="chevron-forward-sharp"
                              size={20}
                              color={colors.darkerShade}
                            />
                          </View>
                        </TouchableOpacity>
                      )
                    );
                  })}
                </View>
              ) : (
                <View>
                  <Text style={[{padding: 50, fontSize: 18, width: 250}]}>
                    Izaberite potkategoriju
                  </Text>
                </View>
              )}
            </View>
          )}
          {!selectedCategory?.isSuperSubcategory && (
            <>
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
                            selectedTestNumber === 20
                              ? colors.primary
                              : 'white',
                        },
                      ]}
                      onPress={() => setSelectedTestNumber(20)}>
                      <Text
                        style={[
                          buttonStyles.circleText,
                          {
                            color:
                              selectedTestNumber === 20 ? 'white' : 'black',
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
                            selectedTestNumber === 30
                              ? colors.primary
                              : 'white',
                        },
                      ]}
                      onPress={() => setSelectedTestNumber(30)}>
                      <Text
                        style={[
                          buttonStyles.circleText,
                          {
                            color:
                              selectedTestNumber === 30 ? 'white' : 'black',
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
                            selectedTestNumber === 50
                              ? colors.primary
                              : 'white',
                        },
                      ]}
                      onPress={() => setSelectedTestNumber(50)}>
                      <Text
                        style={[
                          buttonStyles.circleText,
                          {
                            color:
                              selectedTestNumber === 50 ? 'white' : 'black',
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
                      <Text style={{width: 0.6 * width}}>
                        {subcategory.name}
                      </Text>
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
          )}
        </>
      )}
      {fizickaSprema && (
        <View>
          {selectedCategory?.fizicka_sprema.map(item => {
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
        </View>
      )}
    </>
  );
}

function HomeCard({data, title, pic, setIsPaymentModalVisible}) {
  const preSelectedCategory = useSelector(
    state => state.categories.selectedCategory,
  );
  const {paymentSettings} = useSelector(state => state.settings.data) ?? {};

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const image = logo;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colors = useTheme();
  const user = useSelector(state => state.user.data);
  const {isPremium} = user ?? {};
  const subctg = useSelector(state => state.subcategories) ?? [];
  const swipableObject =
    title === 'Kategorije' ||
    title === 'Zakoni' ||
    title === 'Aktuelni konkursi' ||
    title === 'Test' ||
    title == 'Državni ispiti' ||
    title == paymentSettings?.videoTitle;
  useEffect(() => {
    let filteredSubcategories;
    filteredSubcategories = subctg?.data?.filter(category =>
      selectedCategory?.subcategories?.includes(category.id),
    );
    switch (title) {
      case 'Kategorije':
        setSelectedChild(
          <CategoriesList
            filteredSubcategories={filteredSubcategories}
            selectedCategory={selectedCategory}
            hasButtons={selectedCategory?.hasSubcategory}
            hideModal={() => setModalVisible(false)}
          />,
        );
        break;
      case 'Državni ispiti':
        setSelectedChild(
          <CategoriesList
            filteredSubcategories={filteredSubcategories}
            selectedCategory={selectedCategory}
            hasButtons={selectedCategory?.hasSubcategory}
            hideModal={() => setModalVisible(false)}
          />,
        );
        break;
      case 'Zakoni':
        setSelectedChild(
          <ScrollView>
            <Text>
              <Hyperlink
                onPress={(url, text) => {
                  Linking.openURL(url);
                  console.log('url', url);
                }}
                linkStyle={{color: '#2980b9'}}>
                <Text>{selectedCategory?.law ?? ''}</Text>
              </Hyperlink>
            </Text>
          </ScrollView>,
        );
        break;
      case 'Test':
        setSelectedChild(
          <CategoriesList
            isTestSelected={true}
            selectedCategory={selectedCategory}
            hasButtons={selectedCategory?.hasSubcategory}
            hideModal={() => setModalVisible(false)}
          />,
        );
        break;
      case 'Aktuelni konkursi':
        setSelectedChild(
          <View>
            <Text>{selectedCategory?.description}</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(selectedCategory?.url)}>
              <Text style={{color: '#2980b9'}}>
                {selectedCategory?.url ?? ''}
              </Text>
            </TouchableOpacity>
          </View>,
        );
        break;
      case 'Pisanje eseja':
        setSelectedChild(
          <ScrollView>
            <Text>{data}</Text>
          </ScrollView>,
        );
        break;
      case 'Treniranje':
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
                        {item?.plan}
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
        break;
      case paymentSettings?.videoTitle:
        {
          setSelectedChild(
            <CategoriesList
              filteredSubcategories={filteredSubcategories}
              selectedCategory={selectedCategory}
              hasButtons={selectedCategory?.hasSubcategory}
              hideModal={() => setModalVisible(false)}
              fizickaSprema={true}
            />,
          );
        }
        break;
      case 'Plan ishrane':
        setSelectedChild(
          <View>
            {data.map(item => {
              return (
                <List.Accordion
                  theme={{colors: {background: colors.background}}}
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
    if (
      title === paymentSettings?.videoTitle ||
      title === 'Plan ishrane' ||
      title == 'Pisanje eseja' ||
      title == 'Treniranje'
    ) {
      setModalVisible(true);
    }
    if (title === 'Uplata premium paketa') {
      navigation.navigate('Payment');
    }
  };
  return (
    <View style={{marginBottom: 10}}>
      <View style={styles.container(colors.background, 200)}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
          }}>
          <Text style={styles.text}>{title}</Text>
          {title === 'Test' && !isPremium && (
            <Ionicons
              name="lock-closed"
              size={18}
              color={colors.primary}
              style={{marginLeft: 10}}
            />
          )}
        </View>
        {swipableObject && (
          <SwiperFlatList
            data={data}
            renderItem={({item}) => {
              if (
                preSelectedCategory &&
                item.id === preSelectedCategory?.ctg.id
              ) {
                if (
                  title === 'Kategorije' &&
                  preSelectedCategory?.subctg !== 'TEST'
                ) {
                  setSelectedCategory(preSelectedCategory.ctg);
                  setModalVisible(true);
                  dispatch(setSelectedCtg(null));
                } else if (
                  title === 'Test' &&
                  preSelectedCategory?.subctg === 'TEST'
                ) {
                  setSelectedCategory(preSelectedCategory.ctg);
                  setModalVisible(true);
                  dispatch(setSelectedCtg(null));
                }
              }
              return (
                <TouchableOpacity
                  style={[styles.child, styles.shadowBox]}
                  onPress={() => {
                    if (title === 'Test' && !isPremium) {
                      setIsPaymentModalVisible(true);
                      return;
                    }

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
              );
            }}
          />
        )}
        {!swipableObject && (
          <TouchableOpacity
            style={[styles.oneElement, styles.shadowBox]}
            onPress={() => handlePressObject()}>
            <ImageBackground
              source={pic ? {uri: pic} : image}
              style={styles.backgroundImage}>
              <Text style={styles.insideSwiper}>{title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      </View>
      <OverviewModal
        title={title}
        subtitle={selectedCategory?.name}
        headerImage={pic ? pic : selectedCategory?.imageURL}
        imageVisible={true}
        isVisible={modalVisible}
        hideModal={() => {
          setModalVisible(false);
          dispatch(setSelectedCtg(null));
        }}
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
  container: (backgroundColor, height) => ({
    height,
    flex: 1,
    backgroundColor,
  }),
  superTypes: backgroundColor => ({
    backgroundColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
  }),
  superName: color => ({
    color,
    textAlign: 'center',
  }),
  superSubctg: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: width * 0.5,
  },
  child: {
    width: width * 0.35,
    justifyContent: 'center',
  },
  oneElement: {
    width: width * 0.95,
    justifyContent: 'center',
    height: 150,
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
    fontSize: 18,
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
    paddingHorizontal: 20,
    paddingVertical: 15,
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
