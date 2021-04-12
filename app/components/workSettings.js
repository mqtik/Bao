import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, StatusBar, SafeAreaView, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import ImagePicker from 'react-native-image-picker';


import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, GOOGLE_API_KEY } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';

import styles from '../styles/docScreen.style';

import globalStyles, { globalColors } from '../styles/globals.js';

import { mapStyle, mapNavigation } from '../styles/map.style';

import { getLang, Languages } from '../static/languages';

import Tags from "react-native-tags";
import SwitchSelector from 'react-native-switch-selector';

import Snackbar from 'react-native-snackbar';

import SortableList from 'react-native-sortable-list';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import FastImage from 'react-native-fast-image'

import Modal from "react-native-modal";

import SortRow from './sortRenderRow';
import EditChapter from './editChapter';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

import { ImageColorPicker } from '../../libraries/colorpicker';

import RenderBusiness from './renderBusiness';
import Placeholder, { Line, Media } from "rn-placeholder";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BottomDrawer from '../../libraries/drawer';
import API from '../services/api';
import {Column as Col, Row} from 'react-native-flexbox-grid';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

import { ScrollView } from 'react-native-gesture-handler'

import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker
} from "../../libraries/settings";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

import {DarkModeContext} from 'react-native-dark-mode';
//static contextType = DarkModeContext;

const { Popover } = renderers;

const Remote = new API({ url: API_URL })

export default class WorkSettings extends Component<Props> {
  static contextType = DarkModeContext;
  static navigationOptions = ({ navigation }) => {
          const { params = {} } = navigation.state;
          var value = null;
        return {
          headerBackTitle: null,
          //Default Title of ActionBar
            //Background color of ActionBar
            
            


          //Text color of ActionBar
        };
      };
  constructor(props){
    super(props);
    this.state = {
      activeDoc: null,
      isUploadImg: false
    }
  }
  componentDidMount(){
    //console.log("this props work settings", this.props.navigation.state.params._key)
    //console.log("this props work settings", this.props)
    this.$init();
  }
  $init = () => {
    this.setState({
      activeDoc: this.props.navigation.state.params._key
    })
  }

  $onChangeProp = (state) => {

    this.props.navigation.state.params.onChangesSettings(state);
    if(state.activeDoc && state.toEdit == 'title'){
      this.setState({
        activeDoc: state.activeDoc
      })
    }
    if(state.activeDoc && state.toEdit == 'description'){
      this.setState({
        activeDoc: state.activeDoc
      })
    }
    if(state.activeDoc && state.toEdit == 'tags'){
      this.setState({
        activeDoc: state.activeDoc
      })
    }
    if(state.activeDoc && state.toEdit == 'languages'){

      this.setState({
        activeDoc: state.activeDoc
      })
    }
    if(state.activeDoc && state.toEdit == 'cover'){

      this.setState({
        activeDoc: state.activeDoc
      })
    }

    if(state.activeDoc && state.toEdit){

      this._onSave();
    }
  }

