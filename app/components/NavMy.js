import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActionSheetIOS, ActivityIndicator, Keyboard, View, Button, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView , Dimensions, TouchableWithoutFeedback} from 'react-native';
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
const { Popover, SlideInMenu, ContextMenu } = renderers;





var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
export default class NavMy extends Component<Props>{
  static contextType = DarkModeContext;
    constructor (props) {
        super(props);
        this.state = {
          currentState: 'tools',
          rootUser: null,
          countDrafts: 0,
          search: null
        }
    }
    componentDidMount() {
     // console.log("NavMy", this.props)
    
      this.$init();
     // console.log("Render Business Props", this.props)
    }
                 
    $init = async() => {




      //console.log("navbar logged user!", u, this.state)
     // console.log("Usuario NavMy:", u)
    }
    componentWillReceiveProps() {
      //console.log("Receive NavMy", this.props)

      
        
      
    }

    updateSearch = search => {
    //console.log("update search!", search)
      this.setState({ search: search });
      this.props.updateSearch(search)
  };
    renderSearchBox = () => {
      return (
        <View style={{marginTop: 13}}><SearchBar

              placeholder="Find your books"
              disabled={true}
              platform="ios"
              cancelButtonTitle="X"
              style={{ left: 5, right: 5, zIndex: -1}}
              disabled={true}
              inputStyle={{backgroundColor: 'transparent', height:50}}
              containerStyle={{flex: 1, height: 50, backgroundColor: 'transparent', borderWidth: 0, margin:0, padding:0, borderRadius: 5}}
              placeholderTextColor={'#666'}
              onChangeText={this.updateSearch}
              value={this.state.search}
              autoFocus={true}
              onCancel={() => this._onCancel()}
              
            /></View>
            )
    }

    _renderImageFromAvatar = () => {
      if(this.props.rootUser.avatar){
        return FastImage ? (
                    <FastImage 
                      source={{ uri: encodeURI(this.props.rootUser.avatar) }}
                      style={[styles.image,{height: '100%', width: '100%', marginLeft: 0, marginTop: 0, borderRadius: 50, backgroundColor: '#222'}]}
                      resizeMode={FastImage.resizeMode.cover}
                      >

                      </FastImage>
                      
                  ) : (
                      <Image style={styles.image} source={{uri: encodeURI(this.props.rootUser.avatar)}}/>
                  )
      } else {
        return null;
      }
                
  }

  _onAdd = () => {
    if(Platform.OS == 'ios'){
      ActionSheetIOS.showActionSheetWithOptions(
                                          {
                                            options: ['Import from EPUB', 'Create Work', 'Cancel'],
                                            destructiveButtonIndex: 1,
                                            cancelButtonIndex: 2,
                                          },
                                          (buttonIndex) => {
                                            if (buttonIndex === 0) {
                                              /* destructive action */
                                              this.props.importFiles()

                                            }
                                            if(buttonIndex === 1){
                                              this.props.createWork()
                                            }
                                            if(buttonIndex === 2){

                                            }
                                          },
                                        );
    }
    
  }

