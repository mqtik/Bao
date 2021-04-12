

import React, {PureComponent} from 'react';
import { Dimensions } from 'react-native'
import { StyleSheet, View, Image} from 'react-native';
import shortid from 'shortid';

export default class Embed extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
          };
        

    }


    render() {
        console.log("[ON WYSIWYG]",this.props)
        return (
            <View 
                style={[styles.container, { }]}>
                
                
            </View>
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