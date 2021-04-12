import { StyleSheet, Platform } from 'react-native';
const IS_IOS = Platform.OS === 'ios';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';

export const colors = {
    black: '#111',
    gray: '#888888',
    background1: '#1a1917',
    background2: '#545351',
    white: '#ffffff'
};

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        // edit this one for the safe area on iphone x

    },
    container: {
        //flex: 1,
        backgroundColor: 'transparent'
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    popOver: {
    width: 250,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,.3)',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
  },
    scrollview: {
        flex: 1
    },
    bottomNavOptions: {
        height: 30,
        width: '100%',
        position: 'absolute',
        bottom:getHeaderHeight() + 50,
        marginTop: 10,
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,.2)',
        marginBottom: 10,
        position: 'absolute', alignSelf: 'center', marginTop: 7, top: 0
      },
    map: {
        position: "absolute",
        top:0,
        left: 0,
        right: 0,
        },
    exampleContainer: {
        paddingTop:25,
        paddingBottom: 10
    },
    exampleContainerDark: {
       // backgroundColor: colors.black
    },
    exampleContainerLight: {
       // backgroundColor: '#f7f8fa'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
       // color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    titleWhite: {
        color: colors.white
    },
    titleDark: {
        color: colors.black
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        //color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'left'
    },
    subtitleDark: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'left'
    },
    subtitleWhite: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'left'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    modal4: {
      },
      modal: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      searchIconHeader: {
          color: '#fff', fontSize: 20,
          marginTop: IS_IOS ? 2 : 10
      },
      scrollViewBooks: {
          marginTop: 23,
      }
});
