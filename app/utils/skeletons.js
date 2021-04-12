import React, {Component} from 'react';

import { View } from 'react-native';
import ContentLoader, { Rect, Circle } from "react-content-loader/native"
import { useWidth } from './hooks'
export const SkeletonSection = () => {
  const ancho = useWidth();
  const numCols = Math.floor(ancho / 110);
  const rowWidth = Math.floor((ancho / numCols) - 5);
  const w = Math.floor(115 * numCols);
  const h = Math.floor(190 * 3);
  return (
    <ContentLoader 
            speed={2}
            width={444}
            height={575}
            viewBox="0 0 444 575"
            backgroundColor="#eaeaea"
            foregroundColor="#c1c1c1"

          >

            <Rect x="10" y="7" rx="8" ry="8" width="140" height="15" /> 

            <Rect x="10" y="43" rx="2" ry="2" width="110" height="161" /> 
            <Rect x="125" y="43" rx="2" ry="2" width="110" height="161" /> 
            <Rect x="240" y="43" rx="2" ry="2" width="110" height="161" />

             <Rect x="10" y="228" rx="8" ry="8" width="140" height="15" /> 

            <Rect x="10" y="263" rx="2" ry="2" width="110" height="161" /> 
            <Rect x="125" y="263" rx="2" ry="2" width="110" height="161" /> 
            <Rect x="240" y="263" rx="2" ry="2" width="110" height="161" />
            

          </ContentLoader>
          )
}

export function SkeletonGrid(props){
  const ancho = useWidth();
  const numCols = Math.floor(ancho / 110);
  const rowWidth = Math.floor((ancho / numCols) - 5);
  const w = Math.floor(115 * numCols);
  const h = Math.floor(190 * 3);
  return (
    <View style={{flex: 1, alignItems: 'center', padding: 2}}>
        <ContentLoader 
          speed={1}
          width={w}
          style={{marginTop:0}}
          height={h}
          viewBox={"0 0 "+w+" "+h}
          backgroundColor="#eaeaea"
          foregroundColor="#cccaca"
        >
          {Array.from(new Array(3)).map((itemRow, indexRow) => {
            return Array.from(new Array(numCols)).map((itemCol, indexCol) => {
              return (
                <Rect key={indexCol +'-'+indexRow} x={itemCol == 0 ? 0 : (Math.floor(115 * (indexCol)))} y={indexRow == 0 ? 0 : (Math.floor(166 * (indexRow)) )} rx="3" ry="2" width="110" height="161" /> 
              );
            })
          })}

        </ContentLoader>
      </View>
          );
}

export function SkeletonList(props){
  const ancho = useWidth();
  return (
        <ContentLoader 
          speed={2}
          width={'100%'}
          height={160}
          style={{alignSelf: 'flex-start',width: '100%', alignItems: 'flex-start'}}
          viewBox={'0 0 '+ancho+' 160'}
          backgroundColor="#dcdcdc87"
          foregroundColor="#cccaca"
        >
          <Rect x="0" y="1" rx="0" ry="0" width={'100%'} height="50" /> 
          <Rect x="0" y="54" rx="0" ry="0" width={'100%'} height="50" /> 
          <Rect x="0" y="107" rx="0" ry="0" width={'100%'} height="50" />
          <Rect x="0" y="160" rx="0" ry="0" width={'100%'} height="50" />
        </ContentLoader>
     );
}


export function SkeletonTextBook(props){
  const ancho = useWidth();
  return (
        <ContentLoader 
          speed={2}
          width={ancho - 20}
          height={300}
          viewBox="0 0 350 300"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          {...props}
        >
          <Rect x="-7" y="70" rx="3" ry="3" width={"345"} height="10" /> 
          <Rect x="21" y="90" rx="3" ry="3" width={"304"} height="10" /> 
          <Rect x="24" y="226" rx="3" ry="3" width={"233"} height="10" /> 
          <Rect x="-4" y="247" rx="3" ry="3" width={"343"} height="10" /> 
          <Rect x="24" y="267" rx="3" ry="3" width={"274"} height="10" /> 
          <Rect x="24" y="288" rx="3" ry="3" width={"109"} height="10" /> 
          <Rect x="-5" y="116" rx="0" ry="0" width={"343"} height="88" /> 
          <Rect x="295" y="130" rx="0" ry="0" width="1" height="15" /> 
          <Rect x="278" y="98" rx="0" ry="0" width="1" height="0" /> 
          <Rect x="224" y="1" rx="0" ry="0" width="0" height="1" /> 
          <Rect x="292" y="31" rx="0" ry="0" width="0" height="1" /> 
          <Rect x="57" y="1" rx="3" ry="3" width="208" height="13" />
        </ContentLoader>
     );
}


export const LineDark = ({
  textSize = 12,
  color = 'rgba(0,0,0,.5)',
  width = '100%',
  style,
  noMargin = false,
  ...props
}) => {
  const height = textSize;
  const alignSelf = 'stretch';
  const backgroundColor = props.color ? props.color : color;
  const borderRadius = textSize / 4;
  const marginBottom = noMargin ? 0 : textSize;

  const computedStyle = {
    height,
    alignSelf,
    backgroundColor,
    borderRadius,
    width,
    marginBottom,
  };

  let styles = [computedStyle, style, props.style];

  return <View style={[computedStyle, style, props.style]} {...props} />;
};

export const LineWhite = ({
  textSize = 12,
  color = '#efefef',
  width = '100%',
  style,
  noMargin = false,
  ...props
}) => {
  const height = textSize;
  const alignSelf = 'stretch';
  const backgroundColor = props.color ? props.color : color;
  const borderRadius = textSize / 4;
  const marginBottom = noMargin ? 0 : textSize;

  const computedStyle = {
    height,
    alignSelf,
    backgroundColor,
    borderRadius,
    width,
    marginBottom,
  };

  let styles = [computedStyle, style, props.style];

  return <View style={[computedStyle, style, props.style]} {...props} />;
};