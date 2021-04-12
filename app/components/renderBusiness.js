import React, {Component, PureComponent} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, ImageBackground, ScrollView, StatusBar, SafeAreaView , Dimensions, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

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

import {DarkModeContext} from 'react-native-dark-mode';
//static contextType = DarkModeContext;

import Snackbar from 'react-native-snackbar';

import * as Progress from 'react-native-progress';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['title'];

import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-spinkit'

import { FlatList } from 'react-native-gesture-handler'

import { NoWorks } from './illustrations';

import { createImageProgress } from 'react-native-image-progress';

const Image = createImageProgress(FastImage);

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover } = renderers

const Remote = new API({ url: API_URL })
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
export default class RenderBusiness extends PureComponent {
  static contextType = DarkModeContext;
    constructor(props){
      super(props);

      this.state = {
        itemsCount: 30
      }
    }

    previewWork = (key) => {
      key.offline = true;
      this.props.navigation.navigate('Details',{
                                          currentDoc: key,
                                          allDocs: [key],
                                          indexOfSlider: 0
                                        });
  }

    goBusiness = (key) => {
      this.props.navigation.navigate('Go', {
        _key: key.item,
        updateDoc: (doc) => this.props.updateDocs(doc)
      })
    }

    componentDidMount(){
      //console.log("RENDER BUSSINNESS PROP", this.props)
    }
    _renderCover = (key) => {
      //console.log("KEY!", key)
      if(key.cover != null){
        //console.log("KEY COVER!", key.title, key.cover)
        return (
          <Image 
            source={{uri: encodeURI(key.cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.web }}
            indicator={Progress.Circle}
            imageStyle={{borderRadius: 10}}
            indicatorProps={{
                        size: 80,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
              style={{
                      backgroundColor: 'rgba(0,0,0,.4)',
                      width: 50,
                      marginLeft: 10,
                      borderRadius: 10,
                      height: 60
                    }}>

         </Image>
          )
      } else {
        return (
           <View style={styles.imageCover}>
                <EntypoIcono name="documents" style={{ color: '#fff', fontSize: 20, marginLeft: 14, marginTop: 18}}/>
              </View>
          )
      }
    }

    

    deleteWork = async(id) => {
      Alert.alert(
            'Are you sure you want to delete this work?',
            'You might be able to recover it from revisions',
            [
              {
                text: 'Delete', 
                  onPress: async() => {
                    let n = await(Remote.Work().drafts().delete(id));
                    //__DEV__ && console.log("nno worrr", n)
                    if(n == null){
                      Snackbar.show({ title: Languages.tryAgainLater[getLang()], duration: Snackbar.LENGTH_SHORT })
                      return;
                    }

                    /*var array = [...this.props.businessList];
                    let bookIndex = _.findIndex(this.props.businessList, ['_id', id]);

                    this.props.businessList.splice(bookIndex, 1);
                    this.props.shouldDeleteWork(this.props.businessList);*/
                    //console.log("business list", this.props.businessList)
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

    renderRowDoc = (key, index) => {



      return (
         <View key={key.item._id} style={{ flex: 1, marginTop: 10, width: '100%'}}>
           <Row size={12}>
            <Col sm={2} md={1} lg={2} style={{justifyContent: 'flex-start'}}>

            <TouchableOpacity onPress={() => this.goBusiness(key)}>
            <Transition shared={key._id} appear='scale' disappear='bottom'>
              {this._renderCover(key.item)}
            </Transition>
            </TouchableOpacity>

            </Col>
            <Col sm={8} md={10} lg={8}i style={{paddingLeft: 10}}>

            
            <TouchableOpacity onPress={() => this.goBusiness(key)}>

               <Text style={{marginTop: 10, fontSize: 16,
                fontWeight: 'bold',
                color: this.context == 'dark' ? '#fff' : '#000',
                textAlign: 'left'}} numberOfLines={1}>

                  {key.item.title}

                </Text>
                 <Text style={{marginTop: 2, fontSize: 13,
                color: this.context == 'dark' ? '#7d7d7d' : '#333',
                textAlign: 'left'}}>
 
                 {
                   (key.item.status == "public") ? Languages.public[getLang()] : Languages.private[getLang()]
                 }
                 
                </Text>
               
            </TouchableOpacity>
              
            </Col>
            <Col sm={2} md={1} lg={2} style={{paddingLeft: 10, marginTop: 5}}>
               
              <Menu ref={r => (this.menu = r)} renderer={Popover} rendererProps={{ preferredPlacement: 'left', anchorStyle: {backgroundColor: '#222'} }} style={{backgroundColor: 'transparent', borderRadius: 8}}>
                <MenuTrigger>
               <Entypo name="dots-two-vertical" style={{color: this.context == 'dark' ? 'rgba(255,255,255,.5)' : '#333', fontSize: 30, textAlign: 'right', marginTop: 6, alignSelf: 'center'}} />
              
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={[styles.popOver,{width: 120}]}
                  >
                  <MenuOption onSelect={() => this.goBusiness(key)}>
                    <Text style={{color: '#fff', fontSize: 18}}>{Languages.edit[getLang()]}</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => this.props.onShareBook(key.item)}>
                    <Text style={{color: '#fff', fontSize: 18}}>{Languages.share[getLang()]}</Text>
                  </MenuOption>
                   <MenuOption onSelect={() => this.previewWork(key.item)}>
                    <Text style={{color: '#fff', fontSize: 18}}>{Languages.Preview[getLang()]}</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => this.deleteWork(key.item._id)} >
                    <Text style={{color: '#c53e3e', fontSize: 18}}>{Languages.delete[getLang()]}</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </Col>
          </Row> 
         </View>
                            )

    }

    loadMoreDocs = () => {
      this.setState({
        itemsCount: this.state.itemsCount + 30
      })
    }

    render(){


       
       
       if(this.props.businessList != null && this.props.businessList.length > 0){

        const filtersBooks = this.props.businessList.slice(0, this.state.itemsCount);
        //console.log("filtered", filtersBooks)
        return(
            


             <FlatList
               data={filtersBooks}
               keyExtractor={item => item._id}
               initialNumToRender={10}
              maxToRenderPerBatch={10}
              onEndReached={()=>this.loadMoreDocs()}
                onEndReachedThreshold={0.5}
              updateCellsBatchingPeriod={2000}
              contentContainerStyle={{paddingBottom: getHeaderHeight() * 3 - 10}}
               style={styles.scrollViewBooks}
               renderItem={(item, index) => this.renderRowDoc(item, index)}
            />  
        );
      } else {
        return (
          <View style={{width: '100%', height: '90%',justifyContent: 'center', alignItems: 'center'}}>
          <NoWorks />
            <Text style={{color: this.context == 'dark' ? '#fff' : '#333',  textAlign: 'center', fontSize: 22}}>
              {Languages.noWorksYet[getLang()]}
            </Text>

          </View>
          )
      }
    }
    
}