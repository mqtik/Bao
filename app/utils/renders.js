import * as React from 'react';
import { TouchableOpacity, Text, View, FlatList, StyleSheet, TouchableNativeFeedback, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import sliderStyles from '../styles/SliderEntry.style';
import TouchableScale from 'react-native-touchable-scale';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image'
import _ from "lodash"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'
import moment from "moment";
import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';
import { TouchableRipple,
  useTheme,
  Avatar,
  Title,
  Caption,
  Menu,
  Paragraph,
  Drawer,
  IconButton,
  Divider,
  Switch } from 'react-native-paper';
import { Clouch, withClouch, withNewt, Newt, NewtProvider } from './context'
import {
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useWidth } from './hooks'
const Image = createImageProgress(FastImage);
const Touchable = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback;

const drawerStyles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHeader: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});


function DrawerContentCore(props) {
  const BaoDB = React.useContext(Newt);
  const navigation = props.navigation;  
  const [menuOptions, setMenuOptions] = React.useState(false);

 // console.log("drawer cotent !", props)
 function _renderFirstOptions(){
  if(BaoDB.accountType == 'courier'){
    return (
      <Drawer.Section style={drawerStyles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="home-city"
                color={color}
                size={size}
              />
            )}
            label="Home"
            onPress={() => navigation.navigate("Home")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="map-marker-radius" color={color} size={size} />
            )}
            label="Mapa"
            onPress={() => navigation.navigate("Mapa")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="currency-usd-circle-outline" color={color} size={size} />
            )}
            label="Balance"
            onPress={() => navigation.navigate("Search")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account-settings" color={color} size={size} />
            )}
            label="Cuenta"
            onPress={() => navigation.navigate("Search")}
          />
        </Drawer.Section>
        )
  }
  if(BaoDB.accountType == 'business'){
    return (
      <Drawer.Section style={drawerStyles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="home-city"
                color={color}
                size={size}
              />
            )}
            label="Home"
            onPress={() => navigation.navigate("Home")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="map-marker-radius" color={color} size={size} />
            )}
            label="Mapa"
            onPress={() => navigation.navigate("Mapa")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="currency-usd-circle-outline" color={color} size={size} />
            )}
            label="Balance"
            onPress={() => navigation.navigate("Search")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account-settings" color={color} size={size} />
            )}
            label="Cuenta"
            onPress={() => navigation.navigate("Profile")}
          />
        </Drawer.Section>
        )
  }
  return (
    <Drawer.Section style={drawerStyles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="home-city"
                color={color}
                size={size}
              />
            )}
            label="Home"
            onPress={() => navigation.navigate("Home")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="map-marker-radius" color={color} size={size} />
            )}
            label="Mapa"
            onPress={() => navigation.navigate("Mapa")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="map-search" color={color} size={size} />
            )}
            label="Buscar"
            onPress={() => navigation.navigate("Search")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="account-settings"
                color={color}
                size={size}
              />
            )}
            label="Cuenta"
            onPress={() => navigation.navigate("Profile")}
          />
        </Drawer.Section>
      )
 }
 function _renderPreferences(){
   if(!BaoDB.rootUser){
     return null;
   }
  if(BaoDB.accountType == 'courier'){
    return (
      <Drawer.Section title="Preferencias">
          <TouchableRipple onPress={() => {}}>
            <View style={drawerStyles.preference}>
              <Text>Aceptando pedidos</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
        )
  }
  if(BaoDB.accountType == 'business'){
    return (
      <Drawer.Section title="Preferencias">
          <TouchableRipple onPress={() => {}}>
            <View style={drawerStyles.preference}>
              <Text>Cerrar negocios</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
        )
  }
  return (
    <Drawer.Section title="Preferencias">
          <TouchableRipple onPress={() => {}}>
            <View style={drawerStyles.preference}>
              <Text>Modo Vegetariano</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
        )
 }
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={
          drawerStyles.drawerContent
        }
      >
        <View style={drawerStyles.userInfoSection}>
          <View style={drawerStyles.rowHeader}>
            { BaoDB.rootUser &&
              <Avatar.Image
                source={{
                  uri:
                    BaoDB.rootUser.avatar
                }}
                size={50}
              />
            }
            <View style={{marginLeft: 10, marginTop:-20}}>
              <Title style={drawerStyles.title}>{BaoDB.rootUser.full_name}</Title>
              <Caption style={drawerStyles.caption}>@{BaoDB.rootUser.name}</Caption>
            </View>
            <View style={{display: 'flex', justifyContent: 'flex-end', alignSelf: 'flex-end', justifySelf: 'flex-end', position: 'absolute', right: 0, alignItems: 'flex-end'}}>
             <Menu
              visible={menuOptions}
              onDismiss={() => setMenuOptions(false)}
              anchor={<IconButton
                  icon="chevron-down"
                  color={"#000"}
                  size={20}
                  style={{}}
                  onPress={() => setMenuOptions(true)}
                />}>
              <Menu.Item onPress={() => BaoDB.setAccountType('regular')} title="Regular" />
              <Divider />
              <Menu.Item onPress={() => BaoDB.setAccountType('business')} title="Business" />
              <Menu.Item onPress={() => BaoDB.setAccountType('courier')} title="Courier" />
            </Menu>
          </View>
          </View>
          <View style={drawerStyles.row}>
            <View style={drawerStyles.section}>
              <Paragraph style={[drawerStyles.paragraph, drawerStyles.caption]}>
                202
              </Paragraph>
              <Caption style={drawerStyles.caption}>Ordenes</Caption>
            </View>
            <View style={drawerStyles.section}>
              <Paragraph style={[drawerStyles.paragraph, drawerStyles.caption]}>
                159
              </Paragraph>
              <Caption style={drawerStyles.caption}>Siguiendo</Caption>
            </View>
          </View>
        </View>
        {_renderFirstOptions()}
        <Drawer.Section title="Bao">
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="help-circle" color={color} size={size} />
            )}
            label="Ayuda"
            onPress={() => navigation.navigate("Business")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="message-settings" color={color} size={size} />
            )}
            label="Contacto"
            onPress={() => navigation.navigate("Couriers")}
          />
        </Drawer.Section>
        {_renderPreferences()}
      </View>
    </DrawerContentScrollView>
  );
}


