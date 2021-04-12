

import React, {PureComponent} from 'react';
import { Dimensions, findNodeHandle, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';
import shortid from 'shortid';
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';
const Image = createImageProgress(FastImage);
import Lightbox from '../lib/lightbox/Lightbox';
//import Image from './ScalableImage';

export default class Img extends PureComponent {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
          };
        

    }

    onChange = (text) => {

      if(text != this.props.item.data.caption){

            this.props.onChangeTextBlockInputs(text, this.props.index, 'caption')
        }
    }

    onFocus = (event) => {
        this.props.focusBlock(this.props.index)
    }

    renderImgEditor = () => {
      return (
               <TouchableOpacity style={{margin:this.props.item.data.stretched == true ? 0 : 10}} onPress={() => this.onFocus()}>

                  <Image 
                    source={(this.props.item.data && this.props.item.data.file && this.props.item.data.file.url) ? {uri: this.props.item.data.file.url, cache: FastImage.cacheControl.immutable} : require('../assets/newt_icon.png')}
                    indicator={Progress.Circle}
                    imageStyle={{
                            borderRadius: 0,
                            borderWidth: this.props.item.data.withBorder ? 1 : 0,
                            borderColor: 'rgba(0,0,0,.4)'
                        }}
                    indicatorProps={{
                                size: 40,
                                borderWidth: 0,
                                color: 'rgba(150, 150, 150, 1)',
                                unfilledColor: 'rgba(200, 200, 200, 0.2)'

                              }}
                    resizeMode={this.props.item.data.stretched == true ? 'cover' : 'contain'}
                              //onPress={() => this.onFocus()}
                    style={{
                              backgroundColor: (this.props.item && this.props.item.data && this.props.item.data.withBackground) ? '#cdd1e0' : 'transparent',
                              borderColor: this.props.item.data.withBorder ? 'rgba(0,0,0,.7)' : 'transparent',
                              borderWidth: this.props.item.data.withBorder ? 1 : 0,
                              //alignSelf: 'center',
                              borderRadius: 4,
                              width: this.props.item.data.stretched == true ? '100%' : '100%',
                              minHeight: 300,
                            }}>

                     </Image> 
                </TouchableOpacity>
                )
    }
    renderImgReader = () => {
      return (
        <Lightbox
        backgroundColor={this.props.readingTheme == 'dark' ? '#000' : '#fff'}
        style={{margin:this.props.item && this.props.item.data && this.props.item.data.stretched == true ? 0 : 10}}
        springConfig={{ tension: 100, friction: 20 }}
        renderHeader={close => (
          <TouchableOpacity onPress={close}>
            <Text style={[styles.closeButton,{color: this.props.readingTheme == 'dark' ? '#fff' : '#111'}]}>Close</Text>
          </TouchableOpacity>
        )}>

          {
            (this.props.item && this.props.item.data && this.props.item.data.file && this.props.item.data.file.url) &&
                  <Image 
                    source={(this.props.item.data && this.props.item.data.file && this.props.item.data.file.url) ? {uri: this.props.item.data.file.url, cache: FastImage.cacheControl.immutable} : require('../assets/newt_icon.png')}
                    indicator={Progress.Circle}
                    imageStyle={{
                            borderRadius: 0,
                            borderWidth: this.props.item.data.withBorder ? 1 : 0,
                            borderColor: 'rgba(0,0,0,.4)'
                        }}
                    indicatorProps={{
                                size: 40,
                                borderWidth: 0,
                                color: 'rgba(150, 150, 150, 1)',
                                unfilledColor: 'rgba(200, 200, 200, 0.2)'

                              }}
                    resizeMode={this.props.item.data.stretched == true ? 'cover' : 'contain'}
                              //onPress={() => this.onFocus()}
                    style={{
                              backgroundColor: this.props.item.data.withBackground && '#cdd1e0',
                              borderColor: this.props.item.data.withBorder && 'rgba(0,0,0,.7)',
                              borderWidth: this.props.item.data.withBorder ? 1 : 0,
                              //alignSelf: 'center',
                              borderRadius: 4,
                              width: this.props.item.data.stretched == true ? '100%' : '100%',
                              minHeight: 300,
                            }}>

                     </Image> 
                   }
                </Lightbox>
                )
    }
    toReturn = () => {
        ///console.log("TO RETURN IMAGE!", this.props.item.data)
            return (
             <View style={{width: '100%',}}>
               {
                this.props.editMode == true ? this.renderImgEditor() : this.renderImgReader()
               }
                { this.props.editMode == true &&  <TextInput style = {[styles.input, {fontFamily: Platform.OS == 'ios' ? 'GillSans' : 'Cabin_Regular', borderColor:  this.props.readingTheme == 'light' ? '#eaeaea' : (this.props.readingTheme == 'dark' ? '#222' : '#bda47e'),fontSize: this.props.fontSize, backgroundColor:  this.props.readingTheme == 'light' ? '#ffffff' : (this.props.readingTheme == 'dark' ? '#222222' : '#ffffff'), color: this.props.readingTheme == 'light' ? '#000' : (this.props.readingTheme == 'dark' ? '#fff' : '#645339')}]}
               underlineColorAndroid = "transparent"
               placeholder = {'Picture Caption'}
               secureTextEntry={false}
               multiline = {true}
               autoCorrect={false}
               //autoFocus={true}
               placeholderTextColor={this.context == 'dark' ? "#d8d8d8" : "#ccc"}
               autoCapitalize = "none"
               ref={(input) => { this.paragraph = input; }}
               onFocus={(event) => this.onFocus(event)}
               value={this.props.item.data.caption}
               /*onContentSizeChange={(event) => {
                console.log("size chage ",this.props)
                if(this.props.refScroll != null && this.props.refScroll.props){
                    this.props.refScroll.props.scrollToFocusedInput(findNodeHandle(event.target));
                }
                  }}*/
              // onSubmitEditing={() => { this._onLogin() }}
               onChangeText={(text) => this.onChange(text)}/>
                }
                { this.props.editMode == false && <Text style={{fontFamily: Platform.OS == 'ios' ? 'GillSans' : 'Cabin_Regular', fontSize: this.props.fontSize, textAlign: 'center',color: this.props.readingTheme == 'light' ? '#000' : (this.props.readingTheme == 'dark' ? '#fff' : '#000')}}>{this.props.item.data.caption}</Text>}
             </View>
            )
        
    }
    render() {
       // console.log("[ON WYSIWYG image]",this.props)
        return (
            <View
                style={[styles.container, { 
                    //height:300,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }]}
                onPress={() => this.onFocus()}
                >
                {(this.props.item.data && this.props.item.data.file && this.props.item.data.file.url && this.props.item.data.file.url.includes("http")) &&
                  this.toReturn()}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input:{
        borderWidth: 1,
        borderColor: '#dadada',
        backgroundColor:'#fff',
        marginBottom:4,
        padding:10,
        paddingTop:12,
        borderRadius:0,
        minHeight:30,
        marginTop:-10
    },
    closeButton:{
      color: '#fff',
      alignItems: 'center',
      width: '100%',
      textAlign: 'center',
      paddingTop: 15,
      fontSize: 20,
      justifyContent: 'center'
    },
    webView: {
        padding: 10,
        flexGrow: 1,
    }
    });