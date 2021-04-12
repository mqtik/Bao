import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, Dimensions, RefreshControl, InputAccessoryView, KeyboardAvoidingView } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, GOOGLE_API_KEY } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory'

import ImagePicker from 'react-native-image-picker';

import { mapStyle, mapNavigation } from '../styles/map.style';

import { getLang, Languages } from '../static/languages';

import SortableList from 'react-native-sortable-list';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import Swiper from 'react-native-swiper'

import SortRow from './sortRenderRow';
import { MenuProvider } from 'react-native-popup-menu';

import RenderBusiness from './renderBusiness';
import Placeholder, { Line, Media } from "rn-placeholder";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BottomDrawer from '../../libraries/drawer';
import API from '../services/api';
import {Column as Col, Row} from 'react-native-flexbox-grid';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

import Permissions from 'react-native-permissions';
const { width, height } = Dimensions.get('window');

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover, SlideInMenu, ContextMenu } = renderers;




const Remote = new API({ url: API_URL })



export default class WorkTitle extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
          const { params = {} } = navigation.state;
          var value = null;
        return {
          //Default Title of ActionBar
            //Background color of ActionBar
            
            


          //Text color of ActionBar
        };
      };
  constructor(props){
    super(props);
    
    this.state = {
      placeholderEditTitle: Languages.placeholderEditTitle[getLang()],
      
      changed: false
    }
    //console.log("this props key", this.props.docKey)
    if(this.props.docKey && this.props.docKey.title){

      this.state.value = this.props.docKey.title;

      //console.log("estado title", this.state.value)
    }
    
    this.editor = null;
  }
  componentDidMount(){
    

    //this.setState({activeChapter: this.props.doc})
    //console.log("state chapter!", this.state.activeChapter)
    //console.log("Key map through", this.props.navigation.state.params._key)
    //console.log("Region map through", this.props.navigation.state.params._region)
  }

  componentWillReceiveProps(props){


      if(props.docKey != null){
        this.props = props;
      this.setState({value: props.docKey.title})
      }
      
  }

  _saveTitle = (text) => {

    this.setState({value: text})
    //this.state.value = text;

    this.props.docKey.title = text;
    this.props.docKey.unsaved = true;
    
  }

  render() {
    return (

      <View style={{ height:50}}>
        <TextInput
                            //onChangeText={(text) => this.setState({title: text})}
                            style={{ alignSelf: 'flex-start', color: '#fff', fontSize: 18, width: '100%', height: 40, backgroundColor: 'rgba(0,0,0,.6)', borderRadius: 4, height: 30, padding: 5}}
                            value={this.state.value}
                            placeholder={"Name of the chapter"}
                            onChangeText={(text) => this._saveTitle(text)}
                            placeholderTextColor="#999"
                            multiline={false}
                            autoCapitalize = 'none'
                            autoCorrect={false}
                          />
          </View>

      )
  }
}

const styles = StyleSheet.create({
  wrapper: {

  },
  container: {
    flex: 1,
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  halfScroll: {
    flex: 1,

  },
  bottomBar: {
  },
  editTitleContainer: {
    borderBottomWidth: 1,
    height: 72,
    backgroundColor: '#ddd',
    borderColor: '#eaeaea' 
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
    textAreaContainer: {
    borderColor: '#eaeaea',
    borderWidth: 0,
    padding: 15,
  },
  textArea: {
    fontSize: 19,
    justifyContent: "flex-start"
  },
  main: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        alignItems: 'stretch',
    },
    toolbar: {
      borderWidth: 0,
      backgroundColor: 'transparent',
      zIndex: 99
    },

    toolbarContainer: {
    },
    richEditor: {
      backgroundColor: '#eaeaea',
      flexGrow: 1
    },
    toolbarButton: {
        fontSize: 20,
        width: 40,
        height: 30,
        padding: 6,
        borderRadius: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    italicButton: {
        fontStyle: 'italic'
    },
    boldButton: {
        fontWeight: 'bold'
    },
    underlineButton: {
    },
    lineThroughButton: {
    },
    headingButton: {
      color: '#999',
      paddingTop:7,
      fontSize: 15
    }
});

