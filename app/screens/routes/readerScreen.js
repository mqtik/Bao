import React, {Component, PureComponent, useContext, useLayoutEffect, useEffect, useState, useCallback, useRef} from 'react';
import {Platform, StyleSheet, BackHandler, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, TouchableHighlight, ActivityIndicator, Dimensions, View, Alert, TouchableOpacity, Image, Keyboard, ImageBackground, StatusBar,
  AppRegistry,
  Animated,
  Easing } from 'react-native';

import ViewPager from '@react-native-community/viewpager';
import { LazyViewPager }  from '../../components/native.swiper';

import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../../utils/context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'
import Drawer from '../../components/drawer.js';
import { useBackButton } from '../../utils'
import { Cover } from '../../utils/renders';
import Snackbar from 'react-native-snackbar';
import ToggleSwitch from 'toggle-switch-react-native'
import { Switch } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import PropTypes from "prop-types";
import Fades from '../../components/fades';
import AwesomeButton from "react-native-really-awesome-button";
import Scalable from '../../components/scalable';
import { Button, TouchableRipple, Checkbox, Badge, IconButton, Paragraph, Dialog, Portal, RadioButton } from 'react-native-paper';
import Wysiwyg from '../../components/wysiwyg/index'
import { useHeight, useWidth } from '../../utils/hooks'
import { SkeletonSection, SkeletonGrid, SkeletonList, SkeletonTextBook} from '../../utils/skeletons'
import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../../services/sizeHelper';
import { ChaptersWriteNone, NoChaptersRead, MenuIcon } from '../../utils/vectors';
import Slider from '@react-native-community/slider';

import Tts from "react-native-tts";
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_STORAGE_CONTENTS, API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import Pagination,{Dot} from 'react-native-pagination'
import Spinner from 'react-native-spinkit'
//<Spinner style={{alignSelf: 'center'}} isVisible={true} size={35} type={"Arc"} color={"#fff"}/>
import CNEditor , { CNToolbar , getDefaultStyles, convertToObject } from "react-native-cn-richtext-editor";
import Swiper from 'react-native-swiper'
//import SwiperFlatList from 'react-native-swiper-flatlist';
//import SwiperFlatList from '../../components/swiper';
import Placeholder, { Line, Media } from "rn-placeholder";
import { sliderWidth, itemWidthDoc } from '../../styles/SliderEntry.style';
import { getLang, Languages } from '../../static/languages';

import {Column as Col, Row} from 'react-native-flexbox-grid';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from "react-native-modal";
import SwitchSelector from 'react-native-switch-selector';
import FastImage from 'react-native-fast-image'

import { Searchbar } from 'react-native-paper';
import { ButtonGroup } from 'react-native-elements';

import { BlurView, VibrancyView } from "../../../libraries/blur";
import globalStyles, { globalColors } from '../../styles/globals.js';

import { systemWeights } from 'react-native-typography'

import {DarkModeContext} from 'react-native-dark-mode';
//static contextType = DarkModeContext;
import * as Progress from 'react-native-progress';

import _ from 'lodash'

import API from '../../services/api';


import update from 'immutability-helper'

import Carousel from 'react-native-snap-carousel';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { MenuProvider } from 'react-native-popup-menu';

import { SliderPicker } from 'react-native-slider-picker';
import equal from "fast-deep-equal/react";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover, SlideIn } = renderers;
import { useFocusEffect } from '@react-navigation/native';
import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker
} from "../../../libraries/settings";

import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import KeepAwake from '@sayem314/react-native-keep-awake';

import changeNavigationBarColor, {
  HideNavigationBar,
  ShowNavigationBar,
} from 'react-native-navigation-bar-color';

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
  <HeaderButton IconComponent={Platform.OS == 'ios' ? Ionicons : Icon} iconSize={23} {...props} />
);
const renderPagination = (index) => {
  return (
    <TouchableOpacity style={{width: 30, height: 30, borderRadius: 20, backgroundColor: 'rgba(0,0,0,.6)', justifyContent:'center', marginRight: 5}}><Text style={{alignSelf: 'center', color: '#fff', fontWeight: '500'}}>{navigation.getParam('currentPageNumber', '0')}</Text></TouchableOpacity>
  )
}

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',.6)';
    }
    throw new Error('Bad Hex');
}



const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");


let loaded = 0;
let index = 0;
let lastUterance = 0;
let isTalking = false;
let spokenArray = [];
let lastRelevantAudioState = [{
  audioPosition: null,
  talking: null,
  audioMode: null
}];
import RnBgTask from 'react-native-bg-thread';

