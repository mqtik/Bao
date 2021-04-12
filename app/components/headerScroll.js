import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, Animated,TouchableOpacity, FlatList, Dimensions, StyleSheet, VirtualizedList, Platform,findNodeHandle } from 'react-native';
import Fades from './fades';
import { BlurView, VibrancyView } from "../../libraries/blur";
import { ifIphoneX } from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import shortid from 'shortid'
import {DarkModeContext} from 'react-native-dark-mode';
import Entypo from 'react-native-vector-icons/Entypo';

const headerHeight = ifIphoneX(88, 60);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  headerContainer: {
    height: headerHeight,
    position: 'absolute',
    top:0,
    left:0,
    right: 0,
    width: '100%',
    zIndex:9999,
    paddingTop:20,
    height: headerHeight
  },
  headerComponentContainer: {
    height: headerHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
    backgroundColor: 'transparent'
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0.019,
  },
  title: {
    letterSpacing: 0.011,
    fontWeight: '700',
    marginLeft: 16,
  },
});

const { height } = Dimensions.get('window');

class HeaderScrollView extends Component {
  static contextType = DarkModeContext;
  constructor(props){
    super(props);
    this.state = {
      headerHeight: 0,
      headerY: 0,
      isHeaderScrolled: false,
      fadeDirection: '',
    };
  }
  static propTypes = {
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    headlineStyle: PropTypes.object,
    children: PropTypes.node,
    containerStyle: PropTypes.object,
    headerContainerStyle: PropTypes.object,
    headerComponentContainerStyle: PropTypes.object,
    scrollContainerStyle: PropTypes.object,
    fadeDirection: PropTypes.string,
    scrollViewProps: PropTypes.object,
  };

  static defaultProps = {
    scrollViewProps: {},
  };


  componentDidMount() {
    // android blur
    this.setState({
      viewRef: findNodeHandle(this.blurred)
    });
  }

  

  onLayout = event => {
    this.setState({
      headerHeight: event.nativeEvent.layout.height,
      headerY: event.nativeEvent.layout.y,
    });
  };

  scrollAnimatedValue = new Animated.Value(0);

  handleScroll = event => {
    const offset = event.nativeEvent.contentOffset.y;
    const scrollHeaderOffset = this.state.headerHeight + this.state.headerY - headerHeight + 5;
    const isHeaderScrolled = scrollHeaderOffset < offset;

    if (!this.state.isHeaderScrolled && isHeaderScrolled) {
      this.setState({
        isHeaderScrolled,
      });
    }

    if (this.state.isHeaderScrolled && !isHeaderScrolled) {
      this.setState({
        isHeaderScrolled,
      });
    }
  };

  renderHeader = () => {
    const {
      title = '',
      headerContainerStyle = {},
      headerComponentContainerStyle = {},
      headlineStyle = {},
      fadeDirection,
    } = this.props;
    return (

          <Fades style={[styles.headerContainer, headerContainerStyle]} visible={this.state.isHeaderScrolled} direction={fadeDirection}>
            

            <View>
            
            <View
            ref={bview => {
            this.blurred = bview;
          }}
              style={[
                styles.headerComponentContainer,
                headerComponentContainerStyle,
              ]}
            >
              <View style={{justifyContent: 'flex-end',alignSelf: 'flex-end', display: 'flex'}}>

                {this.props.tools()}
              </View>
              <Text style={[styles.headline, headlineStyle]}></Text>
            </View>
            </View>
          </Fades>
        )
  }

