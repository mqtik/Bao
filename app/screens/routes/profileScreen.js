  import React, {Component, useContext, useState, useEffect, useLayoutEffect} from 'react';
import {Platform, TouchableNativeFeedback,FlatList, StyleSheet, Text, Dimensions, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView } from 'react-native';

import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../../utils/context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SkeletonSection, SkeletonGrid, SkeletonList } from '../../utils/skeletons'

import { NoBooksProfileWrite, MenuIcon } from '../../utils/vectors';


import { SectionList, NewSectionList, GridList, ListNotification, GridListProfile } from '../../utils/renders'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'

import { TouchableRipple, List } from 'react-native-paper';


import { NewtFaceAvatar, NewtLeftUpperHand, NewtLeftLowerHand, NewtRightUpperHand, NewtRightLowerHand } from '../../utils/vectors';

import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/settingsScreen.style';
import { StackActions, NavigationActions } from 'react-navigation';
import { getLang, getLangString, Languages } from '../../static/languages';

import EntypoIcono from 'react-native-vector-icons/Entypo';

import CloseSession from '../../components/closeSession';

import Spinner from 'react-native-spinkit'

import globalStyles, { globalColors } from '../../styles/globals.js';

import {Column as Col, Row} from 'react-native-flexbox-grid';

import API from '../../services/api';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../../services/sizeHelper';

import ToggleSwitch from 'toggle-switch-react-native'

import ImagePicker from 'react-native-image-picker';

import {DarkModeContext} from 'react-native-dark-mode';

import FastImage from 'react-native-fast-image'

import Snackbar from 'react-native-snackbar';

import Modal from "react-native-modal";

import AwesomeButton from "react-native-really-awesome-button";

import { nanoid } from "nanoid";

import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { Popover, SlideIn } = renderers;
const Touchable = Platform.OS == 'android' ? TouchableNativeFeedback : TouchableOpacity;

import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker
} from "../../../libraries/settings";


import update from 'immutability-helper'
const SecondRoute = () => (
  <View />
);

function StoriesProfileCore(){
  const BaoDB = useContext(Newt);
  const [ items, setItems ] = useState(80);
  function loadMore(){
      let it = items + 80;
      setItems(it);
  }
   if(BaoDB.drafts == null){
      return <SkeletonGrid />
    }
    return (
          <GridListProfile
           items={BaoDB.drafts && BaoDB.drafts.rows.slice(0, items)}
           onEndReached={() => loadMore()}
           onEndReachedThreshold={0.5}
          />
         )
  }
export const StoriesProfile = React.memo(StoriesProfileCore);

