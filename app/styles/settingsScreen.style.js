import { StyleSheet } from 'react-native';

export default StyleSheet.create({
   textStyle: {
    fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
  },
  
  buttonStyle: {
    margin: 20,
    padding:10,
    backgroundColor: '#d23d3d',
    borderRadius:5
  },

  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  sessionContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  refreshSession: {
    margin: 0,
    height: 200,
    width: '100%',
    backgroundColor: '#dc3939',
    borderRadius: 20
  }
});
