import React, {Component, PureComponent, useState, useContext, useEffect} from 'react';
import {Platform, TouchableNativeFeedback, StyleSheet, Text, FlatList, TextInput, ActivityIndicator, View, Dimensions } from 'react-native';

import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../../utils/context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation, getHeaderNavHeight} from '../../services/sizeHelper';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { HomeSVG, MenuIcon } from "../../utils/vectors"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionList, NewSectionList, GridList, ListNotification } from '../../utils/renders'
import { SkeletonSection, SkeletonGrid, SkeletonList } from '../../utils/skeletons'
import { TouchableRipple } from "react-native-paper";
const Touchable = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback;

const SecondRoute = () => (
  <View />
);

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
const initialLayout = { width: ancho };

function BusinessScreen({route, navigation}){
  const isDarkMode = useDarkMode();
  const ClouchDB = useContext(Clouch);
  const BaoDB = useContext(Newt);
  
  // Effects
  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <TouchableRipple onPress={() => navigation.toggleDrawer()} style={{borderRadius:10,width: 60,}}>
          <View style={{display: 'flex', position: 'relative', width: 60, flexDirection: 'row', width: 100, }}>
          <MenuIcon
               width={50}
               height={50}
               style={{
                marginLeft:5
               }}
             />
          </View>
        </TouchableRipple>
      ),
      headerTitle: <Text style={{textTransform: 'capitalize'}}>Business</Text>
    });
  },[]);
  return (
     <View style={{flex:1, justifyContent: 'center', display: 'flex', backgroundColor: isDarkMode == true ? '#111111' : '#f2f2f2'}}>

         
    </View>
  );
}

export default BusinessScreen;
