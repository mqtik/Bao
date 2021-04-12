import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Alert, Animated, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, Dimensions, RefreshControl, InputAccessoryView, KeyboardAvoidingView } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import EntypoIcono from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, API_STORAGE_CONTENTS, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, GOOGLE_API_KEY } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory'

import ImagePicker from 'react-native-image-picker';

import { mapStyle, mapNavigation } from '../styles/map.style';

import { getLang, Languages } from '../static/languages';

import SortableList from 'react-native-sortable-list';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

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

import Fade from './animations'
import Wysiwyg from './wysiwyg/index'

import Snackbar from 'react-native-snackbar';

const { width, height } = Dimensions.get('window');

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover, SlideInMenu, ContextMenu } = renderers;

import  CNEditor , { CNToolbar , getDefaultStyles, convertToObject } from "react-native-cn-richtext-editor";

import {DarkModeContext} from 'react-native-dark-mode';


const Remote = new API({ url: API_URL })

const optionsImgPkr = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      allowsEditing: true,
        aspect: [4, 4],
        base64: false,
      storageOptions: {
        skipBackup: true,
      },
    };

const defaultStyles = getDefaultStyles();
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {

      const paddingToBottom = 20;

      return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
    };
export default class WysiwygEditor extends Component<Props> {
  static contextType = DarkModeContext;
  static navigationOptions = ({ navigation }) => {
          const { params = {} } = navigation.state;
          var value = null;
        return {
          //Default Title of ActionBar
            //Background color of ActionBar
            headerTitle: (
              <Text>Title</Text>
             ),
            


          //Text color of ActionBar
        };
      };
  constructor(props){
    super(props);
    this.state = {
      placeholderEditTitle: Languages.placeholderEditTitle[getLang()],
      selectedTag : 'body',
      selectedStyles : [],
      value: props.docKey.native_content,
      selectedColor : 'default',
      selectedHighlight: 'default',
      colors : ['red', 'green', 'blue'],
      highlights:['yellow_hl','pink_hl', 'orange_hl', 'green_hl','purple_hl','blue_hl'],
      changed: false,
      isOnEnd: false,
      onLimit: 100,
      keyboardOpen: true,
      isLoading: true
    }
    
    
    this.editor = null;
  }
  componentDidMount(){

    //this.setState({activeChapter: this.props.doc})
    //console.log("state chapter!", this.state.activeChapter)

    //console.log("Region map through", this.props.navigation.state.params._region)
    this.$init();
    
  }

  $init = async() => {
      //console.log("TYPE OF!", typeof this.props.docKey.content)
        if(typeof this.props.docKey.native_content === 'object'){
          //__DEV__ && console.log("gets here", this.props.docKey.content)

            
            this.setState({
              value: this.props.docKey.native_content
            })
            //console.log("value!", this.state.value)
        }
        // if(typeof this.props.docKey.content === 'object'){
        //   if(Array.isArray(this.props.docKey.content)){
        //       let a = await(convertToHtmlString(this.props.docKey.content));
              
        //       this.setState({
        //         value: a
        //       })
        //     }
        // }
          
        this.setState({isLoading: false})
        
        //console.log("init  finish", this.state)
        
        //console.log("whats the state", this.state.value)
        
    }


   
    onValueChanged = (value) => {

        /*this.setState({
            value: this.state.value,
            changed: true
        });*/
        // this.setState({
        //     value: value
        // });

        this.state.value = value;
        this.props.docKey.native_content = {
          blocks: value,
          time: Date.now()
        }
        this.props.docKey.unsaved = true;

        //this.props.contentRT(this.props.docKey)
        //this.props.unsaved(this.props.docKey);
        //_.debounce(this._onSave(value), 2000)
       
    }
  