   selectPhotoTapped = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };


    ImagePicker.showImagePicker(options, async(response) => {


      if (response.didCancel) {

      } else if (response.error) {

      } else if (response.customButton) {

      } else {
        let source = {uri: response.uri};

        let data = {
            type: response.type,
            name: response.fileName,
            size: response.fileSize,
            data: response.data,
            source: {uri: response.uri}
          };

       
        

        
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imageData: data,
          isUploadImg: true,
          activeDoc: {
            ...this.state.activeDoc,
            toEdit: 'cover',
            cover: 'data:'+data.type+';base64,'+data.data,
            isUploadImg: false
          }
        }, async() => {
          let f = await(Remote.Work().drafts().coverUp(JSON.stringify(this.state.imageData)));

          let c = f && f.objects && f.objects.colors != null ? f.objects.colors : ['#fff', '#fff', '#fff'];
          this.setState({
                activeDoc: {
                  ...this.state.activeDoc,
                  cover: API_STATIC+'/covers/'+f.objects.filename,
                  colors: c,
                  isUploadImg: true
                }
              })


          this._onSave();
        });

        

      }
    });
  }

  $uploadCover = async(params, colors) => {

    let f = await(Remote.Work().drafts().coverUp(params));
    let c = colors != null ? colors : null;
    this.setState({
          activeDoc: {
            ...this.state.activeDoc,
            cover: API_STATIC+'/covers/'+f.objects.filename,
            colors: c,
            isUploadImg: false
          }
        })


    this._onSave();
  }
  
  _onSave = async() => {
    let f = await(Remote.Work().drafts().onSave(this.state.activeDoc));
    this.setState({activeDoc: f });
    this.props.navigation.state.params._key = f;

    this.props.screenProps.shouldChangeRoot(this.state);

    this.state.toEdit = 'cover';
    if(this.props.navigation.state.params.onChangesSettings){
      this.props.navigation.state.params.onChangesSettings(this.state)
    }


    Snackbar.show({ title: 'Saved', duration: Snackbar.LENGTH_LONG })
    return;
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
  editProp = (which) => {

    this.inProps(this.props.navigation.state, which, this.$onChangeProp.bind(this));
  }

  pickerCallback = message => {

    if (message && message.nativeEvent && message.nativeEvent.data) {
      let payload = JSON.parse(message.nativeEvent.data);

      this.setState({uploadBookColors: payload.payload}) 



      this.$uploadCover(JSON.stringify(this.state.imageData), payload.payload); // response from ImageColorPicker
    } else {
      this.$uploadCover(JSON.stringify(this.state.imageData));
    }

    this.setState({
      isUploadImg: false
    })

    
  };

  _renderCover = () => {


      if(this.state.activeDoc.cover != null){

        return (
          <FastImage source={{uri: encodeURI(this.state.activeDoc.cover) }} style={styles.imageCoverSettings}>
          {this.renderCoverSettings()}

         </FastImage>
          )
      } else {
        return (
           <View style={styles.imageCoverSettings}>
                  {this.renderCoverSettings()}      
                </View>
          )
      }
    }


  changeBookState = (value) => {
    this.setState({
          activeDoc: {
            ...this.state.activeDoc,
            status: value
          }
        })
  }
  renderCoverSettings = () => {
    return (
      <Row size={12}>
                       <Col sm={12} md={12} lg={12} style={{justifyContent: 'center', padding: 5}}>
                         <SwitchSelector
                            initial={this.state.activeDoc.status == 'public' ? 1 : 0}
                            onPress={value => this.changeBookState(value)}
                            textColor={globalColors.lightWhiteText} //'#7a44cf'
                            selectedColor={globalColors.white}
                            buttonColor={globalColors.lowGray}
                            borderColor={globalColors.lightWhiteBorder}
                            backgroundColor={globalColors.lightWhite}
                            activeColor={globalColors.lightWhite}
                            borderRadius={10}
                            disabled={false}
                            hasPadding
                            options={[
                              { label: Languages.private[getLang()], value: "private", customIcon: <EntypoIcono name="block" style={{color: 'rgba(255,255,255,.4)'}}/> }, 
                             
                              { label: Languages.public[getLang()], value: "public", customIcon: <EntypoIcono name="feather" style={{color: 'rgba(255,255,255,.4)'}}/> } //images.masculino = require('./path_to/assets/img/masculino.png')
                            ]}
                          />
                       </Col>
                       <Col sm={12} md={12} lg={12} style={{marginTop: 180}}>
                          <TouchableHighlight 
                             onPress={() => this.selectPhotoTapped()}
                             style={globalStyles.buttonLight}>
                                 <Text style={globalStyles.buttonLightText}>Change cover</Text>
                           </TouchableHighlight>
                       </Col>

                      </Row>
                      )
  }
  $onReturn = () => {
    if(this.state.activeDoc != null){
      return (
        <View style={{flex: 1}}>
          <Row size={12} style={{marginTop: 26}}>
          <Col sm={2} md={2} lg={2} style={{justifyContent: 'center'}}>
              <Button
                  style={{width: '95%', alignSelf: 'center'}}
                  buttonStyle={{borderWidth: 0, backgroundColor: 'transparent'}}
                  onPress={() => this.props.navigation.goBack()}
                  type="outline"
                  icon={
                    <EntypoIcono
                      name="chevron-left"
                      size={30}
                      color={this.context == 'dark' ? '#fff' : '#000'}
                      style={{marginRight: 10}}
                    />
                  }
                />
            </Col>
            <Col sm={6} md={6} lg={6} style={{justifyContent: 'center'}}>
              
            </Col>
            <Col sm={4} md={4} lg={4} style={{justifyContent: 'center'}}>
              {/*<Button
                style={{width: '95%', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,.4)', borderRadius: 8, marginRight: 5}}
                buttonStyle={{borderColor: 'transparent'}}
                titleStyle={{color: Platform.OS == 'ios' ? '#ffffff' : '#000'}}
                onPress={() => this._onSave()}
                type="outline"
                icon={
                  <EntypoIcono
                    name="check"
                    size={15}
                    color="white"
                    style={{marginRight: 10}}
                  />
                }
                title={Languages.Save[getLang()]}
              />*/}
            </Col>

          </Row> 

          <ScrollView style={{marginTop: 10}} contentContainerStyle={{ flexGrow: 1 }}>

          <Row size={12} style={{padding: 10,}}>
            <Col sm={12} md={12} lg={12} style={{justifyContent: 'center'}}>
            <Transition appear='right' shared={this.props.navigation.state.params._key._id} >

              {this._renderCover()}
            </Transition>
            </Col>
          </Row>
            
             
          <Row size={12} style={{marginTop: 5, padding: 10, paddingBottom: getHeaderHeight() * 2}}>
            <Col sm={12} md={12} lg={12} style={{justifyContent: 'center'}}>
             <Text
                   style={[globalStyles.sectionHeaderText, {marginTop: 20, color: this.context == 'dark' ? '#fff' : '#000'}]}>
                      DETAILS
                  </Text>
            <SettingsDividerLong />

            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]} onPress={() => this.editProp('title')}>
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable, {color: this.context == 'dark' ? '#fff' : '#000'}]}>Name</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text numberOfLines={1} style={[globalStyles.settingsItemListEditableValue, {color: this.context == 'dark' ? '#fff' : '#000'}]}>{this.state.activeDoc.title ? this.state.activeDoc.title : 'Add a title'}</Text>
                  </Col>
                  <Col sm={1} md={0.4} lg={0.4} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: this.context == 'dark' ? '#fff' : '#000'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>
            <SettingsDividerLong />
            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]}  onPress={() => this.editProp('author')}>
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable,{color: this.context == 'dark' ? '#fff' : '#000'}]}>{Languages.author[getLang()]}</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditableValue, {color: this.context == 'dark' ? '#fff' : '#000'}]}>{this.state.activeDoc.author ? this.state.activeDoc.author : 'Add author'}</Text>
                  </Col>
                  <Col sm={1} md={0.4} lg={0.4} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: this.context == 'dark' ? '#fff' : '#000'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>
            <SettingsDividerLong />
            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]}  onPress={() => this.editProp('description')}>
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable, {color: this.context == 'dark' ? '#fff' : '#000'}]}>{Languages.description[getLang()]}</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text numberOfLines={1} style={[globalStyles.settingsItemListEditableValue, {color: this.context == 'dark' ? '#fff' : '#000'}]}>{this.state.activeDoc.description ? this.state.activeDoc.description : 'Add a description'}</Text>
                  </Col> 
                  <Col sm={1} md={0.4} lg={0.4} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: this.context == 'dark' ? '#fff' : '#000'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>
            <SettingsDividerLong />
            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]}  onPress={() => this.editProp('tags')}>
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable, {color: this.context == 'dark' ? '#fff' : '#000'}]}>Tags</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text numberOfLines={1} style={[globalStyles.settingsItemListEditableValue, {color: this.context == 'dark' ? '#fff' : '#000'}]}>{this.state.activeDoc.tags ? this.state.activeDoc.tags.length : '0'} tags</Text>
                  </Col>
                  <Col sm={1} md={0.4} lg={0.4} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: this.context == 'dark' ? '#fff' : '#000'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>
            <SettingsDividerLong />
            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]}  onPress={() => this.editProp('languages')}>
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable,{color: this.context == 'dark' ? '#fff' : '#000'}]}>{Languages.language[getLang()]}</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text numberOfLines={1} style={[globalStyles.settingsItemListEditableValue, {color: this.context == 'dark' ? '#fff' : '#000'}]}>{this.state.activeDoc.language ? this.state.activeDoc.language : 'Set language'}</Text>
                  </Col>
                  <Col sm={1} md={0.4} lg={0.4} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: this.context == 'dark' ? '#fff' : '#000'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>



            {/*
            <SettingsDividerLong />
            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]} >
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable,{color: this.context == 'dark' ? '#fff' : '#000'}]}>Derechos de autor</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditableValue,{color: this.context == 'dark' ? '#fff' : '#000'}]}>Value</Text>
                  </Col>
                  <Col sm={1} md={1} lg={1} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: 'rgba(255,255,255,.4)'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>
            <SettingsDividerLong />
            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]} >
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable, {color: this.context == 'dark' ? '#fff' : '#000'}]}>Completado</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditableValue, {color: this.context == 'dark' ? '#fff' : '#000'}]}>Value</Text>
                  </Col>
                  <Col sm={1} md={1} lg={1} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: 'rgba(255,255,255,.4)'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>
            <SettingsDividerLong />
            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]} >
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable, {color: this.context == 'dark' ? '#fff' : '#000'}]}>Rango de edad</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditableValue, {color: this.context == 'dark' ? '#fff' : '#000'}]}>Value</Text>
                  </Col>
                  <Col sm={1} md={1} lg={1} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: 'rgba(255,255,255,.4)'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>
            <SettingsDividerLong />
            <TouchableOpacity style={[globalStyles.settingsItemList, {marginBottom: 5, marginTop: 5}]} >
              <View>
                <Row size={12} style={{marginTop: 0, padding: 10}}>
                  <Col sm={5} md={5} lg={5} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditable, {color: this.context == 'dark' ? '#fff' : '#000'}]}>Contenido erótico</Text>
                  </Col>
                  <Col sm={6} md={6} lg={6} style={{}}>
                    <Text style={[globalStyles.settingsItemListEditableValue, {color: this.context == 'dark' ? '#fff' : '#000'}]}>Value</Text>
                  </Col>
                  <Col sm={1} md={1} lg={1} style={{marginTop: 3, paddingLeft: 10 }}>
                    <EntypoIcono name="chevron-thin-right" size={15} style={{color: 'rgba(255,255,255,.4)'}}/>
                  </Col>
                </Row>
              </View>
            </TouchableOpacity>
            <SettingsDividerLong />
          */}
            <SettingsDividerLong />
                            
                         </Col>
          <Col sm={7} md={7} lg={7} style={{justifyContent: 'center'}}>
             
          </Col>
          <Col sm={5} md={5} lg={5} style={{justifyContent: 'center'}}>
           
          </Col>
          </Row>
          
          </ScrollView>
            
          
          </View>
          )
    } else {
       return (
        <ActivityIndicator
              style={[styles.indicator, {zIndex: 99}]}
              color="#fff"
              size="large"
            />
        )
    }
  }
  render() {
    return (
          <View style={{flex: 1}}>
         {this.$onReturn()}
          
          </View>
        )
  //<Text style={[globalStyles.settingsHeadline, {padding: 5, textAlign: 'center'}]}>Details</Text>
  }
}