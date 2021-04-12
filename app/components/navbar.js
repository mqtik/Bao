import React from "react";
import { Header } from "react-navigation";
import { View, Platform, Dimensions, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { BlurView, VibrancyView } from "../../libraries/blur";
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import AnimatedTabBar, {TabsConfig, BubbleTabBarItemConfig} from '@gorhom/animated-tabbar';
import Entypo from 'react-native-vector-icons/Entypo';

import Animated from 'react-native-reanimated';
import Svg, { G, Circle, Path, PathProps } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

Animated.addWhitelistedNativeProps({
  stroke: true,
});

const SearchSVG = ({ color, size }: SVGProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G
        transform="translate(3 3)"
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <AnimatedCircle cx={8} cy={8} r={8} stroke={color} />
        <AnimatedPath d="M18 18l-4.35-4.35" stroke={color} />
      </G>
    </Svg>
  );
};

const LikeSVG = ({ color, size }: SVGProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <AnimatedPath
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.501 5.501 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke={color}
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const HomeSVG = ({ color, size }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <AnimatedPath
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        stroke={color || '#000'}
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};


let ancho = Dimensions.get('window').width; //full width
let alto = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: "transparent"
  },
  bottomTabBar: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: "transparent",
    borderTopWidth: 0
  },
});

const tabs: TabsConfig<BubbleTabConfig> = {
  Home: {
    labelStyle: {
      color: '#5B37B7',
    },
    icon: {
      component: HomeSVG,
      activeColor: 'rgba(91,55,183,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    ripple: {
      color: 'rgba(0,0,0,.4)'
    },
    background: {
      activeColor: 'rgba(223,215,243,1)',
      inactiveColor: 'rgba(223,215,243,0)',
    },
  },
  Search: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: SearchSVG,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    ripple: {
      color: 'rgba(0,0,0,.4)'
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
  },
  Pad: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: LikeSVG,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    ripple: {
      color: 'rgba(0,0,0,.4)'
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
  },
  Settings: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: HomeSVG,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    ripple: {
      color: 'rgba(0,0,0,.4)'
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
  },
};
const NavbarBottom = props => {
  //console.log("navbar boott!!", props.themeMode)
  if(Platform.OS == 'ios'){
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right:0,
        }}
      >
      <BlurView 
            blurAmount={8}
            blurType={props.themeMode == undefined ? 'regular' : (props.themeMode == 'dark' ? 'dark' : 'light') }
             style={styles.blurView}>
          <BottomTabBar preset={'bubble'}  tabs={tabs} {...props} />
        {/*<AnimatedTabBar preset={'bubble'}  tabs={tabs} {...props} />*/}

      </BlurView>
      </View>
    );
  } else {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right:0,

        }}
      >
      <View style={[styles.blurView]}>
      <BottomTabBar preset={'bubble'}  tabs={tabs} {...props} />
      </View>
      </View>
    );
  }
  
};

export default NavbarBottom;