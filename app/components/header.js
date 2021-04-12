import React, {Component, PureComponent} from "react";
import { Header } from "@react-navigation/stack";
import { View, Platform, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { BlurView, VibrancyView } from "../../libraries/blur";
let ancho = Dimensions.get('window').width; //full width
let alto = Dimensions.get('window').height; //full height

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

import {DarkModeContext} from 'react-native-dark-mode';

class HeaderFX extends PureComponent {

  render(){
    return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left:0,
            right:0,
            width: '100%',
            backgroundColor: 'transparent',
          }}
        >
             <Header 
                {...this.props} 
                style={{
                  borderColor: 'transparent',
                  top:0,
                  left:0,
                  right:0,
                  zIndex:109,
                  borderBottomWidth: 0
                }}
             />
           
        </View>
      );



      
    if(Platform.OS == 'ios'){
      
     } else {
      return (
        <View
          style={{
            border:0,
            boxShadow: 'unset',
            margin: 0,
            padding:0,  
            shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          elevation: 0,
          shadowRadius: 0,
            backgroundColor: this.props.themeMode == 'dark' ? '#222' : '#fff',
          }}
        >
        
            <Header {...this.props} style={{margin:0,padding:0,shadowOpacity: 0,
          shadowOffset: {
            height: 0,
          },
          elevation: 0,
          shadowRadius: 0,}}/>

           
        </View>
      );
     }
  }
  
};

export default HeaderFX;