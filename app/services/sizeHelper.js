import { Dimensions, DeviceInfo, Platform, StatusBar } from 'react-native';
import { Header } from 'react-navigation-stack';

export const LANDSCAPE = 'landscape';
export const PORTRAIT = 'portrait';

const isX = Platform.OS === "ios" && (Dimensions.get("window").height >= 812 || Dimensions.get("window").width >= 812) ? true : false

export const getHeaderHeight = () => {
  let height;
  const orientation = getOrientation();
  height = getHeaderSafeAreaHeight();
  height += isX ? 24 : 0;

  return height;
};

// This does not include the new bar area in the iPhone X, so I use this when I need a custom headerTitle component
export const getHeaderSafeAreaHeight = () => {
  const orientation = getOrientation();
  if (Platform.OS === 'ios' && orientation === LANDSCAPE && !Platform.isPad) {
    return 32;
  }
  
  return Header.HEIGHT;
};

export const getHeaderNavHeight = () => {
  const orientation = getOrientation();
  let height = Header.HEIGHT;

  if (Platform.OS === 'ios' && orientation === LANDSCAPE && !Platform.isPad) {
    return 32;
  }

  if(StatusBar.currentHeight == 24){
    height = StatusBar.currentHeight - 4;
  } else {
    height -= StatusBar.currentHeight + 20;
  }

  return height;
}

export const getOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height ? LANDSCAPE : PORTRAIT;
};