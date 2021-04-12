/**
 * Typings SignedIn
 * typings.co
 *
 * @format
 * @flow
 */
require('react-native-gesture-handler'); 

import React, {Component, PureComponent, useContext, useEffect, useState } from 'react';
import {Platform, Header, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, Animated, Easing, NativeModules } from 'react-native';

import { SignedInRoutes } from '../utils/routes.js';
import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../utils/context'

import SplashScreen from 'react-native-splash-screen'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic' 


// (-) Deprecated Modules (soon to be removed completely)







import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';


import { API_URL } from 'react-native-dotenv'

import styles, { colors } from '../styles/index.style';

import Share from 'react-native-share';




import RNRestart from 'react-native-restart'; 

import Snackbar from 'react-native-snackbar';



import { createAppContainer, HeaderBackButton, NavigationActions, StackActions } from 'react-navigation';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator} from 'react-navigation-stack';
// Routes
import BookScreen from './routes/bookScreen.js';
import ReaderScreen from './routes/readerScreen.js';
import HomeScreen from './routes/homeScreen.js';

import SearchScreen from './routes/searchScreen.js';





//import ChapterDetailsScreen from './routes/creators/chapterDetailsScreen.js';
import ProfileScreen from './routes/profileScreen.js';
import HeaderFX from '../components/header.js';
import NavbarBottom from '../components/navbar.js';
import InProps from '../components/inProps.js';
import EditChapter from '../components/editChapter.js';
import PlacesList from '../components/placesList';
import NavThroughMap from '../components/navThroughMap';
import WorkSettings from '../components/workSettings';
import { MenuProvider } from 'react-native-popup-menu';
// Get API class
import API from '../services/api';  
// Languages
import { getLang, Languages } from '../static/languages';


import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';


import changeNavigationBarColor, {
  HideNavigationBar,
  ShowNavigationBar,
} from 'react-native-navigation-bar-color';

import RnBgTask from 'react-native-bg-thread';

import NetInfo from "@react-native-community/netinfo";

import _ from 'lodash';
//const Remote = new API({ url: API_URL })

import update from 'immutability-helper'


// import {decode, encode} from 'base-64'

// if (!global.btoa) {
//     global.btoa = encode;
// }

// if (!global.atob) {
//     global.atob = decode;
// }

/*  db.sync('https://'userID':'userPASS'@'serverIP':6984/DBname', {
      live: true
    }).on('change', function (change) {
      console.log(change);
    }).on('error', function (err) {
      console.log(err);
    }).on('complete', function (info) {
      console.log(info);
    });
  }*/

import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';

const DarkMode = { currentMode: initialMode }
//eventEmitter.on('currentModeChanged', newMode => RNRestart.Restart());

let MainNavigator = null;



function SignedIn(){
  const ClouchDB = useContext(Clouch);
  const NewtDB = useContext(Newt);
  const isDarkMode = useDarkMode();
  // Effects
  useEffect(() => {
    SplashScreen.hide();
    changeNavigationBarColor(isDarkMode == true ? '#000000' : '#ffffff', isDarkMode == true ? false : true);
  }, []);

  return (
      <SignedInRoutes/>
    )
}

export default SignedIn;


