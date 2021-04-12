

import React, {PureComponent} from 'react';
import { Dimensions, findNodeHandle, StyleSheet, View, Image, Text, TextInput,TouchableOpacity } from 'react-native'
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';
import Foundation from 'react-native-vector-icons/Foundation';
import shortid from 'shortid';

export default class Delimiter extends PureComponent {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
          };
        

    }
    onChange = (text) => {


    }

    onFocus = () => {
        this.props.focusBlock(this.props.index)
    }

    toReturn = (text, type) => {
        return (
            <View style={{textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',flexDirection: 'row', fontWeight: '600', height:20}}>
                <Foundation name="asterisk" style={{color: this.context == 'dark' ? '#fff' : '#000', fontSize: 13, paddingRight:5, textAlign: 'center'}} />
                <Foundation name="asterisk" style={{color: this.context == 'dark' ? '#fff' : '#000', fontSize: 13, paddingRight:5, textAlign: 'center'}} />
                <Foundation name="asterisk" style={{color: this.context == 'dark' ? '#fff' : '#000', fontSize: 13, paddingRight:5, textAlign: 'center'}} />
            </View>
            )
    }
    render() {
        //console.log("[ON WYSIWYG Delimiter]",this.props)
        return (
            <TouchableOpacity
                key={shortid.generate()}
                style={[styles.container, { height:45, display: 'flex', alignItems: 'center', justifyContent: 'center',width:'100%'}]}
                onPress={() => this.onFocus()}>
                {this.toReturn()}
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webView: {
        padding: 10,
        flexGrow: 1,
    }
});