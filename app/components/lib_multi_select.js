/**
 * Multiple select list with search
 * ataomega@gmail.com
 * www.atasmohammadi.net
 * version 1.0
 */
import React, {Component, PropTypes} from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
var { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import { systemWeights } from 'react-native-typography'

export default class CustomMultiPicker extends Component {
  constructor(props){
    super(props);
    this.state = {
      pageWidth: Dimensions.get('window').width,
      pageHeight: Dimensions.get('window').height,
      searchText: null,
      selected: [],
      search: null
    };
  }

  componentDidMount = () => {
    const selected = this.props.selected
    if(typeof selected === "object"){
      selected.map(select => {
        this._onSelect(select)
      })
    } else {
      this._onSelect(selected)
    }
  }

  getNewDimensions(event){
        var pageHeight = event.nativeEvent.layout.height
        var pageWidth = event.nativeEvent.layout.width
        this.setState({
            pageHeight, pageWidth
        })
    }

  _onSelect = (item) => {
    var selected = this.state.selected
    if(this.props.multiple){
      if(selected.indexOf(item) == -1){
        selected.push(item)
        this.setState({
          selected: selected
        })
      } else {
        selected = selected.filter(i => i != item)
        this.setState({
          selected: selected
        })
      }
    } else {
      if(selected.indexOf(item) == -1){
        selected = [item]
        this.setState({
          selected: selected
        })
      } else {
        selected = []
        this.setState({
          selected: selected
        })
      }
    }
    this.props.callback(selected)
  }

  _onSearch = text => {
    this.setState({
      search: text,
      searchText: text.length > 0 ? text.toLowerCase() : null
    })
  }

  _isSelected = (item) => {
    const selected = this.state.selected
    if(selected.indexOf(item) == -1){
      return false
    }
    return true
  }

  filterObjectByValue = (obj, predicate) => {
    return Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} )
  }

  render(){
    const { options, returnValue } = this.props;
    const list = this.state.searchText ? this.filterObjectByValue(options, option => option.toLowerCase().includes(this.state.searchText)) : options
    const labels = Object.keys(list).map(i => list[i])
    const values = Object.keys(list)
    return(
      <View style={{}} onLayout={(evt)=>{this.getNewDimensions(evt)}}>
        {this.props.search && <View style={{ height: 25, marginTop: 10 }}>

        <SearchBar
              
              platform="ios"
              cancelButtonTitle="Cancel"
              style={{ left: 5, right: 5, marginTop: 10}}

              inputStyle={{backgroundColor: 'transparent', height:25}}
              containerStyle={{flex: 1, height: 25, backgroundColor: 'transparent', borderWidth: 0, margin:0, padding:0, borderRadius: 5}}
              placeholderTextColor={'#666'}
              onChangeText={this._onSearch}
              placeholder={this.props.placeholder}
              clearButtonMode={'always'}
              value={this.state.search}
            />

        </View>}
        <ScrollView
          style={[{ padding: 5, flexGrow: 1 }, this.props.scrollViewStyle]}
        >
          {labels.map((label, index) => {
            const itemKey = returnValue == "label" ? label : values[index]
            return(
              <TouchableOpacity
                key={Math.round(Math.random() * 1000000)}
                style={[{
                  padding: 3,
                  paddingLeft: 15,
                  paddingRight: 15,
                  marginTop: 0,
                  marginLeft: 3,
                  marginRight: 3,
                  marginBottom: 3,
                  backgroundColor: this.props.rowBackgroundColor,
                  height: this.props.rowHeight,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: this.props.rowRadius
                },
                  this.props.itemStyle
                ]}
                onPress={() => {
                  this._onSelect(itemKey)
                }}
              >
                {React.isValidElement(label)
                  ?
                  label
                  :
                  <Text style={systemWeights.light, {color: '#000', fontSize: 18}}>{label == 'es' ? 'Español' : 'English'}</Text>
                }
                {

                  this._isSelected(itemKey) ?
                  <Icon name={this.props.selectedIconName}
                        style={[{color: this.props.iconColor, fontSize: this.props.iconSize}, this.props.selectedIconStyle]}
                        />
                  :
                  <Icon name={this.props.unselectedIconName}
                        style={[{color: this.props.iconColor, fontSize: this.props.iconSize}, this.props.unselectedIconStyle]}
                        />
                }
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    );
  }
}