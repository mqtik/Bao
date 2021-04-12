import React, { Component, PureComponent } from 'react';
import { View, Text, TouchableOpacity,Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import { API_URL, API_STATIC, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image'

import * as Progress from 'react-native-progress';

import _ from 'lodash'

import TouchableScale from 'react-native-touchable-scale';

import { createImageProgress } from 'react-native-image-progress';

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

const Image = createImageProgress(FastImage);

type Props = { navigation: Function, onDocPress: Function };

export default class SliderEntry extends PureComponent {
   constructor(props) {
        super(props);
    }
    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
        navigation: PropTypes.any
    };

    get image () {
        const { data: { cover, colors }, parallax, parallaxProps, even } = this.props;
       // console.log("Cover!", cover);
       if(Platform.OS == 'android'){
        return (
          <FastImage 
            imageStyle={{borderRadius: 10}}
              source={ cover ? { uri: encodeURI(cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.web } : { uri: '../../../bg.jpg'}}
           
                borderRadius={10}
              containerStyle={[styles.imageContainer, {}]}
              style={[styles.image, {borderRadius: 10, backgroundColor: colors ? colors[1] : '#000'}]}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            >

             <View style={{justifyContent: 'center', alignSelf: 'center', width: '80%'}}>
                      { 
                        this._renderProgress(this.props.data)
                      }
                      </View>
            </FastImage>
          );
       } else {
        return (
          <Image 
            imageStyle={{borderRadius: 10}}
              source={ cover ? { uri: encodeURI(cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.web } : { uri: '../../../bg.jpg'}}
            indicator={Progress.Circle}
            indicatorProps={{
                        size: 80,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
                borderRadius={10}
              containerStyle={[styles.imageContainer, {}]}
              style={[styles.image, {borderRadius: 10, backgroundColor: colors ? colors[1] : '#000'}]}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            >

             <View style={{justifyContent: 'center', alignSelf: 'center', width: '80%'}}>
                      { 
                        this._renderProgress(this.props.data)
                      }
                      </View>
            </Image>
            
        )
        }
    }


    _renderProgress = (book) => {

      let p, progress;
      if(!book.progress || !book.count_chapters){
        return;
      }
      let pg = parseFloat(book.progress), cg = parseFloat(book.count_chapters);
        progress = (pg / cg) * 10;
        p = progress >= 10 ? progress : '0.'+progress;

      return (
        <Progress.Bar width={this.props.type != 'grid' ? 133 : (ancho / 3) - 15} color={'#2cbb2c'} progress={book.progress ? parseFloat(p) : 0} size={30} style={{marginTop: 5, alignSelf: 'center'}}/>
        )
   }

   _onDownload = async(doc) => {
      let c = await(this.props.RemoteCloud.Work().drafts().chapters().getPublishedChapters(doc))
      //console.log("on download", c)
      

      //__DEV__ && console.log("dowmload chapters!", c)

      if(c && c.length == 0){
            Snackbar.show({ title: Languages.noChaptersSyncing[getLang()], duration: Snackbar.LENGTH_LONG })
            return false;
          }
     
      return c;

    }

    onDocPress = async(doc) => {


      if(this.props.category == 'Continue reading' || this.props.category == 'Continuar leyendo'){
        let ch = await this._onDownload(doc);

        //console.log("download propppp", ch)
         this.props.navigation.navigate('Reader',{
                                        currentReading: doc,
                                        allChapters: ch,
                                        index: doc.progress || 0,
                                        //docScreenUpdateStates: (book, index) => this.onUpdateParentBook(book, index)
                                       // currentUser: this.state.currentUser
                                      });

         return;
      }

      let docIndex = _.findIndex(this.props.all, ['_id', doc._id]);



      let filtered = this.props.all;
       // console.log("index! filtered!", index, indexOf, filtered)

        if(filtered.length > 10 && docIndex > 10){

          filtered = filtered.slice(docIndex - 2, docIndex + 2);
          docIndex = 10;
        }
        if(filtered.length >= 10 && docIndex <= 10){

          filtered = filtered.slice(0, 10)
        }

        docIndex = _.findIndex(filtered, ['_id', doc._id])

        if(docIndex == -1){
          docIndex = 0;
        }
      this.props.navigation.navigate('Details',{
                                        currentDoc: doc,
                                        allDocs: filtered,
                                        indexOfSlider: docIndex || 0
                                      });
   }

    render () {
        const { data: { title, description, percentage, colors }, even } = this.props;


        let reStyles;
        if(this.props.type == 'grid' && ancho <= 1023){
          reStyles = {
                width: (ancho / 3),
                height: (alto / 4),
                marginBottom: 4
              }
        }
        const uppercaseTitle = title ? (
            <Text
              style={styles.title}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;
        if(title){
                return (
                    <TouchableScale
                      activeOpacity={8}
                      activeScale={0.95}
                      style={[styles.slideInnerContainer, reStyles, {borderRadius: 10, }]}
                      onPress={() => { this.onDocPress(this.props.data);  }}
                      >
                      <View style={styles.shadow} />
                       <View style={[styles.imageContainer, {borderRadius: 10, backgroundColor: colors ? colors[1] : '#000'}]}>
                           
                         { this.image }
                         <View style={styles.radiusMask} />
                         
                         <LinearGradient
                                    colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0,.6)']}
                                    style={[styles.contentContainer, {borderRadius: 10}]}
                                  />
                              
                         <View style={[styles.textContainer,{borderRadius: 10}]}>
                             
                             
                                  { uppercaseTitle }
                                  {/*
                                  <Text
                                    style={styles.description}
                                    numberOfLines={2}
                                  >
                                      { description }
                                  </Text>
                                */}
                              </View>

                        </View>
                        
                    </TouchableScale>
                );
              } else {
               return (
                 <View></View>
                 );
              }

    }
}
