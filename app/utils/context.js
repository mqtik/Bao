import React, { useState, useEffect } from 'react';
import { Platform, Linking, Dimensions, Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import update from 'immutability-helper';
import { Button } from 'react-native-paper';
import API from '../services/api';
import { getHeaderHeight, getHeaderSafeAreaHeight, getOrientation} from '../services/sizeHelper';
import { Cover } from './renders'
import { IconButton, Colors } from 'react-native-paper';
import AwesomeButton from "react-native-really-awesome-button";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableRipple } from 'react-native-paper';
import Permissions from 'react-native-permissions';
import isEqual from 'react-fast-compare';
import RNRestart from 'react-native-restart';
import { useNetInfo } from "@react-native-community/netinfo";
import VersionCheck from 'react-native-version-check';
import Share from 'react-native-share';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { getLang, Languages } from '../static/languages';

import { useWidth } from './hooks'
import { Logo } from './vectors'
const WrapperAPI = new API();

export const Newt = React.createContext();
export const Clouch = React.createContext();

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

export const withNewt = ({children}) => {
	return (
		<Newt.Consumer>
			{context => {
		        if (context === undefined) {
		          throw new Error('CountConsumer must be used within a CountProvider')
		        }
		        return children(context)
		      }}
        </Newt.Consumer>
      )
}

export const withClouch = ({children}) => {
	return (
		<Clouch.Consumer>
			{context => {
		        if (context === undefined) {
		          throw new Error('CountConsumer must be used within a CountProvider')
		        }
		        return children(context)
		      }}
        </Clouch.Consumer>
      )
}

