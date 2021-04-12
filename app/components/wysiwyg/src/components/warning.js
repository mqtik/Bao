

import React, {PureComponent} from 'react';
import { Dimensions, findNodeHandle, StyleSheet, View, Image, Text, TextInput } from 'react-native'
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';
import shortid from 'shortid';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import { sanFranciscoWeights, sanFranciscoSpacing, webWeights } from 'react-native-typography'

export default class Warning extends PureComponent {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
          };
        

    }

    onChange = (text, type) => {
        this.props.onChangeTextBlockInputs(text, this.props.index,  type)
    }

    onFocus = (event) => {
        this.props.focusBlock(this.props.index)
    }

    toReturn = (text, type) => {

        if(this.props.editMode == false){
            return (
                <Text style={{marginLeft: 10, marginRight: 10, fontFamily: Platform.OS == 'ios' ? 'GillSans' : 'Cabin_Regular', letterSpacing: sanFranciscoSpacing(34),color: this.props.readingTheme == 'light' ? (type == 'message' ? '#666' : '#111') : (this.props.readingTheme == 'dark' ? '#000' : '#000'),fontSize: this.props.fontSize - (type == 'message' ? 3 : 2) }}>
                    {text}
                </Text>
            )
        } else {
            return (
            <TextInput style = {[styles.input, {
                fontFamily: Platform.OS == 'ios' ? 'GillSans' : 'Cabin_Regular', 
                 letterSpacing: sanFranciscoSpacing(34),borderColor: this.props.readingTheme == 'light' ? '#dadada' : (this.props.readingTheme == 'dark' ? '#111' : '#645339'), backgroundColor: this.props.readingTheme == 'light' ? '#fff' : (this.props.readingTheme == 'dark' ? '#222' : '#645339'), color: this.props.readingTheme == 'light' ? '#111' : (this.props.readingTheme == 'dark' ? '#fff' : '#111'),fontSize:this.props.fontSize,minHeight: type == 'title' ? 30 : 80}]}
               underlineColorAndroid = "transparent"
               placeholder = {type == 'message' ? 'Warning Message' : 'Title'}
               secureTextEntry={false}
               multiline = {type == 'title' ? false : true}
               autoCorrect={false}
               //autoFocus={true}
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

        return (
            <View 
                //key={shortid.generate()}
                style={[styles.container, { 
                  padding:5,
                  backgroundColor: this.props.editMode == false ? '#fbe74d' : 'transparent',
                  paddingTop: this.props.editMode == false ? 10 : 1, 
                  paddingBottom: this.props.editMode == false ? 10 : 1, 
                   }]}>
                {this.toReturn(this.props.item.data.title, 'title')}
                {this.toReturn(this.props.item.data.message, 'message')}
                <EntypoIcono name="new" style={{position: 'absolute',right:3,bottom: 0, color: this.context == 'dark' ? '#fff' : '#ffc107', fontSize: 30, textAlign: 'right', marginTop: 3, alignSelf: 'center'}} />
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