import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
  Animated,
  StyleSheet
} from 'react-native';

import { BlurView, VibrancyView } from "../../blur";
const styled = StyleSheet.create({
  blurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  bottomTabBar: {
    backgroundColor: 'transparent',
  },
});

import Animator from './Animator';

const SCREEN_HEIGHT = Dimensions.get('window').height;
export const DOWN_STATE = 0
export const UP_STATE = 2
export const MIDDLE_STATE = 1

export default class BottomDrawer extends PureComponent {
  static propTypes = {
    /**
     * Height of the drawer. 
     */
    containerHeight: PropTypes.number.isRequired,

    /**
     * The amount of offset to apply to the drawer's position.
     * If the app uses a header and tab navigation, offset should equal 
     * the sum of those two components' heights.
     */
    offset: PropTypes.number,

    /**
     * Set to true to have the drawer start in up position.
     */
    startUp: PropTypes.bool,

    /**
     * How much the drawer's down display falls beneath the up display. 
     * Ex: if set to 20, the down display will be 20 points underneath the up display.
     */
    downDisplay: PropTypes.number,

    /**
     * The background color of the drawer.
     */
    backgroundColor: PropTypes.string,

    /**
     * Set to true to give the top of the drawer rounded edges.
     */
    roundedEdges: PropTypes.bool,

    /**
     * Set to true to give the drawer a shadow.
     */
    shadow: PropTypes.bool,

    /**
     * A callback function triggered when the drawer swiped into up position
     */
    onExpanded: PropTypes.func,

    /**
     * A callback function triggered when the drawer swiped into down position
     */
    onCollapsed: PropTypes.func,

    /*
     * An state for changing and toggling drawer 
     */
    drawerState: PropTypes.number
  }

  static defaultProps = {
    offset: 0,
    startUp: true,
    backgroundColor: 'transparent',
    roundedEdges: true,
    shadow: true,
    onExpanded: () => { },
    onCollapsed: () => { },
    drawerState: DOWN_STATE,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }

  constructor(props) {
    super(props);

    /**
     * TOGGLE_THRESHOLD is how much the user has to swipe the drawer
     * before its position changes between up / down.
     */
    this.TOGGLE_THRESHOLD = this.props.containerHeight / 11;
    this.DOWN_DISPLAY = this.props.downDisplay || this.props.containerHeight / 1.22;

    /**
     * UP_POSITION and DOWN_POSITION calculate the two (x,y) values for when
     * the drawer is swiped into up position and down position.
     */
    this.UP_POSITION = this._calculateUpPosition(SCREEN_HEIGHT, this.props.containerHeight, this.props.offset)
    this.DOWN_POSITION = this._calculateDownPosition(this.UP_POSITION, this.DOWN_DISPLAY)

    this.MIDDLE_POSITION = this._calculateMiddlePosition(this.UP_POSITION, this.DOWN_DISPLAY)

    this.state = { currentPosition: this.props.startUp ? this.UP_POSITION : this.DOWN_POSITION, currentState: this.props.startUp ? UP_STATE : DOWN_STATE };

    this.onLayout = this.onLayout.bind(this);
  }

  

  onLayout(e) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    });
  }

  setDrawerState(state) {
    this.setState({
      currentState: state
    })
  }

  toggleDrawerState() {
    this.setState({
      currentState: this.state.currentState === UP_STATE ? DOWN_STATE : UP_STATE
    })
  }

  openBottomDrawer() {
    this.setState({
      currentState: UP_STATE
    })
  }

  closeBottomDrawer() {
    this.setState({
      currentState: DOWN_STATE
    })
  }

  render() {
    const platformIs = Platform.OS;
    return (
      <Animator
        currentPosition={this.state.currentPosition}
        setCurrentPosition={(position) => this.setCurrentPosition(position)}
        toggleThreshold={this.TOGGLE_THRESHOLD}
        upPosition={this.UP_POSITION}
        middlePosition={this.MIDDLE_POSITION}
        downPosition={this.DOWN_POSITION}
        roundedEdges={this.props.roundedEdges}
        shadow={this.props.shadow}
        containerHeight={this.props.containerHeight}
        backgroundColor={'transparent'}
        onExpanded={() => this.props.onExpanded()}
        onCollapsed={() => this.props.onCollapsed()}
        drawerState={this.state.currentState}
        onDrawerStateSet={(state) => this.setDrawerState(state)}
      >

      { platformIs == 'ios' && <BlurView blurType="regular" blurAmount={100} blurRadius={25} style={[styled.blurView, {height: '100%', backgroundColor: 'transparent', width: '100%' }]}>
        {this.props.children}
        
        
       
        </BlurView>}

      { platformIs == 'android' && <View blurType="regular" 
        style={[styled.blurView, {height: '100%', backgroundColor: this.props.themeMode == 'dark' ? '#222' : '#fff', width: '100%' }]}>
        {this.props.children}
        
        
       
        </View>}

        
       </Animator>
    )
  }

  setCurrentPosition(position) {
    //console.log("set current position!", position)
    this.setState({ currentPosition: position })
  }

  getCurrentPosition () {
    return this.state.currentState;
  }

  _calculateUpPosition(screenHeight, containerHeight, offset) {
    return {
      x: 0,
      y: screenHeight - (containerHeight + offset)
    }
  }

  _calculateMiddlePosition(upPosition, downDisplay) {
    return {
      x: 0,
      y: (upPosition.y + downDisplay) / 2
    }
  }

  _calculateDownPosition(upPosition, downDisplay) {
    return {
      x: 0,
      y: upPosition.y + downDisplay
    };
  }
}