let scrollViewableItems;
export default function ReaderScreen({navigation, route}){
  const isDarkMode = useDarkMode();
  const ClouchDB = useContext(Clouch);
  const NewtDB = useContext(Newt);
  const { allChapters, _id, readingIndex, editMode } = route.params;
  // const nextChapters = allChapters.filter(b =>{
  //   console.log("next chap!", b)
  //    return b.native_content && typeof b.native_content == 'object'
  //  });
  const ancho = useWidth();
  const alto = useHeight();
  const [ chapters, setChapters ] = useState(null);
  const [ currentBook, setCurrentBook ] = useState(null);
  const [ loading, setLoading ] = useState(null);
  const [ visibleHeader, showHeader ] = useState(true);
  const [ initialIndex, setInitialIndex ] = useState(readingIndex || 0);
  const [ scrollPosition, setScrollPosition ] = useState(null);
  const [ keepScreenAwake, setKeepAwake] = useState(false);
  const [ audioPosition, setAudioPosition ] = useState({
                                                index: 0,
                                                total_index: 0,
                                                total_blocks: 0,
                                                blockIndex: 0,
                                                playing: false,
                                                ready: false
                                                });

  const [ listening, setListening ] = useState(null);

  
  const [ curlEffect, setCurlEffect ] = useState(true);
  const [ editing, setEditing ] = useState(editMode);
  const [ searchQuery, setSearchQuery ] = useState(null);
  const [ searchResults, setSearchResults ] = useState(null);
  const [ needRefresh, setNeedRefresh ] = useState(false);
  
  const [ deleteConfirm, setDeleteConfirm ] = useState('');
  const [ sequence, setSequence ] = useState('now');
  const [selected, setSelected ] = useState(false);



  const [ progress, setProgress ] = useState(false);
  const [ textToSpeech, setTextToSpeech ] = useState({
                                                pitch: 0.7,
                                                rate: 0.8,
                                                selectedVoice: null,
                                                voices: null,
                                                status: null
                                              });
  const canAudioBook = (currentBook && 
                        (currentBook.language == 'en' || currentBook.language == 'es') &&
                          textToSpeech.status == "initialized" &&
                          chapters && chapters.length > 0) ? true : false;
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ audioMode, setAudioMode ] = useState(false);

  const [ modalSection, setModalSection ] = useState('publish');

  const [ talking, setTalking ] = useState(null);
  
  const wysiwygRefs = useRef([]);
  const [ drawerSection, setDrawerSection ] = useState('toc');

  const [ bookChanges, setBookChanges ] = useState(false);
  const [ voiceSelector, setVoiceSelector ] = useState(false);
  const [ sync, setSync ] = useState('disabled');
  const [ engineSelector, setEngineSelector ] = useState(false);
  const [ bookChapterChanges, setBookChapterChanges ] = useState([]);
  const [ like, setLike ] = useState(null);
  const canEdit = currentBook && NewtDB.rootUser && currentBook.userId == NewtDB.rootUser.name ? true : false;


  const readerRef = React.useRef();
  const wysiwygRef = React.useRef();
  const drawerRef = React.createRef();

  let mode = 'light', txtAlign = 'left', fontSx = 2;
  if(NewtDB.rootUser && NewtDB.rootUser.reading){
    if(NewtDB.rootUser.reading.theme){
      mode = NewtDB.rootUser.reading.theme;
    } else {
      mode = isDarkMode == true ? 'dark' : 'light';
    }
    if(NewtDB.rootUser.reading.align){
      txtAlign = NewtDB.rootUser.reading.align;
    }
    if(NewtDB.rootUser.reading.fontSize){
      fontSx = NewtDB.rootUser.reading.fontSize;
    }
  } else {
    mode = isDarkMode == true ? 'dark' : 'light';
  }
  const [ theme, setTheme ] = useState(mode || 'light');
  const [ fontSize, setFontSize ] = useState(fontSx || 2);
  const [ textAlign, setTextAlign ] = useState(txtAlign || 'left');

  const borderColorBg = (theme == 'light' ? '#eaeaea' : (theme == 'dark' ? '#222222' : '#766448'));
  const colorTextBg = (theme == 'light' ? '#000' : (theme == 'dark' ? '#fff' : '#e7d7bc'));

  // Effects
  function $unmount() {
    //console.log("set progress!", initialIndex, scrollPosition, scrollViewableItems);
    //let percentageRead = parseFloat(((100 * contentOffset) / contentHeight).toFixed(2));
    stopPlaying();
    if(Platform.OS == 'android'){
      ShowNavigationBar();
      changeNavigationBarColor(isDarkMode == true ? '#000000' : '#ffffff', isDarkMode == true ? false : true);
    }
    let s = setScrollPosition((current)=>{ 
        //console.log('count:', current, _id); 
        if(current != null && _id){
          let c = ClouchDB.Books().setProgress(_id, current);
        }
        
        return current;
      }); 
    
    
    //console.log("scroll position1!!!", s)
    
  }

  useBackButton($unmount);

  useEffect(() => {
    if(Platform.OS == 'android'){
      HideNavigationBar()
    }
    
    //console.log("start reader!", chapters)
    
    $mount();

    $addAudioListeners()
    return () => {
      $unmount(_id);
      $removeAudioListeners();
    }
  }, []);
  function $addAudioListeners(){
    Tts.addEventListener('tts-start', (event) => handleAudioStart(event));
    Tts.addEventListener('tts-finish', (event) => handleAudioFinish(event));
    Tts.addEventListener('tts-cancel', (event) => handleAudioCancel(event));
    return;
  }
  function $removeAudioListeners(){
      Tts.removeEventListener('tts-start', (event) => handleAudioStart(event));
      Tts.removeEventListener('tts-finish', (event) => handleAudioFinish(event));
      Tts.removeEventListener('tts-cancel', (event) => handleAudioCancel(event));
      return;
  }

  async function $restartAudioListeners(){
    await $removeAudioListeners();
    await $addAudioListeners();
    return;
  }

  const handleAudioStart = useCallback(async(event) => {
   // console.log("on handle start!", event, talking)
    setTalking(true);
  }, []);

  const handleAudioFinish = useCallback(async(event) => {
     setTalking("finish");
     setTalking(true);
  }, []);

  const handleAudioCancel = useCallback(event => {
    stopPlaying();
    setTalking(null);
  }, []);

  useEffect(() => { 
   // console.log("audio position!!!", talking, audioPosition)
    // if(audioPosition != null){
    //   if(audioPosition && audioPosition.playing == true && audioPosition.index && audioPosition.blockIndex){

    //   }
    // }
    // if(audioPosition.playing == true){

    // }
    //console.log("on change blocks!", audioMode, talking, audioPosition)
    if(audioMode == true && talking == "finish" && audioPosition.playing == true){
     // console.log("goes here!")
     if(!equal({audioPosition: audioPosition, audioMode: audioMode, talking: talking}, lastRelevantAudioState)){
      if(audioPosition.index > -1 && audioPosition.blockIndex > -1 && audioPosition.total_blocks >= audioPosition.blockIndex){
        //console.log("PLAY NEXT!!", lastRelevantAudioState, talking, audioPosition);
        
        setTimeout(() => {
          playNextBlock();
        },200)
        
        lastRelevantAudioState = {
          audioPosition: audioPosition,
          talking: talking,
          audioMode: audioMode
        };
        
      } else {
        // setAudioPosition((prevState) => update(prevState, { 
        //           playing: {
        //             $set: false
        //           } 
        //        }));
      }
     }
      
    }


    
  }, [audioPosition, audioMode, talking])

  async function playNextBlock(){
   // console.log("play next block!!", audioPosition)
    //await if(Tts && Tts.stop){ Tts.stop() };
    setTalking(true)
    return await playBook(audioPosition.index, audioPosition.blockIndex + 1)
  }

  function onRefreshChapter(id){
    NewtDB.cleanPartsNeedPull(id);
    setNeedRefresh(true);
    setTimeout(() => {
      setNeedRefresh(false);
    }, 500)
  }

  async function $mount(){
   // console.log("routeee", currentBook, chapters)
   
   let b, c;
    if(currentBook == null){
      b = await(ClouchDB.Books().findOne(_id)).catch(e => null);
      //console.log("fid public!", b, _id)

      if(b != null){
        if(b.title){
          navigation.setOptions({
            headerTitle: b.title || 'Book'
          });
        }
        //console.log("mount reader book", b)
        setCurrentBook(b);
      }
    }

    if(chapters == null){
      c = await(ClouchDB.Chapters().findAll(_id));
      //console.log("set chapters!", _id, c)
      setChapters(c);
    }
    if(c && c.length){
      setAudioPosition((prevState) => update(prevState, { 
                  total_index: { 
                        $set: c.length
                  },
                  ready: {
                    $set: true
                  } 
               }));
    }
    if(b && b.language){
      setupAudio(NewtDB.rootUser, b.language);
    }
    
    setSync(false);
    //console.log("MOUNT READER", b, c)
  }

  useLayoutEffect(() => {
    if(currentBook != null && !(bookChanges == true || (bookChapterChanges != []))){
      navigation.setOptions({
        headerTitle: currentBook.title || 'Book'
      });
    }
    // if(audioMode == true){
    //   navigation.setOptions({
    //     headerTitle: (props) => (<View>
    //                               <IconButton
    //                                 icon="arrow-up"
    //                                 color={'#000'}
    //                                 mode="contained"
    //                                 size={20}
    //                                 onPress={() => playOrStop()}
    //                               />
    //                              </View>)
    //   });
    // }
   // console.log("get like!!", currentBook, like)
    if(currentBook != null && like == null){
      getLike(currentBook._id)
    }

  }, [currentBook, like]);

  useEffect(() => {
    if(sync == false && currentBook != null && chapters != null && NewtDB.rootUser && canEdit == true && NewtDB.appSettings && NewtDB.appSettings.lastChapterSeq && NewtDB.appSettings.lastLocalChapterSeq && NewtDB.rootUser.sync && NewtDB.rootUser.sync.status == true){
      setTimeout(() => {
        $sync();
      }, 5000)
    }
  }, [currentBook, chapters, sync, NewtDB.appSettings, NewtDB.rootUser])

  function $sync(){
    setSync(true);
    if(canEdit){
      NewtDB.addDocIdChapters(currentBook._id);
    }
  }

  useEffect(() => {
    //console.log("effect progress test", currentBook, chapters, progress)
    if(currentBook != null && chapters != null && progress == false){
    // __DEV__ && console.log("set progress!!", initialIndex, currentBook, currentBook.progress.index <= currentBook.progress.total_index)
      if(currentBook.progress && currentBook.progress.index <= currentBook.progress.total_index && currentBook.progress.offset >= 0){
       // console.log("DO THE PROGRESS!", currentBook.progress)
       setTimeout(() => {
        $doProgress(currentBook.progress.index, currentBook.progress.offset)
       }, 100)
        
      }
    } 

  }, [currentBook, chapters, progress, initialIndex]);

  async function $doProgress(index, scroll){
   // __DEV__ && console.log("reader ref!!", readerRef)
    if(readerRef && readerRef.current){
       let first = await readerRef.current.setPage(index);
       //__DEV__ && console.log("DO PROGRESS!", index, scroll.toFixed(0), wysiwygRefs.current[index])
       //console.log("set page first!", first, wysiwygRef.current._wysiwyg)
       setTimeout(function(){
         if(wysiwygRefs.current[index] && wysiwygRefs.current[index]._wysiwyg && typeof wysiwygRefs.current[index].props.initialBlocks.blocks == 'object' && wysiwygRefs.current[index]._wysiwyg.scrollToOffset){
           //Snackbar.show({ text: 'Finding location...', duration: Snackbar.LENGTH_LONG })
           wysiwygRefs.current[index]._wysiwyg.scrollToOffset({offset:parseFloat(scroll.toFixed(0)),animated: false});
           //showHeader(false);
           setProgress(true);
         }
       },100)
       
    }
  }

  useLayoutEffect(() => {
    if(theme != null){
      navigation.setOptions({
        headerTintColor: (theme == 'light' ? '#000' : (theme == 'dark' ? '#fff' : '#e7d7bc')),
        headerStyle: {
          backgroundColor: (theme == 'light' ? '#ffffff' : (theme == 'dark' ? '#000000' : '#544733'))
        }
        
      });
    }

  }, [theme]);

  useEffect(() => {
    if(chapters != null && currentBook && currentBook._id && canEdit == true){
      const partChanges = ClouchDB.ApplicationChapters.changes({
                  live: true, 
                  since: sequence, 
                  include_docs: true,
                  filter: '_selector',
                             style: "main-only",
                             selector: {
                                "_id": {
                                  "$gte": currentBook._id+":chapter:",
                                  "$lt": currentBook._id+":chapter:\ufff0"
                                }
                             }
                })
                  .on('change', (change) => {
                 // console.log("[READER] ON CHANNGE!", change)
                  setSequence(change.seq);
                  onUpdatedOrInserted(change.doc)
                }).on('error', (err) => partChanges.cancel())
         return () => partChanges.cancel()
    }
  }, [chapters, sequence, editing, currentBook])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: visibleHeader
    });

  }, [visibleHeader]);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: props => (<View 
                              style={{justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'row'}}>
                              {
                                (editing == false) && <IconButton
                                  icon={audioMode == true ? 'headphones-off' : 'headphones'}
                                  color={colorTextBg}
                                  mode="contained"
                                  size={22}
                                  style={{marginTop: 9}}
                                  onPress={() => switchAudio()}
                                 />
                               }
                              <Menu 
                              renderer={SlideIn} 
                              rendererProps={{ preferredPlacement: 'bottom', placement: 'bottom', anchorStyle: {backgroundColor: '#222'} }} 
                              style={{backgroundColor: 'transparent', borderRadius: 8, paddingRight:5}}
                              >
                              <MenuTrigger borderRadius={50} style={{width: 45, height: 45, paddingTop: 0, justifyContent: 'center', alignItems: 'center', borderRadius:50}}>
                              
                              
                                <Icon name="dots-vertical" size={23} style={{color: colorTextBg}} />
                              
                              </MenuTrigger>
                              <MenuOptions
                                optionsContainerStyle={[globalStyles.popOver]}
                                >
                                

                                <MenuOption onSelect={() => NewtDB.shareBook(currentBook)} style={[globalStyles.popOverOption]}>
                                  <Icon name="share-outline" size={23} backgroundColor={'transparent'}  color={"#2575ed"} style={globalStyles.popoverOptionIcon} />
                                  <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>{Languages.Share[getLang()]}</Text>
                                </MenuOption>
                                {
                                  canEdit == false &&
                                    <MenuOption onSelect={() => likeBook()} style={[globalStyles.popOverOption, {
                                              flexDirection: 'row',
                                              width: 350,
                                            }]}>
                                        <Icon name={like == true ? "heart" : "heart-outline"} size={23} backgroundColor={'transparent'} color={like == true ? '#da2e2e' : '#2575ed'} style={globalStyles.popoverOptionIcon}/>
                                          
                                        <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>{Languages.iLike[getLang()]}</Text>
                                        
                                    </MenuOption>
                                  }
                                <MenuOption onSelect={() => NewtDB.openAddToCollection(currentBook)} style={[{
                                          flexDirection: 'row',
                                          width: 350,


                                        }, globalStyles.popOverOption, canEdit == false && globalStyles.popOverOptionLast]}>
                                    <Icon name="plus" size={23} backgroundColor={'transparent'}  color={"#2575ed"} style={globalStyles.popoverOptionIcon}/>
                                      
                                    <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>{Languages.collection[getLang()]}</Text>
                                    
                                </MenuOption>
                                { canEdit == true &&
                                <View style={[globalStyles.popOverOption, globalStyles.popOverOptionLast, {
                                        flexDirection: 'row',
                                        width: 350,
                                        margin:0,
                                        padding:15,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%'
                                      }]}>

                                    <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>{Languages.editMode[getLang()]}</Text>
                                    <ToggleSwitch
                                      isOn={editing}
                                      onColor="#2575ed"
                                      useNativeDriver={true}
                                                                     offColor="#f44336"
                                      label={null}
                                      labelStyle={{ color: "#555", fontWeight: "900" }}
                                      size="medium"
                                      onToggle={isOn => switchEdit(!editing)}
                                    />
                                  
                                </View>
                              }
                              </MenuOptions>
                            </Menu></View>)
    });
  }, [editing, theme, canEdit, currentBook, like, audioPosition, initialIndex, audioMode])

   async function getLike(id){
    if(NewtDB.rootUser && NewtDB.rootUser.name && currentBook){
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
    if(!currentBook && like == null){
      return;
    }
    NewtDB.triggerAction('liked');
    let lk = like == true ? false : true;

    setLike(lk);
    NewtDB.doLike(currentBook)
  }
  async function setupAudio(userObj, lang){
    
     //console.log("available voices!", voices, availableVoices)
    const availableEngines = await Tts.engines();
    //console.log("available engines!!",availableEngines)
    if(!availableEngines){
      //console.log("could not find engines!")
      
      return setTextToSpeech((prevState) => update(prevState, { 
                  status: {
                    $set: "noEngines"
                  },
                  engines: {
                    $set: availableEngines
                  },
                  selectedEngine: {
                    $set: null
                  }
               }));
    }
    let selectedEngine, aeIndex = 0;
    if(availableEngines){
      
      if(userObj.audio && userObj.audio.engine){
            let naeIndex = availableEngines.findIndex(v => v.name == userObj.audio.engine);
            if(naeIndex > -1){
              aeIndex = naeIndex;
            }
          }
          selectedEngine = availableEngines[aeIndex].name;
          let stepOne = await Tts.setDefaultEngine(selectedEngine);
    }
    const voices = await Tts.voices();
    //console.log("voices get!", voices)
    const availableVoices = voices
      .filter(v => !v.notInstalled && v.language && v.language.includes(lang == 'es' ? 'es' : 'en'))
      .map(v => {
        return { id: v.id, name: v.name, latency: v.latency, language: v.language, quality: v.quality, notInstalled: v.notInstalled, networkConnectionRequired: v.networkConnectionRequired };
      });
    if (voices && voices.length > 0) {
      if(availableVoices && availableVoices.length > 0){
       // console.log("available voices set!", NewtDB.rootUser, availableVoices, availableEngines)
        let selectedVoice, avIndex = 0;
        if(userObj.audio){
          if(userObj.audio.voice){
            let navIndex = availableVoices.findIndex(v => v.id == userObj.audio.voice);
            if(navIndex > -1){
              avIndex = navIndex;
            }
          }
          
        }
       // console.log("av index!!", avIndex, aeIndex, selectedEngine, userObj)
        selectedVoice = availableVoices[avIndex].language;
        
        availableVoices[avIndex].selected = true;
        try {
          let ttssetone = await Tts.setDefaultLanguage(availableVoices[avIndex].language);
          let ttsTwo = await Tts.setDefaultVoice(availableVoices[avIndex].id)
          setTextToSpeech((prevState) => update(prevState, { 
                  voices: { 
                        $set: availableVoices
                  },
                  selectedVoice: {
                    $set: selectedVoice
                  },
                  status: {
                    $set: "initialized"
                  },
                  engines: {
                    $set: availableEngines
                  },
                  selectedEngine: {
                    $set: selectedEngine
                  }
               }));

        } catch (err) {
          // My Samsung S9 has always this error: "Language is not supported"
         setTextToSpeech((prevState) => update(prevState, { 
                  status: {
                    $set: "error"
                  },
                  engines: {
                    $set: availableEngines
                  },
                  voices: { 
                        $set: availableVoices
                  },
               }));
         __DEV__ && console.log(`setDefaultLanguage error `, err);
        }
      } else {
        setTextToSpeech((prevState) => update(prevState, { 
                  status: {
                    $set: "noAvailableVoices"
                  }
               }));
      }
      
     // await Tts.setDefaultVoice(voices[0].id);
    } else {
     setTextToSpeech((prevState) => update(prevState, { 
                  status: {
                    $set: "noVoices"
                  }
               }));
    }
  }

  useEffect(() => {
    if(currentBook != null && currentBook._rev && NewtDB.drafts && NewtDB.drafts.rows && NewtDB.drafts.rows.length >= 0){
      let findex = NewtDB.drafts.rows.findIndex(d => d._id == _id);
      if(findex > -1 && NewtDB.drafts.rows[findex] && NewtDB.drafts.rows[findex]._id == _id && NewtDB.drafts.rows[findex]._rev){
        let revOne = parseFloat(currentBook._rev.split("-")[0]);
        let revTwo = parseFloat(NewtDB.drafts.rows[findex]._rev.split("-")[0])
        if(revOne < revTwo){
          setCurrentBook(NewtDB.drafts.rows[findex]);
        }
      }
    }
  }, [NewtDB.drafts])

  useLayoutEffect(() => {
    if(bookChanges == true || bookChapterChanges.length > 0){
      navigation.setOptions({
        headerTitle: <Button onPress={() => doSave()} icon="check" mode="contained" style={{backgroundColor: '#2575ed',color: '#fff'}}>
                        {Languages.Save[getLang()]}
                      </Button>,
        headerLeft: props => 
          <>
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item color={colorTextBg} title="back" iconName="arrow-left" onPress={() => changesGoBack()} />
          </HeaderButtons>
          </>
      });
    }
  
  }, [bookChapterChanges, bookChanges, chapters, theme]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: visibleHeader
    });
  }, [visibleHeader]);

  function onUpdatedOrInserted(newDoc){
    //console.log("on chapter change!!! part", newDoc, chapters)
        if(typeof chapters === 'undefined' || chapters == null){
            return;
          }
          var index = chapters.findIndex((p) => p._id === newDoc._id);
         // console.log("[CHAPTERS] UPDATE OR INSERT", newDoc, index, chapters)
          var chapter = chapters[index];
          if(newDoc && newDoc._id.includes("_design")){
            return;
          }
          if (chapter && chapter._id === newDoc._id) { // update
            if(newDoc._deleted){
              return setChapters((prevState) => update(prevState, { 
                      $splice: [[index, 1]]
                   }));
            } else {
              return setChapters((prevState) => update(prevState, { 
                  [index]: { 
                        $set: newDoc
                       } 
                   }));
            }
          } else { // insert
            if(index == -1 && !newDoc._deleted){
              return setChapters((prevState) => update(prevState, { 
                  $push: [newDoc]
                   }));
          }
        }
    }

  function undoDeleteChapter(part, index){
  
    if(part._deleted){
      let newPart = part;
      setChapters((prevState) => update(prevState, { 
                  [index]: { 
                        $unset: ['_deleted']
                       } 
                   }));
    }
  }

  function setTitle(text, index){
    setChapters((prevState) => update(prevState, { 
                  [index]: { 
                    title: {
                        $set: text
                      }
                    } 
                }));
    toggleChapterChange(index);
  }
  function moveItem(from, to) {
    // remove `from` item and store it
    let newChapters = [...chapters];
    let newSelected = [to];
    var f = newChapters.splice(from, 1)[0];
    // insert stored item into position `to`
    newChapters.splice(to, 0, f);

    for (var i = newChapters.length - 1; i >= 0; i--) {
      newChapters[i].position = i;
      if((bookChapterChanges.indexOf(i) == -1)){
        toggleChapterChange(index);
      }

    }

    setSelected(newSelected);
    setChapters((prevState) => update(prevState, { 
                  $set: newChapters
                }));
    //console.log("move item!", selected, newSelected, from, to,  newChapters)
  }

  async function addPart(){
    if(!currentBook || !canEdit){ return; }
    let d = await ClouchDB.Chapters().createOne(currentBook._id);
    //console.log("add part!!", d)
    return d;
  }

  function changesGoBack(){
   
    let string = 'You have ';
    if(bookChapterChanges.length > 0 ){
      string += bookChapterChanges.length+' chapter '+_renderStringDeleted();
    }
    if(bookChapterChanges.length > 0 && bookChanges == true){
      string += ' & '
    }
    if(bookChanges == true){
      string += ' book '
    }
    string += 'changes';
    Alert.alert(
            'Unsaved changes',
            string,
            [
              {
                text: 'Discard', 
                onPress: () => {
                    navigation.goBack()
                },
                style: 'cancel',
              },
              {
                text: 'Save',
                onPress: async() => {
                    await doSave();
                    navigation.goBack()
                },
              }
            ],
            {cancelable: true},
          );
  }

  function _renderStringDeleted(){
    let fbp = chapters.filter(f => f._deleted).length;
   // console.log("render string!", chapters);
    if(fbp > 0){
      return '('+fbp+' deletions) '
      
    }
    return '';
  }

  const onToggleKeepAwake = () => setKeepAwake(!keepScreenAwake);

  async function doSave(){

    if(chapters){
      let partsToSave = chapters.filter((d,i) => bookChapterChanges.indexOf(i) > -1);
       //console.log("new parts!!", partsToSave);
      if(partsToSave && partsToSave.length > 0){
        let sc = await ClouchDB.Chapters().saveBulk(partsToSave).catch(e => null);
      }
      if(bookChanges == true && currentBook){
        let sb = await ClouchDB.Books().saveOne(currentBook).catch(e => null);
      }
    }
    
    setBookChanges(false);
    setBookChapterChanges([]);

    navigation.setOptions({
        headerTitle: currentBook.title || '',
        headerLeft: props => 
          <>
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item color={colorTextBg} title="back" iconName="arrow-left" onPress={() => navigation.goBack()} />
          </HeaderButtons>
          </>
      });
    return;
  }
  

  function toggleChapterChange(value){
   // console.log("toggle chapter change!", bookChapterChanges)
    value = parseFloat(value);

      const currentIndex = bookChapterChanges.indexOf(value);
      const newChecked = [...bookChapterChanges];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
       // newChecked.splice(currentIndex, 1);
      }
      if (currentIndex === -1) {
        setBookChapterChanges((prevState) => update(prevState, { 
                      $push: [value]
                   }));
    }
  };

  function onChapterChange(blocks, index){
    toggleChapterChange(index);
    chapters[index].native_content = {
          blocks: blocks,
          time: Date.now()
        };
    // if()
    // setChapters((prevState) => update(prevState, { 
    //                 [index]: {
    //                   native_content: {
    //                     blocks: {
    //                       $set: blocks
    //                     },
    //                     time: {
    //                       $set: Date.now()
    //                     }
    //                   }
    //                 }
    //              }));

    //console.log("is equal!", isEqual(parts[j].native_content.blocks, v.blocks), parts[j].native_content, v)
  
    //console.log("on chapter change!!", blocks)
  }

  function onSwipeChapter(index){
    setInitialIndex(index)
  }

  function switchEdit(){
    let cE = editing || false;
    if(cE == true){
      Keyboard.dismiss();
    }
    if(!cE == true){
      setAudioMode(false);
    }
    setEditing(!cE);
  }


  function toggleHeader(){
    showHeader(!visibleHeader)
  }

  function handleToggle(value){
      const currentIndex = selected.indexOf(value);
      const newChecked = [...selected];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setSelected(newChecked);
  };

  function toggleSelect(){
    let ks = typeof selected == 'object' ? false : [];
   // console.log("toggle select!", ks)
    setSelected(ks);
  }

  function changeReadingSettings(type, value){
    let fs, thm, al;
    if(type == 'fontSize'){
      fs = value == 'plus' ? (fontSize + 1) : (fontSize - 1);
      setFontSize(fs);
    } else {
      fs = fontSize;
    }
    if(type == 'theme'){
      thm = value == 'sepia' ? 'sepia' : (value == 'dark' ? 'dark' : 'light');
      setTheme(thm);
    } else {
      thm = theme;
    }
    if(type == 'align'){
      al = value == 'justify' ? 'justify' : 'left';
      setTextAlign(al);
    } else {
      al = textAlign;
    }
 //   console.log("change reading", NewtDB.rootUser, fs, thm, al)
    let userObject = NewtDB.rootUser;
    userObject.reading = {
      fontSize: fs,
      theme: thm,
      align: al
    }
    NewtDB.updateLocalRootUser(userObject);
  }



  async function onSetNewVoice(item, index){
    await stopPlaying();
    let vs = item.selected ? false : true;
    let newVoices = textToSpeech.voices.map((it, ind) => { if(ind == index){ it.selected = true; } else { it.selected = false } return it; });
    setTextToSpeech((prevState) => update(prevState, { 
                                          voices: { 
                                                $set: newVoices
                                          },
                                          selectedVoice: {
                                            $set: item.language
                                          }
                                       }));
    let stepOne = await Tts.setDefaultLanguage(item.language).catch(e => e);
    let ttsTwo = await Tts.setDefaultVoice(item.id);
    if(!item.id){return;}
    let userObject = NewtDB.rootUser;
    userObject.audio = {
      voice: item.id,
      engine: userObject.audio && userObject.audio.engine ? userObject.audio.engine : null
    }
    NewtDB.updateLocalRootUser(userObject);

  }

  async function onSetNewEngine(item, index){
    await stopPlaying();
    let vs = item.selected ? false : true;
    let newEngines = textToSpeech.engines.map((it, ind) => { if(ind == index){ it.default = true; } else { it.default = false } return it; });
    setTextToSpeech((prevState) => update(prevState, { 
                                          engines: { 
                                                $set: newEngines
                                          },
                                          selectedEngine: {
                                            $set: item.label
                                          }
                                       }));
    //console.log("on set new engine!", item)
    let stepOne = await Tts.setDefaultEngine(item.name);
    if(!item.name){return;}
    let userObject = NewtDB.rootUser;
    userObject.audio = {
      engine: item.name,
      voice: userObject.audio && userObject.audio.voice ? userObject.audio.voice : null
    }
    NewtDB.updateLocalRootUser(userObject);

    if(!currentBook.language){ return; }
    setupAudio(userObject, currentBook.language)
  }



  function parseVoiceName(name){
    if(!name){ return 'Untitled Voice'; }
    name = name.toLowerCase();
    if(name.indexOf("en") > -1){
      if(name.indexOf("en-gb") > -1){
        return "English (United Kingdom)"
      } else if(name.indexOf("en-us") > -1){
        return "English (United States)"
      } else if(name.indexOf("en-ca") > -1){
        return "English (Canada)"
      } else if(name.indexOf("en-in") > -1){
        return "English (Indian)"
      } else if(name.indexOf("en-au") > -1){
        return "English (Australia)"
      } else if(name.indexOf("en-nz") > -1){
        return "English (New Zealand)"
      } else if(name.indexOf("en-ZA") > -1){
        return "English (South Africa)"
      } else {
        return "English";
      }
    }
    if(name.indexOf("es") > -1){
      if(name.indexOf("es-es") > -1){
        return "Español (España)"
      } else if(name.indexOf("es-mx") > -1){
        return "Español (México)"
      } else if(name.indexOf("es-ar") > -1){
        return "Español (Argentina)"
      } else if(name.indexOf("es-co") > -1){
        return "Español (Colombia)"
      } else if(name.indexOf("es-cl") > -1){
        return "Español (Chile)"
      } else if(name.indexOf("es-pe") > -1){
        return "Español (Peruvian)"
      } else if(name.indexOf("es-ve") > -1){
        return "Español (Venezuela)"
      } else if(name.indexOf("es-do") > -1){
        return "Español (Dominican)"
      } else {
        return "Español"
      }
    }
  }
  async function installVoices(){
   let ins = await Tts.requestInstallData();

   //console.log("install request data!", ins)
  }
  async function installEngines(){
   let ins = Tts.requestInstallEngine();
  }
  function _renderAudioSettings(){
    //console.log("text to speech!", textToSpeech)
    
   
    if(textToSpeech.status == 'noEngines'){
      return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 19, color: colorTextBg, textAlign: 'center', padding: 10}}>
          No available engines for playing audio
          {"\n"}
          Go to your device settings to install a engine and then restart Newt
          </Text>
          <Button onPress={() => installEngines()} color={'#2575ed'} icon={"volume-medium"} mode="outlined" style={{margin: 5}}>
              Install Engine
          </Button>
        </View>)
    }
    if(textToSpeech.status == 'noAvailableVoices' || textToSpeech.status == 'noVoices'){
      return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 19, color: colorTextBg, textAlign: 'center', padding: 10}}>
          No available  voices for this language
          {"\n"}
          Go to your device settings to install more voices/languages and then restart Newt
          </Text>
          <Button onPress={() => installVoices()} color={'#2575ed'} icon={"volume-medium"} mode="outlined" style={{margin: 5}}>
              Install Voices
          </Button>
        </View>
        )
    }

    return (
      <View style={{flex:1}}>
        {
          textToSpeech != null &&
           <TouchableRipple onPress={() => setEngineSelector(true)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{Languages.engines[getLang()]}</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                    <Text style={{ color: colorTextBg, fontSize: 12, fontWeight: '700'}}>{textToSpeech.selectedEngine && textToSpeech.selectedEngine}</Text>
                                    <Icon color={colorTextBg} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} />
                                 </View>
                              </View>
           </TouchableRipple>
         }
        {
          textToSpeech != null &&
           <TouchableRipple onPress={() => setVoiceSelector(true)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{Languages.voice[getLang()]}</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                    <Text style={{ color: colorTextBg, fontSize: 12, fontWeight: '700'}}>{textToSpeech.selectedVoice && parseVoiceName(textToSpeech.selectedVoice)}</Text>
                                    <Icon color={colorTextBg} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} />
                                 </View>
                              </View>
           </TouchableRipple>
         }

         <TouchableRipple style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{Languages.tone[getLang()]}</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                   <Slider
                                    style={{width: 150, height: 12, marginTop: 0}}
                                    minimumValue={0}
                                    maximumValue={2}
                                    value={textToSpeech.pitch}
                                    onValueChange={async (value)=> {
                                      await stopPlaying()
                                       setTextToSpeech((prevState) => update(prevState, { 
                                          pitch: { 
                                                $set: value
                                          }
                                       }));
                                       //console.log("set pitch!", value)
                                       Tts.setDefaultPitch(value);
                                      }}
                                    maximumTrackTintColor={colorTextBg}
                                    minimumTrackTintColor={"#2575ed"}
                                    thumbStyle={{
                                      width: 100,
                                      height: 30,
                                      backgroundColor: "#2575ed",
                                      borderBottomRightRadius: 100,
                                      borderTopRightRadius: 100,
                                    }}
                                    thumbTintColor={'#2575ed'}
                                    trackStyle={{
                                       height: 80,
                                        borderBottomRightRadius: 20,
                                        borderTopRightRadius: 20,
                                      }}
                                    step={0.1}
                                />
                                 </View>
                              </View>
           </TouchableRipple>

          <TouchableRipple style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{Languages.speed[getLang()]}</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  <Slider
                                    style={{width: 150, height: 12, marginTop: 0}}
                                    minimumValue={0}
                                    maximumValue={2}
                                    value={textToSpeech.rate}
                                    onValueChange={async(value)=> {
                                      await stopPlaying()
                                       setTextToSpeech((prevState) => update(prevState, { 
                                          rate: { 
                                                $set: value
                                          }
                                       }));
                                       Tts.setDefaultRate(value, true);
                                      }}
                                    maximumTrackTintColor={colorTextBg}
                                    minimumTrackTintColor={"#2575ed"}
                                    thumbStyle={{
                                      width: 100,
                                      height: 30,
                                      backgroundColor: "#2575ed",
                                      borderBottomRightRadius: 100,
                                      borderTopRightRadius: 100,
                                    }}
                                    thumbTintColor={'#2575ed'}
                                    trackStyle={{
                                       height: 80,
                                        borderBottomRightRadius: 20,
                                        borderTopRightRadius: 20,
                                      }}
                                    step={0.1}
                                />
                                 </View>
                              </View>
           </TouchableRipple>

         {
          textToSpeech &&textToSpeech.voices != null &&
            <Portal>
              <Dialog visible={voiceSelector} onDismiss={() => setVoiceSelector(false)}>
                <Dialog.Title>Voices</Dialog.Title>
                <Dialog.Content>
                          <FlatList
                             data={textToSpeech.voices}
                             //horizontal={true}
                             style={{}}
                             contentContainerStyle={{flexGrow: 1}}
                             style={{maxHeight: 300}}
                             renderItem={({ item, index }) => 
                                <TouchableRipple onPress={() => onSetNewVoice(item, index)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                                    <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                      <View style={{width: '80%'}}>
                                        <Text numberOfLines={1} style={{color: '#666', margin: 1, width: '100%', marginLeft: 8, fontSize: 16,fontWeight:'700'}}>
                                          {index + 1}. {parseVoiceName(item.language)} ({item.id})
                                        </Text>
                                        <Text numberOfLines={1} style={{color: '#666', margin: 1, width: '80%', marginLeft: 8, fontSize: 11,fontWeight:'400'}}>
                                          {item.quality && "Q: "+item.quality} {item.latency && "L: "+item.latency} {item.id && (item.id.indexOf("male") > -1 && item.id.indexOf("female") === -1) && "(male)"} {item.id && item.id.includes("female") && "(female)"}
                                        </Text>
                                      </View>
                                       <View style={{width: '20%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                         <RadioButton
                                            status={item.selected ? 'checked' : 'unchecked'}
                                            onPress={() => onSetNewVoice(item, index)}
                                            color={"#2575ed"}
                                          />
                                       </View>
                                    </View>
                                </TouchableRipple>
                              }
                             keyExtractor={(item, ind) => ind +'-'+item._id}
                         />

                </Dialog.Content>
                <Dialog.Actions>
                  <Button color={"#2575ed"} onPress={() => setVoiceSelector(false)}>Done</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          }
          {
          textToSpeech && textToSpeech.engines != null &&
            <Portal>
              <Dialog visible={engineSelector} onDismiss={() => setEngineSelector(false)}>
                <Dialog.Title>Engines</Dialog.Title>
                <Dialog.Content>
                          <FlatList
                             data={textToSpeech.engines}
                             //horizontal={true}
                             style={{}}
                             contentContainerStyle={{flexGrow: 1}}
                             style={{maxHeight: 300}}
                             renderItem={({ item, index }) => 
                                <TouchableRipple onPress={() => onSetNewEngine(item, index)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                                    <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                      <View style={{width: '80%'}}>
                                        <Text numberOfLines={1} style={{color: '#666', margin: 1, width: '100%', marginLeft: 8, fontSize: 16,fontWeight:'700'}}>
                                          {index + 1}. {item.label}
                                        </Text>
                                        <Text numberOfLines={1} style={{color: '#666', margin: 1, width: '80%', marginLeft: 8, fontSize: 11,fontWeight:'400'}}>
                                          {item.name}
                                        </Text>
                                      </View>
                                       <View style={{width: '20%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                         <RadioButton
                                            status={(textToSpeech.selectedEngine && textToSpeech.selectedEngine == item.name) ? 'checked' : 'unchecked'}
                                            onPress={() => onSetNewEngine(item, index)}
                                            color={"#2575ed"}
                                          />
                                       </View>
                                    </View>
                                </TouchableRipple>
                              }
                             keyExtractor={(item, ind) => ind +'-'+item._id}
                         />

                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setEngineSelector(false)}>Done</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          }
      </View>
      )
  }
  function _renderSettings(){
    
      return (
        <View style={{width: '100%', height: '100%'}}>
         
           <Text
             style={[globalStyles.sectionHeaderText, {color: colorTextBg}]}>
                {Languages.view[getLang()].toUpperCase()}
            </Text>
            <SettingsDividerLong />
           
            <Row size={12} style={{height: 60}}>
              <Col sm={4} md={4} lg={4} style={{paddingTop: 17}}>
                <Text style={{fontSize: 16,fontWeight:'700', marginLeft: 20, color: colorTextBg}}>{Languages.fontSize[getLang()]}</Text>
              </Col>
              <Col sm={8} md={8} lg={8} style={{}}>


              <View style={{flex: 1, flexWrap: 'nowrap', padding: 10, flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',}}>

                <TouchableOpacity onPress={() => changeReadingSettings('fontSize', 'minus')} style={{height: 40, width: '31%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', backgroundColor: '#f4f4f0'}}>
                  <Icon name="format-font-size-decrease" size={26} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                </TouchableOpacity>
                {/*<TouchableOpacity style={{height: 40, width: '31%', borderRadius: 0, justifyContent: 'center', backgroundColor: '#222'}}>
                  <Text style={{color: '#fff', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>{this.state.fontSize}</Text>
                </TouchableOpacity>*/}
                <TouchableOpacity onPress={() => changeReadingSettings('fontSize', 'plus')}  style={{height: 40, width: '31%', borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', backgroundColor: '#f4f4f0'}}>
                  <Icon name="format-font-size-increase" size={26} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                </TouchableOpacity>

                </View>

                

                
              </Col>


            </Row>


            <Row size={12} style={{height: 70}}>
              <Col sm={4} md={4} lg={4} style={{paddingTop: 25}}>
                <Text style={{ marginLeft: 20, fontSize: 16,fontWeight:'700',color: colorTextBg, marginTop: 1}}>{Languages.mode[getLang()]}</Text>
              </Col>
              <Col sm={8} md={8} lg={8} style={{}}>
              <View style={{flex: 1, flexWrap: 'nowrap', padding: 10, flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',}}>
                <TouchableOpacity onPress={() => changeReadingSettings('theme', 'light')} style={{height: 40, width: '31%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', backgroundColor: '#f7f8fa'}}>
                  <Text style={{color: '#89888b', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeReadingSettings('theme', 'sepia')} style={{height: 40, width: '31%', borderRadius: 0, justifyContent: 'center', backgroundColor: '#e7d7bc'}}>
                  <Text style={{color: '#645339', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeReadingSettings('theme', 'dark')} style={{height: 40, width: '31%', borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', backgroundColor: '#232225'}}>
                  <Text style={{color: '#49484b', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>A</Text>
                </TouchableOpacity>

                </View>

                
                
              </Col>

            </Row>

            <Row size={12} style={{height: 70}}>
              <Col sm={4} md={4} lg={4} style={{paddingTop: 25}}>
                <Text style={{fontSize:16, marginLeft: 20, fontWeight:'700',color: colorTextBg, marginTop: 1}}>{Languages.align[getLang()]}</Text>
              </Col>
              <Col sm={8} md={8} lg={8} style={{}}>
              <View style={{flex: 1, flexWrap: 'nowrap', padding: 10, flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',}}>
                <TouchableOpacity onPress={() => changeReadingSettings('align', 'left')} style={{height: 40, width: '31%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', backgroundColor: '#f4f4f0'}}>
                  <Icon name="format-align-left" size={26} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                </TouchableOpacity>
                {/*<TouchableOpacity style={{height: 40, width: '31%', borderRadius: 0, justifyContent: 'center', backgroundColor: '#222'}}>
                  <Text style={{color: '#fff', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>{this.state.fontSize}</Text>
                </TouchableOpacity>*/}
                <TouchableOpacity onPress={() => changeReadingSettings('align', 'justify')} style={{height: 40, width: '31%', borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', backgroundColor: '#f4f4f0'}}>
                  <Icon name="format-align-justify" size={26} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                </TouchableOpacity>

                </View>

                
                
              </Col>

            </Row>
            
            <TouchableRipple onPress={() => setEngineSelector(true)} style={{width: '100%', height: 60, borderBottomWidth: 0, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: colorTextBg, margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{Languages.keepScreenAwake[getLang()]}</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                    <Switch color={'#2575ed'} value={keepScreenAwake} onValueChange={onToggleKeepAwake} />
                                 </View>
                              </View>
           </TouchableRipple>
        </View>
        )

  }

  function goToPart(i){
    setInitialIndex(i);
    if(readerRef && readerRef.current){
       readerRef.current.setPage(i);
    }
  }
  
  
  function _renderChapterToc(chapter, i){
    //console.log("render chapter toc!", chapter)
      return (
        <TouchableRipple onPress={() => goToPart(i)} style={{backgroundColor: chapter._deleted && 'rgba(255, 117, 117, 0.39)', width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 0}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Badge style={{backgroundColor: '#2575ed', marginTop: -2  }}>{i + 1}</Badge>
                    <Text numberOfLines={1} style={{color: colorTextBg, marginLeft: 10, fontSize: 19, fontWeight: '700'}}>{chapter.title}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                     {
                        (typeof selected == 'object') && !chapter._deleted && 
                        <View style={{marginTop: -1}}>
                          <Checkbox
                            color={'#2575ed'}
                            style={{ }}
                            status={(selected.indexOf(i) !== -1) ? 'checked' : 'unchecked'}
                            onPress={() => handleToggle(i)}
                          />
                        </View>
                      }
                      {
                        chapter._deleted &&
                        <IconButton
                            icon="delete-restore"
                            color={'#000'}
                            mode="contained"
                            size={20}
                            onPress={() => undoDeleteChapter(chapter, i)}
                          />
                      }
                  </View>
              </View>
          </TouchableRipple>
        )
    }

  function switchSection(to){
   //__DEV__ && console.log("drawer rof!", drawerRef)
   setDrawerSection(to);
   if(drawerRef && drawerRef.snapTo) { drawerRef.snapTo(0); }
  }
  const colorIconBg = (theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'));
  function _renderDrawerHeader(){
    return (
      <View style={{flex:1, position: 'relative', paddingLeft: 5, paddingRight: 5, width: '100%', height: (audioMode == true && audioPosition.ready == true) ? 100 : 50,backgroundColor: Platform.OS == 'ios' ? 'transparent' : (theme == 'light' ? '#ffffff' : (theme == 'dark' ? '#000000' : '#544733')), position: 'relative',paddingTop:9}}>
          <View style={{
            width: 25,
            height: 4,
            borderRadius: 4,
            backgroundColor: borderColorBg,
            marginBottom: 0,
            alignSelf: 'center', marginTop: 0, top: -4
          }} />
        {
              (audioMode == true && audioPosition.ready == true) &&
              <View style={{width: '100%', minWidth: ancho, height: 50, left:0, right:0, display: 'flex', flexDirection: 'row',backgroundColor: 'transparent'}}>
                  {
                    (audioPosition && audioPosition.total_blocks > 0 && audioPosition.index > -1) && 
                      <View style={{position: 'absolute', width: '100%', height: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', zIndex:999999}}>
                          <Slider
                              style={{width: '90%', height: 12, marginTop: -9}}
                              minimumValue={0}
                              maximumValue={audioPosition.total_blocks}
                              value={audioPosition.blockIndex}
                              onValueChange={(value)=> onChangeAudioBlockIndex(value) }
                              //onSlidingComplete={(value)=> onChangeAudioBlockIndex(value) }
                              maximumTrackTintColor={colorTextBg}
                              minimumTrackTintColor={"#2575ed"}
                              thumbStyle={{
                                width: 100,
                                height: 40,
                                backgroundColor: "#2575ed",
                                borderBottomRightRadius: 100,
                                borderTopRightRadius: 100,
                              }}
                              step={audioPosition.total_blocks}
                              thumbTintColor={'#2575ed'}
                              trackStyle={{
                                 height: 80,
                                  borderBottomRightRadius: 20,
                                  borderTopRightRadius: 20,
                                }}
                              step={1}
                          />
                      </View>
                    }
                  <View style={{display: 'flex', flexDirection: 'row', paddingTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                   
                    <View style={{width: '40%', justifyContent: 'flex-start', marginTop: -10}}>
                      <Text style={{color: colorIconBg, fontSize:11, marginLeft: 10, marginTop: -1, fontWeight: '700'}} numberOfLines={1}>
                        {chapters && audioPosition.index > -1 ? audioPosition.index +'. '+chapters[audioPosition.index].title : ''}
                      </Text>
                    </View>
                    <View style={{width: '20%', justifyContent: 'center', alignItems: 'center'}}>
                      <IconButton
                          icon={audioPosition.playing == true ? 'pause' : 'play'}
                          color={colorIconBg}
                          mode="contained"
                          size={33}
                          style={{marginTop: 2}}
                          onPress={() => onlyPausePlay()}
                      />
                    </View>
                    <View style={{width: '40%', flexDirection: 'row', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop:-11}}>
                       
                         { 
                          (audioPosition) &&
                            <IconButton
                              icon={'pan-left'}
                              color={colorIconBg}
                              disabled={audioPosition.blockIndex > -1 && audioPosition.total_blocks ? false : true}
                              mode="contained"
                              size={23}
                              style={{marginRight: 0}}
                              onPress={() => onChangeAudioBlockIndex(audioPosition.blockIndex - 1)}
                          />
                        }
                        
                        { 
                          (audioPosition) &&
                            <IconButton
                              icon={'pan-right'}
                              color={colorIconBg}
                              mode="contained"
                              disabled={(audioPosition.total_blocks && audioPosition.blockIndex > -1 && audioPosition.blockIndex < audioPosition.total_blocks) ? false : true}
                              size={23}
                              style={{marginRight: 0}}
                              onPress={() => onChangeAudioBlockIndex(audioPosition.blockIndex + 1)}
                          />
                        }
                       
                        
                        <IconButton
                            icon={audioPosition.followBlocks == true ? 'compass-outline' : 'compass-off-outline'}
                            color={audioPosition.followBlocks == true ? "#2575ed" : colorIconBg}
                            mode="contained"
                            size={24}
                            style={{}}
                            onPress={() => followBlocks()}
                        />

                    </View>
                  </View>
              </View>
            }
        <View style={{display: 'flex'}}>
              <SwitchSelector
                              initial={drawerSection == 'info' ? 3 : (drawerSection == 'search' ? 1 : (drawerSection == 'settings' ? 2 : 0))}
                              onPress={value => switchSection(value)}
                              textColor={(theme == 'light' ? '#000' : (theme == 'dark' ? '#fff' : '#e7d7bc'))} //'#7a44cf'
                              selectedColor={globalColors.white}
                              buttonColor={globalColors.lightDark}
                              borderColor={'transparent'}
                              backgroundColor={'transparent'}
                              activeColor={(theme == 'light' ? '#000' : (theme == 'dark' ? '#fff' : '#e7d7bc'))}
                              borderRadius={10}
                              disabled={false}
                              borderWidth={0}
                              border={0}
                              hasPadding
                              options={(currentBook && (currentBook.language == 'es' || currentBook.language == 'en')) ? [
                                { label: "", value: "toc", customIcon: <Ionicons name="ios-albums" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> }, 
                                { label: "", value: "search", customIcon: <Ionicons name="ios-search" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> }, 
                                { label: "", value: "settings", customIcon: <EntypoIcono name="adjust" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> },
                                { label: "", value: "audio", customIcon: <Icon name="headphones-settings" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> },
                                { label: "", value: "info", customIcon: <EntypoIcono name="cog" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> }
                              ] : [
                                { label: "", value: "toc", customIcon: <Ionicons name="ios-albums" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> }, 
                                { label: "", value: "search", customIcon: <Ionicons name="ios-search" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> }, 
                                { label: "", value: "settings", customIcon: <EntypoIcono name="adjust" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> },
                                { label: "", value: "info", customIcon: <EntypoIcono name="cog" size={20} color={(theme == 'light' ? '#666' : (theme == 'dark' ? '#999' : '#9d8d71'))}/> }
                              ]}
                            />
        </View>
      </View>
    )
  }

  function useStateCallback(initialState) {
      const [state, setState] = useState(initialState);
      const cbRef = useRef(null); // mutable ref to store current callback

      const setStateCallback = (state, cb) => {
        cbRef.current = cb; // store passed callback to ref
        setState(state);
      };

      useEffect(() => {
        // cb.current is `null` on initial render, so we only execute cb on state *updates*
        if (cbRef.current) {
          cbRef.current(state);
          cbRef.current = null; // reset callback after execution
        }
      }, [state]);

      return [state, setStateCallback];
    }

  function markAsDelete(selected_ids){
    Alert.alert(
            'Mark as Delete',
            'You can still undo this action by discarding these changes (or, by not saving them)',
            [
              {
                text: 'Cancel', 
                style: 'cancel',
              },
              {
                text: 'Delete',
                onPress: async() => {
                  let newBulk = chapters;
                  for (var i = selected_ids.length - 1; i >= 0; i--) {
                    toggleChapterChange(selected_ids[i]);
                    newBulk[selected_ids[i]]._deleted = true;
                  }
                  setChapters(newBulk);
                  setSelected(false);
                },
              }
            ],
            {cancelable: true},
          );
    
  }

  function _renderToolbarAdd(){
    if(!canEdit || !editing){
      return <View />
    }

    if(typeof selected == 'object'){
      return (<View style={{flexDirection: 'row', padding: 5, display: 'flex', justifyContent: 'space-between'}}>
              <Button onPress={() => toggleSelect()} icon="select-all" mode="contained" style={{height: 50, alignItems: 'center', backgroundColor: '#2575ed', display: 'flex', paddingTop: 5}}>
                 Unselect {selected.length}
              </Button>
              {
                selected.length == 1 &&
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 5}}>
                  {
                    selected[0] > 0 &&
                    <IconButton
                      icon="arrow-up"
                      color={'#000'}
                      mode="contained"
                      size={20}
                      onPress={() => moveItem(selected[0], (selected[0] - 1))}
                    />
                  }
                  {
                    selected[0] < (chapters.length - 1) &&
                    <IconButton
                        icon="arrow-down"
                        color={'#000'}
                        mode="contained"
                        size={20}
                        onPress={() => moveItem(selected[0], (selected[0] + 1))}
                      />
                  }
                  <IconButton
                      icon="delete"
                      color={'#000'}
                      mode="contained"
                      size={20}
                      onPress={() => markAsDelete(selected)}
                    />
                 </View>
              }
              {
                selected.length > 1 &&
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 5}}>
                  <Button onPress={() => markAsDelete(selected)} icon="delete" mode="contained" style={{height: 50, alignItems: 'center', backgroundColor: '#db1c1c', display: 'flex', paddingTop: 5}}>
                     Delete
                  </Button>
                 </View>
              }
              </View>)
    } else {
      return (<View style={{flexDirection: 'row', padding: 5, display: 'flex', justifyContent: 'space-between'}}>
                          {chapters != null && chapters.length > 0 && <Button icon="select-all" mode="contained" style={{height: 50, backgroundColor: '#2575ed', alignItems: 'center', display: 'flex', paddingTop: 5}} onPress={() => toggleSelect()}>
                                                       Select
                                                    </Button>}
                          <AwesomeButton
                                progress
                                onPress={async(next) => {
                                  addPart();
                                  next()
                                }}
                                style={{}}
                                width={100}
                                height={50}
                                raiseLevel={0}
                                borderRadius={4}
                                borderColor={'#111'}
                                delayPressIn={0}
                                delayPressOut={0}
                                borderWidth={0}
                                textSize={17}
                                backgroundColor={'#222'}
                                backgroundProgress={'#333'}
                              >
                                <Text style={{color: '#fff', fontSize: 19, fontWeight: '500'}}>New</Text>
                             </AwesomeButton>
                          </View>)
    }
  }
  function _renderDrawer(){
    return (<View style={{height: '100%', maxHeight: '100%', paddingTop:10}}>
              
            {drawerSection == 'toc' && 
            <View style={{flex:1}}>
               {chapters == null && <SkeletonList />}
               {chapters != null && chapters.length == 0 && <Text style={{padding: 10, color: colorTextBg, fontSize: 25}}>No chapters yet.</Text>}
              { chapters != null && <FlatList
                         data={chapters}
                         //horizontal={true}
                         style={{}}
                         contentContainerStyle={{flexGrow: 1}}
                         ListFooterComponent={() => _renderToolbarAdd()}
                         renderItem={({ item, index }) => _renderChapterToc(item, index)}
                         keyExtractor={(item, ind) => ind +'-'+item._id}
                     />}
              </View>}
            {drawerSection == 'search' && _renderSearch()}
            {drawerSection == 'settings' && _renderSettings()}
            {drawerSection == 'audio' && _renderAudioSettings()}
            {drawerSection == 'info' && _renderInfo()}
         </View>
    )
  }

  function scrollToChapterIdByPercentage(doc){

    if(readerRef && readerRef.current){
       let first = readerRef.current.setPage(doc.indexChapter);

       setTimeout(() => {
         //wysiwygRef.current._wysiwyg.scrollToIndex({index:doc.indexBlock,animated: false})
       },1000)
    }
  }

  async function playOrStop(){
    let am = audioMode == true ? false : true;
    setAudioMode(am);
  }

  function switchAudio(){
    let ak = audioMode == true ? false : true;
    
    if(ak == true && initialIndex > -1 && chapters && chapters[initialIndex]){
     
      let clength = chapters && chapters[initialIndex] && chapters[initialIndex] && chapters[initialIndex].native_content && chapters[initialIndex].native_content.blocks && chapters[initialIndex].native_content.blocks.length;
      setAudioPosition((prevState) => update(prevState, { 
                  blockIndex: { 
                        $set: 0
                  },
                  index: {
                    $set: initialIndex
                  },
                  total_blocks: {
                    $set: clength - 1
                  }
               }));
      
    }
     if(!currentBook.language || (currentBook.language != 'es' && currentBook.language != 'en')){
        return Alert.alert(
            'Language not detected',
            'This book needs to have a language set before setting up audio.',
            [
              {
                text: 'Dismiss', 
                style: 'cancel',
              },
            ],
            {cancelable: true},
          );
      }
    setAudioMode(ak);
    stopPlaying();
    if(ak == true){
      setupAudio(NewtDB.rootUser, currentBook.language);
    }
    

  }
  async function onChangeAudioBlockIndex(index){
    await stopPlaying();
    setAudioPosition((prevState) => update(prevState, { 
                  blockIndex: { 
                        $set: index
                  }
               }));
    if(audioPosition.playing == true && audioPosition.index && audioPosition.blockIndex){
      setTimeout(() => {
        playBook(audioPosition.index, index)
      }, 200)
      
    }
  }

  async function stopPlaying(){
    if(Tts && Tts.stop){ await Tts.stop() };
    spokenArray = [];
    setAudioPosition((prevState) => update(prevState, { 
                  playing: { 
                        $set: false
                  }
               }));
    setTalking(null);
    return;
  }

  function followBlocks(){
    let fb = audioPosition.followBlocks == true ? false : true;
    setAudioPosition((prevState) => update(prevState, { 
                  followBlocks: { 
                        $set: fb
                  }
               }));
  }

  async function playChapter(item){

    await stopPlaying();
    if(!chapters){ return; }
    setAudioMode(true);
    let ki = chapters.findIndex(it => item._id == it._id);
    let clength = chapters && chapters[ki] && chapters[ki] && chapters[ki].native_content && chapters[ki].native_content.blocks ? chapters[ki].native_content.blocks.length : 0;
    setAudioPosition((prevState) => update(prevState, { 
                  index: { 
                        $set: ki
                  },
                  blockIndex: {
                    $set: 0
                  },
                  total_blocks: {
                    $set: clength - 1
                  },
                  playing: {
                    $set: true
                  }
               }));
    // audioPosition.index = ki;
    // audioPosition.blockIndex = 0;
    // audioPosition.total_index = chapters.length;
    // audioPosition.total_blocks = chapters[ki].native_content.blocks.length;
    if(ki > -1){
      setTimeout(() => {
        playBook(ki, 0);
      }, 200)
      
    }
    
    
  }

  async function playBook(indexChapter, indexBlock){
   // if(Tts && Tts.stop){ Tts.stop() };
    //console.log("on play book!", audioPosition, indexChapter, indexBlock, chapters[indexChapter] )
    if(audioMode == false){
     await setAudioMode(true);
    }
    if(!chapters){ return; }

    let clength = chapters && chapters[indexChapter] && chapters[indexChapter] && chapters[indexChapter].native_content && chapters[indexChapter].native_content.blocks ? chapters[indexChapter].native_content.blocks.length : 0;

    if((indexChapter <= (chapters.length -1)) &&
         chapters[indexChapter].native_content && 
         chapters[indexChapter].native_content.blocks && 
         chapters[indexChapter].native_content.blocks.length && 
         ((chapters[indexChapter].native_content.blocks.length -1) >= indexBlock)){

      //console.log("PLAY SPEAK!")
       setAudioPosition((prevState) => update(prevState, { 
                  index: { 
                        $set: indexChapter
                  },
                  blockIndex: {
                    $set: indexBlock
                  },
                  total_blocks: {
                    $set: clength - 1
                  },
                  playing: {
                    $set: true
                  }
               }));
       if(chapters[indexChapter].native_content.blocks[indexBlock]){
        //console.log("check if its come her")
        if(audioPosition && audioPosition.followBlocks && audioPosition.followBlocks == true){
          await navigateToBlockChapter(indexChapter, indexBlock);
        }
        
        let spblo = await speakBlock(chapters[indexChapter].native_content.blocks[indexBlock]);

        if(spblo == false){
          return playBook(indexChapter, indexBlock + 1);
        }
        if(spblo == "wait"){
          //console.log("SPEAK NEEDS TO WAIT!");
          await stopPlaying();
          await $restartAudioListeners();
        }
        if(audioPosition.total_blocks <= indexBlock){
          //stopPlaying();
        }
        return;
       }

    }
   
    return;

    for (var i = chapters.length - 1; i >= 0; i--) {
      if(i == indexChapter){
        if(chapters[i].native_content && chapters[i].native_content.blocks && chapters[i].native_content.blocks.length > 0){
          // for (var j = chapters[i].native_content.blocks.length - 1; j >= 0; j--) {
          //   if(indexBlock >= j)
          //   console.log("map loop!!", j)
          //   setAudioPosition((prevState) => update(prevState, { 
          //         index: { 
          //               $set: indexChapter
          //         },
          //         blockIndex: {
          //           $set: indexBlock + 1
          //         },
          //         playing: {
          //           $set: true
          //         }
          //      }));
          //   return speakBlock(chapters[i].native_content.blocks[indexBlock]);
          // }
        }
      }
    }
  
   // Tts.speak("play my chapter!");
  }

  async function speakBlock(it){
    //console.log("speak block!", spokenArray, it)
    isTalking = true;
    if(it && it.type && it.type == 'paragraph' && it.data && it.data.text && typeof it.data.text == 'string' && it.data.text != ''){
              //console.log("tts speak!!", it.data.text)
            //let spk = await Tts.speak(it.data.text);
            let spk;
            let thisId;
            if(it.id){
              thisId = it.id;
            } else {
              thisId = it.paragraph;
            }
            let filt = spokenArray.filter((itx, indx) => itx.id.includes(thisId));
           // console.log("did found?", filt, thisId)
            if(filt && filt.length > 0){
              return "wait";
            }
            if(Platform.OS == 'android'){
              spk = await Tts.speak(it.data.text, {
                  androidParams: {
                    KEY_PARAM_STREAM: 'STREAM_MUSIC',
                  },
                });
            }
            if(Platform.OS == 'ios'){
                spk = await Tts.speak(it.data.text, {
                 //  iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
                   //rate: 0.5,
                });
            }
            // setAudioPosition((prevState) => update(prevState, { 
            //       playing: {
            //         $set: false
            //       }
            //    }));
            //console.log("speaked!!", spk)
            spokenArray.push({id: thisId, idSpeak: spk});
        return true;
    } else {
      return false;
    }
  }
  async function onlyPausePlay(){
   // console.log("only pause play!", audioPosition)
    let ks = audioPosition && audioPosition.playing == true ? false : true;
    await stopPlaying();
    if(ks == false){
      
    } else {
      //console.log("play book only plaus epay!", audioPosition)
      setAudioPosition((prevState) => update(prevState, { 
                  playing: { 
                        $set: true
                  }
               }));
      if(audioPosition.index > -1 && audioPosition.blockIndex > -1){
       playBook(audioPosition.index, audioPosition.blockIndex)
      }
      
    }
    return;
  }
  function scrollToChapterIdByIndex(doc){

    if(readerRef && readerRef.current){
       let first = readerRef.current.setPage(doc.indexChapter);

       //console.log("set page first!", first, wysiwygRef.current._wysiwyg)
       setTimeout(function(){
         if(wysiwygRefs.current[doc.indexChapter] && wysiwygRefs.current[doc.indexChapter]._wysiwyg && typeof wysiwygRefs.current[doc.indexChapter].props.initialBlocks.blocks == 'object'){
           Snackbar.show({ text: 'Finding location...', duration: Snackbar.LENGTH_LONG })
           wysiwygRefs.current[doc.indexChapter]._wysiwyg.scrollToIndex({index:doc.indexBlock,animated: false});
           showHeader(false);
         }
       },500)
    }
  }

  async function navigateToBlockChapter(indexChapter, indexBlock){

    if(readerRef && readerRef.current){
      if(initialIndex == indexChapter){
       // let first = readerRef.current.setPage(indexChapter);
       

       //console.log("set page first!", first, wysiwygRef.current._wysiwyg)
       setTimeout(function(){
         if(wysiwygRefs.current[indexChapter] && wysiwygRefs.current[indexChapter]._wysiwyg && typeof wysiwygRefs.current[indexChapter].props.initialBlocks.blocks == 'object'){
           //Snackbar.show({ text: 'Finding location...', duration: Snackbar.LENGTH_LONG })
           wysiwygRefs.current[indexChapter]._wysiwyg.scrollToIndex({index:indexBlock,animated: true});
           //showHeader(false);
         }
       },500)
     }
    }
    return;
  }

  function _renderSearchKey(result, index){

      return (
        <TouchableRipple key={index} style={{width: '100%'}} onPress={() => scrollToChapterIdByIndex(result)}>
          
          <View style={{padding: 10, borderBottomWidth: 1, borderColor: borderColorBg}}>
                <View style={{marginBottom: 5}}>
                  <Badge style={{backgroundColor: '#2575ed', marginTop: -2  }}>{result.indexChapter + 1}</Badge>
                  <Text style={{color: colorTextBg, fontSize: 17, fontWeight: '700'}}>
                   {result.title } (block: {result.indexBlock})
                  </Text>
                </View>
                <Text numberOfLines={4} style={{width: '100%', color: colorTextBg, fontSize: 15}}>
                  {result.text} 
                </Text>
          </View>
        </TouchableRipple>
        )
    }
    function onSearch(){

      if(!searchQuery){
        return;
      }
      setSearchResults('searching');
      let results = [];
      
      chapters && chapters.map((chapter,index) => {

        if(chapter.native_content){
          let blocks = chapter.native_content.blocks || [];
          if(blocks.length > 0){
            //console.log("blocvkshere!", blocks)
            for (var i = blocks.length - 1; i >= 0; i--) {
              //console.log("blocvkshereiiiii!", blocks[i])
              if(blocks[i] && blocks[i].type == 'paragraph'){
                if(blocks[i].data && blocks[i].data.text && blocks[i].data.text.indexOf(searchQuery) !== -1){

                  let calculatePercentage = parseFloat(((100 * i) / blocks.length).toFixed(2));
                  results.push({
                    _id: chapter._id,
                    indexChapter: index,
                    indexBlock: i,
                    title: chapter.title,
                    text: blocks[i].data.text,
                    percentage: calculatePercentage
                  })
                }
              }
            }
          }
          //console.log("chapter search!", chapter.native_content)
          // let cleanChapter = chapter.native_content.replace(/<[^>]*>?/gm, '');

          // let searched = cleanChapter.toLowerCase().split(this.state.search.toLowerCase())[1];

          // if(searched != null){
          //   results.push({ _id: chapter._id, title: chapter.title, index: chapter.position, hightlight: searched })
          // }
        
        }
        
        //console.log("CHAPTER!", chapter, cleanChapter)
        
      });

      setSearchResults(results);
    }
  async function selectCoverBook(){
    //console.log("select cover!!!")
    if(canEdit != true){ return; }
      let a = await NewtDB.askPermissions();
      //console.log("ask permissions!", a)
      const options = {
        quality: 1.0,
        maxWidth: 300,
        maxHeight: 300,
        storageOptions: {
          skipBackup: true,
        },
      };
      ImagePicker.launchImageLibrary(options, async(response) => {


        if (response.didCancel) {

        } else if (response.error) {
          //console.log("response error!!", response)
          Snackbar.show({ title: 'Permissions weren\'t granted', duration: Snackbar.LENGTH_LONG });
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
          let f = await(ClouchDB.Work().drafts().coverUp(data));
          //console.log("cover up!!", f)
          if(f && f.type == 'success' && f.objects && f.objects.filename){
            let settler = {
              cover: {
                $set: 'https://static.newt.keetup.com/covers/'+f.objects.filename
              }
            }
            if(f.objects.colors){
              settler.colors = {
                $set: f.objects.colors
              }
            }
            setCurrentBook((prevState) => update(prevState, settler));
            setBookChanges(true);
          }
        }
      });
    }

    function editProperty(setting){
      if(!canEdit){ return; }
      navigation.navigate('ChangeProperty',{
          activeDoc: currentBook,
          toEdit: 'book-'+setting,
          toUpdate: (s) => onChangeBookProperty(s)
        });
    }

    function onChangeBookProperty(b){
      
      if(!b.activeDoc || !b.toEdit || !currentBook || canEdit == false){ return; }
      const thisBook = b.activeDoc;
      if(b.toEdit == 'book-title' && thisBook.title != currentBook.title){
        setCurrentBook((prevState) => update(prevState, {
          title: {
            $set: thisBook.title
          }
        }));
      }
      if(b.toEdit == 'book-author' && thisBook.author != currentBook.author){
        setCurrentBook((prevState) => update(prevState, {
          author: {
            $set: thisBook.author
          }
        }));
      }
      if(b.toEdit == 'book-description' && thisBook.description != currentBook.description){
        setCurrentBook((prevState) => update(prevState, {
          description: {
            $set: thisBook.description
          }
        }));
      }
      if(b.toEdit == 'book-tags' && thisBook.tags != currentBook.tags){
        setCurrentBook((prevState) => update(prevState, {
          tags: {
            $set: thisBook.tags
          }
        }));
      }
      if(b.toEdit == 'book-language' && thisBook.language != currentBook.language){
        let lng = (thisBook.language == 'Español' || thisBook.language == 'es') ? 'es' : 'en';
    
        setCurrentBook((prevState) => update(prevState, {
          language: {
            $set: lng
          }
        }));
        setupAudio(NewtDB.rootUser, lng);
        setTimeout(() => {
          setDrawerSection("info")
        }, 100)
      }
      setBookChanges(true);
    }

    function $delete(){
      setModalSection('delete');
      setModalOpen(true);
    }
    function $publish(){
      setModalSection('publish');
      setModalOpen(true);
    }

    function _renderInfo(){
      return (
        <ScrollView>
          <TouchableRipple onPress={() => editProperty('title')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{Languages.Name[getLang()]}</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  {
                                    currentBook && currentBook.title && <Text numberOfLines={1} style={{color: colorTextBg, margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{currentBook.title}</Text>
                                  }
                                  
                                   { canEdit && <Icon color={colorTextBg} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> }
                                 </View>
                              </View>
           </TouchableRipple>

           <TouchableRipple onPress={() => editProperty('author')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{Languages.author[getLang()]}</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  {
                                    currentBook && currentBook.author && <Text numberOfLines={1} style={{color: colorTextBg, margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{currentBook.author}</Text>
                                  }
                                  
                                  { canEdit && <Icon color={colorTextBg} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> }
                                 </View>
                              </View>
           </TouchableRipple>

           <TouchableRipple onPress={() => editProperty('description')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Description</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  {
                                    currentBook && currentBook.description && <Text numberOfLines={1} style={{color: colorTextBg, margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{currentBook.description}</Text>
                                  }
                                  
                                   { canEdit && <Icon color={colorTextBg} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> }
                                 </View>
                              </View>
           </TouchableRipple>

           <TouchableRipple onPress={() => editProperty('tags')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Tags</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  {
                                    currentBook && currentBook.tags && <Text numberOfLines={1} style={{color: colorTextBg, margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{currentBook.tags.length}</Text>
                                  }
                                  
                                   { canEdit && <Icon color={colorTextBg} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> }
                                 </View>
                              </View>
           </TouchableRipple>

           <TouchableRipple onPress={() => editProperty('language')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Language</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  {
                                    currentBook && currentBook.language && <Text numberOfLines={1} style={{color: colorTextBg, margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{currentBook.language == 'en' ? 'English' : (currentBook.language == 'es' ? 'Español' : 'Unset')}</Text>
                                  }
                                  
                                   { canEdit && <Icon color={colorTextBg} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> }
                                 </View>
                              </View>
           </TouchableRipple>

           <TouchableRipple onPress={() => $publish()} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Status</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  {
                                    currentBook && <Text numberOfLines={1} style={{color: colorTextBg, margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{currentBook.status == 'public' ? 'Public' : 'Private'}</Text>
                                  }
                                  
                                   { canEdit && <Icon color={colorTextBg} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> }
                                 </View>
                              </View>
           </TouchableRipple>

           <TouchableRipple onPress={() => selectCoverBook()} style={{width: '100%', height: 70, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                              <View style={{height:70, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', paddingBottom: 2}}>
                                 <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Cover</Text>
                                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                  { currentBook && currentBook.cover && <Cover item={currentBook} style={{marginLeft:5}} /> }
                                 </View>
                              </View>
           </TouchableRipple>

           {
            currentBook  && canEdit == true &&
             <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 8}}>
               <Button onPress={() => $delete()} icon="delete" mode="contained" style={{backgroundColor: '#db1c1c'}}>
                         Delete
               </Button>

               <Button onPress={() => $publish()} icon={currentBook.status == 'public' ? 'upload-lock' : 'upload'} mode="contained" style={{backgroundColor: '#2575ed'}}>
                      { currentBook.status == 'public' ? 'Unpublish' : 'Publish' }
               </Button>
             </View>
           }
        </ScrollView>
        )
    }
    function _renderSearch(){
      return (
        <>
        <FlatList
              data={searchResults}
                   // ref={(ref) => { this._wysiwyg = ref; }}
                   // innerRef={ref => {
                   //    this.scroll = ref;
                   //  }}
                   initialNumToRender={7}
                   enableAutomaticScroll={true}
                   maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={500}
                   //listKey={(item, index) => 'D' + shortid.generate()}
                   

                   ListHeaderComponent={
                    <View>
                    <Searchbar
                      placeholder={Languages.searchContent[getLang()]}
                      onChangeText={(t) => setSearchQuery(t)}
                      value={searchQuery}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      style={{margin:10}}
                      onSubmitEditing={() => onSearch()}
                    />
                    
                    {  
                    (searchResults != null) && 
                      <View style={{marginTop: 5}}><Text
                       style={[globalStyles.sectionHeaderText, {color: colorTextBg}]}>
                          {searchResults.length} RESULTS
                      </Text>
                      <SettingsDividerLong /></View>
                    }
                    </View>}
                   //getItemLayout={(data, index) => ({ length: this.state.initial.blocks.length, index })}
                    contentContainerStyle={{ paddingBottom: 0}}
                    keyboardShouldPersistTaps="handled"
                    // contentInset={{left: 0, right: 0}}
                    //contentInsetAdjustmentBehavior="automatic"
                   style={styles.scrollViewBooks}
                   //onScroll={this.props.onScroll}
                   // innerRef={ref => {
                   //    this.scroll = ref;
                   //  }}  
                   ListEmptyComponent={searchResults != null && searchResults.length == 0 ? <Text style={{padding: 10, fontSize:20, textAlign: 'center'}}>There are no results based on your query.</Text> : (searchResults == 'searching') ? <Text style={{padding: 10, fontSize:20, textAlign: 'center'}}>'Searching...'</Text> : null}
                   renderItem={({ item, index }) => _renderSearchKey(item, index)}
                   keyExtractor={(item, i) => i +'-'+item._id}
                /> 
            { searchResults ==  'searching' && <Text>Searching...</Text>}

        </>

        )
  }

  function onChapterScroll(e, itemIndex){
    let contentOffset = e.nativeEvent.contentOffset.y;
    let contentHeight = e.nativeEvent.contentSize.height;

    setScrollPosition({
      index: itemIndex,
      total_index: (chapters.length - 1),
      offset: contentOffset,
      height: contentHeight,
      lastViewable: scrollViewableItems
    })
    //console.log("set scroll position!", scrollViewableItems)
  }

  function removeImageHeader(chapterIndex){
    setChapters((prevState) => update(prevState, { 
                                [chapterIndex]: { 
                                  $unset: ['header']
                                } 
                             }));
              toggleChapterChange(chapterIndex);
  }
  async function addImageHeader(chapterIndex){
    const options = {
        quality: 0.9,
        minWidth: 100,
        minHeight: 100,
        storageOptions: {
          skipBackup: true,
        },
      };
      NewtDB.askPermissions();
      ImagePicker.showImagePicker(options, async(response) => {
        if (response.didCancel) {

        } else if (response.error) {
          Snackbar.show({ title: 'Permissions weren\'t granted', duration: Snackbar.LENGTH_LONG });
        } else if (response.customButton) {

        } else {

          let data = {
              type: response.type,
              name: response.fileName,
              size: response.fileSize,
              data: response.data,
              source: {uri: response.uri}
            };
            let f = await(ClouchDB.Work().drafts().chapters().addImgContent(data));
            
            if(f){
              let url = API_STORAGE_CONTENTS+'/'+f.objects.filename;
              let header = {
                type: 'img',
                url: url
              }
              //console.log("update add img content!!", f, url)
              setChapters((prevState) => update(prevState, { 
                                [chapterIndex]: { 
                                  header: {
                                    $set: header
                                  }
                                } 
                             }));
              toggleChapterChange(chapterIndex);
            } 
        }
      });
  }

  const onViewRef = React.useRef((viewableItems)=> {
      if(viewableItems.viewableItems && viewableItems.viewableItems[0] && viewableItems.viewableItems[0].index){
        scrollViewableItems = viewableItems.viewableItems[0].index;
      }
      //console.log("scroll viewable!!", scrollViewableItems)
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 100 })

  function _renderHeader({item, itemIndex, visiblePagef}){
    const ElU = item.header != null ? FastImage : View;
    const canPlay = item.native_content && item.native_content.blocks && item.native_content.blocks.length > 0 ? true : false;
    const isPlaying = audioPosition && audioPosition.index && chapters[audioPosition.index] && chapters[audioPosition.index]._id == item._id && audioPosition.playing == true;
    return (
      <ElU 
                        source={item.header && item.header.url && item.header.url && {uri:item.header.url}}
                        indicator={Progress.Circle}
                        imageStyle={{
                          width: '100%',
                          height: item.header != null && editing == false ? 275 : 135,
                            }}
                        indicatorProps={{
                                    size: 40,
                                    borderWidth: 0,
                                    color: 'rgba(150, 150, 150, 1)',
                                    unfilledColor: 'rgba(200, 200, 200, 0.2)'

                                  }}
                        resizeMode={'cover'}
                        style={{
                                  //alignSelf: 'center',
                                  borderRadius: 0,
                                  width: '100%',
                                  minHeight: item.header != null && editing == false ? 275 : (editing == false ? 100 : 150),
                                  width:'100%'
                                }}>
                                

                                {item.header != null && <LinearGradient
                                  start={{ x: 0, y: 1 }}
                                  end={{ x: 0, y: 0 }}
                                  style={{width: '100%', height: item.header != null && editing == false ? 290 : 185, backgroundColor: 'transparent', position: 'absolute', top: 0, left:0}}

                                  colors={[
                                    theme == 'light' ? '#f7f7f7' : (theme == 'dark' ? '#232225' : '#e7d7bc'),
                                    'transparent'
                                  ]} />}
                                

        <View 
          style={{
            justifyContent:'center',
            alignItems: 'center',
            paddingTop: item.header != null && editing == false ? 120 : (editing == false ? 20 : 20), 
            marginBottom: item.header != null && editing == false ? 50 : (editing == false ? 0 : 10)
          }}>


        {
          editing == true &&

          <View style={{zIndex:999, justifyContent: 'center', alignItems: 'center'}}>
              

                                  <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom', anchorStyle: {backgroundColor: '#fff'} }} style={{backgroundColor: 'transparent', borderRadius: 8}}>
                                    <MenuTrigger style={{width:40, height:40, justifyContent: 'center', alignItems: 'center',zIndex:99}}>
                                      <EntypoIcono
                                                name="plus"
                                                size={22}
                                                color={theme == 'dark' ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.8)'}
                                              />
                                    </MenuTrigger>
                                    <MenuOptions
                                      optionsContainerStyle={{
                                        padding: 5,
                                        backgroundColor: '#fff',
                                        borderRadius: 8
                                      }}
                                      >
                                       <MenuOption onSelect={() => addImageHeader(itemIndex)} >
                                          <Text style={{color: '#000', fontSize: 18}}>Change header</Text>
                                       </MenuOption>
                                       {item.header && 
                                        <MenuOption onSelect={() => removeImageHeader(itemIndex)} >
                                          <Text style={{color: '#000', fontSize: 18}}>Remove Header</Text>
                                       </MenuOption>
                                      }
                                    </MenuOptions>
                                  </Menu>
   
            
         </View>
       }
       
       {
        editing == true ? <TextInput
                            //onChangeText={(text) => this.setState({title: text})}
                            style={{ fontFamily: Platform.OS == 'ios' ? 'Webtype - web use only' : 'telefon_black', color:theme == 'light' ? (item.header ? '#000' : '#111') : (theme == 'dark' ? '#fff' : '#000'),alignSelf: 'flex-start', textAlign: 'center', borderBottomWidth: 0, borderColor: theme == 'light' ? '#eaeaea' : (theme == 'dark' ? '#222' : '#645339'), fontSize: 33, width: '100%', minHeight: 30, borderRadius: 4,marginBottom: 5, paddingLeft: 10, paddingRight: 10, paddingBottom:10,fontWeight: Platform.OS == 'ios' ? '700' : null}}
                            value={item.title}
                            placeholder={"Name of the chapter"}
                            onChangeText={(text) => setTitle(text, itemIndex)}
                            placeholderTextColor="#999"
                            multiline={true}
                            autoCapitalize = 'none' 
                            autoCorrect={false}
                          /> : <Text style={{
                            fontFamily: Platform.OS == 'ios' ? 'Webtype - web use only' : 'telefon_black',  
                              //fontFamily: 'Webtype - web use only',  
                              color: theme == 'light' ? (item.header ? '#000' : '#111') : (theme == 'dark' ? '#fff' : (item.header ? '#000' : '#111')),
                              alignSelf: 'flex-start', 
                              textAlign: 'center', 
                              borderBottomWidth: 1, 
                              borderColor: 'rgba(255,255,255,.01)', 
                              fontSize: 35, 
                              width: '100%', 
                              minHeight: 30, 
                              borderRadius: 4,
                              marginBottom: 5, 
                              paddingLeft: 10, 
                              paddingRight: 10, 
                              paddingBottom:10,
                              fontWeight: Platform.OS == 'ios' ? '700' : null}}>
                             {item.title} </Text>
       }
       <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
       {
        (editing == false && canPlay) && 
            <Button onPress={() => { if(isPlaying){ stopPlaying() } else { playChapter(item) } }} icon={isPlaying ? "pause" : "volume-medium"} mode="contained" style={{backgroundColor:'#2575ed', margin: 10}}>
                { isPlaying ? Languages.pause[getLang()] : Languages.play[getLang()] } 
            </Button>
       }
       <IconButton
           icon="share"
           color={'#2575ed'}
           style={{}}
          size={20}
           onPress={() => NewtDB.shareChapter(item)}
         />
       </View>
       {
            chapters && initialIndex > -1 && chapters[initialIndex] && NewtDB.partsNeedPull != null && NewtDB.partsNeedPull.length !== 0 && NewtDB.partsNeedPull.indexOf(chapters[initialIndex]._id) > -1 && 
              <TouchableRipple style={{zIndex:9999,width: '90%', minHeight: 45, borderRadius:5, backgroundColor: '#2575ed', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onPress={() => onRefreshChapter(chapters[initialIndex]._id.split(":chapter:")[0])}>
                <Text style={{color: '#ffffff', fontWeight: '700', fontSize: 16}}>{Languages.newRemoteChanges[getLang()]}</Text>
              </TouchableRipple>
          }
        </View>
        </ElU>
                    )
  }

  async function uploadImage(params){
    let f = await(ClouchDB.Work().drafts().chapters().addImgContent(params));
    //console.log("add image!!", params)
      if(f && f.type && f.type == 'success'){
              let url = API_STORAGE_CONTENTS+'/'+f.objects.filename;
              //console.log("uploade img!",url, f)
              return url;
              //this.insertImage(url, params.uri);
            } else {
              return false;
            }

          // Same code as in above section!

       // this.insertImage(result.uri);
    }

  async function addLink(params){
      let f = await(ClouchDB.Work().drafts().chapters().scrapeLink(params)).catch(e => null);
      //console.log("add link!!", params, f)
      return f;
    }
  async function playFromHere(indexChapter, indexBlock){

    //return;
    if(textToSpeech.status && textToSpeech.status != "initialized") { await setupAudio(NewtDB.rootUser, currentBook.language); return; }
    await stopPlaying()
    setTimeout(() => {
      playBook(indexChapter, indexBlock)
    }, 100)
    
  }
  function _renderBlockOptions(block, indexBlock, indexChapter){
    return (
      <ScrollView horizontal={true} style={{display: 'flex', flexDirection: 'row'}}>
        {
          canAudioBook && <Button onPress={() => playFromHere(indexChapter, indexBlock)} color={'#2575ed'} icon={"volume-medium"} mode="outlined" style={{margin: 5}}>
              {Languages.playFromHere[getLang()]}
          </Button>
        }
        <IconButton
           icon="share"
           color={'#2575ed'}
           style={{marginTop:9}}
           size={20}
           onPress={() => NewtDB.shareBlockChapter(chapters[indexChapter], block)}
         />
      </ScrollView>
      )
  }
  function _renderChapter(key){
    let colorBg = theme == 'light' ? '#f7f7f7' : (theme == 'dark' ? '#232225' : '#e7d7bc');
    //console.log("render chapter!!!!", key)
      return (
        <TouchableWithoutFeedback activeOpacity={1} delayLongPress={3} onLongPress={() => toggleHeader()}  onPress={Keyboard.dismiss} style={{backgroundColor: colorBg, flex:1, width: '100%', height: '100%', margin:0, padding:0}}>
          <View style={{flex: 1}}>

          {
            (!key.type || key.type != 'firstPage') &&
            <Wysiwyg
                    //ref={(ref) => setWysiwygRef(ref, key.itemIndex)}
                    ref={el => wysiwygRefs.current[key.itemIndex] = el}
                    style={styles.richEditor}
                    key={key.item._rev}
                    viewProps={{
                      //onStartShouldSetResponder: () => toggleHeader()
                    }}
                    blockOptions={(block, index) => _renderBlockOptions(block, index, key.itemIndex)}
                    initialBlocks={key.item.native_content}   
                    //key={key.item.native_content && key.item.native_content.time ? key.item.native_content.time : undefined}
                    onStartShouldSetResponder={() => toggleHeader()}
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={viewConfigRef.current}
                    onScrollToIndexFailed={(error) => {
                      wysiwygRefs.current[key.itemIndex]._wysiwyg.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                      setTimeout(() => {
                        if (key.item.native_content.length !== 0 && wysiwygRefs.current[key.itemIndex]._wysiwyg !== null) {
                          wysiwygRefs.current[key.itemIndex]._wysiwyg.scrollToIndex({ index: error.index, animated: false });
                        }
                      }, 100);
                    }}
                    title={key.item.title}
                    header={key.item.header}
                    editMode={editing || false}
                    readingTheme={theme}
                    placeholder={'Enter text here'}
                    onChangeBlocks={(blocks) => onChapterChange(blocks, key.itemIndex)}
                    contentEditable={true}
                    onScroll={(e) => onChapterScroll(e, key.itemIndex)}
                    ListHeaderComponent={_renderHeader(key)}
                    textAlign={textAlign}
                    uploadImage={(p) => uploadImage(p)}
                    addLink={(p) => addLink(p)}
                    i18n={{
                      paragraph: Languages.paragraph[getLang()],
                      headline: Languages.headline[getLang()],
                      image: Languages.image[getLang()],
                      list: Languages.list[getLang()],
                      quote: Languages.quote[getLang()],
                      warning: Languages.warning[getLang()],
                      delimiter: Languages.delimiter[getLang()],
                      link: Languages.link[getLang()]
                    }}
                    fontSize={((Platform.OS == 'ios' ? 24 : 21) +(fontSize))} // optional (will override default fore-color)
             />
          }
          </View>
          </TouchableWithoutFeedback>
      )
  }

  function onPageSelected(e: PageSelectedEvent){
    //console.log("on page selected!", e)
    if(initialIndex != e){
      setInitialIndex(e);
      setScrollPosition(null);
    }
  };

  async function $doDelete(){
    Alert.alert(
            'Final Delete Confirmation',
            'This cannot be undone',
            [
              {
                text: 'Cancel', 
                style: 'cancel',
              },
              {
                text: 'Delete',
                onPress: async() => {
                    Snackbar.show({ text: 'Deleting '+currentBook.title, duration: Snackbar.LENGTH_LONG })
                    let newBulk = chapters;
                    let newBook = currentBook;
                    for (var i = newBulk.length - 1; i >= 0; i--) {
                      newBulk[i]._deleted = true;
                    }
                    newBook._deleted = true;

                    if(newBulk){
                      let sc = await ClouchDB.Chapters().saveBulk(newBulk).catch(e => null);
                    }
                    if(newBook){
                      let sb = await ClouchDB.Books().saveOne(newBook).catch(e => null);
                    }
                    navigation.popToTop()
                },
              }
            ],
            {cancelable: true},
          );
  }

  async function $doPublish(){
    if(!currentBook){ return; }
    let st = currentBook.status == 'public' ? 'public' : 'private';
    Alert.alert(
            st == 'public' ? 'Unpublish' : 'Make it Public',
            st == 'public' ? 'This action will take your book down from any bookshelves.' : 'This will allow you to share this book and other people from Newt will be able to read your book',
            [
              {
                text: 'Cancel', 
                style: 'cancel',
              },
              {
                text: st == 'public' ? 'Unpublish' : 'Publish',
                onPress: async() => {
                    //Snackbar.show({ text: 'Deleting '+currentBook.title, duration: Snackbar.LENGTH_LONG })
                    let newBook = {...currentBook};
                    setCurrentBook((prevState) => update(prevState, {
                      status: {
                        $set: st == 'public' ? 'private' : 'public'
                      },
                      $unset: ['progress']
                    }));
                    if(newBook){
                      newBook.status = st == 'public' ? 'private' : 'public';
                      let sb = await ClouchDB.Books().saveOne(newBook).catch(e => null);
                    }
                    setModalOpen(false);
                    //navigation.popToTop()
                },
              }
            ],
            {cancelable: true},
          );
  }

  function _renderModal(){
    if(modalSection == 'delete' && currentBook && NewtDB.rootUser){
      return (
          <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  borderBottomWidth: 2, borderColor: '#eaeaea', padding: 4}}>
              <Text style={{fontSize: 20, color: '#000', fontWeight: '500',marginLeft: 5}}>Delete</Text>
              <IconButton
                  icon="chevron-down"
                  color={'#000'}
                  size={20}
                  onPress={() => setModalOpen(false)}
                />
            </View>
            
            <Text style={{margin: 7, fontSize: 19}}>Type the name of the book to confirm deletion</Text>
            <TextInput placeholder="Book Name" type={'password'} style={[styles.input, { backgroundColor: '#eaeaea', color: '#000' }]} value={deleteConfirm} onChangeText={(e) => setDeleteConfirm(e)}/>
            <Button onPress={() => $doDelete()} disabled={currentBook.title.toLowerCase() != deleteConfirm.toLowerCase()} icon="delete" mode="contained" style={{backgroundColor: currentBook.title.toLowerCase() == deleteConfirm.toLowerCase() ? '#db1c1c' : '#eaeaea', margin: 10}}>
                Delete
            </Button>
          </View>
        )
    }
    if(modalSection == 'publish' && currentBook && NewtDB.rootUser){
      const canPublish = currentBook.title && currentBook.description && (currentBook.tags && currentBook.tags.length > 0 ) && (currentBook.language == 'en' || currentBook.language == 'es') && currentBook.cover && (chapters != null && chapters.length > 0 && chapters[0] && chapters[0].native_content && chapters[0].native_content.blocks && chapters[0].native_content.blocks.length > 0);
      return (
          <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  borderBottomWidth: 2, borderColor: '#eaeaea', padding: 4}}>
              <Text style={{fontSize: 20, color: '#000', fontWeight: '500',marginLeft: 5}}>{currentBook.status == 'public' ? 'Unpublish' : 'Publish'}</Text>
              <IconButton
                  icon="chevron-down"
                  color={'#000'}
                  size={20}
                  onPress={() => setModalOpen(false)}
                />
            </View>
            <View style={{padding: 10}}>
              
              <Text style={{fontSize: 18, textAlign: 'center'}}>This book is currently {currentBook.status == 'public' ? 'public' : 'private'}</Text>
              
              { currentBook.status != 'public' && 
                <View style={{padding: 10, borderRadius: 10, backgroundColor: '#eaeaea'}}>
                  <Text style={{fontSize: 18, marginBottom: 5}}>Requeriments</Text>
                  
                  <Text style={{fontSize:16}}>
                    <Icon name={currentBook.title ? "check" : "cancel"} size={14} style={{color: '#666'}}/>
                    <Text style={{}}> Title</Text>
                  </Text>
                  <Text style={{fontSize:16}}>
                    <Icon name={currentBook.description ? "check" : "cancel"} size={14} style={{color: '#666'}}/>
                    <Text style={{}}> Description</Text>
                  </Text>
                  <Text style={{fontSize:16}}>
                    <Icon name={currentBook.tags && currentBook.tags.length > 0 ? "check" : "cancel"} size={14} style={{color: '#666'}}/>
                    <Text style={{}}> Tags</Text>
                  </Text>
                  <Text style={{fontSize:16}}>
                    <Icon name={(currentBook.language == 'en' || currentBook.language == 'es') ? "check" : "cancel"} size={14} style={{color: '#666'}}/>
                    <Text style={{}}> Language</Text>
                  </Text>
                  <Text style={{fontSize:16}}>
                    <Icon name={currentBook.cover ? "check" : "cancel"} size={14} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                    <Text style={{marginLeft: 5}}> Cover</Text>
                  </Text>
                  <Text style={{fontSize:16}}>
                    <Icon name={(chapters != null && chapters.length > 0 && chapters[0] && chapters[0].native_content && chapters[0].native_content.blocks && chapters[0].native_content.blocks.length > 0) ? "check" : "cancel"} size={14} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                    <Text style={{marginLeft: 5}}> At least one chapter with at least one block</Text>
                  </Text>
                </View>
              }
              <Button onPress={() => $doPublish()} disabled={!canPublish} icon="delete" mode="contained" style={{backgroundColor: !canPublish ? '#eaeaea' : '#2575ed', margin: 10}}>
                {currentBook.status == 'public' ? 'Unpublish' : 'Publish'}
              </Button>
            </View>
          </View>
        )
    }
  }
  // <ViewPager 
  //     ref={readerRef} 
  //     initialPage={initialIndex || 0}
  //     onStartShouldSetResponder={() => toggleHeader()}  
  //     orientation={'horizontal'} 
  //     transitionStyle={'curl'} 
  //     style={{flex:1, backgroundColor: theme == 'light' ? '#f7f7f7' : (theme == 'dark' ? '#111' : '#999')}}
  //     onPageSelected={onPageSelected}
  //     >
        
  //       {
  //         chapters && chapters.map((c, i) => _renderChapter(c, i))
  //       }
  //     </ViewPager>
  return (

    <View style={{margin:0, padding:0, flex:1, width: '100%', height: '100%', position: 'absolute', top: 0, bottom:0,right:0,left:0, backgroundColor: theme == 'light' ? '#f7f7f7' : (theme == 'dark' ? '#232225' : '#e7d7bc')}}>
      
      { (chapters == null || needRefresh == true) && <View style={{flex:1, display: 'flex', alignItems: 'center', paddingTop: 30}}><SkeletonTextBook /></View>}
      { chapters && chapters.length == 0 && editing == true && 
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <ChaptersWriteNone width={300} height={300} style={{marginLeft: 20}}/>
              <Text style={{textAlign: 'center', color: colorTextBg, fontSize: 22, fontWeight: '700', marginTop: 15}}>
               {Languages.startBuildingYourStory[getLang()]}
              </Text>
              <Text style={{fontSize: 20, maxWidth: 350, textAlign: 'center', color: colorTextBg}}>
                {Languages.booksNoChaptersWouldLikeCreate[getLang()]}
              </Text>
              <AwesomeButton
                                progress
                                onPress={async(next) => {
                                  addPart();
                                  next()
                                }}
                                style={{marginTop: 15}}
                                width={100}
                                height={50}
                                raiseLevel={0}
                                borderRadius={4}
                                borderColor={'#111'}
                                delayPressIn={0}
                                delayPressOut={0}
                                borderWidth={0}
                                textSize={17}
                                backgroundColor={'#222'}
                                backgroundProgress={'#333'}
                              >
                                <Text style={{color: '#fff', fontSize: 19, fontWeight: '500'}}>{Languages.create[getLang()]}</Text>
                             </AwesomeButton>
            </View>
          }
      { chapters && chapters.length == 0 && editing == false && 
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <NoChaptersRead width={300} height={300} style={{marginLeft: 20}}/>
              <Text style={{textAlign: 'center', color: colorTextBg, fontSize: 22, fontWeight: '700', marginTop: 15}}>
               { canEdit ? Languages.yourBookEmpty[getLang()] : Languages.thisBookEmpty[getLang()] }
              </Text>
              <Text style={{fontSize: 20, maxWidth: 350, textAlign: 'center', color: colorTextBg}}>
                {
                  canEdit ? Languages.goBackEmptyBook[getLang()] : Languages.writerBookNoParts[getLang()]
                }
                
              </Text>
              { canEdit && <Button onPress={() => setEditing(true)} icon="pencil" mode="contained" style={{marginTop: 15, backgroundColor: '#2575ed',color: '#fff'}}>
                    {Languages.editMode[getLang()]}
                </Button> }
            </View>
          }

      
      { chapters && chapters.length > 0 && <LazyViewPager
        ref={readerRef}
        scrollEnabled={false}
        initialPage={initialIndex || 0}

        //onStartShouldSetResponder={() => toggleHeader()}  
        data={chapters}
        style={{flex:1,margin:0,padding:0, width: '100%', height: '100%', backgroundColor: theme == 'light' ? '#f7f7f7' : (theme == 'dark' ? '#232225' : '#e7d7bc')}}
        onPageSelected={onPageSelected}
        renderItem={(item) => _renderChapter(item)}
        />
      }

      {
        visibleHeader == true && 
            <Drawer 
            bgColor={Platform.OS == 'ios' ? 'transparent' : (theme == 'light' ? '#ffffff' : (theme == 'dark' ? '#000000' : '#544733'))}
            innerStyle={{
              //backgroundColor: isDarkMode == true ? '#111' : '#fff'
            }} 
            scaleTwo={(audioMode == true) ? true : false}
            style={{backgroundColor: Platform.OS == 'ios' ? 'transparent' : (theme == 'light' ? '#ffffff' : (theme == 'dark' ? '#000000' : '#544733'))}}
            theme={theme}
            header={() => _renderDrawerHeader()} 
            ref={drawerRef}>
              {_renderDrawer()}
            </Drawer>
      }

      <StatusBar hidden/>
      {
        keepScreenAwake == true && <KeepAwake />
      }
      <Modal 
                  style={[styles.sessionContainer, {width:ancho,margin:0, marginTop:getHeaderHeight(), height: alto}]}
                  isVisible={Boolean(modalOpen)}
                  animationIn={'fadeIn'}
                  animationOut={'fadeOut'}
                  hasBackdrop={true}
                 // avoidKeyboard={true}
                 //propagateSwipe={false}
                  deviceWidth={deviceWidth}
                  onSwipeComplete={() => setModalOpen(false)}
                  swipeDirection="down"
                  swipeThreshold={10}
                  deviceHeight={deviceHeight}
                  //propagateSwipe
                  >
                  <View style={styles.modalView}>
                 {_renderModal()}
                  </View>
            </Modal>
     </View>
  )
}
  // return (
  //   <View style={{flex:1, width: '100%', height: '100%', backgroundColor: theme == 'light' ? '#f7f7f7' : (theme == 'dark' ? '#111' : '#999')}}>
  //     <ViewPager onStartShouldSetResponder={() => toggleHeader()}  style={{backgroundColor: theme == 'light' ? '#f7f7f7' : (theme == 'dark' ? '#111' : '#999')}}>
  //       <FlatList
  //                   ref={readerRef}
  //                   data={chapters}
  //                   sliderWidth={ancho}
  //                   itemWidth={ancho}
  //                   //horizontal={true}
  //                   renderItem={({ item, index }) => _renderChapter(item, index)}
  //                   index={initialIndex}
  //                   style={{ }}
  //                   firstItem={initialIndex}
  //                   showPagination={false}
  //                   onBeforeSnapToItem={(index) => onSwipeChapter(index)}
  //                   //decelerationRate={0}

  //                   snapToAlignment={"center"}

  //                    onStartShouldSetPanResponder={() => showHeader(!visibleHeader)}
  //                   bounces={true}

  //                   slideStyle={{ width: ancho }}

  //                     renderToHardwareTextureAndroid
  //                     decelerationRate={'fast'}
  //                     snapOnAndroid

  //                     animationOptions={{
  //                       isInteraction: false,
  //                       useNativeDriver: true,
  //                     }}

  //                     removeClippedSubviews={false}

  //                     apparitionDelay={1}

  //                     maxToRenderPerBatch={3}


  //                     activeSlideAlignment="center"

  //                     //initialNumToRender={chapters.length}

  //                     //windowSize={4}
  //                     useNativeDriver={true}

  //                     inactiveSlideScale={0.9}
  //                     inactiveSlideOpacity={0.9}
  //                   //updateCellsBatchingPeriod={1000}
  //                   //onMomentumScrollEnd={this.onSwipeChapter}
  //                 />
  //     </ViewPager>
  //     <Drawer ref={ref => this.drawer = ref}>
  //               {this.renderContent()}
  //           </Drawer>
  //   </View>
  //   )


 class ReaderScreensss extends PureComponent<Props>{
      static contextType = DarkModeContext;
      static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        //let pageNumber = navigation.getParam('currentPageNumber', '0');
       // console.log("params reader!", params)
        return {
          title: navigation.getParam('currentDocTitle', 'Reading...'),
          //headerRight: (<PageNumber pageNumber={navigation.getParam('currentPageNumber', '0')}/>),

          headerShown: false,

          //Default Title of ActionBar
            //Background color of ActionBar
            
          
          //Text color of ActionBar
        };
      };
    constructor (props) {
        super(props);

        
        
        //console.log("THEME OF READER", props.screenProps.rootUser.readingTheme)
        this.state = {
          currentReading: props.navigation.state.params.currentReading || null,
          currentUser: null,
          allChapters: props.navigation.state.params.allChapters || null,
          index: 0,
          isLoading: true,
          isOpen: false,
          search: null,
          searchResults: null,
          initialModalType: 1,
          indexChapter: props.navigation.state.params.indexChapter || (props.navigation.state.params.currentReading.count_chapters >= props.navigation.state.params.currentReading.progress && props.navigation.state.params.currentReading.progress) || 0,
          fontSize: 0,
          readingTheme: props.screenProps.rootUser.readingTheme || this.context,

          headerVisible: true
        };

        this.indexChapter = props.navigation.state.params.indexChapter || 0;

        this.scrollPosition = (props.navigation.state.params.currentReading.indexChapter == props.navigation.state.params.currentReading.progress ? props.navigation.state.params.currentReading.scrollPosition : 0) || 0;
        //this.scrollPosition = props.navigation.state.params.currentReading.scrollPosition;
        this.headerTools = null;
       /* this.props.navigation.setParams({
          Title: doc.data.title,
          Location: this.state.location
        });

        this.streamer = new Streamer();*/



    }



    componentDidMount() {
       


       let { allChapters, currentReading, index, indexChapter } = this.props.navigation.state.params;

       if(currentReading != null){
        
         // this.props.navigation.setParams({ currentDocTitle: currentReading.title });
       }

      // console.log("all chapters", allChapters, currentReading)
       //console.log("[Reader parsed]", allChapters,currentReading,currentUser)
       
       /*
       if(this.state.allChapters == null){
        let theFirst = {
          title: currentReading.title,
          type: 'firstPage'
         };

         allChapters.unshift(theFirst)
       }
        
       */
       
       let pr = 0;
       if(this.props.navigation.state.params.currentReading.progress <= this.props.navigation.state.params.currentReading.count_chapters){
        if(this.props.navigation.state.params.currentReading.progress > this.props.navigation.state.params.allChapters.length - 1){
          pr = this.props.navigation.state.params.allChapters.length - 1;
        } else {
          pr = this.props.navigation.state.params.currentReading.progress;
        }

       }


       //console.log("inddx chapter!", indexChapter, pr, this.props.navigation.state.params.allChapters)

       this.setState({
          currentReading: currentReading,
          allChapters: allChapters,
          indexChapter: typeof indexChapter !== 'undefined' ? indexChapter : pr ? pr : 0,
          isLoading: false
       })

       if(this.props.screenProps.RemoteCloud && this.props.screenProps.rootUser && this.props.screenProps.rootUser.autoSync == true){
        RnBgTask.runInBackground(async()=>{
       this.onChanges = this.props.screenProps.RemoteCloud.ApplicationChapters.changes({live: true, since: 'now', include_docs: true})
                  .on('change', (change) => {
                  //console.log("[NavapTrough] ON CHANNGE!", change)
                  this.onUpdatedOrInserted(change.doc)
                }).on('error', __DEV__ && console.log.bind(console))
                });

        //console.log("CURRENT BOOK CHAPTERS", this.state)

      }

      if(this.props.screenProps.rootUser && this.props.screenProps.rootUser.autoSync == true){
        this.props.screenProps.onReplicateChapters(this.state.currentReading._id);
      }

      // console.log("index of!", this.index)


      /* allChapters.map(chapter => {
        if(chapter.content.replace(/<[^>]*>?/gm, '') == ''){
          console.log("chapter here!", chapter.content)
        }
        
       })
*/
      // console.log("current readig", this.state, index)
       
       

    }

    onUpdatedOrInserted = (newDoc) => {


      if(typeof this.state.allChapters === 'undefined' || this.state.allChapters == null){
            return;
          }
          var index = _.findIndex(this.state.allChapters, ['_id', newDoc._id]);
          //console.log("[CHAPTERS] UPDATE OR INSERT", newDoc, index, this.state.chapters)
          var chapter = this.state.allChapters[index];
          if(newDoc && newDoc._id.includes("_design")){
            return;
          }
          
          if (chapter && chapter._id === newDoc._id) { // update
            if(newDoc._deleted){
            this.setState((prevState) => update(prevState, { 
                      allChapters: { 
                        $splice: [[index, 1]]
                         }
                       }));
            return;
          } else {
            this.setState((prevState) => update(prevState, { 
                    allChapters: { 
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
                    allChapters: { 
                       $push: [newDoc]
                       }
                 }));
          }
          }

    }


    componentWillUnmount() {


     // console.log("will unmount reader!", this)

      if(this.state.currentReading && this.indexChapter){
        if(!this.state.currentReading.progress){
          this.state.currentReading.progress = 0;
        }
        if(this.indexChapter > this.state.currentReading.progress){
          this.setProgress();

        }
      }

      this.props.screenProps.cancelChaptersSync();
       if(this.onChanges){
        this.onChanges.cancel();
      }
      
      
     /* APILocal.upsert(this.state._id, doc => {
                      
                        doc.percentage = this.state.visibleLocation.start.percentage;
                        doc.last_page = this.state.visibleLocation.start.location;
                        doc.last_cfi = this.state.visibleLocation.start.cfi;
                        doc.offline = true;
                      return doc;
                    }).then((res) => {
                      //console.log("onLocationsReady", res)
                    }).catch((err) => {

                    });
        this.streamer.kill();*/
    }

    setProgress = async() => {

      let sP = await(this.props.screenProps.RemoteCloud.Auth().setProgressBok(this.state.currentReading, this.indexChapter, this.scrollPosition))

      let { index, docScreenUpdateStates } = this.props.navigation.state.params;
      if(docScreenUpdateStates){
        docScreenUpdateStates(this.state.currentReading, this.indexChapter)
      }
      
          

         // allDocs[index].progress = this.state.index;
      
    }
    _renderItem = ({item}) => {
      //console.log("render item", item)
      return (
        <View style={{justifyContent:'center', flex:1}}>
          <SafeAreaView style={{paddingTop: getHeaderHeight() - 20}}>
            <Text style={{color: '#fff'}}>Hola</Text>
          </SafeAreaView>
        </View>
        )
          /*return (<TouchableWithoutFeedback onPress={Keyboard.dismiss} > 
            <CNEditor                   
                          ref={input => this.editor = input}
                          //onSelectedTagChanged={this.onSelectedTagChanged}
                          //onSelectedStyleChanged={this.onSelectedStyleChanged}
                          style={{backgroundColor: '#fff',flex: 1,padding: 20}}
                          style
                          List={this.customStyles}
                          initialHtml={item.content}
                          onValueChanged={this.onValueChanged}
                          withSafeArea={true}
                          placeholder={'Enter text here'}
                          foreColor='dimgray' // optional (will override default fore-color)
                        />  
            </TouchableWithoutFeedback>);
*/
      };


    finishLoad = () => {
     // console.log("o nfinish load!", this.state)
      if(this.state.isLoading == true){
        setTimeout(() => {
          this.setState({
            isLoading: false
          })
        }, 1000);
      }

      return;
      
    }

    backToDetails = () => {

      this.props.screenProps.cancelChaptersSync();
      this.props.navigation.goBack();
    }

    _renderCover = () => {
      if(this.state.currentReading.cover){
        return (
            <View style={styles.slide}>
                


                {
                  FastImage ? (
                    <FastImage 
                      source={{ uri: encodeURI(this.state.currentReading.cover) }}
                      style={[styles.image,{height: 390, width: 260, marginLeft: 5, marginTop: 0, borderRadius: 12,shadowColor: "#000",
                                            backgroundColor: this.state.currentReading.colors ? this.state.currentReading.colors[1] : '#000',
                                            shadowOffset: {
                                              width: 0,
                                              height: 10,
                                            },
                                            shadowOpacity: 0.53,
                                            shadowRadius: 13.97,
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            elevation: 21}]}
                      resizeMode={FastImage.resizeMode.cover}
                      >
                      </FastImage>
                      
                  ) : (
                      <Image style={styles.image} source={{uri: encodeURI(this.state.currentReading.cover)}}/>
                  )
                }

            </View>
        );
      } else {

         <View style={styles.slide}>
          <View style={[styles.image,{height: 390, width: 260, marginLeft: 5, marginTop: 0, borderRadius: 12,shadowColor: "#000",
                                            backgroundColor: this.state.currentReading.colors ? this.state.currentReading.colors[1] : '#000',
                                            shadowOffset: {
                                              width: 0,
                                              height: 10,
                                            },
                                            shadowOpacity: 0.53,
                                            shadowRadius: 13.97,
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            elevation: 21}]}>

          </View>
         </View>
      }
      
        
    }

    onScroll = (position) => {
      //__DEV__ && console.log("on sccroll!", position)
      this.scrollPosition = position;

      /*this.setState({
        scrollPosition: position
      })*/
    }
    renderWys = (key) => {

        return (
        <View style={{width: '100%', maxWidth: '100%', minHeight: '100%'}}>

                  <Wysiwyg

                         ref={input => this.editor = input}
                          style={styles.richEditor}
                          initialBlocks={key.native_content}
                          title={key.title}
                          header={key.header}
                          key={(item.itemIndex+""+sequence).toString()}
                          //saveTitle={(title) => this.saveTitle(title)}
                          //onValueChanged={this.onValueChanged}
                          //askPermissions={() => this.props.askPermissions()}
                          //uploadImage={(params) => this.props.uploadImage(params)}
                          //addHeader={(params) => this.addHeader(params)}
                          //addLink={(params) => this.props.addLink(params)}
                          //fontSize={20}
                          editMode={false}
                          readingTheme={this.state.readingTheme}
                          placeholder={'Enter text here'}
                          contentEditable={true}
                          textAlign={this.state.textAlign}
                          // onScroll={Animated.event(
                          //     [
                          //       {
                          //         nativeEvent: { contentOffset: { y: this.scrollAnimatedValue } },
                          //       },
                          //     ],
                          //     {
                          //       listener: this.handleScroll
                          //     }
                          //   )}




                                //onScroll={this.onScroll}
                                fontSize={((Platform.OS == 'ios' ? 24 : 21) +(this.state.fontSize))} // optional (will override default fore-color)
                              />
                 </View>  
                 );
     
    }

    snapToIndex = (index) => {
      this.readium.snapToItem(index, false, null)
    }
    renderChapter = (key, index) => {

      

      if(key.type != 'firstPage'){
        //console.log("render chapter!!", key.title, (key.content.replace(/<[^>]*>?/gm, '').trim().length > 0 || (key.content.indexOf('<img src="') > -1 || key.content.indexOf('<img src="') != false)))
        const colorTheme = this.state.readingTheme == 'light' ? '#f7f7f7' : (this.state.readingTheme == 'dark' ? '#111' : '#999');
        const contenido = '<style>.chapter-title { text-align: center; border-bottom: 1px solid '+colorTheme+'; font-family: "Telefon Black";}</style><h1 class="chapter-title">'+key.title+'</h1><br>'+key.content;
        //console.log("render chapter!", (key.content.indexOf('<img src="') == -1 || key.content.indexOf('<img src="') == false), key.content.replace(/<[^>]*>?/gm, '').trim().length == 0);
        /*
          <Scalable activeScale={1} style={{flex: 1}}>
          </Scalable>
        */
        return (
          
          <View 
                    directionalLockEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    disableScrollViewPanResponder={true} key={key.position+'/'+key.title} 
                    style={{ zIndex: 99, flex: 1, width: Dimensions.get('window').width, borderLeftWidth: 0, backgroundColor: this.state.readingTheme == 'light' ? '#f7f8fa' : (this.state.readingTheme == 'dark' ? '#232225' : '#e7d7bc'),  }}>
            
            
            <View style={{margin: 0, justifyContent: 'center', width: '100%'}}>
        { 
          //(key.native_content.length > 0 || (key.native_content.indexOf('<img src="') > -1 || key.content.indexOf('<img src="') != false)) &&
                 this.renderWys(key)
                
                }
                {
                  /* (key.content.replace(/<[^>]*>?/gm, '').trim().length == 0 && (key.content.indexOf('<img src="') == -1 || key.content.indexOf('<img src="') == false)) &&
                  <View style={{flex: 0,marginTop: -30, position: 'absolute', width: '50%', marginTop: 0, margin: -9,justifyContent: 'flex-start', alignSelf: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 22, color: '#444'}}>{Languages.noContentInChapter[getLang()]}</Text>
                    {this.state.allChapters.length > index &&
                      <Text style={{textAlign: 'center', fontSize: 22, marginTop: 10, color: '#222'}}>{Languages.howeverKeep[getLang()]}</Text>
                    }
                  </View>*/
                 }
            </View>

          </View>
          
          )
      } else {
        if(key.type && key.type == 'firstPage'){
          return (
           <View key={key.position+'/'+key.title} 
                style={{ justifyContent: 'center', flex: 1, width: Dimensions.get('window').width, backgroundColor: '#222'}}>
            <LinearGradient
                      colors={this.state.currentReading.colors ? [this.state.currentReading.colors[0], this.state.currentReading.colors[1], '#222'] : ['#fff', '#fff', '#fff']}
                      style={{width: '100%', height: '100%', position: 'absolute'}}
                      //  Linear Gradient 
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}

                      // Linear Gradient Reversed
                      // start={{ x: 0, y: 1 }}
                      // end={{ x: 1, y: 0 }}

                      // Horizontal Gradient
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 1, y: 0 }}

                      // Diagonal Gradient
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 1, y: 1 }}
                    />
            { this._renderCover() }
            <TouchableOpacity onPress={() => this.snapToIndex(1)} style={{flexDirection: 'row', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.4)', width: '100%', height: 60, justifyContent: 'center', position: 'absolute', bottom: 0}}>
              <Text style={{color: '#fff', textAlign: 'center', fontSize: 19, marginTop: 17}}>
                {Languages.slideToRead[getLang()]}
              </Text>
              <AntDesign
                                  name="rightcircleo"
                                  size={25}
                                  style={{textAlign: 'center', marginLeft: 10, alignSelf: 'center'}}
                                  color={'white'}
                                />

            </TouchableOpacity>
           </View>
          );
        } 

      }

        
      
      
    }
    renderAllChapters = () => {

      //console.log("render all chaptters!!",this.state.allChapters, this.state.index)

      if(this.state.allChapters != null && this.state.indexChapter != null){
        return (
          this.state.allChapters.map((key, i) => {


      

       // console.log("first index render", this.state.firstIndex, chapterIndex)
                              //console.log("Books map", key, i)
                              return (
                                <View key={i + Date.now()} style={{ width: Dimensions.get('window').width, height:Dimensions.get('window').height}}>
                                  
                                   { this.renderChapter(key) }
                                 
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

    _changePagination = (index, total, context) => {
      //console.log("CHANGE PAGINATION", index, total, context)
    }


    getCurrentPage = () => {

     // console.log("get currentpage!", this.state.index)
      return this.state.indexChapter;
    }
    onSwipeChapter = (index) => {

      //console.log("on swiper chapter", index)
      this.indexChapter = index;

      this.setState({
        scrollPosition: 0
      })
      this.scrollPosition = 0;
       // console.log("on swipe chapter index!", index, this.readium.getCurrentIndex())
        //this.headerTools.onSwipe(this.state.allChapters[index.index])
        //console.log("this. index!", this.readi)
      //this.props.navigation.setParams({ currentPageNumber: index.index });

    //  return this.setState({index: index.index});

    }

    showTools = () => {

      //this.headerTools.getIfVisible()
      if(this.headerTools.getIfVisible() == false){

        this.headerTools.toggleVisibility()
      }
      
      
      
    }


    onOpenSetting = (item) => {
     // console.log("item!", item)
      let n;
      switch(item){
        case 'toc':
          n = 0;
        break;
        case 'settings':
          n = 2;
        break;
        case 'search':
          n = 1;
        break;
        case 'info':
          n = 3;
        break;
        default:
          n = 0;
        break;
      }

     // console.log("item nnumber initial", n)
      this.setState({
        isOpen: true,
        modalType: item,
        initialModalType: n
      })


    }


    showToolsHeader = () => {
     // console.log("show tools func", this.props, this.state)
      let { allChapters, currentReading, index } = this.props.navigation.state.params;
      //console.log("this chapp show tools", allChapters)
      return (
        <HeaderTools 
          //percetageOfBar={this.state.scrollPosition} 
          currentBook={this.state.currentReading || currentReading} 
          openSettings={(item) => this.onOpenSetting(item)} 
          onGoBack={() => this.backToDetails()} 
          style={{flex: 1, backgroundColor: '#red', width: '100%',position: 'absolute', top: 0}} 
          ref={e => (this.headerTools = e)} 
          visible={true}
          currentTheme={this.state.readingTheme}
          />
          );
    }

    showToolsHeaderAndroid = () => {
     // console.log("show tools func", this.props, this.state)
      let { allChapters, currentReading, index } = this.props.navigation.state.params;
      //console.log("this chapp show tools", allChapters)
      return (
        <HeaderTools 
          //percetageOfBar={this.state.scrollPosition} 
          currentBook={this.state.currentReading || currentReading} 
          openSettings={(item) => this.onOpenSetting(item)} 
          onGoBack={() => this.backToDetails()} 
          style={{backgroundColor: 'transparent', width: '100%',height: 50, paddingTop: 0, position: 'absolute', top:0}} 
          ref={e => (this.headerTools = e)} 
          visible={true}
          currentTheme={this.state.readingTheme}
          />
        );
    }

    _renderChapterToc = (chapter, index) => {
     // console.log("Book render chapter", book, chapter, index)
      return (
        <TouchableOpacity onPress={() => this.goToChapter(index)} style={{width: '100%', height: 55, backgroundColor: 'rgba(0,0,0,.4)', marginBottom: 3, padding: 15}}>

                            
                              <View style={{height:60, justifyContent: 'flex-start', flex:1, flexDirection:'row', marginTop: 2}}>
                                 <View style={{width: 20, height: 20, borderRadius:50}}>

                                    <Text style={{color: '#fff', margin: 1, marginLeft: 5, fontSize: 11, marginTop:4, fontWeight:'700',marginLeft: 6}}>{index}</Text>
                                 </View>

                                 <Text style={{color: '#fff', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>{chapter.title}</Text>
                              </View>

        </TouchableOpacity>
        )
    }

    goToChapter = (index) => {

       console.log("go to state!", index)
      //this.forceUpdate()
      
      this.indexChapter = index;
      this.scrollPosition = 0;

      this.snapToIndex(index);
      this.setState({ indexChapter: index, isOpen: false})

      this.forceUpdate();

      return;
    }
    renderToc = () => {
      return (
        <View style={{flex: 1}}>
           <Text
             style={[globalStyles.sectionHeaderText, {color: isDarkMode == true ? '#fff' : '#000'}]}>
                {Languages.tableOfContents[getLang()].toUpperCase()}
            </Text>
            <SettingsDividerLong />

                     <FlatList
                         data={this.state.allChapters}
                         //horizontal={true}
                         style={{}}
                         renderItem={({ item, index }) => this._renderChapter(item, index)}
                         keyExtractor={(item, index) => index +'-'+item._id}
                      />

           </View>
        )
    }

    updateSearch = search => {
      //console.log("update search!", search)
      this.setState({ search: search });


    };
    searchSubmit = () => {
      //console.log("search submit!", this.state.search, this.state.allChapters)

      if(!this.state.search){
        return;
      }
      let results = [];
      
      this.state.allChapters.map((chapter,index) => {

        if(chapter.native_content){
          let blocks = chapter.native_content.blocks || [];
          if(blocks.length > 0){
            //console.log("blocvkshere!", blocks)
            for (var i = blocks.length - 1; i >= 0; i--) {
              //console.log("blocvkshereiiiii!", blocks[i])
              if(blocks[i] && blocks[i].type == 'paragraph'){
                if(blocks[i].data && blocks[i].data.text && blocks[i].data.text.indexOf(this.state.search) !== -1){

                  results.push({
                    _id: chapter._id,
                    indexChapter: index,
                    indexBlock: i,
                    text: blocks[i].data.text 
                  })
                }
              }
            }
          }
          //console.log("chapter search!", chapter.native_content)
          // let cleanChapter = chapter.native_content.replace(/<[^>]*>?/gm, '');

          // let searched = cleanChapter.toLowerCase().split(this.state.search.toLowerCase())[1];

          // if(searched != null){
          //   results.push({ _id: chapter._id, title: chapter.title, index: chapter.position, hightlight: searched })
          // }
        
        }
        
        //console.log("CHAPTER!", chapter, cleanChapter)
        
      })

      this.setState({
        searchResults: results
      })
      //console.log("RESULTS SEARCH!", results)
    }

    goToChapterById = async(id) => {


      let indexOf = _.findIndex(this.state.allChapters, ['_id', id]);



      this.scrollPosition = 0;
      this.setState({isOpen: false, indexChapter: indexOf});
      this.snapToIndex(indexOf);
      //this.headerTools.onSwipe(this.state.allChapters[index.index]);
      
      this.indexChapter = indexOf;
      return;
    }
    renderSearchKey = (result, index) => {

      return (
        <TouchableRipple key={index.toString()} style={{width: '100%'}} onPress={() => this.goToChapterById(result._id)}>
          
          <Row size={12} style={{backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.3)', borderRadius: 10, margin: 5}}>
              <Col sm={12} md={12} lg={12} style={{padding: 10}}>
                <View style={{marginBottom: 5}}>
                  <Text style={{fontSize: 17, fontWeight: '700'}}>
                   CHAPTER {result.indexChapter} - BLOQUE {result.indexBlock}
                  </Text>
                </View>
                <Text numberOfLines={4} style={{fontSize: 15}}>
                  <Text style={{fontWeight: '700', padding: 10, backgroundColor: '#fff', color: '#000', borderRadius: 8, marginRight: 3}}>{this.state.search}</Text>
                  {result.text} 
                </Text>

                
              </Col>
          </Row>
        </TouchableRipple>
        )
    }
    renderSearch = () => {
      return (
        <KeyboardAwareFlatList
              data={this.state.searchResults}

                   ref={(ref) => { this._wysiwyg = ref; }}
                   innerRef={ref => {
                      this.scroll = ref;
                    }}
                   initialNumToRender={7}
                   enableAutomaticScroll={true}
                   maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={500}
                   //listKey={(item, index) => 'D' + shortid.generate()}
                   

                   ListHeaderComponent={<SearchBar
                      placeholder={Languages.searchContent[getLang()]}
                      //clearButtonMode="while-editing"
                      platform="android"
                      cancelButtonTitle="Cancel"
                      style={{}}
                      autoCorrect={false}
                      returnKeyType='search'
                      autoFocus={false}
                      onSubmitEditing={this.searchSubmit}
                      inputStyle={{backgroundColor: 'transparent', height:40, width: '100%'}}
                      containerStyle={{height: 40, backgroundColor: 'transparent', borderWidth: 0, margin:0, padding:0, borderRadius: 5}}
                      placeholderTextColor={'#666'}
                      onChangeText={this.updateSearch}
                      value={this.state.search}
                    />}
                   //getItemLayout={(data, index) => ({ length: this.state.initial.blocks.length, index })}
                    contentContainerStyle={{ paddingBottom: 0}}
                    keyboardShouldPersistTaps="handled"
                    // contentInset={{left: 0, right: 0}}
                    //contentInsetAdjustmentBehavior="automatic"
                   style={styles.scrollViewBooks}
                   //onScroll={this.props.onScroll}
                   // innerRef={ref => {
                   //    this.scroll = ref;
                   //  }}  
                   renderItem={({ item, index }) => this.renderSearchKey(item, index)}
                         keyExtractor={(item, index) => index +'-'+item._id}
                /> 

        

        )
    }

    renderSettings = () => {
      return (
        <View style={{width: '100%', height: '100%'}}>
         
           <Text
             style={[globalStyles.sectionHeaderText, {color: isDarkMode == true ? '#fff' : '#000'}]}>
                {Languages.view[getLang()].toUpperCase()}
            </Text>
            <SettingsDividerLong />
           
            <Row size={12} style={{height: 60}}>
              <Col sm={4} md={4} lg={4} style={{paddingTop: 17}}>
                <Text style={{fontSize:18, marginLeft: 15,fontWeight: '500'}}>{Languages.fontSize[getLang()]}</Text>
              </Col>
              <Col sm={8} md={8} lg={8} style={{}}>


              <View style={{flex: 1, flexWrap: 'nowrap', padding: 10, flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',}}>

                <TouchableOpacity onPress={() => this.setState((prevState) => update(prevState, { fontSize: { $set: this.state.fontSize - 1 }}))} style={{height: 40, width: '31%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', backgroundColor: '#f4f4f0'}}>
                  <Icon name="format-font-size-decrease" size={26} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                </TouchableOpacity>
                {/*<TouchableOpacity style={{height: 40, width: '31%', borderRadius: 0, justifyContent: 'center', backgroundColor: '#222'}}>
                  <Text style={{color: '#fff', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>{this.state.fontSize}</Text>
                </TouchableOpacity>*/}
                <TouchableOpacity onPress={() => this.setState((prevState) => update(prevState, { fontSize: { $set: this.state.fontSize + 1 }}))} style={{height: 40, width: '31%', borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', backgroundColor: '#f4f4f0'}}>
                  <Icon name="format-font-size-increase" size={26} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                </TouchableOpacity>

                </View>

                

                
              </Col>


            </Row>


            <Row size={12} style={{height: 70}}>
              <Col sm={4} md={4} lg={4} style={{paddingTop: 25}}>
                <Text style={{fontSize:18, marginLeft: 15,  fontWeight: '500', marginTop: 1}}>{Languages.mode[getLang()]}</Text>
              </Col>
              <Col sm={8} md={8} lg={8} style={{}}>
              <View style={{flex: 1, flexWrap: 'nowrap', padding: 10, flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',}}>
                <TouchableOpacity onPress={() => this.changeTheme('light')} style={{height: 40, width: '31%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', backgroundColor: '#f7f8fa'}}>
                  <Text style={{color: '#89888b', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeTheme('sepia')} style={{height: 40, width: '31%', borderRadius: 0, justifyContent: 'center', backgroundColor: '#e7d7bc'}}>
                  <Text style={{color: '#645339', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeTheme('dark')} style={{height: 40, width: '31%', borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', backgroundColor: '#232225'}}>
                  <Text style={{color: '#49484b', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>A</Text>
                </TouchableOpacity>

                </View>

                
                
              </Col>

            </Row>

            <Row size={12} style={{height: 70}}>
              <Col sm={4} md={4} lg={4} style={{paddingTop: 25}}>
                <Text style={{fontSize:18, marginLeft: 15,  fontWeight: '500', marginTop: 1}}>{Languages.align[getLang()]}</Text>
              </Col>
              <Col sm={8} md={8} lg={8} style={{}}>
              <View style={{flex: 1, flexWrap: 'nowrap', padding: 10, flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',}}>
                <TouchableOpacity onPress={() => this.setState((prevState) => update(prevState, { textAlign: { $set: 'left' }}))} style={{height: 40, width: '31%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', backgroundColor: '#f4f4f0'}}>
                  <Icon name="format-align-left" size={26} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                </TouchableOpacity>
                {/*<TouchableOpacity style={{height: 40, width: '31%', borderRadius: 0, justifyContent: 'center', backgroundColor: '#222'}}>
                  <Text style={{color: '#fff', fontSize: 22,  textAlign: 'center', fontWeight: '700'}}>{this.state.fontSize}</Text>
                </TouchableOpacity>*/}
                <TouchableOpacity onPress={() => this.setState((prevState) => update(prevState, { textAlign: { $set: 'justify' }}))} style={{height: 40, width: '31%', borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', backgroundColor: '#f4f4f0'}}>
                  <Icon name="format-align-justify" size={26} style={{marginTop: 2, textAlign: 'center', color: 'rgba(0,0,0,.9)'}}/>
                </TouchableOpacity>

                </View>

                
                
              </Col>

            </Row>
           
        </View>
        )
    }

    changeTheme = async(theme) => {
      this.setState((prevState) => update(prevState, { readingTheme: { $set: theme }}))

      let sP = await(this.props.screenProps.RemoteCloud.Auth().setReadingTheme(theme))

      this.props.screenProps.updateUser();
      //this.forceUpdate()
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
      <Progress.Pie color={'#2cbb2c'} progress={book.progress ? parseFloat(p) : 0} size={100} style={{marginTop: -6, alignSelf: 'center'}}/>
      )
   }

    renderInfo = () => {

      const progress = (this.state.currentReading.progress / this.state.allChapters.length) * 100;

      return (
        <View style={{width: '100%', height: '100%'}}>
         <Text
           style={[globalStyles.sectionHeaderText, {color: isDarkMode == true ? '#fff' : '#000'}]}>
              {Languages.youAnd[getLang()].toUpperCase()} {this.state.currentReading.title.toUpperCase()}
          </Text>
          <SettingsDividerLong />

          <Row size={12} style={{height: 70}}>
              <Col sm={12} md={12} lg={12} style={{paddingTop: 15,}}>

               {this._renderProgress(this.state.currentReading)}
              </Col>
          </Row>




                    
        </View>
        )
    }

    onSwitchTypeModal = (to) => {


      if(this.state.modalType == to){
        return;
      }

      let t = null;
      switch(to){
        case 'toc':
          t = 'toc';
        break;
        case 'search':
          t = 'search';
        break;
        case 'settings':
          t = 'settings';
        break;
        case 'info':
          t = 'info';
        break;
        default:
          t = 'toc';
        break;
      }

      if(t != null){
          this.setState((prevState) => update(prevState, { 
                      modalType: { 
                        $set: t
                      }
                  }));
        }
    }


    toggleVisibleHeader = () => {
      console.log("toggle visible")
      this.setState((prevState) => update(prevState, { 
                    headerVisible: { 
                            $set: true
                         }
                       }));
    }
    render(){
       
      if(Platform.OS == 'ios'){

        //<TouchableWithoutFeedback onPress={() => this.toggleVisibleHeader()}>
        return(

              <View style={[styles.container, {flex:1, backgroundColor: this.state.readingTheme == 'light' ? '#f7f8fa' : (this.state.readingTheme == 'dark' ? '#232225' : '#e7d7bc')}]}>
                
                {this.state.allChapters == null && this.state.currentReading == null && 
                  <View style={{flex:1, justifyContent:'center', backgroundColor: '#111'}}>
                    <Spinner style={{alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={"#fff"}/>
                  </View>
                }



                  <Carousel
                    ref={(ref) => this.readium = ref}
                    data={this.state.allChapters}
                    sliderWidth={ancho}
                      itemWidth={ancho}
                    renderItem={({ item, index }) => this.renderChapter(item, index)}
                    index={this.state.indexChapter}
                    style={{ backgroundColor: this.state.readingTheme == 'light' ? '#f7f8fa' : (this.state.readingTheme == 'dark' ? '#232225' : '#e7d7bc')}}
                    firstItem={this.state.indexChapter}
                    showPagination={false}
                    onBeforeSnapToItem={(index) => this.onSwipeChapter(index)}
                    //decelerationRate={0}

                    snapToAlignment={"center"}

                     onStartShouldSetPanResponder={() => true}
                    bounces={true}

                    slideStyle={{ width: ancho }}

                      renderToHardwareTextureAndroid
                      decelerationRate={'fast'}
                      snapOnAndroid

                      animationOptions={{
                        isInteraction: false,
                        useNativeDriver: true,
                      }}

                      removeClippedSubviews={false}

                      apparitionDelay={1}

                      maxToRenderPerBatch={3}


                      activeSlideAlignment="center"

                      initialNumToRender={this.state.allChapters.length}

                      //windowSize={4}
                      useNativeDriver={true}

                      inactiveSlideScale={0.9}
                      inactiveSlideOpacity={0.9}
                    //updateCellsBatchingPeriod={1000}
                    //onMomentumScrollEnd={this.onSwipeChapter}
                  />



                {
                      this.showToolsHeader()
                    }

                <Modal 
                  style={[styles.sessionContainer, {width:ancho, marginLeft: 0,paddingTop:0, marginTop:getHeaderHeight()}]}
                  isVisible={this.state.isOpen}
                  animationIn={'fadeIn'}
                  animationOut={'fadeOut'}
                  hasBackdrop={false}
                 // avoidKeyboard={true}
                 //propagateSwipe={false}
                  deviceWidth={deviceWidth}
                  onSwipeComplete={() => this.setState({ isOpen: false })}
                  swipeDirection="down"
                  swipeThreshold={10}
                  deviceHeight={deviceHeight}
                  //propagateSwipe
                  >
                    <View flexGrow={1} style={{zIndex: 1, width:ancho, height: alto }}>
                       <View style={{
                                width: 40,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)',
                                marginBottom: 10,
                                position: 'absolute', alignSelf: 'center', marginTop: 2, top: 5
                              }}></View>
                       <Row size={12} style={{zIndex: 99, paddingTop: 15, marginBottom: 15}}>
                          <Col sm={10} md={11} lg={10} style={{padding: 10}}>
                            <SwitchSelector
                              initial={this.state.initialModalType}
                              onPress={value => this.onSwitchTypeModal(value)}
                              textColor={globalColors.lightDark} //'#7a44cf'
                              selectedColor={globalColors.white}
                              buttonColor={globalColors.lightDark}
                              borderColor={globalColors.lightWhiteBorder}
                              backgroundColor={isDarkMode == true ? globalColors.lightWhite : 'rgba(0,0,0,.1)'}
                              activeColor={globalColors.black}
                              borderRadius={10}
                              disabled={false}
                              hasPadding
                              options={[
                                { label: "", value: "toc", customIcon: <Ionicons name="ios-albums" size={20}/> }, 
                                { label: "", value: "search", customIcon: <Ionicons name="ios-search" size={20}/> }, 
                                { label: "", value: "settings", customIcon: <EntypoIcono name="adjust" size={20}/> },
                                //{ label: "", value: "info", customIcon: <EntypoIcono name="hour-glass" size={20} style={{color: 'rgba(255,255,255,.4)'}}/> } //images.masculino = require('./path_to/assets/img/masculino.png')
                              ]}
                            />
                          </Col>
                          <Col sm={2} md={1} lg={2} style={{paddingTop: 15, paddingRight: 0}}>
                            <TouchableHighlight onPress={() => this.setState({isOpen: false})} style={{justifyContent: 'center', alignSelf: 'center', width: '100%', borderRadius: 8}}>
                              <AntDesign
                                  name="down"
                                  size={25}
                                  style={{textAlign: 'center', paddingTop: 2, paddingLeft: 14, alignSelf: 'flex-start'}}
                                  color={this.contetxt == 'dark' ? '#fff' : '#000'}
                                />
                             </TouchableHighlight>
                          </Col> 


                           
                             

                      </Row>
                      <View style={{marginTop:20}}>
                         {this.state.modalType == 'toc' && this.renderToc()}
                              {this.state.modalType == 'search' && this.renderSearch()}
                              {this.state.modalType == 'settings' && this.renderSettings()}
                              {this.state.modalType == 'info' && this.renderInfo()}
                      </View>
                    </View>
                
                  
                </Modal>
              </View>
        );
      } else {
          return(
              <View style={[styles.container, {backgroundColor: this.state.readingTheme == 'light' ? '#f7f8fa' : (this.state.readingTheme == 'dark' ? '#232225' : '#e7d7bc')}]}>
                
                

                {this.state.allChapters == null && this.state.currentReading == null && 
                  <View style={{flex:1, justifyContent:'center', backgroundColor: '#111'}}>
                    <Spinner style={{alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={"#fff"}/>
                  </View>
                }



                {this.state.allChapters != null && this.state.currentReading != null && 

                   
                  <Carousel
                    ref={(ref) => this.readium = ref}
                    data={this.state.allChapters}
                    renderItem={({ item, index }) => this.renderChapter(item, index)}
                    index={this.state.indexChapter}
                    sliderWidth={ancho}
                      itemWidth={ancho}
                    style={{ backgroundColor: this.state.readingTheme == 'light' ? '#f7f8fa' : (this.state.readingTheme == 'dark' ? '#232225' : '#e7d7bc')}}
                    firstItem={this.state.indexChapter}
                    showPagination={false}
                    onBeforeSnapToItem={(index) => this.onSwipeChapter(index)}
                    //decelerationRate={0}

                    snapToAlignment={"center"}


                    bounces={true}

                    slideStyle={{ width: ancho }}

                      renderToHardwareTextureAndroid
                      decelerationRate={'fast'}
                      snapOnAndroid

                      animationOptions={{
                        isInteraction: false,
                        useNativeDriver: true,
                      }}

                      removeClippedSubviews={false}

                      apparitionDelay={1}

                      maxToRenderPerBatch={3}


                      activeSlideAlignment="center"

                      initialNumToRender={3}

                      //windowSize={4}
                      useNativeDriver={true}

                      inactiveSlideScale={0.9}
                      inactiveSlideOpacity={0.9}
                    //initialNumToRender={3}
                    //maxToRenderPerBatch={3}
                    //updateCellsBatchingPeriod={1000}
                    //onMomentumScrollEnd={this.onSwipeChapter}
                  />


                    

                   
                }

                
                {
                      this.showToolsHeaderAndroid()
                    }
                <Modal 
                  style={[styles.sessionContainer, { width:ancho, zIndex:1,marginLeft: 0, bottom:-10}]}
                  isVisible={this.state.isOpen}
                  animationIn={'fadeIn'}
                  animationOut={'fadeOut'}
                  hasBackdrop={false}

                  deviceWidth={deviceWidth}
                  onSwipeComplete={() => this.setState({ isOpen: false })}
                  swipeDirection="down"
                  // avoidKeyboard={true}
                  swipeThreshold={10}
                  deviceHeight={deviceHeight}
                  //propagateSwipe
                  >
                    <View style={{backgroundColor:'#fff', paddingBottom: 0,width:ancho, height: alto }}>
                       <View style={{
                                width: 40,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)',
                                marginBottom: 10,
                                position: 'absolute', alignSelf: 'center', marginTop: 7, top: 0
                              }}></View>
                       <Row size={12} style={{marginTop: 15,zIndex:999}}>
                          <Col sm={10} md={11} lg={10} style={{padding: 10, height: 70}}>
                            <SwitchSelector
                              initial={this.state.initialModalType}
                              onPress={value => this.onSwitchTypeModal(value)}
                              textColor={globalColors.lightDark} //'#7a44cf'
                              selectedColor={globalColors.white}
                              buttonColor={globalColors.lightDark}
                              borderColor={globalColors.lightWhiteBorder}
                              backgroundColor={isDarkMode == true ? globalColors.lightWhite : 'rgba(0,0,0,.1)'}
                              activeColor={globalColors.black}
                              borderRadius={10}
                              style={{zIndex:2}}
                              disabled={false}
                              hasPadding
                              options={[
                                { label: "", value: "toc", customIcon: <Ionicons name="ios-albums" size={20}/> }, 
                                { label: "", value: "search", customIcon: <Ionicons name="ios-search" size={20}/> }, 
                                { label: "", value: "settings", customIcon: <EntypoIcono name="adjust" size={20}/> },
                                //{ label: "", value: "info", customIcon: <EntypoIcono name="hour-glass" size={20} style={{color: 'rgba(255,255,255,.4)'}}/> } //images.masculino = require('./path_to/assets/img/masculino.png')
                              ]}
                            />
                          </Col>
                          <Col sm={2} md={1} lg={2} style={{paddingTop: 15, paddingRight: 0}}>
                            <TouchableHighlight onPress={() => this.setState({isOpen: false})} style={{justifyContent: 'center', alignSelf: 'center', width: '100%', borderRadius: 8}}>
                              <AntDesign
                                  name="down"
                                  size={25}
                                  style={{textAlign: 'center', paddingTop: 2, paddingLeft: 14, alignSelf: 'flex-start'}}
                                  color={this.contetxt == 'dark' ? '#fff' : '#000'}
                                />
                             </TouchableHighlight>
                          </Col> 

                         </Row>
                             {this.state.modalType == 'toc' && this.renderToc()}
                              {this.state.modalType == 'search' && this.renderSearch()}
                              {this.state.modalType == 'settings' && this.renderSettings()}
                              {this.state.modalType == 'info' && this.renderInfo()}
                             


                     
                    </View>
                    
                  
                </Modal>
              </View>
        );
      }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: "center",

      alignItems:'center',
  },
  sessionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  modalView: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    borderTopLeftRadius:8,
    borderTopRightRadius: 8
  },
  input: {
      margin: 0,
      height: 60,
      borderColor: 'rgba(255,255,255,.1)',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderWidth: 1,
      width: '100%',
      padding: 10,
      borderRadius: 0,
      fontSize: 20
   },
  reader: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#f7ebe3'
  },
  bar: {
    position:"absolute",
    left:0,
    right:0,
    height:55
  },
  richEditor: {
      padding: 0,
      margin: 0,
      flex: 1
      //padding: 20
    },
  sessionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 25,
    right: 50,
    zIndex: 1,
    height: 25,
    width: 25,
    display: 'none',
    backgroundColor: '#333'
  },
  paginationText: {
    color: 'white',
    }
}); 

class HeaderTools extends Component<Props>{
  static contextType = DarkModeContext;
  static propTypes = {
    visible: PropTypes.bool,
    style: PropTypes.any,
    children: PropTypes.any,
    direction: PropTypes.string
  };

  constructor(props) {
    super(props);
    //console.log("cconstructor header tools", props)
    this.state = {
      visible: 1,
      current: null
    };

    this.visibility = new Animated.Value(1);

  }


  _renderTinyCover = (item) => {
    //console.log("itemrender", item)
      if(item.cover && item.cover != null){
        return (
                <TouchableOpacity onPress={() => this.props.onGoBack()} >

                {
                  FastImage ? (
                    <FastImage 
                      source={{ uri: encodeURI(item.cover) }}
                      style={[styles.image,{height: 30, width: 20, marginLeft: 0, marginTop: 0, borderRadius: 4, backgroundColor: item.colors ? item.colors[1] : '#000'}]}
                      resizeMode={FastImage.resizeMode.cover}
                      >

                      </FastImage>
                      
                  ) : (
                      <Image style={styles.image} source={{uri: encodeURI(cover)}}/>
                  )
                }
                </TouchableOpacity>
        );
      } else {
        return (
                <TouchableOpacity onPress={() => this.props.onGoBack()} >
                  <View style={[styles.image,{height: 30, width: 20, marginLeft: 0, marginTop: 0, borderRadius: 4, backgroundColor: item.colors ? item.colors[1] : '#000'}]}>
                  </View>

                </TouchableOpacity>
        );
      }
        
        
    }

  componentWillReceiveProps({ visible }) {
    //console.log("headertoolscomponent wil receive props!", this.props, visible)

    Animated.timing(this.visibility, {
      toValue: visible ? 1 : 0,
      duration: 200
    }).start(() => !visible && this.setState({ visible: visible }));

    if (visible) this.setState({ visible: visible });
  }

  toggleVisibility = (key) => {
  //  console.log("toggle visible", key)
    Animated.timing(this.visibility, {
      toValue: this.state.visible ? 0 : 1,
      duration: 200,
      easing: Easing.linear
    }).start(() => this.setState({ visible: !this.state.visible }));

    if(this.state.visible == 1){

    } else {

      if(this.context == 'light'){
        changeNavigationBarColor('#ffffff', false);
      } else {
        changeNavigationBarColor('#222222', false);
      }
    }

   // console.log("toggle visible this state", this.state)
    //this.setState({ visible: !this.state.visible });


   
  }

  getIfVisible = () => {
    return this.state.visible;
  }
  onSwipe = (key) => {
   // console.log("on swipe visible", key)
   
  }



  render() {
    const { visible, style, children, direction, ...rest } = this.props;

    const directions = {
      up: [10, 0],
      down: [-10, 0]
    };

    const test = this.visibility.interpolate({
      inputRange: [0, 1],
      outputRange: directions[direction] || [0, 0]
    });

    const containerStyle = {
      opacity: this.visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      }),
      transform: [
        {
          translateY: test
        }
      ]
    };

    const combinedStyle = [containerStyle, style];

    if(Platform.OS == 'ios'){
    return (
      <Animated.View
      style={this.state.visible ? combinedStyle : combinedStyle}
        {...rest}
      >
        {
          this.state.visible == 0 &&
          <View style={{flex: 1, width: '100%', height: 50}}>
            <SafeAreaView style={{width: '100%'}}>
                  <Row size={12} style={{marginTop: 0}}>
                    <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.props.onGoBack()}>
                               <Ionicons
                                name="ios-arrow-back"
                                size={25}
                                style={{textAlign: 'center', alignSelf: 'center'}}
                                color={isDarkMode == true ? '#fff' : '#000'}
                              />

                      </TouchableOpacity>
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                     
                     </Col>
                     
                     
                     <Col sm={6} md={9} lg={6} style={{justifyContent: 'center'}}>
                    </Col>

                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                     
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      
                     </Col>

                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.toggleVisibility()} style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}}>
                         <Ionicons 
                            name="ios-arrow-dropdown" 
                            size={24} 
                            style={{color: '#000', padding: 1, paddingLeft: 1, alignSelf: 'center'}}
                             />
                      </TouchableOpacity>
                     </Col>

                  </Row>
                 {/* <Progress.Bar color={this.props.currentBook && this.props.currentBook.colors && this.props.currentBook.colors[0] != '#fff' ? this.props.currentBook.colors[0] : '#33ab3d'} height={4} borderRadius={0} borderWidth={0} progress={parseFloat(this.props.percetageOfBar >= 10 ? '1' : '0.'+this.props.percetageOfBar)} width={ancho} style={{marginTop: 4}} />*/}
              </SafeAreaView>

          </View>
        }
        {this.state.visible == 1 &&
          <LinearGradient
                      colors={[this.props.currentTheme == 'dark' ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.4)', 'transparent']}
                      style={{width: '100%', height: getHeaderSafeAreaHeight() + 20, position: 'absolute', zIndex: -1}}
                      //  Linear Gradient 
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}

                      // Linear Gradient Reversed
                      // start={{ x: 0, y: 1 }}
                      // end={{ x: 1, y: 0 }}

                      // Horizontal Gradient
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 1, y: 0 }}

                      // Diagonal Gradient
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 1, y: 1 }}
                    >
          <View style={{flex: 1, width: '100%'}}>
                 <SafeAreaView style={{width: '100%'}}>
                  <Row size={12} style={{marginTop: 7}}>
                    <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.props.onGoBack()}>
                               <Ionicons
                                name="ios-arrow-back"
                                size={25}
                                style={{textAlign: 'center',paddingTop: 3, alignSelf: 'center'}}
                                color={isDarkMode == true ? '#fff' : '#000'}
                              />

                      </TouchableOpacity>
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      { this.props.currentBook != null &&
                        this._renderTinyCover(this.props.currentBook)
                      }
                     </Col>
                     
                     
                     <Col sm={6} md={9} lg={6} style={{justifyContent: 'center'}}>

                     </Col>

                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}} onPress={() => this.props.openSettings('settings')}>
                                  <EntypoIcono name="adjust" size={20} style={{color: '#000', padding: 2, paddingTop: 3}} />
                      </TouchableOpacity>
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}} onPress={() => this.props.openSettings('toc')}>
                                  <EntypoIcono name="list" size={20} style={{color: '#000', padding: 3}} />
                      </TouchableOpacity>
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.props.openSettings('search')} style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}}>
                         <Ionicons 
                            name="ios-search" 
                            size={24} 
                            style={{color: '#000', padding: 2, paddingLeft: 3, alignSelf: 'center'}}
                             />
                      </TouchableOpacity>
                     </Col>

                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.setState({visible: false})} style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}}>
                         <Ionicons 
                            name="ios-arrow-dropup" 
                            size={24} 
                            style={{color: '#000', padding: 1, paddingLeft: 1, alignSelf: 'center'}}
                             />
                      </TouchableOpacity>
                     </Col>

                  </Row>
                  {/*<Progress.Bar color={this.props.currentBook && this.props.currentBook.colors && this.props.currentBook.colors[0] != '#fff' ? this.props.currentBook.colors[0] : '#33ab3d'} height={4} borderRadius={0} borderWidth={0} progress={parseFloat(this.props.percetageOfBar >= 10 ? '1' : '0.'+this.props.percetageOfBar)} width={ancho} style={{marginTop: 4}} />*/}
                 </SafeAreaView>

          </View>
          </LinearGradient>
        }

         
      </Animated.View>
    );
  } else {
    return (
      <Animated.View
      style={this.state.visible ? combinedStyle : combinedStyle}
        {...rest}
      >
        {
          this.state.visible == 0 &&
          <View style={{flex: 1, width: '100%', height: getHeaderHeight()}}>
                 <SafeAreaView style={{width: '100%'}}>
                  <Row size={12} style={{marginTop:7}}>
                    <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.props.onGoBack()}>
                               <Ionicons
                                name="ios-arrow-back"
                                size={25}
                                style={{textAlign: 'center',paddingTop: 3, alignSelf: 'center'}}
                                color={isDarkMode == true ? '#fff' : '#000'}
                              />

                      </TouchableOpacity>
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                     
                     </Col>
                     
                     
                     <Col sm={6} md={9} lg={6} style={{justifyContent: 'center'}}>
                    </Col>

                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                     
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      
                     </Col>

                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.toggleVisibility()} style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}}>
                         <Ionicons 
                            name="ios-arrow-dropdown" 
                            size={24} 
                            style={{color: '#000', padding: 1, paddingLeft: 1, alignSelf: 'center'}}
                             />
                      </TouchableOpacity>
                     </Col>

                  </Row>
                {/*  <Progress.Bar color={this.props.currentBook && this.props.currentBook.colors && this.props.currentBook.colors[0] != '#fff' ? this.props.currentBook.colors[0] : '#33ab3d'} height={4} borderRadius={0} borderWidth={0} progress={parseFloat(this.props.percetageOfBar >= 10 ? '1' : '0.'+this.props.percetageOfBar)} width={ancho} style={{marginTop: 4}} />*/}
                 </SafeAreaView>

          </View>
        }
        {this.state.visible == 1 &&
          <LinearGradient
                      colors={[this.props.currentTheme == 'dark' ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.4)', 'transparent']}
                      style={{width: '100%', height: getHeaderSafeAreaHeight() + 20, position: 'absolute', zIndex: -1}}
                      //  Linear Gradient 
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}

                      // Linear Gradient Reversed
                      // start={{ x: 0, y: 1 }}
                      // end={{ x: 1, y: 0 }}

                      // Horizontal Gradient
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 1, y: 0 }}

                      // Diagonal Gradient
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 1, y: 1 }}
                    >
          <View style={{flex: 1, width: '100%'}}>
                 <SafeAreaView style={{width: '100%'}}>
                  <Row size={12} style={{marginTop: 7}}>
                    <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.props.onGoBack()}>
                               <Ionicons
                                name="ios-arrow-back"
                                size={25}
                                style={{textAlign: 'center',paddingTop: 3, alignSelf: 'center'}}
                                color={isDarkMode == true ? '#fff' : '#000'}
                              />

                      </TouchableOpacity>
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      { this.props.currentBook != null &&
                        this._renderTinyCover(this.props.currentBook)
                      }
                     </Col>
                     
                     
                     <Col sm={6} md={9} lg={6} style={{justifyContent: 'center'}}>

                     </Col>

                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}} onPress={() => this.props.openSettings('settings')}>
                                  <EntypoIcono name="adjust" size={20} style={{color: '#000', padding: 2, paddingTop: 3}} />
                      </TouchableOpacity>
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}} onPress={() => this.props.openSettings('toc')}>
                                  <EntypoIcono name="list" size={20} style={{color: '#000', padding: 3}} />
                      </TouchableOpacity>
                     </Col>
                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.props.openSettings('search')} style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}}>
                         <Ionicons 
                            name="ios-search" 
                            size={24} 
                            style={{color: '#000', padding: 2, paddingLeft: 3, alignSelf: 'center'}}
                             />
                      </TouchableOpacity>
                     </Col>

                     <Col sm={1} md={0.5} lg={1} style={{justifyContent: 'center'}}>
                      <TouchableOpacity onPress={() => this.setState({visible: false})} style={{justifyContent: 'center', backgroundColor: '#fff', borderRadius: 50, width: 25, height: 25}}>
                         <Ionicons 
                            name="ios-arrow-dropup" 
                            size={24} 
                            style={{color: '#000', padding: 1, paddingLeft: 1, alignSelf: 'center'}}
                             />
                      </TouchableOpacity>
                     </Col>

                  </Row>
                 {/* <Progress.Bar color={this.props.currentBook && this.props.currentBook.colors && this.props.currentBook.colors[0] != '#fff' ? this.props.currentBook.colors[0] : '#33ab3d'} height={4} borderRadius={0} borderWidth={0} progress={parseFloat(this.props.percetageOfBar >= 10 ? '1' : '0.'+this.props.percetageOfBar)} width={ancho} style={{marginTop: 4}} />*/}
                 </SafeAreaView>

          </View>
          </LinearGradient>
        }

         
      </Animated.View>
    );
  }
  }
}