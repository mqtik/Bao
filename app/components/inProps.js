import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

import ImagePicker from 'react-native-image-picker';

import { systemWeights } from 'react-native-typography'

import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, GOOGLE_API_KEY } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';

import styles from '../styles/docScreen.style';
import Snackbar from 'react-native-snackbar';
import globalStyles, { globalColors } from '../styles/globals.js';

import { mapStyle, mapNavigation } from '../styles/map.style';

import { getLang,getLangString, Languages, arrayLanguages } from '../static/languages';

import Tags from "react-native-tags";
import SwitchSelector from 'react-native-switch-selector';

import CustomMultiPicker from './lib_multi_select';

import Placeholder, { Line, Media } from "rn-placeholder";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import API from '../services/api';
import {Column as Col, Row} from 'react-native-flexbox-grid';

import {DarkModeContext} from 'react-native-dark-mode';
//static contextType = DarkModeContext;

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
const { Popover } = renderers;

const Remote = new API({ url: API_URL })

export default class InProps extends Component<Props> {
  static contextType = DarkModeContext;
  // static navigationOptions = ({ navigation }) => {
  //       const { params = {} } = navigation.state;

  //       return {
  //         headerBackTitle: null,
  //         title: navigation.getParam('book-title', 'Processing...'),
  //         headerRight: (
  //             <TouchableOpacity onPress={() => params.onSave()} style={{marginRight: 10}}>
  //                 <Text style={{color: params.darkModeHeader == 'dark' ? '#fff' : '#000', fontSize: 16}}>
  //                   Save
  //                 </Text>
  //             </TouchableOpacity>
  //           ),
  //         //Default Title of ActionBar
  //           //Background color of ActionBar
          
  //         //Text color of ActionBar
  //       };
  //     };
  constructor(props){
    super(props);
    this.state = {
      activeDoc: props.route.params.activeDoc,
      toEdit: props.route.params.toEdit,
      height: 0
    }
  }
  componentDidMount(){
    this.props.navigation.setOptions({
      headerTitle: this.state.activeDoc.title,
      Location: this.state.toEdit,
      headerRight: props => (
              <TouchableOpacity onPress={() => this._onSave()} style={{marginRight: 10, backgroundColor: '#111', borderRadius: 8, padding:7}}>
                  <Text style={{color: '#fff', fontSize: 16}}>
                    Save
                  </Text>
              </TouchableOpacity>
            ),
    });

    this.$init()
  }

  _onSave = () => {
    if(this.state.toEdit == 'userProfile-email'){
      if(this.state.activeDoc.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
          return Snackbar.show({ title: Languages.mailFormatInvalid[getLang()], duration: Snackbar.LENGTH_SHORT });
        }
    }
      this.props.route.params.toUpdate(this.state);
      this.props.navigation.goBack()
    }

  $init = async() => {
    this.setState({
      activeDoc: this.props.route.params.activeDoc,
      toEdit: this.props.route.params.toEdit
    })
    if(this.props.route.params.toEdit && this.props.route.params.toEdit == 'book-title'){
     
      this.props.navigation.setOptions({
        headerTitle: 'Book Title',
        Location: this.state.toEdit
      });
    } else if(this.props.route.params.toEdit && this.props.route.params.toEdit == 'book-author'){
     
      this.props.navigation.setOptions({
        headerTitle: 'Book Author',
        Location: this.state.toEdit
      });
    } else if(this.props.route.params.toEdit && this.props.route.params.toEdit == 'userProfile-email'){
      this.props.navigation.setOptions({
      headerTitle: 'E-mail',
      Location: this.state.toEdit
    });
    } else if(this.props.route.params.toEdit && this.props.route.params.toEdit == 'book-language'){

      this.props.navigation.setOptions({
        headerTitle: 'Languages',
        Location: this.state.toEdit
      });
    }

    else if(this.props.route.params.toEdit && this.props.route.params.toEdit == 'book-tags'){
      this.props.navigation.setParams({
          title: 'Tags',
          Location: this.state.toEdit
        });
      this.props.navigation.setOptions({
        headerTitle: 'Tags',
        Location: this.state.toEdit
      });
    } 
    else if(this.props.route.params.toEdit && this.props.route.params.toEdit == 'userProfile-full_name'){

      this.props.navigation.setOptions({
        headerTitle: 'Full Name',
        Location: this.state.toEdit
      });
    } else if(this.props.route.params.toEdit && this.props.route.params.toEdit == 'userProfile-languages'){
      this.props.navigation.setOptions({
        headerTitle: 'Languages',
        Location: this.state.toEdit
      });
    }
    
  }

