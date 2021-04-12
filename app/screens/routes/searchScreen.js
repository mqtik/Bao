import React, {Component, PureComponent, useState, useContext, useEffect} from 'react';
import {Platform, StyleSheet, Text, FlatList, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, ImageBackground, ScrollView, StatusBar, SafeAreaView, Dimensions, ListView, Animated, TouchableHighlight, RefreshControl } from 'react-native';

import { Clouch, withClouch, withNewt, Newt, NewtProvider } from '../../utils/context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'

import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';

import { SkeletonSection, SkeletonGrid, SkeletonList } from '../../utils/skeletons'

import { NoBooksProfileWrite, NotificationsNone, MenuIcon } from '../../utils/vectors';


import { SectionList, NewSectionList, GridList, ListNotification, GridListProfile, ListUsers } from '../../utils/renders'

import { Searchbar, TouchableRipple } from 'react-native-paper';

import { useHeight, useWidth } from '../../utils/hooks'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import update from 'immutability-helper'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import PropTypes from 'prop-types';


import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';

import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, LOCAL_DB_DRAFTS } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import { getLang, Languages } from '../../static/languages';

import { createImageProgress } from 'react-native-image-progress';

import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../../services/sizeHelper';

import SliderEntry from '../../components/SliderEntry';

import {Column as Col, Row} from 'react-native-flexbox-grid';

import { SearchBar } from 'react-native-elements';



import sliderStyles from '../../styles/SliderEntry.style';

import API from '../../services/api';

import SearchInput, { createFilter } from 'react-native-search-filter';

import Spinner from 'react-native-spinkit'

import {DarkModeContext} from 'react-native-dark-mode';

import * as Progress from 'react-native-progress';

import TouchableScale from 'react-native-touchable-scale';

import { NoContentSearch } from '../../components/illustrations';

import { SearchPlaceholder } from '../../components/placeholders';

import FastImage from 'react-native-fast-image'

const Image = createImageProgress(FastImage);

const KEYS_TO_FILTERS = ['title'];



//var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height


