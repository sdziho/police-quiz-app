/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
const validateEmail = email => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

const validatePhoneNumber = phoneNumber => {
  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
  return regex.test(String(phoneNumber));
};

const validatePassword = password => {
  return password ? password.length >= 8 : false;
};

const isEmpty = string => {
  return string.length < 1;
};

function isNumeric(str) {
  if (typeof str !== 'string') return false;
  return /^\d+$/.test(str);
}

function undefinedToNull(object) {
  const newObject = object;
  Object.keys(newObject).forEach((key) => { newObject[key] = newObject[key] ?? null; });
  return newObject;
}

function shuffle(array) {
  return array
    .map((_, i) => [Math.random(), i])
    .sort(([a], [b]) => a - b)
    .map(([, i]) => array[i]);
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function replaceAll(str, find, replace) {
  if (!str) return;
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export {
  validateEmail, validatePassword, validatePhoneNumber, isEmpty, isNumeric, undefinedToNull, shuffle, randomIntFromInterval, replaceAll,
};
