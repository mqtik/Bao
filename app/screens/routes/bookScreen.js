import React, {Component, PureComponent, useEffect, useContext, useState } from 'react';
import {Platform, StyleSheet, useLayoutEffect, Text, Animated, TextInput, ActivityIndicator, View, Button, Alert, FlatList, TouchableOpacity, ImageBackground, ScrollView, StatusBar, SafeAreaView , Dimensions} from 'react-native';
//import Icon from 'react-native-fa-icons';

import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../../utils/context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'


import { useWidth } from '../../utils/hooks'

import { TouchableRipple, Badge } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
//import styles from '../../styles/docScreen.style';
import { getLang, Languages } from '../../static/languages';
import { StretchyHeader } from '../../../libraries/stretchy';

import Carousel from 'react-native-snap-carousel';

import Icon from 'react-native-vector-icons/MaterialIcons';

import * as Progress from 'react-native-progress';
//<Progress.Pie indeterminate={!this.state.currentReading.progress} color={'#2cbb2c'} progress={progress == 100 ? progress : '0.'+progress} size={100} style={{marginTop: 15, alignSelf: 'center'}}/>

import AwesomeButton from "react-native-really-awesome-button";

import { sliderWidth, itemWidthDoc } from '../../styles/SliderEntry.style';

import AnimatedGradient from '../../components/animatedGradient';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import Snackbar from 'react-native-snackbar';

import _ from 'lodash'

import { systemWeights } from 'react-native-typography'

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../../services/sizeHelper';

import Entypo from 'react-native-vector-icons/Entypo';


import AntDesign from 'react-native-vector-icons/AntDesign';

import Spinner from 'react-native-spinkit'

import globalStyles, { globalColors } from '../../styles/globals.js';

import {Column as Col, Row} from 'react-native-flexbox-grid';

import FastImage from 'react-native-fast-image'


import { createImageProgress } from 'react-native-image-progress';

const Image = createImageProgress(FastImage);

import TouchableScale from 'react-native-touchable-scale';

import {DarkModeContext, initialMode} from 'react-native-dark-mode';
//static contextType = DarkModeContext;
import API from '../../services/api';

import { LoadingDocScreen } from '../../components/placeholders';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover, ContextMenu, SlideIn } = renderers

import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';

const CustomHeaderButton = (props) => (
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton IconComponent={Platform.OS == 'ios' ? Ionicons : MaterialCommunityIcons} iconSize={23} {...props} />
);