let NavigatorScreen;
// Deprecated
export class SignedIn2 extends Component<Props> {
  static contextType = DarkModeContext;
  constructor(props) {
      super(props);
      this.state = {
         isTabBarVisible: true,
         rootUser: null,
         isLoading: true,
         myDocs: null,
         publishedDocs: null,
         isReady: false,
         formattedPublishedDocs: null,
         not_viewed: 0,
        totalNotifications: 0,
        notifications: null,
        connection_Status : "online",
        infoDrafts: null,
        infoChapters: null,
        chaptersIds: [],

        syncDraftsStatus: null,
        syncChaptersStatus: null
      }
      this.hideTabBar = this.hideTabBar.bind(this);
      
      this.replicatorChapters;
      this.replicatorDrafts;
      this.replicatorPublic;

      this.capIds = null;


      this.onStartedPublicSync = false;

             this.HomeNavigator = createStackNavigator({
                        Explore:{
                            screen: HomeScreen,
                            navigationOptions: {
                              header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: 'transparent',
                                  border: 0,
                                  margin:0,
                                  borderWidth:0,
                                  borderBottomWidth: 0,

                                  shadowOffset: {
                                    height: 0,
                                  },
                                  shadowRadius: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           }
                        },
                        InProps:{
                            screen: InProps,
                            navigationOptions: {

                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  backgroundColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                        EditChapter:{
                            screen: EditChapter,
                            navigationOptions: {

                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: false,
                                 headerStyle: {
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  backgroundColor: 'transparent',
                                  
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                        Sync:{
                            screen: SyncScreen,
                            navigationOptions: {
                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  backgroundColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                        Details:{
                            screen: BookScreen,
                            navigationOptions: {
                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  backgroundColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                        Reader:{
                            screen: ReaderScreen,
                            navigationOptions: {



                                 gesturesEnabled: true,
                                 
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                        }
                    }, {cardStyle: {backgroundColor: DarkMode.currentMode == 'dark'? '#111' : '#fff',opacity: 1},initialRouteName: 'Explore', headerMode: 'float', headerLayoutPreset: 'center'});

      this.HomeNavigator.navigationOptions = ({ navigation }) => {
        let tabBarVisible;
        let headerMode;
        if (navigation.state.routes.length > 1) {
          navigation.state.routes.map(route => {
            if (route.routeName === "EditChapter" || route.routeName === "Reader") {
              tabBarVisible = false;
              headerMode = 'screen';
            } else {
              tabBarVisible = true;
              headerMode = 'float';
            }
          });
        }

        return {
          tabBarVisible,
          headerMode
        };
      };


      

//const NavigationContainer = createAppContainer(NavigatorScreen);


      this.WriterNavigator = createStackNavigator({
                        Stories:{
                            screen: NavigatorScreen,
                            navigationOptions: {
                              header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 header: null,
                                 cardStyle: {backgroundColor: DarkMode.currentMode == 'dark' ? '#fff' : '#111',opacity: 1},
                                 headerStyle: {
                                  backgroundColor: 'transparent',
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           }
                        },
                        Details:{
                            screen: BookScreen,
                            navigationOptions: {
                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: 'transparent',
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                        Reader:{
                            screen: ReaderScreen,
                            navigationOptions: {

                                 header: null,
                                 headerVisible: false,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  elevation:0,
                                  shadowOpacity:0,
                                  backgroundColor: 'transparent',
                                  borderBottomWidth: 0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                        },
                        InProps:{
                            screen: InProps,
                            navigationOptions: {

                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  backgroundColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                        EditChapter:{
                            screen: EditChapter,
                            navigationOptions: {

                                 header: null,
                                 gesturesEnabled: false,
                                 headerStyle: {
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  backgroundColor: 'transparent',
                                  
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                    }, {cardStyle: {backgroundColor: DarkMode.currentMode == 'dark' ? '#111' : '#fff',opacity: 1},initialRouteName: 'Stories', headerLayoutPreset: 'center', headerMode: 'screen'});

      this.WriterNavigator.navigationOptions = ({ navigation }) => {
        let tabBarVisible;
        if (navigation.state.routes.length > 1) {
          navigation.state.routes.map(route => {
            if (route.routeName === "Reader") {
              tabBarVisible = false;
            } else if (route.routeName === "EditChapter") {
              tabBarVisible = false;
            } else {
              tabBarVisible = true;
            }
          });
        }

        return {
          tabBarVisible
        };  
      };


      this.SearchNavigator = createStackNavigator({
                        Search:{
                            screen: SearchScreen,
                            navigationOptions: {
                              header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: 'transparent',
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           }
                        },
                        Details:{
                            screen: BookScreen,
                            navigationOptions: {
                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: 'transparent',
                                  borderBottomWidth: 0,
                                  elevation:0,
                                  shadowOpacity:0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                        Reader:{
                            screen: ReaderScreen,
                            navigationOptions: {

                                 header: null,
                                 headerVisible: false,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  elevation:0,
                                  shadowOpacity:0,
                                  backgroundColor: 'transparent',
                                  borderBottomWidth: 0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                        }
                    }, {cardStyle: {backgroundColor: DarkMode.currentMode == 'dark'? '#111' : '#fff',opacity: 1},initialRouteName: 'Search', headerLayoutPreset: 'center'});

      this.SearchNavigator.navigationOptions = ({ navigation }) => {
        let tabBarVisible;
        if (navigation.state.routes.length > 1) {
          navigation.state.routes.map(route => {
            if (route.routeName === "Reader") {
              tabBarVisible = false;
            } else {
              tabBarVisible = true;
            }
          });
        }

        return {
          tabBarVisible
        };  
      };

      this.SettingsNavigator = createStackNavigator({
                        Account:{
                            screen: ProfileScreen,
                            navigationOptions: {
                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} show={true} {...props} />,
                                 headerLeft: null,
                                 title: Languages.bottomBarSettings[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  elevation:0,
                                  shadowOpacity:0,
                                  backgroundColor: 'transparent',
                                  borderBottomWidth: 0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },

                        },
                        ChangeProperty:{
                            screen: InProps,
                            navigationOptions: {

                                 header: props => <HeaderFX themeMode={DarkMode.currentMode} {...props} />,
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  elevation:0,
                                  shadowOpacity:0,
                                  backgroundColor: 'transparent',
                                  borderBottomWidth: 0,
                                  borderColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 0,
                                          },
                                        })
                                   },
                                 headerTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
                                 headerTitleStyle: {
                                   fontWeight: '500',
                                  },
                           },
                           headerBackTitle: null
                        },
                    }, {cardStyle: {backgroundColor: DarkMode.currentMode == 'dark'? '#111' : '#fff',opacity: 1},initialRouteName: 'Account', headerLayoutPreset: 'center'});

        this.TabNavigation = createBottomTabNavigator({
            Home: {
             screen: this.HomeNavigator,
                 navigationOptions: {
                    tabBarLabel: Languages.bottomBarExplore[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <Feather name="compass" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Search: { 
              screen: this.SearchNavigator,
              navigationOptions: {
                    tabBarLabel:Languages.bottomBarCreators[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <AntDesign name="search1" size={20} style={{paddingTop: Platform.OS == 'ios' ? 4 : 0, color: tintColor}} />
                    )
                  }
             },
             Pad: {
             screen: this.WriterNavigator,
                 navigationOptions: {
                    tabBarLabel: Languages.bottomBarWriter[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <Feather name="edit-3" size={20} style={{paddingTop: Platform.OS == 'ios' ? 2 : 0,color: tintColor}} />
                    )
                  }
             },
            Settings: { 
              screen: this.SettingsNavigator,
              navigationOptions: {
                    tabBarLabel:Languages.bottomBarSettings[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <AntDesign name="setting" size={21} style={{paddingTop: Platform.OS == 'ios' ? 4 : 0, color: tintColor}} />
                    )
                  }, 
             }
        },{
            swipeEnabled: true,
            animationEnabled: true,
            tabBarPosition: 'bottom',
            tabBarComponent: NavbarBottom,
            tabBarOptions: {
              keyboardHidesTabBar: false,
              themeMode: DarkMode.currentMode,
              activeBackgroundColor: Platform.OS == 'ios' ? 'transparent' : DarkMode.currentMode == 'light' ? '#fff' : '#222',
              inactiveBackgroundColor: Platform.OS == 'ios' ? 'transparent' : DarkMode.currentMode == 'light' ? '#fff' : '#222',
              activeTintColor: DarkMode.currentMode == 'dark'? '#fff' : '#000',
              inactiveTintColor: DarkMode.currentMode == 'Daterk'? '#ccc' : '#444',
              bottomTabs: { hideShadow: true },
              style: {
                borderWidth: 0,
                backgroundColor: 'transparent',
                borderTopColor: "transparent",
                elevation: 0,
                borderTopWidth: 0
              }
            }
        });

        MainNavigator = createAppContainer(this.TabNavigation);
     
   }
   componentDidMount() {
      this._cancelSynchronizations()
      // RnBgTask.runInBackground(async()=>{
        this.$setUp();
     // });

    NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
     
        );
       
        NetInfo.isConnected.fetch().done((isConnected) => {
          if(isConnected == true)
          {
            this.setState({connection_Status : "online"})
          }
          else
          {
            this.setState({connection_Status : "offline"})
          }
     
        });

    if(DarkMode.currentMode == 'light'){
      changeNavigationBarColor('#ffffff', true);
    } else {
      changeNavigationBarColor('#222222', true);
    }




   
   }

    /*shouldComponentUpdate(nextProps, nextState) {
      console.log("should componennt update", nextProps, nextState);
      console.log("this should componennt update", this.props, this.state);

      return true;  
    }*/

   hideTabBar() {
      this.setState({ isTabBarVisible: false })
   }
   $setUp = async() => {

    let k = await(ClouchDB.Auth().getLoggedUser());



    if(k == false){
      Snackbar.show({ title: 'Something went wrong with your session. You must relogin.', duration: Snackbar.LENGTH_LONG })
      this._onLogout();
      return;
    }

    SplashScreen.hide();
   // let n = await(ClouchDB.Notifications().all());
        //let p3 = await(Remote.Notifications().selfNew('Welcome to Newt.', 'Newt', 'dismiss'));`
    //let s = await(ClouchDB.Work().setUp());

    let drafts = await(ClouchDB.Work().drafts().all());



  //  console.log("chatpersadosda", chaptersIds)
     // console.log("drafts!", drafts)
      
     // console.log("published1", published)
    

      if(drafts && drafts.rows.length == 0){
          //console.log("go here!")
           // console.log("there are no drafts!", drafts)
          let setUpDrafts = await(ClouchDB.Work().drafts().replicateFrom());


          //let dp = await Remote.Sync().pullPush('pull', 'drafts');

          drafts = await(ClouchDB.Work().drafts().all());

          //  console.log("replicate drafts!", setUpDrafts, drafts)
        }


        let published = await(ClouchDB.Public().all());

        if(published && published.length == 0){
           let setUpPublic = await(ClouchDB.Public().replicateFrom());

          // console.log("replicate!")
          // __DEV__ && console.log("[replicate] publishers", setUpPublic)
            published = await(ClouchDB.Public().all());

            //let buildIndex = await(ClouchDB.Public().setUpIndexes());

            //this.setWeeklyCheckpoint();
        }

        let formattedDocs = await ClouchDB.Public().formatFromTags(published, { sort: 'default' });





        this.setState({
          formattedPublishedDocs: formattedDocs,
          isReady: true,
          publishedDocs: published, 
          rootUser: k, 
          isLoading: false,
          refreshing: false,
          myDocs: drafts
        })

        //MainNavigator = createAppContainer(this.TabNavigation);
        //console.log("made it here!",this.state)


        setTimeout(() => {
          if(k && k.autoSync && k.autoSync == true){

              this.$keepPublicSync();
            if(k.writerMode && k.writerMode == true){
              //console.log("WRITER SYNC AUTO START")
              //this.$onSync();
            }
          }




        }, 1500)
  
    //return;
      


    
   }

   reformatPublished = (docs) => {

     this.setState((prevState) => update(prevState, { 
                      formattedPublishedDocs: {
                              $set: docs
                          }
                         }));
   }

   resetPublished = async(params) => {
      if(params.published && params.formatted){
        await this.setState((prevState) => update(prevState, { 
                      formattedPublishedDocs: {
                              $set: params.formatted
                          },
                      publishedDocs: {
                              $set: params.published
                          }
                         }));
      }
      
   }

   addSearchedDocs = async(docs) => {

    if(docs != null && docs.length > 0){
      let newDocs = this.state.publishedDocs.concat(docs)
      newDocs = _.uniqBy(newDocs, function (e) {
        return e._id;
      });
      this.setState((prevState) => update(prevState, { 
                      publishedDocs: {
                              $set: newDocs
                          }
                         }));
    }
    
    
    return;
   }

   onUpdatedOrInsertedPublic = (newDoc) => {


    if(newDoc && newDoc._id.includes("_design")){
          return;
        }
     // console.log("update or iserted explorer", this.state.publishedDocs, this.state.formattedPublishedDocs)

      let indexDoc = _.findIndex(this.state.publishedDocs, ['_id', newDoc._id]);

      if(indexDoc != -1){
        if(this.state.publishedDocs[indexDoc]._id && newDoc._id){
          if(newDoc._deleted){
              this.setState((prevState) => update(prevState, { 
                      publishedDocs: {
                          $splice: [[indexDoc, 1]]
                          }
                         }));

            } else {
             this.setState((prevState) => update(prevState, { 
                      publishedDocs: {
                          [indexDoc]: { 
                              $set: newDoc
                             } 
                          }
                         }));

            }

            for (var i = 0; i < this.state.formattedPublishedDocs.length; i++) {
              if(this.state.formattedPublishedDocs[i] && this.state.formattedPublishedDocs[i].docs){
                let indexFP = _.findIndex(this.state.formattedPublishedDocs[i].docs, ['_id', newDoc._id]);

                if(indexFP != -1){
                  if(this.state.formattedPublishedDocs[i].docs[indexFP]._id && newDoc._id){
                    if(newDoc._deleted){
                        this.setState((prevState) => update(prevState, { 
                                formattedPublishedDocs: {
                                  [i]: {
                                    docs: {
                                      $splice: [[indexFP, 1]]
                                    }
                                  }
                               }
                            }));

                      } else {
                       this.setState((prevState) => update(prevState, { 
                                formattedPublishedDocs: {
                                    [i]: {
                                      docs: {
                                        [indexFP]: { 
                                          $set: newDoc
                                         } 
                                      }
                                    }
                                }
                            }));

                       setTimeout(() => {
                        //console.log("UPDATE ALICE FORmat!", this.state.formattedPublishedDocs[i].docs[indexFP])
                       }, 500)

                      }
                  }
                }
              }
            }
        }
      }

  }



  onUpdatedOrInsertedDrafts = (newDoc) => {

    if(typeof this.state.myDocs === 'undefined' || this.state.myDocs == null){
        return;
      }
      var index = _.findIndex(this.state.myDocs.rows, ['_id', newDoc._id]);

      //console.log("[DRAFTS] UPDATE OR INSET", index, newDoc, this.state.myDocs)
      if(newDoc && newDoc._id.includes("_design")){
        return;
      }
      var doc = this.state.myDocs.rows[index];

     

      if(doc && doc._id === newDoc._id){

         if(newDoc._deleted){
          this.setState((prevState) => update(prevState, { 
                  myDocs: {
                    rows: {
                      $splice: [[index, 1]]
                    }
                  }
                }));
          return;
        } else {
         this.setState((prevState) => update(prevState, { 
                  myDocs: {
                    rows: {
                      [index]: { 
                          $set: newDoc
                         } 
                       }
                      }
                     }));
        }


      } else { // insert
        //console.log("INSERT DOC!", index, newDoc)
        if(index == -1 && !newDoc._deleted){
           this.setState((prevState) => update(prevState, { 
                myDocs: { 
                  rows: {
                    $push: [newDoc]
                  }

                 }
             }));

          // console.log("doc inserted!", this.state.docs)
        }
       
      }
  }

   cancelAndRestartSync = () => {
    //console.log("cancelrestat", ClouchDB.ApplicationDrafts)
    if(ClouchDB.ApplicationDrafts.cancel){
      let c = ClouchDB.ApplicationDrafts.cancel();
      //console.log("CANCCEL AND RESTART! DRAFTS!", c)
    }
    if(ClouchDB.ApplicationChapters.cancel){
      let c = ClouchDB.ApplicationDrafts.cancel();
      //console.log("CANCCEL AND RESTART! CCHAPTERS!", c)
    }


    if(this.props.screenProps.rootUser && this.props.screenProps.rootUser.writerMode && this.props.screenProps.rootUser.writerMode == true){
     // this.$onSync(); 
    }

  }



  $keepPublicSync = async() => {

    if(this.onStartedPublicSync == true){
      return;
    }

    this.onStartedPublicSync = true;
   // console.log("FIRE KEEP PUBLIC SYNC", this.state)


   if(this.replicatorPublic && this.replicatorPublic.cancel){
        this.replicatorPublic.cancel();
      }

   //RnBgTask.runInBackground(async()=>{


      /*if(ClouchDB.ApplicationPublished.cancel){
        ClouchDB.ApplicationPublished.cancel();
      }*/
      //let inf = await ClouchDB.RemoteDrafts.info();
      //let inf2 = await ClouchDB.ApplicationPublished.info();
      //console.log("publicinfo", inf, inf2)

      //console.log("this state root user before replic", this.state.rootUser, typeof this.state.rootUser.checkpoint)
      if(this.state.rootUser  && typeof this.state.rootUser.checkpoint === 'undefined'){
        let inf = await ClouchDB.RemoteDrafts.info();

        //console.log("user does not have a checkpoint!", inf)
        await this.setPublicCheckpoint(inf.update_seq, 'checkpoint')

        //console.log("user now has a checkpoint", this.state.rootUser)

      }
      const docIds = this.state.publishedDocs.map(d => d._id);

      let since = this.state.rootUser && typeof this.state.rootUser.checkpoint !== 'undefined' ? this.state.rootUser.checkpoint : 'now';

      let optPublic = {
                     live: true,
                     retry: true,
                     //scontinuous:true,
                     //filter: "_selector",
                      doc_ids: docIds,
                     filter: '_doc_ids',
                     /*selector: {
                      "updatedAt": {
                        "$gte": null
                      }
                     },*/
                     since: since,
                     attachments: false,
                     conflicts:false,
                     //limit:1000,
                    back_off_function: function (delay) {
                      if (delay === 0) {
                        return 1000;
                      } 
                      return delay * 3;
                    },
                     batch_size: 100,
                     //descending: true,
                     checkpoint: 'source',
                     batches_limit: 10,
                     include_docs:false,
                     //push: {checkpoint: false}, pull: {checkpoint: false},
                    // query_params: { "userId": this.state.rootUser.name }
                  };



         //  ClouchDB.ApplicationDrafts.replicate.from(ClouchDB.RemoteDrafts, optDrafts).on('complete', (info) => {

          // __DEV__ && console.log("remote drafts complete!", info)
             this.replicatorPublic = ClouchDB.ApplicationPublished.replicate.from(ClouchDB.RemoteDrafts, optPublic)
                .on('change', (info) => {
     
               __DEV__ && console.log('[Syncing] Public Changed: ', info);
                 this.setPublicCheckpoint(info.last_seq)
              
              }).on('error', (err) => {
                 __DEV__ && console.log("[sync] Public on error!", err)
                 if(this.replicatorPublic.cancel){
                  this.replicatorPublic.cancel();
                 }

              }).on('denied', (err) => {
                  __DEV__ && console.log("[SYNC] Public on DENIED!", err)
                  if(this.replicatorPublic.cancel){
                    this.replicatorPublic.cancel();
                   }

              })/*.on('active', (ac) => {
                  __DEV__ && console.log("[sync] Public on active!", ac)

              }).on('complete', (ac) => {
                  __DEV__ && console.log("[sync] Public on commplete!", ac)

              }).on('paused', (pa) => {
                  __DEV__ && console.log("[sync] Public on paused!", pa)

              })*/.catch(err => __DEV__ && console.log("error!!!!", err))
   // });
  }

  setPublicCheckpoint = async(seq) => {
    //console.log("this state ccheckpoinnt", this.state.rootUser, seq)

    this.state.rootUser.checkpoint = seq;

    let u = await(ClouchDB.Auth().saveLocalUser(this.state.rootUser)).catch(e => e);

    this.onUpdateUser(this.state.rootUser, 'checkpoint');

    return;
  }

  setWeeklyCheckpoint = async() => {
    //console.log("this state ccheckpoinnt", this.state.rootUser)

    this.state.rootUser.weeklyCheckpoint = Date.now();

    let u = await(ClouchDB.Auth().saveLocalUser(this.state.rootUser)).catch(e => e);

    return;
  }

  $runPublishedDocs = async() => {
    let published = await(ClouchDB.Public().all());


                let formattedDocs = await ClouchDB.Public().formatFromTags(published);

                this.setState({
                      formattedDocs: formattedDocs
                     });
  }
   $onSync = async() => {

    
    RnBgTask.runInBackground(async()=>{
      if(this.replicatorDrafts && this.replicatorDrafts.cancel){
        this.replicatorDrafts.cancel();
      }
     // console.log("Sync props", this.capIds)
       if(this.state.isReady && this.state.isReady == true){
          if(ClouchDB && this.state.rootUser){


         
            let optDrafts = {
                     live: true,
                     retry: true,
                     filter: '_selector',
                     style: "main-only",
                     selector: {
                      "$and": [
                         {
                            "_id": {
                               "$gte": this.state.rootUser.name+"-"
                            }
                         },
                         {
                            "_id": {
                               "$lt": this.state.rootUser.name+"-￰\ufff0"
                            }
                         }
                      ]
                   },
                   back_off_function: function (delay) {
                      if (delay === 0) {
                        return 1000;
                      }
                      return delay * 3;
                    },
                     batch_size: 200,
                     checkpoint: 'source',
                     batches_limit: 5,
                     //push: {checkpoint: false}, pull: {checkpoint: false},
                    // query_params: { "userId": this.state.rootUser.name }
                  };



              let oneWayDrafts = _.clone(optDrafts, true);
              oneWayDrafts.continuous = false;
              oneWayDrafts.batch_size = 500;
              oneWayDrafts.live = false;
              //oneWayDrafts.since = 'now';
              oneWayDrafts.checkpoint = 'source';

            __DEV__ && console.log("REPLICATION GO DRAFTS!", optDrafts)

           //ClouchDB.ApplicationDrafts.replicate.from(ClouchDB.RemoteDrafts, optDrafts).on('complete', (info) => {

         // __DEV__ && console.log("remote drafts complete!", info)
               this.replicatorDrafts = ClouchDB.ApplicationDrafts.sync(ClouchDB.RemoteDrafts, optDrafts)
                .on('change', (info) => {
     
               __DEV__ && console.log('[Syncing] Drafts Changed: ', info, this.state.syncDraftsStatus);
               let tos = (info.direction && info.direction == 'push') ? 'syncingPush' : (info.direction == 'pull' ? 'syncingPull' : 'syncing')
               if(this.state.syncDraftsStatus != tos){
                this.setState((prevState) => update(prevState, { 
                      syncDraftsStatus: {
                        $set: tos || 'syncing'
                      }
                  }));
                }
              }).on('error', (err) => {
                this.replicatorDrafts.cancel()
                 __DEV__ && console.log("[sync] Drafts on error!", err, this.state.syncDraftsStatus)
                 if(this.state.syncDraftsStatus != 'error'){
                this.setState((prevState) => update(prevState, { 
                      syncDraftsStatus: {
                        $set: 'error'
                      }
                  }));
                }

              }).on('denied', (err) => {
                this.replicatorDrafts.cancel()
                  __DEV__ && console.log("[SYNC] Drafts on DENIED!", err,this.state.syncDraftsStatus)
                  if(this.state.syncDraftsStatus != 'denied'){
                this.setState((prevState) => update(prevState, { 
                      syncDraftsStatus: {
                        $set: 'denied'
                      }
                  }));
                }
              }).on('active', (ac) => {
                  __DEV__ && console.log("[sync] Drafts on active!", ac,this.state.syncDraftsStatus)
                  let tos = (ac.direction && ac.direction == 'push') ? 'syncingPush' : (ac.direction == 'pull' ? 'syncingPull' : 'active')
                  if(this.state.syncDraftsStatus != tos){
                      this.setState((prevState) => update(prevState, { 
                            syncDraftsStatus: {
                              $set: tos || 'active'
                            }
                        }));
                }
              }).on('paused', (pa) => {
                  __DEV__ && console.log("[sync] Drafts on paused!", pa,this.state.syncDraftsStatus)
                  if(this.state.syncDraftsStatus != 'paused'){
                    this.setState((prevState) => update(prevState, { 
                          syncDraftsStatus: {
                            $set: 'paused'
                          }
                      }));
                    }
              }).catch(err => __DEV__ && console.log("error!!!!", err))
           /*}).on('error', (err) => {
                this.replicatorDrafts.cancel()
                 __DEV__ && console.log("[sync] Drafts on error!", err)

              }).on('denied', (err) => {
                this.replicatorDrafts.cancel()
                  __DEV__ && console.log("[SYNC] Drafts on DENIED!", err)

              }).on('active', (ac) => {
                  __DEV__ && console.log("[sync] Drafts on active!", ac)

              }).on('paused', (pa) => {
                  __DEV__ && console.log("[sync] Drafts on paused!", pa)

              }).catch(err => __DEV__ && console.log("error!!!!", err))*/
           




           
          // })

            
           /* this.props.RemoteCloud.ApplicationDrafts.changes({live: true, since: 'now', include_docs: true})
              .on('change', (change) => {
              console.log("[sync] ON CHANNGE!", change)
            }).on('error', console.log.bind(console))*/
        }
       }
      });
   }

   $updateChapterIds = async() => {
    let chaptersIds = await(ClouchDB.Work().drafts().chapters().allDocsIds());

    this.capIds = chaptersIds.chapters;
    //console.log("update chatpers ids!", this.capIds)

    this.cancelAndRestartSync()
   }

   componentWillUnmount(){
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
 
    );

    this._cancelSynchronizations()

   }

   _cancelSynchronizations = async() => {
     if(this.replicatorChapters && this.replicatorChapters.cancel){
        this.replicatorChapters.cancel();
      }
      if(this.replicatorDrafts && this.replicatorDrafts.cancel){
        this.replicatorDrafts.cancel();
      }
      if(this.replicatorPublic && this.replicatorPublic.cancel){
        this.replicatorPublic.cancel();
      }
      return;
   }

   _handleConnectivityChange = (isConnected) => {
    //console.log("handle connectivity", isConnected)
      if(isConnected == true)
        {
          this.setState({connection_Status : "online"})
        }
        else
        {
          this.setState({connection_Status : "offline"})
        }
    };

  cancelChaptersSync = () =>{
    //console.log("cancel sync!", this.replicatorChapters, this.replicatorChapters.cancel())
    if(this.replicatorChapters && this.replicatorChapters.cancel){
      setTimeout(() => {
        this.replicatorChapters.cancel();
      }, 2000)
    }

      return;
    }
  onSyncChapter = async(id) => {
    if(!id){
      return;
    }

    

    //RnBgTask.runInBackground(async()=>{
     // console.log("FIRE CHAPTERS SYNC!", id)
    // if(this.state.chaptersIds && this.state.chaptersIds.length > 0){
              

      if(this.state.rootUser.autoSync && this.state.rootUser.autoSync == true){

            if(ClouchDB.ApplicationChapters.cancel){
                ClouchDB.ApplicationChapters.cancel();
              }

              let optChapters = {
                 live: true,
                 retry: true,
                 //since: 'now',
                 filter: '_selector',
                 //push: {checkpoint: true}, 
                 //pull: {checkpoint: true},
                 batch_size: 100,
                 batches_limit: 20,
                 //checkpoint: 'source',
                 style: "main-only",
                 checkpoint: 'source',
                 //push: {checkpoint: false}, pull: {checkpoint: false},
                 back_off_function: function (delay) {
                    if (delay === 0) {
                      return 1000;
                    }
                    return delay * 3;
                  },
                 selector: {
                  "bookId": {
                    "$eq": id
                  }
                 }
              };


               let oneWayChapters = _.clone(optChapters, true);
              oneWayChapters.continuous = false;
              oneWayChapters.live = false;

             __DEV__ && console.log("[Replication Started] Chapters: ", optChapters, oneWayChapters)
             // Start One-Way Replication
        // ClouchDB.ApplicationChapters.replicate.from(ClouchDB.RemoteChapters, oneWayChapters).on('complete', (info) => {
          // on complete,
          // enable live sync

          //__DEV__ && console.log("[Complete replicate chapters]", info)
           this.replicatorChapters = ClouchDB.ApplicationChapters.sync(ClouchDB.RemoteChapters, optChapters)
              .on('change', (info) => {


              __DEV__ && console.log('[Change in Chapters]', info);
              }).on('error', (err) => {
                  this.replicatorChapters.cancel()
                  __DEV__ && conisole.log("[syncchapters] on error!", err)

              }).on('denied', (err) => {
                  this.replicatorChapters.cancel()
                  __DEV__ && console.log("[syncchapters] on DENIED!", err)

              }).on('active', (ac) => {
                  __DEV__ && console.log("[syncchapters] on active!", ac)

              }).on('paused', (pa) => {
                  __DEV__ && console.log("[syncchapters] on paused!", pa)

              });

                //}) //end one-way draft replication
            //  } //end if

       // });
     } else {
      return;
     }
  }

  onReplicateChapters = async(id) => {
    if(!id){
      return;
    }


          if(ClouchDB.ApplicationChapters.cancel){
            ClouchDB.ApplicationChapters.cancel();
          }
     // console.log("FIRE CHAPTERS SYNC!", id)
    // if(this.state.chaptersIds && this.state.chaptersIds.length > 0){
              



              let optChapters = {
                 live: false,
                 retry: true,
                 //since: 'now',
                 filter: '_selector',
                 //push: {checkpoint: true}, 
                 //pull: {checkpoint: true},
                 batch_size: 100,
                 batches_limit: 20,
                 //checkpoint: 'source',
                 style: "main-only",
                 checkpoint: 'source',
                 //push: {checkpoint: false}, pull: {checkpoint: false},
                 back_off_function: function (delay) {
                    if (delay === 0) {
                      return 1000;
                    }
                    return delay * 3;
                  },
                 selector: {
                  "bookId": {
                    "$eq": id
                  }
                 }
              };


               let oneWayChapters = _.clone(optChapters, true);
              oneWayChapters.continuous = false;
              oneWayChapters.live = false;

             __DEV__ && console.log("[Replication Started] Chapters: ", optChapters, oneWayChapters)
             // Start One-Way Replication
        // ClouchDB.ApplicationChapters.replicate.from(ClouchDB.RemoteChapters, oneWayChapters).on('complete', (info) => {
          // on complete,
          // enable live sync

          //__DEV__ && console.log("[Complete replicate chapters]", info)
           this.replicatorChapters = ClouchDB.ApplicationChapters.replicate.from(ClouchDB.RemoteChapters, optChapters)
              .on('change', (info) => {


              __DEV__ && console.log('[Change in Chapters]', info);
             
              }).on('error', (err) => {
                  this.replicatorChapters.cancel()
                  __DEV__ && conisole.log("[syncchapters] on error!", err)

              }).on('denied', (err) => {
                  this.replicatorChapters.cancel()
                  __DEV__ && console.log("[syncchapters] on DENIED!", err)

              }).on('active', (ac) => {
                  __DEV__ && console.log("[syncchapters] on active!", ac)

              }).on('paused', (pa) => {
                  __DEV__ && console.log("[syncchapters] on paused!", pa)

              });

                //}) //end one-way draft replication
            //  } //end if


  }

   setAllAsViewed = async() => {
      let n = await(ClouchDB.Notifications().setAllAsViewed());
      this.state.not_viewed = 0;
    }

    deleteAllNotifications = async() => {
      let n = await(ClouchDB.Notifications().truncateNotifications());
      this.setState({
        not_viewed: 0,
        totalNotifications: 0,
        notifications: null
      })
    }


   $shouldPerformChanges = (state) => {

      if(state){


          let s = _.filter(this.state.myDocs.rows, { _id: state.activeDoc._id })[0];
          let I = _.findIndex(this.state.myDocs.rows, ['_id', state.activeDoc._id]);
        if(state.toEdit == 'title' && state.activeDoc.title){
          this.state.myDocs.rows[I].title = state.activeDoc.title;

          /*
          this.setState(() => {
             
             this.state.myDocs.rows[I]={...this.state.myDocs.rows[I], title: state.activeDoc.title}
             return this.state.myDocs.rows
           });*/


        }

        if(state.toEdit == 'status' && state.activeDoc.status){
          this.state.myDocs.rows[I].status = state.activeDoc.status;
        }
        if(state.toEdit == 'cover' && state.activeDoc.cover){
          this.state.myDocs.rows[I].cover = state.activeDoc.cover;
        }
      }
      return;
      //if(this.state.docs) return this.state.docs;
    }


   onUpdateUser = async(user, by) => {


    //let k = await(ClouchDB.Auth().getLoggedUser());

    await this._cancelSynchronizations();
    //__DEV__ && console.log("update  setting!", by, user.writerMode, this.state.rootUser.writerMode)

    if(by && by == 'writer'){
      //this.state.rootUser.writerMode = user.writerMode;
      /*this.setState({
        rootUser: this.state.rootUser
      });*/
      //__DEV__ && console.log("SWITCH WRITER MODE!", user, this.state.rootUser)
      this.setState((prevState) => update(prevState, { 
                  rootUser: {
                      writerMode: {
                        $set: user.writerMode
                      }
                      }
                     }));
    }

    if(by && by == 'sync'){ 

      this.setState((prevState) => update(prevState, { 
                  rootUser: {
                      autoSync: {
                        $set: user.autoSync
                      }
                      }
                     }));
    }

    if(by && by == 'checkpoint' && user.checkpoint){ 

      this.setState((prevState) => update(prevState, { 
                  rootUser: {
                      checkpoint: {
                        $set: user.checkpoint
                      }
                      }
                     }));
    }
    //console.log("UPDATE WRITTE SETTI", this.state.rootUser)
    
   /* this.setState((prevState) => update(prevState, { 
                  rootUser: {
                          $set: k
                      }
                     }));*/



    //this.setState({rootUser: k})
   }

   _onLogout = async() => {
      let o = await ClouchDB.Auth().signOut().catch(e => null);

            RNRestart.Restart();
                this.props.navigation.navigate('SignedOut');
                const resetAction = StackActions.reset({
                                      index: 0,
                                      actions: [NavigationActions.navigate({ routeName: 'SignedOut' })]
                                  });
                this.props.navigation.dispatch(resetAction);
  
    }

    _lowerDrawer = () => {
      this.drawer.snapTo(1)
    }
    _upperDrawer = () => {

      this.drawer.snapTo(0)
    }

  inProps = (params, which, func) => {
      //console.log("PARAMS IN PROPS", func())
      this.props.navigation.navigate('InProps',{
        activeDoc: params,
        toEdit: which,
        toUpdate: func
      });
      //console.log("[explore] in props!", this.props)
    }
    
    $shouldPerformChanges = (state) => {

     // this.props.screenProps.shouldDocChange(state)
      return;
      //if(this.props.screenProps.myDocs) return this.props.screenProps.myDocs;
    }

    shareBook = (key) => {
      //__DEV__ && console.log("share book key!", key)
      const url = 'https://newt.to/'+key._id.replace(/-/g,'/');
      const title = key.title + ' it\'s available to read on Newt';
      const message = this.state.rootUser.name+' sent you this book through Newt.' ;
      const icon = 'https://tias.xyz/assets/newt.ico';
      const options = Platform.select({
        ios: {
          activityItemSources: [
            { // For sharing url with custom title.
              placeholderItem: { type: 'url', content: url },
              item: {
                default: { type: 'url', content: url },
              },
              subject: {
                default: title,
              },
              linkMetadata: { originalUrl: url, url, title },
            },
            { // For sharing text.
              placeholderItem: { type: 'text', content: message },
              item: {
                default: { type: 'text', content: message },
                message: null, // Specify no text to share via Messages app.
              },
              linkMetadata: { // For showing app icon on share preview.
                 title: message
              },
            },
            { // For using custom icon instead of default text icon at share preview when sharing with message.
              placeholderItem: {
                type: 'url',
                content: icon
              },
              item: {
                default: {
                  type: 'text',
                  content: ``
                },
              },
              linkMetadata: {
                 title: title,
                 icon: icon
              }
            },
          ],
        },
        default: {
          title,
          subject: title,
          message: `${message} ${url}`,
        },
      });

      Share.open(options);
    }

    render() {


        return (
            <DarkModeProvider>
              <MenuProvider>
                <StatusBar translucent={Platform.OS == 'ios' ? true : false} backgroundColor={Platform.OS == 'ios' ? 'transparent' : (this.context == 'dark' ? "#000" : "#fff")} barStyle={this.context != 'dark' ? "dark-content" : "light-content"} />
                <MainNavigator 
                  style={{backgroundColor: DarkMode.currentMode == 'dark' ? '#222' : '#f7f8fa'}} 
                  screenProps={{
                                onLogout: () => this._onLogout(), 
                                rootUser: this.state.rootUser,
                                isReady: this.state.isReady, 
                                formattedDocs: this.state.formattedPublishedDocs,
                                myDocs: this.state.myDocs, 
                                shouldDocChange: (state) => this.$shouldPerformChanges(state),
                                connectionStatus: this.state.connection_Status,
                                publishedDocs: this.state.publishedDocs, 
                                updateUser: this.onUpdateUser.bind(this), 
                                RemoteCloud: ClouchDB,
                                infoDrafts: this.state.infoDrafts,
                                infoChapters: this.state.infoChapters,
                                updateChapterIds: this.$updateChapterIds.bind(this),
                                onUpdatedOrInsertedPublic: (doc) => this.onUpdatedOrInsertedPublic(doc),
                                onUpdatedOrInsertedDrafts: (doc) => this.onUpdatedOrInsertedDrafts(doc),
                                syncChapters: (id) => this.onSyncChapter(id),
                                onReplicateChapters: (id) => this.onReplicateChapters(id),
                                syncDrafts: () => this.$onSync(),
                                syncPublic: () => this.$keepPublicSync(),
                                cancelChaptersSync: () => this.cancelChaptersSync(),
                                reformatPublished: (docs) => this.reformatPublished(docs),
                                resetPublished: (params) => this.resetPublished(params),
                                addSearchedDocs: (docs) => this.addSearchedDocs(docs),
                                shouldChangeRoot: this.$shouldPerformChanges.bind(this),
                                shareBook: (key) => this.shareBook(key),
                                _lowerDrawer: this._lowerDrawer.bind(this),
                                _upperDrawer: this._upperDrawer.bind(this),
                                inProps: this.inProps.bind(this),
                                //rootNavigation: this.props.navigation,
                                getBottomDrawerPosition: this.state.onExpandScroll,
                                syncDraftsStatus: this.state.syncDraftsStatus,
                                syncChaptersStatus: this.state.syncChaptersStatus
                              }}/>

              </MenuProvider>
            </DarkModeProvider>
          )

      
    }
}

module.exports = SignedIn;

