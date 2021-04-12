import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';

import AntDesign from 'react-native-vector-icons/AntDesign';

import DraggableFlatList from 'react-native-draggable-flatlist'

import ContentLoader, { Rect, Circle } from "react-content-loader/native"

import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, GOOGLE_API_KEY } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';

import styles from '../styles/docScreen.style';
import { mapStyle, mapNavigation } from '../styles/map.style';

import Snackbar from 'react-native-snackbar';

import { getLang, Languages } from '../static/languages';

import SortableList from 'react-native-sortable-list';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import * as Animatable from 'react-native-animatable';

import {DarkModeContext} from 'react-native-dark-mode';
//static contextType = DarkModeContext;

import Modal from "react-native-modal";

import SortRow from './sortRenderRow';
import EditChapter from './editChapter';

import RenderBusiness from './renderBusiness';
import Placeholder, { Line, Media } from "rn-placeholder";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BottomDrawer from '../../libraries/drawer';
import API from '../services/api';
import {Column as Col, Row} from 'react-native-flexbox-grid';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

import FastImage from 'react-native-fast-image'

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'

//var RNFS = require('react-native-fs');
import HeaderScrollView from './headerScroll';

import { NoContent } from './illustrations';

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover } = renderers;

import RnBgTask from 'react-native-bg-thread';

import update from 'immutability-helper'

import { FlatList } from 'react-native-gesture-handler'

//const Remote = new API({ url: API_URL })

export default class NavThroughMap extends Component<Props> {
  static contextType = DarkModeContext;
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
      isFlipped: false,
      isNavigation: false,
      route: false,
      step: false,
      chapters: null,
      scrollView: true,
      editMode: false,
      activeChapter: null,
      countChapters: 0,
      currentWork: null,
      isReady: false,
      activeWork: props.navigation.state.params._key || '',
      modalType: 'chapters',

