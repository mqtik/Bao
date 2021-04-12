import React, {Component, PureComponent, useState, useContext, useEffect} from 'react';
import {Platform, TouchableNativeFeedback, StyleSheet, Text, FlatList, Alert, TextInput, ActivityIndicator, View, Dimensions } from 'react-native';

import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../../utils/context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation, getHeaderNavHeight} from '../../services/sizeHelper';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { HomeSVG, MenuIcon } from "../../utils/vectors"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionList, NewSectionList, GridList, ListNotification } from '../../utils/renders'
import { SkeletonSection, SkeletonGrid, SkeletonList } from '../../utils/skeletons'
import globalStyles, { globalColors } from '../../styles/globals.js';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover, SlideIn } = renderers;

import Modal from "react-native-modal";
import update from 'immutability-helper';


import { Button, IconButton, Colors } from 'react-native-paper';
import AwesomeButton from "react-native-really-awesome-button";

import { TouchableRipple } from 'react-native-paper';

const Touchable = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback;

const SecondRoute = () => (
  <View />
);

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
const initialLayout = { width: ancho };

function CollectionsScreen({route, navigation}){
  const { _id } = route.params;
  const isDarkMode = useDarkMode();
  const ClouchDB = useContext(Clouch);
  const NewtDB = useContext(Newt);
  const [collection, setCollection] = React.useState(null);
  const [ modalOpen, setModalOpen] = React.useState(false);
  const canEdit = (NewtDB.rootUser && collection && collection.userId == NewtDB.rootUser.name) ? true : false;
  // Effects
  useEffect(() => {
    //console.log("collection screen!", _id)
    // navigation.setOptions({
    //   headerTitle: capitalizeFirstLetter(title) || 'Books for you'
    // });
    if(_id){
      $collection(_id)
    }
  },[]);

  useEffect(() => {
    if(collection != null){
      navigation.setOptions({
        headerTitle: collection.title,
        headerRight: props => canEdit ? (<Menu 
                              renderer={SlideIn} 
                              rendererProps={{ preferredPlacement: 'bottom', placement: 'bottom', anchorStyle: {backgroundColor: '#222'} }} 
                              style={{backgroundColor: 'transparent', borderRadius: 8, paddingRight:5}}
                              >
                              <MenuTrigger borderRadius={50} style={{width: 45, height: 45, paddingTop: 0, justifyContent: 'center', alignItems: 'center', borderRadius:50}}>
                                <Icon name="dots-vertical" size={23} style={{color: isDarkMode == true ? '#fff' : '#111'}} />
                              </MenuTrigger>
                              <MenuOptions
                                optionsContainerStyle={[globalStyles.popOver]}
                                >
                                <MenuOption onSelect={() => setModalOpen(true)} style={[globalStyles.popOverOption]}>
                                  <Icon name="pencil" size={23} backgroundColor={'transparent'}  color={"#2575ed"} style={globalStyles.popoverOptionIcon} />
                                  <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>Edit</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => deleteCollection()} style={[globalStyles.popOverOption]}>
                                  <Icon name="close" size={23} backgroundColor={'transparent'}  color={"#2575ed"} style={globalStyles.popoverOptionIcon} />
                                  <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>Delete</Text>
                                </MenuOption>
                              </MenuOptions>
                            </Menu>) : null
    });
    }
  },[collection]);

  async function $collection(id){
    if(id){
      let f = await ClouchDB.Collections().findByIdWithBooksAsRows(id);
      //console.log("return ollection!", f)
      setCollection(f)
      
    }

  }

  async function editCollection(){

  }
  function LikedCore(){
    const NewtDB = useContext(Newt);
    if(NewtDB.liked == null){
      return <SkeletonGrid />
    }
    return (
          <GridListHome
           to={'grid'}
           items={NewtDB.liked && NewtDB.liked.rows}
          />
         )
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function setCollectionTitle(title){
    setCollection((prevState) => update(prevState, { 
          title: {
            $set: title
          }
    }));
  }
  function deleteCollection(){
    if(!collection){ return; }
    Alert.alert(
            'Delete collection',
            'This cannot be undone',
            [
              {
                text: 'Cancel', 
                style: 'cancel',
              },
              {
                text: 'Delete',
                onPress: async() => {
                    NewtDB.removeCollection(collection);
                    navigation.goBack()
                },
              }
            ],
            {cancelable: true},
          );
    
  }
  //<GridList items={items} />
  if(collection == null){
      return (
        <View style={{flex:1, backgroundColor: isDarkMode == true ? '#111111' : '#f2f2f2'}}>
          <SkeletonGrid />
        </View>)
    }
  return (
     <View style={{flex:1, backgroundColor: isDarkMode == true ? '#111111' : '#f2f2f2'}}>
      <GridList items={collection.rows} />
       
      <Modal 
                  style={[componentStyles.sessionContainer, {width:ancho,margin:0, marginTop:getHeaderHeight()}]}
                  isVisible={Boolean(modalOpen)}
                  animationIn={'fadeIn'}
                  animationOut={'fadeOut'}
                  hasBackdrop={true}
                 // avoidKeyboard={true}
                 //propagateSwipe={false}
                  deviceWidth={ancho}
                  onSwipeComplete={() => setModalOpen(false)}
                  swipeDirection="down"
                  swipeThreshold={10}
                  deviceHeight={alto}
                  //propagateSwipe
                  >
                  <View style={componentStyles.modalView}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  borderBottomWidth: 2, borderColor: '#eaeaea', padding: 4}}>
                    <Text style={{fontSize: 20, color: '#000', fontWeight: '500',marginLeft: 5}}>Edit Collection</Text>
                    <IconButton
                        icon="chevron-down"
                        color={'#000'}
                        size={20}
                        onPress={() => setModalOpen(false)}
                      />
                  </View>
                  <View>
                    <TextInput
                      style={[componentStyles.input, { backgroundColor: '#eaeaea' }]}
                      componentStyles={'Name'}
                      value={collection.title}
                      onChangeText={(e) => setCollectionTitle(e)}
                    />
                      <AwesomeButton
                                  progress
                                  onPress={async(next) => {
                                    if(collection){
                                      NewtDB.editCollection(collection);
                                    }
                                    setModalOpen(false);
                                    next()
                                  }}
                                  style={{margin: 5,position:'absolute',right:5}}
                                  width={50}
                                  height={50}
                                  raiseLevel={0}
                                  borderRadius={30}
                                  borderColor={'#111'}
                                  delayPressIn={0}
                                  delayPressOut={0}
                                  borderWidth={1}
                                  textSize={17}
                                  backgroundColor={'#000'}
                                  backgroundProgress={'#333'}
                                >
                                  <Icon name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
                          </AwesomeButton>  
                    </View>
                  </View>
            </Modal>  
    </View>
  );
}

export default CollectionsScreen;

const componentStyles = StyleSheet.create({
  sessionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  modalView: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    borderTopLeftRadius:8,
    borderTopRightRadius: 8
  },
  input: {
      margin: 0,
      height: 60,
      borderColor: 'rgba(255,255,255,.1)',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderWidth: 1,
      width: '100%',
      padding: 10,
      borderRadius: 0,
      fontSize: 20
   },
}); 
