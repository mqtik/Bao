import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, Keyboard, View, Button, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView , Dimensions, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'

import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/docScreen.style';
import { getLang, Languages } from '../static/languages';
import { StretchyHeader } from '../../libraries/stretchy';
import {Column as Col, Row} from 'react-native-flexbox-grid';

import API from '../services/api';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import { SearchBar } from 'react-native-elements';

import FastImage from 'react-native-fast-image'

import Spinner from 'react-native-spinkit'

import { MenuProvider } from 'react-native-popup-menu';

import * as Animatable from 'react-native-animatable';

import {DarkModeContext} from 'react-native-dark-mode';
//static contextType = DarkModeContext;

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover, SlideInMenu, ContextMenu, SlideIn } = renderers;




const Remote = new API({ url: API_URL })
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
export default class CloseSessionn extends Component<Props>{
  static contextType = DarkModeContext;
    constructor (props) {
        super(props);
        this.state = {
          isLoading: false
        }
    }


    $onSignOut = () => {
      Alert.alert(
            'Are you sure you want to sign out?',
            'All changes you haven\'t push to the cloud will be lost',
            [
              {
                text: 'Sign out', 
                  onPress: async() => {
                      if(typeof this.props.logOut !== 'undefined'){
                        this.props.logOut();
                      }
                  }
                },
              {
                text: 'Cancel',
                onPress: () => __DEV__ && console.log('Cancel Pressed'),
                style: 'cancel',
              }
            ],
            {cancelable: false},
          );
      
    }
   
    render(){

          return(
           <Menu ref={r => (this.menu = r)} renderer={SlideIn} rendererProps={{ preferredPlacement: 'bottom', placement: 'bottom', anchorStyle: {backgroundColor: '#222'} }} style={{backgroundColor: 'transparent', borderRadius: 8, paddingRight:5}}>
                <MenuTrigger style={{width: 40}}>
               
                
                 <Entypo name="dots-two-vertical" size={23} style={{color: this.context == 'dark' ? '#fff' : '#000', textAlign: 'right', marginTop: 6, paddingRight: 5, alignSelf: 'center'}} />
                
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={styles.popOver}
                  >
                  {/*<MenuOption onSelect={() => null}>
                    <Text style={{color: '#fff', fontSize: 18, width: 150}}>
                        Rate this app
                      </Text>
                      <Entypo name="star-outlined" size={20} style={{color: 'rgba(255,255,255,.5)', textAlign: 'right', marginTop: -21, alignSelf: 'flex-end'}} />
                      
                    
                  </MenuOption>*/}
                  <MenuOption onSelect={() => this.$onSignOut()}>
                    <Text style={{color: '#fff', fontSize: 18, width: 150}}>
                      {Languages.signOut[getLang()]}
                    </Text>
                      <Entypo name="minus" size={20} style={{color: 'rgba(255,255,255,.5)', textAlign: 'right', marginTop: -21, alignSelf: 'flex-end'}} />
                      
                    
                  </MenuOption>
                  
                </MenuOptions>
            </Menu>
          )
        
    }
    
}