export const DrawerContent = React.memo(DrawerContentCore);

function SectionListCore({items, to, offlineBooks}){
	//console.log("section list!", items, to)
	const navigation = useNavigation();
	const isDarkMode = useDarkMode();

  function touchMore(title, items){
    if(to == 'grid'){
      navigation.navigate("Grid", {
        title: title,
        items: items
      })
    }
  }

  function _renderHeader(){
    if(!offlineBooks){
      return null;
    }

    return <CarouselListCircle navigation={navigation} items={offlineBooks} />
  }

	return <FlatList
               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               updateCellsBatchingPeriod={1500}
               horizontal={false}
               contentContainerStyle={{paddingTop: getHeaderHeight() + 15, paddingBottom: getHeaderHeight()}}
               style={{ }}
               ListHeaderComponent={() => _renderHeader()}
               renderItem={({ item, index }) => 
           			<View style={{flex:1}}>
      						<TouchableOpacity onPress={() => touchMore(item.category, item.docs)} style={{padding:15, flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}>
      							<Text style={{textTransform: 'capitalize', fontSize: 22, fontWeight: '700', color: isDarkMode == true ? '#fff' : '#000'}}>{item.category}</Text>
      							<View style={{marginTop:1}}>
      								<Icon
      		                          name={'chevron-right'}
      		                          color={isDarkMode == true ? '#fff' : '#000'}
                                    style={{marginTop:5}}
      		                          size={20}
      		                        />
      	           </View>
      						</TouchableOpacity>
						      <CarouselList navigation={navigation} items={item.docs} />
					    </View>
				     }
               keyExtractor={(item, index) => index.toString()}
            />
} 
export const SectionList = React.memo(SectionListCore);

export function NewSectionListCore({items, to, ListHeaderComponent}){

  const navigation = useNavigation();
  const isDarkMode = useDarkMode();

  function touchMore(item){
    if(to == 'gridCollections'){
      navigation.navigate("Collections", {
        _id: item._id
      })
    }
    if(to == 'gridProfile'){
      navigation.navigate("Profile", {
        _id: item.title
      })
    }
  }
  return <FlatList
               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               updateCellsBatchingPeriod={1500}
               horizontal={false}
               ListHeaderComponent={() => ListHeaderComponent != null && ListHeaderComponent()}
               contentContainerStyle={{paddingTop: getHeaderHeight() + 15, paddingBottom: getHeaderHeight()}}
               style={{ }}
               renderItem={({ item, index }) => 
                <View style={{flex:1}}>
                  <TouchableOpacity onPress={() => touchMore(item)} style={{padding:15, flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}>
                    <Text style={{textTransform: 'capitalize', fontSize: 22, fontWeight: '700', color: isDarkMode == true ? '#fff' : '#000'}}>{item.title}</Text>
                    <View style={{marginTop:1}}>
                      <Icon
                                    name={'chevron-right'}
                                    color={isDarkMode == true ? '#fff' : '#000'}
                                    style={{marginTop:5}}
                                    size={20}
                                  />
                   </View>
                  </TouchableOpacity>
                  <CarouselList navigation={navigation} items={item.rows} />
              </View>
             }
               keyExtractor={(item, index) => index.toString()}
            />
} 
export const NewSectionList = React.memo(NewSectionListCore);

export function GridListHomeCore({items, ListHeaderComponent, onEndReached, onEndReachedThreshold, onMomentumScrollBegin}){
  const navigation = useNavigation();
  const isDarkMode = useDarkMode();
  const endProps = {onEndReached, onEndReachedThreshold, onMomentumScrollBegin};
  const ancho = useWidth();
  const numCols = Math.floor(ancho / 110);
  const rowWidth = Math.floor((ancho / numCols) - 5);
  return <FlatList

               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               ListHeaderComponent={() => ListHeaderComponent != null && ListHeaderComponent()}
               updateCellsBatchingPeriod={1500}
               columnWrapperStyle={{justifyContent: "space-around", marginBottom: 5, backgroundColor: 'transparent'}}
               horizontal={false}
               numColumns={numCols}
               contentContainerStyle={{ paddingTop: getHeaderHeight() + 10,paddingBottom: getHeaderSafeAreaHeight() * 3 + 20}}
               style={{ flex: 1, width: '100%' }}
               renderItem={({ item, index }) => 
                  <BookCover rowWidth={rowWidth} style={{marginBottom:2}} navigation={navigation} key={index} data={item} all={items} even={(index + 1) % 2 === 0} navigation={navigation} />}
               keyExtractor={item => "_"+item._id}
               key={"_"+numCols}
               {...endProps}
            /> 
} 
export const GridListHome = React.memo(GridListHomeCore);
export function GridListCore({items, contentContainerStyle, onEndReached, onEndReachedThreshold, onMomentumScrollBegin}){
  const navigation = useNavigation();
  const endProps = {onEndReached, onEndReachedThreshold, onMomentumScrollBegin};
  const isDarkMode = useDarkMode();
  const ancho = useWidth();
  const numCols = Math.floor(ancho / 110);
  const rowWidth = Math.floor((ancho / numCols) - 5);
  return <FlatList
               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               updateCellsBatchingPeriod={1500}
               columnWrapperStyle={{justifyContent: "space-around", marginBottom: 5, backgroundColor: 'transparent'}}
               horizontal={false}
               numColumns={numCols}
               contentContainerStyle={[{ paddingTop: 10,paddingBottom: getHeaderSafeAreaHeight() * 3 + 20}, contentContainerStyle]}
               style={{ flex: 1, width: '100%' }}
               renderItem={({ item, index }) => 
                  <BookCover rowWidth={rowWidth} style={{marginRight: 5, marginBottom:2}} navigation={navigation} key={index} data={item} all={items} even={(index + 1) % 2 === 0} navigation={navigation} />}
               keyExtractor={item => "_"+item._id}
               key={"_"+numCols}
               {...endProps}  
            /> 
} 
export const GridList = React.memo(GridListCore);

export function GridListProfileCore({items, onEndReached, onEndReachedThreshold, onMomentumScrollBegin}){
  const navigation = useNavigation();
  const isDarkMode = useDarkMode();
  const ancho = useWidth();
  const numCols = Math.floor(ancho / 110);
  const rowWidth = Math.floor((ancho / numCols) - 5);
  const endProps = {onEndReached, onEndReachedThreshold, onMomentumScrollBegin};

  return <FlatList
               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               updateCellsBatchingPeriod={1500}
               columnWrapperStyle={{justifyContent: "space-around", marginBottom: 5, backgroundColor: 'transparent'}}
               horizontal={false}
               numColumns={numCols}
               contentContainerStyle={{ paddingTop: 10,paddingBottom: getHeaderSafeAreaHeight() * 3 + 20}}
               style={{ flex: 1, width: '100%' }}
               renderItem={({ item, index }) => 
                  <BookCoverProfile rowWidth={rowWidth} style={{marginRight: 5, marginBottom:2}} navigation={navigation} key={index} data={item} all={items} even={(index + 1) % 2 === 0} navigation={navigation} />}
               keyExtractor={item => "_"+item._id}
               key={"_"+numCols}
               {...endProps}
            /> 
} 
export const GridListProfile = React.memo(GridListProfileCore);

export function ListNotificationCore({items}){
  const navigation = useNavigation();
  const isDarkMode = useDarkMode();

  function readObject(object){
    navigation.navigate('Reader',{
            _id: object._id
         });
  }

  function _renderList(key,index){
    const object = key.objects[0];
    return (
      <TouchableOpacity onPress={() => readObject(object)} style={{marginBottom:10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width:'100%'}}>
        <View style={{flexDirection: 'row', display: 'flex', justifyContent: 'flex-start', maxWidth: '80%'}}>
          <Cover item={object} style={{marginLeft:5}} />
          <Text numberOfLines={2} style={{color: isDarkMode == true ? '#fff' : '#000',fontSize:19,  margin:5, marginLeft:15}}>{key.message}</Text>
        </View>
        <Text style={{fontSize:12, color: '#999', marginRight:10, marginTop: 19}}>{moment(key.created_at).fromNow()}</Text>
      </TouchableOpacity>
      )
  }


  return <FlatList
               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               updateCellsBatchingPeriod={1500}
               horizontal={false}
               contentContainerStyle={{paddingTop: getHeaderHeight() + 15, paddingBottom: getHeaderSafeAreaHeight() * 3 + 20}}
               style={{ flex: 1, width: '100%' }}
               renderItem={({ item, index }) => _renderList(item, index)}
                  keyExtractor={item => item._id}
            /> 
} 
export const ListNotification = React.memo(ListNotificationCore);

export function ListUsersCore({items, onEndReached, onEndReachedThreshold, onMomentumScrollBegin}){
  const endProps = {onEndReached, onEndReachedThreshold, onMomentumScrollBegin};
  const navigation = useNavigation();
  const isDarkMode = useDarkMode();

  function readObject(object){
    navigation.navigate('Profile',{
            _id: object.name
         });
  }

  function _renderList(key,index){

    return (
      <TouchableRipple onPress={() => readObject(key)} style={{marginBottom:10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width:'100%'}}>
        <View style={{flexDirection: 'row', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', maxWidth: '80%', padding:10}}>
          <Avatar.Image size={40} source={key.avatar && key.avatar} />
          <Text numberOfLines={2} style={{color: isDarkMode == true ? '#fff' : '#000',fontSize:20,  margin:0, marginTop: -3, marginLeft:15}}>{key.name}</Text>
        </View>
      </TouchableRipple>
      )
  }


  return <FlatList
               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               updateCellsBatchingPeriod={1500}
               horizontal={false}
               contentContainerStyle={{paddingTop:0, paddingBottom: getHeaderSafeAreaHeight() * 3 + 20}}
               style={{ flex: 1, width: '100%' }}
               renderItem={({ item, index }) => _renderList(item, index)}
                  keyExtractor={item => item._id}
                {...endProps}
            /> 
} 
export const ListUsers = React.memo(ListUsersCore);

export function CarouselListCore({ navigation, items}){
	return <FlatList
               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               updateCellsBatchingPeriod={1500}
               horizontal={true}
               contentContainerStyle={{paddingLeft:15, paddingRight: 10}}
               style={{ }}
               renderItem={({ item, index }) => 
               		<BookCover style={{marginRight: 5}} navigation={navigation} key={index} data={item} all={items} even={(index + 1) % 2 === 0} navigation={navigation} />}
               keyExtractor={(item, index) => index.toString()}
            />
} 

export const CarouselList = React.memo(CarouselListCore);

export function CarouselListCoreCircle({ navigation, items}){
  return <FlatList
               data={items}
               initialNumToRender={9}
               maxToRenderPerBatch={9}
               updateCellsBatchingPeriod={1500}
               horizontal={true}
               contentContainerStyle={{paddingLeft:15, paddingRight: 10}}
               style={{ }}
               renderItem={({ item, index }) => 
                  <BookCoverCircle style={{marginRight: 5}} navigation={navigation} key={index} data={item} all={items} even={(index + 1) % 2 === 0} navigation={navigation} />}
               keyExtractor={(item, index) => index.toString()}
            />
} 

export const CarouselListCircle = React.memo(CarouselListCoreCircle);

export function UserSelect({item, onPress}){
	return (
		<TouchableOpacity onPress={() => onPress()}>
			<Text>{item.name}</Text>
		</TouchableOpacity>
		)
} 

export function UserAvatar({item, onPress, style}){
  return (
      <Image 
            source={ item.avatar != null ? { uri: item.avatar, priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : require('../../assets/icons/newt_new_icon_transparent.png')}
            indicator={Progress.Circle}
            indicatorProps={{
                        size: 30,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
              containerStyle={[{borderRadius: 10,}]}
              style={[{borderRadius: 50,width: 40, height:40,}, style]}
              parallaxFactor={0.35}
              borderRadius={50}
              showSpinner={true}
              imageStyle={{borderRadius: 50,width: 40, height:40, backgroundColor: '#000'}}
              spinnerColor={'rgba(0, 0, 0, 0.25)'}
            >
             <View style={{justifyContent: 'center', alignSelf: 'center', width: 40, height: 40}}>
                 <Text>{item.name.charAt(0)}</Text>
              </View>
            </Image>
    )
} 


class BookCover extends React.PureComponent {
   constructor(props) {
        super(props);
    }

    _renderProgress = (book) => {
      
      let p, progress;
      if(!book.progress || !book.count_chapters){
        return;
      }
      let pg = parseFloat(book.progress.index), cg = parseFloat(book.progress.total_index);
        progress = ((pg / cg));
        p = progress > 1 ? 1 : (progress == 0 ? 0.05 : progress);

      return (
        <Progress.Bar width={100} color={'#2cbb2c'} progress={p} size={30} style={{marginTop: 5, alignSelf: 'center'}}/>
        )
   }

    image = () => {
        const { data: { cover, colors }, parallax, parallaxProps, even } = this.props;
       //console.log("Cover!", cover);
      return (
          <Image 
            source={ cover != null ? { uri: cover, priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : require('../../assets/icons/newt_new_icon_transparent.png')}
            indicator={Progress.Circle}
            indicatorProps={{
                        size: 30,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
              containerStyle={[sliderStyles.imageContainer, {borderRadius: 10,}]}
              style={[sliderStyles.image, {borderRadius: 10}]}
              parallaxFactor={0.35}
              borderRadius={12}
              showSpinner={true}
              imageStyle={{borderRadius: 10, backgroundColor: colors && colors[0] ? colors[0] : '#eaeaea'}}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            >

             <View style={{justifyContent: 'center', alignSelf: 'center', width: '80%'}}>
                      { 
                        this._renderProgress(this.props.data)
                      }
                      </View>
            </Image>
        );
       
        
    }


    
    onDocPress = (doc) => {
      //console.log("Doc pressed", doc)
      let docIndex = _.findIndex(this.props.all, ['_id', doc._id]);



      let filtered = this.props.all;
       // console.log("index! filtered!", index, indexOf, filtered)

        if(filtered.length > 20 && docIndex > 20){

          filtered = filtered.slice(docIndex - 10, docIndex + 10);
        }
        if(filtered.length > 20 && docIndex < 20){

          filtered = filtered.slice(0, 20)
        }

        docIndex = _.findIndex(filtered, ['_id', doc._id]);

      this.props.navigation.navigate('Details',{
                                        currentDoc: doc,
                                        allDocs: filtered,
                                        indexOfSlider: docIndex
                                      });
   }

    render () {
        const { data: { title, description, percentage, colors }, even } = this.props;
        let percentageBook = (percentage * 100).toFixed(0);
        const uppercaseTitle = title ? (
            <Text
              style={sliderStyles.title}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        const ancho = Dimensions.get('window').width;
        let colN = ancho >= 1024 ? 5 : 3;
                return (
                    <TouchableScale
                      activeOpacity={8}
                      activeScale={0.95}
                      style={[sliderStyles.slideInnerContainerSearch, {width: (this.props.rowWidth || 110), height: 161, borderRadius: 12}, this.props.style && this.props.style]}
                      onPress={() => { this.onDocPress(this.props.data);  }}
                      >
                      <View shadowtyle={sliderStyles.shadow} />
                       <View style={[sliderStyles.imageContainer, {backgroundColor: colors ? colors[1] : '#000', borderRadius: 10}]}>
                           
                         { this.image() }
                         <View style={sliderStyles.radiusMask} />
                         
                         <LinearGradient
                                    colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgb(0, 0, 0)']}
                                    style={[sliderStyles.contentContainer, {borderRadius: 10}]}
                                  />
                              {percentageBook != 'NaN' && 
                                       
                                          <Progress.Circle style={{position: 'absolute', top: 10, right: 10, flex: 1, justifyContent: 'center', alignItems: 'center'}} color={'#55c583'} progress={percentage} size={50} />
                              }
                         <View style={[sliderStyles.textContainer,{borderRadius: 10}]}>
                             
                             
                           <Text
                              style={sliderStyles.title}
                              numberOfLines={2}
                            >
                                { title.toUpperCase() }
                            </Text>
                         </View>

                        </View>
                        
                    </TouchableScale>
                );
              

    }
}

class BookCoverCircle extends React.PureComponent {
   constructor(props) {
        super(props);
    }

    _renderProgress = (book) => {
      
      let p, progress;
      if(!book.progress || !book.count_chapters){
        return;
      }
      let pg = parseFloat(book.progress.index), cg = parseFloat(book.progress.total_index);
        progress = ((pg / cg));
        p = progress > 1 ? 1 : (progress == 0 ? 0.05 : progress);

      return (
      <View style={{alignSelf: 'center', justifyContent: 'center', position: 'absolute', left:0, top:0, zIndex:1}}>

        <Progress.Circle color={'#2cbb2c'} progress={p} size={60}/>
      </View>
        )
   }

    image = () => {
        const { data: { cover, colors }, parallax, parallaxProps, even } = this.props;
       //console.log("Cover!", cover);
      return (
          <Image 
            source={ cover != null ? { uri: cover, priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : require('../../assets/icons/newt_new_icon_transparent.png')}
            indicator={Progress.Circle}
            indicatorProps={{
                        size: 30,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
              containerStyle={[sliderStyles.imageContainer, {borderRadius: 50,}]}
              style={[sliderStyles.image, {borderRadius: 50}]}
              parallaxFactor={0.35}
              borderRadius={50}
              showSpinner={true}
              imageStyle={{borderRadius: 50, backgroundColor: colors && colors[0] ? colors[0] : '#eaeaea'}}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            >
            </Image>
        );
       
        
    }


    
    onDocPress = (doc) => {
      //console.log("Doc pressed", doc)

      this.props.navigation.navigate('Reader',{
           _id: doc._id,
           readingIndex: doc.progress && doc.progress.index ? doc.progress.index : 0,
           editMode: false
        });
   }

    render () {
        const { data: { title, description, percentage, colors }, even } = this.props;
        let percentageBook = (percentage * 100).toFixed(0);
        const uppercaseTitle = title ? (
            <Text
              style={sliderStyles.title}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        const ancho = Dimensions.get('window').width;
        let colN = ancho >= 1024 ? 5 : 3;
                return (
                    <TouchableScale
                      activeOpacity={8}
                      activeScale={0.95}
                      style={[sliderStyles.slideInnerContainerSearch, {width: 60, height: 60, borderRadius: 50}, this.props.style && this.props.style]}
                      onPress={() => { this.onDocPress(this.props.data);  }}
                      >
                      { 
                        this._renderProgress(this.props.data)
                      }
                       <View style={[sliderStyles.imageContainer, {backgroundColor: colors ? colors[1] : '#000', borderRadius: 50}]}>
                           
                         { this.image() }
                         


                        </View>
                        
                    </TouchableScale>
                );
              

    }
}


class BookCoverProfile extends React.PureComponent {
   constructor(props) {
        super(props);
    }
    _renderProgress = (book) => {
      
      let p, progress;
      if(!book.progress || !book.count_chapters){
        return;
      }
      let pg = parseFloat(book.progress.index), cg = parseFloat(book.progress.total_index);
        progress = ((pg / cg));
        p = progress > 1 ? 1 : (progress == 0 ? 0.05 : progress);

      return (
        <Progress.Bar width={100} color={'#2cbb2c'} progress={p} size={30} style={{marginTop: 5, alignSelf: 'center'}}/>
        )
   }

    image = () => {
        const { data: { cover, colors }, parallax, parallaxProps, even } = this.props;
       //console.log("Cover!", cover);
      return (
          <Image 
            source={ cover != null ? { uri: cover, priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : require('../../assets/icons/newt_new_icon_transparent.png')}
            indicator={Progress.Circle}
            indicatorProps={{
                        size: 30,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
              containerStyle={[sliderStyles.imageContainer, {borderRadius: 10,}]}
              style={[sliderStyles.image, {borderRadius: 10}]}
              parallaxFactor={0.35}
              borderRadius={12}
              showSpinner={true}
              imageStyle={{borderRadius: 10, backgroundColor: colors && colors[0] ? colors[0] : '#eaeaea'}}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            >

             <View style={{justifyContent: 'center', alignSelf: 'center', width: '80%'}}>
                      { 
                        this._renderProgress(this.props.data)
                      }
                      </View>
            </Image>
        );
       
        
    }


    onDocPress = (doc) => {
        this.props.navigation.navigate('Reader',{
                                        _id: doc._id,
                                        editMode: true
                                        //docScreenUpdateStates: (doc, index) => this.onUpdateParentBook(doc, index)
                                       // currentUser: this.state.currentUser
                                      });
   }

    render () {
        const { data: { title, description, percentage, colors }, even } = this.props;
        let percentageBook = (percentage * 100).toFixed(0);
        const uppercaseTitle = title ? (
            <Text
              style={sliderStyles.title}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        const ancho = Dimensions.get('window').width;
        let colN = ancho >= 1024 ? 5 : 3;
                return (
                    <TouchableScale
                      activeOpacity={8}
                      activeScale={0.95}
                      style={[sliderStyles.slideInnerContainerSearch, {width: (this.props.rowWidth || 110), height: 161, borderRadius: 12}, this.props.style && this.props.style]}
                      onPress={() => { this.onDocPress(this.props.data);  }}
                      >
                      <View shadowtyle={sliderStyles.shadow} />
                       <View style={[sliderStyles.imageContainer, {backgroundColor: colors ? colors[1] : '#000', borderRadius: 10}]}>
                           
                         { this.image() }
                         <View style={sliderStyles.radiusMask} />
                         
                         <LinearGradient
                                    colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgb(0, 0, 0)']}
                                    style={[sliderStyles.contentContainer, {borderRadius: 10}]}
                                  />
                              {percentageBook != 'NaN' && 
                                       
                                          <Progress.Circle style={{position: 'absolute', top: 10, right: 10, flex: 1, justifyContent: 'center', alignItems: 'center'}} color={'#55c583'} progress={percentage} size={50} />
                              }
                         <View style={[sliderStyles.textContainer,{borderRadius: 10}]}>
                             
                             
                           <Text
                              style={sliderStyles.title}
                              numberOfLines={2}
                            >
                                { title.toUpperCase() }
                            </Text>
                         </View>

                        </View>
                        
                    </TouchableScale>
                );
              

    }
}

export function Cover({item, style}){
  const key = item;
  let componentStyles = {
                      backgroundColor: 'rgba(0,0,0,.4)',
                      width: 50,
                      borderRadius: 10,
                      height: 60
                    };
      if(style.width){
        componentStyles.width = style.width;
      }
      if(style.height){
        componentStyles.height = style.height;
      }
      if(key.colors && key.colors[0] && key.colors[0] > -1){
        componentStyles.backgroundColor = key.colors[0];
      }
      if(key.cover != null){
        return (
          <Image 
            source={{uri: encodeURI(key.cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable }}
            indicator={Progress.Circle}
            imageStyle={{borderRadius: 10}}
            indicatorProps={{
                        size: 30,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
              style={[componentStyles, style]}>

         </Image>
          )
      } else {
        return (
           <View style={[componentStyles, style]}>
                <EntypoIcono name="documents" style={{ color: '#fff', fontSize: 20, marginLeft: 14, marginTop: 18}}/>
              </View>
          )
      }
    }