  renderContent = () => {
    const {
      children,
      title = '',
      titleStyle = {},
      containerStyle = {},
      headerContainerStyle = {},
      headerComponentContainerStyle = {},
      headlineStyle = {},
      scrollContainerStyle = {},
      fadeDirection,
      scrollViewProps = {},
    } = this.props;

     const fontSize = titleStyle.fontSize || 34;
    const titleStyles = {
      fontSize,
      lineHeight: fontSize * 1.2,
    };

    
    const icon = this.props.syncingStatus == 'syncing' ? <Entypo name="cycle" size={15} color={this.context == 'dark' ? "#000" : '#fff'} style={{}} /> : (this.props.syncingStatus == 'active' ? <Entypo name="cw" size={15} color={this.context == 'dark' ? "#000" : '#fff'} style={{}} /> : (this.props.syncingStatus == 'paused' ? <Entypo name="controller-paus" size={15} color={this.context == 'dark' ? "#000" : '#fff'} style={{}} /> : (this.props.syncingStatus == 'syncingPush' ? <Entypo name="triangle-up" size={15} color={this.context == 'dark' ? "#000" : '#fff'} style={{}} /> : (this.props.syncingStatus == 'syncingPush' ?  <Entypo name="triangle-down" size={15} color={this.context == 'dark' ? "#000" : '#fff'} style={{}} /> : 'Beta'))))
    //console.log("this props sync!", this.props, icon)
    return (
      <View style={{width: '100%', flex: 1, height: '100%'}}>

          <View style={{flexDirection: 'row', display:'flex',justifyContent: 'space-between', paddingTop:70,}}>
          {
            this.props.onGoBack && 
          <TouchableOpacity onPress={() => this.props.onGoBack()} style={{zIndex:9, flexDirection: 'row', width: 150, marginTop:35, marginLeft: 10, position: 'absolute', backgroundColor:'transparent'}}>
            <EntypoIcono
                      name="chevron-left"
                      size={30}
                      color={this.context == 'dark' ? '#fff' : '#999'}
                      style={{marginRight: 5}}
                    />
            <Text style={{fontSize:20, marginTop:4,color: '#555'}}>
              
                    Back</Text>
          </TouchableOpacity>
          }
            
            <Animated.Text
              style={[
                styles.title,
                titleStyle,
                titleStyles,
                {
                  width:'60%',
                  color: this.context == 'dark' ? '#fff' : '#000'
                },
              ]}
              onLayout={this.onLayout}
              numberOfLines={1}
            >
              {title} 

            </Animated.Text>
            
            <View style={{marginTop:-5,}}>
            {
                  this.props.isBeta && <TouchableOpacity style={{position: 'absolute', right: 80, top: 0, marginTop:10,marginRight:4,backgroundColor: '#ff7575', width: icon == 'Beta' ? 50 : 35, height: 35, borderRadius:20, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: '#fff', fontWeight: '700'}}>{icon}</Text></TouchableOpacity>
                }
            {this.props.tools()}
            </View>
          </View>
          {children}
        </View>
        )
  }
  render() {
    const {
      children,
      title = '',
      titleStyle = {},
      containerStyle = {},
      headerContainerStyle = {},
      headerComponentContainerStyle = {},
      headlineStyle = {},
      scrollContainerStyle = {},
      fadeDirection,
      scrollViewProps = {},
    } = this.props;

    const fontSize = titleStyle.fontSize || 34;
    const titleStyles = {
      fontSize,
      lineHeight: fontSize * 1.2,
    };

    const animatedFontSize = this.scrollAnimatedValue.interpolate({
      inputRange: [-height, 0],
      outputRange: [fontSize * 1.1, fontSize],
      extrapolate: 'clamp',
    });

    const data = [{id: 'content'}]
    return (
        <View style={{flex:1}}>

        {this.renderHeader()}

        <FlatList
                listKey={item => item.id}
                 data={data}
                 style={[styles.container, containerStyle]}
                // getItem={(data, index) => data[index]}

                 onScroll={Animated.event(
                    [
                      {
                        nativeEvent: { contentOffset: { y: this.scrollAnimatedValue } },
                      },
                    ],
                    {
                      listener: this.handleScroll
                    }
                  )}

                 renderItem={(props)=>{
                   return this.renderContent()
                 }}
                 keyExtractor={item => item.id}
                  
               />
              </View>
    );
  }
}

export default HeaderScrollView;