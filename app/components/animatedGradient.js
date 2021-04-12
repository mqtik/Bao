import React, { Component } from "react";
import { StyleSheet, Animated } from "react-native";


import LinearGradient from "react-native-linear-gradient";

import {DarkModeContext} from 'react-native-dark-mode';
//static contextType = DarkModeContext;

const styles = StyleSheet.create({
  component: {
    flex: 1
  }
});

export class GradientHelper extends Component {
  render() {
    const {
      style,
      color1,
      color2,
      color3,
      start = { x: 0, y: 0 },
      end = { x: 0, y: 1 }
    } = this.props;
    return (
      <LinearGradient
        colors={[color1, color2, color3]}
        start={start}
        end={end}
        style={style}
      />
    );
  }
}

const AnimatedGradientHelper = Animated.createAnimatedComponent(GradientHelper);


export default class AnimatedGradient extends Component {
  static contextType = DarkModeContext;
  constructor(props) {
    super(props);

    const { colors } = props;
    this.state = {
      prevColors: colors,
      colors,
      tweener: new Animated.Value(0)
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { colors: prevColors } = state;
    const { colors } = props;
    const tweener = new Animated.Value(0);
    return {
      prevColors,
      colors,
      tweener
    };
  }

  componentDidUpdate() {
    const { tweener } = this.state;
    Animated.timing(tweener, {
      toValue: 1,
      useNativeDriver: false
    }).start();
  }

  render() {
    const { tweener, prevColors, colors } = this.state;

    const { style } = this.props;
    const color1Interp = tweener.interpolate({
      inputRange: [0, 1],
      outputRange: [prevColors[0], colors[0]]
    });

    const color2Interp = tweener.interpolate({
      inputRange: [0, 1],
      outputRange: [prevColors[1], colors[1]]
    });


    return (
      <AnimatedGradientHelper
        style={style || styles.component}
        color1={color1Interp ? color1Interp : this.props.isDarkMode == true ? '#111' : '#f7f8fa'}
        color2={color2Interp ? color2Interp : this.props.isDarkMode == true ? '#111' : '#f7f8fa'}
        color3={this.props.isDarkMode == true ? '#111' : '#f7f8fa'}
      />
    );
  }
}