    renderAllTools = () => {

      return (
        <View size={12} style={{flexDirection: 'row', height: 44, backgroundColor: 'transparent', width: 80}}>
          {Platform.OS == 'ios' && 
                <TouchableOpacity 
                  style={{ justifyConetnt: 'flex-start', marginRight:5,marginTop: 10, padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.9)', borderRadius: 50, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1}} 
                  onPress={() => this._onAdd() }>
                  
                      <Material
                              name="plus"
                              size={20}
                              color={this.context == 'dark' ? '#000' : '#fff'}
                              style={{padding: 1, alignSelf: 'flex-start'}}
                            />

                  </TouchableOpacity>
                }

                  {Platform.OS == 'android' && 
                    <Menu ref={r => (this.menu = r)} renderer={Popover} rendererProps={{ preferredPlacement: 'right', anchorStyle: {backgroundColor: '#222'} }} style={{backgroundColor: 'transparent', borderRadius: 8}}>
                      <MenuTrigger style={{ justifyConetnt: 'flex-start', marginTop: 10, padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.9)', borderRadius: 50, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1}} >
                         
                  
                      <Material
                              name="plus"
                              size={20}
                              color={this.context == 'dark' ? '#000' : '#fff'}
                              style={{padding: 1, alignSelf: 'flex-start'}}
                            />


                      </MenuTrigger>
                      <MenuOptions
                        optionsContainerStyle={styles.popOver}
                        >


                        <MenuOption onSelect={() => this.props.createWork()}>
                          <Text style={{color: '#ff7575', fontSize: 18}}>{Languages.createWork[getLang()]}</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => this.props.importFiles()} >
                          <Text style={{color: '#fff', fontSize: 18}}>{Languages.importFromEpub[getLang()]}</Text>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  }

                <TouchableOpacity 
                  style={{ justifyConetnt: 'flex-start', marginTop: 10, padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.9)', borderRadius: 50, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1}} 
                  onPress={() => this._onSearch() }>
                  
                      <Material
                              name="cloud-search"
                              size={20}
                              color={this.context == 'dark' ? '#000' : '#fff'}
                              style={{padding: 1, alignSelf: 'flex-start'}}
                            />

                  </TouchableOpacity>
              {/*<Col sm={4.5} md={6} lg={5} style={{justifyContent: 'flex-start'}}>
                <View style={{alignSelf: 'flex-start', marginLeft: 15, marginTop: 10, padding: 0,width: 34, height: 35, backgroundColor: 'rgba(0,0,0,.3)', borderRadius:30, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1}}>
                  
                  {this.props.rootUser != null && this._renderImageFromAvatar()}

                </View>

                <View style={{alignSelf: 'flex-start', marginTop: -27, marginLeft: 60, width: '100%', height: 30}}>
                  <Text numberOfLines={1} style={{color: this.context == 'dark' ? '#fff' : '#000', fontWeight: '500'}}>@{this.props.rootUser != null && this.props.rootUser.name}</Text>
                </View>
              </Col>

             
              <Col sm={5} md={4.5} lg={5} style={{justifyContent: 'center'}}>
                <View style={{alignSelf: 'flex-end', marginTop: 5, justifyContent: 'center',marginLeft: 15, marginRight: 0, height: 30, minWidth: 30, backgroundColor: 'rgba(0,0,0,.5)', borderRadius: 30}}>
                  <Text style={{paddingLeft: 10, paddingRight: 10, marginTop: 1.4,fontSize: 12, color: '#fff', fontWeight: '700',  textShadowColor: 'rgba(0, 0, 0, 0.75)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 10}}>
                  {(this.props.drafts ? this.props.drafts : 0)}
                 </Text>
                  
                </View>
              </Col>*/}
              </View>
              );
    }
    _onSearch = () => {
        this.props.showSearch();

    }
    _onCancel = () => {
      this.setState({
        currentState: 'tools'
      })
    }

    render(){
       
        return(
          

        <View style={{height: 40, width: '100%'}}>
              { this.state.currentState == 'search' && this.renderSearchBox() }
              { this.state.currentState == 'tools' && this.renderAllTools() }
            
              
            </View>
        );
        /* 

  
  




        <Col sm={3} md={3} lg={3} style={{justifyContent: 'center'}}>
                <TouchableHighlight
                  onPress={() => Keyboard.dismiss(0)}
                                style={{alignSelf: 'flex-end', height: 50, marginRight: 0, width: 50, zIndex: 9999}}>

                        <Menu ref={r => (this.menu = r)} renderer={SlideInMenu} rendererProps={{ placement: 'bottom', preferredPlacement: 'bottom', anchorStyle: {backgroundColor: 'transparent'} }} style={{backgroundColor: 'transparent', borderRadius: 8}}>
                          <MenuTrigger style={{height: 40, width: 50}}>
                          
                          <AntDesign
                                name="closecircleo"
                                size={25}
                                style={{textAlign: 'right', marginTop: 10, alignSelf: 'center'}}
                                color={this.state.unsaved ? 'red' : 'white'}
                              />
                          
                          </MenuTrigger>
                          <MenuOptions
                            optionsContainerStyle={{backgroundColor: 'transparent' }}
                            >
                            <MenuOption style={{backgroundColor: '#1ebe55', borderRadius: 8, padding: 15, margin: 5}} onSelect={() => this._saveAllWork(key)}>
                              <Text style={{color: '#fff', fontSize: 22 }}>Save</Text>
                            </MenuOption>
                            <MenuOption style={{backgroundColor: '#c53e3e', borderRadius: 8, padding: 15, margin: 5}} onSelect={() => this._deleteCurrentChapter(key)} >
                              <Text style={{color: '#fff', fontSize: 22}}>Delete part</Text>
                            </MenuOption>
                            <MenuOption style={{backgroundColor: '#222', borderRadius: 8, padding: 15, margin: 5}} onSelect={() => this._closeEditor()} >
                              <Text style={{color: '#fff',fontSize: 22}}>Discard changes</Text>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>


                        
                        </TouchableHighlight>
              </Col> */
    }
    
}