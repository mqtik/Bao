global.Buffer = global.Buffer || require('buffer').Buffer;

import React, { Component } from 'react'
//import { AsyncStorage } from 'react-native'
import { CLIENT_SECRET, CLIENT_ID, LOCAL_DB_PUBLIC, LOCAL_DB_NAME, API_URL, PORT_API, DB_BOOKS, SETTINGS_LOCAL_DB_NAME, PORT_API_DIRECT, LOCAL_DB_DRAFTS, LOCAL_DB_USERS, LOCAL_DB_CHAPTERS, API_STATIC, LOCAL_DB_NOTIFICATIONS } from 'react-native-dotenv'
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import {decode, encode} from 'base-64'

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

import PouchDB from '@craftzdog/pouchdb-core-react-native'
import HttpPouch from 'pouchdb-adapter-http'
import replication from '@craftzdog/pouchdb-replication-react-native'
import mapreduce from 'pouchdb-mapreduce'



import SQLite from 'react-native-sqlite-2'
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite'

import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import APIUpsert from 'pouchdb-upsert'
import _ from 'lodash'
import Snackbar from 'react-native-snackbar';
import DBDebug from 'pouchdb-debug';

import {parse, parseDefaults} from 'himalaya'

import { getLang, getLangString, Languages } from '../static/languages';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite)

 PouchDB.plugin(HttpPouch)
 .plugin(SQLiteAdapter)
 .plugin(replication)
 .plugin(mapreduce)
 .plugin(APIAuth)
 .plugin(APIFind)
 .plugin(DBDebug)
 .plugin(APIUpsert);



const API_CHAPTERS = API_URL+'/'+LOCAL_DB_CHAPTERS;
const API_DRAFTS = API_URL+'/'+LOCAL_DB_DRAFTS;

//this.RemoteChapters





//import clone/node editor
PouchDB.debug.enable();

class API {
  constructor(){
    this.start = this.start.bind();
    this.start();
  }

  start = () => {
    __DEV__ && console.log("Constructing API", getLangString())

    

    this.RemoteStorage = PouchDB(API_URL+'/_users', {
          skip_setup: false, mode: "cors", 
          fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
          credentials: "include",
          withCredentials: "true",
          crossDomain: "true"
        });

    this.ApplicationStorage = PouchDB(LOCAL_DB_NAME, {skip_setup: true, revs_limit: 1, auto_compaction: true});
    this.ApplicationSettings = PouchDB(SETTINGS_LOCAL_DB_NAME, {skip_setup: true, auto_compaction: true});

    this.ApplicationUsers = PouchDB('users', {skip_setup: true, auto_compaction: true});
    this.ApplicationDrafts = PouchDB('books', {
      skip_setup: true, auto_compaction: true,
      fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
    });
// this.RemoteDrafts
    this.RemoteDrafts = PouchDB(API_URL+'/'+LOCAL_DB_DRAFTS, {
          skip_setup: true, mode: "cors", 
          fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
          credentials: "include",
          withCredentials: "true",
          crossDomain: "true"
        });

//LocalChapters
    this.ApplicationChapters = PouchDB(LOCAL_DB_CHAPTERS, {
        skip_setup: true,
         auto_compaction: true,
         fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
       });

    this.ApplicationNotifications = PouchDB(LOCAL_DB_NOTIFICATIONS, {skip_setup: true,auto_compaction: true});

    //this.RemoteNotifications = PouchDB(API_URL+'/'+LOCAL_DB_NOTIFICATIONS);

    this.RemoteChapters = PouchDB(API_URL+'/'+LOCAL_DB_CHAPTERS, {
          skip_setup: false, mode: "cors", 
          fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
          credentials: "include",
          withCredentials: "true",
          crossDomain: "true"
        });

   // this.url = url;
    this.endpoints = {};
    this.access_token = null;
    this.Auth = this.Auth.bind();
    this.Work = this.Work.bind();
    this.Sync = this.Sync.bind();
    this.Public = this.Public.bind();
    this.Notifications = this.Notifications.bind();
    //const _this = this;
    //console.log("Functions from API", this)
    
    //this.Authorize = this.Auth.bind(this);

  this.RemoteCollections = PouchDB('https://api.newt.to/collections', {skip_setup: false, mode: "cors", revs_limit: 1, auto_compaction: true, 
            fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
            credentials: "include",
            withCredentials: "true",
            crossDomain: "true",
        });
  this.ApplicationCollections = PouchDB('collections', {skip_setup: false, mode: "cors", revs_limit: 1, auto_compaction: true,
            fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
            credentials: "include",
            withCredentials: "true",
            crossDomain: "true",
        });

  this.RemoteActivities = PouchDB('https://api.newt.to/activities', {skip_setup: false, mode: "cors", revs_limit: 1, auto_compaction: true,
          fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
            credentials: "include",
            withCredentials: "true",
            crossDomain: "true",
        });
  this.ApplicationActivities = PouchDB('activities', {skip_setup: false, mode: "cors", revs_limit: 1, auto_compaction: true,
            fetch: (url, opts) => {
            //opts.headers.set('Content-Type', 'application/json')
            opts.headers = {
                'Accept':       'application/json',
                'Content-Type': 'application/json'
              };  
            return fetch(url, { ...opts, credentials: 'include' })
          },
          ajax: {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            },
            credentials: "include",
            withCredentials: "true",
            crossDomain: "true",
        });
  this.AppSettings = PouchDB('appSettings', {skip_setup: true, auto_compaction: true});


  this.Books = this.Books.bind();
  this.Users = this.Users.bind();
  this.Collections = this.Collections.bind();
  this.Activities = this.Activities.bind();
  this.Settings = this.Settings.bind();
  }

  Settings = () => {
    return {
      set: async(t) => {
        let n = await(this.AppSettings.upsert('app', doc => {

                  doc.updated_at = Date.now();
                  if(t.lastBookSeq && !(doc.lastBookSeq || t.lastBookSeq == doc.lastBookSeq)){
                    doc.lastBookSeq = t.lastBookSeq;
                  }
                  if(t.lastChapterSeq && !(doc.lastChapterSeq || t.lastChapterSeq == doc.lastChapterSeq)){
                    doc.lastChapterSeq = t.lastChapterSeq;
                  }
                  if(t.lastLocalChapterSeq > -1 && !(doc.lastLocalChapterSeq || t.lastLocalChapterSeq == doc.lastLocalChapterSeq)){
                    doc.lastLocalChapterSeq = t.lastLocalChapterSeq;
                  }
                  if(t.lastLocalBookSeq > -1 && !(doc.lastLocalBookSeq || t.lastLocalBookSeq == doc.lastLocalBookSeq)){
                    doc.lastLocalBookSeq = t.lastLocalBookSeq;
                  }
                  if(t.lastActivitiesSeq && !(doc.lastActivitiesSeq || t.lastActivitiesSeq == doc.lastActivitiesSeq)){
                    doc.lastActivitiesSeq = t.lastActivitiesSeq;
                  }
                  if(t.lastLocalActivitiesSeq > -1 && !(doc.lastLocalActivitiesSeq || t.lastLocalActivitiesSeq == doc.lastLocalActivitiesSeq)){
                    doc.lastLocalActivitiesSeq = t.lastLocalActivitiesSeq;
                  }
                  return doc;
                }));
        return n;
      },
      get: async() => {
        let g = await this.AppSettings.get('app').catch(e => null);
        return g;
      }
    }
  }

