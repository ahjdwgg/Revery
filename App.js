/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import tw from 'tailwind-react-native-classnames';

const App = () => (
  <SafeAreaView style={tw`h-full`}>
    <View style={tw`pt-12 items-center`}>
      <View style={tw`bg-blue-200 px-3 py-1 rounded-full`}>
        <Text style={tw`text-blue-800 font-semibold`}>Hello Tailwind</Text>
      </View>
    </View>
  </SafeAreaView>
);

export default App;
