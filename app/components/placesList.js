import React, {Component, PureComponent} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, PanResponder,Animated, Button, Alert, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, GOOGLE_API_KEY } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';

import styles, { colors } from '../styles/index.style';
import { mapStyle, mapNavigation } from '../styles/map.style';

import { getLang, Languages } from '../static/languages';
import RenderBusiness from './renderBusiness';
import Placeholder, { Line, Media } from "rn-placeholder";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BottomDrawer from '../../libraries/drawer';
import {Column as Col, Row} from 'react-native-flexbox-grid';
import API from '../services/api';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'
import Modal from "react-native-modal";
import globalStyles, { globalColors } from '../styles/globals.js';
import FastImage from 'react-native-fast-image'

import Snackbar from 'react-native-snackbar';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

import NavMy from './NavMy';

import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['title', 'tags'];

import update from 'immutability-helper'

import { ImageColorPicker } from '../../libraries/colorpicker';

import HeaderScrollView from './headerScroll';
   
import ContentLoader, { Rect, Circle } from "react-content-loader/native"


var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

import Spinner from 'react-native-spinkit'

import { systemWeights } from 'react-native-typography'

const { Popover, SlideInMenu } = renderers

import RnBgTask from 'react-native-bg-thread';

import * as Animatable from 'react-native-animatable';
import {DarkModeContext} from 'react-native-dark-mode';

/*const
  TouchableComponent = Platform.select({ // workaround for reanimated-bottom-sheet
            ios: TouchableOpacityNative,
            android: TouchableOpacityGesture,
  });
;*/

let showSearch = false;
export default class PlacesList extends PureComponent {
  static contextType = DarkModeContext;
  constructor(props){
    super(props);
    this.state = {
      search: '',
      loadBusiness: false,
      businessList: null,
      isModalVisible: false,
      ebookImported: null,
      isLoading: (props.screenProps.myDocs != null && false) || true,
      messageImport: 'Just a second...',
      uploadBookColors: null,
      hasImage: false,
      onDrawerPosition: props.screenProps.getBottomDrawerPosition || false,
      offlineDocs: null,
      docs: (props.screenProps.myDocs && props.screenProps.myDocs.rows) ? props.screenProps.myDocs.rows : null,
      itemsCount: 20,
      heightSearch: 0
    }

   // console.log("PROPS OF PLACES LIST!", this.props)

    this.onChanges = null;
  }
  componentDidMount() {
   //__DEV__ && console.log("Properties for placeslist ", this.props)
    /*Remote.Auth().checkIfLoggedIn().then(bool => {
            Remote.Work().list().then(res => {
              
            this.setState({businessList: res, loadBusiness: true})
            this.drawer.setDrawerState(0)
            //this.drawer.toggleDrawerState()
          })
        })*/

      if(this.props.screenProps.RemoteCloud && this.props.screenProps.RemoteCloud.ApplicationDrafts){
        this.onChanges = this.props.screenProps.RemoteCloud.ApplicationDrafts.changes({live: true, since: 'now', include_docs: true})
                .on('change', (change) => {
                //console.log("[PLACESLIST] ON CHANNGE!", change)
                this.props.screenProps.onUpdatedOrInsertedDrafts(change.doc)
              }).on('error', (err) => console.log("error of!", err))
      }

    this.$init();
        
  }

  static getDerivedStateFromProps(props, state) {
        //console.log("get dervieed!", state)
        if ((props.screenProps.myDocs && props.screenProps.myDocs.rows && props.screenProps.myDocs.rows !== state.docs) || (props.screenProps.myDocs && props.screenProps.myDocs.rows && props.screenProps.myDocs.rows.length != state.docs.length)) {
          return {
            docs: props.screenProps.myDocs.rows
          };
        }

            
        // Return null to indicate no change to state.
        return null;
    }

  cancelRep = () => {
    RnBgTask.runInBackground(async()=>{
    if(this.onChanges.cancel){
      //console.log("on changes! cancel!",this.onChanges)
      this.onChanges.cancel()
    }
    });
  }

