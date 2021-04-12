import React, { Component } from 'react';
import {Platform, View, Animated, Easing } from 'react-native';
import Svg, { Circle, Path, G } from "react-native-svg"

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

//const Root = ({ store, history }: Props) => (
class LoaderRings extends Component<Props> {
	constructor(props){
		super(props);

		this.state = {
		    rotation: new Animated.Value(0),
		  };
	}

	stopAnimation() {
	    this.state.rotation.stopAnimation();
	    this.setState({ rotation: new Animated.Value(0) });
	  }

	  startAnimation() {
	    Animated.loop(
	      Animated.timing(this.state.rotation, {
	        useNativeDriver: true,
	        duration: 1000,
	        toValue: 1,
	      })
	    ).start();
	  }


	 componentDidMount() {
	    this.startAnimation();
	  }
	render(){
		const width = 100;
		const offsetAndroid = Platform.OS === 'android' ? width / 2 : 0;
		const [pivotX, pivotY] = [25, 25];
		return (
			<Svg viewBox={`-${pivotX} -${pivotY} 160 160`} width={160} height={160} {...this.props}>
		      <Circle cx={80} cy={80} r={50} fill="#000"/>
		      <AnimatedG
		      		Transform="matrix(0.866, -0.5, 0.25, 0.433, 80, 80)"
		      		width={100}
		          style={{
		            transform: [
		              { translateX: -offsetAndroid },
		              {
		                rotate: this.state.rotation.interpolate({
		                  inputRange: [0, 1],
		                  outputRange: ['360deg', '180deg'], // I would like to set pivot point at 25 25
		                }),
		              },
		              { translateX: offsetAndroid },
		            ],
		          }}>
			      <AnimatedPath
			        d="M97.5 110.31a64.999 35-30 0038.79-62.81 5 2.5-30 018.66-5 74.998 35-30 01-47.45 67.81z"
			        fill="#ff7575"
			        transform={`translate(-${pivotX} -${pivotY})`}
			      />
		      </AnimatedG>
		      <Path d="M123.3 55a49.999 49.999 0 00-86.6 50z" Transform="matrix(0.866, -0.5, 0.5, 0.866, 80, 80)" />
		    </Svg>
			)
		
	}
  
};

export default LoaderRings;
