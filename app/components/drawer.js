import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, Dimensions, findNodeHandle, Image, Text, TouchableOpacity } from 'react-native';
import { BlurView, VibrancyView } from "../../libraries/blur";
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'
import Animated from 'react-native-reanimated'
import { useHeight } from '../utils/hooks'
const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

import BottomSheet from 'reanimated-bottom-sheet'

import {DarkModeContext} from 'react-native-dark-mode';

function Drawer(props, ref){
  const isDarkMode = useDarkMode();
  const alto = useHeight();
 // console.log("drawer props!", props, ref)
  const isX = Platform.OS === "ios" && (Dimensions.get("window").height >= 812 || Dimensions.get("window").width >= 812) ? true : false

const altos = Platform.OS == 'ios' ? (isX ? alto - 35 : alto) : (alto - getHeaderHeight());

const offset = Platform.OS == 'ios' ? (isX ? getHeaderHeight() * 2 - 50 : getHeaderHeight() * 2 - 30) :  getHeaderHeight() + 5;

  function _renderInner(){
    return (  <View style={[styles.panel,props.innerStyle, {backgroundColor: props.style.backgroundColor}]}>
        {props.children}
        
        { Platform.OS == 'ios' && <BlurView 
        
                  blurType="regular" 
                  blurAmount={10} 
        
                    reducedTransparencyFallbackColor="white"
                  blurRadius={25} 
                  style={[styles.blurView, {zIndex:-1 }]} />
                }
      </View>
    )
  }

  function snapTo(index){
    drawer.snapTo(index)
  }

  const _renderHeader = () => props.header ? 
    <>
      <View style={[styles.panelHandle,{backgroundColor: isDarkMode == true ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,.4)'}]}/>
      {props.header()}
    </> : <View style={styles.header} />

  const fall = new Animated.Value(1)
  const drawer = React.useRef(null);
  const snapOne = props.scaleTwo == true ? altos + 50: altos;
  const snapTwo = props.scaleTwo == true ? offset + 50 : offset + 50;
  return (
        <BottomSheet
         ref={drawer}
          snapPoints={props.scaleTwo == true ? [altos, (offset + 50), offset ] : [altos, offset ]}
          renderContent={_renderInner}
          renderHeader={_renderHeader}
          overdragResistanceFactor={0}
          isRoundBorderWithTipHeader={true}
          enabledContentTapInteraction={false}
          style={props.style || null}
          initialSnap={1}
          callbackNode={fall}
          enabledInnerScrolling={true}
          enabledContentGestureInteraction={true}
        />
    );
}

export default React.forwardRef((props, ref) => ( <Drawer {...props} ref={ref} />));
 class Drawer22 extends PureComponent {
  static contextType = DarkModeContext;

  constructor(props) {  
    super(props);

  }


  renderInner = () => (
    <View style={[styles.panel,this.props.innerStyle]}>
      {this.props.children}
      
      { Platform.OS == 'ios' && <BlurView 

        blurType="regular" 
        blurAmount={10} 

          reducedTransparencyFallbackColor="white"
        blurRadius={25} 
        style={[styles.blurView, {zIndex:-1 }]} />
      } 
    </View>
  )

  snapTo = (index) => {
    this.drawer.snapTo(index)
  }

  renderHeader = () => this.props.header ? 
    <>
      <View style={[styles.panelHandle,{backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,.4)'}]}/>
      {this.props.header()}
    </> : <View style={styles.header} />

  fall = new Animated.Value(1)

  render() {
    //console.log("this props drawer", this.props)
    return (
        <BottomSheet
          ref={ref => this.drawer = ref}
          snapPoints={[altos, offset ]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          overdragResistanceFactor={0}
          isRoundBorderWithTipHeader={true}
          enabledContentTapInteraction={false}
          style={this.props.style || null}
          initialSnap={1}
          callbackNode={this.fall}
          enabledInnerScrolling={true}
          enabledContentGestureInteraction={true}
        />
    );
  }
}
const IMAGE_SIZE = 200

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  blurView: {
    position: 'absolute',
    width: Screen.width,
    height: Screen.height,
    top: 0,
    backgroundColor: Platform.OS == 'android' ? 'rgba(255,255,255,1)' : 'transparent'
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  panelContainer: {

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
  },
  header: {
    width: '100%',
    height: 50,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,.1)',
        marginBottom: 0,
        position: 'absolute', alignSelf: 'center', marginTop: 0, top: 5, zIndex:9
      },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    //marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#292929',
    alignItems: 'center',
    //marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
  },
  map: {
    height: 100,
    width: 100,
  },
});