    componentWillUnmount(){
      if(this.onChanges != null){
        //RnBgTask.runInBackground(async()=>{
          //this.onChanges.cancel();
        //}
      }
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

    if(typeof this.state.docs === 'undefined' || this.state.docs == null){
        return;
      }
      var index = _.findIndex(this.state.docs, ['_id', newDoc._id]);

      if(newDoc && newDoc._id.includes("_design")){
        return;
      }
      var doc = this.state.docs[index];

     

      if(doc && doc._id === newDoc._id){

         if(newDoc._deleted){
          this.setState((prevState) => update(prevState, { 
                  docs: {
                      $splice: [[index, 1]]
                      }
                     }));
          return;
        } else {
         this.setState((prevState) => update(prevState, { 
                  docs: {

                      [index]: { 
                          $set: newDoc
                         } 

                      }
                     }));
        }


      } else { // insert
        //console.log("INSERT DOC!", index, newDoc)
        if(index == -1 && !newDoc._deleted){
           this.setState((prevState) => update(prevState, { 
                docs: { 

                    $push: [newDoc]

                 }
             }));

          // console.log("doc inserted!", this.state.docs)
        }
       
      }
  }

  $init = async() => {
       //let drafts = await(Remote.Work().drafts().all());

      //let sync = await(Remote.Work().drafts().sync());
      
      /*console.log("FIRE INIT PLACESLIST!", this.props, this.state)

       let w = this.props.screenProps.myWorks;

       //  console.log("get drafts!", w)


        if(w && w.length > 0 && this.state.docs == null){
          //let books = drafts.rows.map(function (row) { return row.doc; });  
          //console.log("all places", w)
                        
           // this.setState({docs: w, isLoading: false, refreshing: false, loadBusiness: true, onDrawerPosition: this.props.screenProps.getBottomDrawerPosition });
            
            
            //console.log("this state props", this.props)
        }*/

      if(this.props.screenProps.rootUser && 
          this.props.screenProps.rootUser.autoSync && 
          this.props.screenProps.rootUser.autoSync == true && 
          typeof this.props.screenProps.syncDrafts !== 'undefined'){
        __DEV__ && console.log("FIRE AUTO SYNC DRAFTS")
        this.props.screenProps.syncDrafts();
      }


       // console.log("end fire init!", this.state)
    }

  $runBeforeInit = async() => {
    //let w = await(this.props);

    /*let interval = setInterval(async() => {
          
          console.log("w", w)
          if(typeof this.props.screenProps.myWorks !== 'undefined' && his.props.screenProps.myWorks != null){
            
clearInterval(interval);
            this.$init();
          }
        },1);*/
        //this.$init();
  }

  pickerCallback = async(message)  => {
    if (message && message.nativeEvent && message.nativeEvent.data) {
      let payload = JSON.parse(message.nativeEvent.data);

      await(this.setState({uploadBookColors: payload.payload})); 

      this.$createFromImportedContents();
           // response from ImageColorPicker
    } else {
      this.$createFromImportedContents();
    }

    this.setState({
      hasImage: false
    })
  };

  $createFromImportedContents = async() => {
    
    this.state.ebookImported.colors = this.state.uploadBookColors;

          let ic = await(this.props.screenProps.RemoteCloud.Work().drafts().importContents(this.state.ebookImported))
          

          this.setState({messageImport: 'Creating work...'});

          let bulkIt = await(this.props.screenProps.RemoteCloud.Work().drafts().bulkIt(ic.chapters));

          
          this.setState({messageImport: 'All done!'});
          this.setState(prevState => ({
                          docs: [...prevState.docs, ic.book]
                        }))

          this.closeModal();
  }
  importWorkEpub = async() => {
    //console.log("import work epub", DocumentPicker)
    Snackbar.show({ title: 'Picking document...' })
    let res = await DocumentPicker.pick({
     type: [DocumentPicker.types.allFiles],
    });
    var file;
    //console.log("res", res)
    let typeBook = res;

    let k = await(this.props.screenProps.RemoteCloud.Auth().getLoggedUser());
    //console.log("user!", k)

    RNFS.readFile(decodeURI(res.uri), 'base64')
      .then(async(result) => {
        let data = {
            type: typeBook.type,
            name: typeBook.name,
            size: typeBook.size,
            data: result,
            source: {uri: typeBook.uri},
            user_id: k.name+'-'+Date.now()
          };
          
          this.setState({messageImport: 'Processing document...'});
          let f = await(this.props.screenProps.RemoteCloud.Work().drafts().importEpub(JSON.stringify(data)));

          
          __DEV__ && console.log("colors ss!", f)
          Image.prefetch(f.objects.cover)
          this.setState({ isModalVisible: !this.state.isModalVisible, modalType: 'import', ebookImported: f.objects, messageImport: 'Cleaning contents...', hasImage: true});

          
          //let c = await(Remote.Work().drafts().create(this.state.title_book));
      //console.log("[createproject", c)
          //this.setState({ modalType: 'import', isModalVisible: !this.state.isModalVisible, importedBook: f });
        })
      .catch(error => { 
        Snackbar.show({ title: 'There was a problem with the document...' })
        __DEV__ && console.log('FS-error', error) 
      });

    //console.log("response picker", res);
  }