export default function ProfileScreen({route, navigation}){
  const isDarkMode = useDarkMode()
  const ClouchDB = useContext(Clouch);
  const BaoDB = useContext(Newt);


  const currentLanguage = BaoDB.rootUser && BaoDB.rootUser.language ? BaoDB.rootUser.language : getLang();
  const [expandAccountData, setExpandAccountData] = React.useState(true);
  const [ modalReLogin, setModalReLogin ] = useState(false);
  const [ password, setPassword ] = useState(null);
  const [ queueSetting, setQueueSetting ] = useState(false);
  const [section, setSection] = React.useState(0);
  const [profileBooks, setProfileBooks] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [following, setFollowing ] = useState(null);

  const [ renderId, setRenderId ] = useState(nanoid());
  const [isMe, setMe] = React.useState(null);

   useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Profile',
      headerLeft: (props) => (
        <TouchableRipple onPress={() => navigation.toggleDrawer()} style={{borderRadius:10,width: 60,}}>
          <View style={{display: 'flex', position: 'relative', width: 60, flexDirection: 'row', width: 100, }}>
          <MenuIcon
               width={50}
               height={50}
               style={{
                marginLeft:5
               }}
             />
          </View>
        </TouchableRipple>
      ),
      headerRight: props => (
        <View style={{display: 'flex', justifyContent: 'space-around', flexDirection: 'row'}}>
          <Menu 
                              renderer={SlideIn} 
                              rendererProps={{ preferredPlacement: 'bottom', placement: 'bottom', anchorStyle: {backgroundColor: '#222'} }} 
                              style={{backgroundColor: 'transparent', borderRadius: 8, paddingRight:5}}
                              >
                              <MenuTrigger style={{width: 45, height: 45, paddingTop: 0, justifyContent: 'center', alignItems: 'center', borderRadius:50}}>
                            
                              
                                <Icon name="dots-vertical" size={23} style={{color: isDarkMode == true ? '#fff' : '#111'}} />
                              
                              </MenuTrigger>
                              <MenuOptions
                                optionsContainerStyle={[globalStyles.popOver]}
                                >
                                <MenuOption onSelect={() => shareProfile()} style={[globalStyles.popOverOption]}>
                                  <Icon name="account-arrow-right" size={23} backgroundColor={'transparent'}  color={"#000"} style={globalStyles.popoverOptionIcon} />
                                  <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>{Languages.Share[getLang()]}</Text>
                                </MenuOption>
                                {
                                  isMe == true &&
                                <MenuOption onSelect={() => BaoDB.signOut()} style={[{
                                        flexDirection: 'row',


                                      }, globalStyles.popOverOption, globalStyles.popOverOptionLast]}>
                                  <Icon name="account-off" size={23} backgroundColor={'transparent'}  color={"#000"} style={globalStyles.popoverOptionIcon} />
                                    
                                  <Text style={{color: '#333', fontSize: 22, fontWeight: '600'}}>{Languages.signOut[getLang()]}</Text>
                                  
                                </MenuOption>
                              }
                              </MenuOptions>
                            </Menu>
              </View>
          )
    });
    // if(route.params && route.params._id){

    // }
  }, [isMe, profile]);

  function shareProfile(){
    if(isMe == null || (isMe == true && !BaoDB.rootUser) || (isMe == false && !profile)){
      return;
    }
    let pl = isMe == true ? BaoDB.rootUser : profile;
    BaoDB.shareProfile(pl)
  }

   // Effects
  useEffect(() => {
    if(isMe == null && profile == null && BaoDB.rootUser != null){
      $profile();
    }
  }, [BaoDB.rootUser, isMe]);
  // Effects
  useLayoutEffect(() => {
    //  console.log("root user changed!", BaoDB.rootUser)
    if(isMe == true){
      navigation.setOptions({
        title: BaoDB.rootUser.name,
      });
    }
    if(isMe == false && profile != null){
      navigation.setOptions({
        title: profile.name,
      });

      if(following == null && isMe == false){
        getFollowing();
      }
    }

  }, [isMe, profile]);
  // Functions
  async function $profile(){
    //console.log("start profile!", BaoDB, route.params)
    if(BaoDB.rootUser){
      if(route.params && route.params._id != BaoDB.rootUser.name){
        setMe(false);
        let p = await(ClouchDB.Users().findOne(route.params._id).catch(e => null));
        if(p != null){
          setProfile(p);
        } else {
          setProfile(false)
        }

        let gU = await ClouchDB.Users().findBooksByUserId({ id: p.name, limit: 100, offset: null });
        setProfileBooks(gU);
        //console.log("find remote user!", p, gU)
      } else {
        setMe(true);
        setProfile(BaoDB.rootUser);
      }
    }
  }

  async function getFollowing(){
    if(!(BaoDB.rootUser && BaoDB.rootUser.name) || !(profile && profile.name)){
      return;
    }
    let f = await BaoDB.triggerAction('following');
      if(isMe == false){
        let c = await ClouchDB.Activities().getActivity(BaoDB.rootUser.name+'-followUser:'+profile.name);
        if(c == true){
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      }
    }

    async function doFollow(){
      if(isMe == true){ 
        return; 
      }
      let lk = following == true ? false : true;
      setFollowing(lk);
      let c = await ClouchDB.Activities().setActivity(BaoDB.rootUser.name+'-followUser:'+profile.name).catch(e => null);
      return;
    }

  async function $newStory(){
    //console.log("new story!!")
    let d = await ClouchDB.Books().createOne(newBookValue);
    //console.log("create one!!", d)
  }
  async function $importEpub(){
    let typeBook = await DocumentPicker.pick({
     type: [DocumentPicker.types.allFiles],
    });
    //console.log("type book!!", typeBook)
    if(typeBook.type == 'application/pdf'){
       return Snackbar.show({ text: 'PDF support has not yet landed on Newt.', duration: Snackbar.LENGTH_LONG });
    }
    if(typeBook.name && !typeBook.name.includes(".epub")){
     return Snackbar.show({ text: 'We only support EPUB format as of now.', duration: Snackbar.LENGTH_LONG });
    }
    Snackbar.show({ text: 'Importing to Newt\'s Cloud.', duration: Snackbar.LENGTH_LONG });
    //console.log("document picker!!", typeBook);
    let result = await RNFS.readFile(decodeURI(typeBook.uri), 'base64')
    let data = {
            type: typeBook.type,
            name: typeBook.name,
            size: typeBook.size,
            data: result,
            source: {uri: typeBook.uri},
            user_id: BaoDB.rootUser.name
          };
    let f = await ClouchDB.Work().drafts().importEpub(data);
        //console.log("on drop epub!!", f)
        if(f && f.type == 'success' && f.objects){
            let ic = await(ClouchDB.Work().drafts().importContents(f.objects))
            //console.log("bulk chapters on!", ic)
            let bulkIt = await(ClouchDB.Work().drafts().bulkIt(ic.chapters));
            return Snackbar.show({ text: 'Book successfully imported.', duration: Snackbar.LENGTH_LONG });
        }
 // console.log("import epub!", data)
  }
  async function selectPhotoTapped(){
    if(isMe != true){ return; }
    const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        includeBase64: true,
        storageOptions: {
          skipBackup: true,
        },
      };
      let p = await BaoDB.askPermissions();
      ImagePicker.showImagePicker(options, async(response) => {
        if (response.didCancel) {

        } else if (response.error) {
          //console.log("response of!", response)
          Snackbar.show({ text: 'Permissions weren\'t granted', duration: Snackbar.LENGTH_LONG });
        } else if (response.customButton) {

        } else {
          let source = {uri: response.uri};

          let data = {
              type: response.type,
              name: response.fileName,
              size: response.fileSize,
              data: response.data,
              source: {uri: response.uri},
              user_id: BaoDB.rootUser.name
            };
          let f = await(ClouchDB.Auth().avatarUp(data));

          if(f){
            let userObj = {...BaoDB.rootUser};

            userObj.avatar = API_STATIC+'/avatars/'+userObj.name+'/'+f.objects.filename;

            onSaveSetting({activeDoc: userObj})
          }
          // BaoDB.rootUser.avatar = API_STATIC+'/avatars/'+f.objects.filename;
         

          // let toUp = {
          //   activeDoc: BaoDB.rootUser,
          //   toEdit: 'userProfile-avatar'
          // };
         
          // this.onSaveSetting(toUp);
        }
      });
  }
  function _renderAvatar(){
      const useProfile = isMe == true ? BaoDB.rootUser : profile;
        return (
          <View style={{position: 'relative', width: 120, height: 120, display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
            <TouchableRipple 
              onPress={() => selectPhotoTapped()}
              style={{
                height: 100,
                width: 100,
                backgroundColor: isDarkMode == true ? '#666' : '#eaeaea',
                borderRadius: 10,
                marginLeft: 0,
                marginTop:15
              }}>
                  {
                      useProfile && useProfile.avatar && FastImage ? (
                        <FastImage 
                          source={{ uri: encodeURI(useProfile.avatar), cache: FastImage.cacheControl.immutable }}
                          style={[styles.image,{height: '100%', width: '100%', marginLeft: 0, marginTop: 0, borderRadius: 10}]}
                          imageStyle={{borderRadius: 10}}
                          resizeMode={FastImage.resizeMode.cover}
                          >
                        <Icon color={'#000'} size={20} style={{}} name={'pencil'} /> 
                        </FastImage>
                      ) : (<View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                              <Icon color={isDarkMode == true ? '#fff' : '#000'} size={30} style={{}} name={'account'} /> 
                          </View>                                                       )
                    }
            </TouchableRipple>
          </View>
          )
    }
  

  function editProperty(setting){
    navigation.navigate('ChangeProperty',{
        activeDoc: BaoDB.rootUser,
        toEdit: 'userProfile-'+setting,
        toUpdate: (s) => onSaveSetting(s)
      });
  }
  function editLocalProperty(setting){
    navigation.navigate('ChangeProperty',{
        activeDoc: BaoDB.rootUser,
        toEdit: 'userProfile-'+setting,
        toUpdate: (s) => onSaveLocalSetting(s)
      });
  }
  async function onSaveSetting(settings){
    //console.log("setting et!", settings)
    await BaoDB.updateRootUser(settings.activeDoc);
    setRenderId(nanoid())
  }

  async function onSaveLocalSetting(settings){
    //console.log("setting et!", settings)
    await BaoDB.updateLocalRootUser(settings.activeDoc);
    setRenderId(nanoid())
  }

  async function onSave(doc){
    

    let currentLang = BaoDB.rootUser.language || getLangString();
    // if(BaoDB.rootUser && BaoDB.rootUser.languages != currentLang){

    //   Snackbar.show({ text: 'Changing language...', duration: Snackbar.LENGTH_LONG })

    //   let setUpPublic = await(ClouchDB.Public().replicateFrom());
    //   let published = await(ClouchDB.Public().all());
    //   let formattedDocs = await ClouchDB.Public().formatFromTags(published, { sort: 'default' });

    //   //this.props.screenProps.resetPublished({published: published,formatted: formattedDocs})
    // }

    setQueueSetting(null);
    BaoDB.updateRootUser(doc);
  }
  async function selectProfilePicture(){
    const options = {
      quality: 1.0,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options, async(response) => {


      if (response.didCancel) {

      } else if (response.error) {
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
       // console.log("data!", data)
       
        
       //console.log("lets cover it", data, Remote.Auth())
        
         

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        let f = await(ClouchDB.Auth().avatarUp(data));

       
       BaoDB.rootUser.avatar = API_STATIC+'/avatars/'+f.objects.filename;
       

        let toUp = {
          activeDoc: BaoDB.rootUser,
          toEdit: 'userProfile-avatar'
        };
       
        onSaveSetting(toUp);

      }
    });
  }
  async function refreshSession(){
    if(!password){
      Snackbar.show({ text: 'Type in your password', duration: Snackbar.LENGTH_LONG })
    }

    let u = await(ClouchDB.Auth().signIn(BaoDB.rootUser.name, password)).catch(e => null);

    if(u == null){
      Snackbar.show({ text: 'Incorrect credentials', duration: Snackbar.LENGTH_LONG });
    }
    if(u && u.name != null){
      Snackbar.show({ text: 'Session refreshed successfully', duration: Snackbar.LENGTH_LONG });
      setModalReLogin(false);
    }
    if(queueSetting){
      onSave(queueSetting);
    }
  }
  async function toggleUser(by, choice){
      let activeUser = BaoDB.rootUser;

      if(by == 'liveSync'){
        if(!activeUser.sync){
          activeUser.sync = {};
        }
        if(choice == true){
          activeUser.sync.live = true;
        } else {
          activeUser.sync.live = false;
        }
      }

      if(by == 'writer'){
        if(choice == true){
          activeUser.writerMode = true;
        } else {
          activeUser.writerMode = false;
        }
      }

      if(by == 'sync'){
        if(!activeUser.sync){
          activeUser.sync = {};
        }
        if(choice == true){
          activeUser.sync.status = true;
        } else {
          activeUser.sync.status = false;
          activeUser.sync.live = false;
        }
      }

      await BaoDB.updateLocalRootUser(activeUser);
      setRenderId(nanoid())
  }

  function SettingsProfile(){
    return (
      <View
        key={renderId}
                    style={{
                      flex: 1,
                      paddingTop: 10,
                      paddingBottom: 50
                    }}
                  >
                  
                   <List.Section title="Configuración">
                    <List.Accordion
                      theme={{ colors: { primary: '#000' }}}
                      title="Cuenta"
                      left={props => <List.Icon {...props} icon="account-settings" />}>
                        <TouchableRipple onPress={() => editProperty('email')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: isDarkMode == true ? '#222' : '#eaeaea', marginBottom: 0, padding: 15}}>
                                    <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                       <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Email</Text>
                                       <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <Text numberOfLines={1} style={{color: isDarkMode == true ? '#fff' : '#000', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{BaoDB.rootUser.email ? BaoDB.rootUser.email : 'Add an email'}</Text>
                                        <Icon color={isDarkMode != true ? '#000' : '#fff'} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> 
                                       </View>
                                    </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={() => editProperty('full_name')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: isDarkMode == true ? '#222' : '#eaeaea', marginBottom: 0, padding: 15}}>
                                    <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                       <Text numberOfLines={1} style={{color: '#666', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700'}}>Nombre</Text>
                                       <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <Text numberOfLines={1} style={{color: isDarkMode == true ? '#fff' : '#000', margin: 1, marginLeft: 8, fontSize: 16,fontWeight:'700', maxWidth: 150}}>{BaoDB.rootUser.full_name ? BaoDB.rootUser.full_name : 'Add your name'}</Text>
                                        <Icon color={isDarkMode != true ? '#000' : '#fff'} style={{borderRadius: 0, padding: 0, fontSize:22}} borderRadius={0} padding={5} name={'chevron-right'} /> 
                                       </View>
                                    </View>
                        </TouchableRipple>
                    </List.Accordion>
                    <List.Accordion
                      title="Métodos de Pago"
                      left={props => <List.Icon {...props} icon="credit-card-check-outline" />}>
                    </List.Accordion>
                    <List.Accordion
                      title="Licencia"
                      left={props => <List.Icon {...props} icon="card-account-details-star-outline" />}>
                    </List.Accordion>
                    <List.Accordion
                      title="Notificationes"
                      left={props => <List.Icon {...props} icon="bell-outline" />}>
                    </List.Accordion>
                    <List.Accordion
                      title="Ayuda"
                      left={props => <List.Icon {...props} icon="information-outline" />}>
                    </List.Accordion>
                  </List.Section>
              </View>
              )
  }

  function TabStoriesProfile(){
    if(isMe == true){
      if(BaoDB && BaoDB.drafts && BaoDB.drafts.rows && BaoDB.drafts.rows.length == 0){
        return (<View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <NoBooksProfileWrite width={300} height={300} style={{marginLeft: 20}}/>
              <Text style={{textAlign: 'center', color: '#000', fontSize: 22, fontWeight: '700', marginTop: 15}}>
               {Languages.profileNoStoriesTitle[getLang()]}
              </Text>
              <Text style={{fontSize: 20, maxWidth: 300, textAlign: 'center'}}>
                {Languages.profileNoStoriesContent[getLang()]}
               </Text>
            </View>)
      }
      return (
        <View style={{display: 'flex', justifyContent: 'center', paddingTop: 10}}>
          <StoriesProfileCore />
        </View>
        )
    }
    if(isMe == false){
      return (
        <View style={{display: 'flex', justifyContent: 'center', paddingTop: 10}}>
          <StoriesProfileCoreUser />
        </View>
        )
    }
    return <SkeletonGrid /> 
  }
  function StoriesProfileCoreUser(){
    const BaoDB = useContext(Newt);
     if(profileBooks == null){
        return <SkeletonGrid />
      }
    return (
          <GridList
           items={profileBooks.rows && profileBooks.rows}
          />
         )
  }
  function _renderProfile(){
    const renderScene = SceneMap({
      account: React.memo(SettingsProfile)
    });

     const solapas = {
           index: section || 0,
           routes: isMe == true ? [
            { key: 'account', title: Languages.Stories[getLang()] },
           ] : [
            { key: 'account', title: Languages.Stories[getLang()] }
           ]};

      return (

            <View style={{marginTop: 0 }}>
              <View style={{
                width: '100%',
                display: 'flex',
                paddingTop: 15,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                  {_renderAvatar()}
                  {
                    isMe == false && <AwesomeButton
                                        progress
                                        onPress={async(next) => {
                                          let f = await doFollow();
                                          next();
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
                                        backgroundColor={following == true ? '#222' : (following == false ? '#000' : '#eaeaea')}
                                        backgroundProgress={'#333'}
                                      >
                                        <Text style={{textAlign: 'center', color: following == null ? '#999' : '#fff', fontSize: 19, fontWeight: '500'}}>
                                          {following == true ? Languages.unfollow[getLang()] : (following == false ? Languages.follow[getLang()] : Languages.loading[getLang()])}
                                        </Text>
                                     </AwesomeButton>
                  }

              </View>
              {
                isMe != null &&
              <TabView
                navigationState={solapas}
                onIndexChange={setSection}
                renderScene={renderScene}
                
                renderTabBar={props => null}
             />
              }
            </View>
            )
    }     
     /*<TabBar
                      {...props}
                      indicatorStyle={{ 
                        backgroundColor: isDarkMode == true ? '#fff' : '#000', 
                        height:3 }}
                      style={{ backgroundColor: 'transparent' }}
                      renderIcon={({ route, focused, color }) => (
                          <Icon
                            name={route.key == 'stories' ? 'library' : 'account-settings'}
                            size={30}
                            color={isDarkMode == true ? '#fff' : '#000'}
                          />
                        )}
                      renderLabel={({ route, focused, color }) => (
                      <Text style={{ 
                        fontSize: 18,
                        color: isDarkMode == true ? '#fff' : '#000',
                        fontWeight: 'bold', 
                        margin: 10 }}>
                        {route.title}
                      </Text>
                    )}
                    />*/
  if(BaoDB.rootUser != null){

    
           
    return(
          <View style={{flex: 1, backgroundColor: isDarkMode == true ? '#111111' : '#f2f2f2'}}>
            <FlatList
              data={[{key: 'section'}]}
              initialNumToRender={1}
              maxToRenderPerBatch={1}
              updateCellsBatchingPeriod={1}
              //horizontal={true}
              style={{marginTop: 0}}
              contentContainerStyle={{paddingBottom: 35}}
              renderItem={({ item, index }) => _renderProfile()}
              keyExtractor={(item, ind) => ind.toString()}
              ListEmptyComponent={<View style={{flex: 1, justifyContent: 'center',alignItems:'center', marginTop:20,backgroundColor: 'transparent'}}>
                      <SkeletonGrid />
                    </View>}
            /> 

            <Modal 
              style={[{ justifyContent: 'center',margin: 0, width: '100%', backgroundColor: 'rgba(0,0,0,.9)',height: '100%', display: 'flex', alignItems: 'center'}]} 
              isVisible={modalReLogin}
              animationIn={'fadeIn'}
              hasBackdrop={false}
              onSwipeComplete={() => setModalReLogin(false)}
              swipeDirection="down"
              swipeThreshold={90} >
                <View style={{zIndex: 99, flex: 1, width: '100%', }}>
                  <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ 
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        paddingTop: getHeaderHeight()
                    }}
                    style={{width: '100%', flex:1}}>
                      <View style={{width: '100%', flex:1}}>

                         <Row size={12} style={{}}>
                         <Col sm={12} md={12} lg={12}>
                            <Text style={{color: '#fff', textAlign: 'center', marginTop: 15, fontSize: 17, fontWeight: '500'}}>
                              Session expired
                            </Text>
                            <Text style={{color: '#999', textAlign: 'center', marginTop: 2, fontSize: 14, fontWeight: '500'}}>
                              Refresh your session in order to edit sensitive information.
                            </Text>
                          </Col>

                          <Col sm={12} md={12} lg={12}>
                            <TextInput
                                    //onChangeText={(text) => this.setState({title: text})}
                                    style={{ alignSelf: 'flex-start', marginTop: 10, color: '#fff', backgroundColor: '#111', padding: 10, fontSize: 18, width: '100%',height: 40}}
                                    value={password}
                                    placeholder={"Type password"}
                                    onChangeText={(text) => setPassword(text)}
                                    placeholderTextColor="#999"
                                    multiline={false}
                                    secureTextEntry={true}
                                    autoCapitalize = 'none'
                                    autoCorrect={false}
                                  />
                          </Col>

                          <Col sm={12} md={12} lg={12} style={{justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => refreshSession()} style={{marginTop: 10, width: '50%', justifyContent: 'center', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,.4)', borderRadius: 8}}>
                             <Text style={[styles.headlineAuth, {color: '#fff', margin: 10, textAlign: 'center', fontSize: 16}]}>Sign in</Text>
                            </TouchableOpacity>
                          </Col>
                          
                        </Row> 
                        </View>
                  </KeyboardAwareScrollView>
                
                  
                </View>
              
            </Modal>
            
          </View>
        );
         } else {
            return (
              <View style={{flex: 1, backgroundColor: isDarkMode == true ? '#111' : '#fff', justifyContent:'center'}}>
                 <Spinner style={{alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={isDarkMode == true ? '#fff' : '#111'}/>
              </View>
                        )
          }
}

export class DeprecatedSettingsScreen extends Component<Props>{
  static contextType = DarkModeContext;
  static navigationOptions = ({ navigation }) => {
          const { params = {} } = navigation.state;
          var value = null;
         //console.log("EXPLORE SCREEN PARAMS! BLUE MOMDE", params)
         // console.log("nnavigationn", navigation)
        return {
          //Default Title of ActionBar
            //Background color of ActionBar
            headerBackTitle: null,
            headerRight: (<CloseSession logOut={params.logOut}/>),
            


          //Text color of ActionBar
        };
      };
    constructor(props) {
	    super(props);
	    this.state = {
	      currentUser : props.screenProps.rootUser,
        isLoading: false,
        isOpenReLogin: false
	    };

	    
	  }
	  componentDidMount() {
      this.$init();

      this.props.navigation.setParams({ logOut: () => this.props.screenProps.onLogout() });

      if(BaoDB.rootUser == null){
        this.$setUser()
      }
	  }

    $setUser = async() => {
      let k = await ClouchDB.Auth().getLoggedUser();
        this.setState((prevState) => update(prevState, { 
                  currentUser: {
                      $set: k
                      }
        }));
    }
    componentWillRceiveProps(){

      if(props.screenProps.rootUser != BaoDB.rootUser && BaoDB.rootUser == null){

        this.setState((prevState) => update(prevState, { 
                  currentUser: {
                      $set: props.screenProps.rootUser
                      }
        }));
      }
    }

    $init = async() => {
      //console.log("props of settigs", this.props)
      //let u = await(Remote.Auth().getLoggedUser());
     


    }
	  _onLogout = () => {

          this.props.screenProps.onLogout();
	  }

    selectPhotoTapped = async() => {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
        },
      };
      BaoDB.askPermissions();
      ImagePicker.showImagePicker(options, async(response) => {
        if (response.didCancel) {

        } else if (response.error) {
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
          let f = await(ClouchDB.Auth().avatarUp(data));

         
          BaoDB.rootUser.avatar = API_STATIC+'/avatars/'+f.objects.filename;
         

          let toUp = {
            activeDoc: BaoDB.rootUser,
            toEdit: 'userProfile-avatar'
          };
         
          this.onSaveSetting(toUp);
        }
      });
  }

  toggleUser = async(by, choice) => {
    let activeUser = BaoDB.rootUser;


    if(by == 'sync'){
      if(!activeUser.sync){
        activeUser.sync = {};
      }
      if(choice == true){
        activeUser.sync.status = true;
      } else {
        activeUser.sync.status = false;
      }
    }

    if(by == 'liveSync'){
      if(!activeUser.sync){
        activeUser.sync = {};
      }
      if(choice == true){
        activeUser.sync.status = true;
      } else {
        activeUser.sync.status = false;
      }
    }

    if(by == 'writer'){
      if(choice == true){
        activeUser.writerMode = true;
      } else {
        activeUser.writerMode = false;
      }
    }

    this.onSave(activeUser, by)
  }

  onSave = async(activeUser, by) => {

    this.setState({
            currentUser: {
              ...activeUser
            }
          });


    /*let session = await(Remote.Auth().getSession());
    if(session && session.userCtx.name == null){
      Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
      this.setState({
        isOpenReLogin: true
      })
    }
    */

    let u = await(ClouchDB.Auth().saveLocalUser(BaoDB.rootUser)).catch(e => null);



    this.props.screenProps.updateUser(BaoDB.rootUser, by)
  }

  onSaveSetting = async(settings) => {

    let currentLang = BaoDB.rootUser.languages || getLangString();



    this.setState({
            currentUser: {
              ...settings.activeDoc
            }
          });

    let session = await(ClouchDB.Auth().getSession());
    if(session && session.userCtx.name == null){
      Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
      this.setState({
        isOpenReLogin: true
      })
    }

    let u = await(ClouchDB.Auth().updateUser(BaoDB.rootUser));


    if(BaoDB.rootUser && BaoDB.rootUser.languages && BaoDB.rootUser.languages != currentLang){

      Snackbar.show({ title: 'Changing language...', duration: Snackbar.LENGTH_LONG })

      let setUpPublic = await(ClouchDB.Public().replicateFrom());
      let published = await(ClouchDB.Public().all());
      let formattedDocs = await ClouchDB.Public().formatFromTags(published, { sort: 'default' });

      this.props.screenProps.resetPublished({published: published,formatted: formattedDocs})
    }

    
  }

  reLogin = async() => {

    let u = await(ClouchDB.Auth().signIn(BaoDB.rootUser.name, this.state.confirmPassword)).catch(e => null);

    if(u == null){
      Snackbar.show({ title: 'Incorrect credentials', duration: Snackbar.LENGTH_LONG });
    }
    if(u && u.name != null){
      Snackbar.show({ title: 'Session refreshed successfully', duration: Snackbar.LENGTH_LONG });
      this.setState({
        isOpenReLogin: false
      })
    }
  }
  editProp = (to) => {
    this.InProps(to);
  }
  InProps = (setting) => {
    this.props.navigation.navigate('ChangeProperty',{
        activeDoc: { params: { _key: BaoDB.rootUser}},
        toEdit: 'userProfile-'+setting,
        toUpdate: this.onSaveSetting.bind(this)
      });
  }

  _renderImageFromAvatar = () => {
    return FastImage ? (
                    <FastImage 
                      source={{ uri: encodeURI(BaoDB.rootUser.avatar), cache: FastImage.cacheControl.immutable }}
                      style={[styles.image,{height: '100%', width: '100%', marginLeft: 0, marginTop: 0, borderRadius: 50, backgroundColor: '#222'}]}
                      resizeMode={FastImage.resizeMode.cover}
                      >

                      </FastImage>
                      
                  ) : (
                      <Image style={styles.image} source={{uri: encodeURI(BaoDB.rootUser.avatar)}}/>
                  )
                
  }
    _renderAvatar = () => {
      const useProfile = isMe == true ? BaoDB.rootUser : profile;
        return (
          <TouchableRipple 
            onPress={() => this.selectPhotoTapped()}
            style={{
              height: 200,
              width: 200,
              backgroundColor: '#000',
              borderRadius: 50,
              marginLeft: 0
            }}>
                {
                    useProfile && useProfile.avatar && FastImage && (
                      <FastImage 
                        source={{ uri: encodeURI(useProfile.avatar), cache: FastImage.cacheControl.immutable}}
                        style={[styles.image,{height: '100%', width: '100%', marginLeft: 0, marginTop: 0, borderRadius: 50, backgroundColor: '#222'}]}
                        resizeMode={FastImage.resizeMode.cover}
                        >
                      </FastImage>
                    )
                  }
          </TouchableRipple>
          )
      
    }
    $renderSettings = () => {
        const currentLanguage = (BaoDB.rootUser && BaoDB.rootUser.languages) ? BaoDB.rootUser.languages : getLangString();
        return (
            <View
                    style={{
                      flex: 1,
                      paddingTop: 10
                    }}
                  >
                  
                  <Text
                   style={[globalStyles.sectionHeaderText, {color: isDarkMode == true ? '#fff' : '#000'}]}>
                      {Languages.myAccount[getLang()].toUpperCase()}
                  </Text>
                  <Text style={{color: isDarkMode == true ? '#fff' : '#999', fontSize: 14, fontWeight: '600', marginLeft: 10, position: 'absolute', right: 25, top: 25}}>
                            {(BaoDB.rootUser.roles && BaoDB.rootUser.roles.includes('admin')) && 'ADMIN'}
                          </Text>
                 {/* <TouchableOpacity style={globalStyles.settingsItemList} onPress={() => Snackbar.show({ title: 'You cannot change your username yet.', duration: Snackbar.LENGTH_LONG })}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5} md={5} lg={5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.Username[getLang()]}</Text>
                        </Col>
                        <Col sm={6} md={6.5} lg={6.5} style={{}}>
                          <Text numberOfLines={1} style={[globalStyles.settingsItemListEditableValue, {color: isDarkMode == true ? '#fff' : '#000'}]}>{BaoDB.rootUser.name ? BaoDB.rootUser.name : 'Add a name'}</Text>
                        </Col>
                        <Col sm={1} md={0.5} lg={0.5} style={{marginTop: 3, paddingLeft: 10 }}>
                          <EntypoIcono name="dot-single" size={15} style={{color: isDarkMode == true ? '#fff' : '#000'}}/>
                        </Col>
                      </Row>
                    </View>
                  </TouchableOpacity>
                  <SettingsDividerLong dividerStyle={{
                    backgroundColor: 'rgba(0,0,0,.2)'
                  }}/>*/}


                  <TouchableOpacity style={globalStyles.settingsItemList} onPress={() => editProperty('email')}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5} md={5} lg={5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>E-mail</Text>
                        </Col>
                        <Col sm={6} md={6.5} lg={6.5} style={{}}>
                          <Text numberOfLines={1} style={[globalStyles.settingsItemListEditableValue, {color: isDarkMode == true ? '#fff' : '#000'}]}>{BaoDB.rootUser.email ? BaoDB.rootUser.email : 'Add an email'}</Text>
                        </Col>
                        <Col sm={1} md={0.5} lg={0.5} style={{marginTop: 3, paddingLeft: 10 }}>
                          <EntypoIcono name="chevron-thin-right" size={15} style={{color: isDarkMode == true ? '#fff' : '#000'}}/>
                        </Col>
                      </Row>
                    </View>
                  </TouchableOpacity>
                  <SettingsDividerLong dividerStyle={{
                    backgroundColor: 'rgba(0,0,0,.2)'
                  }}/>

                  <TouchableOpacity style={globalStyles.settingsItemList} onPress={() => editProperty('full_name')}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5} md={5} lg={5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.Name[getLang()]}</Text>
                        </Col>
                        <Col sm={6} md={6.5} lg={6.5} style={{}}>
                          <Text numberOfLines={1} style={[globalStyles.settingsItemListEditableValue, {color: isDarkMode == true ? '#fff' : '#000'}]}>{BaoDB.rootUser.full_name ? BaoDB.rootUser.full_name : 'Set your name'}</Text>
                        </Col>
                        <Col sm={1} md={0.5} lg={0.5} style={{marginTop: 3, paddingLeft: 10 }}>
                          <EntypoIcono name="chevron-thin-right" size={15} style={{color: isDarkMode == true ? '#fff' : '#000'}}/>
                        </Col>
                      </Row>
                    </View>
                  </TouchableOpacity>
                  <SettingsDividerLong dividerStyle={{
                    backgroundColor: 'rgba(0,0,0,.2)'
                  }}/>
           

                  <Text
                   style={[globalStyles.sectionHeaderText, {marginTop: 20, color: isDarkMode == true ? '#fff' : '#000'}]}>
                    {Languages.content[getLang()].toUpperCase()}
                  </Text>

               
                  <TouchableOpacity style={globalStyles.settingsItemList} onPress={() => editProperty('languages')}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5} md={5} lg={5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.language[getLang()]}</Text>
                        </Col>
                        <Col sm={6} md={6.5} lg={6.5} style={{}}>
                          <Text numberOfLines={1} style={[globalStyles.settingsItemListEditableValue, {color: isDarkMode == true ? '#fff' : '#000'}]}>{currentLanguage ? currentLanguage : 'English'}</Text>
                        </Col>
                        <Col sm={1} md={0.5} lg={0.5} style={{marginTop: 3, paddingLeft: 10 }}>
                          <EntypoIcono name="chevron-thin-right" size={15} style={{color: isDarkMode == true ? '#fff' : '#000'}}/>
                        </Col>
                      </Row>
                    </View>
                  </TouchableOpacity>

                  <SettingsDividerLong dividerStyle={{
                    backgroundColor: 'rgba(0,0,0,.2)'
                  }}/>

                  <TouchableOpacity style={globalStyles.settingsItemList}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5} md={5} lg={5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.liveSync[getLang()]}</Text>
                        </Col>
                        <Col sm={1} md={1.5} lg={1.5} style={{}}>

                        </Col>
                        <Col sm={6} md={5.5} lg={5.5} style={{marginTop: 0, paddingRight: 10, alignItems: 'flex-end' }}>
                          <ToggleSwitch
                            isOn={BaoDB.rootUser.autoSync}
                            onColor="#51b346"
                            offColor="#f44336"
                            label={BaoDB.rootUser.autoSync ? 'ON' : 'OFF'}
                            labelStyle={{ color: "#555", fontWeight: "900" }}
                            size="medium"
                            onToggle={isOn => toggleUser('sync', isOn)}
                          />
                        </Col>
                      </Row>
                    </View>
                  </TouchableOpacity>
                  <SettingsDividerLong dividerStyle={{
                    backgroundColor: 'rgba(0,0,0,.2)'
                  }}/>

                  {/* <TouchableOpacity style={globalStyles.settingsItemList}>
                    <View>
                      <Row size={12} style={{marginTop: 0, padding: 5}}>
                        <Col sm={5} md={5} lg={5} style={{}}>
                          <Text style={[globalStyles.settingsItemListEditable, {marginLeft: 10, color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.builtInWriter[getLang()]}</Text>
                        </Col>
                        <Col sm={1} md={1.5} lg={1.5} style={{}}>

                        </Col>
                        <Col sm={6} md={5.5} lg={5.5} style={{marginTop: 0, paddingRight: 10, alignItems: 'flex-end' }}>
                          <ToggleSwitch
                            isOn={BaoDB.rootUser.writerMode}
                            onColor="#51b346"
                            offColor="#f44336"
                            label={BaoDB.rootUser.writerMode ? 'ON' : 'OFF'}
                            labelStyle={{ color: "#555", fontWeight: "900" }}
                            size="medium"
                            onToggle={isOn => this.toggleUser('writer', isOn)}
                          />
                        </Col>
                      </Row>
                    </View>
                  </TouchableOpacity>
                  <SettingsDividerLong dividerStyle={{
                    backgroundColor: 'rgba(0,0,0,.2)'
                  }}/>*/}
          

         
         
         
        </View>
        );
     
      
    }
	  render(){
      const deviceWidth = Dimensions.get("window").width;
      const deviceHeight = Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");
       if(BaoDB.rootUser != null){
        return(
          <View style={{flex: 1, backgroundColor: isDarkMode == true ? '#111]' : '#f7f8fa'}}>
            <ScrollView style={{marginTop: -getHeaderHeight(), height: Dimensions.get('window').width }}>
              <View style={{
                height: getHeaderHeight() + 75,
                width: '100%',
              }}>
              
                  <Row size={12} style={{marginTop: 0, paddingTop: 3}}>
                        <Col sm={12} md={12} lg={12} style={{height: getHeaderHeight() + 10  }}>
                          
                        </Col>
                        <Col sm={10} md={11} lg={11} style={{justifyContent: 'space-between', flexDirection:'column',flexWrap: 'wrap', }}>
                          <Text  numberOfLines={1} style={{color: isDarkMode == true ? '#fff' : '#000', fontSize: 22, marginLeft: 15, marginTop: 10}}>
                            @{BaoDB.rootUser && BaoDB.rootUser.name}
                          </Text>
                          
                        </Col>
                        <Col sm={2} md={1} lg={1} style={{jsustifyContent: 'flex-end'}}>
                          {this._renderAvatar()}
                        </Col>

                      </Row>
                    

              </View>
              {this.state.isOpenReLogin == true && <View>

                 <Row size={12} style={{}}>
                 <Col sm={12} md={12} lg={12}>
                    <Text style={{color: '#000', textAlign: 'center', marginTop: 15, fontSize: 17, fontWeight: '500'}}>
                      Session expired
                    </Text>
                    <Text style={{color: '#a2a2a2', textAlign: 'center', marginTop: 2, fontSize: 14, fontWeight: '500'}}>
                      Refresh it to save settings.
                    </Text>
                  </Col>

                  <Col sm={12} md={12} lg={12}>
                    <TextInput
                            //onChangeText={(text) => this.setState({title: text})}
                            style={{ alignSelf: 'flex-start', marginTop: 10, color: '#fff', backgroundColor: '#111', padding: 10, fontSize: 18, width: '100%',height: 40}}
                            value={this.state.confirmPassword}
                            placeholder={"Type password"}
                            onChangeText={(text) => this.setState({confirmPassword: text})}
                            placeholderTextColor="#999"
                            multiline={false}
                            secureTextEntry={true}
                            autoCapitalize = 'none'
                            autoCorrect={false}
                          />
                  </Col>

                  <Col sm={12} md={12} lg={12} style={{justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => this.reLogin()} style={{marginTop: 10, width: '50%', justifyContent: 'center', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,.4)', borderRadius: 8}}>
                     <Text style={[styles.headlineAuth, {color: '#fff', margin: 10, textAlign: 'center', fontSize: 16}]}>Sign in</Text>
                    </TouchableOpacity>
                  </Col>
                  
                </Row> 
                </View>}
              {this.$renderSettings()}
            </ScrollView>

            
          </View>
        );
         } else {
            return (
              <View style={{flex: 1, backgroundColor: isDarkMode == true ? '#111' : '#fff', justifyContent:'center'}}>
                        <Spinner style={{alignSelf: 'center'}} isVisible={true} size={35} type={Platform.OS == 'ios' ? "Arc" : 'ThreeBounce'} color={isDarkMode == true ? '#fff' : '#111'}/>
              </View>
                        )
          }
    }

}