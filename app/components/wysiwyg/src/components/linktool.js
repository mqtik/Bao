

import React, {PureComponent} from 'react';
import { Dimensions, findNodeHandle, StyleSheet, View, Text, TextInput,TouchableOpacity } from 'react-native'
import {DarkModeContext, DarkModeProvider, eventEmitter, initialMode} from 'react-native-dark-mode';

import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import shortid from 'shortid';
const Image = createImageProgress(FastImage);

export default class LinkTool extends PureComponent {
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

    toReturn = () => {

            return (
             <TouchableOpacity 
                onPress={() => this.onFocus()}
                style={{display: 'flex',flexDirection:"row",alignSelf: 'flex-start',flexWrap: 'wrap', justifyContent:'space-between', width: '100%'}}>
                <View style={{flex:1,padding:15}}>
                    <Text numberOfLines={1} style={{fontWeight:'600', fontSize:this.props.fontSize - 2}}>{this.props.item.data.meta.title}</Text>
                    <Text numberOfLines={2} style={{fontSize: this.props.fontSize - 6, color: this.context == 'dark' ? '#eaeaea' : '#888'}} >{this.props.item.data.meta.description}</Text>
                    <Text numberOfLines={1} style={{fontSize: this.props.fontSize - 8}}>{this.props.item.data.link}</Text>
                </View>
                <View style={{}}>
        {this.props.item.data.meta.image.url ?
          <Image 
            source={{uri: encodeURI(this.props.item.data.meta.image.url), priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable }}
            indicator={Progress.Circle}
            imageStyle={{borderRadius: 10}}
            indicatorProps={{
                        size: 40,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
            style={{
                      backgroundColor: 'rgba(0,0,0,.4)',
                      width: 60,
                      marginTop:15,
                      marginRight: 10,
                      borderRadius: 10,
                      height: 60
                    }}>

             </Image> 
            :
            <View style={styles.imageCover}>
                <EntypoIcono name="documents" style={{ color: '#fff', fontSize: 20, marginLeft: 14, marginTop: 18}}/>
              </View>
          }
            </View>
     
           
        
                </TouchableOpacity>
            )
        
    }
    render() {
        //console.log("[ON WYSIWYG link]",this.props)
        return (
            <View 
                key={(Math.random() * (100000 - 0) + 0).toFixed(0)}
                style={[styles.container, { backgroundColor: '#eaeaea'}]}>
                {this.toReturn()}
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