  openCreator = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible, modalType: 'import' });
  }

  closeModal = () => {
    this.setState({ isModalVisible: false, modalType: 'import' });
  }

  $onCreateWork = async() => {
    let c = await(this.props.screenProps.RemoteCloud.Work().drafts().create());
    
    /*let nDocs = (this.state.docs && this.state.docs != null) ? this.state.docs : [];
    let wDocs = nDocs.concat(c);
    this.setState({ docs: wDocs, search: '' })  
  */


  //this.props.screenProps.updateChapterIds();
    this.props.navigation.navigate('Go', {
        _key: c,
        inProps: this.props.inProps
      })
  }
  renderImport = () => {
    if(this.state.ebookImported != null){

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
                    <Entypo
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
                  onPress={() => this.openCreator()}
                  type="outline"
                  icon={
                    <Entypo
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
    } else {
      return(
        <ActivityIndicator
            style={styles.indicator}
            color="#fff"
            size="large"
          />
          )
    }
  }


    

  renderCreateOptions = () => {
     // console.log("[ebook] this state import", this.state.ebookImported)
      return (
        <View>
        <LinearGradient
                            colors={['rgba(48,35,174,0.1)', '#C86DD7']} start={{ x: 0, y: 0}} end={{x: 1, y: 0}} useAngle angle={224.72}
                            style={{width: '100%', height: '100%'}}
                            
                        >

      
          {(this.state.ebookImported.cover && this.state.ebookImported.cover != null) &&

          <Image source={{uri: encodeURI(this.state.ebookImported.cover) }} style={{backgroundColor: 'rgba(0,0,0,.4)',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0
              }} 
              blurAmount={10}
              blurRadius={150} />
            }
          

        <SafeAreaView>
         

        <Row size={12} style={{marginTop: 20}}>
            
            
            <Col sm={3} md={3} lg={3}>
              
            </Col>
            <Col sm={6} md={6} lg={6}>
              {
                (this.state.ebookImported.cover && this.state.ebookImported.cover != null) &&
                <FastImage source={{uri: encodeURI(this.state.ebookImported.cover) }} style={{backgroundColor: 'rgba(0,0,0,.4)',
                    width: '100%',
                    height: 250,
                    borderRadius: 10,
                    
                  }}>
                 </FastImage>
              }
              
            </Col>
            <Col sm={3} md={3} lg={3}>
              
            </Col>

            <Col sm={12} md={12} lg={12} style={{marginTop: 10}}>
              <Text style={[systemWeights.bold, {fontSize: 22, textAlign: 'center', color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: 1, height: 1},
  textShadowRadius: 2}]}>{this.state.ebookImported.metadata.title}</Text>
            </Col>
            <Col sm={12} md={12} lg={12} style={{marginTop: 2}}>
              <Text style={[systemWeights.subhead, {fontSize: 18, textAlign: 'center', color: '#999'}]}>{this.state.ebookImported.metadata.author}</Text>
            </Col>
            <Col sm={12} md={12} lg={12} style={{marginTop: 10, padding: 10}}>
              <Text numberOfLines={4} style={[systemWeights.caption, {fontSize: 16, textAlign: 'center', color: '#fff'}]}>
                 {this.state.ebookImported.metadata.description}
              </Text>
            </Col>

            <Col sm={4} md={4} lg={4}>
              <Text style={[systemWeights.caption, {fontSize: 14, textAlign: 'right', color: '#adadad'}]}>{this.state.ebookImported.chapters.length} chapters</Text>
            </Col>
            <Col sm={4} md={4} lg={4}>
              <Text style={[systemWeights.caption, {fontSize: 14, textAlign: 'center', color: '#adadad'}]}>{this.state.ebookImported.metadata.language}</Text>
            </Col>
            <Col sm={4} md={4} lg={4}>
              <Text style={[systemWeights.caption, {fontSize: 14, textAlign: 'left', color: '#adadad'}]}>2 tags</Text>
            </Col>

            <Col sm={12} md={12} lg={12} style={{marginTop: 25}}>
            <Spinner style={{alignSelf: 'center'}} isVisible={true} size={100} type={"ChasingDots"} color={"rgba(255,255,255,.4)"}/>
              <Text style={[systemWeights.caption, {fontSize: 13, textAlign: 'center', color: '#adadad'}]}>
                {this.state.messageImport}

              </Text>
              {
                this.state.hasImage == true && 
                <ImageColorPicker
                  imageUrl={encodeURI(this.state.ebookImported.cover)}
                  pickerCallback={this.pickerCallback}
                  paletteType={'dominant'}
                  colorType={'hex'}
                />
              }
              
            </Col>

            {/*<Col sm={12} md={12} lg={12} style={{marginTop: 25}}>
              <TouchableHighlight style={{borderRadius: 10, margin: 10, height: 50}} onPress={() => this.closeModal()}>
                     <Text style={styles.headlineAuth, {color: '#fff', justifyContent: 'center', alignSelf: 'center', margin: 13, fontSize: 18}}>
                     Skip »
                     </Text>
               </TouchableHighlight>
             </Col>*/}
          </Row> 

           
           

        </SafeAreaView>    

      </LinearGradient>
      </View>

    )
  }



  updateSearch = search => {
    //console.log("update search!", search)
    this.setState({ search: search });
  };

  $shouldChange = (states) => {

  }
  $shouldDeleteWork = (list) => {

    let search = this.state.search;
    __DEV__ && console.log("on search!", search, this.state.search)
    if(search != null && search != ''){
      this.setState({docs: list, search: ''});
      this.setState({search: search});
    } else {
      this.setState({docs: list, search: 'a'});
      this.setState({search: ''});
    }
    


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

  _openBook = (book, which) => {
    
    this.props.screenProps.rootNavigation.navigate('InProps',{
        activeDoc: book,
        toEdit: which,
        toUpdate: (doc) => this.$onChangeProp(doc)
      });
  }

  _updateDocs = (state) => {

    if(state){



          let I = _.findIndex(this.state.docs, ['_id', state.activeDoc._id]);
        if(state.toEdit == 'title' && state.activeDoc.title){


          __DEV__ && console.log("update. doc TITLEE!", this.state.docs[I])
          
          this.setState((prevState) => update(prevState, { 
              docs: { 
                  [I]: { 
                    title: { 
                      $set: state.activeDoc.title
                       } 
                     } 
                   }
                 }));


          __DEV__ && console.log("how docs arrr", this.state.docs)
          /*
          this.setState(() => {
             
             this.state.myDocs.rows[I]={...this.state.myDocs.rows[I], title: state.activeDoc.title}
             return this.state.myDocs.rows
           });*/


        }

        if(state.toEdit == 'status' && state.activeDoc.status){
          /*this.setState(() => {
             this.state.dosc[I]={...this.state.dosc[I], status: state.activeDoc.status}
             return this.state.docs
           });*/
           this.setState((prevState) => update(prevState, { 
              docs: { 
                  [I]: { 
                    status: { 
                      $set: state.activeDoc.status
                       } 
                     } 
                   }
                 }));
        }
        if(state.toEdit == 'cover' && state.activeDoc.cover){
          /*this.setState(() => {
             this.state.dosc[I]={...this.state.dosc[I], cover: state.activeDoc.cover}
             return this.state.docs
           });*/
           this.setState((prevState) => update(prevState, { 
              docs: { 
                  [I]: { 
                    cover: { 
                      $set: state.activeDoc.cover
                       } 
                     } 
                   }
                 }));
        }
      }
      return;
  }


  _renderTools = () => {
    return (
      <NavMy 
            upDrawer={this.props.screenProps._upperDrawer} 
            drawerPosition={this.props.screenProps.getBottomDrawerPosition} 
            updateSearch={this.updateSearch}
            rootUser={this.props.screenProps.rootUser} 
            //drafts={this.props.screenProps.myDocs}
            importFiles={() => this.importWorkEpub()}
            createWork={() => this.$onCreateWork()}
            showSearch={() => this.showSearch()}
          />
          )
  }


  showSearch = () => {


    this.setState({
      heightSearch: showSearch ? 50 : 0
    })
    this.view.transitionTo({ height: showSearch ? 50 : 0, opacity: showSearch ? 1 : 0});
   showSearch = showSearch == false ? true : false;

  }

  handleViewSearchRef = ref => this.view = ref;

  render() {
   // console.log("rennder places list!!", this.props.screenProps.syncDraftsStatus)
    if(this.props.screenProps.myDocs && this.props.screenProps.isReady == true){
    /*

            <SelectableText
        menuItems={["Foo", "Bar"]}
        selectable={true}
        
        onSelection={({ eventType, content, selectionStart, selectionEnd }) => {}}
        
      >
      Hola!!!!
      </SelectableText>
      <SearchBar

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
              
            />
      */

    const search = (this.state.docs != null) ? this.state.docs.filter(createFilter(this.state.search, KEYS_TO_FILTERS)) : [];
    return (
        <View style={{flex:1}}>
        <HeaderScrollView isBeta={true} title={"Stories"} syncingStatus={this.props.screenProps.syncDraftsStatus} showSearch={true} tools={() => this._renderTools()}>
       
          
    

        <View animation={'fadeIn'}>
            <Animatable.View 

        style={{
          width: '100%',
          height: this.state.heightSearch,
          opacity: this.state.heightSearch,
          backgroundColor: 'transparent'
        }}

        ref={this.handleViewSearchRef}
        >
          <View style={{height:1}}>
          <SearchBar

              placeholder="Find your books"
              platform="ios"
              cancelButtonTitle="Cancel"
              style={{ opacity:this.state.heightSearch, paddingTop:5}}
              inputStyle={{opacity:this.state.heightSearch,paddingTop:5,backgroundColor: 'transparent', height: 1,}}
              containerStyle={{opacity:this.state.heightSearch,height: 1, marginTop:10, backgroundColor: 'transparent',  borderRadius: 5}}
              placeholderTextColor={'#666'}
              onChangeText={this.updateSearch}
              value={this.state.search}
              autoFocus={this.state.heightSearch > 0 ? true : false}
              onCancel={() => this.showSearch()}
              
            />
            </View>
          </Animatable.View>
          

              <RenderBusiness 
                  //onScrolling={this.props.screenProps.onScrolling.bind(this)} 
                  businessList={search}
                  onSearch={this.state.search}
                  shouldWorkChange={this.$shouldChange.bind(this)}
                  shouldDeleteWork={this.$shouldDeleteWork.bind(this)}
                  navigation={this.props.navigation}
                  _lowerDrawer={this.props._lowerDrawer}
                  _upperDrawer={this.props._upperDrawer}
                  updateDocs={(doc) => this._updateDocs(doc)}
                  onShareBook={(doc) => this.props.screenProps.shareBook(doc)}
                />



            
          </View>

         {/* <View style={styles.bottomNavOptions}>
            
                <Menu ref={r => (this.menu = r)} renderer={SlideInMenu} rendererProps={{ preferredPlacement: 'top', anchorStyle: {backgroundColor: 'transparent'} }} style={{backgroundColor: 'transparent', borderRadius: 8}}>
                    <MenuTrigger>
                    <Row size={12}>
                        <Col sm={2} md={2} lg={2}>
                          <View style={{width: 51, height: 50, backgroundColor: 'rgba(0,0,0,.4)', borderRadius: 10, marginLeft: 10}}>
                            <Entypo name="plus" size={25} style={{ color: '#fff', marginLeft: 12, marginTop: 12}}/>
                          </View>
                        </Col>
                        <Col sm={4} md={4} lg={4}>
                      <View style={{ width: 50, height: 40, textAlignVertical: "center" }}>

                        <Text style={systemWeights.bold, {fontSize: 20, paddingLeft: 10, paddingTop: 13, fontWeight: '500', color: 'rgba(255,255,255,.7)'}}>Add</Text>
                        </View>
                        </Col>
            </Row>
                    </MenuTrigger>
                    <MenuOptions
                      optionsContainerStyle={{backgroundColor: 'transparent' }}
                      >
                      <MenuOption style={{backgroundColor: 'rgb(50, 54, 57)', borderRadius: 8, padding: 15, margin: 5}} onSelect={() => this.importWorkEpub()}>
                        <Text style={[systemWeights.bold, {color: '#fff', fontSize: 18}]}>From file...</Text>
                      </MenuOption>
                      <MenuOption style={{backgroundColor: 'rgba(255,255,255,.8)', borderRadius: 8, padding: 15, margin: 5}} onSelect={() => this.$onCreateWork()} >
                        <Text style={[systemWeights.bold, {color: '#000', fontSize: 18}]}>New</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
              
          </View> 
        */}
            <Modal 
            onSwipeComplete={() => this.setState({ isModalVisible: false })}
        swipeDirection="down"
        swipeThreshold={90} 
              animationIn={'fadeInDown'}
              animationOut={'fadeOutDown'}
              animationOutTiming={500}
              animationInTiming={0}
              propagateSwipe 
              backdropTransitionOutTiming={0} 
              isVisible={this.state.isModalVisible} style={{ width: '100%', margin: 0, flex: 1, backgroundColor: '#fff' }}
              >
              
               {this.state.modalType == 'import' && this.renderCreateOptions()}
               {this.state.modalType == 'creator' && this.renderImport()}
                  
              </Modal>
               </HeaderScrollView>
          </View>

        )
    } else {

      return (
        <View style={{flex:1,backgroundColor: this.context == 'dark' ? '#111' : '#fff'}}>
      <ContentLoader 
              speed={2}
              width={ancho}
              height={460}
              viewBox={"0 0 400 "+ancho}
              backgroundColor="#eaeaea"
              foregroundColor="#c1c1c1"
              style={{width: '100%', marginTop: 30, display: 'flex', justifyContent: 'center'}}
            >
                  <Rect x="58" y="67" rx="2" ry="2" width="185" height="13" /> 
                  <Rect x="58" y="85" rx="2" ry="2" width="73" height="11" /> 
                  <Rect x="8" y="57" rx="5" ry="5" width="43" height="52" /> 
                  <Rect x="7" y="7" rx="10" ry="10" width="137" height="22" /> 
                  <Circle cx="377" cy="19" r="16" /> 
                  <Circle cx="337" cy="19" r="16" /> 
                  <Rect x="376" y="84" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="376" y="73" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="59" y="129" rx="2" ry="2" width="185" height="13" /> 
                  <Rect x="59" y="147" rx="2" ry="2" width="73" height="11" /> 
                  <Rect x="9" y="119" rx="5" ry="5" width="43" height="52" /> 
                  <Rect x="377" y="146" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="377" y="135" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="59" y="191" rx="2" ry="2" width="185" height="13" /> 
                  <Rect x="59" y="209" rx="2" ry="2" width="73" height="11" /> 
                  <Rect x="9" y="181" rx="5" ry="5" width="43" height="52" /> 
                  <Rect x="377" y="208" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="377" y="197" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="60" y="253" rx="2" ry="2" width="185" height="13" /> 
                  <Rect x="60" y="271" rx="2" ry="2" width="73" height="11" /> 
                  <Rect x="10" y="243" rx="5" ry="5" width="43" height="52" /> 
                  <Rect x="378" y="270" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="378" y="259" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="61" y="315" rx="2" ry="2" width="185" height="13" /> 
                  <Rect x="61" y="333" rx="2" ry="2" width="73" height="11" /> 
                  <Rect x="11" y="305" rx="5" ry="5" width="43" height="52" /> 
                  <Rect x="379" y="332" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="379" y="321" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="62" y="377" rx="2" ry="2" width="185" height="13" /> 
                  <Rect x="62" y="395" rx="2" ry="2" width="73" height="11" /> 
                  <Rect x="12" y="367" rx="5" ry="5" width="43" height="52" /> 
                  <Rect x="380" y="394" rx="52" ry="52" width="9" height="9" /> 
                  <Rect x="380" y="383" rx="52" ry="52" width="9" height="9" />
            </ContentLoader>

            </View>
            )
    }
  }
}