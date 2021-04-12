import { DynamicStyleSheet, DynamicValue, useDynamicValue } from 'react-native-dynamic'

export const SignedOutCSS = new DynamicStyleSheet({
    mainContent: {
        flex: 1,
    },
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },

  flexElement: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
      margin: 0,
      height: 60,
      borderColor: 'rgba(255,255,255,.1)',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderWidth: 1,
      width: '90%',
      padding: 10,
      borderRadius: 0,
      fontSize: 20
   },
   mainButton: {
    height: 60, 
    width: '80%',
    maxWidth: 300, 
    position: 'absolute',
    backgroundColor: '#ff7575', 
    borderRadius: 8, 
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainButtonText:{
  	color: '#fff',
    fontSize:19,
    fontWeight: '600'
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  flexElement: {
    flex: 1,
    alignItems: 'center'
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',

    fontSize: 17,
  },
  tagsContainer: {
    width: 350, height: 230,
                    flexWrap: 'wrap', 
                    borderRadius: 30,
                    alignSelf: 'center',
                    flexDirection:'row',
                    alignItems: 'center',
                    justifyContent: 'center'
  },
  tagSingle: {
    backgroundColor: '#ccc', 
    margin:2,
                    flexWrap: 'wrap', 
                    borderRadius: 30,
                    alignItems: 'flex-start',
                    flexDirection:'row',
                    justifyContent: 'center',
                    padding: 2
  },
  title: {
    fontSize: 26,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    /*textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10*/
  },
    sessionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  suggestButton: {
    backgroundColor: '#eaeaea',
    borderRadius: 30,
    padding:10,
    width:'auto',
    marginRight: 5
  },
  headlineAuth: {
    fontSize: 17,
    justifyContent: 'center', alignSelf: 'center',
  },
  headline: {
    fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 0.5,

        textAlign: 'left'
  },
  subline: {
    letterSpacing: 0.5,
    fontSize: 17,
    textAlign: 'left',

  },
})