import React from 'react';
import { AppLoading } from 'expo';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import AppContainer from './src/navigation/AppNavigator';

//Database import
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyDVc2vb0w6OIX5hVaREsfOjSdDiUTX5ysM",
  authDomain: "dashr-core.firebaseapp.com",
  databaseURL: "https://dashr-core.firebaseio.com",
  projectId: "dashr-core",
  storageBucket: "dashr-core.appspot.com",
  messagingSenderId: "322428013543",
  appId: "1:322428013543:web:8fc403b652ac3e86034b42",
  measurementId: "G-2ZWS34TV45"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  state = {
    assetsLoaded: false,
  };

  constructor(){
    super();
    console.disableYellowBox = true;
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/background.png'),
        require('./assets/images/logo.png'),
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
        
      }),
    ]);
  };

 
  render() {
    return (
        this.state.assetsLoaded ?    
          <AppContainer/>  
          :         
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onFinish={() => this.setState({ assetsLoaded: true })}
            onError={console.warn}
            autoHideSplash={true}
          />
    );
  }
}