  _saveTitle = (text) => {

    //this.setState({value: text})
    //this.state.value = text;
    this.setState({
      activeDoc: {
        ...this.state.activeDoc,
        title: text
      }
    })

  }

  _saveAuthor = (text) => {

    //this.setState({value: text})
    //this.state.value = text;
    this.setState({
      activeDoc: {
        ...this.state.activeDoc,
        author: text
      }
    })
  }

  _saveFullName = (text) => {

    //this.setState({value: text})
    //this.state.value = text;
    this.setState({
      activeDoc: {
        ...this.state.activeDoc,
        full_name: text
      }
    })
  }

  _saveEmail = (text) => {

    //this.setState({value: text})
    //this.state.value = text;
    this.setState({
      activeDoc: {
        ...this.state.activeDoc,
        email: text
      }
    })

  }
  _setUserLanguage = (lang) => {
    this.setState({
      activeDoc: {
        ...this.state.activeDoc,
        language: lang[0]
      }
    })

  }

  _saveDescription = (text) => {

   // this.setState({value: text})
    this.setState({
      activeDoc: {
        ...this.state.activeDoc,
        description: text
      }
    })
  }

  _setTags = (text) => {

   // this.setState({value: text})
    
    this.setState({
      activeDoc: {
        ...this.state.activeDoc,
        tags: text
      }
    })

  }
  _setLanguage = (text) => {


 
     this.setState({
      activeDoc: {
        ...this.state.activeDoc,
        language: text[0] == 'en' ? 'en' : 'es'
      }
    })
  }
  $renderer = () => {
    if(this.state.toEdit != null && this.state.activeDoc != null){
      if(this.state.toEdit == 'book-title'){
        return (
          <TextInput
                            //onChangeText={(text) => this.setState({title: text})}
                            style={{ alignSelf: 'flex-start', color: '#fff', backgroundColor: '#111', padding: 10, fontSize: 18, width: '100%',height: 40}}
                            value={this.state.activeDoc.title}
                            placeholder={"Name of work"}
                            onChangeText={(text) => this._saveTitle(text)}
                            placeholderTextColor="#999"
                            multiline={false}
                            autoCapitalize = 'none'
                            autoCorrect={false}
                          />

          )
      }
      if(this.state.toEdit == 'book-author'){
        return (
          <TextInput
                            //onChangeText={(text) => this.setState({title: text})}
                            style={{ alignSelf: 'flex-start', color: '#fff', backgroundColor: '#111', padding: 10, fontSize: 18, width: '100%',height: 40}}
                            value={this.state.activeDoc.author}
                            placeholder={"Author"}
                            onChangeText={(text) => this._saveAuthor(text)}
                            placeholderTextColor="#999"
                            multiline={false}
                            autoCapitalize = 'none'
                            autoCorrect={false}
                          />

          )
      }
      else if(this.state.toEdit == 'book-description'){
        return (
          <TextInput
                            //onChangeText={(text) => this.setState({title: text})}
                            style={{ alignSelf: 'flex-start', color: '#fff', backgroundColor: '#111', padding: 10, fontSize: 18, width: '100%', height: Math.max(55, this.state.height)}}
                            value={this.state.activeDoc.description}
                            placeholder={"Description of your work"}
                            onChangeText={(text) => this._saveDescription(text)}
                            placeholderTextColor="#999"
                            multiline={true}
                            autoCapitalize = 'none'
                            autoCorrect={false}
                            onContentSizeChange={(event) => {
                                this.setState({ height: event.nativeEvent.contentSize.height })
                            }}
                          />

          )
      }
      else if(this.state.toEdit == 'book-tags'){
        return (
          <View style={{  margin: 5}}>
          <Tags
            initialText=""
            textInputProps={{
              placeholder: "Write a tag",
              autoCorrect: false,
              style: {backgroundColor: '#eaeaea', color: '#000'}
            }}
            initialTags={this.state.activeDoc.tags}
            createTagOnString ={[",", " ", "\n"]}
            onChangeTags={tags => this._setTags(tags)}
            onTagPress={(index, tagLabel, event, deleted) =>
             __DEV__ && console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
            }
            containerStyle={{ justifyContent: "center" }}
            inputStyle={{ backgroundColor: "#eaeaea", borderRadius: 20, margin: 1, height: 40 }}
            renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
              <TouchableOpacity key={`${tag}-${index}`} onPress={onPress} style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 9, paddingRight: 9, margin: 3, backgroundColor: '#999', borderRadius: 20, height: 30}}>
                <Text style={{color: '#fff'}}>{tag}</Text>
              </TouchableOpacity>
            )}
          />
          </View>

          )
      }
      else if(this.state.toEdit == 'book-language'){

        return(
          <View style={{height: '100%'}}>
              <CustomMultiPicker
                options={arrayLanguages}
                search={true} // should show search bar?
                multiple={false} //
                placeholder={"Search"}
                placeholderTextColor={'#757575'}
                returnValue={"label"} // label or value
                callback={(res)=>{ this._setLanguage(res) }} // callback, array of selected items
                rowBackgroundColor={"transparent"}
                rowHeight={40}
                rowRadius={0}
                searchIconName="ios-checkmark"
                searchIconColor="#000"
                searchIconSize={30}
                iconColor={"#000"}
                iconSize={30}
                selectedIconName={"ios-checkmark-circle-outline"}
                unselectedIconName={"ios-add"}
                scrollViewHeight={500}
                selected={(this.state.activeDoc.language == 'English' || this.state.activeDoc.language == 'en') ? 'en' : (this.state.activeDoc.language == 'Español' || this.state.activeDoc.language == 'es') && 'es'} // list of options which are selected by default
              />
          </View>
          )
      } else if(this.state.toEdit == 'userProfile-languages'){

        return(
          <View style={{height: '100%'}}>
              <CustomMultiPicker
                options={arrayLanguages}
                search={true} // should show search bar?
                multiple={false} //
                placeholder={"Search"}
                placeholderTextColor={'#757575'}
                returnValue={"label"} // label or value
                callback={(res)=>{ this._setUserLanguage(res) }} // callback, array of selected items
                rowBackgroundColor={"transparent"}
                rowHeight={40}
                rowRadius={0}
                searchIconName="ios-checkmark"
                searchIconColor="#000"
                searchIconSize={30}
                iconColor={"#000"}
                iconSize={30}
                selectedIconName={"ios-checkmark-circle-outline"}
                unselectedIconName={"ios-add"}
                scrollViewHeight={500}
                selected={[this.state.activeDoc.language || getLang()]} // list of options which are selected by default
              />
          </View>
          )
      } else if(this.state.toEdit == 'userProfile-email'){
        return (
          <TextInput
                            //onChangeText={(text) => this.setState({title: text})}
                            style={{ alignSelf: 'flex-start', color: '#fff', backgroundColor: '#111', padding: 10, fontSize: 18, width: '100%',height: 40}}
                            value={this.state.activeDoc.email}
                            placeholder={"Your e-mail"}
                            onChangeText={(text) => this._saveEmail(text)}
                            placeholderTextColor="#999"
                            multiline={false}
                            autoCapitalize = 'none'
                            autoCorrect={false}
                          />

          )
      } else if(this.state.toEdit == 'userProfile-full_name'){
        return (
          <TextInput
                            //onChangeText={(text) => this.setState({title: text})}
                            style={{ alignSelf: 'flex-start', color: '#fff', backgroundColor: '#111', padding: 10, fontSize: 18, width: '100%',height: 40}}
                            value={this.state.activeDoc.full_name}
                            placeholder={"Your e-mail"}
                            onChangeText={(text) => this._saveFullName(text)}
                            placeholderTextColor="#999"
                            multiline={false}
                            autoCapitalize = 'none'
                            autoCorrect={false}
                          />

          )
      }


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
      <SafeAreaView style={{flex: 1, zIndex: 1}}>
          <View style={{marginTop:0}}>
            { this.$renderer() }
          </View>
          </SafeAreaView>
        )
  //<Text style={[globalStyles.settingsHeadline, {padding: 5, textAlign: 'center'}]}>Details</Text>
  }
}