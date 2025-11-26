import Reactotron from 'reactotron-react-native';

Reactotron.configure({host: '10.0.2.2', name: 'PoliceQuiz'}) // optional app name
  .useReactNative({
    networking: {ignoreUrls: []},
  }) // add all built-in react native plugins
  .connect(); // connect to reactotron desktop app

console.tron = Reactotron;

Reactotron.clear();