let partDocIds = null;
let rcl, rcr ,rdl, rdr, ra, rar;
export const NewtProvider = ({children}) => {
	const ClouchDB = React.useContext(Clouch);
	const ancho = useWidth();


	const [ accountType, setAccountType ] = React.useState('regular');


	const [ appSettings, setAppSettings ] = useState(null);
	const [ drafts, setDrafts ] = useState(null);
	const [ publishedBooks, setPublishedBooks ] = useState(null);
	const [ publishedTagsBooks, setPublishedTagsBooks ] = useState(null);
	const [ collections, setCollections ] = useState(null);
	const [ following, setFollowing ] = useState(null);
	const [ liked, setLiked ] = useState(null);
	const [ notifications, setNotifications ] = useState(null);
	const [ auth, setAuth ] = useState(null);
	const [ rootUser, setRootUser ] = useState(null);
	const [ partsNeedPull, setPartsNeedPull ] = useState(null);
	const [ modalSection, setModalSection ] = useState('session');
	const [ modalOpen, setModalOpen ] = useState(false);
	const [ refreshPassword, setRefreshPassword ] = useState('');
	const [ refreshError, setRefreshError ] = useState(null);
	const [ bookCollection, setBookCollection ] = useState(null);
	const [ valueCreate, setValueCreate ] = useState('');
	const [ userQueue, setUserQueue ] = useState('');
	const isAdmin = (rootUser && rootUser.roles && rootUser.roles.indexOf("admin") > -1) ? true : false;
	const isPremium = (rootUser && rootUser.roles && rootUser.roles.indexOf("premium") > -1) ? true : false;
	const [ sequence, setSequence ] = useState('now');
	const [ activitiesSequence, setActivitiesSequence ] = useState('now');
	const [ info, setInfo ] = useState({
								books: {
									update_seq: null,
									initial: false,
								},
								chapters: {
									update_seq: null,
									initial: false,
									docIds: []
								},
								activities: {
									update_seq: null,
									initial: false
								},
							})
	

	const [ ready, setReady ] = useState(false);
	const netStatus = useNetInfo();
	const [ version, setVersion ] = useState(null);

  	useEffect(() => {
		if(appSettings == null && drafts != null && publishedBooks != null && publishedTagsBooks != null){
			setTimeout(() => {
				$app();
			}, 5000)
		}
  	}, [appSettings]);

  	useEffect(() => {
		if(rootUser != null){
			if(!drafts && !publishedBooks && !appSettings){
				$setReady();
			}
		}
  	}, [rootUser, drafts, publishedBooks, appSettings]);

	useEffect(() => {
		$checkSession();
  	}, []);


  	async function $setReady(){
  		if(rootUser != null && drafts == null && publishedBooks == null){
			// if(drafts == null){
			// 	let d = await $drafts();
			// }
			// if(publishedBooks == null){
			// 	let p = await $published()
			// }
			// if(version == null){
			// 	$versions()
			// }
			// setReady(true);

			if(!drafts && !publishedBooks){
				$mount();
			}
		}
  	}
 	
 	
  	async function $mount(){
		setReady(true);

		if(version == null){
			//$versions()
		}
		return;
  	}

  	async function $app(){
  		return;
		let a = await ClouchDB.Settings().get();
		let b = {
			lastBookSeq: (a && a.lastBookSeq) || null,
			lastLocalBookSeq: (a && a.lastLocalBookSeq) || null,
			lastChapterSeq: (a && a.lastChapterSeq) || null,
			lastLocalChapterSeq: (a && a.lastLocalChapterSeq) || null,
			lastActivitiesSeq: (a && a.lastActivitiesSeq) || null,
			lastLocalActivitiesSeq: (a && a.lastLocalActivitiesSeq) || null,
		};
		let toEdit = false;
		if(b.lastBookSeq == null){
			let brd = await(ClouchDB.RemoteDrafts.info()).catch(e => null);
			if(brd && brd.update_seq){
				b.lastBookSeq = brd.update_seq;
				toEdit = true;
			}
		}
		if(b.lastChapterSeq == null){
			let brc = await(ClouchDB.RemoteChapters.info()).catch(e => null);
			if(brc && brc.update_seq){
				b.lastChapterSeq = brc.update_seq;
				toEdit = true;
			}
		}
		if(b.lastLocalBookSeq == null && b.lastLocalBookSeq != 0){
			let brl = await(ClouchDB.ApplicationDrafts.info()).catch(e => null);
			if(brl && brl.update_seq > -1){
				b.lastLocalBookSeq = brl.update_seq;
				toEdit = true;
			}
		}
		if(b.lastLocalChapterSeq == null && b.lastLocalChapterSeq != 0){
			let brcl = await(ClouchDB.ApplicationChapters.info()).catch(e => null);
			if(brcl && brcl.update_seq > -1){
				b.lastLocalChapterSeq = brcl.update_seq;
				toEdit = true;
			}
		}

		if(b.lastActivitiesSeq == null){
			let arr = await(ClouchDB.RemoteActivities.info()).catch(e => null);
			if(arr && arr.update_seq){
				b.lastActivitiesSeq = arr.update_seq;
				toEdit = true;
			}3
		}
		if(b.lastLocalActivitiesSeq == null && b.lastLocalActivitiesSeq != 0){
			let arl = await(ClouchDB.ApplicationActivities.info()).catch(e => null);
			if(arl && arl.update_seq > -1){
				b.lastLocalActivitiesSeq = arl.update_seq;
				toEdit = true;
			}
		}
		if(toEdit == true){
			let lq = ClouchDB.Settings().set({
					lastBookSeq: b.lastBookSeq,
					lastChapterSeq: b.lastChapterSeq,
					lastLocalBookSeq: b.lastLocalBookSeq,
					lastLocalChapterSeq: b.lastLocalChapterSeq,
					lastLocalActivitiesSeq: b.lastLocalActivitiesSeq,
					lastActivitiesSeq: b.lastActivitiesSeq
				});
			//console.log("after edit!", lq)
		}
		setAppSettings(b);
		if(b.lastBookSeq && b.lastLocalBookSeq){
			setTimeout(() => {
				$fireSyncDrafts(b.lastBookSeq, b.lastLocalBookSeq);
			}, 5000)
		}
		return b;
	}

	async function $checkSession(){
	 let key = await ClouchDB.Auth().getKey();
	 console.log("check session!!", key)
	 if(key != null && rootUser == null){
	 	let k = await ClouchDB.Auth().getLoggedUser();
	 	setRootUser(k);
	 	setAuth(true);
	 } else {
	 	setAuth(false);
	 	setRootUser(null);
	 }
	}

	async function $sync(db, to, live, docIds, seq){
		//console.log("TRIGGER SYNC!", db, to, live, docIds, seq)
		if(!db){ return; }
		if(!live){ live = false; }
		if(!to){ to = 'both'; }
		let syncOptions = {
                   live: live == true ? true : false,
                   retry: true,
                   style: "main-only",
                   filter: "_selector",
                   selector: {},
                   since: 'now',
                   back_off_function: function (delay) {
                      if (delay === 0) {
                        return 20000;
                      }
                      return delay * 3;
                    },
                    batch_size: live == true ? 50 : 100,
                    checkpoint: 'source',
                    batches_limit: 2,
                    include_docs:false,
                    attachments: false,
                    conflicts:false
                    //push: {checkpoint: false}, pull: {checkpoint: false},
                    // query_params: { "userId": this.state.rootUser.name }
                  };

		  let syncFrom, syncCommand, syncTo, selector;
		  if(seq){
		  		syncOptions.since = seq;
		  	}
		  if(db == 'books'){
		  	
		  	syncFrom = ClouchDB.ApplicationDrafts;
		  	syncTo = ClouchDB.RemoteDrafts;
		  	syncOptions.selector = {
		  					$and: [{
					  					"_id": {
					  						"$gte": rootUser.name+":book"
					  					}
					  				},
					  				{
					  					"_id": {
					  						"$lt": rootUser.name+":book:\uffff"
					  					}
					  				}
					  			]
					  		};
		  } else if(db == 'chapters'){
		  	syncFrom = ClouchDB.ApplicationChapters;
		  	syncTo = ClouchDB.RemoteChapters;
		  	if(!docIds || docIds.length == 0){
		  		return;
		  	}
		  	syncOptions.selector = {
		  		$or: []
		  	}
		  	for (var i = docIds.length - 1; i >= 0; i--) {
		  		let docId = docIds[i];
		  		if(docId){

		  			syncOptions.selector.$or.push({
		  				"_id": {
		  					"$gte": docIds[i]+":chapter:",
		  					"$lt": docIds[i]+":chapter:\uffff"
		  				}
			  			// "$and": [{
					  	// 			"_id": {
						  // 				"$gte": docIds[i]+":chapter:"
						  // 			}
						  // 		},
						  // 		{
						  // 			"_id": {
						  // 				"$lt": docIds[i]+":chapter:\uffff"
						  // 			}
				  		// 		}
				  		// 	]
			  		})
		  		}
		  	}

		  	if(syncOptions.selector.$or.length == 0){
		  		return;
		  	}

		  } else if(db == 'activities'){
		  	syncFrom = ClouchDB.ApplicationActivities;
		  	syncTo = ClouchDB.RemoteActivities;

		  	syncOptions.selector = {
				$or: []
			};
			// if(collections != null){
				syncOptions.selector.$or.push({
					          "_id": {
					             "$gte": rootUser.name+"-collection:",
					             "$lt": rootUser.name+"-collection:\ufff0"
					          }
					       })
				syncOptions.selector.$or.push({
					          "_id": {
					             "$gte": rootUser.name+"-followUser:",
					             "$lt": rootUser.name+"-followUser:\ufff0"
					          }
					       })
				syncOptions.selector.$or.push({
					          "_id": {
					             "$gte": rootUser.name+"-likeBook:",
					             "$lt": rootUser.name+"-likeBook:\ufff0"
					          }
					       })
			// }
			// if(following != null){
			// 	syncOptions.selector.$and.push({
			// 		          "_id": {
			// 		             "$gte": rootUser.name+"-followUser:",
			// 		             "$lt": rootUser.name+"-followUser:\ufff0"
			// 		          }
			// 		       })
			// }
			// if(liked != null){
			// 	syncOptions.selector.$and.push({
			// 		          "_id": {
			// 		             "$gte": rootUser.name+"-likeBook:",
			// 		             "$lt": rootUser.name+"-likeBook:\ufff0"
			// 		          }
			// 		       })
			// }

		  }

		  if(db == 'books'){
		  	if(rdl && rdl.cancel && to == 'to'){
		  		rdl.cancel();
		  	}
		  	if(rdr && rdr.cancel && to == 'from'){
		  		rdr.cancel();
		  	}
		  }
		  if(db == 'chapters'){
		  	if(rcl && rcl.cancel && to == 'to'){
		  		rcl.cancel();
		  	}
		  	if(rcr && rcr.cancel && to == 'from'){
		  		rcr.cancel();
		  	}
		  }
		  if(db == 'activities' && live == true){
		  	if(rar && rar.cancel && to == 'from'){
		  		rar.cancel();
		  	}
		  	if(ra && ra.cancel && to == 'to'){
		  		ra.cancel();
		  	}
		  }

		  if(to == 'both'){
		  	syncCommand = syncFrom.sync(syncTo, syncOptions);
		  } else if(to == 'from'){
		  	syncCommand = syncFrom.replicate.from(syncTo, syncOptions);
		  } else if(to == 'to'){
		  	syncCommand = syncFrom.replicate.to(syncTo, syncOptions)
		  }

		  if(!syncFrom || !syncTo || !syncCommand){
		  	return;
		  }

		  
		  __DEV__ && console.log("[SYNC] Start", db, to, syncOptions)
		  	
		  let replication = (
		  			syncCommand
		  				.on('completed', (info) => {
		                  replication.cancel();
		                })
		                .on('error', (info) => {
		                  replication.cancel();
		                })
		                .on('change', (info) => {
		                  __DEV__ && console.log("on change!", db, to, info)
		                  if(info && info && info.ok && info.last_seq && to == 'from' && db == 'books'){
		                  	let lq = ClouchDB.Settings().set({
						  				lastBookSeq: info.last_seq
						  			})
		                  	if(appSettings && appSettings.lastBookSeq){
		                  		setAppSettings((prevState) => update(prevState, { 
					                    lastBookSeq: {
					                    	$set: info.last_seq
					                    }
				                 }));
		                  	} else if(!(appSettings && appSettings.lastBookSeq)){
		                  		setAppSettings((prevState) => update(prevState, { 
					                   $set: {
					                   	lastBookSeq: info.last_seq
					                   }
				                 }));
		                  	}
		                  }
		                  if(info && info.ok && info.last_seq && to == 'to' && db == 'books'){
		                  	let lq = ClouchDB.Settings().set({
						  				lastLocalBookSeq: info.last_seq
						  			})
		                  	if(appSettings && appSettings.lastLocalBookSeq){
		                  		setAppSettings((prevState) => update(prevState, { 
					                    lastLocalBookSeq: {
					                    	$set: info.last_seq
					                    }
				                 }));
		                  	} else if(!(appSettings && appSettings.lastLocalBookSeq)){
		                  		setAppSettings((prevState) => update(prevState, { 
					                   $set: {
					                   	lastLocalBookSeq: info.last_seq
					                   }
				                 }));
		                  	}
		                  }
		                  if(info && info.ok && info.last_seq && to == 'from' && db == 'activities'){
		                  	//console.log("ON ACTIVITIES NEED PULL!", info)
		                  	let lq = ClouchDB.Settings().set({
						  				lastActivitiesSeq: info.last_seq
						  			})
		                  	if(appSettings && appSettings.lastActivitiesSeq){
		                  		setAppSettings((prevState) => update(prevState, { 
					                    lastActivitiesSeq: {
					                    	$set: info.last_seq
					                    }
				                 }));
		                  	} else if(!(appSettings && appSettings.lastActivitiesSeq)){
		                  		setAppSettings((prevState) => update(prevState, { 
					                   $set: {
					                   	lastActivitiesSeq: info.last_seq
					                   }
				                 }));
		                  	}
		                  	if(info.docs && info.docs.length >= 0){
		                  		for (var i = info.docs.length - 1; i >= 0; i--) {
		                  			let thId = info.docs[i]._id;
		                  			if(thId.indexOf("-collection") > -1 && needPull.collections == false){
		                  				setNeedPull((prevState) => update(prevState, { 
							                    collections: {
							                    	$set: true
							                    }
						                 }));
		                  			}
		                  			if(thId.indexOf("-likeBook") > -1 && needPull.liked == false){
		                  				setNeedPull((prevState) => update(prevState, { 
							                    liked: {
							                    	$set: true
							                    }
						                 }));
		                  			}
		                  			if(thId.indexOf("-followUser") > -1 && needPull.following == false){
		                  				setNeedPull((prevState) => update(prevState, { 
							                    following: {
							                    	$set: true
							                    }
						                 }));
		                  			}
		                  		}
		                  	}
		                  }
		                  if(info && info.ok && info.last_seq && to == 'to' && db == 'activities'){
		                  	let lq = ClouchDB.Settings().set({
						  				lastLocalActivitiesSeq: info.last_seq
						  			})
		                  	if(appSettings && appSettings.lastLocalActivitiesSeq){
		                  		setAppSettings((prevState) => update(prevState, { 
					                    lastLocalActivitiesSeq: {
					                    	$set: info.last_seq
					                    }
				                 }));
		                  	} else if(!(appSettings && appSettings.lastLocalActivitiesSeq)){
		                  		setAppSettings((prevState) => update(prevState, { 
					                   $set: {
					                   	lastLocalActivitiesSeq: info.last_seq
					                   }
				                 }));
		                  	}
		                  }
		                  if(info && info.ok && info.last_seq && to == 'from' && db == 'chapters'){
		                  	let lq = ClouchDB.Settings().set({
						  				lastChapterSeq: info.last_seq
						  			})
		                  	if(appSettings && appSettings.lastChapterSeq){
		                  		setAppSettings((prevState) => update(prevState, { 
					                    lastChapterSeq: {
					                    	$set: info.last_seq
					                    }
				                 }));
		                  	} else if(!(appSettings && appSettings.lastChapterSeq)){
		                  		setAppSettings((prevState) => update(prevState, { 
					                   $set: {
					                   	lastChapterSeq: info.last_seq
					                   }
				                 }));
		                  	}
			                  	if(info && info.docs && info.docs.length > -1){
			                  		
			                  		setPartsNeedPull((prevState) => {
			                  			let toPush = prevState ? prevState : [];
			                  			for (var i = info.docs.length - 1; i >= 0; i--) {
				                  			if(info.docs[i]._id && toPush.indexOf(info.docs[i]._id) == -1){
				                  				toPush.push(info.docs[i]._id)
				                  			}
				                  		}
				                  		if(toPush && toPush.length > 0){
			                  		  		return update(prevState, {
							            			$set: toPush
							                 })
			                  			} else if(!toPush || toPush.length == 0){
			                  				return update(prevState, {
							            			$set: null
							                 })
			                  			}
			                  			return prevState;
			                  		});
			                  		
			                  	}
		                 
		                  }
		                  if(info && info.ok && info.last_seq && to == 'to' && db == 'chapters'){
		                  	let lq = ClouchDB.Settings().set({
						  				lastLocalChapterSeq: info.last_seq
						  			})
		                  	if(appSettings && appSettings.lastLocalChapterSeq){
		                  		setAppSettings((prevState) => update(prevState, { 
					                    lastLocalChapterSeq: {
					                    	$set: info.last_seq
					                    }
				                 }));
		                  	} else if(!(appSettings && appSettings.lastLocalChapterSeq)){
		                  		setAppSettings((prevState) => update(prevState, { 
					                   $set: {
					                   	lastLocalChapterSeq: info.last_seq
					                   }
				                 }));
		                  	}
		                  }
		                })
		                .on('paused', (info) => {
		                	__DEV__ && console.log("ON PAUSED", db, rar, ra, to, info)
		                	if(info && info.result && info.result.ok == false && info.result.status == 'aborting' && to == 'from'){
		                		replication.cancel();
		                	}
		                })
		                // .on('active', (info) => {
		                // 	console.log("ON ACTIVE", db, to, info)
		                // })
		            )

		  
		  if(db == 'books'){
		  	  if(rdl && to == 'to'){
		  	  	rdl = replication;
		  	  }
		  	  if(rdr && to == 'from'){
		  	  	rdr = replication;
		  	  }
			}
		  if(db == 'chapters'){
			  if(rcl && to == 'to'){
			  	rcl = replication;
			  }
			  if(rcr && to == 'from'){
			  	rcr = replication
			  }
			}
		  if(db == 'activities'){
		  	if(ra && to == 'to'){
			  	ra = replication;
			  }
			  if(rar && to == 'from'){
			  	rar = replication
			  }
			}
		  
		  await replication;
		  return replication;
	}


	async function $onSignOut(){
		//console.log("on sign out!!")

		
	 	let ko = await(ClouchDB.Auth().signOut()).catch(e => null);

		//console.log("sign out!!", ko)
		setTimeout(() => {
			setAuth(false);
		 	setRootUser(null);
		 	setPublishedBooks(null);
			setDrafts(null);
			setPublishedTagsBooks(null);
			setCollections(null);
			setNotifications(null);
			setFollowing(null);
			setLiked(null);
			RNRestart.Restart();
		}, 2000)
	 	//RNRestart.Restart();
	 	return;
	}

	async function $versions(){
		let v = await VersionCheck.needUpdate();
		setVersion(v);
		if(v && v.isNeeded == true){
			setModalSection('update');
			setModalOpen(true);
		}
		//console.log("GET VERSIONS!", v)
	}

	async function $drafts(seq){
		let getDrafts = await(ClouchDB.Work().drafts().all());
		if(getDrafts && getDrafts.rows.length == 0){
			getDrafts = await(ClouchDB.Work().drafts().replicateFrom());
          	getDrafts = await(ClouchDB.Work().drafts().all());
		}
		setDrafts(getDrafts);
		
		return;
	}

	async function $fireSyncDrafts(seqRemote, seqLocal){
		if(rootUser.sync && rootUser.sync.status == true){
			setSyncStatus((prevState) => update(prevState, { 
		            	drafts: {
		            		$set: true
		            	}
	                 }));
			let ds = await $sync('books', 'from', false, null, seqRemote);
			//console.log("fire sync drafts response", ds)
			setTimeout(async() => {
				//let ds2 = await $sync('books', 'to', false, null, seqLocal);
				if(rootUser.sync.live && rootUser.sync.live == true && ds.ok){
					$sync('books', 'from', true, null, seqRemote);
					$sync('books', 'to', true, null, seqLocal);
				}
			}, 5000)
		}
	}

	async function $published(){
		//console.log("get public!")
		let getPublishedBooks = await(ClouchDB.Public().all());

        if(getPublishedBooks && getPublishedBooks.length < 20){
            getPublishedBooks = await(ClouchDB.Public().replicateFrom());
            getPublishedBooks = await(ClouchDB.Public().all());

        }

        let formattedDocs = await ClouchDB.Public().formatFromTags(getPublishedBooks, { sort: 'default' });
        setPublishedBooks(getPublishedBooks);
        setPublishedTagsBooks(formattedDocs);
        return;
	}

	async function $collections(){
		let get = await(ClouchDB.Collections().findAllByUserIdWithBooks(rootUser.name));
		
		setCollections(get);
		return true;
	}

	async function $notifications(){
		let get = await(ClouchDB.Notifications().all());
		setNotifications(get);
		return true;
	}

	async function $following(){
		let get = await(ClouchDB.Activities().getFollowingByUserIdWithContents(rootUser.name));
		setFollowing(get);	
		return true;
	}

	async function $liked(){
		let get = await(ClouchDB.Activities().getAllLikesByUserIdWithContents(rootUser.name));
		setLiked(get);
		return true;
	}

	function onUpdatedOrInsertedPublished(newDoc){
		//console.log("on chapter change!!! part", newDoc, parts)
      	if(typeof drafts === 'undefined' || drafts == null || !(drafts.rows) || !newDoc){
            return;
          }
          var index = drafts.rows.findIndex((p) => p._id === newDoc._id);
          //console.log("[CHAPTERS] UPDATE OR INSERT", newDoc, index, parts)
          var draft = drafts.rows[index];
          if(newDoc && newDoc._id.includes("_design")){
            return;
          }
          if (draft && newDoc && draft._id === newDoc._id) { // update
            if(newDoc._deleted){
	            return setPublishedBooks((prevState) => update(prevState, { 
		                    $splice: [[index, 1]]
	                 }));
	          } else {
	          	return setPublishedBooks((prevState) => update(prevState, { 
		          			[index]: { 
		                      $set: newDoc
		                     } 
	                 }));
	          }
          } else { // insert

            if(index == -1 && newDoc &&  !newDoc._deleted){
            	return setPublishedBooks((prevState) => update(prevState, {
		          			$push: [newDoc]
	                 }));
          }
        }
    }


	function onUpdatedOrInsertedDraft(newDoc){
		//console.log("on chapter change!!! part", newDoc, parts)
      	if(typeof drafts === 'undefined' || drafts == null || !(drafts.rows)){
            return;
          }
          var index = drafts.rows.findIndex((p) => p._id === newDoc._id);
          //console.log("[CHAPTERS] UPDATE OR INSERT", newDoc, index, parts)
          var draft = drafts.rows[index];
          if(newDoc && newDoc._id.includes("_design")){
            return;
          }
          if (draft && draft._id === newDoc._id) { // update
            if(newDoc._deleted){
	            return setDrafts((prevState) => update(prevState, { 
		            	rows: {
		                    $splice: [[index, 1]]
		                }
	                 }));
	          } else {
	          	return setDrafts((prevState) => update(prevState, { 
	          			rows: {
		          			[index]: { 
		                      $set: newDoc
		                     } 
		                }
	                 }));
	          }
          } else { // insert
            if(index == -1 && !newDoc._deleted){
            	return setDrafts((prevState) => update(prevState, {
	            		rows: {
		          			$push: [newDoc]
		          		}
	                 }));
          }
        }
    }

	async function $doLike(book){
		let bookId = book._id;
		if(!bookId || !rootUser){ 
	      return; 
	    }
	    if(liked == null){
	    	await $liked();
	    }
	    let c = await ClouchDB.Activities().setActivity(rootUser.name+'-likeBook:'+bookId);

	    if(liked && liked.rows){
	    	let indexLiked = liked.rows.findIndex((object) => {
		        return object._id === book._id;
		    });
		    if(indexLiked > -1){
		    	setLiked((prevState) => update(prevState, { 
                    rows: { 
                        $splice: [[indexLiked, 1]] 
                     }
                 }));
		    } else {
		    	setLiked((prevState) => update(prevState, { 
                    rows: { 
                    	$push: [book]
                    }
                 }));
		    }
	    } 
	    return c;
	}

	async function $addBookToCollection(col, book){
		//console.log("add book to!", col, book)
		let colId = col._id;
		let bookId = book._id;
		let indexCollection = collections.rows.findIndex((object) => {
	        return object._id === colId;
	    });
	    if(indexCollection > -1){
	    	let indexCollectionBook = collections.rows[indexCollection].books.findIndex((object) => {
		        return object === bookId;
		    });
		    let indexCollectionRow = collections.rows[indexCollection].rows.findIndex((object) => {
		        return object._id === bookId;
		    });


		    if(indexCollectionBook > -1 && indexCollectionRow > -1){
		    	setCollections((prevState) => update(prevState, { 
                    rows: { 
                        [indexCollection]: { 
                            books: {
                            	$splice: [[indexCollectionBook, 1]]
                            },
                            rows: {
                            	$splice: [[indexCollectionRow, 1]]
                            }
                           } 
                         }
                     }));
		    } else {
		    	setCollections((prevState) => update(prevState, { 
                    rows: { 
                        [indexCollection]: { 
                            books: {
                            	$push: [book._id]
                            },
                            rows: {
                            	$push: [book]
                            }
                           } 
                         }
                     }));
		    }

		    let c = await ClouchDB.Collections().addOrRemoveFrom(col._id, book._id);
	    }

	}
	async function $onCreateCollection(title, book){
		if(!title || !book || rootUser == null){ return; }
		let c = await ClouchDB.Collections().create(title, rootUser.name, book._id);
		//console.log("on create coll!", c)
		c.rows = [book];
		setCollections((prevState) => update(prevState, { 
                    rows: { 
                       $push: [c]
                    }
                }));
	}
	async function $onRemoveCollection(n_c){
		if(collections == null){ return 'No collections'; }
		let findIndex = collections.rows.findIndex(c => c._id == n_c._id);
		if(findIndex > -1){
			setCollections((prevState) => update(prevState, { 
                    rows: { 
                    	$splice: [[findIndex, 1]] 
                    }
                }));
			let n_c_s = {...n_c};
			n_c_s._deleted = true;
			let c = await(ClouchDB.Collections().updateOne(n_c_s)).catch(err => null);
			return c;
		}
	}
	async function $onEditCollection(n_c){
		if(collections == null){ return 'No collections'; }
		let findIndex = collections.rows.findIndex(c => c._id == n_c._id);
		if(findIndex > -1){
			setCollections((prevState) => update(prevState, { 
                    rows: { 
                    	[findIndex]: {
                    		$set: n_c
                    	}
                    }
                }));
			let n_c_s = {...n_c};
			let c = await ClouchDB.Collections().updateOne(n_c_s);
		}
	}

	async function $triggerAction(a){
		if(rootUser == null){ return; }
		if(a == 'collections' && collections == null){
			await $collections();
		}
		if(a == 'liked' && liked == null){
			await $liked();
		}
		if(a == 'following' && following == null){
			await $following();
		}
		if(a == 'notifications' && notifications == null){
			await $notifications();
		}

		return;
	}

	function $openAddToCollection(book){
		$triggerAction('collections');
		setModalSection('collections');
		setModalOpen(true);
		setBookCollection(book);
	}

	function $openAddressSelector(){
		$triggerAction('address');
		setModalSection('address');
		setModalOpen(true);
	}


	function $openCreateStory(){
		setModalSection('newbook');
		setModalOpen(true);
	}

	async function $askPermissions(){
		let reqc = await Permissions.request('camera', {
	          rationale: {
	            title: 'Newt Camera Permission',
	            message:
	              'Newt needs access to your camera ' +
	              'so you can take awesome pictures.',
	          },
	        });
		let reqp = await Permissions.request('photo', {
	          rationale: {
	            title: 'Newt Camera Permission',
	            message:
	              'Newt needs access to your camera ' +
	              'so you can take awesome pictures.',
	          },
	        })

		let check = await Permissions.checkMultiple(['camera', 'photo']);
	   // console.log("check!!", reqc, reqp, check)
	    if(reqc == 'unavailable' || reqp == 'unavailable'){ return false; }
	    
	    return true;
	  }

	async function $updateRootUser(u){
		if(rootUser == null){ return; }

		setUserQueue(u);
		let session = await(ClouchDB.Auth().getSession());
		if(session.ok && session.ok == true){
			if(session.userCtx){
				if(session.userCtx && session.userCtx.name == null){
					setModalSection('session');
					setModalOpen(true);
				}
				if(session.userCtx && session.userCtx.name == rootUser.name){
					$doSaveRootUser(u);
				}
			}
		}
	}

	async function $updateLocalRootUser(u){
		if(rootUser == null){ return; }
		await $doSaveRootUser(u);
		return;
	}

	async function $doSaveRootUser(u){

		let userObj = rootUser, setLang = false;
		if(userObj.email != u.email){
			userObj.email = u.email;
		}
		if(userObj.full_name != u.full_name){
			userObj.full_name = u.full_name;
		}
		if(userObj.language != u.language){
			userObj.language = u.language;
			setLang = true;
			
		}
		if(!(userObj.sync)){
			userObj.sync = {};
		}
		if(!(u.sync)){
			u.sync = {};
		}
		if(!isEqual(userObj.sync, u.sync)){
			userObj.sync = u.sync;
		}

		if(userObj.avatar != u.avatar){
			userObj.avatar = u.avatar;
		}

		if(!isEqual(userObj.reading, u.reading)){
			userObj.reading = u.reading;
		}

		setRootUser(userObj);

		let upd = (ClouchDB.Auth().updateUser(userObj)).catch(e => null);
		
		if(setLang == true){
			setPublishedBooks(null);
        	setPublishedTagsBooks(null);
			$published();
		}
		return;
	}
	// useEffect(() => {
	// 	console.log("USER ROOT CHANGED", rootUser)
	// }, [rootUser])
	async function $doRefreshSession(){
		setRefreshError(null);
		if(rootUser == null){ return; }
		let userId = rootUser.name;
		let password = refreshPassword;
		if(!userId || !password || password == ''){
			return setRefreshError('Write your passsword');
		}
		let l = await ClouchDB.Auth().signIn(userId.toLowerCase(), password).catch(e => null);
		if(l != null && l && l.ok == true){
			//console.log("do refresh!", l, userId, password, userQueue)
			$doSaveRootUser(userQueue);
			setModalOpen(false);
		} else {
			setRefreshError('Password incorrect');
		}

	}

	function shareChapter(key){
      if(!key || !rootUser){ return; }
      const url = 'https://newt.to/'+key._id.replace(/:book:/g,'/').replace(/:chapter:/g,'/');
      //console.log("share chapter url!", url)
      const title = key.title + ' it\'s available to read on Bao';
      const message = rootUser.name+' sent you this book through Bao.' ;
      const icon = 'https://tias.xyz/assets/newt.ico';
      const options = Platform.select({
        ios: {
          activityItemSources: [
            { // For sharing url with custom title.
              placeholderItem: { type: 'url', content: url },
              item: {
                default: { type: 'url', content: url },
              },
              subject: {
                default: title,
              },
              linkMetadata: { originalUrl: url, url, title },
            },
            { // For sharing text.
              placeholderItem: { type: 'text', content: message },
              item: {
                default: { type: 'text', content: message },
                message: null, // Specify no text to share via Messages app.
              },
              linkMetadata: { // For showing app icon on share preview.
                 title: message
              },
            },
            { // For using custom icon instead of default text icon at share preview when sharing with message.
              placeholderItem: {
                type: 'url',
                content: icon
              },
              item: {
                default: {
                  type: 'text',
                  content: ``
                },
              },
              linkMetadata: {
                 title: title,
                 icon: icon
              }
            },
          ],
        },
        default: {
          title,
          subject: title,
          message: `${message} ${url}`,
        },
      });

      Share.open(options);
    }

	function shareBlockChapter(key, block){
      if(!key || !rootUser){ return; }
      let hasText = false;
      if(block.type == 'paragraph'){
      	if(block.data && block.data.text && block.data.text != ''){
      		hasText = block.data.text;
      	}
      }

      if(hasText == false){
      	return;
      }
      const url = 'https://newt.to/'+key._id.replace(/:book:/g,'/').replace(/:chapter:/g,'/');
      const title = key.title + ' quote: '+hasText;
      const message = null;
      const icon = 'https://tias.xyz/assets/newt.ico';
      const options = Platform.select({
        ios: {
          activityItemSources: [
            { // For sharing url with custom title.
              placeholderItem: { type: 'url', content: url },
              item: {
                default: { type: 'url', content: url },
              },
              subject: {
                default: title,
              },
              linkMetadata: { originalUrl: url, url, title },
            },
            { // For sharing text.
              placeholderItem: { type: 'text', content: message },
              item: {
                default: { type: 'text', content: message },
                message: null, // Specify no text to share via Messages app.
              },
              linkMetadata: { // For showing app icon on share preview.
                 title: message
              },
            },
            { // For using custom icon instead of default text icon at share preview when sharing with message.
              placeholderItem: {
                type: 'url',
                content: icon
              },
              item: {
                default: {
                  type: 'text',
                  content: ``
                },
              },
              linkMetadata: {
                 title: title,
                 icon: icon
              }
            },
          ],
        },
        default: {
          title,
          subject: title,
          message: `${message} ${url}`,
        },
      });

      Share.open(options);
    }

	function shareBook(key){
      if(!key || !rootUser){ return; }
      const url = 'https://newt.to/'+key._id.replace(/:book:/g,'/');
      const title = key.title + ' it\'s available to read on Bao';
      const message = rootUser.name+' sent you this book through Newt.' ;
      const icon = 'https://tias.xyz/assets/newt.ico';
      const options = Platform.select({
        ios: {
          activityItemSources: [
            { // For sharing url with custom title.
              placeholderItem: { type: 'url', content: url },
              item: {
                default: { type: 'url', content: url },
              },
              subject: {
                default: title,
              },
              linkMetadata: { originalUrl: url, url, title },
            },
            { // For sharing text.
              placeholderItem: { type: 'text', content: message },
              item: {
                default: { type: 'text', content: message },
                message: null, // Specify no text to share via Messages app.
              },
              linkMetadata: { // For showing app icon on share preview.
                 title: message
              },
            },
            { // For using custom icon instead of default text icon at share preview when sharing with message.
              placeholderItem: {
                type: 'url',
                content: icon
              },
              item: {
                default: {
                  type: 'text',
                  content: ``
                },
              },
              linkMetadata: {
                 title: title,
                 icon: icon
              }
            },
          ],
        },
        default: {
          title,
          subject: title,
          message: `${message} ${url}`,
        },
      });

      Share.open(options);
    }
    function shareProfile(key){
      if(!key || !rootUser){ return; }
      const url = 'https://newt.to/'+key.name;
      const title = key.name + '\'s on Bao';
      const message = 'Follow '+rootUser.name+' food updates.' ;
      const icon = key.avatar || '';
      const options = Platform.select({
        ios: {
          activityItemSources: [
            { // For sharing url with custom title.
              placeholderItem: { type: 'url', content: url },
              item: {
                default: { type: 'url', content: url },
              },
              subject: {
                default: title,
              },
              linkMetadata: { originalUrl: url, url, title },
            },
            { // For sharing text.
              placeholderItem: { type: 'text', content: message },
              item: {
                default: { type: 'text', content: message },
                message: null, // Specify no text to share via Messages app.
              },
              linkMetadata: { // For showing app icon on share preview.
                 title: message
              },
            },
            { // For using custom icon instead of default text icon at share preview when sharing with message.
              placeholderItem: {
                type: 'url',
                content: icon
              },
              item: {
                default: {
                  type: 'text',
                  content: ``
                },
              },
              linkMetadata: {
                 title: title,
                 icon: icon
              }
            },
          ],
        },
        default: {
          title,
          subject: title,
          message: `${message} ${url}`,
        },
      });

      Share.open(options);
    }
    async function $onCreateWork(title){
			if(title == ''){ return; }
		    let d = await(ClouchDB.Books().createOne(title));
		                         // console.log("nuevo book!!", d)
		                          setModalOpen(false);
		                          setValueCreate('');
		    return true;
	}
	function $doUpdate(){
		//console.log("do update@!", version)
		Linking.openURL(version.storeUrl);
	}
	function _renderModal(){
		if(modalSection == 'session' && rootUser){
			return (
					<View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  borderBottomWidth: 2, borderColor: '#eaeaea', padding: 4}}>
							<Text style={{fontSize: 20, color: '#000', fontWeight: '500',marginLeft: 5}}>Refresh Session</Text>
							<IconButton
							    icon="chevron-down"
							    color={'#000'}
							    size={20}
							    onPress={() => setModalOpen(false)}
							  />
						</View>
							<TextInput placeholder="Username" style={[styles.input, { color: '#999', backgroundColor: '#aaaaaa' }]} disabled={true} value={rootUser.name}/>
							<TextInput placeholder="Password" secureTextEntry={true} type={'password'} style={[styles.input, { backgroundColor: '#eaeaea', color: '#000' }]} value={refreshPassword} onChangeText={(e) => setRefreshPassword(e)}/>

							<Button
								mode="contained"
								onPress={() => $doRefreshSession()}
								style={{margin: 15,backgroundColor: '#2575ed'}}
							>
								Proceed
						   </Button>

						   {
					          refreshError != null && <Alert severity="error">{refreshError}</Alert>
					        }
					</View>
				)
		}
		if(modalSection == 'address' && rootUser){
			//console.log("CONTEXT COLLECTIONS!", collections)
			return (
					<View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  borderBottomWidth: 2, borderColor: '#eaeaea', padding: 4}}>
							<Text style={{fontSize: 20, color: '#000', fontWeight: '500',marginLeft: 5}}>Direcciones</Text>
							<IconButton
							    icon="chevron-down"
							    color={'#000'}
							    size={20}
							    onPress={() => setModalOpen(false)}
							  />
						</View>
						<View style={{width: '100%'}}>
						
							{
								addresses == null && <Text style={{padding: 10, textAlign: 'center', fontSize: 22, fontWeight: '500', color: '#000'}}>{Languages.loading[getLang()]}</Text>
							}
							{
								bookCollection && addresses && addresses.rows &&
								<FlatList
			                         data={addresses.rows}
			                         //horizontal={true}
			                         ListEmptyComponent={() => <Text style={{padding: 10, textAlign: 'center', fontSize: 22, fontWeight: '500', color: '#000'}}>{Languages.homeNoCollectionsTitle[getLang()]} {"\n"} {Languages.createOneBelow[getLang()]}</Text>}
			                         style={{}}
			                         renderItem={({ item, index }) => <TouchableRipple onPress={() => $addBookToCollection(item, bookCollection)} rippleColor="rgba(0, 0, 0, .32)">
																		<View style={{flexDirection: 'row', padding: 7, display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
																		<Text style={{color: '#000', fontSize:19, marginLeft: 5}}>{item.street}</Text>
																		<IconButton
																		    icon={item.selected ? 'check' : 'plus'}
																		    color={item.selected ? '#2575ed' : '#222'}
																		    size={20}
																		    animated={true}
																		    //onPress={() => console.log('Pressed')}
																		  />
																		</View>
																	</TouchableRipple>}
			                         keyExtractor={(item, index) => index +'-'+item._id}
			                      />
							}
							
						</View>


						<View>
							<TextInput
								style={[styles.input, { backgroundColor: '#eaeaea' }]}
								placeholder={"Direccion actual"}
								value={valueCreate}
								onChangeText={(e) => setValueCreate(e)}
							/>
						    <AwesomeButton
		                        progress
		                        onPress={async(next) => {
		                          //console.log("on create collection!", valueCreate)
		                          if(valueCreate == ''){ return; }
		                          
		                          next()
		                        }}
		                        style={{margin: 5,position:'absolute',right:5}}
		                        width={50}
		                        height={50}
		                        raiseLevel={0}
		                        borderRadius={30}
		                        borderColor={'#111'}
		                        delayPressIn={0}
		                        delayPressOut={0}
		                        borderWidth={1}
		                        textSize={17}
		                        backgroundColor={'#000'}
		                        backgroundProgress={'#333'}
		                      >
				                    <Icon name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
				            </AwesomeButton>	
					    </View>
					</View>
				)
		}
		if(modalSection == 'collections' && rootUser){
			//console.log("CONTEXT COLLECTIONS!", collections)
			return (
					<View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  borderBottomWidth: 2, borderColor: '#eaeaea', padding: 4}}>
							<Text style={{fontSize: 20, color: '#000', fontWeight: '500',marginLeft: 5}}>{Languages.addTo[getLang()]} {Languages.collection[getLang()]}</Text>
							<IconButton
							    icon="chevron-down"
							    color={'#000'}
							    size={20}
							    onPress={() => setModalOpen(false)}
							  />
						</View>
						{ bookCollection && 
							<View style={{flexDirection: 'row', marginTop:3, display:'flex', justifyContent: 'center'}}>
								<Text>{bookCollection.title}</Text>
							</View>}

						<View style={{width: '100%'}}>
						
							{
								bookCollection && collections == null && <Text style={{padding: 10, textAlign: 'center', fontSize: 22, fontWeight: '500', color: '#000'}}>{Languages.loading[getLang()]}</Text>
							}
							{
								bookCollection && collections && collections.rows &&
								<FlatList
			                         data={collections.rows}
			                         //horizontal={true}
			                         ListEmptyComponent={() => <Text style={{padding: 10, textAlign: 'center', fontSize: 22, fontWeight: '500', color: '#000'}}>{Languages.homeNoCollectionsTitle[getLang()]} {"\n"} {Languages.createOneBelow[getLang()]}</Text>}
			                         style={{}}
			                         renderItem={({ item, index }) => <TouchableRipple onPress={() => $addBookToCollection(item, bookCollection)} rippleColor="rgba(0, 0, 0, .32)">
																		<View style={{flexDirection: 'row', padding: 7, display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
																		<Text style={{color: '#000', fontSize:19, marginLeft: 5}}>{item.title}</Text>
																		<IconButton
																		    icon={item.books && bookCollection && item.books.includes(bookCollection._id) ? 'check' : 'plus'}
																		    color={item.books && bookCollection && item.books.includes(bookCollection._id) ? '#2575ed' : '#222'}
																		    size={20}
																		    animated={true}
																		    //onPress={() => console.log('Pressed')}
																		  />
																		</View>
																	</TouchableRipple>}
			                         keyExtractor={(item, index) => index +'-'+item._id}
			                      />
							}
							
						</View>


						<View>
							<TextInput
								style={[styles.input, { backgroundColor: '#eaeaea' }]}
								placeholder={Languages.Name[getLang()]}
								value={valueCreate}
								onChangeText={(e) => setValueCreate(e)}
							/>
						    <AwesomeButton
		                        progress
		                        onPress={async(next) => {
		                          //console.log("on create collection!", valueCreate)
		                          if(valueCreate == ''){ return; }
		                          let nc = $onCreateCollection(valueCreate, bookCollection);
		                          setValueCreate('');
		                          next()
		                        }}
		                        style={{margin: 5,position:'absolute',right:5}}
		                        width={50}
		                        height={50}
		                        raiseLevel={0}
		                        borderRadius={30}
		                        borderColor={'#111'}
		                        delayPressIn={0}
		                        delayPressOut={0}
		                        borderWidth={1}
		                        textSize={17}
		                        backgroundColor={'#000'}
		                        backgroundProgress={'#333'}
		                      >
				                    <Icon name={'arrow-right'} size={30} style={{paddingTop:2,color: '#fff'}} />
				            </AwesomeButton>	
					    </View>
					</View>
				)
		}
		if(modalSection == 'newbook' && rootUser){
			return (
					<View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  borderBottomWidth: 2, borderColor: '#eaeaea', padding: 4}}>
							<Text style={{fontSize: 20, color: '#000', fontWeight: '500',marginLeft: 5}}>Create a Story</Text>
							<IconButton
							    icon="chevron-down"
							    color={'#000'}
							    size={20}
							    onPress={() => setModalOpen(false)}
							  />
						</View>
						


						<View>
							<TextInput
								style={[styles.input, { backgroundColor: '#eaeaea' }]}
								placeholder={'Name'}
								value={valueCreate}
								onChangeText={(e) => setValueCreate(e)}
							/>
						    <AwesomeButton
		                        progress
		                        onPress={async(next) => {
		                          //console.log("on create book!", valueCreate)
		                          $onCreateWork(valueCreate);
		                          next()
		                        }}
		                        style={{margin: 5,position:'absolute',right:5}}
		                        width={50}
		                        height={50}
		                        raiseLevel={0}
		                        borderRadius={30}
		                        borderColor={'#111'}
		                        delayPressIn={0}
		                        delayPressOut={0}
		                        borderWidth={1}
		                        textSize={17}
		                        backgroundColor={'#000'}
		                        backgroundProgress={'#333'}
		                      >
				                    <Icon name={'plus'} size={30} style={{paddingTop:2,color: '#fff'}} />
				            </AwesomeButton>	
					    </View>
					</View>
				)
		}
		
		if(modalSection == 'update' && rootUser){
			return (
					<View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  borderBottomWidth: 2, borderColor: '#eaeaea', padding: 4}}>
							<Text style={{fontSize: 20, color: '#000', fontWeight: '500',marginLeft: 5}}>{Languages.updateModalTitle[getLang()]}</Text>
							<IconButton
							    icon="chevron-down"
							    color={'#000'}
							    size={20}
							    onPress={() => setModalOpen(false)}
							  />
						</View>
						<View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
							<Logo width={200} style={{marginTop: 20}}/>
							<Text style={{textAlign: 'center', fontSize: 22, color: '#000'}}>{Languages.updateModalContent[getLang()]}</Text>
							<Button
								mode="contained"
								onPress={() => $doUpdate()}
								style={{margin: 15,backgroundColor: '#2575ed'}}
							>
								{Languages.update[getLang()]}
						   </Button>
						   {
						   	version && version.currentVersion && version.latestVersion && <Text style={{}}>v{version.currentVersion}</Text> 
						   }
						</View>
						
					</View>
				)
		}
		return (<></>)
	}

	return (
		<Newt.Provider value={{
				notifications: notifications,
				collections: collections,
				following: following,
				liked: liked,
                rootUser: rootUser,
                doLike: (id) => $doLike(id),
                shareProfile: (id) => shareProfile(id),
                shareBook: (id) => shareBook(id),
                addBookToCollection: (collection, book) => $addBookToCollection(collection, book),
                createCollection: (t, b) => $onCreateCollection(t, b),
                removeCollection: (c) => $onRemoveCollection(c),
                editCollection: (n_c) => $onEditCollection(n_c),
                checkSession: () => $checkSession(),
                triggerAction: (a) => $triggerAction(a),
                updateRootUser: (u) => $updateRootUser(u),
                updateLocalRootUser: (u) => $updateLocalRootUser(u),
                signOut: () => $onSignOut(),
                openAddToCollection: (b) => $openAddToCollection(b),
                openCreateStory: () => $openCreateStory(),
                askPermissions: () => $askPermissions(),
                isAdmin: isAdmin,
                isPremium: isPremium,
                auth: auth,
                ready: ready,
                net: netStatus,
                version: version,
                appSettings: appSettings,

                accountType: accountType,
                setAccountType: (t) => setAccountType(t),

                openAddressSelector: () => $openAddressSelector()
            }}>
                {children}
            <Modal 
                  style={[styles.sessionContainer, {width:ancho,margin:0, marginTop:getHeaderHeight()}]}
                  isVisible={Boolean(modalOpen)}
                  animationIn={'fadeIn'}
                  animationOut={'fadeOut'}
                  hasBackdrop={true}
                 // avoidKeyboard={true}
                 //propagateSwipe={false}
                  deviceWidth={ancho}
                  onSwipeComplete={() => setModalOpen(false)}
                  swipeDirection="down"
                  swipeThreshold={10}
                  deviceHeight={deviceHeight}
                  //propagateSwipe
                  >
                  <View style={styles.modalView}>
             		 {_renderModal()}
              	  </View>
            </Modal>
        </Newt.Provider>
      )
}

export const ClouchProvider = ({children}) => {
	return (
		<Clouch.Provider value={WrapperAPI}>
                {children}
        </Clouch.Provider>
      )
}

const styles = StyleSheet.create({
  sessionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalView: {
  	backgroundColor: '#fff',
  	flex: 1,
  	width: '100%',
  	borderTopLeftRadius:8,
  	borderTopRightRadius: 8
  },
  input: {
      margin: 0,
      height: 60,
      borderColor: 'rgba(255,255,255,.1)',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderWidth: 1,
      width: '100%',
      padding: 10,
      borderRadius: 0,
      fontSize: 20
   },
}); 
