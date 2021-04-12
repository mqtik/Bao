

import React, {PureComponent} from 'react';

import { Dimensions, findNodeHandle, StyleSheet, View, Image, Text, TextInput } from 'react-native'
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import EntypoIcono from 'react-native-vector-icons/Entypo';
import shortid from 'shortid';

export default class List extends PureComponent {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
          };
        
          this._wysiwygList;
    }

    componentDidMount(){
        if(this._wysiwygList.focus){
            //this._wysiwygList.focus();
        }
    }

    onChange = (text, index) => {
        this.index = index;
        if(text != this.props.item.data.items[index]){

            this.props.onChangeTextBlockList(text.trim(), index, this.props.index)
        }
    
    }

    onFocus = (event) => {
        this.props.focusBlock(this.props.index)
    }


    onKeyPress = ({ nativeEvent: { key: keyValue } }, index: index) => {
       // console.log("o key press!", keyValue, this.props, index)


       /// if (keyValue === "Enter") return this.enterKey(index);

        if(keyValue === "Backspace"){
            if(this.props.item.data.items[index] == '' || this.props.item.data.items[index].trim() == ''){
                return this.props.removeListOnIndex(this.props.index, index);
            }
        }
        
    }

    enterKey = (index) => {
        if(this.props.item.data.items[index] == '' || this.props.item.data.items[index].trim() == ''){
            return this.props.createParagraphOnIndex(this.props.index);
        }
        this.props.createListOnIndex(this.props.index, index);
    }

    toReturnText = (item) => {
       // console.log("to retun!.!", item)
        let style = this.props.item.data.style;
        if(this.props.editMode == false){
            return (
                <View 
                  key={this.props.editMode ? null : shortid.generate()}
                  style={{display: 'flex',flexDirection:"row",alignSelf: 'flex-start',flexWrap: 'wrap', justifyContent:'space-between', marginBottom: 2}}>
                <View style={{marginRight: 5,marginLeft: 5, marginTop:5, backgroundColor: '#ccc', borderRadius:50, height:20, minWidth:20, justifyContent: 'center', display: 'flex'}}>
                  {style == 'ordered' ? <Text style={{textAlign: 'center', fontWeight:'500'}}>{item.index + 1} </Text> : <EntypoIcono name="controller-record" style={{color: this.context == 'dark' ? '#fff' : '#000', fontSize: 10, textAlign: 'right', marginTop: 3, alignSelf: 'center'}} />}
                  </View>
                <Text style={{margin:2, color: this.props.readingTheme == 'light' ? '#000' : (this.props.readingTheme == 'dark' ? '#fff' : '#645339'),fontSize: this.props.fontSize}}>
                   {item.item}
                </Text>
                </View>
            )
        } else {
            return (
            <View 
              style={{display: 'flex',flexDirection:"row",alignSelf: 'flex-start',flexWrap: 'wrap', justifyContent:'space-between', marginBottom: 2}}>
            <View style={{marginRight: 5,marginLeft: 5, marginTop:0, backgroundColor: '#ccc', borderRadius:50, height:20, minWidth:20, justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
            {style == 'ordered' ? <Text style={{textAlign: 'center', fontWeight:'500'}}>{item.index + 1} </Text> : <EntypoIcono name="controller-record" style={{color: this.context == 'dark' ? '#fff' : '#000', fontSize: 10, textAlign: 'center', marginTop: 3, alignSelf: 'center'}} />}
            </View>
            <TextInput 
                style = {[styles.input, {
                    fontSize: this.props.fontSize - 4,
                    color: this.props.readingTheme == 'light' ? '#000' : (this.props.readingTheme == 'dark' ? '#fff' : '#645339')
                }]}
               underlineColorAndroid = "transparent"
               placeholder = {'List'}
               secureTextEntry={false}
               multiline = {true}
               autoCorrect={false}
               autoFocus={this.props.focusedIndex == this.props.index ? true : false}
               placeholderTextColor={this.context == 'dark' ? "#d8d8d8" : "#dadada"}
               autoCapitalize = "none"
               ref={(input) => { this._wysiwygList = input; }}
               onFocus={(event) => this.onFocus(event)}
               onKeyPress={(event) => this.onKeyPress(event, item.index)}
               onSubmitEditing={() => this.enterKey(item.index)}
               value={item.item}
               blurOnSubmit={true}
               /*onContentSizeChange={(event) => {
                console.log("size chage ",this.props)
                if(this.props.refScroll != null && this.props.refScroll.props){
                    this.props.refScroll.props.scrollToFocusedInput(findNodeHandle(event.target));
                }
                  }}*/
              // onSubmitEditing={() => { this._onLogin() }}
               onChangeText={(text) => this.onChange(text, item.index)}
               />
               </View>
            )
        }
    }

    toReturn = () => {
        return (
            <View>
        {
            this.props.item.data.items.map((i,index) => {
                return this.toReturnText(i,index)
            })
        }

        </View>
        )
    }

    render() {
        //console.log("[ON WYSIWYG LIST]",this.props)
        return (
            <View 
              key={this.props.editMode ? null : shortid.generate()}
                style={[styles.container, { }]}>
                <KeyboardAwareFlatList
                   data={this.props.item.data.items}
                   ref={(ref) => { this._wysiwygList = ref; }}
                  contentContainerStyle={{ paddingBottom: 10}}
                   innerRef={ref => {
                      this.scroll = ref;
                    }}
                    keyExtractor={(item, index) => index.toString()}
                   renderItem={this.toReturnText}
                /> 

                
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        marginTop:-15,
        width: '90%'
    },
    webView: {
        padding: 10,
        flexGrow: 1,
    }
    });