import React, {Component, PureComponent} from 'react';
import {Platform, StyleSheet, ActionSheetIOS, Text, TextInput, Animated, View, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, Dimensions, RefreshControl, InputAccessoryView, KeyboardAvoidingView } from 'react-native';
import Icono from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import _ from 'lodash'
import LinearGradient from 'react-native-linear-gradient';
import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { mapStyle, mapNavigation } from '../styles/map.style';
import { getLang, Languages } from '../static/languages';
import SortableList from 'react-native-sortable-list';
import SortRow from './sortRenderRow';
import globalStyles, { globalColors } from '../styles/globals.js';
import WysiwygEditor from './wysiwyg';

import WorkTitle from './workTitle';
import {DarkModeContext} from 'react-native-dark-mode';
import changeNavigationBarColor, {
  HideNavigationBar,
  ShowNavigationBar,
} from 'react-native-navigation-bar-color';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Fades from './fades';
import update from 'immutability-helper'
import shortid from 'shortid'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

const { Popover, SlideInMenu, ContextMenu } = renderers;
const { width, height } = Dimensions.get('window');
const headerHeight = ifIphoneX(88, 60);



export default class EditChapter extends PureComponent{
  static contextType = DarkModeContext;
  static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
        };
      };

  constructor(props){
    super(props);
    this.state = {
      isFlipped: false,
      isNavigation: false,
      route: false,
      step: false,
      chapters: props.navigation.state.params.allDocs || null,
      firstOpened: props.navigation.state.params.docKey || null,
      scrollView: true,
      placeholderEditTitle: Languages.placeholderEditTitle[getLang()],
      selectedTag : 'body',
      selectedStyles : [],
      activeChapter: props.navigation.state.params.docKey || null,
      firstIndex: props.navigation.state.params.index || null, 
      index: props.navigation.state.params.index || null, 

      currentIndex: props.navigation.state.params.index || null, 
      unsaved: false,

      headerHeight: 0,
      headerY: 0,
      isHeaderScrolled: false,
      fadeDirection: '',

      headerHeight: 100,
      headerY: 100
    }



  }



  componentDidMount(){
    this.$init();
  }


  $init = async() => {
    
    
    

    //let index = _.findIndex(this.state.chapters, { _id: this.state.firstOpened._id });
    //this.setState({loaded: true, activeChapter: this.state.firstOpened })

   // this.props.navigation.setParams({ titleChapter: this.state.activeChapter,docKey: this.state.activeChapter });

    //this.renderChapter();

    /*RnBgTask.runInBackground(async()=>{
      this.props.screenProps.RemoteCloud.ApplicationChapters.changes({live: true, since: 'now', include_docs: true})
                .on('change', (change) => {
                console.log("[EditChapters] ON CHANNGE!", change)
              }).on('error', console.log.bind(console))
    });*/
  }


  _onChangeTitle = (title) => {

    this.state.activeChapter.title = title;


  }
  

   renderChapter = () => {
    //await(this.setState({activeChapter: this.props.doc, chapters: this.props.allDocs}));
    Keyboard.dismiss(0);

    let index = _.findIndex(this.state.chapters, { _id: this.state.firstOpened._id });
    this.setState({firstIndex: index, currentIndex: index, loaded: true, activeChapter: this.state.firstOpened })

    this.props.navigation.setParams({ titleChapter: this.state.activeChapter,docKey: this.state.activeChapter });

    



    //console.log("index!", index)
    //console.log("this state!", this.state)
    
   
   }

   _returnDocFromHeader = () => {
    return this.state.activeChapter;
   }


   _saveAllWork = async() => {
    //console.log("KEY save", key)

    let r = this.state.chapters.filter(row => { return row.unsaved == true });

    console.log("save allworks!", r)
    let saved = await(this.props.screenProps.RemoteCloud.Work().drafts().chapters().saveBulk(r));

    setTimeout(() => {


        //this.props.allDocs = this.state.chapters;
          this.props.navigation.state.params.toUpdate();
          this._closeEditor();
    }, 100);
    //r = this.state.chapters.map(row => { row.unsaved = false; return row; }); 
    //await(r.forEach( chapter => { chapter.unsaved = false; chapter.updated_at = Date.now() }));
    //console.log("chapters with changes", r)
    /*let c = await(this.state.chapters.map(async(key, i) => {
      console.log("KEY SAVED", i)

      if(key.unsaved == true){
        console.log("Key that has changes:", key, key._deleted, key._deleted == true)
        
        //console.log("Saved content!", saved)
        if(key._deleted && key._deleted == true){
          //let saved = await(Remote.Work().drafts().chapters().save(key));
          let chapterIndex = _.findIndex(this.state.chapters, ['_id', key._id]);
          this.state.chapters.splice(chapterIndex, 1);
         //console.log("remove!", r)
        } 
        toSave.push(key)
        

      }
       /* let c = await(this.wysiwyg.getContentFromId(key));
        console.log("KEY", key, c)
        if(c != null){
          console.log("Content", c)
          let saved = await(Remote.Work().drafts().chapters().save(c))-;
        }
        
        //console.log("this state chapter map", i, key)
        //console.log("content from", key._id, c) */
      

      
      
                            //console.log("Books map", key, i)
        /* /*
      }));
    console.log("to save push", toSave)
    
    setTimeout(() => {
      console.log("this chapters after interval!", this.state.chapters)
        //this.props.allDocs = this.state.chapters;
          this.props.onSave();
          this._closeEditor();
    }, 100)*/
    
    
   }

   _deleteCurrentChapter = () => {
    //console.log("Index!", this.state.firstIndex)
    let key = this.state.activeChapter;
    let chapterIndex = _.findIndex(this.state.chapters, ['_id', key._id]);
    Alert.alert(
            'Are you sure you want to delete this chapter?',
            'You might be able to recover it from revisions',
            [
              {
                text: 'Delete', 
                  onPress: () => {
                    this.state.chapters[chapterIndex]._deleted = true;
                    this.state.chapters[chapterIndex].unsaved = true;


                    this._saveAllWork();
                  }
                },
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              }
            ],
            {cancelable: true},
          );

    
   }
   _closeEditor = () => {

      this.props.navigation.goBack()


    
   }

   onWantToClose = (key) => {
     ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Save', 'Delete part', 'Discard changes', 'Cancel'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 3,
        },
        (buttonIndex) => {

          if (buttonIndex === 0) {
            /* destructive action */
            this._saveAllWork(key)
            this.props.navigation.goBack()
          }
          if(buttonIndex === 1){
            this._deleteCurrentChapter(key)
          }
          if(buttonIndex === 2){
            this._closeEditor()
          }
          if(buttonIndex == 4){
            return;
          }
        },
      );
   }

   handleViewRef = ref => this.view = ref;
  

   _renderToolbar = (key) => {

      return (

    <SafeAreaView style={{width: 50, marginLeft: 0,backgroundColor: 'transparent', borderBottomColor: 'transparent', }}>
       
     
                      {Platform.OS === 'ios' && 
                        <TouchableOpacity style={{width:35,height:35, marginLeft: 5,justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', borderRadius: 20}} 
                          onPress={() => this.onWantToClose(key)}>
                          <EntypoIcono
                                name="chevron-left"
                                size={25}
                                style={{textAlign: 'center', paddingTop: 2,alignSelf: 'center'}}
                                color={this.state.unsaved ? 'red' : '#fff'}
                              />
                          </TouchableOpacity>}
                      {Platform.OS === 'android' &&
                      <Menu ref={r => (this.menu = r)} renderer={Popover} rendererProps={{ preferredPlacement: 'right', anchorStyle: {backgroundColor: '#222'} }} style={{backgroundColor: 'transparent', borderRadius: 8}}>
                                <MenuTrigger style={{ justifyConetnt: 'flex-start', paddingLeft: 9, marginLfet: 0,paddingTop: 10,}} 
                            pointerEvents="auto">

                                   <AntDesign
                                            name="leftcircle"
                                            size={25}
                                            style={{textAlign: 'right',  alignSelf: 'center'}}
                                            color={this.context == 'dark' ? '#fff' : '#000'}
                                          />
                                </MenuTrigger>
                                <MenuOptions
                                  optionsContainerStyle={{width: 250,
                                                          padding: 10,
                                                          backgroundColor: '#222',
                                                          borderRadius: 8,
                                                          shadowColor: 'rgba(0,0,0,.3)',
                                                          shadowOpacity: 0.3,
                                                          shadowOffset: { width: 0, height: 0 },
                                                          shadowRadius: 5,}}
                                  >


                                  <MenuOption onSelect={() =>  this._saveAllWork(key)}>
                                    <Text style={{color: '#48c333', fontSize: 18}}>{Languages.saveChanges[getLang()]}</Text>
                                  </MenuOption>
                                  <MenuOption onSelect={() => this._closeEditor()} >
                                    <Text style={{color: '#fff', fontSize: 18}}>{Languages.discardChanges[getLang()]}</Text>
                                  </MenuOption>
                                  <MenuOption onSelect={() => this._deleteCurrentChapter()} >
                                    <Text style={{color: '#ff7575', fontSize: 18}}>{Languages.deleteChapter[getLang()]}</Text>
                                  </MenuOption>
                                </MenuOptions>
                              </Menu>

                      }
                        
              
          </SafeAreaView>
            )
   } 

   renderContent = (key) => {
    const inputAccessoryViewID = "uniqueID";
    //console.log("render content", key)
    
    //const chapterIndex = _.findIndex(this.state.chapters, ['_id', key._id]);

      /* 
            { this.state.firstIndex != chapterIndex && <View style={{flex: 1, height: '100%', width: '100%', justifyContent: 'center',}}><Spinner style={{alignSelf: 'center'}} isVisible={true} size={100} type={"ChasingDots"} color={"#000"}/></View> }
            { this.state.firstIndex == chapterIndex && this._wysiwyg(key) } */
             /*<BlurView
              style={{width: '100%', top:0, position: 'absolute', height:100, width: '100%', margin: 0, padding: 0}}
              blurAmount={10}
              blurType="regular"
            >
        </BlurView>*/

      
          /* this._renderToolbar(key) */
      return (
              <View style={{backgroundColor: this.context == 'dark' ? '#111' : '#fff', width: width}}>
                  <Fades style={{width: 100, height: headerHeight, position: 'absolute', backgroundColor: 'transparent', position: 'absolute', top: 0, left:0, zIndex:9999}} visible={this.state.isHeaderScrolled} direction={'down'}>
                        <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{width: 100, height: headerHeight, position: 'absolute', backgroundColor: 'transparent', position: 'absolute', top: 0, left:0, zIndex:9999}}
                        locations={[0.0, 0.100, 0.60]}
                        colors={[
                          '#777',
                          '#666',
                          'transparent'
                        ]}>

                        {this._renderToolbar()}
                        </LinearGradient>
                        </Fades>
                        <Fades style={{width: 100, height: headerHeight, position: 'absolute', backgroundColor: 'transparent', position: 'absolute', top: 0, left:0, zIndex:9999}} visible={!this.state.isHeaderScrolled} direction={'up'}>
                        <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{width: 100, height: headerHeight, position: 'absolute', backgroundColor: 'transparent', position: 'absolute', top: 0, left:0, zIndex:9999}}
                        locations={[0.0, 0.100, 0.60]}
                        colors={[
                          '#777',
                          '#666',
                          'transparent'
                        ]}>

                          {this._renderToolbar()}
                        </LinearGradient>
                        </Fades>

                  {this._wysiwyg(key)}

              </View>
      );
   }

   scrollAnimatedValue = new Animated.Value(0);

   handleScroll = event => {

    const offset = event.nativeEvent.contentOffset.y;
    const scrollHeaderOffset = getHeaderHeight() * 2;
    const isHeaderScrolled = scrollHeaderOffset < offset;
    if (this.state.isHeaderScrolled != isHeaderScrolled) {
      // this.setState({
      //   isHeaderScrolled,
      // });
    }

  };


  askPermissions = () => {
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
  }

  uploadImage = async(params) => {
    //console.log("receiv params!", params)
    let f = await(this.props.screenProps.RemoteCloud.Work().drafts().chapters().addImgContent(params));

      if(f && f.type && f.type == 'success'){
              let url = API_STORAGE_CONTENTS+'/'+f.objects.filename;
              console.log("uploade img!",url, f)
              return url;
              //this.insertImage(url, params.uri);
            } else {
              return false;
            }

          // Same code as in above section!

       // this.insertImage(result.uri);
    };

    remHeader = (key) => {
        this.setState((prevState) => update(prevState, { 
                    chapters: { 
                        [chapterIndex]: { 
                          header: {
                            $set: null
                          },
                          unsaved: {
                            $set: true
                          }
                        } 
                       }
                     }));
    }
    addHeader = async(params, key) => {
    console.log("receiv params!", key)
    let f = await(this.props.screenProps.RemoteCloud.Work().drafts().chapters().addImgContent(params));

      if(f ){
              let url = API_STORAGE_CONTENTS+'/'+f.objects.filename;
              console.log("uploade img!",url, f)

      let chapterIndex = _.findIndex(this.state.chapters, ['_id', key._id]);
    //this.state.chapters[chapterIndex].title = title;
    //this.state.chapters[chapterIndex].unsaved = true;

      let header = {
        type: 'img',
        url: url
      }
      this.setState((prevState) => update(prevState, { 
                    chapters: { 
                        [chapterIndex]: { 
                          header: {
                            $set: header
                          },
                          unsaved: {
                            $set: true
                          }
                        } 
                       }
                     }));

              return url;
              //this.insertImage(url, params.uri);
            } else {
              return false;
            }


        

        
        

          // Same code as in above section!

       // this.insertImage(result.uri);
    };

    addLink = async(params) => {
      let f = await(this.props.screenProps.RemoteCloud.Work().drafts().chapters().scrapeLink(params)).catch(e => null);
      return f;
    }
    onLayout = event => {
      this.setState({
        headerHeight: event.nativeEvent.layout.height,
        headerY: event.nativeEvent.layout.y,
      });
    };
   _wysiwyg = (key) => {
    //console.log("WYSIWYG key", key)

      return (
       <WysiwygEditor 
        docKey={key} 
        openToolbar={this._openToolbars.bind(this)} 
        saveTitle={(key,title) => this.saveTitle(key, title)}
        askPermissions={() => this.askPermissions()}
        uploadImage={(params) => this.uploadImage(params)}
        addHeader={(params, key) => this.addHeader(params, key)}
        remHeader={(key) => this.remHeader(key)}
        addLink={(params) => this.addLink(params)}
        onGoBack={() => this._closeEditor()}
        //onLayout={this.onLayout}
        // onScroll={Animated.event(
        //             [
        //               {
        //                 nativeEvent: { contentOffset: { y: this.scrollAnimatedValue } },
        //               },
        //             ],
        //             {
        //               listener: this.handleScroll
        //             }
        //           )}
        unsaved={this.unsavedChanges.bind(this)} 
        ref={e => (this.wysiwyg = e)}/>
      )

   }

   _openToolbars = () => {

   }
   _renderTitleEdit = (key) => {

      return (
       <WorkTitle docKey={key} unsaved={this.unsavedChanges} ref={e => (this.editTitle = e)}/>
      )

   }

   

   saveTitle = (key, title) => {

    let chapterIndex = _.findIndex(this.state.chapters, ['_id', key._id]);
    //this.state.chapters[chapterIndex].title = title;
    //this.state.chapters[chapterIndex].unsaved = true;


    this.setState((prevState) => update(prevState, { 
                    chapters: { 
                        [chapterIndex]: { 
                          title: {
                            $set: title
                          },
                          unsaved: {
                            $set: true
                          }
                        } 
                       }
                     }));
    //key.title = title;
    //console.log("new key!", key)
    /*this.setState(() => {
       
       this.state.chapters[chapterIndex]={...this.state.chapters[chapterIndex],title:title, unsaved: true}
       return this.state.chapters
     });*/
    //console.log("console chapters!", this.state.chapters)
   }
   unsavedChanges = (key) => {
    //console.log(" unsaved changes!", key)
    //console.log("unsaved changes!!", key)
    let chapterIndex = _.findIndex(this.state.chapters, ['_id', key._id]);
    if(!this.state.chapters[chapterIndex].unsaved){
      this.setState(() => {
       
       this.state.chapters[chapterIndex]={...this.state.chapters[chapterIndex],native_content: key.native_content, unsaved:true}
       return this.state.chapters
     });
      //console.log("unsaved chapters!", this.state.chapters)
    }

    
    if(this.state.unsaved == false){
      this.setState({unsaved: true})
    }
   }
  _changeIndex = (index) => {
   // console.log("change index!", index)
   Keyboard.dismiss(0);
    this.setState({currentIndex: index})
  }


  renderChapterKey = (key,i) => {
    return (
      <View key={i + Date.now()} style={{flex: 1, backgroundColor: 'red'}}>
                              { this.renderContent(key) }
                              </View>
                              )
  }
  renderAllChapters = () => {
    if(this.state.chapters != null && this.state.firstIndex != null){
      return (
        this.state.chapters.map((key, i) => {


    

     // console.log("first index render", this.state.firstIndex, chapterIndex)
                            //console.log("Books map", i)
                            return (
                              <View key={i + Date.now()} style={{flex: 1}}>
                              { this.renderContent(key) }
                              </View>
                              )
                        })
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

  onSwipeChapter = (index) => {


    this.props.navigation.setParams({ docKey: this.state.chapters[index] });
    Keyboard.dismiss()
    return this.setState({firstIndex: index});

  }


  _renderSwiper = () => {
    return (

        

        <SwiperFlatList
          style={[styles.wrapper,{backgroundColor: this.context == 'dark' ? '#111' : '#fff'}]} 
                    ref={(ref) => this.readium = ref}
                    data={this.state.chapters}
                    renderItem={({ item, index }) => this.renderContent(item, index)}
                    index={this.state.index}
                    style={{ backgroundColor: this.context == 'dark' ? '#232225' : '#f7f8fa'}}
                    firstItem={this.state.firstIndex}
                    showPagination={false}
                    onChangeIndex={(index) => this.onSwipeChapter(index)}
                    decelerationRate={0}
                    keyExtractor={(item) => item._id}
                    snapToAlignment={"center"}
                    initialNumToRender={4}
                   maxToRenderPerBatch={4}
                    updateCellsBatchingPeriod={500}

                    bounces={true}

                    //initialNumToRender={3}
                    //maxToRenderPerBatch={3}
                    //updateCellsBatchingPeriod={1000}
                    //onMomentumScrollEnd={this.onSwipeChapter}
                  />



      )
  }

  _renderTools = () => {
    return (<View></View>)
  }
  render() {
    if(this.state.chapters != null
      //&& this.state.activeChapter != null
      ){
    return (
      <View style={{flex:1}} title={'Chapter'}>

          
          

      {this._renderSwiper()}

      </View>
      )
    } else {
      return (
        <View style={{flex: 1, backgroundColor: '#222', justifyContent: 'center'}}>
        <ActivityIndicator
              style={[styles.indicator, {zIndex: 99}]}
              color="#fff"
              size="large"
            />
            </View>
        );
    }
  }
}


const styles = StyleSheet.create({
  wrapper: {

  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  halfScroll: {
    width: '100%'
  },
  paginationStyle: {
    position: 'absolute',
    top: 25,
    right: 50,
    zIndex: 1,
    display: 'none'
  },
  paginationText: {
    color: 'white',
    fontSize: 20
  },
  bottomBar: {
  },
  editTitleContainer: {
    borderBottomWidth: 1,
    height: 72,
    backgroundColor: '#ddd',
    borderColor: '#fff' 
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
      backgroundColor: '#f6e2c0',
      width: '100%',
      flexGrow: 1
    },
    toolbarButton: {
        fontSize: 20,
        width: 40,
        height: 30,
        padding: 6,
        borderRadius: 20,
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
      color: '#000',
      padding:3,
      fontSize: 17
    }
});