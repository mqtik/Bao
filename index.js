/** @format */
import {decode, encode} from 'base-64'

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}
import process from 'process';
global.Buffer = global.Buffer || require('buffer').Buffer
// Avoid using node dependent modules
process.browser = true;

require('react-native-gesture-handler'); 
import { AppRegistry } from 'react-native';
import App from './app/app';
import {name as appName} from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { enableScreens } from 'react-native-screens';

//enableScreens();

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));


//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
