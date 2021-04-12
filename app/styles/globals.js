import { StyleSheet, Dimensions } from 'react-native';

import { DynamicStyleSheet, DynamicValue, useDynamicStyleSheet, useDarkModeContext, useDynamicValue, useDarkMode, initialMode } from 'react-native-dark-mode'






export const themeMode = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const color = isDark ? '#f1f1f1' : '#333';
  return color;
};

const themedColors = new DynamicStyleSheet({
    container: {
        backgroundColor: new DynamicValue('white', 'black'),
        flex: 1,
    },
    text: {
        color: new DynamicValue('black', 'white'),
        textAlign: 'center',
    },
})



export const globalColors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD',
    purple: '#7a44cf',
    lightDark: 'rgba(0,0,0,.1)',
    lightWhite: 'rgba(255,255,255,.2)',
    lightWhiteBorder: 'rgba(255,255,255,.1)',
    lightWhiteText: 'rgba(255,255,255,.8)',
    lowGray: '#111',
    white:'#fff'
};
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

export default StyleSheet.create({
  lightInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10
  },
  itemPopover: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'blue'
  },
  buttonLight: {
    borderRadius: 10, 
    margin: 10, 
    height: 50, 
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  buttonLightText: {
    justifyContent: 'center', 
    alignSelf: 'center',
    color: '#fff', 
    margin: 13, 
    fontSize: 18,
  },
  settingsHeadline: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },
  settingsItemList: {
    width: '100%',
    height: 40,
    marginTop: 10,
  },
  settingsItemListEditable: {
    fontSize: 16,
    color: 'rgba(255,255,255,.6)',
    fontWeight: '500',
    alignSelf: 'flex-start'
  },
  settingsItemListEditableValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    alignSelf: 'flex-end'
  },
  popOver: {
    padding:0,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: 'rgba(0,0,0,.3)',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
  },
  popOverOption: {
    padding:15,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
    alignItems: 'center',
    flexDirection: 'row'
  },
  popOverOptionLast: {
    borderBottomWidth: 0
  },
  popoverOptionIcon: {
    marginLeft: 5,
    marginRight: 15
  },
  sectionHeaderText: {
    borderWidth: 0,
    fontWeight: '300',
    fontSize: (Platform.OS === 'ios') ? 13 : 16,
    padding: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  syncTitles: {
    color: '#666',
    fontSize: 14
  },
  subSyncTitles: {
    fontSize: 12,
    color: '#555'
  },
  sortTitles: {
    fontSize: 18,
    color: '#999'

  }
});