function SearchScreen({navigation}){
  const ancho = useWidth();
  const [ query, setQuery ] = useState('');
  const [ results, setResults ] = useState(null);
  const [section, setSection] = useState(0);

  const [ items, setItems ] = useState(80);
  function loadMore(){
      let it = items + 80;
      setItems(it);
  }

  const [ searchOn, setSearchOn ] = useState('local');
  const isDarkMode = useDarkMode();
  const ClouchDB = useContext(Clouch);
  const NewtDB = useContext(Newt);
  const filteredBooks = (NewtDB.publishedBooks && NewtDB.ready == true && NewtDB.drafts.rows) && [...NewtDB.publishedBooks, ...NewtDB.drafts.rows];
  // Effects
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: (props) => (
        <TouchableRipple onPress={() => navigation.toggleDrawer()} style={{borderRadius:10,width: 60,}}>
          <View style={{display: 'flex', position: 'relative', width: 60, flexDirection: 'row', width: 100, }}>
          <MenuIcon
               width={50}
               height={50}
               style={{
                marginLeft:5
               }}
             />
          </View>
        </TouchableRipple>
      )
      // headerTitle: (
      //   <View style={{backgroundColor: 'blue'}}>
      //       <Searchbar
      //         placeholder="Search"
      //         onChangeText={(text) => setQuery(text)}
      //         value={query}
      //         style={{}}
      //       />
      //   </View>
      //     ),
      // headerRight: null,
      // headerLeft: null
    });
  });

  useEffect(() => {
    if(results != null){
      //console.log("results changed!", results, section)
      if((results.fromSection == 0 || results.fromSection == 1) && results.fromSection != section){
        //console.log("FIRE SEARCH!")
        if(results.fromSection == 1 && !results.books || (results.fromSection == 0 && !results.users)){
          $onSearch(query);
        }
      
      }
    }
  
  }, [section, query, results])


  async function $onSearch(term){
    //console.log("on searh term!!", term);
    if(NewtDB.ready != true){
      return;
    }
    setResults('search');
    let research = false;
    let r = (results != null && results != 'search') ? results : {};
    if(r && r.string && r.string != term){
      if(!r.books && section == 0){
        research = true;
      }
      if(!r.users && section == 1){
        research = true;
      }
    }
    if(research == true){
      // delete r.books;
      // delete r.users;
    }
    if(r == 'search'){
      r = {
        string: term,
        books: [],
        users: []
      }
    }
    //console.log("using result!", research, r)
    if(section == 1){
      let queryResultsU = await ClouchDB.Search().usersLocal(term);

      let queryResultsUR = await ClouchDB.Search().usersRemote(term).catch(e => null);
      //console.log("query results!", queryResultsU, queryResultsUR)
      //return;
      let mRL;

      if(queryResultsUR && queryResultsUR.users && queryResultsUR.users.rows){
        mRL = [...queryResultsU.rows, ...queryResultsUR.users.rows]
      } else {
        mRL = [...queryResultsU.rows];
      }
      //console.log("MERGE REML", mRL)
      var unique = [];
      var distinct = [];
      for( let i = 0; i < mRL.length; i++ ){
        if( !unique[mRL[i].id]){
          distinct.push(mRL[i].doc);
          unique[mRL[i].id] = 1;
        }
      }
      //console.log("lastly books!", distinct)
      r.users = {
        rows: distinct
      };


    } else {
      let queryResultsB = await ClouchDB.Search().booksLocal(term);

      let queryResultsBR = await ClouchDB.Search().booksRemote(term).catch(e => null);
      //console.log("query results!", queryResultsB, queryResultsBR)
      //return;
      let mRL;
      //console.log("get local!!!", queryResultsB, queryResultsBR)
      if(queryResultsBR && queryResultsBR.books && queryResultsBR.books.rows){
        mRL = [...queryResultsB.rows, ...queryResultsBR.books.rows]
      } else {
        mRL = [...queryResultsB.rows];
      }
      //console.log("MERGE REML", mRL)
      var unique = [];
      var distinct = [];
      for( let i = 0; i < mRL.length; i++ ){
        if( !unique[mRL[i].id]){
          distinct.push(mRL[i].doc);
          unique[mRL[i].id] = 1;
        }
      }
      //console.log("lastly books!", r)
      r.books = {
        rows: distinct
      };
      //console.log("query books remote! test ", r)
    }

    //console.log("query results!", r);
    
    r.string = term;
    r.fromSection = section == 1 ? 1 : 0;
    setResults((prevState) => update(prevState, { 
                  $set: r
                   }));
    
    //setResults(r);

  }

  function sectionChange(f){
    //console.log("section change!", results)
    setSection(f);
    setItems(80);
  }
  function Books(){
    if(NewtDB.ready != true || results == 'search'){
      return (<View style={{justifyContent: 'center', flex: 1, paddingTop: 0, backgroundColor: isDarkMode == true ? '#111' : '#f7f8fa'}}>
                    <SkeletonGrid />
                  </View>)
    }
    if(results == null){
      return (
        <GridList
               items={filteredBooks && filteredBooks.slice(0, items)}
               contentContainerStyle={{paddingTop: 10, marginLeft: 3}}
               onEndReached={() => loadMore()}
                onEndReachedThreshold={0.5}
              />
      )
    }
    const filterBooks = (results != null && results != 'search' && results.books && results.books.rows.length > -1) ? results.books.rows : []; 
    if(filterBooks && filterBooks.length == 0){
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 0, backgroundColor: isDarkMode == true ? '#111' : '#f7f8fa'}}>
          <NotificationsNone width={300} height={300}/>
          <Text style={{textAlign: 'center', fontSize: 20, color: isDarkMode == true ? '#fff' : '#000'}}>
            We could not find results for {results.string}
          </Text>
        </View>
      )
    }
    return <GridList
               items={filterBooks.slice(0, items)}
               contentContainerStyle={{paddingTop: 10, marginLeft: 3}}
               onEndReached={() => loadMore()}
                onEndReachedThreshold={0.5}
              />
  }
 // console.log("this results!", results)
  function Users(){
    if(NewtDB.ready != true || results == 'search'){
      return (<View style={{justifyContent: 'center', flex: 1, paddingTop: 0, backgroundColor: isDarkMode == true ? '#111' : '#f7f8fa'}}>
                    <SkeletonList />
                  </View>)
    }

    if(results == null){
      return (
      <View>
        <Text>
          No results
        </Text>
      </View>)
    }
    const filterUsers = (results != null && results != 'search' && results.users && results.users.rows.length > -1) ? results.users.rows : []; 
    if(filterUsers && filterUsers.length == 0){
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 0, backgroundColor: isDarkMode == true ? '#111' : '#f7f8fa'}}>
          <NotificationsNone width={300} height={300}/>
          <Text style={{textAlign: 'center', fontSize: 20, color: isDarkMode == true ? '#fff' : '#000'}}>
            We could not find people for {results.string}
          </Text>
        </View>
      )
    }
    return <ListUsers
               items={filterUsers && filterUsers.slice(0, items)}
               contentContainerStyle={{paddingTop: 0, marginLeft: 3}}
               onEndReached={() => loadMore()}
              onEndReachedThreshold={0.5}
              />
  }
  
  //console.log("search screen!", NewtDB)
  

  
  const renderScene = SceneMap({
      stories: React.memo(Books),
      settings: React.memo(Users)
    });

  const solapas = {
           index: section || 0,
           routes: [
            { key: 'stories', title: Languages.Stories[getLang()] },
            { key: 'settings', title: Languages.people[getLang()] }
           ]
         };
  
  return (
     <View style={{flex: 1,alignItems: 'center', justifyContent: 'center', backgroundColor: isDarkMode == true ? '#111' : '#f7f8fa', width: '100%'}}>
        <View style={{backgroundColor: 'transparent', position: 'absolute', top: 0, width: ancho, left: 0, right: 0, zIndex:9999, padding: 5, height: getHeaderHeight()}}>
            <Searchbar
              placeholder="Search"
              onChangeText={(text) => setQuery(text)}
              value={query}
              style={{}}
              onSubmitEditing={() => $onSearch(query)}
            />
        </View>
        <View style={{flex:1, width: '100%', paddingTop: getHeaderHeight()}}>

        <TabView
                navigationState={solapas}
                onIndexChange={sectionChange}
                renderScene={renderScene}
                
                renderTabBar={props =>
                    (results == null) ? null :
                    <TabBar
                      {...props}
                      indicatorStyle={{ 
                        backgroundColor: isDarkMode == true ? '#fff' : '#000', 
                        height:3 }}
                      style={{ backgroundColor: 'transparent' }}
                      renderIcon={({ route, focused, color }) => null}
                      renderLabel={({ route, focused, color }) => (
                      <Text style={{ 
                        fontSize: 18,
                        color: isDarkMode == true ? '#fff' : '#000',
                        fontWeight: 'bold', 
                        margin: 10 }}>
                        {route.title}
                      </Text>
                    )}
                    />
                  }
             />
              
          </View>
       
         
         
      </View>
  );
}

