/**
 * App
 * Newt
 *
 * @format
 * @flow
 */
// (#) Modules that needs to be imported first.
import 'react-native-gesture-handler'; 
global.Buffer = global.Buffer || require('buffer').Buffer;
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode;} if (!global.atob) {global.atob = decode;}
console.disableYellowBox = true;

// (#) Dependencies for this script
// (*) Globals
import React, { useState, useEffect, createContext, useContext, Component} from 'react';
import {Platform, StatusBar, AppRegistry, ActivityIndicator as IOSLoader, StyleSheet, View, Animated, Easing} from 'react-native';
import { ActivityIndicator as AndroidLoader } from 'react-native-paper';
import API from './services/api';
import { Clouch, ClouchProvider, withClouch, withNewt, Newt, NewtProvider } from './utils/context'

import { isBoolean, isString } from './utils'
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen'

// (*) for App
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDarkMode, ColorSchemeProvider } from 'react-native-dynamic'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-spinkit'
import changeNavigationBarColor from 'react-native-navigation-bar-color';

// (@) Child Screens of App
import SignedOut from './screens/signedOut.js';
import SignedIn from './screens/signedIn.js';

import { AppRoutes } from './utils/routes.js';

// (-) Deprecated Modules (soon to be removed completely)
import {DarkModeContext, DarkModeProvider} from 'react-native-dark-mode';
//import { ActivityIndicator, Colors } from 'react-native-paper';

// ######################################################################
// ######################################################################
// (#) Start
// Constants

// export const Cloud = new API({ url: API_URL });
// const Clouch = createContext(Cloud);



export default function App(){
  return (
  <SafeAreaProvider>
    <ColorSchemeProvider>
      <PaperProvider>
        <ClouchProvider>
          <NewtProvider>
            <NewtNavigator />
          </NewtProvider>
        </ClouchProvider>
      </PaperProvider>
    </ColorSchemeProvider>
  </SafeAreaProvider>
  )
}


export function NewtRouter(){
  const [ login, setLogin ] = useState(null)
  const isDarkMode = useDarkMode()
  const ClouchDB = useContext(Clouch);
  const NewtDB = useContext(Newt);
  //console.log("newt log!", NewtDB)
  useEffect(() => {
    //console.log("on update log!", NewtDB.auth, login)
      if(NewtDB.auth == true && login != true){
        setLogin(true);
      }
      else if(NewtDB.auth == false && login != false){
        setLogin(false);
      }

  }, [NewtDB.auth]);
  useEffect(() => {
    SplashScreen.hide();
    if(Platform.OS == 'android'){
      changeNavigationBarColor(isDarkMode == true ? '#000000' : '#ffffff', isDarkMode == true ? false : true);
    }
  },[])

  if(login == null){
    return (
        <View style={{backgroundColor: isDarkMode == true ? '#111' : '#fff', flex: 1, justifyContent: 'center'}}>
          {
            Platform.OS == 'ios' ? <IOSLoader /> :  <AndroidLoader animating={true} color={'#2575ed'} />
          }
        </View>
        )
  }
  return (
    <MenuProvider>
      <View style={{flex: 1, backgroundColor: isDarkMode == true ? '#111' : '#fff'}}>
         <AppRoutes isLoggedIn={login}/>
         <StatusBar backgroundColor={Platform.OS == 'ios' ? 'transparent' : (isDarkMode == true ? '#000' : '#fff')} barStyle={isDarkMode == true ? 'light-content' : 'dark-content'}/>
      </View>
    </MenuProvider>
  )
};

export const NewtNavigator = NewtRouter;



// let initRoute;



// const Routes = createStackNavigator({
//     SignedOut:{
//         screen: SignedOut,
//         navigationOptions: {
//                  header: null//Will hide header for LoginStack 
//            }
//     },
//     SignedIn:{
//         screen: SignedIn,
//         navigationOptions: {
//               header: null
//              headerLeft: null,
//              title: 'Typings',
//              gesturesEnabled: false,
//              headerStyle: {
//               backgroundColor: '#333',
//                },
//              headerTintColor: '#fff',
//              headerTitleStyle: {
//                fontWeight: '200',
//               },
//        }
//     }
// }, { transitionConfig: () => fadeIn(), });

// const AppNavigator = createAppContainer(Routes);








export class App2 extends Component<Props> {
  static contextType = DarkModeContext;
  constructor(props) {
      super(props); 
      this.state = {
         isLoading: true,
         isLoggedIn: false
      }

      //this.Remote = new API({ url: API_URL });

      this.Remote.Auth().getKey().then(key => {

        if(key != null){
          this.setState({ isLoading: false, isLoggedIn: true });
        } else {
          this.setState({ isLoading: false });
        }
      })
   }

   componentDidMount() {

     
    /* Remote.Auth().checkIfLoggedIn().then(bool => {
        console.log("Respuesta check if", bool)
        if(bool == true){
          this.setState({ isLoading: false, isLoggedIn: true });
        } else {
          this.setState({ isLoading: false });
        }
      }).catch(err => {
        console.log("There was an error!", err)
        this.setState({ isLoading: false });
      })*/
   }




  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={{backgroundColor: this.context == 'dark' ? '#222' : '#f7f8fa', flex: 1, justifyContent: 'center'}}>

        {/*<<LoaderRings />*/}
        <Spinner style={{alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={this.context == 'dark' ? '#fff' : '#000'}/>
        </View>
        )
      } else {
        if(this.state.isLoggedIn == true) {
          //console.log("is logged in!")
          return (
            <DarkModeProvider>
            <StatusBar
              backgroundColor="#fff"
              barStyle="dark-content"
            />
              <SafeAreaProvider>
              <SignedIn style={{marginTop: 0, paddingTop: 0}} 
              screenProps={{NewtCloud: this.Remote,theme: this.context}}
              navigation={this.props.navigation}/>
              </SafeAreaProvider>
            </DarkModeProvider>
          );
        } else {
          //console.log("is not logged in!")
          return (
            <DarkModeProvider>
            <SafeAreaProvider>
              <AppNavigator screenProps={{NewtCloud: this.Remote, theme: this.context}} style={{marginTop: 0, paddingTop: 0}} navigation={this.props.navigation}/>
              </SafeAreaProvider>
            </DarkModeProvider>
          );
        }
    }
  }
}


const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
});

AppRegistry.registerComponent('Navigation', () => Navigation);