export default function BookScreen({ route, navigation}){
  const isDarkMode = useDarkMode();
  const belowGradient = isDarkMode == true ? ['#111','#111','#111','#111','#111','#111'] : ['#fff','#fff','#fff', '#fff','#fff','#fff', ];
  const { currentDoc, indexOfSlider, allDocs } = route.params;
  const ClouchDB = useContext(Clouch);
  const NewtDB = useContext(Newt);
  const [ selectedDoc, setSelectedDoc ] = useState(currentDoc);
  const [ chapters, setChapters ] = useState(null);
  const [ downloading, setDownloading ] = useState(false);
  const [ all, setAll ] = useState(allDocs);
  const [ indice, setIndice ] = useState(indexOfSlider || 0);
  const [ subIndex, setSubIndex ] = useState(0);
  const [ colorsGradient, setColorsGradient ] = useState(selectedDoc.colors ? [...selectedDoc.colors, ...belowGradient] : ['#fff', '#fff', '#fff']);
  const [ loading, setLoading ] = useState(null);
  const [like, setLike] = useState(null);
  const ancho = useWidth(); //full width
  const alto = Dimensions.get('window').height; //full height

  const carouselRef = React.useRef();
  // Effects
  useEffect(() => {
    $mount();
  }, []);

  useEffect(() => {
    if(selectedDoc){
      navigation.setOptions({
        headerTitle: selectedDoc.title || 'Details',
      });
      getLike(selectedDoc._id)
    }
    
  },[selectedDoc]);

  useEffect(() => {
    if(selectedDoc){
      navigation.setOptions({
        
        headerRight: props =>
          <>
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item color={like == true ? '#da2e2e' : (isDarkMode == true ? '#fff' : '#000')} title="back" iconName={like == true ? "heart" : "heart-outline"} onPress={() => likeBook()} />
            
              <Menu 
                                renderer={SlideIn} 
                                rendererProps={{ preferredPlacement: 'bottom', placement: 'bottom', anchorStyle: {backgroundColor: '#222'} }} 
                                style={{backgroundColor: 'transparent', borderRadius: 8, paddingRight:5}}
                                >
                                <MenuTrigger style={{width: 45, height: 45, paddingTop: 0, justifyContent: 'center', alignItems: 'center', borderRadius:50}}>
                                  <MaterialCommunityIcons color={isDarkMode == true ? '#fff' : '#000'} title="dots-vertical" name="dots-vertical" size={22}/>
                                </MenuTrigger>
                                <MenuOptions
                                  optionsContainerStyle={[globalStyles.popOver, { width: 250}]}
                                  >
                                  
                                  <MenuOption onSelect={() => NewtDB.shareBook(selectedDoc)} style={[{
                                          flexDirection: 'row',
                                          width: 350,


                                        }, globalStyles.popOverOption]}>
                                    <MaterialCommunityIcons name="share-outline" size={23} backgroundColor={'transparent'}  color={"#2575ed"} style={globalStyles.popoverOptionIcon} />
                                      
                                    <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>{Languages.Share[getLang()]}</Text>
                                    
                                  </MenuOption>
                                  <MenuOption onSelect={() => NewtDB.openAddToCollection(selectedDoc)} style={[{
                                          flexDirection: 'row',
                                          width: 350,


                                        }, globalStyles.popOverOption, globalStyles.popOverOptionLast]}>
                                    <MaterialCommunityIcons name="plus" size={23} backgroundColor={'transparent'}  color={"#2575ed"} style={globalStyles.popoverOptionIcon}/>
                                      
                                    <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>{Languages.collection[getLang()]}</Text>
                                    
                                  </MenuOption>
                                </MenuOptions>
                              </Menu>
            </HeaderButtons>
          </>
      });

    }
  },[selectedDoc, like]);

  async function $mount(){
     let firstIndex = _.findIndex(all, ['_id', selectedDoc._id]);
     if(selectedDoc.offline == true){
       let c = await ClouchDB.Chapters().findAll(selectedDoc._id).catch(e => null);
       //console.log("get chapters!", c)
       setChapters(c);
     }

     setIndice(firstIndex);
     setLoading(false);
  }

  async function onDownload(doc){
   // console.log("on download!", doc)
      let c = await ClouchDB.Chapters().findAll(doc._id).catch(e => null);
      //console.log("find chapters!!", c)
      if(c && c.length == 0 || typeof c === 'undefined'){
            Snackbar.show({ title: Languages.noChaptersSyncing[getLang()], duration: Snackbar.LENGTH_LONG })
            return;
      }

      let indexBook = _.findIndex(all, ['_id', doc._id]);
      all[indexBook].offline = true;


      
      return c;

  }

  async function onPlayBook(item, ind){
        //let doc = this.props.navigation.getParam('dataDoc', false);
        //console.log("doc", index)
        //console.log("all docs", all)
        //console.log("current doc", all[index])
       // console.log("on play book!", chapters)
        let dokp;
        //let indexBook = _.findIndex(all, ['_id', item._id]);
        if(ind != indice){
          return setIndice(ind);
        }
        // if(chapters == null){
        //   setDownloading(true);
        //   dokp = await onDownload(all[indice]);
        //   setDownloading(false);

        //   //console.log("on download!!!", dokp)
        // } else {
        //   dokp = chapters;
        // }
        // //console.log("dokp!,", dokp, chapters)
        // if(loading == true){
        //   Snackbar.show({ title: Languages.stillLoading[getLang()], duration: Snackbar.LENGTH_LONG })
        //   return;
        // }

        // if(chapters && chapters.length == 0){
        //   Snackbar.show({ title: Languages.noChaptersSyncing[getLang()], duration: Snackbar.LENGTH_LONG })
        //   return;
        // }


        //console.log("go reading!", item, ind, indice)
        //return;
        navigation.navigate('Reader',{
              //currentReading: item,
              //allChapters: dokp,
              readingIndex: (item.progress && item.progress.index && item.progress.total_index && item.progress.index <= item.progress.total_index) ? item.progress.index : 0,
              _id: item._id,
              editMode: false
             // docScreenUpdateStates: (book, index) => this.onUpdateParentBook(book, index)
             // currentUser: this.state.currentUser
            });
        return;
        
   }

   async function getLike(id){
    if(NewtDB.rootUser && NewtDB.rootUser.name && selectedDoc){
      let l = await NewtDB.triggerAction('liked');
        let c = await ClouchDB.Activities().getActivity(NewtDB.rootUser.name+'-likeBook:'+id);
        if(c == true){
          setLike(true);
        } else {
          setLike(false);
        }
      }
  }
  async function likeBook(){
    if(!selectedDoc && like == null){
      return;
    }
    NewtDB.triggerAction('liked');
    let lk = like == true ? false : true;

      setLike(lk);
    NewtDB.doLike(selectedDoc)
  }
  useEffect(() => {
    if(subIndex == 1 && indice != null && selectedDoc != null){
      getPartsSubIndex()
    }
  },[subIndex, selectedDoc, indice]);

  async function getPartsSubIndex(){
    if(!all[indice].chapters){
           // let u = await(Remote.Auth().getLocalUser(all[index].userId))
            if(all[indice].offline == true){
              c = await(ClouchDB.Work().drafts().chapters().getPublishedChapters(all[indice]))
              let newAll = all;
              newAll[indice].chapters = c;
              setAll(newAll);
              setChapters(c);
            }
            //let c = await(Remote.Work().drafts().chapters().getPublishedChapters(all[index]))

           // all[index].user = u;
            
          }
  }
   async function snapToItem(index){
      
          //this.props.navigation.setParams({ selectedDocTitle: all[index].title });

          setLoading(true);
          setChapters(null);
          setLike(null);
          setIndice(index);
          setSubIndex(0);
          let c;
          
          


          //console.log("snap to item!")
          setSelectedDoc(all[index]);
         // setChapters(all[index].chapters);
          c = all[index].colors ? [...all[index].colors, ...belowGradient] : (isDarkMode == true ? ['#111', '#111', '#111'] : ['#fff', '#fff', '#fff']);
          setColorsGradient(c);
          setLoading(false);   


      return index;

      //let docIndex = _.findIndex(all, ['_id', key._id]);
    }

   async function onPlayBookChapter(libro, index){
        //let doc = this.props.navigation.getParam('dataDoc', false);
        //console.log("doc", index)
        //console.log("all docs", all)
        //console.log("current doc", all[index])
        //console.log("chapters!", chapters)
        if(chapters.length == 0){
          Snackbar.show({ title: Languages.noChaptersSyncing[getLang()], duration: Snackbar.LENGTH_LONG })
          return null;
        }
        //console.log("chapterss!!", chapters, chapters[0]._id.indexOf('coverPageFirst') == -1)
        if(chapters[0]._id.indexOf('coverPageFirst') == -1){
          let theFirst = {
            _id: 'coverPageFirst',
            title: libro.title,
            type: 'firstPage'
           };
           
           await(chapters.unshift(theFirst));
        }
        
       /* let ind = 0;
        if(index == 0){
          ind == 0;
        } else {
          ind = index + 1
        }*/
       // console.log("chapters after", chapters)
       let indexBook = _.findIndex(all, ['_id', libro._id]);

      navigation.navigate('Reader',{
                                        _id: all[indexBook]._id,
                                        //currentReading: all[indexBook],
                                        //allChapters: chapters,
                                        //indexChapter: index,
                                        //index: indexBook || 0,
                                        editMode: false,
                                        //docScreenUpdateStates: (doc, index) => this.onUpdateParentBook(doc, index)
                                       // currentUser: this.state.currentUser
                                      });
        return;
        
   }
  function _renderItem(item, i){
      if(item.cover && item.cover != null){
        return (
            <TouchableOpacity style={{flex: 1}} onPress={() => onPlayBook(item, i)} >
                {
                  Platform.OS == 'ios' ?
                  (<Image 
                      imageStyle={{borderRadius: 12}}
                      source={ item.cover ? { uri: encodeURI(item.cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : { uri: '../../../bg.jpg'}}
                      indicator={Progress.Circle}
                      borderRadius={12}
                      parallaxFactor={0.35}
                      indicatorProps={{
                                  size: 80,
                                  borderWidth: 0,
                                  color: 'rgba(150, 150, 150, 1)',
                                  unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                }}
                      style={[styles.image,{justifyContent: 'center', height: 290, width: '100%',borderRadius: 12,
                                            backgroundColor: item.colors ? item.colors[1] : '#000'}]}
                      resizeMode={FastImage.resizeMode.cover}
                      >
                      <View style={{position: 'absolute', height: 75, width: '100%', justifyContent: 'flex-end', alignSelf: 'center'}}>
                      
                      { indice == i && downloading == true &&
                        <Progress.Circle borderWidth={2} indeterminate borderColor={isDarkMode == true ? '#fff' : '#000'} color={'#2cbb2c'} size={80} style={{alignSelf: 'center', marginTop: 0}}/>
                      }

                      
                      {
                        _renderProgress(item)
                      }
                      

                         
                       </View>
                       <Ionicons style={{alignSelf: 'center', marginTop: Platform.OS == 'ios' ? -4 : -5}} name={'ios-play-circle'} size={80} color={item.colors ? item.colors[1] : '#fff'}/>
                      </Image>) : (<FastImage 
                      imageStyle={{borderRadius: 12}}
                      source={ item.cover ? { uri: encodeURI(item.cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : { uri: '../../../bg.jpg'}}
                      indicator={Progress.Circle}
                      borderRadius={12}
                      parallaxFactor={0.35}
                      indicatorProps={{
                                  size: 80,
                                  borderWidth: 0,
                                  color: 'rgba(150, 150, 150, 1)',
                                  unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                }}
                      style={[styles.image,{justifyContent: 'center', height: 290, width: '100%',borderRadius: 12,
                                            backgroundColor: item.colors ? item.colors[1] : '#000'}]}
                      resizeMode={FastImage.resizeMode.cover}
                      >
                      <View style={{position: 'absolute', height: 75, width: '100%', justifyContent: 'flex-end', alignSelf: 'center'}}>
                      { indice == i && downloading == true &&
                        <Progress.Circle borderWidth={2} indeterminate borderColor={isDarkMode == true ? '#fff' : '#000'} color={'#2cbb2c'} size={80} style={{alignSelf: 'center', marginTop: -1}}/>
                      }
                      { _renderProgress(item) }
                       </View>
                       <Ionicons style={{alignSelf: 'center', marginTop: Platform.OS == 'ios' ? 0 : -5}} name={'ios-play-circle'} size={80} color={item.colors ? item.colors[1] : '#fff'}/>
                      </FastImage>)
                }
                </TouchableOpacity>

        );
      } else {
        return (
                <TouchableOpacity style={{flex: 1}} onPress={() => onPlayBook(item, i)} >
                  <View 
                      style={[styles.image,{justifyContent: 'center', height: 290, width: '100%',borderRadius: 12,backgroundColor: item.colors ? item.colors[1] : '#000'}]}>
                        <View style={{position: 'absolute', height: 75, width: '100%', justifyContent: 'flex-end', alignSelf: 'center'}}>
                          {
                            indice == i && downloading == true &&
                            <Progress.Circle borderWidth={2} indeterminate borderColor={isDarkMode == true ? '#fff' : '#000'} color={'#2cbb2c'} size={80} style={{alignSelf: 'center', marginTop: -1}}/>
                          }
                          { 
                            _renderProgress(item)
                          }
                         </View>
                       <Ionicons style={{alignSelf: 'center', marginTop: Platform.OS == 'ios' ? 0 : -5}} name={'ios-play-circle'} size={80} color={item.colors ? item.colors[1] : '#fff'}/>
                    </View>
                </TouchableOpacity>

        );
      }

        
  }
  function goProfile(profile){
    navigation.navigate('Profile',{
              _id: profile,
          });
   
  }
  function _renderProgress(book){

    let p, progress;
    if(!book.progress || !book.count_chapters){
      return;
    }
    let pg = parseFloat(book.progress.index), cg = parseFloat(book.progress.total_index);
        progress = ((pg / cg));
        p = progress > 1 ? 1 : progress;



    return (
      <Progress.Circle borderWidth={2} borderColor={isDarkMode == true ? '#fff' : '#000'} color={'#2cbb2c'} progress={p} size={80} style={{alignSelf: 'center', marginTop: -1}}/>
      )
   }
   function _renderChapter(book, chapter, index){
     // console.log("Book render chapter", book, chapter, index)
      return (
        <TouchableRipple onPress={() => onPlayBookChapter(book, index)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: isDarkMode == true ? '#222' : '#eaeaea', marginBottom: 0, padding: 15}}>
                                <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                      <Badge style={{backgroundColor: '#2575ed', marginTop: -5  }}>{index + 1}</Badge>
                                      <Text style={{color: isDarkMode == true ? '#fff' : '#000', marginLeft: 10, fontSize: 19, fontWeight: '700'}}>{chapter.title}</Text>
                                    </View>
                                   <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                    <Icon color={isDarkMode == true ? '#fff' : '#000'} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> 
                                   </View>
                                </View>
            </TouchableRipple>
        )
    }

  function _renderTabs(){
      const ChapterListBook = () => (
        <View style={[styles.scene, {  }]}>
        { chapters != null &&
          <FlatList
              data={chapters}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={200}
              //horizontal={true}
              style={{marginTop: 0}}
              contentContainerStyle={{paddingBottom: 35}}
              renderItem={({ item, index }) => _renderChapter(selectedDoc, item, index)}
              keyExtractor={item => item._id}
              ListEmptyComponent={chapters != null && chapters.length == 0 &&<View style={{flex:1, justifyContent:'center'}}>
                    <Text style={{fontSize: 20, marginTop: 30, color: isDarkMode == true ? '#fff' : '#000', textAlign: 'center'}}>There are no chapters</Text>
                  </View>}
            />
        }
        
        {
                              (loading == false && (chapters == null || chapters && chapters.length == 0)) &&
                              <View>
                               <AwesomeButton
                                      progress
                                      onPress={async(next) => {
                                        /** Do Something **/
                                        let d = await(onDownload(selectedDoc));
                                        setChapters(d);
                                        next();
                                      }}
                                      style={{margin: 10, marginBottom: 20}}
                                      width={ancho - 20 }
                                      raiseLevel={0}
                                      borderRadius={8}
                                      borderColor={'#111'}
                                      borderWidth={1}
                                      textSize={17}
                                      backgroundColor={'#333'}
                                      backgroundProgress={'#444'}
                                    >
                                      {Languages.show[getLang()]+' '+Languages.Chapters[getLang()].toLowerCase()} 
                                </AwesomeButton>
                              </View>
                            }
        {(loading == true) &&
          <View style={{flex:1, justifyContent:'center', backgroundColor: isDarkMode == true ? '#222' : '#f7f8fa'}}>
            <Spinner style={{marginTop: 50, alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={isDarkMode == true ? '#fff' : '#000'}/>
          </View>
        }
        </View>
      );

      const DetailsInfoBook = () => (
        <View style={[styles.scene, { }]}>
          <TouchableRipple onPress={() => goProfile(selectedDoc.userId)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: isDarkMode == true ? '#222' : '#eaeaea', marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>By</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  <Text numberOfLines={1} style={{color: isDarkMode == true ? '#ccc' : '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{selectedDoc && selectedDoc.userId && selectedDoc.userId}</Text>
                                  <Icon color={isDarkMode == true ? '#fff' : '#000'} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> 
                                 </View>
                              </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => goProfile(selectedDoc.userId)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: isDarkMode == true ? '#222' : '#eaeaea', marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Name</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  <Text numberOfLines={1} style={{color: isDarkMode == true ? '#ccc' : '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{selectedDoc && selectedDoc.title && selectedDoc.title}</Text>
                                 </View>
                              </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => goProfile(selectedDoc.userId)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: isDarkMode == true ? '#222' : '#eaeaea', marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Language</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  <Text numberOfLines={1} style={{color: isDarkMode == true ? '#ccc' : '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{selectedDoc && selectedDoc.language && selectedDoc.language == 'es' ? 'Español' : 'English' }</Text>
                                 </View>
                              </View>
          </TouchableRipple>
          {selectedDoc && selectedDoc.author &&
            <TouchableRipple onPress={() => goProfile(selectedDoc.userId)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: isDarkMode == true ? '#222' : '#eaeaea', marginBottom: 0, padding: 15}}>
                                <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                   <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Author</Text>
                                   <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                    <Text numberOfLines={1} style={{color: isDarkMode == true ? '#ccc' : '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{selectedDoc.author}</Text>
                                   </View>
                                </View>
            </TouchableRipple>
          }

        </View>
      );


      const renderTabs = SceneMap({
                        info: DetailsInfoBook,
                        chapters: ChapterListBook
                      });
      const solapas = {
                        index: subIndex || 0,
                        routes: [
                          { key: 'info', title: Languages.info[getLang()] },
                          { key: 'chapters', title: Languages.Chapters[getLang()] },
                        ]
                      };


      return (
        <TabView
            navigationState={solapas}
            onIndexChange={(index) => setSubIndex(index)}
            renderScene={renderTabs}
            renderTabBar={props =>
                <TabBar
                  {...props}
                  indicatorStyle={{ 
                    backgroundColor: isDarkMode == true ? '#fff' : '#000', 
                    height:3 }}
                  style={{ backgroundColor: 'transparent' }}
                  renderLabel={({ route, focused, color }) => (
                  <Text style={{ 
                    fontSize: 18,
                    color: isDarkMode == true ? '#fff' : '#000',
                    fontWeight: 'bold', 
                    margin: 10 }}>
                    {route.title}
                  </Text>
                )}
                />
              }
          />
       );
     
     
    }

  function _renderDetailsBook(){
    return (
      <View style={[styles.container, {paddingTop: 0}]}>
        <AnimatedGradient
                  useNativeDriver={true}
                  style={styles.gradient}
                  colors={colorsGradient}
                  isDarkMode={isDarkMode}
                  start={{ 
                  x : 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />

                

                <View style={{ marginTop: getHeaderHeight(), paddingBottom: 50}}> 
                
                  <Carousel
                      ref={carouselRef}
                      data={all}
                      renderItem={({item, index}) => _renderItem(item, index)}
                      sliderWidth={ancho}
                      itemWidth={itemWidthDoc}
                      firstItem={indice}
                      //initialScrollIndex={this.state.index}
                      slideStyle={{ width: itemWidthDoc }}

                      renderToHardwareTextureAndroid
                      decelerationRate={'fast'}
                      snapOnAndroid

                      animationOptions={{
                        isInteraction: false,
                        useNativeDriver: true,
                      }}

                      removeClippedSubviews={false}

                      apparitionDelay={Platform.OS == 'ios' ? 10 : undefined}

                      maxToRenderPerBatch={4}


                      activeSlideAlignment="center"

                      initialNumToRender={20}

                      //windowSize={4}
                      useNativeDriver={true}

                      inactiveSlideScale={0.9}
                      inactiveSlideOpacity={0.9}

                      slideStyle={{ flex: 1 }}

                      containerCustomStyle={styles.slider}

                      contentContainerCustomStyle={{ overflow: 'visible' }}
                      //onBeforeSnapToItem={(index) => this._beforeSnap(index) }
                      onSnapToItem={(index) => snapToItem(index) }
                    />

                    { ( selectedDoc != null && loading == false) &&
                        <View style={{backgroundColor: 'trasparent', marginTop: 30, width: '100%'}}>

                        
                        
                          <Text style={[systemWeights.bold, {color: isDarkMode == true ? '#fff' : '#000', fontSize:20, textAlign: 'center'}]}>{selectedDoc.author}</Text>

                          
                          <Text 
                            numberOfLines={10}
                            style={[systemWeights.light, {color: isDarkMode == true ? '#cecece' : '#111', fontSize:16, padding: 15, textAlign: 'justify'}]}
                            >{selectedDoc.description}</Text>
                          
                          <ScrollView horizontal 
                            contentContainerStyle={{
                              alignSelf: 'center', 
                              flexWrap: 'wrap', 
                              alignItems: 'flex-start',
                              height: 35,
                              flexDirection:'row', marginBottom: 20
                            }}>
                          { selectedDoc.tags && selectedDoc.tags.map((tag, index) => {
                                      return (<View key={index} style={{borderWidth: 1, borderColor: selectedDoc.colors ? index % 2 === 1 ? hexToRgbA(selectedDoc.colors[0]) : hexToRgbA(selectedDoc.colors[1]) : '#dadada',height: 35, display: 'flex', paddingLeft: 8, paddingRight: 8, justifyContent: 'center', alignItems: 'center', marginRight: 3,  marginLeft: index == 0 ? 10 : 3, backgroundColor: isDarkMode == true ? '#000' : '#fff', borderRadius: 20}}>
                                          <Text key={index} style={{alignSelf: 'flex-start', color: '#999', fontWeight: '700', textTransform: 'capitalize'}}>
                                            {tag}
                                            </Text>
                                          </View>)
                                    })}
                          </ScrollView>

                          { _renderTabs() }
                            
                         

                          
                        </View>
                      }

                  
                      { loading == true &&
                            <View style={{flex: 1, justifyContent: 'center',alignItems:'center', marginTop:20,backgroundColor: 'transparent'}}>
                              <LoadingDocScreen />
                            </View>
                          }
                    </View>

          </View>
    )
  }

  if (loading == null && selectedDoc == null && all == null && index == null) {
      return (
        <View style={{flex:1, justifyContent:'center', backgroundColor: isDarkMode == true ? '#222' : '#f7f8fa'}}>
          <Spinner style={{alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={isDarkMode == true ? '#fff' : '#000'}/>
        </View>
        )
  }

  return(
    <View style={{flex:1, width: '100%', height: '100%', backgroundColor: isDarkMode == true ? '#111' : '#f7f8fa'}}>
         
                  
         <FlatList
              data={[{key: 'section'}]}
              initialNumToRender={1}
              maxToRenderPerBatch={1}
              updateCellsBatchingPeriod={1}
              //horizontal={true}
              style={{marginTop: 0}}
              contentContainerStyle={{paddingBottom: 35}}
              renderItem={({ item, index }) => _renderDetailsBook()}
              keyExtractor={(item, ind) => ind.toString()}
              ListEmptyComponent={<View style={{flex: 1, justifyContent: 'center',alignItems:'center', marginTop:20,backgroundColor: 'transparent'}}>
                      <LoadingDocScreen />
                    </View>}
            /> 
       </View>
   );
}




function incrementColor(color, step) {
  const intColor = parseInt(color.substr(1), 16);
  const newIntColor = (intColor + step).toString(16);
  return `#${'0'.repeat(6 - newIntColor.length)}${newIntColor}`;
};


function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',.1)';
    }
    throw new Error('Bad Hex');
}



const Remote = new API({ url: API_URL })

let colors = ["#f7f8fa", "#f7f8fa", "#f7f8fa"];

let clickPlay = false;


let mounted = false;

export class DocScreenS extends PureComponent {
    static contextType = DarkModeContext;
    static navigationOptions = ({ navigation }) => {
          
          const { params = {} } = navigation.state;

        return {
          //Default Title of ActionBar
            //Background color of ActionBar
            headerTitle: navigation.getParam('selectedDocTitle', Languages.Details[getLang()]),
            headerBackTitle: null,
            headerRight: (<Menu 
                ref={r => (this.menu = r)} 
                renderer={SlideIn} 
                rendererProps={{ preferredPlacement: 'bottom', placement: 'bottom', anchorStyle: {backgroundColor: '#222'} }} 
                style={{backgroundColor: 'transparent', borderRadius: 8, paddingRight:5}}
                >
                <MenuTrigger style={{width: 50, height: 50, paddingTop: 8}}>
              
                
                  <Entypo name="forward" size={23} style={{color: params.context == 'dark' ? '#fff' : '#111', textAlign: 'right', marginTop: 6, paddingRight: 5, alignSelf: 'center'}} />
                
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={[styles.popOver, {padding:0, backgroundColor: '#222', height: 50, borderRadius: 10}]}
                  >
                  <View style={{overflow: 'hidden', minHeight: 150, maxHeight: 310, display: 'flex', position: 'relative'}}>

                    <TouchableOpacity style={{padding: 4}} onPress={() => params.share()}>
                          <Row size={12} style={{padding: 10, height: 44, borderBottomWidth: 0, borderColor: '#333'}}>
                          <Col sm={11} md={11} lg={11}>
                            <Text style={[globalStyles.sortTitles, {textTransform: 'capitalize'}]}>Share</Text>
                          </Col>
                          </Row>
                    </TouchableOpacity>
                  

              
                  </View>
                </MenuOptions>
              </Menu>)
          //Text color of ActionBar
        };
      };
    constructor (props) {
        super(props);
        
       // const docIndex = _.findIndex(props.navigation.state.params.allDocs, ['_id', props.navigation.state.params.selectedDoc._id]);

        //console.log("this context doc press!", props.navigation.state.params.indexOfSlider)
        this.colorsFinal = initialMode == 'dark' ? ['#111','#111','#111'] : ['#f7f8fa','#f7f8fa','#f7f8fa'];
        //console.log("Doc data!", doc)

        this.state = {
            selectedDoc: props.navigation.state.params.selectedDoc || null,
            isLoading: true,
            allDocs: props.navigation.state.params.allDocs || null,

            isReady: false,

            index: props.navigation.state.params.indexOfSlider || 0,
            indexTab: 0,
            count: 0,
            colorTop: '#000000',
            colorBottom: '#cccccc',
            isDownloading: false,

            colors: props.navigation.state.params.selectedDoc.colors ? [...props.navigation.state.params.selectedDoc.colors, ...this.colorsFinal] : ['#fff', '#fff', '#fff'],
            currentUser: null,
            chapters: null
        };

        props.navigation.setParams({ share: () => this.triggerShare(), selectedDocTitle: props.navigation.state.params.selectedDoc.title, context: initialMode });

       
    }

    triggerShare = () => {

      if(this.props.screenProps.shareBook){
        this.props.screenProps.shareBook(selectedDoc);
      }
    }
    componentDidMount() {

      //this.props.navigation.setParams({ context: this.context });
      mounted = true;
      //console.log("this colros final!", this.props)
      this.$init();


        /*APILocal.get(this.state._id).then(doc => {
            //console.log("Component did mount")
          console.log(doc);
          this.setState({ isLoading: false, docBook: doc })
        });*/
    }

    componentWillUnmount(){
      mounted = false;
    }

    $init = async() => {
     // console.log("this props init! doc screen", this.props)
      if(this.props.navigation.state.params.selectedDoc && this.props.navigation.state.params.selectedDoc != null && mounted == true){
        const docIndex = _.findIndex(this.props.navigation.state.params.allDocs, ['_id', this.props.navigation.state.params.selectedDoc._id]);






       // let u = await(Remote.Auth().getLocalUser(this.props.navigation.state.params.selectedDoc.userId))
       let c = null;
       if(this.props.navigation.state.params.selectedDoc.offline == true){
         c = await(Remote.Work().drafts().chapters().getPublishedChapters(this.props.navigation.state.params.selectedDoc))
       }
        //let c = await(Remote.Work().drafts().chapters().getPublishedChapters(this.props.navigation.state.params.selectedDoc))






          this.setState({
                        //selectedDoc: this.props.navigation.state.params.selectedDoc, 
                       // currentUser: u,
                        //allDocs: this.props.navigation.state.params.allDocs, 
                        isLoading: false,
                        isReady: true,
                        index: docIndex, 
                        //colors: [...this.props.navigation.state.params.selectedDoc.colors, ...this.colorsFinal],
                        chapters: c
                      });  

        

        //console.log("chapters", chapters)
        //let uIDs = this.props.navigation.state.params.selectedDoc.map(function (row) { return row.userId; }); 

        



      }
     // console.log("this state doc", this.state)
      //let dc = await(Remote.Work().drafts().chapters().getDocsWithUserId());
      
    }

    onUpdateParentBook = (book, index) => {

      let indexBook = _.findIndex(all, ['_id', book._id]);

      if(mounted == true){




        all[indexBook].progress = index;
        this.setState({
            selectedDoc: {
              ...selectedDoc,
              progress: index
            }
          })
      }
    }
    
    onPlayBook = async(book, index) => {
        //let doc = this.props.navigation.getParam('dataDoc', false);
        //console.log("doc", index)
        //console.log("all docs", all)
        //console.log("current doc", all[index])
        const { allDocs } = this.state;
        let indexBook = _.findIndex(all, ['_id', book._id]);

        if(chapters == null || chapters && chapters.length == 0){


          //Snackbar.show({ title: Languages.replicatingEllipsis[getLang()], duration: Snackbar.LENGTH_LONG })

          this.setState({
            isDownloading: true
          })


          let down = await this._onDownload(all[index]);
          

          this.setState({
            isDownloading: false
          })


          

          
        }
        if(indexBook != index || index != this.state.index){
          return;
        }
        if(this.state.isLoading == true || this.state.isReady == false){
          Snackbar.show({ title: Languages.stillLoading[getLang()], duration: Snackbar.LENGTH_LONG })
          return;
        }

        if(chapters && chapters.length == 0){
          Snackbar.show({ title: Languages.noChaptersSyncing[getLang()], duration: Snackbar.LENGTH_LONG })
          return;
        }

       // console.log("chapters after", chapters)
        

        //console.log("on play book", index, indexBook,  all[indexBook])

        this.props.navigation.navigate('Reader',{
                                        currentReading: all[indexBook],
                                        allChapters: chapters,
                                        readingIndex: indexBook || 0,
                                        docScreenUpdateStates: (book, index) => this.onUpdateParentBook(book, index)
                                       // currentUser: this.state.currentUser
                                      });
        return;
        
   }

   onPlayBookChapter = async(book, index) => {
        //let doc = this.props.navigation.getParam('dataDoc', false);
        //console.log("doc", index)
        //console.log("all docs", all)
        //console.log("current doc", all[index])

        if(chapters.length == 0){
          Snackbar.show({ title: Languages.noChaptersSyncing[getLang()], duration: Snackbar.LENGTH_LONG })
          return null;
        }
        let chapters = chapters;
        //console.log("chapterss!!", chapters, chapters[0]._id.indexOf('coverPageFirst') == -1)
        if(chapters[0]._id.indexOf('coverPageFirst') == -1){
          let theFirst = {
            _id: 'coverPageFirst',
            title: book.title,
            type: 'firstPage'
           };
           
           await(chapters.unshift(theFirst));
        }
        
       /* let ind = 0;
        if(index == 0){
          ind == 0;
        } else {
          ind = index + 1
        }*/
       // console.log("chapters after", chapters)
       let indexBook = _.findIndex(all, ['_id', book._id]);

        this.props.navigation.navigate('Reader',{
                                        currentReading: all[indexBook],
                                        allChapters: chapters,
                                        indexChapter: index,
                                        index: indexBook || 0,
                                        docScreenUpdateStates: (book, index) => this.onUpdateParentBook(book, index)
                                       // currentUser: this.state.currentUser
                                      });
        return;
        
   }
   _openButton = () => {
       //let percentage = (this.state.docBook.percentage * 100).toFixed(0);
       //console.log("this percentage", percentage)
       return (

           <View style={{flex: 1, alignItems: 'center'}}>
               { /*percentage != 'NaN' && 
                       <View style={{height: 4, width: '100%', backgroundColor: 'rgba(0,0,0,.5)', borderRadius: 0, position: 'absolute', bottom: 0}}>
                              <View style={{height: 4, width: percentage+'%', backgroundColor: '#55c583', borderRadius: 0}}>
                              
                              </View>
                          </View>
              */ }
                  
           <TouchableOpacity style={styles.readDoc} onPress={() => { this.onReadPress(this.props);  }}> 
                 
                 <Ionicons name="ios-git-commit" style={styles.readDocIconCircle} /> 
                        <Text style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: 20, fontWeight: '500', textAlign: 'center', margin: 13, marginLeft: 50}}>
                            {Languages.readStart[getLang()]}
                        </Text>
                </TouchableOpacity>
                </View>
              );
   }

   _renderProgress = (book) => {

    let p, progress;
    if(!book.progress || !book.count_chapters){
      return;
    }
    let pg = parseFloat(book.progress), cg = parseFloat(book.count_chapters);
      progress = (pg / cg) * 10;
      p = progress >= 10 ? progress : '0.'+progress;



    return (
      <Progress.Circle borderWidth={2} borderColor={isDarkMode == true ? '#fff' : '#000'} color={'#2cbb2c'} progress={book.progress ? parseFloat(p) : 0} size={80} style={{alignSelf: 'center', marginTop: -1}}/>
      )
   }
   _renderItem = (item, index) => {
    //console.log("itemrender", item)
      if(item.cover && item.cover != null){
        return (

                
                <TouchableOpacity style={{flex: 1}} onPress={() => this.onPlayBook(item, index)} >
                {
                  Platform.OS == 'ios' ?
                  (<Image 
                      imageStyle={{borderRadius: 12}}
                      source={ item.cover ? { uri: encodeURI(item.cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : { uri: '../../../bg.jpg'}}
                      indicator={Progress.Circle}
                      borderRadius={12}
                      parallaxFactor={0.35}
                      indicatorProps={{
                                  size: 80,
                                  borderWidth: 0,
                                  color: 'rgba(150, 150, 150, 1)',
                                  unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                }}
                      style={[styles.image,{justifyContent: 'center', height: 290, width: '100%',borderRadius: 12,
                                            backgroundColor: item.colors ? item.colors[1] : '#000'}]}
                      resizeMode={FastImage.resizeMode.cover}
                      >
                      <View style={{position: 'absolute', height: 75, width: '100%', justifyContent: 'flex-end', alignSelf: 'center'}}>
                      {
                        this.state.index == index && this.state.isDownloading == true &&
                        <Progress.Circle borderWidth={2} indeterminate borderColor={isDarkMode == true ? '#fff' : '#000'} color={'#2cbb2c'} size={80} style={{alignSelf: 'center', marginTop: -1}}/>
                      }
                      
                      { 
                        this._renderProgress(item)

                      }
                      

                         
                       </View>
                       <Ionicons style={{alignSelf: 'center', marginTop: Platform.OS == 'ios' ? 0 : -5}} name={'ios-play-circle'} size={80} color={item.colors ? item.colors[1] : '#fff'}/>
                      </Image>) : (<FastImage 
                      imageStyle={{borderRadius: 12}}
                      source={ item.cover ? { uri: encodeURI(item.cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : { uri: '../../../bg.jpg'}}
                      indicator={Progress.Circle}
                      borderRadius={12}
                      parallaxFactor={0.35}
                      indicatorProps={{
                                  size: 80,
                                  borderWidth: 0,
                                  color: 'rgba(150, 150, 150, 1)',
                                  unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                }}
                      style={[styles.image,{justifyContent: 'center', height: 290, width: '100%',borderRadius: 12,
                                            backgroundColor: item.colors ? item.colors[1] : '#000'}]}
                      resizeMode={FastImage.resizeMode.cover}
                      >
                      <View style={{position: 'absolute', height: 75, width: '100%', justifyContent: 'flex-end', alignSelf: 'center'}}>
                      {
                        this.state.index == index && this.state.isDownloading == true &&
                        <Progress.Circle borderWidth={2} indeterminate borderColor={isDarkMode == true ? '#fff' : '#000'} color={'#2cbb2c'} size={80} style={{alignSelf: 'center', marginTop: -1}}/>
                      }
                      
                      { 
                        this._renderProgress(item)

                      }
                      

                         
                       </View>
                       <Ionicons style={{alignSelf: 'center', marginTop: Platform.OS == 'ios' ? 0 : -5}} name={'ios-play-circle'} size={80} color={item.colors ? item.colors[1] : '#fff'}/>
                      </FastImage>)
                }

                    
                      
                  
                </TouchableOpacity>

        );
      } else {
        return (

                
                <TouchableOpacity style={{flex: 1}} onPress={() => this.onPlayBook(item, index)} >

                    <View 

                      style={[styles.image,{justifyContent: 'center', height: 290, width: '100%',borderRadius: 12,
                                            backgroundColor: item.colors ? item.colors[1] : '#000'}]}

                      >
                      <View style={{position: 'absolute', height: 75, width: '100%', justifyContent: 'flex-end', alignSelf: 'center'}}>
                      {
                        this.state.index == index && this.state.isDownloading == true &&
                        <Progress.Circle borderWidth={2} indeterminate borderColor={isDarkMode == true ? '#fff' : '#000'} color={'#2cbb2c'} size={80} style={{alignSelf: 'center', marginTop: -1}}/>
                      }
                      
                      { 
                        this._renderProgress(item)

                      }
                      

                         
                       </View>
                       <Ionicons style={{alignSelf: 'center', marginTop: Platform.OS == 'ios' ? 0 : -5}} name={'ios-play-circle'} size={80} color={item.colors ? item.colors[1] : '#fff'}/>
                      </View>
                      
                  
                </TouchableOpacity>

        );
      }

        
    }

    _beforeSnap = (index) => {
      //colors = [...all[index].colors, ...colorsFinal];
      
    }

    _snapToDoc = async(index) => {
      
      if(mounted == true){
          this.props.navigation.setParams({ selectedDocTitle: all[index].title });

          this.setState({
            isReady: false,
            chapters: null,
            index: index
          });



          
          let c = null;
          if(!all[index].chapters){
           // let u = await(Remote.Auth().getLocalUser(all[index].userId))
            if(all[index].offline == true){
              c = await(Remote.Work().drafts().chapters().getPublishedChapters(all[index]))
              all[index].chapters = c;
            }
            //let c = await(Remote.Work().drafts().chapters().getPublishedChapters(all[index]))

           // all[index].user = u;
            
          }
          




          this.setState({
            selectedDoc: all[index],
           // currentUser: all[index].user,
           isReady: true,
            chapters: all[index].chapters,
            colors: all[index].colors ? [...all[index].colors, ...this.colorsFinal] : ['#fff', '#fff', '#fff']
            //colors: [...all[index].colors, ...colorsFinal]
          });




          
        }

      return;

      //let docIndex = _.findIndex(all, ['_id', key._id]);
    }


    _renderChapter = (book, chapter, index) => {
     // console.log("Book render chapter", book, chapter, index)
      return (
        <TouchableOpacity onPress={() => this.onPlayBookChapter(book, index)} style={{width: '100%', height: 55, backgroundColor: this.state.colors ? hexToRgbA(this.state.colors[1]) : '#fff', marginBottom: 3, padding: 15}}>

                            
                              <View style={{height:60, justifyContent: 'flex-start', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <View style={{marginTop: -2, width: 25, height: 25, backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)', borderWidth: 1, borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)', borderRadius:50, justifiContent: 'center'}}>

                                    <Text style={{color: isDarkMode == true ? '#fff' : '#000', marginTop: 5, fontSize: 11, fontWeight: '700', textAlign: 'center'}}>{index}</Text>
                                 </View>

                                 <Text numberOfLines={1} style={{color: isDarkMode == true ? (index % 2 === 1 ? '#fff' : '#dadada') : (index % 2 === 1 ? '#555' : '#111'), fontWeight: '700', margin: 0, marginLeft: 8, fontSize: 17, width: '80%'}}>{chapter.title}</Text>
                                
                                <AntDesign name="right" size={20} style={{position: 'absolute', top: 0, right: 2, color: '#444'}} /> 

                              </View>

        </TouchableOpacity>
        )
    }
    onTabViewIndexChange = (index) => {

      if(mounted == true){
        this.setState({
          indexTab: index
        })
      }
      
    }

    _onDownload = async(doc) => {

      let c = await(Remote.Work().drafts().chapters().getPublishedChapters(doc)).catch(e => null)


      



      if(c && c.length == 0 || typeof c === 'undefined'){
            Snackbar.show({ title: Languages.noChaptersSyncing[getLang()], duration: Snackbar.LENGTH_LONG })
            return;
          }

      let indexBook = _.findIndex(all, ['_id', doc._id]);
      all[indexBook].offline = true;


      await(this.setState({
        chapters: c
      }))
      return true;

    }
    _renderTabs = () => {
      const ChapterListBook = () => (
        <View style={[styles.scene, {  }]}>

          <FlatList
                            data={chapters}
                            initialNumToRender={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={200}
                            //horizontal={true}
                            style={{marginTop: 0}}
                            contentContainerStyle={{paddingBottom: 35}}
                            renderItem={({ item, index }) => this._renderChapter(selectedDoc, item, index)}
                            keyExtractor={item => item._id}
                          />
        
        {(chapters.length == 0 && this.state.isReady == false) &&
          <View style={{flex:1, justifyContent:'center', backgroundColor: isDarkMode == true ? '#222' : '#f7f8fa'}}>
            <Spinner style={{marginTop: 50, alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={isDarkMode == true ? '#fff' : '#000'}/>
          </View>
        }

        {(chapters.length == 0 && this.state.isReady == true) &&
          <View style={{flex:1, justifyContent:'center', backgroundColor: isDarkMode == true ? '#222' : '#f7f8fa'}}>
            <Text style={{fontSize: 20, marginTop: 30, color: isDarkMode == true ? '#fff' : '#000', textAlign: 'center'}}>There are no chapters</Text>
          </View>
        }
        </View>
      );

      const DetailsInfoBook = () => (
        <View style={[styles.scene, { }]}>

          <TouchableOpacity style={globalStyles.settingsItemList}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5.5} md={5.5} lg={5.5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.title[getLang()]}</Text>
                        </Col>
                        <Col sm={6} md={6} lg={6} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditableValue, {color: isDarkMode == true ? '#fff' : '#000'}]}>{selectedDoc ? selectedDoc.title : 'Untitled'}</Text>
                        </Col>
                        <Col sm={0.5} md={0.5} lg={0.5} style={{marginTop: 3, paddingLeft: 10 }}>
                          
                        </Col>
                      </Row>
                    </View>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.settingsItemList}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5.5} md={5.5} lg={5.5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.language[getLang()]}</Text>
                        </Col>
                        <Col sm={6} md={6} lg={6} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditableValue, {color: isDarkMode == true ? '#fff' : '#000'}]}>{selectedDoc ? selectedDoc.language : 'English'}</Text>
                        </Col>
                        <Col sm={0.5} md={0.5} lg={0.5} style={{marginTop: 3, paddingLeft: 10 }}>
                          
                        </Col>
                      </Row>
                    </View>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.settingsItemList}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5.5} md={5.5} lg={5.5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.publishedBy[getLang()]}</Text>
                        </Col>
                        <Col sm={6} md={6} lg={6} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditableValue, {color: isDarkMode == true ? '#fff' : '#000'}]}>{selectedDoc ? '@'+selectedDoc.userId : 'Anonymous'}</Text>
                        </Col>
                        <Col sm={0.5} md={0.5} lg={0.5} style={{marginTop: 3, paddingLeft: 10 }}>
                          
                        </Col>
                      </Row>
                    </View>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.settingsItemList}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5.5} md={5.5} lg={5.5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.author[getLang()]}</Text>
                        </Col>
                        <Col sm={6} md={6} lg={6} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditableValue, {color: isDarkMode == true ? '#fff' : '#000'}]}>{selectedDoc ? selectedDoc.author : '@'+selectedDoc.userId}</Text>
                        </Col>
                        <Col sm={0.5} md={0.5} lg={0.5} style={{marginTop: 3, paddingLeft: 10 }}>
                          
                        </Col>
                      </Row>
                    </View>
          </TouchableOpacity>
        </View>
      );


      const renderTabs = SceneMap({
                              chapters: ChapterListBook,
                              info: DetailsInfoBook,
                            });
      const solapas = {
                        index: this.state.indexTab || 0,
                        routes: [
                          { key: 'chapters', title: chapters.length +' '+Languages.Chapters[getLang()] },
                          { key: 'info', title: Languages.info[getLang()] }
                        ]
                      };


         return (
        <TabView
                              navigationState={solapas}
                              onIndexChange={this.onTabViewIndexChange}
                              renderScene={renderTabs}
                              renderTabBar={props =>
                                  <TabBar
                                    {...props}
                                    indicatorStyle={{ 
                                      backgroundColor: isDarkMode == true ? '#fff' : '#000', 
                                      height:3 }}
                                    style={{ backgroundColor: 'transparent' }}
                                    renderLabel={({ route, focused, color }) => (
                                    <Text style={{ 
                                      fontSize: 18,
                                      color: isDarkMode == true ? '#fff' : '#000',
                                      fontWeight: 'bold', 
                                      margin: 10 }}>
                                      {route.title}
                                    </Text>
                                  )}
                                  />
                                }
                            />
              );
     
     
    }
    render(){
        const {data, isLoading} = this.state;
        
    if (this.state.isLoading == true && selectedDoc == null && all == null && this.state.index == null) {
      return (
        <View style={{flex:1, justifyContent:'center', backgroundColor: isDarkMode == true ? '#222' : '#f7f8fa'}}>
          <Spinner style={{alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={isDarkMode == true ? '#fff' : '#000'}/>
        </View>
        )
    } else {
       // console.log("this state author", this.state)
       /*<Carousel
                      ref={c => this._slider1Ref = c}
                      data={all}
                      renderItem={this._renderItem}
                      sliderWidth={sliderWidth}
                      itemWidth={itemWidth}
                      hasParallaxImages={true}
                      firstItem={1}
                      inactiveSlideScale={0.8}
                      inactiveSlideOpacity={0.8}
                      // inactiveSlideShift={20}
                      containerCustomStyle={styles.slider}
                      contentContainerCustomStyle={styles.sliderContentContainer}
                      loop={true}
                      autoplay={false}
                      onSnapToItem={(index) => this._snapToDoc(index) }
                    />*/
        

        return(
          <View style={[styles.container, {backgroundColor: isDarkMode == true ? '#111' : '#f7f8fa'}]}>

              <ScrollView>
                <AnimatedGradient
                  style={styles.gradient}
                  colors={this.state.colors}
                  start={{ 
                  x : 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                  

                <View style={{flex: 1, paddingTop: getHeaderHeight(), paddingBottom: 50}}> 
                
                  <Carousel
                      ref={c => this.carousel = c}
                      data={all}
                      renderItem={({item, index}) => this._renderItem(item, index)}
                      sliderWidth={sliderWidth}
                      itemWidth={itemWidthDoc}
                      firstItem={this.state.index}
                      //initialScrollIndex={this.state.index}
                      slideStyle={{ width: itemWidthDoc }}

                      renderToHardwareTextureAndroid
                      decelerationRate={'fast'}
                      snapOnAndroid

                      animationOptions={{
                        isInteraction: false,
                        useNativeDriver: true,
                      }}

                      removeClippedSubviews={false}

                      apparitionDelay={10}

                      maxToRenderPerBatch={4}


                      activeSlideAlignment="center"

                      initialNumToRender={20}

                      //windowSize={4}
                      useNativeDriver={true}

                      inactiveSlideScale={0.9}
                      inactiveSlideOpacity={0.9}

                      slideStyle={{ flex: 1 }}

                      containerCustomStyle={styles.slider}

                      contentContainerCustomStyle={{ overflow: 'visible' }}
                      //onBeforeSnapToItem={(index) => this._beforeSnap(index) }
                      onSnapToItem={(index) => this._snapToDoc(index) }
                    />

                    { (selectedDoc != null && this.state.isReady == true) &&
                        <View style={{backgroundColor: 'trasparent', marginTop: 30, width: '100%'}}>

                        
                        
                          <Text style={[systemWeights.bold, {color: isDarkMode == true ? '#fff' : '#000', fontSize:20, textAlign: 'center'}]}>{selectedDoc.author}</Text>

                          
                          <Text 
                            numberOfLines={10}
                            style={[systemWeights.light, {color: isDarkMode == true ? '#cecece' : '#111', fontSize:16, padding: 15, textAlign: 'justify'}]}
                            >{selectedDoc.description}</Text>
                          <ScrollView horizontal contentContainerStyle={{alignSelf: 'center', flexWrap: 'wrap', 
            alignItems: 'flex-start',
            height: 35,
            flexDirection:'row', marginBottom: 20}}>
                          { selectedDoc.tags && selectedDoc.tags.map((tag, index) => {
                                      return (<View key={index} style={{borderWidth: 1, borderColor: selectedDoc.colors ? index % 2 === 1 ? hexToRgbA(selectedDoc.colors[0]) : hexToRgbA(selectedDoc.colors[1]) : '#dadada',height: 35, padding: 8, paddingLeft: 10, paddingRight: 12, marginRight: 3,  marginLeft: index == 0 ? 10 : 3, backgroundColor: isDarkMode == true ? '#000' : '#fff', borderRadius: 20}}>
                                          <Text key={index} style={{alignSelf: 'flex-start', color: '#999', fontWeight: '700', textTransform: 'capitalize'}}>
                                            {tag}
                                            </Text>
                                          </View>)
                                    })}
                          </ScrollView>

                          {
                            (chapters && chapters != null && chapters.length > 0) &&
                              this._renderTabs()
                            }
                            {
                              (chapters == null && this.state.isReady == true || chapters && chapters.length == 0 && this.state.isReady == true) &&
                               <AwesomeButton
                                      progress
                                      onPress={async(next) => {
                                        /** Do Something **/
                                        await(this._onDownload(selectedDoc))
                                        next();
                                      }}
                                      style={{margin: 10, marginBottom: 20}}
                                      width={ancho - 20 }
                                      raiseLevel={0}
                                      borderRadius={30}
                                      borderColor={'#111'}
                                      borderWidth={1}
                                      textSize={17}
                                      backgroundColor={'#333'}
                                      backgroundProgress={'#444'}
                                    >
                                      {Languages.show[getLang()]+' '+Languages.Chapters[getLang()].toLowerCase()} 
                          </AwesomeButton>
                            }
                         

                          
                        </View>
                      }

                  {
                    this.state.isReady == false &&
                    <View style={{flex: 1, justifyContent: 'center',alignItems:'center', marginTop:20,backgroundColor: 'transparent'}}>

                      <LoadingDocScreen />
                    </View>
                  }

                    </View>
              </ScrollView>
          </View>
        );
    }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    marginTop:-getHeaderHeight()
  },
  contentContainer: {
    flexGrow: 1,
  },
  slider: {
        marginTop: 15,

        //backgroundColor: '#eaeaea'
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    gradient: {
      width: '100%',
      height: 600,
      position: 'absolute',
    },

});