    askPermissionsAsync = () => {

      Permissions.request('camera', {
          rationale: {
            title: 'Newt Camera Permission',
            message:
              'Newt needs access to your camera ' +
              'so you can take awesome pictures.',
          },
        }).then(response => {

          this.setState({cameraPermission: response});
        });
        Permissions.request('photo', {
          rationale: {
            title: 'Newt Camera Permission',
            message:
              'Nrey needs access to your camera ' +
              'so you can take awesome pictures.',
          },
        }).then(response => {

          this.setState({cameraPermission: response});
        });
      Permissions.checkMultiple(['camera', 'photo']).then(response => {
      //response is an object mapping type to permission

      this.setState({
        hasCameraPermission: response.camera,
        hasCameraRollPermission: response.photo,
      });
    });
       /* const camera = await(Permissions.askAsync(Permissions.CAMERA));
        const cameraRoll = await(Permissions.askAsync(Permissions.CAMERA_ROLL));

        this.setState({
        hasCameraPermission: camera.status === 'granted',
        hasCameraRollPermission: cameraRoll.status === 'granted'
        });*/
    };



    useLibraryHandler = async() => {
        await this.askPermissionsAsync();
        
        if(ImagePicker.launchImageLibrary == null){
          Snackbar.show({ title: 'Something went wrong with permissions', duration: Snackbar.LENGTH_LONG })
          return;
        }

        ImagePicker.launchImageLibrary(optionsImgPkr, (response) => {

          let data = {
            type: response.type,
            name: response.fileName,
            size: response.fileSize,
            data: response.data,
            uri: response.uri
          };
       // console.log("data!", data)
       
        
        this.$uploadImgContent(data);

          
          // Same code as in above section!
        }); 
       // this.insertImage(result.uri);
    };

    $uploadImgContent = async(params) => {

        Snackbar.show({ title: 'Uploading image to the cloud', duration: Snackbar.LENGTH_LONG })

        let p = JSON.stringify(params);
        let f = await(Remote.Work().drafts().chapters().addImgContent(p));



        if(f.type == 'success'){
          let url = API_STORAGE_CONTENTS+'/'+f.objects.filename;
          this.insertImage(url, params.uri);
        }
        

        //this._onSave();
      }

    useCameraHandler = async () => {
        await this.askPermissionsAsync();
        __DEV__ && console.log("caera use", ImagePicker.launchCamera)

        ImagePicker.launchCamera({
        allowsEditing: true,
        aspect: [4, 4],
        base64: true,
        }, async(result) => {
          Snackbar.show({ title: 'Uploading image to the cloud', duration: Snackbar.LENGTH_LONG })
        
        let p = JSON.stringify(result);
        let f = await(Remote.Work().drafts().chapters().addImgContent(p));

        if(f.type == 'success'){
          __DEV__ && console.log("use iage success", f)
          let url = API_STORAGE_CONTENTS+'/'+f.objects.filename;
          this.insertImage(url, result.uri);
        }

        //this.insertImage(result.uri);
        });

        
    };

    onImageSelectorClicked = (value) => {
        if(value == 1) {
            this.useCameraHandler();    
        }
        else if(value == 2) {
            this.useLibraryHandler();         
        }
        
    }


    renderImageSelector() {
        return (
            <Menu renderer={Popover} optionsContainerStyle={styles.popOver} rendererProps={{ preferredPlacement: 'top', anchorStyle: {backgroundColor: '#222'} }} onSelect={this.onImageSelectorClicked}>
            <MenuTrigger style={{width: 30, height: 31, borderRadius: 10, padding: 3, backgroundColor: 'rgba(0,0,0,.7)', marginTop: 0}}>
                <MaterialCommunityIcons name="image-area" size={25} color="#fff" />
            </MenuTrigger>
            <MenuOptions customStyles={optionsStyles}>
                <MenuOption value={1}>
                    <Text style={{fontSize: 18, color: '#888'}}>
                        Take Photo
                    </Text>
                </MenuOption>
                <View style={styles.divider}/>
                <MenuOption value={2} >
                    <Text style={{fontSize: 18, color: '#888'}}>
                        Photo Library
                    </Text>
                </MenuOption> 
                <View style={styles.divider}/>
                <MenuOption value={3}>
                    <Text style={{fontSize: 18, color: '#888'}}>
                        Cancel
                    </Text>
                </MenuOption>
            </MenuOptions>
            </Menu>
        );
    
    }



