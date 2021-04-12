import {useEffect} from 'react';
import { BackHandler } from 'react-native';
/*import Color from './header.Colors'
import ThemeUtils from './header.ThemedUtils'

export {Color, ThemeUtils}*/

export function isBoolean( n ) {
    return !!n === n;
}

export function isNumber( n ) {
    return +n === n;
}

export function isString( n ) {
    return ''+n === n;
}

export function useBackButton(handler) {
  // Frustration isolated! Yay! 🎉
  useEffect(() => {
  	//console.log("back button")
    BackHandler.addEventListener("hardwareBackPress", handler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handler);
    };
  }, [handler]);
}