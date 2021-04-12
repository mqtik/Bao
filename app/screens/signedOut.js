/**
 * Signed Out Component
 * Login & Register
 *
 * @format
 * @flow
 */
// (#) Dependencies for this script
// (*) Globals
import React, {Component, PureComponent, useContext, useState, useEffect, useRef} from 'react';
import {Platform, StyleSheet, Text, InputAccessoryView, Linking, TouchableHighlight, FlatList, ScrollView, StatusBar, TextInput, View, Alert, TouchableOpacity, Image, ImageBackground, ActivityIndicator, Dimensions, Keyboard, findNodeHandle } from 'react-native';

import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'

import { Clouch, withClouch, Newt } from '../utils/context'
import { tagsSignedOut } from '../utils/constants'
import { UserSelect } from '../utils/renders'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast, {DURATION} from 'react-native-easy-toast'
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
import { getLang, Languages } from '../static/languages';
import { BlurView, VibrancyView } from "../../libraries/blur";
import SplashScreen from 'react-native-splash-screen'
import { Modal, TouchableRipple, Button, Menu, Divider, Badge, IconButton, Paragraph, Dialog, Portal  } from 'react-native-paper';
// (*) for SignedOut
import API from '../services/api';
import {Column as Col, Row} from 'react-native-flexbox-grid';
//import Modal from "react-native-modal";
import FastImage from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';
import AwesomeButton from "react-native-really-awesome-button";
import { useHeight, useWidth } from '../utils/hooks'

import * as Progress from 'react-native-progress';
import RNRestart from 'react-native-restart'; 
import changeNavigationBarColor, {
  HideNavigationBar,
  ShowNavigationBar,
} from 'react-native-navigation-bar-color';

import { InAppBrowser } from 'react-native-inappbrowser-reborn'

import { Logo, WaveSignedOut, RicePack, ChickenRestaurant, MenuRecipes, FoodOnWheels, WaiterAtHome } from '../utils/vectors'
// Assets
//import NewtJPG from '../../assets/icons/newt_icon.jpg';
import { SignedOutCSS } from '../styles'

// (-) Deprecated Modules (soon to be removed completely)
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';
// const DarkMode = { currentMode: initialMode }
// eventEmitter.on('currentModeChanged', newMode => RNRestart.Restart());

const slides = [
                  {
                    key: 'meetBao',
                    title: 'Bao',
                    text: 'Una plataforma que conecta restaurantes, couriers y ansiosos clientes.',
                    icon: 'network',
                    bgColor: 'blue',
                    textColor: '#ffffff',
                    colors: ['#000', '#111'],
                  },
                  {
                    key: 'nearPlaces',
                    title: "Lugares cercanos",
                    text: "Recibe pedidos a tu puerta de los restaurantes cerca de tu area",
                    icon: 'thunder-cloud',
                    bgColor: 'orange',
                    textColor: '#000000',
                    colors: ['#FED3D1', '#ffffff'],
                  },
                  {
                    key: 'menuRecipes',
                    title: "Menu",
                    text: "Revisá datos, ingredientes y precio antes de pagar.",
                    icon: 'globe',
                    bgColor: 'yellow',
                    textColor: '#ffffff',
                    colors: ['#F76672', '#FB2B3A'],
                  },
                  {
                    key: 'orderFromPhone',
                    title: "Pedí",
                    text: "Cuando hayas terminado de elegir, pagá online",
                    icon: 'onedrive',
                    bgColor: 'brown',
                    textColor: '#000000',
                    colors: ['#ffffff', '#E3E3E3'],
                  },
                  {
                    key: 'foodOnWheels',
                    title: "Órden sobre ruedas",
                    text: "Te notificaremos el progreso de tu pedido en todo momento",
                    icon: 'language',
                    bgColor: 'green',
                    textColor: '#000000',
                    colors: ['#FFE07D', '#F4D902'],
                  },
                  {
                    key: 'vegMode',
                    title: "Modo vegetariano",
                    text: "Recibe resultados que se adapten a tus gustos",
                    icon: 'language',
                    bgColor: '#fff',
                    textColor: '#000000',
                    colors: ['#A3E262', '#539510'],
                  }
                  
                ];