  onScroll = (event) => {
    //console.log("native event!", event);
    if (isCloseToBottom(event)) {
        //enableSomeButton();

    }
  }


  openToolbar = () => {
    this.setState({keyboardOpen: true})
  }

  saveTitle = (title) => {
    this.props.saveTitle(this.props.docKey, title);
  }
  addHeader = async(params) => {
    return await this.props.addHeader(params,this.props.docKey);
  }
  render() {
    /* <Wysiwyg                   
                          ref={input => this.editor = input}
                          style={styles.richEditor}
                          initialBlocks={this.state.value}
                          title={this.props.docKey.title}
                          header={this.props.docKey.header}
                          saveTitle={(title) => this.saveTitle(title)}
                          onValueChanged={this.onValueChanged}
                          withSafeArea={true}
                          //askPermissions={() => this.props.askPermissions()}
                          uploadImage={(params) => this.props.uploadImage(params)}
                          addHeader={(params) => this.addHeader(params)}
                          addLink={(params) => this.props.addLink(params)}
                          fontSize={20}
                          editMode={true}
                          readingTheme={this.context == 'dark' ? 'dark' : 'light'}
                          placeholder={'Enter text here'}
                          contentEditable={true}
                          onScroll={this.props.onScroll}
                          onGoBack={() => this.props.onGoBack()}
                          onChange={(blocks) => this.onValueChanged(blocks)}
                        />  */
    return (
      
         <Wysiwyg                   
                          ref={input => this.editor = input}
                          style={styles.richEditor}
                          initialBlocks={this.state.value}
                          title={this.props.docKey.title}
                          header={this.props.docKey.header}
                          saveTitle={(title) => this.saveTitle(title)}
                          onValueChanged={this.onValueChanged}
                          withSafeArea={true}
                          //askPermissions={() => this.props.askPermissions()}
                          uploadImage={(params) => this.props.uploadImage(params)}
                          addHeader={(params) => this.addHeader(params)}
                          addLink={(params) => this.props.addLink(params)}
                          fontSize={20}
                          editMode={true}
                          readingTheme={this.context == 'dark' ? 'dark' : 'light'}
                          placeholder={'Enter text here'}
                          contentEditable={true}
                          onScroll={this.props.onScroll}
                          onGoBack={() => this.props.onGoBack()}
                          onChange={(blocks) => this.onValueChanged(blocks)}
                        /> 



            /*<StatusBar
               barStyle="light-content"
             />*/
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
    height: 40,
    backgroundColor: 'transparent',
    zIndex: 99999,
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    zIndex: 9999,
    width: width
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
      backgroundColor: '#000',
      height: 40,
      width: '100%'
    },
    popOver: {
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
  },

    toolbarContainer: {

    },
    richEditor: {
      flex: 1,
      padding: 20
    },
    toolbarButton: {
        fontSize: 20,
        width: 40,
        height: 30,
        padding: 6,
        borderRadius: 2,
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

const optionsStyles = {
    optionsContainer: {
      backgroundColor: 'transparent',
      padding: 0,   
      alignItems: 'flex-start',
    },
    optionsWrapper: {
      //width: 40,
      backgroundColor: '#222',
      borderRadius: 10
    },
    optionWrapper: {
       //backgroundColor: 'yellow',
      margin: 2,
    },
    optionTouchable: {
      underlayColor: 'gold',
      activeOpacity: 70,
      color: '#fff'
    },
    // optionText: {
    //   color: 'brown',
    // },
  };

const highlightOptionsStyles = {
optionsContainer: {
    backgroundColor: 'transparent',
    padding: 0,  
},
optionsWrapper: {
    //width: 40,
    backgroundColor: '#222',
    borderRadius: 10
},
optionWrapper: {
    //backgroundColor: 'yellow',
    margin: 2,
},
optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
},
// optionText: {
//   color: 'brown',
// },
};