  Public = () => {
    return {
      all: async() => {
        let k = await(this.Auth().getLoggedUser());


        let selector = {
                            "$and": [
                               {
                                  "status": {
                                     "$eq": 'public'
                                  }
                               },
                               {
                                  "language": {
                                    "$eq": (k.language && (k.language == 'es' || k.language == 'en')) ? k.language : getLang()
                                  }
                               },
                               {
                                  "userId": {
                                    "$ne": k.name
                                  }
                               }
                            ]
                         };
                      //   console.log("select publish!!", selector)
        //console.log("selector of query", selector)
        let query = await(this.ApplicationDrafts.find({

                              //fields: ['status', 'language', '_id', 'created_at', 'updated_at', 'picked', 'offline', 'status', 'language', 'title', 'count_chapters', 'cover', 'views', 'userId', 'tags', 'colors', 'author', 'description', 'original_published_date', '_deleted', '_rev', 'progress'],
                              selector: selector,
                              //sort: [ {'created_at': 'asc'} ],
                              limit: 300,
                              //use_index: 'publicSorts'
                            }));


      /*  let d = await(this.ApplicationDrafts.allDocs({
                  include_docs: true,
                  attachments: false,
                }));
        //console.log("[ALL PUBLIC]", d)
            //console.log("[drafts get all] user", k)
            //console.log("[drafts get all] all docs", d)
        let r = d.rows.map(function (row) {
            return row.doc;
           });


        
        
        //console.log("user ids!", uIDs)
        let indexedRow = _.findIndex(r, ['_id', '_design/publicSync']);
        let indexedSort = _.findIndex(r, ['_id', '_design/publicSorts']);
        if(indexedRow != -1){
          r.splice(indexedRow, 1);
        }

        if(indexedSort != -1){
          r.splice(indexedSort, 1);
        }

       // console.log("PUBLIC", d)


        return r.splice(0,901);*/
        return query.docs;
      },
      searchRemote: async(value) => {
        if(value == null){
          return;
        }

        let selector = {
                            "$and": [
                               {
                                  "status": {
                                     "$eq": 'public'
                                  }
                               },
                               {
                                  "cover": {
                                     "$gt": null
                                  }
                               },
                               {
                                  "tags": {
                                     "$gt": null
                                  }
                               },
                               {
                                  "title": {
                                     "$regex": "(?i)"+value
                                  }
                               }
                            ]
                         };
        //console.log("selector of query", selector)
        let query = await(this.RemoteDrafts.find({

                              fields: ['_id', 'created_at', 'updated_at', 'picked', 'offline', 'status', 'language', 'title', 'count_chapters', 'cover', 'views', 'userId', 'tags', 'colors', 'author', 'description', 'original_published_date', '_rev'],
                              selector: selector,
                              //sort: [ {'created_at': 'asc'} ],
                              limit: 15,
                              //use_index: 'publicSorts'
                            }));
        //console.log("results of query", query)

        if(query.docs && query.docs.length > 0){
          let u = await(this.ApplicationDrafts.bulkDocs(query.docs, {new_edits: false})).catch(e => null);

          /*let m = u.map(i => i.id);

          let g = await(this.ApplicationDrafts.bulkGet(m)).catch(e => null);
          
          let title = '', action = 'dismiss';

          if(query.docs.length >= 2){

            title = query.docs[0].title +' and '+query.docs.length-1+' other books are available now.'
          } else {
            title = 'You have a new book to read: '+query.docs[0].title;
            action = 'read-book-offline';
          }

          //let p3 = this.Notifications().selfNew(title, 'Newt', action);

          console.log("u!", u, g)*/
           let d = await this.Public().searchLocal(value);

          //console.log("this search!", d);

          return d;
        }

        return null;
        
       

      },
      searchLocal: async(value) => {

        if(value == null){
          return;
        }
        //console.log("[API] On Search Local",value)
        let d = await(this.ApplicationDrafts.allDocs({
                  include_docs: true,
                  attachments: false,
                }));

        let rd = d.rows.map(function (row) {
            return row.doc;
           });

        let r = rd.filter(function (row) {
            return row.title && row.title.toLowerCase().includes(value.toLowerCase());
           });
        //console.log("r!", r, d, rd)
        return r;

        var regexp = new RegExp(value, 'i');

        let selector = {
                            "$and": [
                               {
                                  "title": {
                                     "$regex": regexp
                                  }
                               }
                            ]
                         };
        //console.log("selector of query", selector)
        let query = await(this.ApplicationDrafts.find({

                              fields: ['_id', 'created_at', 'updated_at', 'picked', 'offline', 'status', 'language', 'title', 'count_chapters', 'cover', 'views', 'userId', 'tags', 'colors', 'author', 'description', 'original_published_date', '_rev'],
                              selector: selector,
                              //sort: [ {'created_at': 'asc'} ],
                              limit: 15,
                              //use_index: 'publicSorts'
                            }));
        //console.log("results of query", query)

        //let u = await(this.ApplicationDrafts.bulkDocs(query.docs)).catch(e => null);

        //console.log("Bulk docs SEARCH!!", u)
        return query.docs;

      },
      setUpIndexes: () => {
        let indexx = this.ApplicationDrafts.createIndex({
                            index: {fields: ['status', 'title', 'language', 'created_at', 'updated_at', 'count_chapters', 'cover', 'views', 'userId', 'tags', 'author', 'description', 'picked', 'offline']},
                            ddoc: "publicFirstHit"
                          }).catch(e => null);
        return indexx;
      },
      sortQuery: async(by, docs) => {
        let k = await(this.Auth().getLoggedUser());

        //console.log("by!", by, docs)

        if(by == 'newest'){
          
          let filter_newest = docs.filter(f => f.created_at != null)


          let grouped_items = _.groupBy(filter_newest, (b) =>
            moment(parseFloat(b.created_at)).startOf('month').format('YYYY/MM/DD'));



          let categories = [];


          for (var propName in grouped_items) {
            categories.push({category: 'Published '+ moment(propName, "YYYYMMDD").fromNow(), docs: grouped_items[propName]})

          }
          return categories;
        }if(by == 'updates'){
          let filter_updates = docs.filter(f => f.updated_at != null)


          let grouped_items = _.groupBy(filter_updates, (b) =>
            moment(parseFloat(b.updated_at)).startOf('month').format('YYYY/MM/DD'));
          let categories = [];


          for (var propName in grouped_items) {
            categories.push({category: 'Updated '+ moment(propName, "YYYYMMDD").fromNow(), docs: grouped_items[propName]})

          }

          return categories;
        }

       /* let getIndexes = await this.ApplicationDrafts.getIndexes().catch(e => null);

        let indexOfIndex = _.findIndex(getIndexes.indexes, ['ddoc', '_design/publicSorts']);

        if(indexOfIndex == -1){
          let indexx = this.ApplicationDrafts.createIndex({
                            index: {fields: ['created_at', 'updated_at', 'picked', 'offline', 'status', 'title', 'language', 'count_chapters', 'cover', 'views', 'userId', 'tags', 'author', 'description']},
                            ddoc: "publicSorts"
                          }).catch(e => null);

        }
*/


        let selector = {
                            "$and": [
                               {
                                  "language": {
                                     "$eq": k.languages ? k.languages : getLangString()
                                  }
                               },
                               {
                                  "cover": {
                                     "$gt": null
                                  }
                               }
                            ]
                         };
        /*let lastMonth = moment(Date.now()).subtract(1, 'months').valueOf();
        let lastTwoMonths = moment(Date.now()).subtract(2, 'months').valueOf();
        let lastThreeMonths = moment(Date.now()).subtract(3, 'months').valueOf();
        let lastWeek = moment(Date.now()).subtract(1, 'weeks').valueOf();

*/
        

        if(by == 'picked'){
          selector.$and.push({
            "picked": {
               "$eq": true
            }
          });
        } else if(by == 'downloads'){
          selector.$and.push({
            "offline": {
               "$eq": true
            }
          });
        } else if(by == 'newest') {
          return;
        } else if(by == 'updates') {
          return;
        } else {


          selector.$and.push({
            "tags": {
              $in: [by]
            }
          });


        }


        //console.log("selector!", selector)
        let query = await(this.ApplicationDrafts.find({

                              fields: ['_id', 'created_at', 'updated_at', 'picked', 'offline', 'status', 'language', 'title', 'count_chapters', 'cover', 'views', 'userId', 'tags', 'colors', 'author', 'description', 'original_published_date'],
                              selector: selector,
                              //sort: [ {'created_at': 'asc'} ],
                              limit: 901,
                              //use_index: 'publicSorts'
                            }));


        if(by == 'picked'){
          let formatted = await(this.Public().formatFromTags(query.docs));
          //console.log("SORT QUERY OF!",formatted)
          return formatted;
        } else if(by == 'downloads'){
          let categories = [];

          categories.push({category: 'Downloads', type: 'grid', docs: query.docs})

          return categories;
        } else if(by == 'newest') {
          return formatted;
        } else if(by == 'updates') {
          return formatted;
        } else {
            let categories = [];

          categories.push({category: by, type: 'grid', docs: query.docs})

          return categories;
        }
        
        
      },
      replicateFrom: async() => {
        
        let k = await(this.Auth().getLoggedUser());
        let selector = {
                            "$and": [

                              {
                                  "picked": {
                                     "$eq": true
                                  }
                               },
                               {
                                  "userId": {
                                    "$ne": k.name
                                  }
                               },
                               {
                                  "status": {
                                     "$eq": "public"
                                  }
                               },
                               {
                                  "language": {
                                     "$eq": (k.language && (k.language == 'es' || k.language == 'en')) ? k.language : getLang()
                                  }
                               },
                               {
                                  "cover": {
                                     "$gt": null
                                  }
                               },
                               {
                                  "tags": {
                                     "$gt": null
                                  }
                               }
                            ]
                         };

              //console.log("selector of find!", selector)
             let query = await(this.RemoteDrafts.find({
                              fields: ['picked', 'userId', 'status', 'title', 'language', 'count_chapters', 'cover', 'tags', 'colors', 'author', 'description', 'original_published_date', '_rev', 'picked', 'created_at', 'updated_at', '_id'],
                              selector: selector,
                              limit: 300
                            }));


             let u = await(this.ApplicationDrafts.bulkDocs(query.docs, {new_edits: false}));

              //console.log("query of!", query)
              return query.docs;
      },
      formatFromCategory: async(docs, options) => {

      },
      removeAccents: (strAccents) => {
        var strAccents = strAccents.split('');
        var strAccentsOut = new Array();
        var strAccentsLen = strAccents.length;
        var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
        var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        for (var y = 0; y < strAccentsLen; y++) {
          if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
          } else {
            strAccentsOut[y] = strAccents[y];
          }
        }
        strAccentsOut = strAccentsOut.join('');
        //console.log(strAccentsOut);
        return strAccentsOut;
      },
      findOne: async(id) => {
        let query = await(this.ApplicationDrafts.get(id)).catch(e => null);
        if(query == null){
          query = await(this.RemoteDrafts.get(id)).catch(e => null);
        }
        return query;
      },
      formatFromTags: async(docs, options) => {
          let doks = docs;  
            let tags = [];
            let covers = [];

            if(doks && doks.length > 0){
              for(let x = 0; x < doks.length; x++){
                //console.log("doks", doks[x])
                //covers.push(doks[x].cover);
                //tags[0] += ...doks[x].tags;
                //tags.push(doks[x].tags)
                
                if(typeof doks[x].tags !== 'undefined'){


                  doks[x].tags.map(tag => {
                    //console.log("pushede!", this.Public().removeAccents(tag))
                    tag = this.Public().removeAccents(tag).trim().toLowerCase();
                    tags.push(tag);
                    return tag;
                  });

                }
                
              }
            }
            //console.log("tags!", tags)
            
           // this.setState({covers: covers, tags: tags })

            
            // _.filter(doks, function(item){
            //                   return item.progress >= 0;
            //              });

            let counts = tags.reduce(function(map, word){
                                                           
                            if(word != null && word != 'undefined' && word != ''){
                              map[word] = (map[word]||0)+1;
                            }
                            return map;
                          }, Object.create(null));


            let smartLoads = counts,
                smartLoadCounts = _.keys(counts).length;



          
        let x = 0;
        let example = [];
        //console.log("my props discover", this.props)
        /*let myDocs = _.filter(doks, (doc) => {
              if(doc.userId){
                //console.log("doctags!", doc.tags.join(","))
                //console.log("doctags key!", key)
                return doc.userId === k.name;
              }
             });

        if(myDocs && myDocs.length > 0){
          example.push({category: Languages.previewWorks[getLang()], docs: myDocs.slice(0,100)});
        }*/

       /* let offlineDocs = _.filter(this.state.docs, (doc) => {
              if(doc.offline){
                //console.log("doctags!", doc.tags.join(","))
                //console.log("doctags key!", key)
                return doc.offline === true;
              }
             });

        if(offlineDocs && offlineDocs.length > 0){
          example.push({category: Languages.availableToReadOffline[getLang()], docs: offlineDocs.slice(0,100)});
        }*/

        //console.log("renderonline smart load", smartLoads)
        for(let key in smartLoads){
          if(smartLoads[key] >= 3){
            let docresult = _.filter(doks, (doc) => {
              if(doc.tags){
                //console.log("doctags!", doc.tags.join(","))
                let ft = doc.tags.filter(t => this.Public().removeAccents(t).toLowerCase() == key.trim())

                if(ft && ft.length == 1){
                  return true;
                } else {
                  return false;
                }
                //return doc.tags.join(",").toLowerCase().indexOf(key.trim()) != -1
                return this.Public().removeAccents(doc.tags.join(",").toLowerCase()).includes(key.trim()) == true;
              }
             });
            let type = 'carousel';
            if(docresult.length == 6 || docresult.length == 3){
              type = 'grid';
            }
            example.push({category: key.trim(), docs: docresult.slice(0,30),  type: type});
          }    
        }

        // let booksOffline = doks.filter(item => item.progress);
        // console.log("books offline!!", booksOffline)
        // if(booksOffline.length > 0){
        //   example.unshift({category: 'Continue reading', form: 'offline', docs: booksOffline.slice(0,30) })
        // }
         example.push({category: Languages.lastBooks[getLang()], form: 'recent', docs: doks.slice(0,50) })
          // if(booksOffline.length > 0){
          //   example.unshift({category: Languages.continueReading[getLang()], form: 'offline', docs: booksOffline.slice(0,30) })
          // }
          
         
        //console.log("exa", example)
        return example;

      }
    }
  }

    Users = () => {
    return {
      findOne: async(user) => {
        let userN = 'org.couchdb.user:'+user;
        let localUser = await(this.ApplicationUsers.get(userN)).catch(e => e);
        if(localUser.status == 404 || localUser.name == 'not_found'){
          localUser = await(this.RemoteStorage.get(userN)).catch(e => e);
          let put = await(this.ApplicationUsers.put(localUser, {force:true})).catch(e => e);
        }
 
          localUser._id = localUser.name;
          return localUser;
      },
      findBooksByUserId: async({ id, limit, offset}) => {
          let ad = await(this.ApplicationDrafts.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: id+':book:', endkey: id+':book:\uffff',
                    limit: limit
                  })).catch(e => e);
 
              let r;
              let c;
              if(ad.rows && ad.rows.length == 0 || ad == null){
                let adrR = await(this.RemoteDrafts.allDocs({
                                    include_docs: true,
                                    attachments: false,
                                    startkey: id+':book:', endkey: id+':book:\uffff'
                                  })).catch(e => null);
                    if(adrR == null){
                      return [];
                    }
                    r = adrR.rows.filter(function (row) { return row.doc.status == 'public' }).map(function (row) { row.doc._rev = undefined; return row.doc; }); 
                    c = adrR.total_rows;
                    let u = await(this.ApplicationDrafts.bulkDocs(r));
          } else {
                 r = ad.rows.filter(function (row) { return row.doc.status == 'public' }).map(function (row) { return row.doc; }); 
                 c = ad.total_rows;
              }
 
              r = _.orderBy(r, ['position'],['asc']);
 
              return {
                rows: r,
                total_rows: c
              };
      },
    }
  }
 


 Notifications = () => {
      return {
        all: async() => {
          let k = await(this.Auth().getLoggedUser());

          let n = await(this.ApplicationNotifications.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: k.name, endkey: k.name+'\uffff',
                    limit: 100
                  }));


          let r = n.rows.map(function (row) { return row.doc; });
          r = _.orderBy(r, ['created_at'],['desc'])
          let nV = r.filter((obj) => obj.viewed === false).length;
          return {
            all: r,
            not_viewed: nV,
            total: n.total_rows
          }
        },
        selfNew: async(message, recip, action) => {
          let k = await(this.Auth().getLoggedUser());

          let msg, frm;
          if(!message || !recip || !action){
            return false;
          }

          let nT = {
            _id: k.name+':'+Date.now(),
            message: message,
            from: recip,
            action: 'dismiss',
            created_at: Date.now(),
            viewed: false
          }
          let pN = await this.ApplicationNotifications.put(nT).catch(e => null);

          if(pN == null){
            return false;
          }
          return true;
        },
        sendOfflineBook: async(id) => {
          let k = await(this.Auth().getKey());
          if(!id){
            return false;
          }
          let book = await this.Books().findOne(id).catch(e => null);
          let msg;
          if(book.userId == k && book._id.indexOf(k) > -1){
            msg = book.title+' is available to read and write offline';
          } else {
            msg = book.title+' is available to read offline';
          }
          let now = Date.now();
          let nT = {
            _id: k+'-offlineBook:'+now,
            message: msg,
            from: 'Newt',
            created_at: now,
            type: 'offlineBook',
            objects: [book],
            viewed: false
          }
          let pN = await this.ApplicationNotifications.put(nT).catch(e => null);

          if(pN == null){
            return false;
          }
          return true;
        },
        truncateNotifications: async() => {
          let allNots = await this.ApplicationNotifications.allDocs({include_docs: true});
          let notsToGo = allNots.rows.map(row => { return {_id: row.id, _rev: row.doc._rev, _deleted: true}; });

          let perform = this.ApplicationNotifications.bulkDocs(notsToGo);

          return true;
        },
        setAllAsViewed: async() => {
          let allNots = await this.ApplicationNotifications.allDocs({include_docs: true});
          let notsToRead = allNots.rows.map(row => { return { ...row.doc, viewed: true }; });

          let perform = this.ApplicationNotifications.bulkDocs(notsToRead);

          return true;
        }
      }
    
  }


    Chapters = () => {
      return {
        findAll: async(id) => {
          let ad = await(this.ApplicationChapters.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: id+':chapter:', endkey: id+':chapter:\uffff'
                  })).catch(e => null);
                  
              let r;
              if(ad.rows && ad.rows.length == 0 || ad == null){
                let adrR = await(this.RemoteChapters.allDocs({
                                    include_docs: true,
                                    attachments: false,
                                    startkey: id+':chapter:', endkey: id+':chapter:\uffff'
                                  })).catch(e => null);
                 
                    if(adrR == null){
                      return [];
                    }
                    r = adrR.rows.map(function (row) { row.doc._rev = undefined; return row.doc; }); 
                    let u = await(this.ApplicationChapters.bulkDocs(r));
                     //console.log("couldn bulkdocs!!", u)
                    if(r.length > 0){
                      let notify = this.Notifications().sendOfflineBook(id);
                      //console.log("notifiy!!!", notify)
                      let offPub = await(this.ApplicationDrafts.upsert(id, doc => {
                                      if(!doc.offline){
                                          doc.offline = true;
                                      }
                                      return doc; 
                                    })).catch(e => null);
                    }
          } else {
                 r = ad.rows.map(function (row) { return row.doc; }); 
              }
              
              r = _.orderBy(r, ['position'],['asc']);

              return r;
      },
      findAllIds: async(id) => {
          //console.log("fire find one!", id)
          let ad = await(this.ApplicationChapters.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: id+':chapter:', endkey: id+':chapter:\uffff'
                  })).catch(e => null);
                  
              let r;
              if(ad.rows && ad.rows.length == 0 || ad == null){
                let adrR = await(this.RemoteChapters.allDocs({
                                    include_docs: true,
                                    attachments: false,
                                    startkey: id+':chapter:', endkey: id+':chapter:\uffff'
                                  })).catch(e => null);
                 
                    if(adrR == null){
                      return [];
                    }
                    r = _.orderBy(ad.rows, ['position'],['asc']);
                    r = r.map(function (row) { return {_id: row.doc._id, title: row.doc.title}; }); 
                    let u = await(this.ApplicationChapters.bulkDocs(r));
          } else {
            r = _.orderBy(ad.rows, ['position'],['asc']);
                 r = r.map(function (row) { return {_id: row.doc._id, title: row.doc.title}; }); 
              }
              
              

              return r;
      },
      findOne: async(id) => {
        //console.log("fire find one!", id)
        let localChapter = await(this.ApplicationChapters.get(id)).catch(e => e)

        //console.log("fire f local ind one!", localBook)
        if(localChapter.status == 404 || localChapter.name == 'not_found'){
          localChapter= await this.RemoteChapters.get(id);
          let put = await(this.ApplicationChapters.put(localChapter, {force:true})).catch(e => e);
          //console.log("putt!", put)
        }
        return localChapter;
      },
      createOne: async(id) => {
                //console.log("find all!!", fAll)
                //console.log("create from id", id  )
                let k = await(this.Auth().getLoggedUser());
                //console.log("[create book] user: ", k)
                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: id+':chapter:', endkey: id+':chapter:\uffff'
                })).catch(e => null);
                //console.log("[ad]", ad)

                let c = {
                  _id: id +':chapter:'+(new Date()).getTime(),
                  title: 'New Draft',
                  bookId: id,
                  archive: false,
                  position: ad.rows.length,
                  userId: k.name,
                  created_at: Date.now()
                }

                // let reCount = await(this.ApplicationDrafts.upsert(id, doc => {
                //   //console.log("oN UPSERT!", doc)
                //       if(!doc.count_chapters){
                        
                //           doc.count_chapters = 0;
                //           doc.count_chapters++;
                        
                        
                //       } else {
                //         doc.count_chapters++;
                //       }
                //       if(!doc.views){
                //         doc.views = 0;
                //       }
                //       if(ad != null && ad.rows.length > 0){
                //           doc.count_chapters = ad.rows.length;
                //           doc.count_chapters++;
                //         }
                //       return doc; 
                //     })).catch(e => null);

                let n = await(this.ApplicationChapters.put(c)).catch(e => null);
                if(n == null){
                  let nF = await(this.ApplicationChapters.put(c, {force: true})).catch(e => null);
                }
                //console.log("N!", n)
                let g = await(this.ApplicationChapters.get(n.id));
                return g;
          },
        saveBulk: async(bulk) => {
          //console.log("save bulk!!", bulk)
                //console.log("params save", params.content.length)
                if(bulk){
                    //console.log("[save bulk] bulk: ", bulk)
                  for (var i = bulk.length - 1; i >= 0; i--) {
                    bulk[i].updated_at = Date.now();
                  }

                  //bulk.forEach( chapter => { chapter.updated_at = Date.now() });

                  let u = await(this.ApplicationChapters.bulkDocs(bulk));
                  return u;
                } else {
                  return null;
                }
        }
    }
  }

  Sync = () => {
    return {
      checkDrafts: async() => {
        let d = await this.ApplicationDrafts.info();

        let dR = await this.RemoteDrafts.info();

        let r = {
          local: d,
          remote: dR
        }
        return r;
      },
      checkChapters: async() => {
        let c = await this.ApplicationChapters.info();

        let cR = await this.RemoteChapters.info();

        let r = {
          local: c,
          remote: cR
        }
        return r;
      },
      checkPublishers: async() => {
        let c = await this.ApplicationDrafts.info();

        let cR = await this.RemoteDrafts.info();

        let r = {
          local: c,
          remote: cR
        }
        return r;
      },
      syncReading: async() => {
        let optPublished = {
                 live: false,
                 retry: true,
                 filter: 'publicSync/by_status',
                 query_params: { "status": "public" }
              };

        let r = await(this.ApplicationDrafts.replicate.from(this.RemoteDrafts, optPublished));

        return r;
      },
      syncDraftsAndChapters: async() => {
        let k = await(this.Auth().getLoggedUser());

        let optDrafts = {
                 live: false,
                 retry: true,
                 continuous: false, 
                 filter: 'draftSync/by_user_id',
                 query_params: { "userId": k.name }
              };

        let optChapters = {
                 live: false,
                 retry: true,
                 continuous: false,
                 filter: 'chapterSync/by_user_id',
                 query_params: { "userId": k.name }
              };

        let optPublished = {
                 live: false,
                 retry: true,
                 filter: 'publicSync/by_status_and_language',
                 query_params: { "status": "public", "language": "Español" }
              };

        let s = await(this.ApplicationDrafts.replicate.to(this.RemoteDrafts, optDrafts));
        let s2 = await(this.ApplicationDrafts.replicate.from(this.RemoteDrafts, optDrafts));

        let c = await(this.ApplicationChapters.replicate.to(this.RemoteChapters, optChapters));
        let c2 = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters));





        

        //let p = await(this.ApplicationDrafts.replicate.from(this.RemoteDrafts, optPublished));
        /*a
        p.on('change', function (info) {
                          console.log("[draft] On change!", info)
                          // handle change
                        }).on('paused', function (paused) {
                          console.log("[draft] On paused!", paused)
                          // replication paused (e.g. replication up to date, user went offline)
                        }).on('active', function (ac) {
                          console.log("[draft] On active!", ac)
                          // replicate resumed (e.g. new changes replicating, user went back online)
                        })
                        .on('change', function (change) {
                          console.log("[draft] On change!", change)
                          // replicate resumed (e.g. new changes replicating, user went back online)
                        }).on('denied', function (err) {
                          console.log("[draft] On denied!", err)
                          // a document failed to replicate (e.g. due to permissions)
                        }).on('complete', function (info) {
                          console.log("[draft] On complete!", info)
                          // handle complete
                        }).on('error', function (err) {
                          console.log("[draft] On error!", err)
                          // handle error
                        })*/

        //console.log("replicate to public!", p)
        let r = {
          'drafts': {
                    to: s,
                    from: s2
                  },
          'chapters': {
            to: c,
            from: c2
          },
          'public': {

          }
        };
       
        __DEV__ && console.log("fully sync", r)

        return r;
       // console.log("await s!", s)
      },
      pullPush: async(type, db) => {
        let k = await(this.Auth().getLoggedUser());
        //__DEV__ && console.log("type and db!", type, db, getLangString())
        if(db == 'drafts'){
          let optDrafts = {
                 live: false,
                 retry: true,
                 continuous: false, 
                 push: {checkpoint: false}, 
                 pull: {checkpoint: false},
                 filter: 'draftSync/by_user_id',
                 query_params: { "userId": k.name }
              };
          if(type == 'pull'){
            let draftsPull = await(this.ApplicationDrafts.replicate.from(this.RemoteDrafts, optDrafts));
            //draftsPull.cancel();
            return true;
          }
          if(type == 'push'){
            let draftsPush = await(this.ApplicationDrafts.replicate.to(this.RemoteDrafts, optDrafts));


            //draftsPush.cancel();
            return true;
          }
        }
        if(db == 'chapters'){
          let optChapters = {
                 live: false,
                 retry: true,
                 push: {checkpoint: false}, 
                 pull: {checkpoint: false},
                 continuous: false,
                 filter: 'chapterSync/by_user_id',
                 query_params: { "userId": k.name }
              };
          if(type == 'pull'){
            let chaptersPull = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters)); 
            //chaptersPull.cancel();
            return true;
          }
          if(type == 'push'){
            let chaptersPush = await(this.ApplicationChapters.replicate.to(this.RemoteChapters, optChapters));
            //chaptersPush.cancel();


            return true;
          }
        }
        if(db == 'public'){
          let optPublished = {
                 live: false,
                 retry: true,
                 push: {checkpoint: false}, 
                 pull: {checkpoint: false},
                 filter: 'publicSync/by_status_and_language',
                 query_params: { "status": "public", "language": getLangString() }
              };

          if(type == 'pull'){
            let publicPull = await(this.ApplicationDrafts.replicate.from(this.RemoteDrafts, optPublished));

            //publicPull.cancel();
            return true;
          }
          if(type == 'push'){
            return;
          }
        }

        return false;
        
      }
    }
  }
  Search = () => {
   return {
        setIndex: async() => {

        },
        booksLocal: async(string) => {
          // let s = await this.ApplicationDrafts.search({
          //   query: string,
          //   fields: ['title', 'description', 'author', 'tags', 'userId'],
          //   include_docs: true,
          //   filter: function (doc) {
          //     return doc.status === 'public'; // only index public
          //   }
          // });
          // return s;

           let selector = {
                  "$and": [
                      {
                        "title": {
                          "$gte": string,
                          "$lt": string+"\uffff"
                        }
                      },
                     {
                        "status": {
                           "$eq": "public"
                        }
                     },
                   ]
                };
         let s = await(this.ApplicationDrafts.find({

                                  fields: ['title', 'status', '_id', 'description', 'colors', 'userId', 'colors', 'author', 'count_chapters', 'cover', 'created_at',  'picked', 'language', 'tags', 'updated_at', '_rev'],
                                  selector: selector,
                                  //sort: [ {'created_at': 'asc'} ],
                                  limit: 100,
                                  //use_index: 'publicSorts'
                                }));
        //console.log("return s!", s)
         return {
          rows: s.docs.map(d => { return { id: d._id, doc: d} }),
          total_rows: 0
         };
        },
        usersLocal: async(string) => {
          string = string.toLowerCase();
          let s = await(this.ApplicationUsers.allDocs({
                    include_docs: true,
                    attachments: false,
                    limit: 100,
                    startkey: 'org.couchdb.user:'+string, endkey: 'org.couchdb.user:'+string+'\uffff'
                  })).catch(e => null);
         // console.log("return all docs users!", s)
          // let s = await this.ApplicationUsers.search({
          //   query: string,
          //   fields: ['name', 'full_name', 'email'],
          //   include_docs: true,
          //   // filter: function (doc) {
          //   //   return doc.status === 'public'; // only index public
          //   // }
          // });
          return s;

        },
        booksRemote: async(string) => {
          let options = {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                    by: ['books'],
                    q: string
                  })
            };
            //let h = await fetch(API_URL+"/api/search", options);
            let h = await fetch("https://api.newt.to/api/search", options);
            let r = await h.json();
            return r;
        },
        usersRemote: async(string) => {
          let options = {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                    by: ['users'],
                    q: string.toLowerCase()
                  })
            };
            //let h = await fetch(API_URL+"/api/search", options);
            let h = await fetch("https://api.newt.to/api/search", options);
            let r = await h.json();
            return r;
        }
    }
  }

   Books = () => {
    return {
      findOne: async(id) => {
        //console.log("fire find one!", id)
        let localBook = await(this.ApplicationDrafts.get(id)).catch(e => e)

        //console.log("fire f local ind one!", localBook)
        if(localBook.status == 404 || localBook.name == 'not_found'){
          localBook= await this.RemoteDrafts.get(id);
          let put = await(this.ApplicationDrafts.put(localBook, {force:true})).catch(e => e);

          // if(localBook.status && localBook.status == 'public'){
          //  let put = await(this.ApplicationDrafts.put(localBook, {force:true})).catch(e => e);
          // }
          //console.log("putt!", put)
        }
        return localBook;
      },
      createOne: async(title) => {
            let k = await(this.Auth().getLoggedUser());

            if(!title){
              title = 'New Book';
            }

            let c = {
                  _id: k.name+':book:'+(new Date()).getTime(),
                  userId: k.name,   
                  title: title,
                  userId: k.name,
                  created_at: Date.now(),
                  views: 0
                }
                let n = await(this.ApplicationDrafts.put(c, {force: true}));
                //console.log("N!", n)
                let g = await(this.ApplicationDrafts.get(n.id));

                let ch = await this.Work().drafts().chapters().create(c._id);

                return g;
        },
        saveOne: async(dok) => {

            dok._rev = undefined;
            let n = await(this.ApplicationDrafts.upsert(dok._id, doc => {
                  dok.updated_at = Date.now();
                  doc = dok;
                  return doc;
                }));
            //await(this.ApplicationDrafts.put(doc, {force: true}));
            let g = await(this.ApplicationDrafts.get(dok._id));
            return g;
        },
        setProgress: async(id, progress) => {
          //__DEV__ && console.log("set progress book!!", id, progress)
          let canEdit = false;
          let k = await(this.Auth().getKey());
          if(!k){ return; }
          let g = await(this.ApplicationDrafts.get(id));

         // console.log("progress of!", g.progress, progress, g.progress.index <= progress.index)
          if(g.progress){
            if(g.progress.index < progress.index){
              canEdit = true;
            }
            if(g.progress.offset < progress.offset){
              canEdit = true;
            }
          } else {
            canEdit = true;
          }

          if(g.userId == k){
            if(g.imported && g.status != 'public'){
              canEdit = true;
            } else {
              canEdit = false;
            }
          }

          if(canEdit == false){ return; }
        //  console.log("RETIREVE FOR PROGRESS!", g)
          //return;
          let n = await(this.ApplicationDrafts.upsert(id, doc => {
                  doc.progress = progress;
                  return doc;
                }));
          return;
          let put = await(this.ApplicationDrafts.put(book, {force:true})).catch(e => e);
        }
    }
  }

  Collections = () => {
    return {
      findById: async(id) => {
        //console.log("fire find one!", id)
        let localBook = await(this.ApplicationActivities.get(id)).catch(e => e)

        //console.log("fire f local ind one!", localBook)
        if(localBook.status == 404 || localBook.name == 'not_found'){
          localBook= await this.RemoteDrafts.get(id).catch(e => null);

          if(localBook == null){
            return {
              error: 'not_found'
            }
          }
          let put = await(this.ApplicationActivities.put(localBook, {force:true})).catch(e => e);

          if(localBook.status && localBook.status == 'public'){
            let put = await(this.ApplicationDrafts.put(localBook, {force:true})).catch(e => e);
          }
          //console.log("putt!", put)
        }

        return localBook;
      },
      findByIdWithBooks: async(id) => {
        //console.log("fire find one!", id)
        let localBook = await(this.ApplicationActivities.get(id)).catch(e => e)

        //console.log("fire f local ind one!", localBook)
        if(localBook.status == 404 || localBook.name == 'not_found'){
          localBook= await this.RemoteDrafts.get(id).catch(e => null);

          if(localBook == null){
            return {
              error: 'not_found'
            }
          }
          let put = await(this.ApplicationActivities.put(localBook, {force:true})).catch(e => e);

          if(localBook.status && localBook.status == 'public'){
            let put = await(this.ApplicationDrafts.put(localBook, {force:true})).catch(e => e);
          }
          //console.log("putt!", put)
        }

        let booksIds = [];
        let dock = localBook.books;

        booksIds = Array.from(new Set(booksIds.concat(dock)))

         let getBooksForCollection = await(this.RemoteDrafts.allDocs({keys:booksIds, include_docs: true,attachments: false}));

         getBooksForCollection = getBooksForCollection.rows.map(function (row) { return row.doc; }); 
         //console.log("books ids!", getBooksForCollection)
        localBook.books = getBooksForCollection;


        return localBook;
      },
      findByIdWithBooksAsRows: async(id) => {
        //console.log("fire find one!", id)
        let localBook = await(this.ApplicationActivities.get(id)).catch(e => e)

        //console.log("fire f local ind one!", localBook)
        if(localBook.status == 404 || localBook.name == 'not_found'){
          localBook= await this.RemoteDrafts.get(id).catch(e => null);

          if(localBook == null){
            return {
              error: 'not_found'
            }
          }
          let put = await(this.ApplicationActivities.put(localBook, {force:true})).catch(e => e);

          if(localBook.status && localBook.status == 'public'){
            let put = await(this.ApplicationDrafts.put(localBook, {force:true})).catch(e => e);
          }
          //console.log("putt!", put)
        }

        let booksIds = [];
        let dock = localBook.books;

        booksIds = Array.from(new Set(booksIds.concat(dock)))

         let getBooksForCollection = await(this.RemoteDrafts.allDocs({keys:booksIds, include_docs: true,attachments: false}));

         getBooksForCollection = getBooksForCollection.rows.map(function (row) { return row.doc; }); 
         //console.log("books ids!", getBooksForCollection)
        localBook.rows = getBooksForCollection;


        return localBook;
      },
      create: async(title, userId, bookId) => {
        //console.log("fire find one!", id)
        let cd = {
          _id: userId+'-collection:'+(new Date()).getTime(),
          title: title,
          userId: userId,
          books: bookId ? [bookId] : [],
          picked: false,
          indexed: false,
          status: 'public'
        };

        //console.log("on create colelction!", cd)

        let put = await(this.ApplicationActivities.put(cd)).catch(e => e);
        let getco = await this.ApplicationActivities.get(cd._id);
        //console.log("fire f local ind one!", localBook)
        // if(localBook.status == 404 || localBook.name == 'not_found'){
        //  localBook= await this.RemoteDrafts.get(id);
        //  let put = await(this.ApplicationCollections.put(localBook, {force:true})).catch(e => e);

        //  if(localBook.status && localBook.status == 'public'){
        //    let put = await(this.ApplicationDrafts.put(localBook, {force:true})).catch(e => e);
        //  }
        //  //console.log("putt!", put)
        // }
        return getco;
      },
      updateOne: async(new_collection) => {
        console.log("fire find one!", new_collection)
        if(new_collection._id){
          if(new_collection.rows){ delete new_collection.rows; }
          let put = await(this.ApplicationActivities.put(new_collection)).catch(e => e);
          let getco = await this.ApplicationActivities.get(new_collection._id)
          return getco;
        }
        return null;
      },
      addOrRemoveFrom: async(colId, bookId) => {
        let igc = await this.ApplicationActivities.get(colId).catch(e => null);
        let updatedCollection;
        if(igc != null){
          let updatedCollection = igc;
          if(updatedCollection.books && updatedCollection.books.includes(bookId)){
            updatedCollection.books = updatedCollection.books.filter(b => b != bookId)
          } else {
            updatedCollection.books.push(bookId);
            //console.log("COLLECTION DIDNT EXIST. BOOK")
          }
          let put = await(this.ApplicationActivities.put(updatedCollection)).catch(e => e);
          igc = await this.ApplicationActivities.get(colId).catch(e => null);
          return igc;
        } else {
          return null;
        }
      },
      findAllByUserId: async(id) => {
          //console.log("fire find one!", id)
          let ad = await(this.ApplicationActivities.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: id+'-collection:', endkey: id+'-collection:\uffff'
                  })).catch(e => null);
                  
              let r;
              let c;
              if(ad.rows && ad.rows.length == 0 || ad == null){
                let adrR = await(this.RemoteActivities.allDocs({
                                    include_docs: true,
                                    attachments: false,
                                    startkey: id+'-collecton:', endkey: id+'-collecton:\uffff'
                                  })).catch(e => null);
                 
                    if(adrR == null){
                      return [];
                    }
                    r = adrR.rows.map(function (row) { row.doc._rev = undefined; return row.doc; }); 
                    c = adrR.total_rows;
                    let u = await(this.ApplicationActivities.bulkDocs(r));
          } else {
                 r = ad.rows.map(function (row) { return row.doc; }); 
                 c = ad.total_rows;
              }

              return {
                rows: r,
                total_rows: c
              };
      },
      findAllByUserIdWithBooks: async(id) => {

          let ad = await(this.ApplicationActivities.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: id+'-collection:', endkey: id+'-collection:\uffff'
                  })).catch(e => e);
                  
              let r;
              let c;
              if(ad.rows && ad.rows.length == 0 || ad == null){
                let adrR = await(this.RemoteActivities.allDocs({
                                    include_docs: true,
                                    attachments: false,
                                    startkey: id+'-collection:', endkey: id+'-collection:\uffff'
                                  })).catch(e => null);
                 
                    if(adrR == null){
                      return [];
                    }
                    r = adrR.rows.map(function (row) { row.doc._rev = undefined; return row.doc; }); 
                    c = adrR.total_rows;

                    let u = await(this.ApplicationActivities.bulkDocs(r));
          } else {
                 r = ad.rows.map(function (row) { return row.doc; }); 

                 c = ad.total_rows;
              }

              let booksIds = [];
              let booksIdsNotFound = [];
              let booksFound = [];
              let booksNotFound = [];
           for (var i = r.length - 1; i >= 0; i--) {

            let dock = r[i].books;

            booksIds = Array.from(new Set(booksIds.concat(dock)))
           }

           let getBooksForCollection = await(this.ApplicationDrafts.allDocs({keys:booksIds, include_docs: true,attachments: false}));

           for (var i = getBooksForCollection.rows.length - 1; i >= 0; i--) {

            if(getBooksForCollection.rows[i].doc){
              booksFound.push(getBooksForCollection.rows[i].doc);
            } else {
              booksIdsNotFound.push(getBooksForCollection.rows[i].key);
            }
           }

           if(booksIdsNotFound && booksIdsNotFound.length > 0){
            let getNotFoundedBooksForCollection = await(this.RemoteDrafts.allDocs({keys:booksIdsNotFound, include_docs: true,attachments: false}));

            if(getNotFoundedBooksForCollection.rows){
              for (var i = getNotFoundedBooksForCollection.rows.length - 1; i >= 0; i--) {
                if(getNotFoundedBooksForCollection.rows[i].doc){
                  booksFound.push(getNotFoundedBooksForCollection.rows[i].doc)
                  booksNotFound.push(getNotFoundedBooksForCollection.rows[i].doc)
                }
              }

              let cacheIt = this.ApplicationDrafts.bulkDocs(booksNotFound,{new_edits: false});
            }

            //console.log("get not founded collections", getNotFoundedBooksForCollection)
           }



           let formattedCollection = [];
           for (var i = r.length - 1; i >= 0; i--) {

            let loopIt = booksFound.filter(e => r[i].books.includes(e._id));
            r[i].rows = loopIt;
            //console.log("loop it !", loopIt)
           }

              return {
                rows: r,
                total_rows: c
              };
      },
      findPublicCollections: async(params) => {
        let selector = {
                  "$and": [
                     {
                        "status": {
                           "$eq": "public"
                        }
                     },
                     {
                        "indexed": {
                           "$eq": true
                        }
                     },
                     {
                        "picked": {
                           "$eq": true
                        }
                     },

                   ]
                };
         let query = await(this.ApplicationActivities.find({

                                  fields: ['_id', 'title', 'books', 'userId', 'status', 'indexed', 'picked', '_deleted', '_rev'],
                                  selector: selector,
                                  //sort: [ {'created_at': 'asc'} ],
                                  limit: 100,
                                  //use_index: 'publicSorts'
                                }));
         //console.log("query of!", query)
         if(query.docs.length == 0){
          query = await(this.RemoteActivities.find({

                                  fields: ['_id', 'title', 'books', 'userId', '_deleted', '_rev'],
                                  selector: selector,
                                  //sort: [ {'created_at': 'asc'} ],
                                  limit: 100,
                                  //use_index: 'publicSorts'
                                }));
          //console.log("query remote!", query)

          let cacheIt = await(this.ApplicationActivities.bulkDocs(query.docs,{}));
         }

         let booksIds = [];
         for (var i = query.docs.length - 1; i >= 0; i--) {
          let dock = query.docs[i].books;

          booksIds = Array.from(new Set(booksIds.concat(dock)))
         }

         let getBooksForCollection = await(this.RemoteDrafts.allDocs({keys:booksIds, include_docs: true,attachments: false}));

         getBooksForCollection = getBooksForCollection.rows.map(function (row) { return row.doc; }); 
         //console.log("books ids!", getBooksForCollection)
         let formattedCollection = [];
         for (var i = query.docs.length - 1; i >= 0; i--) {
          let loopIt = getBooksForCollection.filter(e => query.docs[i].books.includes(e._id));
          query.docs[i].books = loopIt;
          //console.log("loop it !", loopIt)
         }
          return query;
      }
    }
  }

  Activities = () => {
    return {
      setActivity: async(id) => {
        //console.log("fire set like!", id)
        //let k = await(this.Auth().getKey());

        let getLike = await(this.Activities().getActivity(id));

        getLike = getLike == true ? true : false;

        let setLikeLocal = await this.ApplicationActivities.upsert(id, function (doc) {
        if(getLike == true){
          doc._deleted = true;
        }
        return doc;
      })

      // let setLikeRemote = await this.RemoteActivities.upsert(id, function (doc) {
      //   if(getLike == true){
      //     doc._deleted = true;
      //   }
      //   return doc;
      // })
        
        //console.log("set likes!", setLikeLocal, setLikeRemote)
        return !getLike;
      },
      getActivity: async(id) => {
        // let k = await(this.Auth().getKey());
        // if(!k || !id){
        //  return false;
        // }
        let bl = await this.ApplicationActivities.get(id).catch(e => null);

        if(bl == null){
          let glk = await(this.Activities().getActivityHead(id)).catch(e => null);
          //console.log("get activitiy head!!", glk)
          if(glk == null ||  (glk && glk.status == '404')){
            return false;
          } else {
            return true;
          }
          //bl = await this.RemoteActivities.get(k+':'+id).catch(e => null);
          //let blp = await this.RemoteActivities.put(bl).catch(e => null);
        } else {
          return true;
        }
        
      },
      getActivityHead: async(id) => {
        let data = {
                method: 'HEAD',
                credentials: 'include',
                headers: {
                 // 'Authorization': 'Bearer '+this.access_token,
                  'Content-Type': 'application/json',
                }
              }
        //console.log("lets try!", process.env.API_URL +'/activities/'+k+':'+id)
        let wf = await fetch(process.env.API_URL +'/activities/'+id, data);
        return wf;
      },
      getAllLikesByUserIdWithContents: async(id) => {

        let nid = id+'-likeBook:';
        let ad = await(this.ApplicationActivities.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: nid, endkey: nid+'\uffff',
                    limit: 300
                  })).catch(e => e);
        if(ad.rows.length == 0){
          ad = await(this.RemoteActivities.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: nid, endkey: nid+'\uffff',
                    limit: 300
                  })).catch(e => e);
          if(ad.rows.length > 0){
            let toBulk = ad.rows.map(function (row) { return row.doc; }); 
            let cacheIt = this.ApplicationActivities.bulkDocs(toBulk,{new_edits: false});
          }
        }
        let booksIds = ad.rows.map(function (row) { return row.doc._id.replace(nid, ''); }); 
        let booksFound = [];
        let booksNotFound = [];
        let booksIdsNotFound = [];
        let getLikedBooks = await(this.ApplicationDrafts.allDocs({keys:booksIds, include_docs: true,attachments: false}));

           for (var i = getLikedBooks.rows.length - 1; i >= 0; i--) {
            if(getLikedBooks.rows[i].doc){
              booksFound.push(getLikedBooks.rows[i].doc);
            } else {
              booksIdsNotFound.push(getLikedBooks.rows[i].key);
            }
           }

           if(booksIdsNotFound && booksIdsNotFound.length > 0){
            let getNotFoundedBooksForLikes = await(this.RemoteDrafts.allDocs({keys:booksIdsNotFound, include_docs: true,attachments: false}));

            if(getNotFoundedBooksForLikes.rows){
              for (var i = getNotFoundedBooksForLikes.rows.length - 1; i >= 0; i--) {
                if(getNotFoundedBooksForLikes.rows[i].doc){
                  booksFound.push(getNotFoundedBooksForLikes.rows[i].doc)
                  booksNotFound.push(getNotFoundedBooksForLikes.rows[i].doc)
                }
              }

              if(booksNotFound.length > 0){
                let cacheIt = this.ApplicationDrafts.bulkDocs(booksNotFound,{new_edits: false});
              }
            }

            //console.log("get not founded collections", getNotFoundedBooksForCollection)
           }
           return {
            rows: booksFound,
            total_rows: ad.total_rows
           }

      },
      getFollowingByUserIdWithContents: async(id) => {

        let nid = id+'-followUser:';
        let ad = await(this.ApplicationActivities.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: nid, endkey: nid+'\uffff',
                    limit: 300
                  })).catch(e => e);

        if(ad.rows.length == 0){
          ad = await(this.RemoteActivities.allDocs({
                    include_docs: true,
                    attachments: false,
                    startkey: nid, endkey: nid+'\uffff',
                    limit: 300
                  })).catch(e => e);
          if(ad.rows.length > 0){
            let toBulk = ad.rows.map(function (row) { return row.doc; }); 
            let cacheIt = this.ApplicationActivities.bulkDocs(toBulk,{new_edits: false});
          }
        }

        let booksIds = ad.rows.map(function (row) { return row.doc._id.replace(nid, ''); }); 
        let booksToReturn = [];


        if(booksIds && booksIds.length == 0 || !booksIds){
          return {
            rows: [],
            total_rows: 0
          }
        }
        for (var i = booksIds.length - 1; i >= 0; i--) {
          let gU = await this.Users().findBooksByUserId({ id: booksIds[i], limit: 100, offset: null });
          booksToReturn.push({ _id: booksIds[i], title: booksIds[i], ...gU })
        }

        return {
          rows: booksToReturn,
          total_rows: ad.total_rows
        }
      },
      isFollowingUser: async(id) => {
        let k = await(this.Auth().getKey());
        if(!k || !id){
          return false;
        }
        let nid = k+'-followUser:'+id;
        let bl = await this.ApplicationActivities.get(nid).catch(e => null);

        if(bl == null){
          let glk = await(this.Activities().getActivityHead(nid));
          if(glk.status == '404'){
            return false;
          } else {
            return true;
          }
          //bl = await this.RemoteActivities.get(k+':'+id).catch(e => null);
          //let blp = await this.RemoteActivities.put(bl).catch(e => null);
        } else {
          return true;
        }
        //console.log("get like!", k)
        
      },
    }
  }
  /**
   * Log in
   * @param {username } string
   * @param {password} string
   **/
   Work = () => {
     return {
       setUp: async() =>{

        //let clean = await this.ApplicationChapters.viewCleanup();
        //let dclean = await this.ApplicationDrafts.viewCleanup();
        let i1 = {
            "_id": "_design/draftSync",
            "filters": {
              "by_user_id": "function (doc, req) {return doc.userId === req.query.userId;}",
              "by_book_id": "function (doc, req) {return doc.bookId === req.query.bookId;}",
              "by_both": "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };

        let i2 = {
            "_id": "_design/chapterSync",
            "filters": {
              "by_user_id": "function (doc, req) {return doc.userId === req.query.userId;}",
              "by_book_id": "function (doc, req) {return doc.bookId === req.query.bookId;}",
              "by_both": "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };

          let i3 = {
            "_id": "_design/publicSync",
            "filters": {
              "by_user_id": "function (doc, req) {return doc.userId === req.query.userId;}",
              "by_book_id": "function (doc, req) {return doc.bookId === req.query.bookId;}",
              "by_status": "function (doc, req) {return doc.status === req.query.status;}",
              "by_status_and_language": "function (doc, req) {return doc.status == req.query.status && doc.language === req.query.language;}",
              "by_both": "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };


        let pI = await this.ApplicationDrafts.put(i3).catch(e => null);
        let pID = await this.ApplicationDrafts.put(i3).catch(e => null);
        //let pIDR = await RemotePublished.put(index).catch(e => null);

        let dpIDR = await this.RemoteDrafts.put(i3).catch(e => null);

        let ig1 = await(this.ApplicationDrafts.put(i1, { force: true })).catch(e => null);
        let ig2 = await this.ApplicationChapters.put(i2, { force: true }).catch(e => null);



       
       return true;

       },
       replicate: async() =>{
        //console.log("[Execute] Replication")
        //let clean = await this.ApplicationChapters.viewCleanup();
        //let dclean = await this.ApplicationDrafts.viewCleanup();
        let i1 = {
            _id: "_design/draftSync",
            filters: {
              by_user_id: "function (doc, req) {return doc.userId === req.query.userId;}",
              by_book_id: "function (doc, req) {return doc.bookId === req.query.bookId;}",
              by_both: "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };

        let i2 = {
            _id: "_design/chapterSync",
            filters: {
              by_user_id: "function (doc, req) {return doc.userId === req.query.userId;}",
              by_book_id: "function (doc, req) {return doc.bookId === req.query.bookId;}",
              by_both: "function (doc, req) {return doc.userId === req.query.userId && doc.bookId === req.query.bookId;}"
            }
          };

        let ig1 = await(this.ApplicationDrafts.put(i1, { force: true }));
        let ig2 = await this.ApplicationChapters.put(i2, { force: true });

       // console.log("ig1", await this.ApplicationDrafts.get("_design/draftSync"))
        //console.log("ig2", await this.ApplicationChapters.get("_design/chapterSync"))
        let k = await(this.Auth().getLoggedUser());

    
        let sync1 = await(this.Work().drafts().replicateFrom());
          sync1.cancel();
        let sync2 = await(this.Work().drafts().chapters().replicateFrom());
          sync2.cancel();
     // console.log("sync stuff", sync1, sync2)

        
        //let r2 = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters));
        //console.log("Replicate!", r1, r2)
        let r = {
          drafts: sync1,
          chapters: sync2
        }

        return r;
      
       },
       list: () => {
         let data = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+this.access_token,
              'Content-Type': 'application/json',
            }
          }
          __DEV__ && console.log("data business", data)
          return fetch(this.url +'/business', data)
                .then(response => response.json());
       },
       sync: async() => {
            this.ApplicationDrafts.sync(this.RemoteDrafts, {
                    live: true,
                    retry: true
                  }).on('change', function (change) {

                    // yo, something changed!
                  }).on('error', function (err) {
                    __DEV__ && console.log("error !", err)
                    // yo, we got an error! (maybe the user went offline?)
                  });

            
          },
       drafts: () => {

        return {
          all: async() => {
            
            let k = await(this.Auth().getLoggedUser());
            //console.log("[get drafts] as: ", k)

            /*this.ApplicationDrafts.query('_drafts', {key : k.name}).then(res=>{
              console.log("RES QUERY!", res)
            }).catch(err=>{
              console.log("RES QUERY ERROR!", err)
            })*/
            //let q = await(this.ApplicationDrafts.query('_drafts', {key : k.name}))
            //console.log("Query!", q)
            let d = await(this.ApplicationDrafts.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: k.name+':book:', endkey: k.name+':book:\uffff'
                })).catch(e => null);



            //console.log("all drafts!", d)
            /*let a = await(this.ApplicationDrafts.allDocs({
                  include_docs: true,
                  attachments: false,
                }));*/
            //console.log("[drafts get all] user", k)
            //console.log("[drafts get all] all docs", d)
            let r = d.rows.map(function (row) { 
              //let created_at = row.doc._id.split("-")[1];
              //row.doc.created_at = created_at;
              //row.doc.updated_at = created_at;
              return row.doc;
               });
            //let u = await(this.ApplicationDrafts.bulkDocs(r));

            //console.log("[ALL] Drafts: ", u)
            //console.log("[ALL] Drafts a: ", d)
            //console.log("[ALL] Drafts 1: ", r)

            //let indexedRow = _.findIndex(r, ['_id', '_design/draftSync']);
            //r.splice(indexedRow, 1);
            /*let c = await(this.ApplicationDrafts.find({

                          fields: ['_id', 'userId', 'title'],
                          selector: {
                            userId: {
                              $eq: k.name
                            }
                            
                          },
                          use_index: '_my_drafts'
                        }));
            */
            //console.log("[drafts get all] finder", r)

            return {
              total_rows: d.total_rows,
              offset: d.offset,
              rows: r
            };
          },
          replicateFrom: async() => {
            let k = await(this.Auth().getLoggedUser());

            let adrR = await(this.RemoteDrafts.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: k.name, endkey: k.name+':book:\uffff'
                                }));
               
           // __DEV__ && console.log("replicate from drafts!", adrR)
             r = adrR.rows.map(function (row) { return row.doc; }); 
             //__DEV__ && console.log("after replicate from drafts!", r)

            let u = await(this.ApplicationDrafts.bulkDocs(r, {new_edits: false}));
            return r;
          },
          coverUp: async(params) => {
            //console.log("lets start!")
            let options = {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(params)
            };
            let h = await fetch(API_URL+"/api/creators/shouldUploadCover", options);
            //console.log("h!",h)
            let r = await h.json();
            //console.log("r!", r)


            return r;

            /* return fetch("http://api.newt.to/api/creators/shouldUploadCover", options)
                .then(res => res.text())
                .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
           // console.log("FILENAME", f)
            
          },
          importEpub: async(params) => {

                  //Snackbar.show({ title: 'Processing ebook...', duration: Snackbar.LENGTH_LONG })
                  let options = {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify(params)
                  };
                  let h = await fetch(API_URL+"/api/creators/importEpub", options);
                  //let h = await fetch("http://api.newt.to/api/creators/importEpub", options);

                  let r = await h.json();



                  return r;

                  /* return fetch("http://api.newt.to/api/creators/shouldUploadCover", options)
                      .then(res => res.text())
                      .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
                 // console.log("FILENAME", f)
                  
          },
          importContents: async(flow) => {
            console.log("import contents!!")
            let k = await(this.Auth().getKey());

            let bookId = k+':book:'+(new Date()).getTime();
            let tags = typeof flow.metadata.subject !== 'string' ? flow.metadata.subject : flow.metadata.subject.split(",");
            if(flow.metadata.language.toLowerCase() == 'en' ||  flow.metadata.language == 'English') {
              flow.metadata.language = 'en';
            } else {
              flow.metadata.language = 'es'
            }
            let bookToCreate = {
                    title: flow.metadata.title,
                    colors: flow.colors,  
                    description: flow.metadata.description,
                    tags: tags,
                    author: flow.metadata.creator,
                    original_published_date: flow.metadata.date,
                    language: flow.metadata.language,
                    published: flow.metadata.publisher,
                    cover: flow.cover,
                    views: 0,
                    created_at: Date.now(),
                    _id: bookId,
                    userId: k,
                    archive: false,
                    imported: true
                  };

          let n = await(this.ApplicationDrafts.put(bookToCreate, {force: true}));

          let g = await(this.ApplicationDrafts.get(n.id));
          let index = 0;
          let chaptersToCreate = await(flow.chapters.map(item => {
                                    item._id = bookId+':chapter:'+(new Date()).getTime()+(index++);
                                    item.position = index;
                                    item.native_content = item.native_content;
                                    delete item._rev;
                                    //index++;
                                    item.bookId = bookId;
                                    item.archive = false;
                                    item.created_at = Date.now();
                                    item.updated_at = Date.now();
                                    item.userId = k;
                                    return item;
                                  }));

          console.log("chapters to create on!", bookId, chaptersToCreate)
          //let u = await(this.ApplicationChapters.bulkDocs(chaptersToCreate));
          //console.log("chapters u!", u)

            return {
              book: g,
              chapters: chaptersToCreate
            };

          },
          bulkIt: async(chapters) => {
            let u = await(this.ApplicationChapters.bulkDocs(chapters));
            console.log("bulk ittt chapaapapapa!", u)
            return u;
          },
          onSave: async(dok) => {

            dok._rev = undefined;

            let n = await(this.ApplicationDrafts.upsert(dok._id, doc => {

                  dok.updated_at = Date.now();
                  doc = dok;

                  return doc;
                }));

            //await(this.ApplicationDrafts.put(doc, {force: true}));

            let g = await(this.ApplicationDrafts.get(dok._id));
            return g;
          },
          create: async(title) => {
            let k = await(this.Auth().getLoggedUser());

            if(!title){
              title = 'New Project';
            }



                let c = {
                  _id: k.name+'-'+(new Date()).getTime(),
                  userId: k.name,   
                  title: title,
                  archive: false,
                  userId: k.name,
                  created_at: Date.now(),
                  views: 0,
                }
                let n = await(this.ApplicationDrafts.put(c, {force: true}));
                //console.log("N!", n)
                let g = await(this.ApplicationDrafts.get(n.id));

                let ch = await this.Work().drafts().chapters().create(c._id);

                return g;


           // let bookId = uuid.v1();
   
          },
          delete: async(id) => {

            let rU = await(this.RemoteDrafts.upsert(id, doc => {
                  doc._deleted = true;
                  return doc;
                })).catch(e => {return null});


            if(rU == null){
              return null;
            }

            let u = await(this.ApplicationDrafts.upsert(id, doc => {
                  doc._deleted = true;
                  return doc;
                }));



            let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                }));

            let adR = ad.rows.map(function (row) { row.doc._deleted = true; return row.doc; }); 


            let uC = await(this.ApplicationChapters.bulkDocs(adR));

            let aP = await(this.ApplicationDrafts.get(id)).catch(e => {return null});

            if(aP != null){
              let u = await(this.ApplicationDrafts.upsert(id, doc => {
                  doc._deleted = true;
                  return doc;
                }));
            }


            //return u;

            return {
              drafts: u,
              chapters: uC
            };
          },
          // end of all()
          chapters: () => {
            return {
              allDocsIds: async(id) => {
                
                let k = await(this.Auth().getLoggedUser());

                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: false,
                  attachments: false,
                  startkey: k.name, endkey: k.name+'-chapter-\uffff'
                }));
                


                /*if(c == null){
                  console.log("FINDER IS NULL")
                }*/
                
                //let r = ad.rows.map((row) => { return row.doc; }); 
                //console.log("[ad]", r)
                //console.log("[get all books] user:", k.name)
                /*console.log("[all first]", c)
                if(c) {
                  let n = await(this.ApplicationChapters.find({

                          fields: ['position', 'bookId', 'title', 'archive', '_id'],
                          selector: {
                            bookId: { $eq: id },
                          },
                        }));
                  console.log("[all next]", n)
                  
                }*/
                //iconsole.log("FIND LOG", c)
                //console.log("chapters!", id)

                let chapters = ad.rows.map(r => r.id.split("-")[0]+'-'+r.id.split("-")[1]);
                return {
                  chapters: _.uniqBy(chapters),
                  total: ad.total_rows,
                  offset: ad.offset
                };
              },
              all: async(id) => {
                
                //console.log("get indexes!!!")
                //var indexesResult = await this.ApplicationChapters.getIndexes();

                //console.log("get indexes $1!!!", indexesResult)
                //let erase = await(indexesResult.indexes.map(async row => { return await(this.ApplicationChapters.deleteIndex(row)) }));  
                //console.log("get indexes $1!!!", erase)
                //console.log("id of!", id)
                let k = await(this.Auth().getLoggedUser());

                /*let c = await(this.ApplicationChapters.find({

                          fields: ['bookId', 'userId', 'position', 'title', 'archive', '_id'],
                          selector: {
                            bookId: {
                              $eq: id
                            },
                            userId: {
                              $eq: k.name
                            }
                            
                          },
                          use_index: '_my_chapters'
                        })).catch(err => null);*/

                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  conflicts:true,
                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                }));
                


                /*if(c == null){
                  console.log("FINDER IS NULL")
                }*/
                
                let r = ad.rows.map((row) => { return row.doc; }); 
                //console.log("[ad]", r)
                //console.log("[get all books] user:", k.name)

                r = _.orderBy(r, ['position'],['asc'])
                /*console.log("[all first]", c)
                if(c) {
                  let n = await(this.ApplicationChapters.find({

                          fields: ['position', 'bookId', 'title', 'archive', '_id'],
                          selector: {
                            bookId: { $eq: id },
                          },
                        }));
                  console.log("[all next]", n)
                  
                }*/
                //iconsole.log("FIND LOG", c)
                //console.log("chapters!", id)

                return {
                  chapters: r,
                  total: ad.total_rows,
                  offset: ad.offset
                };
              },
              getPublishedChapters: async(params) => {
                //__DEV__ && console.log("[DEV] FIRE CHAPTERS")

                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: params._id+'-chapter-', endkey: params._id+'-chapter-\uffff'
                })).catch(e => null);
                
                //__DEV__ && console.log("fire chapters get", ad, params)
                let r;
                //__DEV__ && console.log("add", ad)
                if(ad.rows && ad.rows.length == 0 || ad == null){
                  //  __DEV__ && console.log("this props of work" , this.Work().drafts().chapters().allRemote())
                 // Snackbar.show({ title: Languages.replicatingEllipsis[getLang()], duration: Snackbar.LENGTH_SHORT })

                 /* this.RemoteChapters.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: params._id+'-chapter-', endkey: params._id+'-chapter-\uffff'
                                }).then(res => console.log("resss!", res)).catch(err => console.log("error!", err))*/

                  let adrR = await(this.RemoteChapters.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: params._id+'-chapter-', endkey: params._id+'-chapter-\uffff'
                                })).catch(e => null);
               
                  //console.log("no chapters!", adrR)

                  if(adrR == null){

                    return;
                  }
                  r = adrR.rows.map(function (row) { row.doc._rev = undefined; return row.doc; }); 

                  //__DEV__ && console.log("docs to here!", r, params)
                  let u = await(this.ApplicationChapters.bulkDocs(r));

                  if(params.title && !params.offline){
                    let k = await(this.Auth().getLoggedUser()).catch(e => null);

                    params.offline = true;
                    //__DEV__ && console.log("to offline!", params, k)
                    let nT = {
                      _id: k.name+'-'+Date.now(),
                      message: params.title+' is now available to read offline.',
                      from: 'Newt',
                      object: params,
                      action: 'read-book-offline',
                      created_at: Date.now(),
                      viewed: false
                    }
                    let pN = await this.ApplicationNotifications.put(nT).catch(e => null);

                    let offPub = await(this.ApplicationDrafts.upsert(params._id, doc => {
                                      if(!doc.offline){
                                          doc.offline = true;
                                      }
                                      return doc; 
                                    })).catch(e => null);
                  }
                  
               
                } else {
                  r = ad.rows.map(function (row) { return row.doc; }); 
                }
                //console.log("soooo", r)
                r = _.orderBy(r, ['position'],['asc']);

               // console.log("returning!", r)
                return r;
                
              },
              allRemote: async(id) => {

               // let k = await(this.Auth().getLoggedUser());

                  let adrL = await(this.ApplicationChapters.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                                }));


                  if(adrL.rows.length > 0){

                   // console.log("Get chapters from local")
                    let r = adrL.rows.map(function (row) { return row.doc; }); 
                    r = _.orderBy(r, ['position'],['asc'])
                    return r;
                  } else {



                    let adrR = await(this.RemoteChapters.allDocs({
                                  include_docs: true,
                                  attachments: false,
                                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                                }));



                    if(adrR.rows.length == 0){
                      return [];
                    }
                    let r = adrR.rows.map(function (row) { return row.doc; }); 

                    r = _.orderBy(r, ['position'],['asc'])

                    let u = await(this.ApplicationChapters.bulkDocs(r,{new_edits: false}));

                    return r;
                  }
                  
                 
              },
              getDocsWithUserId: async() => {


              /*console.log("fire pouchdb")
                function myMapFunction(doc) {
                  console.log("doc pouchdb", doc)
                      if (doc.userId === 'mq') {
                        if (doc.title === 'A sangre fria') {
                          emit('Pika pi!');
                        } else {
                          emit(doc.name);
                        }
                      }
                    }

                this.RemoteDrafts.query(myMapFunction, {
                    key          : 'Pika pi!',
                    include_docs : true
                  }).then(function (result) {
                    console.log("pouchdb result", result)
                    // handle result
                  }).catch(function (err) {
                    // handle errors
                    console.log("error pouchdb!", err)
                  });
                */
              },
              replicateFrom: async() => {
                let k = await(this.Auth().getLoggedUser());
                let optChapters = {
                         live: false,
                         retry: true,
                         filter: 'chapterSync/by_user_id',
                         query_params: { "userId": k.name }
                      };
                let s1 = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters, (err, result) => {

                          if(err){ return false; }
                          return result;
                        }));

                return s1;
              },
              replicateByDocId: async(id) => {
                let k = await(this.Auth().getLoggedUser());

                // Replicate book chapters
                let optChapters = {
                     live: false,
                     retry: true,
                     continuous: false,
                     filter: 'chapterSync/by_both',
                     batch_size: 200,
                     query_params: { "userId": k.name, "bookId": id }
                  };
                let c = await(this.ApplicationChapters.replicate.from(this.RemoteChapters, optChapters));


                return c;
              },
              delete: async(id) => {
                let u = await(this.ApplicationChapters.upsert(id, doc => {
                  doc._deleted = true;
                  return doc;
                }));
                return u;
              },
              //end of all()
              create: async(id) => {
                //console.log("find all!!", fAll)
                //console.log("create from id", id  )
                let k = await(this.Auth().getLoggedUser());
                //console.log("[create book] user: ", k)
                let ad = await(this.ApplicationChapters.allDocs({
                  include_docs: true,
                  attachments: false,
                  startkey: id+'-chapter-', endkey: id+'-chapter-\uffff'
                })).catch(e => null);
                //console.log("[ad]", ad)

                
                

                let c = {
                  _id: id +'-chapter-'+(new Date()).getTime(),
                  title: 'New Draft',
                  bookId: id,
                  archive: false,
                  position: ad.rows.length,
                  userId: k.name,
                  created_at: Date.now()
                }

                

                let n = await(this.ApplicationChapters.put(c)).catch(e => null);
                if(n == null){
                  let nF = await(this.ApplicationChapters.put(c, {force: true})).catch(e => null);
                }
                //console.log("N!", n)
                let g = await(this.ApplicationChapters.get(n.id));
                return g;
              },
              onMove: async(all_chapters) => {
                //console.log("[API] Move", id)
                //let d = await(this.ApplicationChapters.get(id));
               // console.log("on move chapter ID", position, d)

               // d.position = position;
               //console.log("all chapters", all_chapters)
                let u = await(this.ApplicationChapters.bulkDocs(all_chapters));
                //console.log("on move updated!", u)

                /*let m = await(this.ApplicationChapters.upsert(id, doc => {
                  //console.log("oN UPSERT!", doc)
                      doc.position = position;
                      doc._rev = doc._rev;
                      return doc; 
                    }));*/
                    //console.log("bulk docs done!", u)
                return u;
              },
              findOne: async(id) => {
                let g = await(this.ApplicationChapters.get(params._id));
                return g;
              },
              mapDOM: async(element) => {

                if(typeof element === 'undefined'){
                  let blocks = {
                    time: Date.now(),
                    blocks: []
                   };
                   return blocks;
                }
                const json = parse(element, { ...parseDefaults, includePositions: false });

                const formatFromTagNameItems = (o, res) => {
                  var items = res || [];
                  if (o.type == 'text' && o.content.trim() === '') {
                                      items.push(o.content);   // saving `name` value
                                  } 
                  if(o.children){
                    for (var il = o.children.length - 1; il >= 0; il--) {
                                
                                if(o.children[il]){
                                  formatFromTagNameItems(o.children[il], items)
                                }

                              }
                  }



                   
                  return items;
                }

                const formatFromTagName = (o, res, tag) => {
                  var items = res || [];

                  if (o.type == 'text') {

                       let co;
                       if(tag == 'u'){
                        co = '<u>'+o.content+'</u>';
                       } else if(tag == 'i'){
                        co = '<i>'+o.content+'</i>';
                       } else if(tag == 'b' || tag == 'strong'){
                        co = '<b>'+o.content+'</b>';
                       } else {
                        co = o.content;
                       }
                       if(typeof co == 'undefined'){
                        co = ' ';
                       }
                      items.unshift(co);   // saving `name` value

                    } 
                  if(o.type == 'element' && tag == 'img'){
                    items.unshift({img: o.attributes[0].value})
                  }

                  if(o.children){

                    for (var il = o.children.length - 1; il >= 0; il--) {    
                                if(o.children[il]){

                                  formatFromTagName(o.children[il], items, o.tagName)

                                }
                      }
                  }
                  
                 


                   
                  return items;
                }
                const scrapeContent = (o, res, type) => {
                  var names = res || [];

                      for (var i = o.length - 1; i >= 0; i--) {
                        

                          if (o[i].type == 'text') {

                                names.unshift({ type: 'paragraph', data: { text: o[i].content }});   // saving `name` value
                            }

                          if(o[i].children && typeof o[i].children === 'object') {
                            if(o[i].tagName == 'ul' || o[i].tagName == 'ol'){
                              let t = formatFromTagNameItems(o[i], [])
                              names.unshift({ type: 'list', data: { text: t }});
                            } else if(o[i].tagName == 'p') {
                              let string = '';
                              let pa = formatFromTagName(o[i], '', o[i].tagName);

                               if(pa.length > 0){
                                  pa = pa.map(w => { string += w; return w;})
                                }
                              names.unshift({ type: 'paragraph', data: { text: string }});
                            } else if(o[i].tagName == 'img') {
                              let string = '';
                              let pa = formatFromTagName(o[i], '', o[i].tagName);

                              if(pa){
                                names.unshift({ type: 'image', data: { 
                                  "file": {
                                    "url": pa[0].img,
                                  },
                                    "caption" : "",
                                    "withBorder" : false,
                                    "stretched" : false,
                                    "withBackground" : false
                                  }
                                });
                              }

                            } else {
                              scrapeContent(o[i].children, names);
                            }
                             
                              
                              

  // processing nested `child` object

                          } 


                      }
                      return names;
                  }
                let allTypes = scrapeContent(json, []);

               /* function* flatten(array){
                     for(const el of array){
                       yield el;
                       yield* flatten(el.children);
                     }
                  }
                for(const el of flatten(yourdata)){
                      //...
                   }*/

                const parseElementDOM = (element) => {
                    if(typeof element === 'undefined'){
                      return;
                    }
                    if(element.type){

                    }
                  }

               

               if(typeof json === 'undefined'){
                return;
               }

               let blocks = {
                time: Date.now(),
                blocks: allTypes
               };

               

              return blocks;
              },
              addImgContent: async(params) => {
                  //console.log("lets start!")
                  let options = {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify(params)
                  };
                  let h = await fetch(API_URL+"/api/creators/shouldUploadContentMedia", options);
                  //console.log("h!",h)
                  let r = await h.json();
                 // console.log("r!", r)


                  return r;

                  /* return fetch("http://api.newt.to/api/creators/shouldUploadCover", options)
                      .then(res => res.text())
                      .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
                 // console.log("FILENAME", f)
                  
                },
              scrapeLink: async(url) => {
                  //console.log("lets start!")
                  let options = {
                    method: "GET",
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    }
                  };
                  let h = await fetch(API_URL+"/api/creators/scraplink?url="+url, options);

                 // console.log("h!",h)
                  let r = await h.json();
                 // console.log("r!", r)


                  return r;

                  /* return fetch("http://api.newt.to/api/creators/shouldUploadCover", options)
                      .then(res => res.text())
                      .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
                 // console.log("FILENAME", f)
                  
                },
              save: async(params) => {
                //console.log("params save", params.content.length)
                let d = await(this.ApplicationChapters.get(params._id));
                //console.log("dddd!", d)
                /*let n = await(this.ApplicationChapters.upsert(d._id, doc => {
                  if(params.){
                    doc.content = params.content;
                  }
                  if(params.title){
                    doc.title = params.title;
                  }
                }));
                return n;*/
                let u = await(this.ApplicationChapters.upsert(d._id, doc => {
                  //console.log("DOC HERE!", doc)
                  if(params.native_content && params.native_content != null && params.native_content.length > 0){
                   // console.log("content changed")
                    doc.native_content = params.native_content;
                  }
                  if(params.title && params.title != null){
                    doc.title = params.title;
                  }
                  if(params._deleted && params._deleted == true){
                    //console.log("DELETING CHAPTER!")
                    doc._deleted = true;
                  }
                  return doc;
                }));

                
                return u;
                //console.log("get document", d)
                //let n = await(this.ApplicationChapters.put(c, {force: true}));
                //return n;
              },
              saveBulk: async(bulk) => {
                //console.log("params save", params.content.length)
                if(bulk){
                  //console.log("[save bulk] bulk: ", bulk)

                bulk.forEach( chapter => { chapter.updated_at = Date.now() });

                let u = await(this.ApplicationChapters.bulkDocs(bulk));
                return u;
                } else {
                  return null;
                }

              },
              
              //end of create()
            }
          }
          // end of chapters()
        }
       },

     }
   }
   /**
   * Auth
   * @returns functions 
   **/
   Auth = () => {
     //console.log("Auth this", await(this))
    return {
      /**
       * Log in
       * @param {username} string
       * @param {password} string
       **/
      signIn: (username, password) => {
          return this.RemoteStorage.logIn(username, password);
         /* return fetch(this.url +'/oauth/token', data)
                  .then(response => response.json());*/j
      },
      /**
       * Sign Up
       * @param {first_name} string
       * @param {last_name} string
       * @param {email} string
       * @param {password} string
       **/
      signUp: (name, email, username, password) => {

          return this.RemoteStorage.signUp(username, password, {
                  metadata : {
                      email : email,
                      full_name : name,
                      created_at: Date.now(),
                      platforms: ['mobile']
                      //likes : ['harry potter', 'la tregua', 'forrest gump\''],
                    }
               });
      },
      checkRemoteUsername: async(user) => {
        let userN = 'org.couchdb.user:'+user;
        let gU = await(this.RemoteStorage.get(userN)).catch(e => e);
        //console.log("check user", gU)
        return gU;
      },
      checkRemoteEmail: async(email) => {

       // let gU = await(this.RemoteStorage.get(userN)).catch(e => e);

        let query = await(this.RemoteStorage.find({

                              fields: ['_id', 'name', 'email', 'avatar', '_rev'],
                              selector: {
                                email: {
                                  $eq: email
                                }
                              },
                              //sort: [ {'created_at': 'asc'} ],
                              limit: 5,
                              //use_index: 'publicSorts'
                            })).catch(e => null);

        if(query == null){
          return false;
        }
        console.log("check user", query)
        return query.docs;
      },
      checkRemoteHeadUsername: async(user) => {

      },
      updateUser: async(state) => {
        //console.log("state!", state)

        let k = await(this.Auth().getLoggedUser());

        //console.log("user K", k)

        let rS = await(this.RemoteStorage.putUser(k.name, {
                    metadata: {
                      full_name: (state.full_name && state.full_name != k.full_name) ? state.full_name : k.full_name,
                      books: null,
                      email: (state.full_name && state.email != k.email) ? state.email : k.email,
                      avatar: (state.avatar && state.avatar != k.avatar) ? state.avatar : k.avatar
                    }
                  })).catch(e => e);



        let aU = await(this.ApplicationUsers.put(state, {force:true}));
        let aS = await(this.ApplicationSettings.put(state, {force:true}));

        return true;
      },
      changePassword: async(state) => {

        let k = await(this.Auth().getLoggedUser());


        let rS = await(this.RemoteStorage.putUser(k.name, {
                    metadata: {
                      full_name: state.full_name,
                      email: state.email,
                    }
                  }))

        let aU = await(this.ApplicationUsers.put(state, {force:true}));
        let aS = await(this.ApplicationUsers.put(state, {force:true}));

        return true;
      },
      /**
       * Get information about user on API
       **/
      me: () => {
          let data = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+this.access_token,
              'Content-Type': 'application/json',
            }
          }

          return fetch(this.url +'/me', data)
                  .then(response => response.json());
      },
      getRemoteUser: async(username) => {

        return this.RemoteStorage.getUser(username);
      },
      getLocalUser: async(username) => {
       // console.log("get local user!", username, LOCAL_DB_USERS)
        

        //let s = await(this.ApplicationUsers.allDocs({include_docs: true}))
        //console.log("ALLUSERS", s)

        let u = await(this.ApplicationUsers.get('org.couchdb.user:'+username)).catch(e => null);

        if(u == null){


          let ur = await(this.Auth().getRemoteUser(username)).catch(e => null);



          if(ur != null){
            let p = await(this.ApplicationUsers.put(ur, {force:true}));

                u = await(this.ApplicationUsers.get(username)).catch(e => null);
            return u;
          } else {
            return {
              type: 'error',
              message: 'Could not find users that matches: '+username
            }
          }
        } else {

          return u;
        }

        return null;

      },
      getLoggedUser: async() => {
        //__DEV__ && console.log("Get logged user!")
        // roles.indexOf('_admin') === -1 
        let k = await(this.Auth().getKey());
        let s = await(this.ApplicationSettings.allDocs({include_docs: true}))
        let a = await(_.filter(s.rows, item => {
          // console.log("item!", item)
          if(item.doc){
            return item.doc.name === k;
          }
          
        })[0]);
        
       // console.log("single", k)

        //console.log("user settings", s)

        //console.log("user!", u)

        if(typeof a !== 'undefined' && a != null && a.doc != null){
          return a.doc;
        } else {
         // console.log("u undefined!", u)
          let u = await(this.Auth().getRemoteUser(k)).catch(e => null);
          if(u == null){
            // User is not logged properly in the app.
            return false;
          }
          return u;
        }
        
        return k;
      },
      getSession: async() => {
        return this.RemoteStorage.getSession();
      },
      /**
       * Save data
       * @param {data} object
       * @param {email} item/string
       * @param {last_name} item/string
       * @param {first_name} item/string
       * @param {identifier} item/integer
       * @param {type} item/string
       **/
      saveMe: async(data) => {

        let d = data;
        //let p = await(this.ApplicationSettings.get(data._id).then(res => { return res }));
        let p = await(this.ApplicationSettings.allDocs({include_docs: true}))
        //await(this.ApplicationSettings.remove(data._id, data._rev));

        
        //console.log("remove!", r)

        let a = _.filter(p.rows, item => {

          return item.doc.name === d.name;
        })[0];
 

        if(typeof a === 'undefined'){
           
          let n = await(this.ApplicationSettings.put(d, {force: true}));
          let g = await(this.ApplicationSettings.get(d._id))

          return g;
        } else {

          return a.doc; 
        }
        /*
        .then(r => {
          console.log("savedd", r)
          return;
        }).catch(e => {
          this.ApplicationStorage.put(d)
          console.log("wrong", e)
        }))
        */
        
      },
      saveLocalUser: async(data) => {
        let d = data;
        //console.log("get!", data)
        let n = await(this.ApplicationSettings.put(d, {force: true}));
        let g = await(this.ApplicationSettings.get(d._id))

        //console.log("put of!", n)
        return g;
      },
      removeAllUsers: async() => {

        await(this.ApplicationSettings.allDocs().then(result => {
            // Promise isn't supported by all browsers; you may want to use bluebird
            return Promise.all(result.rows.map(row => {
              return this.ApplicationSettings.remove(row.id, row.value.rev);
            }));
          }).then(r => {
            // done!
          }).catch(console.log.bind(console)));
      },
      setKey: async(user) => {

        let f = await(AsyncStorage.setItem('userKey', user));
        let r = await(AsyncStorage.getItem('userKey'));

        return r;
      },
      getKey: async() => { 
        //let r = await(AsyncStorage.removeItem('userKey'));
        //console.log("remove keys!", r)
        let f = await(AsyncStorage.getItem('userKey'));
        //console.log("get key", f) 
      // await(AsyncStorage.removeItem('userKey'));
        return f;
      },
      setProgressBok: async(book, index, scrollPosition) => { 
        //console.log("set progres book1", book, index)
        if(!book || !index || index == 0){
          return;
        }


        

        let k = await(this.Auth().getLoggedUser());

        // if(!k.books){
        //   k.books = [];
        // }
        
        // let indexBook = _.findIndex(k.books, ['bookId', book._id]);



        // if(indexBook == -1){
        //   k.books.push({
        //     _id: book._id,
        //     _rev: book._rev,
        //     index: index || 1,
        //     position: scrollPosition || 0,
        //     title: book.title,
        //     tags: book.tags || null
        //   })
        // } else {
        //   k.books[indexBook].index = index || 1;
        //   k.books[indexBook].position = scrollPosition || 0;
        //   if(!k.books[indexBook].title){
        //     k.books[indexBook].title = book.title;
        //   }
        //   if(!k.books[indexBook].tags && book.tags){
        //     k.books[indexBook].tags = book.tags || null;
        //   }
          
        // }

        

       // let indexBook2 = _.findIndex(k.books, ['bookId', book._id]);

        //console.log("index of book!", k.books[indexBook2], indexBook2)
       //& console.log("user K", k, k.books)

       if(book.count_chapters == index){
        let nT = {
                      _id: k.name+'-'+Date.now(),
                      message: 'You completed '+book.title+'. Congratulations!',
                      from: 'Newt',
                      object: book,
                      action: 'read-book-offline-completed',
                      created_at: Date.now(),
                      viewed: false
                    }
                    let pN = await this.ApplicationNotifications.put(nT).catch(e => null);
       }
      let n = await(this.ApplicationDrafts.upsert(book._id, doc => {
                  doc.progress = index - 1;
                  return doc;
                }));

      // let aU = await(this.ApplicationUsers.put(k, {force:true}));
      // let aS = await(this.ApplicationSettings.put(k, {force:true}));

      // let session = await(this.Auth().getSession());


      //   if(session && session.userCtx.name != null){
      //    // Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
      //     // let rS = await(this.RemoteStorage.putUser(k.name, {
      //     //           metadata: {
      //     //             books: k.books
      //     //           }
      //     //         }))
      //    //Ω return;
      //   } else {
      //    // Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
      //   }

       

        

       // console.log("put!", n, rS, aU, aS)

        return;
      },
      setReadingTheme: async(theme) => { 

        if(!theme){
          return;
        }
        //console.log("move on!")

        

        let k = await(this.Auth().getLoggedUser());
        //console.log("k books!", !k.books)

       // let indexBook2 = _.findIndex(k.books, ['bookId', book._id]);

        //console.log("index of book!", k.books[indexBook2], indexBook2)
       //& console.log("user K", k, k.books)

        k.readingTheme = theme;
        let session = await(this.Auth().getSession());
        if(session && session.userCtx.name != null){
         // Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
          let rS = await(this.RemoteStorage.putUser(k.name, {
                    metadata: {
                      readingTheme: theme
                    }
                  }))
         //Ω return;
        } else {
          //Snackbar.show({ title: 'Refresh your session', duration: Snackbar.LENGTH_LONG });
        }

       

        let aU = await(this.ApplicationUsers.put(k, {force:true}));
        let aS = await(this.ApplicationSettings.put(k, {force:true}));

       // console.log("put!", n, rS, aU, aS)

        return;
      },
      getMe: (user) => {
 
      },
      getAllAcounts: async() => {
        let p = await(this.ApplicationSettings.allDocs({include_docs: true}))
        console.log("all accounnts!");
      },
      avatarUp: async(params) => {
        __DEV__ && console.log("avatar up!", params)
            let options = {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(params)
            };


            let h = await fetch(API_URL+"/api/creators/shouldUploadAvatar", options);

            let r = await h.json();



            return r;

            /* return fetch("http://api.newt.to/api/creators/shouldUploadCover", options)
                .then(res => res.text())
                .then(response => response).catch(err=> console.log("error on fetch cover", err));*/
           // console.log("FILENAME", f)
            
          },
      /** 
       * Log out user from API
       * @returns boolean
       **/
      signOut: async() => {
        let r = await(AsyncStorage.removeItem('userKey')).catch(e => null);
        let a = (this.AppSettings.destroy()).catch(e => null);
         let c = (this.ApplicationChapters.destroy()).catch(e => null);
         let b = this.ApplicationDrafts.destroy().catch(e => e);
        let aa = (this.ApplicationActivities.destroy()).catch(e => null);
        let s = (this.ApplicationSettings.destroy()).catch(e => null);
        let o = (this.ApplicationStorage.destroy()).catch(e => null);
        let n = (this.ApplicationNotifications.destroy()).catch(e => null);


        //let cl = await(this.ApplicationCollections.destroy());
        //let a = await(this.ApplicationActivities.destroy());
        //let l = await(this.RemoteStorage.logOut());
        //__DEV__ && console.log("r!!!", r, c, d, s, o, n, l)
        this.start();
        return r;
      },
      update: (toUpdate) =>  axios.put(url,toUpdate),
      create: (toCreate) =>  axios.put(url,toCreate),
      delete: ({ id }) =>  axios.delete(`${url}/${id}`)
    }
  }
}
export default API;