function SignedOut({ navigation }){
  // Constant Hooks
  const alto = useHeight();
  const ancho = useWidth();

  const isDarkMode = useDarkMode();
  const ClouchDB = useContext(Clouch);
  const NewtDB = useContext(Newt);


  // States
  const [ section, setSection ] = useState('login');

  const [ loggedInOkay, setLoggedInOkay ] = useState(false);
  const [ usernameSuggestions, setUsernameSuggestions ] = useState(null);
  const [ usersSelected, setUsersSelected ] = useState(null);
  const [ stepLogin, setStepLogin ] = useState('username')
  const [ stepRegister, setStepRegister ] = useState('email')
  const [ errorLogin, setErrorLogin ] = useState(null);
  const [ errorRegister, setErrorRegister ] = useState(null);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ optionsOpen, setOptionsOpen ] = useState(false);
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ repassword, setRePassword ] = useState('');
  const [ email, setEmail ] = useState('');

  const [ help, setHelp ] = useState(false);

  const [ name, setName ] = useState('');

  // Refs
  const modalInputScroll = React.useRef(null);
  const emailRegisterRef = React.useRef();
  const usernameRegisterRef = React.useRef();
  const nameRegisterRef = React.useRef();
  const passwordRegisterRef = React.useRef();
  const rePasswordRegisterRef = React.useRef();
  const passwordLoginRef = React.useRef();

  const SignedOutStyles = useDynamicStyleSheet(SignedOutCSS)
  // Functions
  function scrollToInput(node){
      // Add a 'scroll' ref to your ScrollView
      if(modalInputScroll)
      modalInputScroll.current.scrollToFocusedInput(node)
  }

  async function checkUsername(next){
    if(username == '' || username == null){
      return Snackbar.show({ title: Languages.introMailOrUser[getLang()], duration: Snackbar.LENGTH_SHORT });
    }

    if(username.includes('@')){
        if(username.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
          return Snackbar.show({ title: Languages.mailFormatInvalid[getLang()], duration: Snackbar.LENGTH_SHORT });
        }
        let uE = await ClouchDB.Auth().checkRemoteEmail(username).catch(e => null);



          if(uE == null){
            setErrorLogin({
                message: Languages.somethingWrongValidatingMail[getLang()]
              })
            return;
          }

          if(uE && uE.length == 0){
            setErrorLogin({
                message: Languages.emailNotMatch[getLang()]
              });
            // setSection('register');
            // setEmail(username);
            // setStepRegister('name');
            return;
          }

          if(uE && uE.length == 1){
            setUsersSelected(uE);
            setUsername(uE[0].name);
            setErrorLogin(null);
          }

          setUsersSelected(uE);
          setErrorLogin(null);
          return;
          
    } else {
          let u = await ClouchDB.Auth().checkRemoteUsername(username);
          if(u.error && u.error == 'not_found'){
            setErrorLogin({
                message: '@'+username+' '+Languages.doesNotExist[getLang()]
              })
            return;
            //return Snackbar.show({ title: '@'+username+' does not exists', duration: Snackbar.LENGTH_SHORT });
          }

          setErrorLogin(null);
          setUsersSelected([u]);

    }
    return;
   }
   async function checkUsernameRegister(){
      if(username == '' || username == null){
        return Snackbar.show({ title: Languages.introMailOrUser[getLang()], duration: Snackbar.LENGTH_SHORT });
      }

      if(username.match(/^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/) == null){
        setErrorRegister({
                  message: 'Username must contain at least 2 (and not invalid) characters.'
              })
        return;
        }

      let u = await ClouchDB.Auth().checkRemoteUsername(username);

      if(u && u.error && u.error == 'not_found'){
        setErrorRegister(null);
        setStepRegister('usernamemailvalid');
      } else {
        setErrorRegister({
                  message: Languages.usernameAlreadyExists[getLang()]
              })
      }

    }
   async function checkEmailRegister(){
    if(email == '' || email == null){
      setErrorRegister({
                message: Languages.introMail[getLang()]
              })
      return;
    }

    if(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
      setErrorRegister({
                message: Languages.mailFormatInvalid[getLang()]
              })
      return;
    }
    let uE = await ClouchDB.Auth().checkRemoteEmail(email);
    if(uE && uE.length == 0){
      setStepRegister('name');
      setErrorRegister(null);
    } else {
      setErrorRegister({
                message: Languages.mailAlreadyExists[getLang()]
              })
    }

  }

  function onSelectUser(it){
    if(!it){
      return;
    }
    setUsersSelected([it]);
    setUsernameSuggestions(it.name);
   }

  function userGenerate(n){
        let name = n.replace( /^[^a-z]+|[^a-z\d_\-.]|[_\-.](?![a-z\d])/gi, '' );    
        if ( n != name ) {
        }
        return name.toLowerCase(); 
  }

  function cleanAllErrors(){
     setErrorLogin(null);
     setErrorRegister(null);
  }

  function setEndMail(mail){
    let s = '@gmail.com';
    if(mail == 'gmail'){
      s = '@gmail.com';
    } if(mail == 'hotmail'){
      s = '@hotmail.com';
    } if(mail == 'outlook'){
      s = '@outlook.com';
    }  
    if(section == 'login'){
      s = username+''+s
      setUsername(s);
    } else if(section == 'register'){
      s = email+''+s
      setEmail(s);
    }
   }

   function setEndUsername(u){
     setUsername(u);
   }
   function clearStates(){
     setUsername(null);
     setPassword(null);
     setName(null);
     setEmail(null);
     setStepLogin('username');
     setStepRegister('email');
     setUsernameSuggestions(null);
     setUsersSelected(null);
     setSection('login');
   }
   function checkFullName(){
      if(name == '' || name == null){
        return Snackbar.show({ title: Languages.introMailOrUser[getLang()], duration: Snackbar.LENGTH_SHORT });
      }
      let suggest = [
          { suggest: userGenerate(name)},
          { suggest: userGenerate(name)+Math.floor(Math.random() * 6) + 1 }
         ];
      setStepRegister('username');
      cleanAllErrors();
      setUsernameSuggestions(suggest);
   }
   async function onLogin(){
      Keyboard.dismiss()
    /*Snackbar.show({
            title: 'Please agree to this.',
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              title: 'AGREE',
              onPress: () => Snackbar.show({ title: 'Thank you!' }),
              color: 'green',
            },
          })*/

      if(username == null || password == null){
        Snackbar.show({ title: 'Algunos espacios han sido dejados en blanco', duration: Snackbar.LENGTH_SHORT });
        return;
      }
      
      cleanAllErrors()

      let signIn = await ClouchDB.Auth().signIn(username.toLowerCase(), password).catch(err => err);
      __DEV__ && console.log("error sign in on login!", signIn, username, password)
      if(signIn && signIn.error && signIn.error == 'unauthorized'){
       Snackbar.show({ 
         title: 'Incorrect credentials',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { clearStates() },
          },
          });
      } else if(signIn && signIn.status && signIn.status == 0) {
        Snackbar.show({ 
         title: 'Something went wrong. Try later.',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { clearStates() },
          },
          });
      } else if(signIn && signIn.error && signIn.error == true){
       Snackbar.show({ 
         title: 'Incorrect credentials',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { clearStates() },
          },
          });
      } 

      __DEV__ && console.log("on login moves on!!", signIn)
      if(signIn.ok && signIn.name){
        setLoggedInOkay(true);
        __DEV__ && console.log("before starting sess!")
        let session = await ClouchDB.Auth().getSession().catch(e => e);
        __DEV__ && console.log("get session?", session)
        let user = await ClouchDB.Auth().getRemoteUser(signIn.name).catch(e => e);
        __DEV__ && console.log("get user?", user)
        let saveUser = await(ClouchDB.Auth().saveMe(user));
        __DEV__ && console.log("get saveUser?", saveUser)
        let saveKey = await(ClouchDB.Auth().setKey(saveUser.name)).catch(e => e);
        __DEV__ && console.log("get saveKey?", saveKey)
        __DEV__ && console.log("user platforms!", user, session, user, saveUser, saveKey)

        NewtDB.checkSession();
        if(user){
          let reEdit = false;
          if(user.platforms){
            if((user.platforms && !user.platforms.includes("mobile"))){
              user.platforms.push("mobile");
              reEdit = true;
            }
           } else {
              user.platforms = ["mobile"];
              reEdit = true;
           }
           if(reEdit == true){
            let upd = ClouchDB.Auth().updateUser(user);
           }
          
         }
        
      } else {
        setErrorLogin({
                message: 'Something went wrong signing in. Try again later.'
              })
      }
      return;
   }

  async function onRegister(){
    Keyboard.dismiss()
      

    cleanAllErrors()
    if(name == null || email == null || username == null || password == null){
        //Snackbar.show({ title: 'Algunos espacios han sido dejados en blanco', duration: Snackbar.LENGTH_SHORT });
        setErrorRegister({
                message: 'Some fields are empty.'
              })
        return;
    }

    if(username.match(/^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/) == null){
      setErrorRegister({
                message: 'Username must contain at least 2 (and not invalid) characters.'
              })
      return;
      }

   

    if(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
      setErrorRegister({
                message: 'E-mail is invalid'
              })
     // Snackbar.show({ title: 'E-mail is invalid', duration: Snackbar.LENGTH_SHORT });
      return;
    }

    if(password != repassword){
      setErrorRegister({
                message: 'Passwords do\'nt match'
              })
      //Snackbar.show({ title: 'Passwords do\'nt match', duration: Snackbar.LENGTH_SHORT });
      return;
    }


      
     let signUp = await ClouchDB.Auth().signUp(name, email, username.toLowerCase(), password).catch(err => err);
     __DEV__ && console.log("sign up go!", signUp)
     if(signUp.error){
      if(signUp.error == 'conflict'){
        setErrorRegister('The username already exists.');
        Snackbar.show({ title: 'Username already exists. Try another one.', duration: Snackbar.LENGTH_SHORT });
      }
      if(signUp.error == 'not_found'){
        setErrorRegister('Something went wrong signing up. Restart Newt.');
        Snackbar.show({ title: 'Something went wrong signing up. Restart Newt.', duration: Snackbar.LENGTH_SHORT });
      }
     }
     if(signUp == null){
      return Snackbar.show({ 
         title: 'Something went wrong. Try with another username.',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { this.setState({username: '', password:'', name: '' }) },
          },
        });
     }
     if(signUp.ok){
      return onLogin();
     }
     return;
     

       Snackbar.show({ 
         title: 'Username is taken',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { this.setState({username: '', password:'', name: '' }) },
          },
          });




   }

  // Component updates
  useEffect(() => {
    changeNavigationBarColor('#000000', isDarkMode == true ? true : false);
    SplashScreen.hide();
  }, [])

  // Render Functions 
  function _introItem(props){

      return (
        <View
          style={[SignedOutStyles.mainContent, {
            width: '100%',
            position: 'absolute',
            top: 0,
            bottom:0,
            right:0,
            left:0,
            paddingTop:30,
            backgroundColor: props.colors[1],
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }]}
        > 
        <LinearGradient
          style={{
            position: 'absolute',
            height: '110%',
            width: '100%'
          }}
          colors={[props.colors[0], props.colors[1]]}
          start={{x: 0, y: .1}} end={{x: .1, y: 1}}
        />
              <View style={{marginBottom: 20}}>
                {
                  props.key == 'meetBao' && 
                  <Logo 
                    color={isDarkMode == true ? '#ffffff' : '#000000'} 
                    style={{
                      zIndex:9,
                      width: 50,
                      }} 
                    />
                }
                {
                  props.key == 'nearPlaces' &&
                  <ChickenRestaurant />
                }
                {
                  props.key == 'menuRecipes' &&
                  <MenuRecipes />
                }
                {
                  props.key == 'orderFromPhone' &&
                  <WaiterAtHome />
                }
                {
                  props.key == 'foodOnWheels' &&
                  <FoodOnWheels />
                }
                {
                  props.key == 'vegMode' &&
                  <RicePack />
                }
              </View>
              <View style={{marginTop: 30}}>
                <Text style={[SignedOutStyles.title,{fontWeight: '700',fontSize: 30, textAlign: 'center', color: props.textColor}]}>{props.title}</Text>
                <Text style={[SignedOutStyles.text, {textAlign: 'center',fontSize:22, maxWidth: 300, color: props.textColor}]}>{props.text}</Text>
              </View>
        </View>
    );
  }
  function _onRenderLogin(){

     return (
       <View style={[SignedOutStyles.flexElement, {width:'95%', alignSelf: 'center'}]}>

       {usersSelected == null && 
        <View style={styles.linesView}>
          <Text style={[SignedOutStyles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.signInModalTitle[getLang()].toUpperCase()}</Text>
           <Text style={[SignedOutStyles.subline, { color: isDarkMode == true ? '#ccc' : '#333'}]}>{Languages.signInModalDesc[getLang()]}</Text>
         </View>
       }
       {(usersSelected && usersSelected.length == 1) && 
        <View style={styles.linesView}>
          <Text style={[SignedOutStyles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.signInModalTitlePass[getLang()]}</Text>
           <Text style={[SignedOutStyles.subline, { color: isDarkMode == true ? '#ccc' : '#333'}]}>{Languages.signInModalDescPass[getLang()]}</Text>
         </View>
       }
       {(usersSelected && usersSelected.length > 1) && 
        <View style={styles.linesView}>
          <Text style={[SignedOutStyles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>CHOOSE ACCOUNT</Text>
           <Text style={[SignedOutStyles.subline, { color: isDarkMode == true ? '#ccc' : '#333'}]}>These accounts are linked{"\n"}to your mail.</Text>
         </View>
       }
         
        { usersSelected == null && 
          <View style={{marginTop: 10, width: '100%'}}>
             <TextInput style = {[styles.input, {width: '100%',borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
                   underlineColorAndroid = "transparent"
                   placeholder = {Languages.usernameOrEmail[getLang()]}
                   placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
                   autoCapitalize = "none"
                   keyboardType={'email-address'}
                   textContentType={'emailAddress'}
                   onFocus={(event) => {
                      scrollToInput(findNodeHandle(event.target))
                    }}
                   autoCorrect={false}
                    //onSubmitEditing={() => { this.passwordLogin.focus(); }}
                   value={username}
                   inputAccessoryViewID={'usernameLogin'}
                   onChangeText={(text) => setUsername(text.replace(/\s/g, ''))}/>

                   {
                    Platform.OS == 'ios' && <InputAccessoryView nativeID={'usernameLogin'}>
                    <View horizontal={true} style={{flex: 1, display: 'flex', flexDirection: 'row',padding: 5, justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('gmail')}
                      style={SignedOutStyles.suggestButton}
                    ><Text>@gmail.com</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('hotmail')}
                      style={SignedOutStyles.suggestButton}
                    ><Text>@hotmail.com</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('outlook')}
                      style={SignedOutStyles.suggestButton}
                    ><Text>@outlook.com</Text></TouchableOpacity>
                    </View>
                  </InputAccessoryView>
                   }
                   
            { stepLogin == 'username' &&
                <AwesomeButton
                        progress
                        onPress={async(next) => {
                          /** Do Something **/
                          let c = await checkUsername()

                          next()
                        }}
                        style={{margin: 5,position:'absolute',right:0}}
                        width={50}
                        height={50}
                        raiseLevel={0}
                        borderRadius={8}
                        borderColor={'#111'}
                        
                        borderWidth={1}
                        textSize={17}
                        backgroundColor={'#000'}
                        backgroundProgress={'#333'}
                      >
                    <MaterialCommunityIcons name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
                </AwesomeButton>
             }
           </View>
     }

     { usersSelected != null && usersSelected.length > 0 && 
      <View style={{width: '100%'}}>
        {
          usersSelected.length == 1 && 
          <View style={{marginTop: 10,width: '100%'}}>
             <TextInput style = {[styles.input, {width: '100%',borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
                   underlineColorAndroid = "transparent"
                   placeholder = {Languages.usernameOrEmail[getLang()]}
                   placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
                   autoCapitalize = "none"
                   disabled={true}
                   autoCorrect={false}
                   editable={false} selectTextOnFocus={false}
                   value={'@'+usersSelected[0].name}
                   onChangeText={(text) => setUsername(text.replace(/\s/g, ''))}/>

            { usersSelected[0].avatar &&
                
                      <FastImage source={ usersSelected[0].avatar ? { uri: encodeURI(usersSelected[0].avatar), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : { uri: '../../../bg.jpg'}}
                       style={{
                        width: 45,
                        position: 'absolute',
                        right: 5,
                        marginTop:7,
                        borderRadius: 20,
                        zIndex: 9,
                        height: 45}}>
                     </FastImage>
            }
           </View>
        }
        {
          usersSelected && usersSelected.length > 1 && 
          <View style={{marginTop: 10, width: '100%'}}>
          <FlatList
              horizontal={true}
              data={usersSelected}
              renderItem={(item) => <UserSelect item={item} onPress={(item) => onSelectUser(item)} />}
              keyExtractor={(item, index) => index.toString()}
          />
          </View>
        }

      </View>
     }
      { usersSelected && usersSelected.length == 1 &&
      <View style={{width: '100%'}}>
       <View style = {{width: '100%', marginTop: 6}}>
        <TextInput style = {[styles.input, {width: '100%',borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               placeholder = {Languages.Password[getLang()]}
               secureTextEntry={true}

               textContentType={'password'}
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               autoCorrect={false}
               ref={passwordLoginRef}
               onFocus={(event) => {
                  scrollToInput(findNodeHandle(event.target))
                }}
               value={password}
              // onSubmitEditing={() => { this._onLogin() }}
               onChangeText={(text) => setPassword(text)}/>
       </View>
       <View style = {{marginTop: 3, justifyContent: 'center'}}>
         

         <AwesomeButton
                    progress
                    onPress={next => {
                      /** Do Something **/
                      onLogin()
                      next();
                    }}
                    style={{margin: 10, alignSelf: 'center'}}
                    width={250}
                    raiseLevel={0}
                    borderRadius={8}
                    borderColor={loggedInOkay ? '#2cbb2c' : '#111'}
                    
                    borderWidth={1}
                    textSize={17}
                    backgroundColor={loggedInOkay ? '#4ad84a' : '#000'}
                    backgroundProgress={'#333'}
                  >
                    { loggedInOkay ? Languages.Welcome[getLang()].toUpperCase() : Languages.signIn[getLang()].toUpperCase()}
        </AwesomeButton>

       </View>
       </View>
     }
       <View style = {{marginTop: 8}}>
          {
            errorLogin != null && 
          <Text style={styles.errorText}>
            {errorLogin.message}
          </Text>
          }
          
         {/*<Button color={isDarkMode == true ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)"}
               onPress={() => this.setState({statusTab: 'forgot', heightContainer: 290})}
               title="Forgot password?"/>*/}
       </View>
      </View>
      );
   }
   function _onRenderRegister(){

     return (
       <View style={[styles.flexElement, {width:'95%', alignSelf: 'center'}]}>
       <View style={styles.linesView}>
         <Text style={[styles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.signUpModalTitle[getLang()]}</Text>
         <Text style={[styles.subline,{ color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.signUpModalDesc[getLang()]}</Text>
       </View>

       
        <View style={{marginTop: 10, width: '100%'}}>
        <TextInput style = {[styles.input, {width: '100%',borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               ref={emailRegisterRef}
               placeholder = "E-mail"
               keyboardType={'email-address'}
               inputAccessoryViewID={'usernameLogin'}
              autoCorrect={false}
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               onFocus={(event) => {
                  scrollToInput(findNodeHandle(event.target))
                }}
               value={email}
               onChangeText={(text) => setEmail(text.replace(/\s/g, ''))}/>

               {Platform.OS == 'ios' && 
        <InputAccessoryView nativeID={'usernameLogin'}>
                    <View horizontal={true} style={{flex: 1, display: 'flex', flexDirection: 'row',padding: 5, justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('gmail')}
                      style={styles.suggestButton}
                    ><Text>@gmail.com</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('hotmail')}
                      style={styles.suggestButton}
                    ><Text>@hotmail.com</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('outlook')}
                      style={styles.suggestButton}
                    ><Text>@outlook.com</Text></TouchableOpacity>
                    </View>
                  </InputAccessoryView>
                }

          {
            stepRegister == 'email' &&
                <AwesomeButton
                          progress
                          onPress={async(next) => {
                            /** Do Something **/
                            let c = await checkEmailRegister()

                            next()
                          }}
                          style={{margin: 5,position:'absolute',right:0}}
                          width={50}
                          height={50}
                          raiseLevel={0}
                          borderRadius={8}
                          borderColor={'#111'}
                          
                          borderWidth={1}
                          textSize={17}
                          backgroundColor={'#000'}
                          backgroundProgress={'#333'}
                        >
                      <MaterialCommunityIcons name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
              </AwesomeButton>
          }

       </View>
      
      { (stepRegister != 'email' || stepRegister == 'name') &&
       <View style={{marginTop: 2, width: '100%'}}>
       <TextInput style = {[styles.input, {width: '100%',borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
                 underlineColorAndroid = "transparent"
                 ref={nameRegisterRef}
                 placeholder = "Name"
                 placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
                 //autoCapitalize = "none"
                 keyboardType={'name-phone-pad'}
                 autoCorrect={false}
                 onFocus={(event) => {
                    scrollToInput(findNodeHandle(event.target))
                  }}
                onSubmitEditing={() => emailRegisterRef && emailRegisterRef.focus && emailRegisterRef.focus()}
                 value={name}
                 onChangeText={(text) => setName(text)}/>

          {
            stepRegister == 'name' &&
                <AwesomeButton
                          progress
                          onPress={async(next) => {
                            /** Do Something **/
                            let c = await checkFullName()

                            next()
                          }}
                          style={{margin: 5,position:'absolute',right:0}}
                          width={50}
                          height={50}
                          raiseLevel={0}
                          borderRadius={8}
                          borderColor={'#111'}
                          
                          borderWidth={1}
                          textSize={17}
                          backgroundColor={'#000'}
                          backgroundProgress={'#333'}
                        >
                      <MaterialCommunityIcons name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
              </AwesomeButton>
          }


       </View>
     }
       
       { (stepRegister != 'email' && stepRegister != 'name' || stepRegister == 'username') &&
       <View style={{marginTop: 2, width: '100%'}}>
       <TextInput style = {[styles.input, {width: '100%',borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               placeholder = "Username"
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               ref={usernameRegisterRef}
               keyboardType={'email-address'}
               inputAccessoryViewID={'usernameSuggestLogin'}
                autoCorrect={false}
               onFocus={(event) => {
                  scrollToInput(findNodeHandle(event.target))
                }}
               //onSubmitEditing={() => nameRegisterRef && nameRegisterRef.focus && nameRegisterRef.focus()}
               value={username}
               onChangeText={(text) => setUsername(text.replace(/\s/g, ''))}/>
               {
                 Platform.OS == 'ios' && <InputAccessoryView nativeID={'usernameSuggestLogin'}>
                    <View horizontal={true} style={{flex: 1, display: 'flex', flexDirection: 'row',padding: 5, justifyContent: 'center'}}>
                    
                    {usernameSuggestions != null &&
                      usernameSuggestions.map(u => {
                        return(
                        <TouchableOpacity
                          onPress={() => setEndUsername(u.suggest)}
                          style={styles.suggestButton}
                        ><Text>@{u.suggest}</Text></TouchableOpacity>
                        );
                      })
                    }
                    
                    
                    </View>
                  </InputAccessoryView>
                }
          

          {
            stepRegister == 'username' &&
                <AwesomeButton
                          progress
                          onPress={async(next) => {
                            /** Do Something **/
                            let c = await checkUsernameRegister()

                            next()
                          }}
                          style={{margin: 5,position:'absolute',right:0}}
                          width={50}
                          height={50}
                          raiseLevel={0}
                          borderRadius={8}
                          borderColor={'#111'}
                          
                          borderWidth={1}
                          textSize={17}
                          backgroundColor={'#000'}
                          backgroundProgress={'#333'}
                        >
                      <MaterialCommunityIcons name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
              </AwesomeButton>
          }

          
       </View>
     }
       

       
      { stepRegister == 'usernamemailvalid' &&
        <View style={{width: '100%'}}>

        <View style = {{marginTop: 2, width: '100%'}}>
        <TextInput style = {[styles.input, {width: '100%',borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               placeholder = {Languages.Password[getLang()]}
               ref={passwordRegisterRef}
               secureTextEntry={true}
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               autoCorrect={false}
               onFocus={(event) => {
                scrollToInput(findNodeHandle(event.target))
                }}
               value={password}
               onChangeText={(text) => setPassword(text)}/>
       </View>

        <View style={{marginTop: 2, width: '100%'}}>


        <TextInput style = {[styles.input, {width: '100%',borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               placeholder = {Languages.repeatPassword[getLang()]}
               ref={rePasswordRegisterRef}
               secureTextEntry={true}
               autoCorrect={false}
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               onSubmitEditing={() => { onRegister() }}
               onFocus={(event) => {
                  scrollToInput(findNodeHandle(event.target))
                }}
               value={repassword}
               onChangeText={(text) => setRePassword(text)}/>
         </View>
       
     
       

       <View style = {{marginTop: 3}}>
         

         <AwesomeButton
                    progress
                    onPress={next => {

                      onRegister()
                      next();
                    }}
                     style={{margin: 10, alignSelf: 'center'}}
                    width={250}
                    raiseLevel={0}
                    borderRadius={8}
                    borderColor={'#111'}
                    
                    borderWidth={1}
                    textSize={17}
                    backgroundColor={loggedInOkay ? '#2cbb2c' : '#000'}
                    backgroundProgress={'#333'}
                  >
                    {Languages.register[getLang()]}
        </AwesomeButton>
       </View>
       </View>

     }

      <View style = {{marginTop: 8}}>
          {
            errorRegister != null && 
          <Text style={styles.errorText}>
            {errorRegister.message}
          </Text>
          }
          
       </View>

           <View style = {{marginTop: 8}}>
             {/*<Button color="rgba(255,255,255,.4)"
                   title="Forgot password?"
                   onPress={() => this.setState({statusTab: 'forgot', heightContainer: 290})}
                   />*/}
       </View>
      </View>
      );
   }

  function _onRenderForgotPassword(){
    return (
      <View>
      </View>
      )
  }

  async function openLink(p) {
    try {
      const url = 'https://bao.eco/'+p;
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#000000',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          },
          headers: {
            'my-custom-header': 'my custom header value'
          }
        })
        //Alert.alert(JSON.stringify(result))
      }
      else Linking.openURL(url)
    } catch (error) {
      //Alert.alert(error.message)
    }
  }

  // Render SignedOut
  return (
     <View style={{flex:1}}>
      
      
      <View style={[SignedOutStyles.container, {backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'}]}>
         
            
          <AppIntroSlider
            slides={slides}
            renderItem={_introItem}
            paginationStyle={{bottom: 0}}
            dotStyle={{backgroundColor: 'rgba(255, 255, 255, .2)'}}
            activeDotStyle={{backgroundColor: '#10223C'}}
            showSkipButton={false}
            showPrevButton={false}
            showNextButton={false}
            showDoneButton={false}
          />

          <TouchableRipple 
          onPress={() => {
            setModalOpen(true);
            setSection('login');
          }}
          style={[SignedOutStyles.mainButton, {width: '80%', maxWidth: 300, borderRadius: 30,alignSelf: 'center', bottom: 40, backgroundColor: isDarkMode == true ? '#10223C' : '#000'}]}>
                <Text 
                style={[SignedOutStyles.mainButtonText, {color: isDarkMode == true ? '#fff' : '#fff'}]}
                >Comenzar</Text>
          </TouchableRipple>
          {/*<WaveSignedOut style={{ position: 'absolute', bottom:-190, zIndex:-1, width: '120%'}} /> */}
       </View> 
      

      <Modal 
        contentContainerStyle={[{flex:1,zIndex:1, backgroundColor: isDarkMode == true ? '#000' : '#fff', justifyContent: 'center', margin:0, padding:0}]} 
        visible={modalOpen}
        hasBackdrop={false}
        useNativeDriver={false}
        onDismiss={() => setModalOpen(false)}
        swipeDirection="down"
        swipeThreshold={90} >
          <Portal style={{zIndex:10}}>
              <Dialog visible={help} onDismiss={() => setHelp(false)}>
                <Dialog.Title>{Languages.help[getLang()]}</Dialog.Title>
                <Dialog.Content>
                         <TouchableRipple onPress={() => openLink('forgot')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: '#eaeaea', marginBottom: 0, padding: 10, paddingTop: 19}}>
                            <Text>{Languages.forgotPassword[getLang()]}</Text>
                          </TouchableRipple>
                          <Divider />
                          <TouchableRipple onPress={() => openLink('support')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: '#eaeaea', marginBottom: 0, padding: 10, paddingTop: 19}}>
                            <Text>{Languages.support[getLang()]}</Text>
                          </TouchableRipple>
                          <TouchableRipple onPress={() => openLink('contact')} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: '#eaeaea', marginBottom: 0, padding: 10, paddingTop: 19}}>
                            <Text>{Languages.contact[getLang()]}</Text>
                          </TouchableRipple>
                          <TouchableRipple onPress={() => openLink()} style={{width: '100%', height: 60, borderBottomWidth: 1, borderColor: '#eaeaea', marginBottom: 0, padding: 10, paddingTop: 19}}>
                            <Text>{Languages.newtWeb[getLang()]}</Text>
                          </TouchableRipple>

                </Dialog.Content>
                <Dialog.Actions>
                  <Button color={"#2575ed"} onPress={() => setHelp(false)}>{Languages.close[getLang()]}</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{ 
                  flexGrow: 1,
                  justifyContent: 'space-between',
                  paddingTop: getHeaderHeight()
              }}
              style={{flex:1,width: '100%', height: '100%'}}
              ref={modalInputScroll}>

              <View style={{backgroundColor: '#fff', position: 'absolute', top: 20, right: 20, height:50, width: 50}}>
                <IconButton
                            icon="chevron-down-circle-outline"
                            color={'#000000'}
                            mode="contained"
                            size={40}
                            onPress={() => setModalOpen(false)}
                          />
                {/*<Menu
                  style={{zIndex:9}}
                  visible={optionsOpen}
                  onDismiss={() => setOptionsOpen(false)}
                  anchor={<Button onPress={() => setOptionsOpen(true)}>Show menu</Button>}>
                  <Menu.Item onPress={() => {}} title="Item 1" />
                  <Menu.Item onPress={() => {}} title="Item 2" />
                  <Divider />
                  <Menu.Item onPress={() => {}} title="Item 3" />
                </Menu>*/}
              </View>
              {section == 'login' && _onRenderLogin()}
              {section == 'register' && _onRenderRegister()}
              {section == 'forgot' && _onRenderForgotPassword()}

              
              { (usersSelected != null && section == 'login') &&
                  <TouchableRipple onPress={() => clearStates()} style={{justifyContent: 'center', alignSelf: 'center', width: '95%', borderRadius: 8}}>
                      <Text style={[SignedOutStyles.headlineAuth, {color: isDarkMode == true ? '#fff' : '#333', margin: 10}]}>{Languages.imNot[getLang()]} <Text style={{fontWeight: "bold"}}>@{username}</Text></Text>
                  </TouchableRipple>
                }

                { section == 'login' &&
                  <View style={{justifyContent: 'center', alignSelf: 'center', width: '95%', paddingBottom: 10}}>
                    <Button onPress={() => setSection('register')} mode="outlined" style={{}}>
                      {Languages.signUp[getLang()]}
                    </Button>
                    <TouchableRipple onPress={() => setHelp(true)} style={{justifyContent: 'center',borderRadius: 8}}>
                        <Text style={[SignedOutStyles.headlineAuth, {color: isDarkMode == true ? '#fff' : '#333', margin: 10}]}>{Languages.help[getLang()]}</Text>
                    </TouchableRipple>
                  </View>
                }
                { section == 'register' &&
                  <View style={{justifyContent: 'center', alignSelf: 'center', width: '95%', borderRadius: 8}}>
                      <Button onPress={() => setSection('login')} mode="outlined" style={{}}>
                        Iniciar sesión
                      </Button>
                      <TouchableRipple onPress={() => setHelp(true)} style={{justifyContent: 'center',borderRadius: 8}}>
                          <Text style={[SignedOutStyles.headlineAuth, {color: isDarkMode == true ? '#fff' : '#333', margin: 10}]}>{Languages.help[getLang()]}</Text>
                      </TouchableRipple>
                  </View>
                }

              
            </KeyboardAwareScrollView>
          
          
          
          
        
      </Modal>
      <Toast
                    style={{backgroundColor:'#111'}}
                    position='center'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
        <StatusBar translucent backgroundColor={isDarkMode ? '#000000' : '#fff'} barStyle={isDarkMode != 'dark' ? "dark-content" : "light-content"} />
      </View>
    )
}
export default SignedOut;

export class SignedOut2 extends Component<Props> {
  static contextType = DarkModeContext;

  constructor() {
      super()
      this.state = {
         introText: '',
         username: "",
         password: "",
         password_confirmation: "",
         email: '',
         name: '',

         auth: null,
         placeholder: Languages.Username[getLang()],
         showPassword: false,
         color: 'red',
         exist: 'false',


         last_name: null,
         isLoading: true,
         statusTab: 'login',
         isOpen: false,
         buttonState: 'upload',
         heightContainer: 290,
         disabledButton: false,
         stepLogin: 'username',
         stepRegistro: 'email',
         errorLogin: null,
         usersSelected: null,
         errorRegister: null,

         usernameSuggestions: null,
         loggedInOkay: false
      }
      /*Remote.Auth().getSession().then(session => {  
        console.log("resp session", session)
      })*/


      console.log("signed out clouch!", Clouch)
     // ClouchDB = new API({ url: API_URL })

      ClouchDB.Auth().getKey().then(key => {

        if(key != null){
          this.onContinueAs();
        }
      })
      
   

      
      
      

   }

 

   componentDidMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        console.log("did mount signedout!", this)
      changeNavigationBarColor('#000000', false);
    
      SplashScreen.hide();

      this.$init();

    /*  this.timeout = setInterval(() => {
                        this.tick();
                      }, 8000)*/

       this.setState({isLoading: false})
    }
        
    $init = async() => {
      //let acccounts = await(ClouchDB.Auth().getAllAcounts());

      //console.log("accou")
      SplashScreen.hide();
    }

    componentWillUnmount() {
      clearInterval(this.timeout)
    }

   onContinueAs = () => {
        
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'SignedIn', params: {
                          onLogout: this._onLogout,
                          user: username
                        } })],
        });
      this.props.navigation.dispatch(resetAction);
   }

   onNext = () => {
      this.setState({introText: 'My Changed Text'})
   }
   _renderShuffledCovers = () => {
    return (
      <Row size={12} style={{ width: 365, height: 230, alignSelf: 'center'}}>
                  <Col sm={4} md={4} lg={4}>
                    <FastImage source={require('../../assets/covers/alice.jpg')} style={{
                      width: 110,
                      marginTop: 10,
                      borderRadius: 10,
                      alignSelf: 'center',
                      zIndex: 9,
                      height: 165}}>
                   </FastImage>
                  </Col>
                  <Col sm={4} md={4} lg={4}>
                    <FastImage source={require('../../assets/covers/callwild.jpg')} style={{
                      width: 120,

                      alignSelf: 'center',
                      borderRadius: 10,
                      zIndex: 9,
                      height: 185}}>
                   </FastImage>

                  </Col>
                  <Col sm={4} md={4} lg={4}>
                    <FastImage source={require('../../assets/covers/peterpan.jpg')} style={{
                      width: 110,
                      alignSelf: 'center',
                      marginTop: 10,
                      borderRadius: 10,
                      zIndex: 9,
                      height: 165}}>
                   </FastImage>

                  </Col>
                </Row>
      )
   }

   _renderDevices = () => {
    return (
      <Row size={12} style={{ width: 360, height: 230, alignSelf: 'center'}}>
                  <Col sm={12} md={12} lg={12}>
                    <FastImage source={require('../../assets/devices.png')} style={{
                      width: 350,
                      marginTop: 10,
                      borderRadius: 10,
                      alignSelf: 'center',
                      zIndex: 9,
                      height: 175}}>
                   </FastImage>
                  </Col>
                  
                </Row>
      )
  }

  _renderTags = () => {
    const tags = [
                  {
                    cat: 'Fiction',
                    color: '#562086',
                    icon: 'freebsd'
                  },
                  {
                    cat: 'Health',
                    color: '#e25454',
                    icon: 'heart'
                  },
                  {
                    cat: 'Culture',
                    color: '#06a87c',
                    icon: 'lightbulb'
                  },
                  {
                    cat: 'Programming',
                    color: '#9da806',
                    icon: 'code-tags-check'
                  },
                  {
                    cat: 'Design',
                    color: '#a85906',
                    icon: 'blur'
                  },
                  {
                    cat: 'Science',
                    color: '#0682a8',
                    icon: 'atom'
                  },
                  {
                    cat: 'Politics',
                    color: '#5364a5',
                    icon: 'account-network'
                  },
                  {
                    cat: 'Work',
                    color: '#90a553',
                    icon: 'coffee'
                  },
                  {
                    cat: 'Productivity',
                    color: '#a55353',
                    icon: 'beaker'
                  },
                  {
                    cat: 'Research',
                    color: '#e67410',
                    icon: 'access-point'
                  },
                  {
                    cat: 'Food',
                    color: '#2abb21',
                    icon: 'cupcake'
                  },
                  {
                    cat: 'Classics',
                    color: '#1abce2',
                    icon: 'all-inclusive'
                  },
                  {
                    cat: 'Poetry',
                    color: '#928db9',
                    icon: 'card-text-outline'
                  },
                  {
                    cat: 'Humor',
                    color: 'black',
                    icon: 'beach'
                  }
     ]
    return (
                  <View style={styles.tagsContainer}>
                      {
                        tags.map((tag,i) => {
                          return (
                            <View key={i} style={[styles.tagSingle, {backgroundColor: tag.color ? tag.color : '#ccc'}]}>
                              <View style={{alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,.2)', width: 30, height: 30, padding: 5, color: '#fff', borderRadius: 30}}>
                                {
                                  tag.icon != '' ? <MaterialCommunityIcons name={tag.icon} size={20} style={{color: '#fff'}} /> : <MaterialCommunityIcons name="hash" size={20} style={{color: '#fff'}} />
                                }
                              </View>
                              <View style={{alignSelf: 'flex-start', paddingTop: 5, paddingLeft: 7, paddingRight: 6}}>
                                <Text style={{color: '#fff', fontSize: 15, fontWeight: '500'}}>{tag.cat}</Text>
                              </View>
                            </View>
                            );
                        })
                      }
                    
                    

                  </View>
                  

      )
  }

   _renderItem = props => {

      return (
        <View
          style={[styles.mainContent, {
            width: '100%',

          }]}
        >
            
          <View style={{position: 'absolute', bottom: 140, width: '100%'}}>
          {
              props.key == 'shufflebooks' && this._renderShuffledCovers()
            }
          {
              props.key == 'devices' && this._renderDevices()
            }
          {
              props.key == 'tags' && this._renderTags()
            }
            
            <View style={{alignSelf: 'center', width: '80%'}}>

              <Text style={[styles.title,{fontWeight: '700',fontSize: 21, textAlign: 'center', color: isDarkMode == true ? '#fff' : '#222'}]}>{props.title}</Text>
              <Text style={[styles.text, {textAlign: 'center', color: isDarkMode == true ? '#fff' : '#333'}]}>{props.text}</Text>
            </View>
            
          </View>
          
          
        </View>
    );
  }
   _onPress = () => {
     


   }
   _onLogin = async() => {
    Keyboard.dismiss()
    /*Snackbar.show({
            title: 'Please agree to this.',
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              title: 'AGREE',
              onPress: () => Snackbar.show({ title: 'Thank you!' }),
              color: 'green',
            },
          })*/

      if(username == null || password == null){

        Snackbar.show({ title: 'Algunos espacios han sido dejados en blanco', duration: Snackbar.LENGTH_SHORT });
        return;
      }
      
      this.setState({
        errorLogin: null,
        errorRegister: null
      });

     ClouchDB.Auth().signIn(username.toLowerCase(), password)
     .then(res => {

         //Snackbar.show({ title: 'Welcome, '+ username, duration: Snackbar.LENGTH_SHORT });
          ClouchDB.Auth().getSession().then(async(session) => {

            ClouchDB.Auth().getRemoteUser(username).then(async(user) => {

              this.setState({
                loggedInOkay:true
              })
              user.syncedDrafts = false;
              user.syncedChapters = false;
              user.syncedChapters = false;
              user.p_t = password;

              let saveUser = await(ClouchDB.Auth().saveMe(user));

              let saveKey = await(ClouchDB.Auth().setKey(saveUser.name));
              //console.log("save key", saveKey)
              
              this.onContinueAs();
              //this._startSyncAndProceed(user);
              return;
            })
          }).catch(errSession => {
            
            __DEV__ && console.log("error session!", errSession)
          })
          
         
             
 
        return;
     }).catch(err => {
      
      __DEV__ && console.log("err sign!", err, this.state)
      if(err && err.error && err.error == 'unauthorized'){
       Snackbar.show({ 
         title: 'Incorrect credentials',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { this.setState({username: '', password:'' }) },
          },
          });
      } else if(err && err.status && err.status == 0) {
        Snackbar.show({ 
         title: 'Something went wrong. Try later.',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { this.setState({username: '', password:'' }) },
          },
          });
      } else if(err && err.error && err.error == true){
        __DEV__ && console.log("error sign in on login!", err, username, password)
       Snackbar.show({ 
         title: 'Incorrect credentials',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { this.setState({username: '', password:'' }) },
          },
          });
      } else {

      }

     })
     this.setState({
              disabledButton: true
            })
   }

   _startSyncAndProceed = async(user) => {
      this.setState({
        userLogged: user,
        statusTab: 'isLoggedSync',
      });

      //let setUpDrafts = await(Remote.Work().drafts().replicateFrom());

      //let dp = await Remote.Sync().pullPush('pull', 'drafts');

      //__DEV__ && console.log("pull drafts!", dp)
      this.onContinueAs();
   }

   scrollToInput = (reactNode) => {
      // Add a 'scroll' ref to your ScrollView
      this.scroll.props.scrollToFocusedInput(reactNode)
    }

   _onRegister = () => {
    Keyboard.dismiss()
      


    if(name == null || email == null || username == null || password == null){
        //Snackbar.show({ title: 'Algunos espacios han sido dejados en blanco', duration: Snackbar.LENGTH_SHORT });
        this.setState({
              errorRegister: {
                message: 'Fields need to be filled'
              }
            })
        return;
    }
    console.log("user name match", username.match(/^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/))
    if(username.match(/^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/) == null){
      this.setState({
              errorRegister: {
                message: 'Username must contain at least 2 (and not invalid) characters.'
              }
            })
      return;
      }

   

    if(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
       this.setState({
              errorRegister: {
                message: 'E-mail is invalid'
              }
            })
     // Snackbar.show({ title: 'E-mail is invalid', duration: Snackbar.LENGTH_SHORT });
      return;
    }

    if(password != password_confirmation){
      this.setState({
              errorRegister: {
                message: 'Passwords do\'nt match'
              }
            })

      //Snackbar.show({ title: 'Passwords do\'nt match', duration: Snackbar.LENGTH_SHORT });
      return;
    }


      Snackbar.show({ title: 'Creating your account...', duration: Snackbar.LENGTH_SHORT });
     ClouchDB.Auth().signUp(name, email, username.toLowerCase(), password)
     .then(res => {

       //Snackbar.show({ title: 'Welcome!', duration: Snackbar.LENGTH_SHORT });
       this._onLogin();


       return;
       //console.log("registered in mti!", res)
       //this.onContinueAs();
     }).catch(err => {
      __DEV__ && console.log("userrr pass err", err)
       Snackbar.show({ 
         title: 'Username is taken',
         //duration: Snackbar.LENGTH_LONG,
         action: {
            title: 'CLEAR',
            color: 'green',
            onPress: () => { this.setState({username: '', password:'', name: '' }) },
          },
          });



     })
     this.setState({
              disabledButton: true
            })
   }

   _onRenderForgotPassword = () => {
     return (

       <View style={styles.flexElement}>
       <View style={styles.linesView}>
         <Text style={styles.headline}>LOST PASSWORD</Text>
         <Text style={styles.subline}>Input your e-mail{"\n"}to reset your password</Text>
       </View>
       <View style={{marginTop: 10}}>
         <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "E-mail or username"
               autoCorrect={false}
               placeholderTextColor = "#666"
               autoCapitalize = "none"
               onChangeText={(text) => this.setState({email: text.replace(/\s/g, '')})}/>
       </View>
       <View style = {{marginTop: 3}}>
         <TouchableHighlight style={{borderRadius: 10, margin: 10, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: ancho - 20}}>
               <Text style={styles.headlineAuth, {color: '#fff', justifyContent: 'center', alignSelf: 'center', margin: 13, fontSize: 18}}>
               Reset password
               </Text>
         </TouchableHighlight>
       </View>
      </View>
      );
   }
   _onRenderSyncing = () => {

     return (
       <View style={styles.flexElement}>
       <View style={styles.linesView}>
         <Text style={[styles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>SYNCING</Text>
         <Text style={[styles.subline, { color: isDarkMode == true ? '#fff' : '#000'}]}>This process may take a few seconds,{"\n"}depending on how big is your database.</Text>
       </View>
       <View style={{marginTop: 10}}>
        <Progress.Bar width={(ancho) - 100} color={'#2cbb2c'} size={40} indeterminate style={{marginTop: 5, alignSelf: 'center'}}/>

       </View>
       <View style = {{marginTop: 3}}>
         
       </View>
      </View>
      );
   }

   validateEmail = (email) => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }
  _checkUsernameRegister = async() => {
    if(username == '' || username == null){
      return Snackbar.show({ title: Languages.introMailOrUser[getLang()], duration: Snackbar.LENGTH_SHORT });
    }

    if(username.match(/^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/) == null){
      this.setState({
              errorRegister: {
                message: 'Username must contain at least 2 (and not invalid) characters.'
              }
            })
      return;
      }

    let u = await ClouchDB.Auth().checkRemoteUsername(username);

    if(u && u.error && u.error == 'not_found'){
      this.setState({
        stepRegistro: 'usernamemailvalid',
        errorRegister: null,
      })
    } else {
      this.setState({
              errorRegister: {
                message: Languages.usernameAlreadyExists[getLang()]
              }
            })
    }
    __DEV__ && console.log("ccheck usernammme register", u)

  }

  _checkEmailRegister = async() => {
    if(email == '' || email == null){
      this.setState({
              errorRegister: {
                message: Languages.introMail[getLang()]
              }
            })
      return;
      // Snackbar.show({ title: 'Introduce un usuario o e-mail', duration: Snackbar.LENGTH_SHORT });
    }

    if(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
      this.setState({
              errorRegister: {
                message: Languages.mailFormatInvalid[getLang()]
              }
            })
      return;
      // Snackbar.show({ title: 'E-mail format invalid', duration: Snackbar.LENGTH_SHORT });
    }

    let uE = await ClouchDB.Auth().checkRemoteEmail(email);

    __DEV__ && console.log("ue pll", uE)

    if(uE && uE.length == 0){
      this.setState({
        stepRegistro: 'name',
        errorRegister: null,
      })
    } else {
      this.setState({
              errorRegister: {
                message: Languages.mailAlreadyExists[getLang()]
              }
            })
    }
    /*if(u && u.error && u.error == 'not_found'){
      this.setState({
        stepRegistro: 'email',
        errorRegister: null,
      })
    } else {
      this.setState({
              errorRegister: {
                message: 'The username already exists.'
              }
            })
    }
    console.log("ccheck usernammme register", u)*/

  }

  userGenerate = ( n ) => {
      let name = n.replace( /^[^a-z]+|[^a-z\d_\-.]|[_\-.](?![a-z\d])/gi, '' );    
      if ( n != name ) {
          console.log( 'Username invalid' );
      }
      return name.toLowerCase(); 
  }

  _checkFullName = async() => {
    if(name == '' || name == null){
      return Snackbar.show({ title: Languages.introMailOrUser[getLang()], duration: Snackbar.LENGTH_SHORT });
    }

    let suggest = [
    { suggest: this.userGenerate(name)},
    { suggest: this.userGenerate(name)+Math.floor(Math.random() * 6) + 1 }
    ];

      this.setState({
        stepRegistro: 'username',
        errorRegister: null,
        usernameSuggestions: suggest
      })
    
    /*if(u && u.error && u.error == 'not_found'){
      this.setState({
        stepRegistro: 'email',
        errorRegister: null,
      })
    } else {
      this.setState({
              errorRegister: {
                message: 'The username already exists.'
              }
            })
    }
    console.log("ccheck usernammme register", u)*/

  }

   _checkUsername = async(next) => {
    if(username == '' || username == null){
      return Snackbar.show({ title: Languages.introMailOrUser[getLang()], duration: Snackbar.LENGTH_SHORT });
    }

    if(username.includes('@')){


        if(username.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) == null){
          return Snackbar.show({ title: Languages.mailFormatInvalid[getLang()], duration: Snackbar.LENGTH_SHORT });
        }

          let uE = await ClouchDB.Auth().checkRemoteEmail(username);



          if(uE == null){

            this.setState({
              errorLogin: {
                message: Languages.somethingWrongValidatingMail[getLang()]
              }
            })
            return;

          }

          if(uE && uE.length == 0){
            this.setState({
              errorLogin: {
                message: Languages.emailNotMatch[getLang()]
              },
              statusTab: 'register',
              email: username,
              username: null,
              stepRegistro: 'name'
            })
            return;
          }

          if(uE && uE.length == 1){
            this.setState({
              usersSelected: uE,
              username: uE[0].name,
              errorLogin: null,
            })
          }
            this.setState({
              usersSelected: uE,
              errorLogin: null,
            })
            return;
          
    } else {
          let u = await ClouchDB.Auth().checkRemoteUsername(username);

          if(u.error && u.error == 'not_found'){
            this.setState({
              errorLogin: {
                message: '@'+username+' '+Languages.doesNotExist[getLang()]
              }
            })
            return;
            //return Snackbar.show({ title: '@'+username+' does not exists', duration: Snackbar.LENGTH_SHORT });
          }

          this.setState({
            errorLogin: null,
            usersSelected: [u]
          })



    }

    return;

   }

   onSelectUser = (it) => {


    if(!it){
      return;
    }
    this.setState({
      usersSelected: [it],
      username: it.name
    })
   }

   _renderUsers = (item) => {

    return (
      <TouchableOpacity onPress={() => this.onSelectUser(item.item)} style={{minWidth: 100,  height: 100, backgroundColor: '#eaeaea', margin: 3, borderRadius: 20}}>
               <View style={{flex: 1, alignItems: 'center',   justifyContent: 'center'}}>
               {
                <FastImage source={ item.item.avatar ? { uri: encodeURI(item.item.avatar), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : require('../../assets/bg.jpg')}
                       style={{
                        width: 45,

                        borderRadius: 50,
                        paddingBottom: 5,
                        height: 45}}>
                     </FastImage>
               }
                <Text numOfLines={1} style={{paddingLeft: 5, paddingRight: 5,fontSize: 18, fontWeight: '500', textAlign: 'center'}}>@{item.item.name}</Text>
                </View>
              </TouchableOpacity>
            );
   }

   setEndMail = (mail) => {

    let s = '@gmail.com';
    if(mail == 'gmail'){
      s = '@gmail.com';
    } if(mail == 'hotmail'){
      s = '@hotmail.com';
    } if(mail == 'outlook'){
      s = '@outlook.com';
    }  


    if(section == 'login'){
      s = username+''+s
      this.setState({
        username: s,
      })
    } else if(section == 'register'){
      s = email+''+s
      this.setState({
        email: s,
      })
    }

   }

   setEndUsername = (u) => {
    this.setState({
      username: u
    })
   }
   _onRenderLogin = () => {
     return (
       <View style={styles.flexElement}>

       {usersSelected == null && 
        <View style={styles.linesView}>
          <Text style={[styles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.signInModalTitle[getLang()].toUpperCase()}</Text>
           <Text style={[styles.subline, { color: isDarkMode == true ? '#ccc' : '#333'}]}>{Languages.signInModalDesc[getLang()]}</Text>
         </View>
       }
       {(usersSelected && usersSelected.length == 1) && 
        <View style={styles.linesView}>
          <Text style={[styles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.signInModalTitlePass[getLang()]}</Text>
           <Text style={[styles.subline, { color: isDarkMode == true ? '#ccc' : '#333'}]}>{Languages.signInModalDescPass[getLang()]}</Text>
         </View>
       }
       {(usersSelected && usersSelected.length > 1) && 
        <View style={styles.linesView}>
          <Text style={[styles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>CHOOSE ACCOUNT</Text>
           <Text style={[styles.subline, { color: isDarkMode == true ? '#ccc' : '#333'}]}>These accounts are linked{"\n"}to your mail.</Text>
         </View>
       }
         
        { usersSelected == null && 
          <View style={{marginTop: 10}}>
             <TextInput style = {[styles.input, {width: ancho,borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
                   underlineColorAndroid = "transparent"
                   placeholder = {Languages.usernameOrEmail[getLang()]}
                   placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
                   autoCapitalize = "none"
                   keyboardType={'email-address'}
                   textContentType={'emailAddress'}
                   onFocus={(event) => {
                      this.scrollToInput(findNodeHandle(event.target))
                    }}
                    autoCorrect={false}
                    //onSubmitEditing={() => { this.passwordLogin.focus(); }}
                   value={username}
                   inputAccessoryViewID={'usernameLogin'}
                   onChangeText={(text) => this.setState({username: text.replace(/\s/g, '')})}/>

                   {
                    Platform.OS == 'ios' && <InputAccessoryView nativeID={'usernameLogin'}>
                    <View horizontal={true} style={{flex: 1, display: 'flex', flexDirection: 'row',padding: 5, justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('gmail')}
                      style={styles.suggestButton}
                    ><Text>@gmail.com</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('hotmail')}
                      style={styles.suggestButton}
                    ><Text>@hotmail.com</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('outlook')}
                      style={styles.suggestButton}
                    ><Text>@outlook.com</Text></TouchableOpacity>
                    </View>
                  </InputAccessoryView>
                   }
                   
              {stepLogin == 'username' &&
                <AwesomeButton
                        progress
                        onPress={async(next) => {
                          /** Do Something **/
                          let c = await checkUsername()

                          next()
                        }}
                        style={{margin: 5,position:'absolute',right:5}}
                        width={50}
                        height={50}
                        raiseLevel={0}
                        borderRadius={30}
                        borderColor={'#111'}
                        delayPressIn={0}
                        delayPressOut={0}
                        borderWidth={1}
                        textSize={17}
                        backgroundColor={'#000'}
                        backgroundProgress={'#333'}
                      >
                    <MaterialCommunityIcons name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
            </AwesomeButton>
          }
           </View>
     }

     { usersSelected != null && usersSelected.length > 0 && 
      <View>
        {
          usersSelected.length == 1 && 
          <View style={{marginTop: 10}}>
             <TextInput style = {[styles.input, {borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
                   underlineColorAndroid = "transparent"
                   placeholder = {Languages.usernameOrEmail[getLang()]}
                   placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
                   autoCapitalize = "none"
                   disabled={true}
                   autoCorrect={false}
                   editable={false} selectTextOnFocus={false}
                   value={'@'+usersSelected[0].name}
                   onChangeText={(text) => this.setState({username: text.replace(/\s/g, '')})}/>

            { usersSelected[0].avatar &&
                
                      <FastImage source={ usersSelected[0].avatar ? { uri: encodeURI(usersSelected[0].avatar), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : { uri: '../../../bg.jpg'}}
                       style={{
                        width: 45,
                        position: 'absolute',
                        right: 5,
                        marginTop:7,
                        borderRadius: 20,
                        zIndex: 9,
                        height: 45}}>
                     </FastImage>


          }
           </View>
        }
        {
          usersSelected && usersSelected.length > 1 && 
          <View style={{marginTop: 10}}>
          <FlatList
              horizontal={true}
              data={usersSelected}
              renderItem={(item) => this._renderUsers(item)}
              keyExtractor={(item, index) => index.toString()}
          />
          </View>
        }

      </View>
     }
      { usersSelected && usersSelected.length == 1 &&
      <View>
       <View style = {{marginTop: 2}}>
        <TextInput style = {[styles.input, {borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               placeholder = {Languages.Password[getLang()]}
               secureTextEntry={true}

               textContentType={'password'}
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               autoCorrect={false}
               ref={(input) => { this.passwordLogin = input; }}
               onFocus={(event) => {
                  this.scrollToInput(findNodeHandle(event.target))
                }}
               value={password}
              // onSubmitEditing={() => { this._onLogin() }}
               onChangeText={(text) => this.setState({password: text})}/>
       </View>
       <View style = {{marginTop: 3, justifyContent: 'center'}}>
         

         <AwesomeButton
                    progress
                    onPress={next => {
                      /** Do Something **/
                      this._onLogin()
                      next();
                    }}
                    style={{margin: 10, alignSelf: 'center'}}
                    width={250}
                    raiseLevel={0}
                    borderRadius={30}
                    borderColor={loggedInOkay ? '#2cbb2c' : '#111'}
                    
                    borderWidth={1}
                    textSize={17}
                    backgroundColor={loggedInOkay ? '#4ad84a' : '#000'}
                    backgroundProgress={'#333'}
                  >
                    { loggedInOkay ? Languages.Welcome[getLang()].toUpperCase() : Languages.signIn[getLang()].toUpperCase()}
        </AwesomeButton>

       </View>
       </View>
     }
       <View style = {{marginTop: 8}}>
          {
            errorLogin != null && 
          <Text style={styles.errorText}>
            {errorLogin.message}
          </Text>
          }
          
         {/*<Button color={isDarkMode == true ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)"}
               onPress={() => this.setState({statusTab: 'forgot', heightContainer: 290})}
               title="Forgot password?"/>*/}
       </View>
      </View>
      );
   }
   _onRenderRegister = () => {
     return (
       <View style={styles.flexElement}>
       <View style={styles.linesView}>
         <Text style={[styles.headline, { color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.signUpModalTitle[getLang()]}</Text>
         <Text style={[styles.subline,{ color: isDarkMode == true ? '#fff' : '#000'}]}>{Languages.signUpModalDesc[getLang()]}</Text>
       </View>

       
        <View style={{marginTop: 10}}>
        <TextInput style = {[styles.input, {borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               ref={(input) => { this.emailRegister = input; }}
               placeholder = "E-mail"
               keyboardType={'email-address'}
               inputAccessoryViewID={'usernameLogin'}
              autoCorrect={false}
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               onFocus={(event) => {
                  this.scrollToInput(findNodeHandle(event.target))
                }}
               value={email}
               onChangeText={(text) => this.setState({email: text.replace(/\s/g, '')})}/>

               {Platform.OS == 'ios' && 
        <InputAccessoryView nativeID={'usernameLogin'}>
                    <View horizontal={true} style={{flex: 1, display: 'flex', flexDirection: 'row',padding: 5, justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('gmail')}
                      style={styles.suggestButton}
                    ><Text>@gmail.com</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('hotmail')}
                      style={styles.suggestButton}
                    ><Text>@hotmail.com</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setEndMail('outlook')}
                      style={styles.suggestButton}
                    ><Text>@outlook.com</Text></TouchableOpacity>
                    </View>
                  </InputAccessoryView>
                }

          {
            stepRegister == 'email' &&
                <AwesomeButton
                          progress
                          onPress={async(next) => {
                            /** Do Something **/
                            let c = await this._checkEmailRegister()

                            next()
                          }}
                          style={{margin: 5,position:'absolute',right:5}}
                          width={50}
                          height={50}
                          raiseLevel={0}
                          borderRadius={30}
                          borderColor={'#111'}
                          
                          borderWidth={1}
                          textSize={17}
                          backgroundColor={'#000'}
                          backgroundProgress={'#333'}
                        >
                      <MaterialCommunityIcons name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
              </AwesomeButton>
          }

       </View>
      
      { (stepRegister != 'email' || stepRegister == 'name') &&
       <View style={{marginTop: 2}}>
       <TextInput style = {[styles.input, {borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
                 underlineColorAndroid = "transparent"
                 ref={(input) => { this.nameRegister = input; }}
                 placeholder = "Name"
                 placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
                 //autoCapitalize = "none"
                 keyboardType={'name-phone-pad'}
                 autoCorrect={false}
                 onFocus={(event) => {
                    this.scrollToInput(findNodeHandle(event.target))
                  }}
                onSubmitEditing={() => { this.emailRegister.focus(); }}
                 value={name}
                 onChangeText={(text) => this.setState({name: text})}/>

          {
            stepRegister == 'name' &&
                <AwesomeButton
                          progress
                          onPress={async(next) => {
                            /** Do Something **/
                            let c = await this._checkFullName()

                            next()
                          }}
                          style={{margin: 5,position:'absolute',right:5}}
                          width={50}
                          height={50}
                          raiseLevel={0}
                          borderRadius={30}
                          borderColor={'#111'}
                          
                          borderWidth={1}
                          textSize={17}
                          backgroundColor={'#000'}
                          backgroundProgress={'#333'}
                        >
                      <MaterialCommunityIcons name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
              </AwesomeButton>
          }


       </View>
     }
       
       { (stepRegister != 'email' && stepRegister != 'name' || stepRegister == 'username') &&
       <View style={{marginTop: 2}}>
       <TextInput style = {[styles.input, {borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               placeholder = "@Username"
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               ref={(input) => { this.usernameRegister = input; }}
               keyboardType={'email-address'}
               inputAccessoryViewID={'usernameSuggestLogin'}
                autoCorrect={false}
               onFocus={(event) => {
                  this.scrollToInput(findNodeHandle(event.target))
                }}
               //onSubmitEditing={() => { this.nameRegister.focus(); }}
               value={username}
               onChangeText={(text) => this.setState({username: text.replace(/\s/g, '')})}/>
               {
                 Platform.OS == 'ios' && <InputAccessoryView nativeID={'usernameSuggestLogin'}>
                    <View horizontal={true} style={{flex: 1, display: 'flex', flexDirection: 'row',padding: 5, justifyContent: 'center'}}>
                    
                    {usernameSuggestions != null &&
                      usernameSuggestions.map(u => {
                        return(
                        <TouchableOpacity
                          onPress={() => this.setEndUsername(u.suggest)}
                          style={styles.suggestButton}
                        ><Text>@{u.suggest}</Text></TouchableOpacity>
                        );
                      })
                    }
                    
                    
                    </View>
                  </InputAccessoryView>
                }
          

          {
            stepRegister == 'username' &&
                <AwesomeButton
                          progress
                          onPress={async(next) => {
                            /** Do Something **/
                            let c = await checkUsernameRegister()

                            next()
                          }}
                          style={{margin: 5,position:'absolute',right:5}}
                          width={50}
                          height={50}
                          raiseLevel={0}
                          borderRadius={30}
                          borderColor={'#111'}
                          
                          borderWidth={1}
                          textSize={17}
                          backgroundColor={'#000'}
                          backgroundProgress={'#333'}
                        >
                      <MaterialCommunityIcons name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
              </AwesomeButton>
          }

          
       </View>
     }
       

       
      { stepRegister == 'usernamemailvalid' &&
        <View>

        <View style = {{marginTop: 2}}>
        <TextInput style = {[styles.input, {borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               placeholder = {Languages.Password[getLang()]}
               ref={(input) => { this.passwordRegister = input; }}
               secureTextEntry={true}
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               autoCorrect={false}
               onFocus={(event) => {
                this.scrollToInput(findNodeHandle(event.target))
                }}
               value={password}
               onChangeText={(text) => this.setState({password: text})}/>
       </View>

        <View style={{marginTop: 2}}>


        <TextInput style = {[styles.input, {borderColor: isDarkMode == true ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',backgroundColor: isDarkMode == true ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}]}
               underlineColorAndroid = "transparent"
               placeholder = {Languages.repeatPassword[getLang()]}
               ref={(input) => { this.passwordRegisterConfirmation = input; }}
               secureTextEntry={true}
               autoCorrect={false}
               placeholderTextColor={isDarkMode == true ? "#d8d8d8" : "#333"}
               autoCapitalize = "none"
               onSubmitEditing={() => { this._onRegister() }}
               onFocus={(event) => {
                  this.scrollToInput(findNodeHandle(event.target))
                }}
               value={password_confirmation}
               onChangeText={(text) => this.setState({password_confirmation: text})}/>
         </View>
       
     
       

       <View style = {{marginTop: 3}}>
         

         <AwesomeButton
                    progress
                    onPress={next => {

                      this._onRegister()
                      next();
                    }}
                     style={{margin: 10, alignSelf: 'center'}}
                    width={250}
                    raiseLevel={0}
                    borderRadius={30}
                    borderColor={'#111'}
                    
                    borderWidth={1}
                    textSize={17}
                    backgroundColor={loggedInOkay ? '#2cbb2c' : '#000'}
                    backgroundProgress={'#333'}
                  >
                    {Languages.register[getLang()]}
        </AwesomeButton>
       </View>
       </View>

     }

      <View style = {{marginTop: 8}}>
          {
            errorRegister != null && 
          <Text style={styles.errorText}>
            {errorRegister.message}
          </Text>
          }
          
       </View>

           <View style = {{marginTop: 8}}>
             {/*<Button color="rgba(255,255,255,.4)"
                   title="Forgot password?"
                   onPress={() => this.setState({statusTab: 'forgot', heightContainer: 290})}
                   />*/}
       </View>
      </View>
      );
   }
   i = 0;
   tick = () => {
    this.i += 1;
    this.slider.goToSlide(this.i);
    if(this.i == slides.length){
      clearInterval(this.timeout)
    }
    return;
  }

  clearUserSelected = () => {
    this.setState({
      username: null,
      email: null,
      usersSelected: null,
      name: null,
      password: null,
      password_confirmation: null
    })
  }

  switchAuthType = () => {
    if(section == 'login'){
      this.setState({statusTab: 'register'})
    } else if (section == 'register'){
      this.setState({statusTab: 'login'})
    } else {
      this.setState({statusTab: 'login'})
    }

  }

  render() {
    if (this.state.isLoading == true) {
      
    } else {


    return (
      <LinearGradient
        style={[styles.mainContent, {
          width: ancho,
          height: alto,
        }]}
        colors={['#000', '#000']}
        start={{x: 0, y: .1}} end={{x: .1, y: 1}}
      >
      
      <View style={[styles.container, {justifyContent: 'center', backgroundColor: isDarkMode == true ? '#111' : '#fff'}]}>


          <AppIntroSlider
            slides={slides}
            renderItem={this._renderItem}
            paginationStyle={{bottom: 0}}
            dotStyle={{backgroundColor: 'rgba(0, 0, 0, 1)'}}
            activeDotStyle={{backgroundColor: '#2575ed'}}
            ref={ref => this.slider = ref}
            showSkipButton={false}
            showPrevButton={false}
            showNextButton={false}
            showDoneButton={false}
            onSlideChange={() => clearInterval(this.timeout)}
          />


            <TouchableOpacity 
            onPress={() => this.setState({isOpen: true, statusTab: 'login'})}
            style={[styles.twoColumnsButton, {width: '80%', height:40, maxWidth: 300, borderRadius: 30,alignSelf: 'center', bottom: 40, backgroundColor: '#000'}]}>
                  <Text 
                  style={styles.twoColumnsText}
                  >{Languages.joinForFree[getLang()]}</Text>
            </TouchableOpacity>

            {/*<TouchableOpacity 
            onPress={() => this.setState({isOpen: true, statusTab: 'register'})}
            style={[styles.twoColumnsButton, {right: 8, bottom: 50}]}>
                  <Text style={styles.twoColumnsText}>{Languages.register[getLang()]}</Text>
            </TouchableOpacity>*/}
       </View>
        
          
      <Modal 
        style={[styles.sessionContainer, {height: alto, justifyContent: 'center'}]} 
        isVisible={modalOpen}
        animationIn={'fadeIn'}
        hasBackdrop={false}
        onSwipeComplete={() => this.setState({ isOpen: false })}
        swipeDirection="down"
        swipeThreshold={90} >
          <View style={{zIndex: 99, flex: 1, width: ancho}}>
            <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
                contentContainerStyle={{ 
                  flexGrow: 1,
                  justifyContent: 'space-between',
                  paddingTop: getHeaderHeight()
                }}
                style={{width: '100%'}}
                innerRef={ref => {
                  this.scroll = ref
                }}>

              {section == 'isLoggedSync' && this._onRenderSyncing()}
              {section == 'login' && this._onRenderLogin()}
              {section == 'register' && this._onRenderRegister()}
              {section == 'forgot' && this._onRenderForgotPassword()}

              
              { (usersSelected != null && section == 'login') &&
                  <TouchableHighlight onPress={() => this.clearUserSelected()} style={{justifyContent: 'center', alignSelf: 'center', width: '95%', borderRadius: 8}}>
                      <Text style={[styles.headlineAuth, {color: isDarkMode == true ? '#fff' : '#333', margin: 10}]}>{Languages.imNot[getLang()]} <Text style={{fontWeight: "bold"}}>@{username}</Text></Text>
                  </TouchableHighlight>
                }

                { section == 'login' &&
                  <TouchableHighlight onPress={() => this.switchAuthType()} style={{justifyContent: 'center', alignSelf: 'center', width: '95%', borderRadius: 8}}>
                      <Text style={[styles.headlineAuth, {color: isDarkMode == true ? '#fff' : '#333', margin: 10}]}>{Languages.signUpFooter[getLang()]} <Text style={{color: '#2575ed', fontWeight: "bold"}}>{Languages.signUp[getLang()]}</Text></Text>
                  </TouchableHighlight>
                }
                { section == 'register' &&
                  <TouchableHighlight onPress={() => this.switchAuthType()} style={{justifyContent: 'center', alignSelf: 'center', width: '95%', borderRadius: 8}}>
                      <Text style={[styles.headlineAuth, {color: isDarkMode == true ? '#fff' : '#333', margin: 10}]}>{Languages.signInFooter[getLang()]} <Text style={{color: '#2575ed', fontWeight: "bold"}}>{Languages.signIn[getLang()]}</Text></Text>
                  </TouchableHighlight>
                }

              
            </KeyboardAwareScrollView>
          
            
          </View>
          
          {
            Platform.OS == 'ios' && <BlurView
            style={{height: alto, width: ancho, position: 'absolute'}}
            blurType="regular"
            blurAmount={10}
          />
          }
          {
            Platform.OS != 'ios' && <View
            style={{height: alto, width: ancho, position: 'absolute', backgroundColor: isDarkMode == true ? '#222' : '#fff'}}
          />
          }
          
        
      </Modal>

      <Toast

                    style={{backgroundColor:'#111'}}
                    position='center'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />


        <StatusBar translucent backgroundColor={isDarkMode == true ? '#000000' : '#fff'} barStyle={isDarkMode != 'dark' ? "dark-content" : "light-content"} />
      </LinearGradient>


    );
    }
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },

  flexElement: {
    flex: 1,
    alignItems: 'center'
  },
  input: {
      margin: 0,
      marginLeft: 2,
      marginRight: 2,
      height: 60,
      borderColor: 'rgba(255,255,255,.1)',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderWidth: 1,
      width: '100%',
      padding: 10,
      borderRadius: 8,
      fontSize: 20,
      width: '100%'
   },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',

    fontSize: 17,
  },
  tagsContainer: {
    width: 350, height: 230,
                    flexWrap: 'wrap', 
                    borderRadius: 30,
                    alignSelf: 'center',
                    flexDirection:'row',
                    alignItems: 'center',
                    justifyContent: 'center'
  },
  tagSingle: {
    backgroundColor: '#ccc', 
    margin:2,
                    flexWrap: 'wrap', 
                    borderRadius: 30,
                    alignItems: 'flex-start',
                    flexDirection:'row',
                    justifyContent: 'center',
                    padding: 2
  },
  title: {
    fontSize: 26,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    /*textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10*/
  },
   btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },
  sessionContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  suggestButton: {
    backgroundColor: '#eaeaea',
    borderRadius: 30,
    padding:10,
    width:'auto',
    marginRight: 5
  },
  headlineAuth: {
    fontSize: 17,
    justifyContent: 'center', alignSelf: 'center',
  },
  twoColumnsButton: {
    height: 60,
    position: 'absolute',
    backgroundColor: '#2575ed', 
    borderRadius: 8, 
    alignItems: 'center'
  },
  twoColumnsText: {
    color: '#fff', 
    justifyContent: 'center', alignSelf: 'center',
    marginLeft: 0, 
    marginTop: 18, 
    fontSize: 20, 
    fontWeight: 'bold',
   /* textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 4*/
  },
  forgotPassword: {
    color: '#fff'
  },
  buttonSend: {
    color: '#fff',
    backgroundColor: '#111',
    borderRadius: 10
  },
  headline: {
    fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 0.5,

        textAlign: 'left'
  },
  subline: {
    letterSpacing: 0.5,
    fontSize: 17,
    textAlign: 'left',

  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#f3565d',
    padding: 5
  },
  linesView: {
    textAlign: 'left',
    width: '90%',
    alignItems: 'stretch'
  }
});
