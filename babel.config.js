// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // New location of the Reanimated plugin:
      'react-native-worklets/plugin',
      // You use Expo Router — keep its Babel plugin:
    //   'expo-router/babel',
    ],
  };
};