export default SearchScreen;


export class SearchScreenClass extends PureComponent{
  static contextType = DarkModeContext;
  static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        let value = null;
        return {
          headerTitle: Platform.OS == 'ios' ? (
            <SearchBar
              placeholder={Languages.searchEverywhere[getLang()]}
              
              platform={'ios'}
              cancelButtonTitle="Cancel"
              style={{}}
              returnKeyType='search'
              autoCorrect={false}
              //autoFocus={true}
              inputStyle={{backgroundColor: 'transparent', height:20, width: '100%'}}
              containerStyle={{height: 30, backgroundColor: 'transparent', borderWidth: 0, margin:0, padding:0, borderRadius: 5}}
              placeholderTextColor={'#666'}
              onChangeText={(value) => params.onSearchChange(value)}
              onSubmitEditing={() => { params.onSearch() }}
              value={params.searchValue}
              onCancel={() => params.onCancel()}
            />
            ) : (<SearchBar
              placeholder={Languages.searchEverywhere[getLang()]}
              platform={'android'}
              cancelButtonTitle="Cancel"
              style={{}}
              returnKeyType='search'
              autoCorrect={false}
              //autoFocus={true}
              inputStyle={{backgroundColor: 'transparent', height:getHeaderHeight(), width: '100%'}}
              inputContainerStyle={{paddingTop: 3}}
              containerStyle={{height: getHeaderHeight(), marginTop: -15, width: '100%', backgroundColor: 'transparent', borderWidth: 0, margin:0, padding:0, borderRadius: 5}}
              placeholderTextColor={'#666'}
              placeholderTextSize={22}
              placeholder={'Search'}
              onChangeText={(value) => params.onSearchChange(value)}
              onSubmitEditing={() => { params.onSearch() }}
              value={params.searchValue}
              onCancel={() => params.onCancel()}
            />),
          
         
          //Text color of ActionBar
        };
      };

    constructor(props) {
      super(props);
      this.state = {
         introText: '',
         title_book: null,
         placeholder: Languages.typeBookTitle[getLang()],
         color: 'red',
         exist: 'false',
         isLoading: true,
         listType: Languages.Drafts[getLang()],
         docs: null,
         refreshing: false,

         searchValue: null,

         allBooks: null,
         searchValue: null,
         searchValueBf: null,

         stillSearching: false,
         searchType: 'local',
         searchResults: []
      }

     

   }

   componentDidMount(){
    this.props.navigation.setParams({ searchValue: this.state.search, onSearch: this.onSearch.bind(this), onCancel: this.onCancel.bind(this), onSearchChange: this.onSearchChange.bind(this) });

    //console.log("buscarRrrrr!", this.props)
     this.$init();
   }

   onSearch = async() => {


    //this.props.navigation.setParams({ searchValue: value});
    if(this.props.screenProps.publishedDocs != null){
       // let searched = this.searchBooksSpecificProperties(['title'], this.props.screenProps.publishedDocs, value);
       // console.log("searched books!", searched)

       await this.setState({
        searchValue: this.state.searchValueBf,
        isSearching: true
       })


        this.onSearchLocal();
       

       
      }

   }

   onCancel = () => {

    this.props.navigation.setParams({ searchValue: ''});
    this.setState({
      searchValue: '',
      searchType: 'local',
      isSearching: false
    })
   }

   onSearchRemote = async() => {


    let q = await this.props.screenProps.ClouchDB.Public().searchRemote(this.state.searchValue);

   await this.props.screenProps.addSearchedDocs(q);

    this.setState({
      isSearching: false,
      searchType: 'local'
    })


   }

   onSearchLocal = async() => {


    let q = await this.props.screenProps.ClouchDB.Public().searchLocal(this.state.searchValue);

    await this.props.screenProps.addSearchedDocs(q);

      this.setState({
        isSearching: false
      })


   }

   onSearchChange = (value) => {

    this.props.navigation.setParams({ searchValue: value});
    if(this.props.screenProps.publishedDocs != null){
       // let searched = this.searchBooksSpecificProperties(['title'], this.props.screenProps.publishedDocs, value);
       // console.log("searched books!", searched)


        this.setState({
          searchValueBf: value
         })
       



      }

   }
   _onRefresh = () => {
      this.setState({refreshing: true});
    //  this._renderDrafts();
    }

   $init = async() => {
     /* let books = await(Remote.Public().all());
      __DEV__ && console.log("init books!", books)
      if(books && books.length > 0){
        this.setState({
          allBooks: books,
          isLoading: false
        })

        //console.log("SEARCH SCREEN BOOKS", this.state)
      }*/
   }

   searchBooksSpecificProperties = (properties, books, filter) => {
      var searchSpecificProperties = _.isArray(properties);
      var result;
        if (typeof filter=== "undefined" ||  filter.length==0) {
            result = books;
        } else {
          result = _.filter(books, function (c) {
            var cProperties = searchSpecificProperties ? properties : _.keys(c);
            return _.find(cProperties, function(property) {
              if (c[property]) {
                return _.includes(_.lowerCase(c[property]),_.lowerCase(filter));
              }          
            });         
         });
       }
       return result;
  }

  _onCreate = async() => {

    //let c = await(Remote.Work().drafts().create(this.state.title_book));

    /*let bookId = uuid.v1();
    APILocalDrafts.upsert(bookId, doc => {
                      doc.title = this.state.title_book;
                      doc.archive = false;
                      return doc;
                    }).then((res) => {

                      APILocalDrafts.get(bookId)
                        .then(resp => {
                         this.setState({title_book: null, docs: this.state.docs.concat([resp])})
                        })
                        .catch(err => {
                          //console.log("Error getting the new book", err)
                        })


                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      //console.log("Error creating book", error)
                      // error
                    });*/
  }

 


   _renderBook = (item, index, filtered) => {
   // console.log("renderbook", item)
        return (

                
                <TouchableScale activeScale={0.9} onPress={() => this._onOpenBook(item, index || 0, filtered)} >
                    <Image 
                      source={{ uri: item.cover }}
                      indicator={Progress.Pie}
                      imageStyle={{borderRadius: 10}}
                      indicatorProps={{
                        size: 80,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
                      style={[styles.image,{height: '100%', width: '100%', borderRadius: 4,

                                            backgroundColor: item.colors ? item.colors[1] : '#000'
                                          }]}
                      resizeMode={FastImage.resizeMode.cover}
                      >

                      <View style={{justifyContent: 'flex-start', alignSelf: 'center', width: '80%'}}>
                      { 
                        this._renderProgress(item)
                      }
                      </View>


                      </Image>
                      
                  
                
                </TouchableScale>

        );
        
    }

    _renderProgress = (book) => {

      let p, progress;
      if(!book.progress || !book.count_chapters){
        return;
      }
      let pg = parseFloat(book.progress), cg = parseFloat(book.count_chapters);
        progress = (pg / cg) * 10;
        p = progress >= 10 ? 1 : '0.'+progress;
        let colN = alto >= 1024 ? 5 : 3;
      return (
        <Progress.Bar width={(ancho / colN) - 10} borderRadius={4} color={'#2cbb2c'} progress={book.progress ? parseFloat(p) : 0} size={30} style={{marginTop: 5, alignSelf: 'center'}}/>
        )
   }


  _renderSearchedBook = (book, index, filtered) => {
    //console.log("what book", book)
    return (
      

          <View  style={{flexDirection: '', backgroundColor: '', width: (ancho / 3) - 5,height: 200,}}>
            {this._renderBook(book, index, filtered)}
          </View>

        

      
      
      )
  }

  _renderPerBook = (item, index, all) => {
        return (
            <DocEntry key={index} data={item} all={all} even={(index + 1) % 2 === 0} navigation={this.props.navigation} />
            );
    }


  _onOpenBook = (book, index, filtered) => {

    
    let indexOf = _.findIndex(filtered, ['_id', book._id]);



    if(filtered.length > 20 && index > 20){

      filtered = filtered.slice(indexOf - 10, indexOf + 10);
      indexOf = 10;
    }
    if(filtered.length > 20 && index < 20){

      filtered = filtered.slice(0, 20)
    }

     indexOf = _.findIndex(filtered, ['_id', book._id])

        if(indexOf == -1){
          indexOf = 0;
        }

        this.props.navigation.navigate('Details',{
                                        currentDoc: book,
                                        allDocs: filtered,
                                        indexOfSlider: indexOf || index
                                      });
  }

  _onSwitchSearch = () => {
    let sw = this.state.searchType;
    if(sw == 'local'){
      this.setState({
        searchType: 'remote',
        isSearching: true
      })
      this.onSearchRemote();

    } else {
      this.setState({
        searchType: 'local',
        isSearching: false
      })
    }
  }
  
  render(){

      if (this.props.screenProps.isReady == false || this.state.isSearching) {
      return (
         <View style={{justifyContent: 'center', flex: 1, paddingTop: 0, backgroundColor: this.context == 'dark' ? '#111' : '#f7f8fa'}}>
            <SearchPlaceholder />
          </View>
          );
    } else {
      const filteredBooks = [...this.props.screenProps.publishedDocs,...this.props.screenProps.myDocs.rows].filter(createFilter(this.state.searchValue || '', KEYS_TO_FILTERS)).slice(0,102);

      if(filteredBooks == null || filteredBooks.length == 0){
        return (
        <View style={{flex: 1, alignItems: 'center', justifyContents: 'center', backgroundColor: this.context == 'dark' ? '#111' : '#f7f8fa',}}>
          <Text style={{color: '#999', fontSize: 18, textAlign: 'center', marginTop: getHeaderHeight() + 40}}>We couldn't find{"\n"}any books for this filter.</Text>
          <Button
                style={{width: '95%', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,.4)', borderRadius: 8, marginRight: 5}}
                buttonStyle={{borderColor: 'transparent'}}
                titleStyle={{color: Platform.OS == 'ios' ? '#ffffff' : '#000'}}
                onPress={() => this._onSwitchSearch()}
                type="outline"
                icon={
                  <EntypoIcono
                    name="check"
                    size={15}
                    color="white"
                    style={{marginRight: 10}}
                  />
                }
                title={this.state.searchType == 'local' ? 'Search on the cloud' : 'Search in your device'}
              />
          <NoContentSearch />
          <Text style={{color: '#555e', fontSize: 15, textAlign: 'center'}}>If you still can't find it,{"\n"}you can upload it yourself.</Text>
          </View>
          )
      }
      

      return (
              <View style={{position: 'absolute', top: -getHeaderHeight(), backgroundColor: this.context == 'dark' ? '#111' : '#f7f8fa', width: '100%'}}>



        <FlatList
               data={filteredBooks}
               initialNumToRender={9}
                maxToRenderPerBatch={9}
                updateCellsBatchingPeriod={1500}
               columnWrapperStyle={{justifyContent: "space-around", marginBottom: 5, backgroundColor: 'transparent'}}
               horizontal={false}
               numColumns={alto >= 1024 ? 5 : 3}
               contentContainerStyle={{ paddingBottom: getHeaderSafeAreaHeight() * 2 + 45}}
               style={{ flex: 1, paddingTop: getHeaderHeight() + 5, width: '100%', height: alto }}
               renderItem={({ item, index }) => this._renderPerBook(item, index, filteredBooks)}
               keyExtractor={item => item._id}
            /> 
          

              </View>
      )
    }
       /* 
       <MetroTabs
              screens={[
                { key: '1', title: 'top free', screen: <TopFree /> },
                { key: '2', title: 'trending', screen: <TopFree /> },
                { key: '3', title: 'top paid', screen: <TopFree /> }
              ]}
            />
            return(
          <View style={{flex: 1}}>
            <Text> There's nothing to see here </Text>
            <View style={styles.bookTitleContainer}>
                    <View style={{ flex: 10, paddingLeft: 10 }}>
                      <TextInput
                        style={styles.inputTitleBook}
                        onChangeText={(text) => this.setState({title_book: text})}
                        value={this.state.title_book}
                        placeholder={this.state.placeholder}
                        placeholderTextColor="#999"
                        password={true}
                        secureTextEntry={false}
                        autoCapitalize = 'none'
                      />
                    </View>
                    
                    <TouchableOpacity style={styles.buttonCreateBook} onPress={this._onCreate}>
                      <Icono name="ios-add-circle-outline" style={styles.pressCreateBook} />
                    </TouchableOpacity>
                     
                  </View>
             </View>



        );*/
      
    }
}


class DocEntry extends PureComponent {
   constructor(props) {
        super(props);
    }
    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
        navigation: PropTypes.any
    };

    get image () {
        const { data: { cover, colors }, parallax, parallaxProps, even } = this.props;
       //console.log("Cover!", cover, encodeURI(cover));

       if(Platform.OS == 'android'){
        return (
          <FastImage 
            source={ cover && { uri: cover, priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable }}
            indicator={Progress.Circle}
            indicatorProps={{
                        size: 80,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
              containerStyle={[sliderStyles.imageContainer, {borderRadius: 10}]}
              style={[sliderStyles.image, {borderRadius: 10, backgroundColor: colors ? colors[1] : '#000'}]}
              parallaxFactor={0.35}
              borderRadius={12}
              showSpinner={true}
              imageStyle={{borderRadius: 10}}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            >

             <View style={{justifyContent: 'center', alignSelf: 'center', width: '80%'}}>
                      { 
                        this._renderProgress(this.props.data)
                      }
                      </View>
            </FastImage>
           
            
        );
       } else {
        return (
          <Image 
            source={ cover ? { uri: encodeURI(cover), priority: FastImage.priority.low, cache: FastImage.cacheControl.immutable } : { uri: '../../../bg.jpg'}}
            indicator={Progress.Circle}
            indicatorProps={{
                        size: 80,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                      }}
              containerStyle={[sliderStyles.imageContainer, {borderRadius: 10}]}
              style={[sliderStyles.image, {borderRadius: 10, backgroundColor: colors ? colors[1] : '#000'}]}
              parallaxFactor={0.35}
              borderRadius={12}
              showSpinner={true}
              imageStyle={{borderRadius: 10}}
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
        
    }


    _renderProgress = (book) => {

      let p, progress;
      if(!book.progress || !book.count_chapters){
        return;
      }
      let pg = parseFloat(book.progress), cg = parseFloat(book.count_chapters);
        progress = (pg / cg) * 100;
        p = progress == 1 ? progress : '0.'+progress;
      let colN = alto >= 1024 ? 5 : 3;


      return (
        <Progress.Bar width={(ancho / colN) - 20} color={'#2cbb2c'} progress={book.progress ? parseFloat(p) : 0} size={30} style={{marginTop: 5, alignSelf: 'center'}}/>
        )
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

          let colN = alto >= 1024 ? 5 : 3;
                return (
                    <TouchableScale
                      activeOpacity={8}
                      activeScale={0.95}
                      style={[sliderStyles.slideInnerContainerSearch, {minWidth: (ancho / (colN)) - 5, height: 180, borderRadius: 12}]}
                      onPress={() => { this.onDocPress(this.props.data);  }}
                      >
                      <View shadowtyle={sliderStyles.shadow} />
                       <View style={[sliderStyles.imageContainer, {backgroundColor: colors ? colors[1] : '#000', borderRadius: 10}]}>
                           
                         { this.image }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  standalone: {
    margin: 10,
    marginBottom: 0
  },
  standaloneRowFront: {
    alignItems: 'flex-end',
    backgroundColor: '#333',
    justifyContent: 'flex-end',
    height: 100,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,  
    elevation: 5
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    padding: 0,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  TextArchive: {
    color: '#FFF',
    position: 'absolute',
    left: 20,
    top: 34
  },
  TextDelete: {
    position: 'absolute',
    right: 20,
    top: 34,
    color: '#FFF'
  },
  imageCover: {
    height: 150,
    width: 70,
    backgroundColor: '#111',
    borderRadius: 10,
    flex: 1, 
    flexDirection: 'row', justifyContent: 'flex-start',
    margin: 10
  },
  controls: {
    alignItems: 'center',
    marginBottom: 0
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor: '#713671'
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderTopWidth: 0,
    borderLeftWidth: 0,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    paddingVertical: 10,
    width: Dimensions.get('window').width / 2,
  },

  inputTitleBook: {
    height: 50, 
    fontSize: 20,
    borderColor: 'transparent', 
     alignSelf: 'flex-start',
     width: '100%',
    borderWidth: 1
  },
  imgBackground: {
    justifyContent: 'center',
    alignItems: 'center',
        width: '100%',
        height: '100%',
        flex: 1
},
  pressCreateBook: {
    fontSize: 30, 
    marginTop: 9,
    marginRight: 10,
    color: '#fff',
    borderWidth: 0,
  },
  buttonCreateBookBack: { 
    borderRadius: 30,
    width: 10,
    backgroundColor: "#111",
    flex: 1, 
    paddingRight: 10,
    marginRight: 10
  },
  buttonCreateBook: { 
        borderRadius: 30,
        width: 50,
        height: 50,
    backgroundColor: "#111",
    flex: 0,
    paddingLeft: 12,
    paddingTop: 1
  },
  bookTitleContainer: {
      flex: 1, 
      flexDirection: 'row',
    borderRadius: 33,
    padding: 10,
    borderWidth: 0.1,
    borderColor: 'white',
    backgroundColor: 'white',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    width: '90%'
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
});
