import firestore from '@react-native-firebase/firestore';
import {getUniqueId} from 'react-native-device-info';
import {replaceAll, undefinedToNull} from '../utils/helpers';

export const addDocument = async ({collection, data}) => {
  const prepData = undefinedToNull(data);
  const docId = firestore().collection(collection).doc().id;
  await firestore()
    .collection(collection)
    .doc(docId)
    .set({...prepData, id: docId});
  return firestore().collection(collection).doc(docId).get();
};

export const updateDocuments = async ({collection, data}) => {
  const prepData = undefinedToNull(data);
  const docId = data?.id;
  await firestore().collection(collection).doc(docId).update(prepData);
};

export const setUser = async data => {
  const prepData = undefinedToNull(data);
  const uid = getUniqueId();
  const docId = uid.includes('-') ? replaceAll(uid, '-', '') : uid;
  const user = await firestore().collection('users').doc(docId).get();
  if (user.data()) {
    await firestore().collection('users').doc(docId).update(prepData);
  } else {
    await firestore()
      .collection('users')
      .doc(docId)
      .set({...prepData, id: docId, createdAt: new Date()});
  }
  return firestore().collection('users').doc(docId).get();
};

export const getUser = async () => {
  const uid = getUniqueId();
  const docId = uid.includes('-') ? replaceAll(uid, '-', '') : uid;
  return firestore().collection('users').doc(docId).get();
};

export const getCollection = async ({collection, condition, orderBy}) => {
  let query = firestore().collection(collection);

  if (condition) {
    condition.forEach(c => {
      if (Array.isArray(c)) {
        query = query.where(...c);
      } else {
        query = query.where(c);
      }
    });
  }

  if (orderBy) {
    query = query.orderBy(...orderBy);
  }

  return query.get().then(querySnapshot => {
    const data = [];
    querySnapshot.forEach(documentSnapshot => {
      data.push(documentSnapshot.data());
    });
    return data;
  });
};

/* export const updateCollection = async () => {
  let query = firestore().collection('questions');
  query = query.where('categories', 'array-contains-any', [
    'l4KQdVW9NNbRmpLUgmUx',
    'n6ChtYFu0OH9SumtFXDU',
  ]);
  //kFbYdXw46hckF2ROib60 opce znanje potkategorija
  // ZDNcM28hUYNVLmNg6DvH   KATEGORIJA opce znanje

  //------release------
  //H4s4f2fXl5S6vvwLDaWU opce znanje potkategorija
  // mNDk6XBaWgUe40w6KTqA   MUP PK kategorija

  return query.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log('updating');
      // Access the array field you want to update
      let array = doc.data().subcategories;
      if (!array) array = [];
      //if (!array) array = [];
      //let array = [];
      // Add the new element to the array
      if (!array.includes('zDoyHKOTTfPU0mLBDk85'))
        array.push('zDoyHKOTTfPU0mLBDk85');

      // Update the document with the modified array
      doc.ref.update({subcategories: array});

      return array;
    });
  });
}; */

export const getMixedCollection = async ({collection, condition, orderBy}) => {
  let query = firestore().collection(collection);
  let subquery = firestore().collection(collection);
  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }
  if (condition) {
    query = query.where(...condition[0]);
    subquery = subquery.where(...condition[1]);
    condition.splice(0, 2);

    condition.forEach(c => {
      if (Array.isArray(c)) {
        query = query.where(...c);
        subquery = subquery.where(...c);
      } else {
        query = query.where(c);
        subquery = subquery.where(c);
      }
    });
  }

  if (orderBy) {
    query = query.orderBy(...orderBy);
  }

  catPromise = query.get().then(querySnapshot => {
    const data = [];
    querySnapshot.forEach(documentSnapshot => {
      data.push(documentSnapshot.data());
    });

    return data;
  });
  subcatPromise = subquery.get().then(querySnapshot => {
    const data = [];
    querySnapshot.forEach(documentSnapshot => {
      data.push(documentSnapshot.data());
    });

    return data;
  });
  const combinedPromise = Promise.all([catPromise, subcatPromise]);
  return combinedPromise
    .then(([catData, subcatData]) => {
      const combinedData = catData.filter(categoryData => {
        return subcatData.some(subcategoryData => {
          return categoryData.id == subcategoryData.id;
        });
      });
      let returnedValues = [];
      for (let data of combinedData) {
        primaryData = data;
        primaryData.answers = shuffleArray(primaryData.answers);
        returnedValues.push(primaryData);
      }
      return returnedValues;
    })
    .catch(error => {
      console.log('Error:', error);
    });
};