      sync: 'active'
    }
    
    
    this.onChanges == null;

  }
  componentDidMount(){

    this.$init();

    //console.log("Region map through", this.props.navigation.state.params._region)
    

  }

  componentWillUnmount(){
    this.props.screenProps.cancelChaptersSync();
     if(this.onChanges){
      this.onChanges.cancel();
    }
   // RnBgTask.cancel()
  }


  $init = async() => {
    //console.log("get chapters!", this.props.navigation.state.params._key)
    
    let chapters = [];



    let getChapters = await(this.props.screenProps.RemoteCloud.Work().drafts().chapters().all(this.props.navigation.state.params._key._id));
    

    if(getChapters && getChapters.chapters && getChapters.chapters.length == 0){

      let chaptersRemote = await(this.props.screenProps.RemoteCloud.Work().drafts().chapters().allRemote(this.props.navigation.state.params._key._id));
      chapters = chaptersRemote;

    /*  if(chaptersRemote && chaptersRemote.length == 0){
        console.log("chapters remote!", chaptersRemote)
        Snackbar.show({ title: 'Syncing from cloud', duration: Snackbar.LENGTH_LONG })
        let g = await(Remote.Work().drafts().chapters().replicateByDocId(this.state.activeWork._id));
        console.log("replicate from chapters id", g)
        chapters = await(Remote.Work().drafts().chapters().all(this.props.navigation.state.params._key._id));
      }
      */
      

    }

    if(getChapters.chapters.length > 0){
      chapters = getChapters.chapters;
    }

    //RnBgTask.runInBackground(async()=>{

      if(this.props.screenProps.RemoteCloud){
       this.onChanges = this.props.screenProps.RemoteCloud.ApplicationChapters.changes({live: true, since: 'now', include_docs: true})
                  .on('change', (change) => {
                  //console.log("[NavapTrough] ON CHANNGE!", change)
                  this.onUpdatedOrInserted(change.doc)
                }).on('error', (err) => this.props.screenProps.cancelChaptersSync())

        //console.log("CURRENT BOOK CHAPTERS", this.state)

      }

      this.props.screenProps.syncChapters(this.state.activeWork._id, true);

    //});

    this.setState({ 
          chapters: chapters || [],
          countChapters: chapters.length || 0, 
          isReady: true 
        });

 //   __DEV__ && console.log("CHAPTERS OF!!", this.state.chapters)
    
/*
      if(this.props.screenProps.connectionStatus == 'online'){
        chaptersIds = chapters.map(r => r._id);
    console.log("chapters ids!", chaptersIds)

        let optChapters = {
                 live: true,
                 retry: true,
                 continuous: true,
                 filter: 'chapterSync/by_user_id',
                 push: {checkpoint: false}, 
                 pull: {checkpoint: false},
                 batch_size: 900,
                 query_params: { "userId": this.props.rootUser.name },
                 docs_ids: chaptersIds
              };

        let startingpoint;

        this.props.screenProps.RemoteCloud.ApplicationChapters.sync(this.props.screenProps.RemoteCloud.RemoteChapters, optChapters)
              .on('change', (info) => {
                console.log("[chapters sync] on change!", info, info.change.last_seq.split("-")[0], infoDrafts.update_seq, startingpoint);
                
                 if(typeof startingpoint === "undefined") {
                    startingpoint = parseFloat(info.change.last_seq.split("-")[0]);
                 } else {
                    fraction = (parseFloat(info.change.last_seq.split("-")[0]) - startingpoint) / (infoDrafts.update_seq - startingpoint); 
                 }

            this.setState({progressDrafts: fraction})

              console.log('Replication Progress', fraction, this.state.progress);
            }).on('error', (err) => {
                console.log("[chapters sync] on error!", err)

            }).on('active', (ac) => {
                console.log("[chapters sync] on active!", ac)

            }).on('paused', (pa) => {
                console.log("[chapters sync] on paused!", pa)

            })

      }
*/
    
   //console.log("chapters!", chapters);

    return;
  }
  
    binarySearch = (arr, docId)  => {
      var low = 0, high = arr.length, mid;
      while (low < high) {
        mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
        arr[mid]._id < docId ? low = mid + 1 : high = mid
      }
      return low;
    }

    onUpdatedOrInserted = (newDoc) => {


      if(typeof this.state.chapters === 'undefined' || this.state.chapters == null){
            return;
          }
          var index = _.findIndex(this.state.chapters, ['_id', newDoc._id]);
          //console.log("[CHAPTERS] UPDATE OR INSERT", newDoc, index, this.state.chapters)
          var chapter = this.state.chapters[index];
          if(newDoc && newDoc._id.includes("_design")){
            return;
          }
          
          if (chapter && chapter._id === newDoc._id) { // update
            if(newDoc._deleted){
            this.setState((prevState) => update(prevState, { 
                      chapters: { 
                        $splice: [[index, 1]]
                         }
                       }));
            return;
          } else {
            this.setState((prevState) => update(prevState, { 
                    chapters: { 
                        [index]: { 
                            $set: newDoc
                           } 
                         }
                       }));
          }
            

          } else { // insert
            //console.log("IS NOT UPDATE, IS INSERTIG!!!!", newDoc, this.state.chapters)
            if(index == -1 && !newDoc._deleted){
            this.setState((prevState) => update(prevState, { 
                    chapters: { 
                       $push: [newDoc]
                       }
                 }));
          }
          }

    }

  newChapter = async() => {
    let n = await(this.props.screenProps.RemoteCloud.Work().drafts().chapters().create(this.props.navigation.state.params._key._id))
   // __DEV__ && console.log("Created chapter!", n)
  /* let nChapters = this.state.chapters.length > 0 ? this.state.chapters : [];
    var uChapters = nChapters.concat(n);
    this.setState({ chapters: uChapters })
    this.openChapter(n);*/
  }
  _onMove = async(chapters) => {
      let position = 0
      //console.log("chapters!", chapters, this.state.chapters)
      
      for(let position = 0; chapters.length > position; position++){
        //console.log("chapters index!", this.state.chapters[chapters[position]], position)
        this.state.chapters[chapters[position]].position = position;
        
        //let m = await(Remote.Work().drafts().chapters().onMove(this.state.chapters[chapters[position]]._id, position))
        //console.log("[M] Move!", m)
        //console.log("on move!", this.state.chapters[position]._id)
         /* APILocalChapters.upsert(this.state.chapters[chapters[index]]._id, doc => {
                      doc.index = index;
                      return doc;
                    }).then((res) => {

                   //   console.log("Chapters changed!", res)
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                    //  console.log("Error creating book", error)
                      // error
                    });*/
      }

      
      
      //console.log("after for chapters", this.state.chapters);

      /*this.state.chapters.map(function (row) {
          console.log("Map chapters!", row);
           APILocalChapters.upsert(row._id, doc => {
                      doc.index = chapters[index - 1];
                      return doc;
                    }).then((res) => {

                      console.log("Chapters changed!", res)
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      console.log("Error creating book", error)
                      // error
                    });
                    console.log("Index!", index, chapters[index - 1])    
                    index++;
                    
        });  */
        this.setState({ scrollView: true })
        this._onSaveMove();
  }
  _onSaveMove = async() => {
    let s = await(this.props.screenProps.RemoteCloud.Work().drafts().chapters().onMove(this.state.chapters)).catch(e => null);

      if(s != null){
        await(this.setState(() => {
       
         this.state.chapters = this.state.chapters;
         return this.state.chapters
       }));
      }
  }
  editChapter = (params, all, func, index) => {
      //console.log("PARAMS IN PROPS", func())

      this.props.navigation.navigate('EditChapter', {
        docKey: params,
        allDocs: all,
        toUpdate: func,
        index: index
      });
      //console.log("[explore] in props!", this.props)
    }
  openChapter = (book) => {
    let index = _.findIndex(this.state.chapters, { _id: book._id });
    this.editChapter(book, this.state.chapters, this.onSave.bind(this), index);

    //this.setState({ modalType: 'chapters', isModalVisible: !this.state.isModalVisible, activeChapter: book });
  }
  openImport = () => {
    this.setState({ modalType: 'import', isModalVisible: !this.state.isModalVisible });
  }
  _onRenderRow = (book) => {

      return (
        <TouchableOpacity 
        onPress={() => this.openChapter(book.item)} 
        style={[
        styles.row,
        { borderRadius: 0,backgroundColor:  this.context == 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }
      ]}>

          <Text numberOfLines={1} style={[styles.text, {color: this.context == 'dark' ? '#fff' : '#222', fontWeight: '600', fontSize: 18}]}>{book.item.title}</Text>

        
      </TouchableOpacity> 

       //<SortRow key={book._id} style={book._deleted && {display: 'none'}} data={book} active={book.active} themeMode={this.context} onDelete={this._onDelete} onOpenChapter={this.openChapter} navigation={this.props.navigation}/>
        );
    
  }



  closeAndSave = () => {
    this.setState({ isModalVisible: false });
  };

  toggleMode = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onSave = async() => {
    var array = [...this.state.chapters];
    await(array.map(async(key, i) => {
        if(key._deleted && key._deleted == true){
          let chapterIndex = _.findIndex(array, ['_id', key._id]);
          array.splice(chapterIndex, 1);
        }
      }));
    
    this.setState({chapters: array});
  }

  importWorkEpub = async() => {

    let res = await DocumentPicker.pick({
     // type: [DocumentPicker.types.images],
    });

    let typeBook = res;
    RNFS.readFile(res.uri, 'base64')
      .then(async(result) => {
        let data = {
            type: typeBook.type,
            name: typeBook.name,
            size: typeBook.size,
            data: result,
            source: {uri: typeBook.uri}
          };


          let f = await(this.props.screenProps.RemoteCloud.Work().drafts().importEpub(JSON.stringify(data)));

  
        })
      .catch(error => console.log('FS-error', error));

    //console.log("response picker", res);
  }
  renderEditChapter = () => {
    return (
      <EditChapter closeAndSave={this.closeAndSave} doc={this.state.activeChapter} onSave={this.onSave.bind(this)} allDocs={this.state.chapters}></EditChapter>
      )
  }
  renderImport = () => {
    return (
      <SafeAreaView>
        <Text>Hola</Text>
         <Button
                style={{width: '95%', alignSelf: 'center'}}
                buttonStyle={{borderColor: '#000'}}
                titleStyle={{color: '#000'}}
                onPress={() => this.importWorkEpub()}
                type="outline"
                icon={
                  <EntypoIcono
                    name="cog"
                    size={15}
                    color="#000"
                    style={{marginRight: 10}}
                  />
                }
                title="Import"
              />
           <Button
                style={{width: '95%', alignSelf: 'center'}}
                buttonStyle={{borderColor: '#000'}}
                titleStyle={{color: '#000'}}
                onPress={() => this.closeAndSave()}
                type="outline"
                icon={
                  <EntypoIcono
                    name="cog"
                    size={15}
                    color="#000"
                    style={{marginRight: 10}}
                  />
                }
                title="Cerrar"
              />
      </SafeAreaView>    
        )
  }
  workSettings = () => {

    this.props.navigation.navigate('WorkConfig', {
        _key: this.props.navigation.state.params._key,
        onChangesSettings: this.$onChangeSettings.bind(this)
      })
  }
  $onChangeSettings = (state) => {

    if(state){

      if(state.toEdit == 'title'){

        this.props.navigation.state.params._key.title = state.activeDoc.title;
        this.setState({
          activeWork: {
            ...this.state.activeWork,
            title: state.activeDoc.title
          }
        })

      }

      if(state.toEdit == 'cover'){

        this.props.navigation.state.params._key.cover = state.activeDoc.cover;
        this.setState({
          activeWork: {
            ...this.state.activeWork,
            cover: state.activeDoc.cover
          }
        })

      }

      if(state.toEdit == 'status'){

        this.setState({
          activeWork: {
            ...this.state.activeWork,
            status: state.activeDoc.status
          }
        })
        this.props.navigation.state.params._key.status = state.activeDoc.status;

      }
    }
    this.props.screenProps.shouldChangeRoot(state);


    if(this.props.navigation.state.params.updateDoc){
      this.props.navigation.state.params.updateDoc(state);
    }

    //this.props.navigation.state.params._key = state.activeDoc;
    //console.log("state and chapters", this.state.chapters)
  }

  syncDraft = async() => {

    //let sync = await(Remote.Work().drafts().sync());
    //console.log("return of sync!", sync)
  }

  previewWork = () => {
    this.props.navigation.state.params._key.offline = true;
    this.props.navigation.navigate('Details',{
                                        currentDoc: this.props.navigation.state.params._key,
                                        allDocs: [this.props.navigation.state.params._key],
                                        indexOfSlider: 0
                                      });
  }
  returnToDocs = () => {
    this.props.screenProps.cancelChaptersSync();


     if(this.onChanges){
      this.onChanges.cancel();
    }

    this.props.navigation.goBack()
  }
  _renderCover = (key) => {
      //console.log("KEY!", key)
      if(key.cover != null){
        //console.log("KEY COVER!", key)
        return (
          <FastImage source={{uri: encodeURI(key.cover) }} style={{backgroundColor: 'rgba(0,0,0,.4)',
            width: 50,
            marginLeft: 10,
            borderRadius: 10,
            height: 60}}>
         </FastImage>
          )
      } else {
        return (
           <View style={styles.imageCover}>
                <EntypoIcono name="documents" style={{ color: '#fff', fontSize: 20, marginLeft: 14, marginTop: 18}}/>
              </View>
          )
      }
    }

  _renderHeader = () => {

      return (
      <View>
      
          <View>
          <Row size={12} style={{marginTop: 15, marginBottom: 5}}>
            <Col sm={2.5} md={1.3} lg={1.2} style={{justifyContent: 'center'}}>
              <Transition shared={this.props.navigation.state.params._key._id}>
              {this._renderCover(this.props.navigation.state.params._key)}
                 
            </Transition>
            
            </Col>
            <Col sm={8} md={8} lg={8} style={{justifyContent: 'center'}}>
               <Text numberOfLines={1} style={{fontSize: 22,
        fontWeight: '500',
        color: this.context == 'dark' ? '#fff' : '#333'}}>
               {this.state.activeWork && this.state.activeWork.title}

               </Text>
            </Col>
            <Col sm={1} md={1} lg={1} style={{justifyContent: 'center'}}>
                
            </Col>
            
          </Row> 
          </View>
          </View>
          );
    
  }

  _renderFooter = () => {
    if(this.state.chapters == null){
    const viewBox = '0 0 '+ancho+' 160'
    return (
      <ContentLoader 
        speed={2}
        width={ancho}
        height={160}
        style={{alignSelf: 'flex-start',width: '100%', alignItems: 'flex-start'}}
        viewBox={viewBox}
        backgroundColor="#dcdcdc87"
        foregroundColor="#cccaca"
      >
        <Rect x="0" y="1" rx="0" ry="0" width={ancho} height="50" /> 
        <Rect x="0" y="54" rx="0" ry="0" width={ancho} height="50" /> 
        <Rect x="0" y="107" rx="0" ry="0" width={ancho} height="50" />
        <Rect x="0" y="160" rx="0" ry="0" width={ancho} height="50" />
      </ContentLoader>
  )
  } else {
    return(
    <View />
    )
  }

  }

  _renderEmpty = () => {
    return (
      <View style={{justifyContent:'center', alignItems: 'center'}}>
        <NoContent />
        <Text style={{fontSize:20, color: this.context == 'dark' ? '#fff' : '#111'}}>This boook has no chapters</Text>
      </View>
      )
  }
  _renderChapters = () => {
   

        return (
          <View>
          <FlatList
               data={this.state.chapters}
               keyExtractor={item => item._id}
               initialNumToRender={11}
              maxToRenderPerBatch={11}
              updateCellsBatchingPeriod={2000}
              contentContainerStyle={{paddingBottom: getHeaderHeight() - 10}}
               style={styles.scrollViewBooks}
               renderItem={this._onRenderRow}
               ListEmptyComponent={() => this.state.chapters != null && this.state.chapters.length == 0 && this._renderEmpty()}
               //ListHeaderComponent={() => this._renderHeader()}
               ListFooterComponent={() => this._renderFooter()}
            /> 
            </View>
        
                     )
     /* } else {
        return(
        <View style={{width: '100%', height: '100%',justifyContent: 'center' }}>
            <Text style={{color: this.context == 'dark' ? '#fff' : '#333',  textAlign: 'center', fontSize: 22}}>No works yet</Text>

          </View>
          )
      }
      
    } else {
      return (
        <View style={{flex:1, marginTop: 3}}><Placeholder
                isReady={false}
                //style={{marginLeft: '5%'}}
                
                animation="fade"
                whenReadyRender={() => null}
              >
                <Line width="88%" style={{marginLeft: '5%', height: 40, opacity: 0.5}}/>
                <Line width="88%" style={{marginLeft: '5%', height: 40, opacity: 0.4}}/>
                <Line width="88%" style={{marginLeft: '5%', height: 40, opacity: 0.3}}/>
                <Line width="88%" style={{marginLeft: '5%', height: 40, opacity: 0.2}}/>
              </Placeholder></View>
        )
    }*/
  }

  _renderTools = () => {
    return (

      <View size={12} style={{display: 'flex', justifyContent: 'flex-end', marginRight: 5, flexDirection: 'row', marginTop: 0, backgroundColor: 'transparent', width: 115}}>
          {/*<Col sm={2} md={2} lg={2} style={{justifyContent: 'center'}}>
              <Button
                  style={{width: '95%', alignSelf: 'center'}}
                  buttonStyle={{borderWidth: 0, backgroundColor: 'transparent'}}
                  onPress={() => this.returnToDocs()}
                  type="outline"
                  icon={
                    <EntypoIcono
                      name="chevron-left"
                      size={30}
                      color={this.context == 'dark' ? '#fff' : '#333'}
                      style={{marginRight: 10}}
                    />
                  }
                />
            </Col>*/}

            <TouchableOpacity 
                  style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop: 10, padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.9)', borderRadius: 50, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                  onPress={() => this.workSettings()}>
                  
                      <Icono
                    name="ios-settings"
                    size={18}
                    color={this.context == 'dark' ? '#000' : '#fff'}
                    style={{marginRight: 0, marginTop: 2}}
                  />

                  </TouchableOpacity>

              
            <TouchableOpacity 
                  style={{display: 'flex', alignItems:'center',  justifyContent: 'center', marginTop: 10, padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.9)', borderRadius: 50, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1,marginRight:5}} 
                  onPress={() => this.newChapter()}>
                  
                      <Icono
                    name="ios-add"
                    size={24}
                    color={this.context == 'dark' ? '#000' : '#fff'}
                    style={{marginRight: 0, marginTop: 0}}
                  />

                  </TouchableOpacity>


            


              <Menu ref={r => (this.menu = r)} renderer={Popover} rendererProps={{ preferredPlacement: 'left', anchorStyle: {backgroundColor: '#222'} }} style={{backgroundColor: 'transparent', borderRadius: 8}}>
                <MenuTrigger>
                <View 
                  style={{display: 'flex', alignItems:'center',  justifyContent: 'center', marginTop: 10, padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.9)', borderRadius: 50, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1}} 
                >
                  
                    <EntypoIcono name="dots-two-vertical" style={{color: this.context == 'dark' ? '#000' : '#ffff', fontSize: 24}} />

                  </View>

              
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={[styles.popOver, {width: 120, marginTop: 10}]}
                  >
                  <MenuOption onSelect={() => this.workSettings()}>
                    <Text style={{color: '#fff', fontSize: 18}}>{Languages.edit[getLang()]}</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => this.onShare()}>
                    <Text style={{color: '#fff', fontSize: 18}}>{Languages.share[getLang()]}</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => this.previewWork()} >
                    <Text style={{color: '#48c333', fontSize: 18}}>{Languages.Preview[getLang()]}</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>


          </View> 
      )
  }
  onShare = () => {
    this.props.screenProps.shareBook(this.state.activeWork);
  }
  render() {
    return (
          <HeaderScrollView title={this.state.activeWork.title} bgImg={this.state.activeWork.cover} tools={() => this._renderTools()} onGoBack={() => this.returnToDocs()} style={{ backgroundColor: this.context == 'dark' ? '#111' : '#fff'}}>
          
          
          <View size={12} style={{marginTop: 11}}>
          
          { this._renderChapters()}
            
          </View>
          
          <Modal 
          animationIn={'fadeInDown'}
          animationOut={'fadeOutDown'}
          animationOutTiming={500}
          animationInTiming={0}
          propagateSwipe 
          backdropTransitionOutTiming={0} 
          isVisible={this.state.isModalVisible} style={{ width: '100%', margin: 0, flex: 1, backgroundColor: '#fff' }}
          >
          

              
            {this.state.modalType == 'chapters' && this.renderEditChapter()}
            {this.state.modalType == 'import' && this.renderImport()}
              
              
          </Modal>
          </HeaderScrollView>
        )
  }
}