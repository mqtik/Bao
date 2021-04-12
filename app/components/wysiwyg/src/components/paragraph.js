

import React, {PureComponent} from 'react';
import { Dimensions, findNodeHandle, StyleSheet, Platform, InputAccessoryView, View, Image, Text, TouchableOpacity, TextInput } from 'react-native'
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';
import shortid from 'shortid';
import HTMLView from './helpers/formatText'
import { sanFranciscoWeights, sanFranciscoSpacing, webWeights } from 'react-native-typography'


//import HTMLView from 'react-native-htmlview';

export default class Paragraph extends PureComponent {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
            selectedTag : 'body',
            selectedStyles : [],
          };
        
        this._wysiwygParagraph;
    }


    componentDidMount(){

        if(this.props.editMode == true && this._wysiwygParagraph && this._wysiwygParagraph.focus && this.props.isFocused == true){
            this._wysiwygParagraph.focus();
        }
    }
    // static getDerivedStateFromProps(props, state) {
    //     //console.log("get dervieed!", state)
    //     if (props.item.data.text.trim() !== state.text.trim()) {
    //       return {
    //         text: props.item.data.text
    //       };
    //     }

            
    //     // Return null to indicate no change to state.
    //     return null;
    // }

    onChange = (text) => {

        if(text != this.props.item.data.text){
          this.props.onChangeTextBlock(text.replace(/(\r\n|\n|\r)/gm, ""),this.props.index)
        }
    
    }

    onFocus = (event) => {
        this.props.focusBlock(this.props.index)
        //console.log("on focus!!", this.props.index) 
    }


    onKeyPress = ({ nativeEvent: { key: keyValue } }) => {



        if (keyValue === "Enter") return this.enterKey();

        if(keyValue === "Backspace"){
            if(this.props.item.data.text.trim() == ''){
                return this.props.removeBlockOnIndex(this.props.index);
            }
        }
        
    }

    enterKey = () => {
       // console.log("eter key!!",this.props);
       //this._wysiwygParagraph.blur();
        this.props.createParagraphOnIndex(this.props.index);
    }

    onStyleKeyPress = (toolType) => {
        this.editor.applyToolbar(toolType);
    }

    onSelectedTagChanged = (tag) => {
        this.setState({
            selectedTag: tag
        })
    }

    onSelectedStyleChanged = (styles) => { 
        this.setState({
            selectedStyles: styles,
        })
    }

    onValueChanged = (value) => {
        this.setState({
            value: value
        });
    }

    onTextInput = ({ nativeEvent: { text, previousText, range: { start, end } } }) => {
     // console.log("on text input!", text, previousText, start, end)
    }

    onSelectionChange = ({ nativeEvent: { selection, text } }) => {
      //console.log("on selection change!", selection, text)
    }
    renderNode = (node, index, siblings, parent, defaultRenderer) => {
      if (node.name == 'b') {
        const specialSyle = node.attribs.style;

        return (
          <Text key={index} style={{fontWeight:'700'}}>
            <Text style={{fontSize:1,color: 'transparent'}}>{'<b>'}</Text>
            {defaultRenderer(node.children, parent)}
            <Text style={{fontSize:1,color: 'transparent'}}>{'</b>'}</Text>
          </Text>
        )
      }
      if (node.name == 'i') {
        const specialSyle = node.attribs.style;

        return (
          <Text key={index} style={{fontStyle: 'italic'}}>
            <Text style={{fontSize:0.1,color: 'transparent'}}>{'<i>'}</Text>
            {defaultRenderer(node.children, parent)}
            <Text style={{fontSize:0.1,color: 'transparent'}}>{'</i>'}</Text>
          </Text>
        )
      }
      if (node.name == 'a') {
        const link = node.attribs.href;
        return (
          <Text key={index} style={{textDecorationLine: 'underline'}}>
            <Text style={{fontSize:0.1,color: 'transparent'}}>{'<a>'}</Text>
            {defaultRenderer(node.children, parent)}
            <Text style={{fontSize:0.1,color: 'transparent'}}>{'</a>'}</Text>
          </Text>
        )
      } 
      if (node.name == 'code') {
        const link = node.attribs.href;
        return (
          <Text key={index} style={{backgroundColor: '#ffe9e9', color:'#d47575'}}>
            <Text style={{fontSize:0.1,color: 'transparent'}}>{'<code class="inline-code">'}</Text>
            {defaultRenderer(node.children, parent)}
            <Text style={{fontSize:0.1,color: 'transparent'}}>{'</code>'}</Text>
          </Text>
        )
      }
      if (node.name == 'mark') {
        const link = node.attribs.href;
        return (
          <Text key={index} style={{backgroundColor: this.props.readingTheme == 'light' ? '#fcf9db' : (this.props.readingTheme == 'dark' ? 'rgba(252, 249, 219, 0.7)' : '#fcf9db')}}>
            <Text style={{fontSize:0.1,color: 'transparent'}}>{'<mark class="cdx-marker">'}</Text>
            {defaultRenderer(node.children, parent)}
            <Text style={{fontSize:0.1,color: 'transparent'}}>{'</mark>'}</Text>
          </Text>
        )
      } 
    }


    renderValue = () => {
      return(
        <Text>
               <HTMLView
                  renderNode={this.renderNode}
                  value={this.props.item.data.text}

                  RootComponent={() => TextInput}

                />
                
               {/*parts.map((text) => {
                console.log("text here!!", text)
                if (/^#/.test(text)) {
                  
                  return <Text key={text} style={styles.hashtag}>{text}</Text>;
                } else {
                  return text;
                }
              })*/}
               </Text>
               )
    }
    toReturn = () => {
        
        //let textParsed = text.match(/<([\w]+)[^>]*>(.*?)<\/([\w]+)[^>]*>/g);

       //console.log(this.props)
        //const text = this.props.item.data.text.replace(/\<(\d+)\>/g, (match, i) => <Text>${text[i]}</Text>);
          //console.log("text off parargraph!!", text)
          //remve tags except
          // var input = 'b<body>b a<a>a h1<h1>h1 p<p>p p</p>p img<img />img';
          // var output = input.replace(/(<\/?(?:a|p|img)[^>]*>)|<[^>]+>/ig, '$1');
          
        if(this.props.editMode == false){
            return (
              <Text onPress={() => this.onFocus()} style={[{
              //fontFamily: 'gill_sans',              
               letterSpacing: sanFranciscoSpacing(31), 
               textAlign: this.props.textAlign == 'justify' ? 'justify' : 'left', 
               paddingLeft:20, paddingRight:20, paddingTop:2,
               fontFamily: Platform.OS == 'ios' ? 'Gill Sans' : 'Cabin_Regular',
                paddingBottom:4,fontSize: this.props.fontSize, color: this.props.readingTheme == 'light' ? '#000' : (this.props.readingTheme == 'dark' ? '#fff' : '#382e20'),
                fontWeight: null,
              }]}>
                <HTMLView
                  renderNode={this.renderNode}
                  value={this.props.item.data.text}
                  RootComponent={(props) => <Text {...props} />}
                  // style={{
                  // fontFamily: Platform.OS == 'ios' ? 'Gill Sans' : 'Cabin_Regular', 
                  // }}

                />
              </Text>
            )
        } else {
          //define delimiter
              // let delimiter = /\s+/;

              // //split string
              // let _text = text;
              // let token, index, parts = [];
              // while (_text) {
              //   delimiter.lastIndex = 0;
              //   token = delimiter.exec(_text);
              //   if (token === null) {
              //     break;
              //   }
              //   index = token.index;
              //   if (token[0].length === 0) {
              //     index = 1;
              //   }
              //   parts.push(_text.substr(0, index));
              //   parts.push(token[0]);
              //   index = index + token[0].length;
              //   _text = _text.slice(index);
              // }
              // console.log("push !!!", parts)
              // parts.push(_text);

              //highlight hashtags
            if(Platform.OS == 'ios'){
              return (
                <TextInput 
                style = {[styles.input, {
                    color: this.props.readingTheme == 'light' ? '#000' : (this.props.readingTheme == 'dark' ? '#fff' : '#382e20'), 
                    fontSize: this.props.fontSize,
                    fontFamily: Platform.OS == 'ios' ? 'Gill Sans' : 'Cabin_Regular'
                  }]}
                  selectTextOnFocus={true}
               underlineColorAndroid = "transparent"
               placeholder = {this.props.isLast ? 'Paragraph' : ''}
               secureTextEntry={false}
               returnKeyType='next'
               multiline = {true}
               autoFocus={this.props.isFocused ? true : false}
               ref={input => { this._wysiwygParagraph = input }}
               //autoFocus={true}
               autoCorrect={false}
               placeholderTextColor={this.context == 'dark' ? "#d8d8d8" : "#dadada"}
               autoCapitalize = "none"
               onFocus={(event) => this.onFocus(event)}
               onKeyPress={this.onKeyPress}
               onSubmitEditing={this.enterKey}
               listKey={shortid.generate()}
               blurOnSubmit={true}
               //onTextInput={this.onTextInput.bind(this)}
               //onChange={(event) => {console.log(event.nativeEvent.data)}}
               onSelectionChange={this.onSelectionChange}
               selectTextOnFocus={true}
               inputAccessoryViewID={'richText'}
               /*onContentSizeChange={(event) => {
                console.log("size chage ",this.props)
                if(this.props.refScroll != null && this.props.refScroll.props){
                    this.props.refScroll.props.scrollToFocusedInput(findNodeHandle(event.target));
                }
                  }}*/
              // onSubmitEditing={() => { this._onLogin() }}
               onChangeText={(text) => this.onChange(text)}
               > 
               <Text>
               <HTMLView
                  renderNode={this.renderNode}
                  value={this.props.item.data.text}

                  RootComponent={(props) => <TextInput selectTextOnFocus={true} {...props} />}

                />
               </Text>
               </TextInput>
               )
            } else {
              return (
                <TextInput 
                style = {[styles.input, {color: this.props.readingTheme == 'light' ? '#000' : (this.props.readingTheme == 'dark' ? '#fff' : '#382f21'),flexGrow: 1, fontFamily: Platform.OS == 'ios' ? 'Gill Sans' : 'Cabin_Regular', fontSize: this.props.fontSize}]}
               underlineColorAndroid = "transparent"
               placeholder = {this.props.isLast ? 'Paragraph' : ''}
               secureTextEntry={false}
               returnKeyType='next'
               multiline = {true}
               autoFocus={this.props.isFocused ? true : false}
               ref={input => { this._wysiwygParagraph = input }}
               //autoFocus={true}
               autoCorrect={false}
               placeholderTextColor={this.context == 'dark' ? "#d8d8d8" : "#dadada"}
               autoCapitalize = "none"
               onFocus={(event) => this.onFocus(event)}
               onKeyPress={this.onKeyPress}
               onSubmitEditing={this.enterKey}
               blurOnSubmit={true}
               //onTextInput={this.onTextInput.bind(this)}
               //onChange={(event) => {console.log(event.nativeEvent.data)}}
               onSelectionChange={this.onSelectionChange}
               inputAccessoryViewID={'richText'}
               /*onContentSizeChange={(event) => {
                console.log("size chage ",this.props)
                if(this.props.refScroll != null && this.props.refScroll.props){
                    this.props.refScroll.props.scrollToFocusedInput(findNodeHandle(event.target));
                }
                  }}*/
              // onSubmitEditing={() => { this._onLogin() }}
               onChangeText={(text) => this.onChange(text)}
               value={this.props.item.data.text}
               />
               )
            }
            
        }

               /*
                    Platform.OS == 'ios' && <InputAccessoryView nativeID={'richText'}>
                      <View horizontal={true} style={{flex: 1, display: 'flex', flexDirection: 'row',padding: 5, justifyContent: 'flex-end'}}>
                      <TouchableOpacity
                        onPress={() => this.setBold()}
                        style={styles.suggestButton}
                      ><Text>B</Text></TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setItalic()}
                        style={styles.suggestButton}
                      ><Text>I</Text></TouchableOpacity>
                      </View>
                    </InputAccessoryView>
                     */
    }
    render() {
        //console.log("[ON WYSIWYG paragraph]",this.props)
        return (
            <View 
               // key={this.props.editMode ? null : shortid.generate()}
                //key={shortid.generate()}
                style={[styles.container, { minHeight:46 }]}>
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
        paddingLeft:11,
        paddingRight:11,
        paddingTop:4, paddingBottom:4,
        fontFamily: 'GillSans', letterSpacing: sanFranciscoSpacing(31),
    },
    webView: {
        padding: 10,
        flexGrow: 1,
    },
    suggestButton: {
      backgroundColor: '#eaeaea',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',

      width:'auto',
      height:30,
      width: 30,
      marginRight: 5
    },
    });