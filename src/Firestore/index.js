import firestore from '@react-native-firebase/firestore';
import { getUniqueId } from 'react-native-device-info';
import { replaceAll, undefinedToNull } from '../utils/helpers';

export const addDocument = async ({
  collection, data,
}) => {
  const prepData = undefinedToNull(data);
  const docId = firestore().collection(collection).doc().id;
  await firestore().collection(collection).doc(docId).set({ ...prepData, id: docId });
  return firestore().collection(collection).doc(docId).get();
};

export const updateDocuments = async ({ collection, data }) => {
  const prepData = undefinedToNull(data);
  const docId = data?.id;
  await firestore().collection(collection).doc(docId).update(prepData);
};

export const setUser = async (data) => {
  const prepData = undefinedToNull(data);
  const uid = getUniqueId();
  const docId = uid.includes('-') ? replaceAll(uid, '-', '') : uid;
  const user = await firestore().collection('users').doc(docId).get();
  if (user.data()) {
    await firestore().collection('users').doc(docId).update(prepData);
  } else {
    await firestore().collection('users').doc(docId).set({ ...prepData, id: docId, createdAt: new Date() });
  }
  return firestore().collection('users').doc(docId).get();
};

export const getUser = async () => {
  const uid = getUniqueId();
  const docId = uid.includes('-') ? replaceAll(uid, '-', '') : uid;
  return firestore().collection('users').doc(docId).get();
};

export const getCollection = async ({ collection, condition, orderBy }) => {
  let query = firestore()
    .collection(collection);

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

  return query.get().then((querySnapshot) => {
    const data = [];
    querySnapshot.forEach(documentSnapshot => {
      data.push(documentSnapshot.data());
    });
    return data;
  });
};
