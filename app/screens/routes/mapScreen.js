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
import { TouchableRipple, Searchbar } from "react-native-paper";
import MapView from 'react-native-maps';
import { mapStyle } from '../../styles/map.style';

import Drawer from '../../components/drawer.js';

const Touchable = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback;


var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
const initialLayout = { width: ancho };

function MapScreen({route, navigation}){
  const isDarkMode = useDarkMode();
  const ClouchDB = useContext(Clouch);
  const BaoDB = useContext(Newt);
  const drawerRef = React.useRef();
  const [ query, setQuery ] = useState('')
  // Effects
  useEffect(() => {
    navigation.setOptions({
      headerTitle: <Text style={{textTransform: 'capitalize'}}>Mapa</Text>,
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
      )
    });
  },[]);

  function _renderDrawer(){
    return (
      <View style={{height: '100%', maxHeight: '100%', width: '100%', backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'}}>
        <View>

        </View>
      </View>)
  }

  function _renderHeader(){
    return (
      <View style={{backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'}}>
        <View style={{display: 'flex', width: '95%', alignSelf: 'center'}}>
          <Searchbar
                placeholder="Search"
                onChangeText={(text) => setQuery(text)}
                value={query}
                style={{marginTop: 20}}
                onSubmitEditing={() => $onSearch(query)}
              />
        </View>
      </View>
              )
  }

  return (
     <View style={{flex:1, justifyContent: 'center', display: 'flex', backgroundColor: isDarkMode == true ? '#111111' : '#f2f2f2'}}>
      <MapView
        style={{flex:1, height: '100%'}}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

       <Drawer 
            bgColor={{backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'}}
            innerStyle={{
              //backgroundColor: isDarkMode == true ? '#111' : '#fff'
            }} 
            scaleTwo={false}
            style={{backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'}}
            theme={isDarkMode == true ? 'dark' : 'light'}
            header={() => _renderHeader()} 
            ref={drawerRef}>
              {_renderDrawer()}
            </Drawer>
         
    </View>
  );
}

export default MapScreen;
