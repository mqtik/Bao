import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native';
import SortableList from 'react-native-sortable-list';
import EntypoIcono from 'react-native-vector-icons/Entypo';


const window = Dimensions.get('window');

export default class SortRow extends Component {

  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
   const {data, active, themeMode} = this.props;
   //console.log("Data of sort", data)
  //console.log("this.props", this.props)
    return (
      <Animated.View style={[
        styles.row,
        this._style,
        { borderRadius: 10,backgroundColor:  themeMode == 'dark' ? 'rgba(255,255,255,0.0)' : 'rgba(0,0,0,0.6)' }
      ]}>
        <TouchableOpacity onPress={() => this.props.onOpenChapter(data.data)} style={{width: '85%', height: 20}}>
          <Text numberOfLines={1} style={[styles.text, {color: themeMode == 'dark' ? '#fff' : '#fff', fontWeight: '500'}]}>{data.data.title}</Text>
        </TouchableOpacity>
        <EntypoIcono
                      name="dots-two-horizontal"
                      size={20}
                      color={'rgba(255,255,255,.4)'}
                      style={{alignSelf: 'flex-end', position: 'absolute', right: 15, top: 15}}
                    />
      </Animated.View>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },

  title: {
    fontSize: 20,
    paddingVertical: 20,

  },

  list: {
    flex: 1,
  },

  contentContainer: {
    width: window.width,

    ...Platform.select({
      ios: {
        paddingHorizontal: 30,
      },

      android: {
        paddingHorizontal: 0,
      }
    })
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
   
    padding: 16,
    height: 50,
    marginTop: 3,
    marginBottom: 3,
    borderRadius: 8,
    width: '100%',

    ...Platform.select({
      ios: {
        width: window.width - 10 * 2,
        shadowColor: '#111',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },

      android: {
        width: window.width - 10 * 2,
        elevation: 0,
        marginHorizontal: 30,
      },
    })
  },

  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },

  text: {
    fontSize: 18,
    color: '#fff',
  },
});