

import React, {PureComponent} from 'react';
import { Dimensions, findNodeHandle, StyleSheet, View, Image, Text, TextInput } from 'react-native'
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';
import shortid from 'shortid';
import Foundation from 'react-native-vector-icons/Foundation';
import { sanFranciscoWeights, sanFranciscoSpacing, webWeights } from 'react-native-typography'

export default class Quote extends PureComponent {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
          };
        

    }

    onChange = (text, type) => {

      if(text != this.props.item.data.text || text != this.props.item.data.caption){

            this.props.onChangeTextBlockInputs(text, this.props.index, type)
        }
    }

    onFocus = () => {
        this.props.focusBlock(this.props.index)
    }

    toReturn = (text, type) => {
        if(this.props.editMode == false){
            return (
                <Text style={{marginLeft: 10, marginRight: 10, fontFamily: Platform.OS == 'ios' ? 'GillSans' : 'Cabin_Regular', letterSpacing: sanFranciscoSpacing(34),color: this.props.readingTheme == 'light' ? (type == 'text' ? '#fff' : '#ccc') : (this.props.readingTheme == 'dark' ? '#fcf9db' : '#fcf9db'),fontSize:this.props.fontSize - (type == 'text' ? 1 : 4)}}>
                    {text}
                </Text>
            )
        } else {
            return (
            <TextInput style = {[styles.input, {
              fontFamily: Platform.OS == 'ios' ? 'GillSans' : 'Cabin_Regular', 
                letterSpacing: sanFranciscoSpacing(34), borderColor: this.props.readingTheme == 'light' ? '#dadada' : (this.props.readingTheme == 'dark' ? '#111' : '#645339'),backgroundColor: this.props.readingTheme == 'light' ? '#fff' : (this.props.readingTheme == 'dark' ? '#222' : '#645339'), color: this.props.readingTheme == 'light' ? '#111' : (this.props.readingTheme == 'dark' ? '#fff' : '#111'), fontSize:this.props.fontSize,minHeight: type == 'text' ? 80 : 30 }]}
               underlineColorAndroid = "transparent"
               placeholder = {type == 'text' ? 'Quote' : 'Caption'}
               secureTextEntry={false}
               multiline = {type == 'text' ? true : false}
               autoCorrect={false}
               placeholderTextColor={this.context == 'dark' ? "#d8d8d8" : "#ccc"}
               autoCapitalize = "none"
               ref={(input) => { this.paragraph = input; }}
               onFocus={(event) => this.onFocus(event)}
               value={text}
               /*onContentSizeChange={(event) => {
                console.log("size chage ",this.props)
                if(this.props.refScroll != null && this.props.refScroll.props){
                    this.props.refScroll.props.scrollToFocusedInput(findNodeHandle(event.target));
                }
                  }}*/
              // onSubmitEditing={() => { this._onLogin() }}
               onChangeText={(text) => this.onChange(text, type)}/>
            )
        }
    }
    render() {
        //console.log("[ON WYSIWYG quote]",this.props)
        return (
            <View 
                key={this.props.editMode ? null : shortid.generate()}
                style={[styles.container, { 
                  backgroundColor: this.props.editMode == false ? '#111' : 'transparent',
                  padding:5,
                    paddingTop: this.props.editMode == false ? 10 : 1, 
                    paddingBottom: this.props.editMode == false ? 10 : 1, 
                }]}>
                {this.toReturn(this.props.item.data.text, 'text')}
                {this.toReturn(this.props.item.data.caption, 'caption')}
                <Foundation name="comment-quotes" style={{position: 'absolute',right:5,bottom: 0, color: this.context == 'dark' ? '#fff' : '#ff7575', fontSize: 30, textAlign: 'right', marginTop: 3, alignSelf: 'center'}} />
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
        borderRadius:10,
        minHeight:30
    },
    webView: {
        padding: 10,
        flexGrow: 1,
    }
    });