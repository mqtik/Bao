import React, {Component, PureComponent, useState, useContext, useEffect} from 'react';
import {Platform, TouchableNativeFeedback, StyleSheet, Text, FlatList, TextInput, ActivityIndicator, View, Dimensions } from 'react-native';

import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../../utils/context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'
import { getLang, Languages } from '../../static/languages';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation, getHeaderNavHeight} from '../../services/sizeHelper';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { HomeSVG, MenuIcon } from "../../utils/vectors"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserAvatar } from '../../utils/renders';

import { SkeletonSection, SkeletonGrid, SkeletonList } from '../../utils/skeletons'
import { CollectionsNone, FollowingNone, LikedNone, NotificationsNone, NoPublishedBooks } from '../../utils/vectors';

import { TouchableRipple, Avatar, Searchbar, IconButton, Button, Checkbox, Badge, Paragraph, Dialog, Portal, RadioButton } from 'react-native-paper';

import Drawer from '../../components/drawer.js';

const Touchable = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback;

const SecondRoute = () => (
  <View />
);

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
const initialLayout = { width: ancho };



function HomeScreen({navigation}){

  const isDarkMode = useDarkMode();
  const ClouchDB = useContext(Clouch);
  const BaoDB = useContext(Newt);
  const [section, setSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState(0);
  const [addressOpen, setAddressOpen] = useState(0);
  const drawerRef = React.useRef();

  // Effects
  useEffect(() => {
    console.log("bao root user!", BaoDB)
    navigation.setOptions({
      headerTitle: 'Bao',
      headerRight: (props) => (
        <TouchableRipple onPress={() => setAddressOpen(true)} style={{borderRadius:10, marginRight: 10}}>
          <View style={{display: 'flex', position: 'relative', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontWeight: '600', fontSize: 18}} numberOfLines={1}>J. Valle 5488</Text>
            <Icon
               name={'chevron-down'}
               color={isDarkMode == true ? '#fff' : '#000'}
               size={20}
             />
          </View>
        </TouchableRipple>),
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
      )
    });
  },[]);

  function $addressSelector(){
    navigation.navigate("Address", {
        
      })
  }
  function switchSection(newSection){
    setSection(newSection)
    // if(newSection == 1 && BaoDB.collections == null){
    //   BaoDB.triggerAction('collections');
    // }
    // if(newSection == 2 && BaoDB.following == null){
    //   BaoDB.triggerAction('following');
    // }
    // if(newSection == 3 && BaoDB.liked == null){
    //   BaoDB.triggerAction('liked');
    // }
    // if(newSection == 4 && BaoDB.notifications == null){
    //   BaoDB.triggerAction('notifications');
    // }
  }

  function Home(){
    return (
          <View>
          </View>
         )
  }

  function Restaurants(){
    return (
          <View>
          </View>
         )
  }

  function Food(){
    return (
          <View>
          </View>
         )
  }

  function Promos(){
    return (
          <View>
          </View>
         )
  }

  function Coupons(){
    return (
          <View>
          </View>
         )
  }

  function Notifications(){
    return (
          <View>
          </View>
         )
  }

  const renderScene = SceneMap({
    home: React.memo(Home),
    restaurants: Restaurants,
    food: Food,
    promos: Promos,
    notifications: Notifications
  });

  const solapas = {
         index: section || 0,
         routes: [
          { key: 'home', title: 'Home' },
          { key: 'restaurants', title: (BaoDB.accountType == 'business' ? 'Mis Restaurantes' : 'Restaurantes') },
          { key: 'food', title:  'Food' },
          { key: 'promos', title: 'Promos' },
          { key: 'notifications', title: 'Notifications' }
         ]};


  return (
     <View style={{flex:1, backgroundColor: isDarkMode == true ? '#111111' : '#f2f2f2'}}>
      <View style={{flex:1}}>
        <TabView
            navigationState={solapas}
            onIndexChange={switchSection}
            renderScene={renderScene}
            lazy={true}
            key={BaoDB.accountType.toString()}
           // renderLazyPlaceholder={() => <SkeletonSection />}
            renderTabBar={props => Platform.OS == 'ios' ? null :
                <TabBar
                  {...props}
                  scrollEnabled={true}
                  indicatorStyle={{ 
                    backgroundColor: isDarkMode == true ? '#fff' : '#000', 
                    height:3 }}
                  style={{position: 'absolute', top:0, left:0, right:0, zIndex:99, paddingTop: 2, height: getHeaderHeight(), backgroundColor: isDarkMode == true ? '#000' : '#fff' }}
                  
                  renderLabel={({ route, focused, color }) => {
                    return (
                      <View style={{display: 'flex', alignItems: 'center',justifyContent: 'center', flexDirection: 'row'}}>
                      
                      { route.key != 'picked' && (<Icon
                          name={route.key == 'home' ? 'home-map-marker' : ( route.key == 'restaurants' ? 'silverware-fork-knife' : ( route.key == 'food' ? 'food' : route.key == 'promos' ? 'account-clock' : 'bell-outline'))}
                          color={isDarkMode == true ? '#fff' : '#000'}
                          size={20}
                        />)}
                      <Text style={{fontSize:18, marginLeft:5, fontWeight: '700'}}>{route.title}</Text>
                      </View>
                    )
                    
                  }}
                />
              }
         />
      </View>
      <Portal>
              <Dialog visible={addressOpen} onDismiss={() => setAddressOpen(false)}>
                <Dialog.Title>Direcciones</Dialog.Title>
                <Dialog.Content>
                          <FlatList
                             data={BaoDB.addresses}
                             //horizontal={true}
                             style={{}}
                             contentContainerStyle={{flexGrow: 1}}
                             style={{maxHeight: 300}}
                             renderItem={({ item, index }) => 
                                <TouchableRipple onPress={() => onSetAddress(item, index)} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: borderColorBg, marginBottom: 0, padding: 15}}>
                                    <View style={{height:60, justifyContent: 'space-between', alignItems: 'center', flex:1, flexDirection:'row', marginTop: 2}}>
                                      <View style={{width: '80%'}}>
                                        <Text numberOfLines={1} style={{color: '#666', margin: 1, width: '100%', marginLeft: 8, fontSize: 16,fontWeight:'700'}}>
                                          {index + 1}. {item.name}
                                        </Text>
                                        <Text numberOfLines={1} style={{color: '#666', margin: 1, width: '80%', marginLeft: 8, fontSize: 11,fontWeight:'400'}}>
                                          test
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
                  <Button onPress={() => toggleSelect()} icon="select-all" mode="contained" style={{ backgroundColor: '#2575ed',}}>
                                 Nueva dirección
                              </Button>
                  <Button color={"#2575ed"} onPress={() => setAddressOpen(false)}>Cerrar</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>

     </View>
  );
}

export default HomeScreen;
