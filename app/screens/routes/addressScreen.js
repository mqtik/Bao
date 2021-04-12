import React, {Component, PureComponent, useState, useContext, useEffect} from 'react';
import {Platform, TouchableNativeFeedback, StyleSheet, Text, FlatList, TextInput, ActivityIndicator, View, Dimensions } from 'react-native';

import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../../utils/context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation, getHeaderNavHeight} from '../../services/sizeHelper';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { HomeSVG } from "../../utils/vectors"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionList, NewSectionList, GridList, ListNotification } from '../../utils/renders'
import { SkeletonSection, SkeletonGrid, SkeletonList } from '../../utils/skeletons'

const Touchable = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback;

const SecondRoute = () => (
  <View />
);

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
const initialLayout = { width: ancho };

function AddressScreen({route, navigation}){
  const isDarkMode = useDarkMode();
  const ClouchDB = useContext(Clouch);
  const BaoDB = useContext(Newt);
  
  // Effects
  useEffect(() => {
    navigation.setOptions({
      headerTitle: <Text style={{textTransform: 'capitalize'}}>Dirección</Text>
    });
  },[]);
  return (
     <View style={{flex:1, justifyContent: 'center', display: 'flex', backgroundColor: isDarkMode == true ? '#111111' : '#f2f2f2'}}>

         
    </View>
  );
}

export default AddressScreen;
