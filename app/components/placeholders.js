import * as React from "react"
import { View, Dimensions } from "react-native"
import ContentLoader, { Rect, Circle } from "react-content-loader/native"

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

export function SearchPlaceholder(props){
	return (
    <View style={{flex: 1, justifyContent: 'flex-start', padding: 2}}>
		    <ContentLoader 
          speed={1}
          width={'100%'}
          style={{marginTop:-12}}
          height={405}
          viewBox="0 0 400 405"
          backgroundColor="#eaeaea"
          foregroundColor="#cccaca"
        >
          <Rect x="1" y="1" rx="3" ry="2" width="129" height="200" /> 
          <Rect x="135" y="1" rx="3" ry="2" width="129" height="200" /> 
          <Rect x="268" y="1" rx="3" ry="2" width="129" height="200" />

           <Rect x="1" y="205" rx="3" ry="2" width="129" height="200" /> 
          <Rect x="135" y="205" rx="3" ry="2" width="129" height="200" /> 
          <Rect x="268" y="205" rx="3" ry="2" width="129" height="200" />

        </ContentLoader>
      </View>
          );
}

export function LoadingDocScreen(props) {
  return(
  <ContentLoader 
    speed={2}
    width={340}
    height={150}
    viewBox="0 0 340 150"
    backgroundColor="#eaeaea"
    foregroundColor="#cccaca"
    {...props}
  >
    <Rect x="3" y="50" rx="3" ry="3" width="67" height="11" /> 
    <Rect x="79" y="50" rx="3" ry="3" width="140" height="11" /> 
    <Rect x="109" y="69" rx="3" ry="3" width="53" height="11" /> 
    <Rect x="169" y="69" rx="3" ry="3" width="72" height="11" /> 
    <Rect x="3" y="69" rx="3" ry="3" width="100" height="11" /> 
    <Rect x="4" y="89" rx="3" ry="3" width="37" height="11" /> 
    <Rect x="98" y="10" rx="3" ry="3" width="147" height="16" /> 
    <Rect x="225" y="50" rx="3" ry="3" width="53" height="11" /> 
    <Rect x="246" y="69" rx="3" ry="3" width="37" height="11" /> 
    <Rect x="283" y="50" rx="3" ry="3" width="53" height="11" /> 
    <Rect x="289" y="69" rx="3" ry="3" width="37" height="11" /> 
    <Rect x="49" y="89" rx="3" ry="3" width="100" height="11" /> 
    <Rect x="159" y="89" rx="3" ry="3" width="67" height="11" /> 

    <Rect x="6" y="115" rx="8" ry="8" width="73" height="16" /> 
    <Rect x="88" y="115" rx="8" ry="8" width="53" height="16" /> 
    <Rect x="148" y="115" rx="8" ry="8" width="86" height="16" />
  </ContentLoader>
  )
}