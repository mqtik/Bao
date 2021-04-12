

import React, {PureComponent} from 'react';
import { Dimensions, findNodeHandle, StyleSheet, View, Image, Text, TextInput } from 'react-native'
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';


export default class Header extends PureComponent {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
            text: props.item.data.text
          };
        
        this._wysiwygHeader;
    }


    componentDidMount(){
        
    }
    static getDerivedStateFromProps(props, state) {
        //console.log("get dervieed!", state)
        if ((props.item.data.text && props.item.data.text.trim()) !== (state.text && state.text.trim())) {
          return {
            text: props.item.data.text
          };
        }

        
        // Return null to indicate no change to state.
        return null;
    }

    onChange = (text) => {

        if(text != this.props.item.data.text){
            this.props.onChangeTextBlockHeader(text.replace(/(\r\n|\n|\r)/gm, ""),this.props.index)
        }
    
    }

    onFocus = (event) => {
        this.props.focusBlock(this.props.index)
        //console.log("on focus!!", this.props.index)
    }


    onKeyPress = ({ nativeEvent: { key: keyValue } }) => {
        //console.log("o key press!", keyValue, this.props.item.data.text.trim())


       if (keyValue === "Enter") return this.enterKey();

        if(keyValue === "Backspace"){
            if(this.props.item.data.text.trim() == ''){
                return this.props.removeBlockOnIndex(this.props.index);
            }
        }
        
    }

    enterKey = () => {
       // console.log("eter key!!",this.props);
       //this._wysiwygHeader.blur();
        this.props.createParagraphOnIndex(this.props.index);
    }

    toReturn = () => {
        //console.log("header font size!", this.props)

        let headerLevel = this.props.item.data.level;
        let fS = (this.props.fontSize + 7) - headerLevel;
        if(this.props.editMode == false){
            return (
                <Text style={{fontSize:fS, fontWeight: '500', color: this.props.readingTheme == 'light' ? '#000000' : (this.props.readingTheme == 'dark' ? '#ffffff' : '#382e20'),paddingLeft:10,paddingRight:10}}>
                    {this.props.item.data.text}
                </Text>
            )
        } else {
            return (
            <TextInput 
            style = {[styles.input, {flexGrow: 1,fontSize:fS, fontWeight: '500',color: this.props.readingTheme == 'light' ? '#000000' : (this.props.readingTheme == 'dark' ? '#ffffff' : '#382e20') }]}
               underlineColorAndroid = "transparent"
               placeholder = {'Heading'}
               secureTextEntry={false}
               returnKeyType='next'
               multiline = {true}
               autoCorrect={false}
               autoFocus={this.props.isFocused ? true : false}
               //autoFocus={this.props.item.autoFocus ? true : false}
               ref={input => { this._wysiwygHeader = input }}
               //autoFocus={true}
               autoCorrect={this.props.isLast ? true : false}
               placeholderTextColor={this.context == 'dark' ? "#d8d8d8" : "#ccc"}
               autoCapitalize = "none"
               onFocus={(event) => this.onFocus(event)}
               onKeyPress={this.onKeyPress}
               onSubmitEditing={this.enterKey}

               value={this.props.item.data.text}
               //blurOnSubmit={true}
               /*onContentSizeChange={(event) => {
                console.log("size chage ",this.props)
                if(this.props.refScroll != null && this.props.refScroll.props){
                    this.props.refScroll.props.scrollToFocusedInput(findNodeHandle(event.target));
                }
                  }}*/
              // onSubmitEditing={() => { this._onLogin() }}
               onChangeText={(text) => this.onChange(text)}
               />
            )
        }
    }
    render() {
        //console.log("[ON WYSIWYG paragraph]",this.props)
        return (
            <View 
              //key={this.props.editMode ? null : shortid.generate()}
                style={[styles.container, { }]}>
                {this.toReturn()}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        shadowColor: 'transparent',
        padding:3,
        paddingLeft:10,
        paddingRight:10
    },
    webView: {
        padding: 10,
        flexGrow: 1,
    }
    });