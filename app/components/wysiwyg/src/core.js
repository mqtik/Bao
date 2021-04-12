import React, {Component, PureComponent} from 'react';
import { Dimensions,StyleSheet, View, Text,TextInput, TouchableOpacity, Platform } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
// Dependences
import shortid from 'shortid';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
  renderers
} from 'react-native-popup-menu';
import 'react-native-get-random-values'
import { nanoid } from "nanoid";
import Modal from "react-native-modal";
import { KeyboardAwareFlatList } from './lib'
import { KeyboardAwareScrollView } from './lib'
import update from 'immutability-helper'
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import AwesomeButton from "react-native-really-awesome-button";
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';
import LinearGradient from 'react-native-linear-gradient';
import { material } from 'react-native-typography'
import { Button, IconButton } from 'react-native-paper';
// Editor Components
import Embed from './components/embed';
import Code from './components/code';
import Delimiter from './components/delimiter';
import Header from './components/header';
import Img from './components/img';
import InlineCode from './components/inlineCode';
import LinkTool from './components/linktool';
import List from './components/list';
import Marker from './components/marker';
import CheckList from './components/checkList';
import Paragraph from './components/paragraph';
import Quote from './components/quote';
import Raw from './components/raw';
import SimpleImage from './components/simpleImage';
import Table from './components/table';
import Warning from './components/warning';
import { NoContent } from './components/helpers/vectors';
import isEqual from 'react-fast-compare';
const Image = createImageProgress(FastImage);
const { Popover, SlideIn } = renderers;
export const EditorTools = {
  logLevel: 'ERROR',
  embed: {
      class: Embed,
      inlineToolbar: true,
      config: {
        services: {
          youtube: true,
          coub: true
        }
      }
  },
  table: {
    inlineToolbar: true,
    class:Table
  },
  paragraph: {
    class:Paragraph,
    config: {
        placeholder: 'Tell your story...'
      },
    placeholder: 'Tell your story...',
    inlineToolbar: true
  },
  list: {
    class: List,
    inlineToolbar: true
  },
  warning: {
    inlineToolbar: true,
    class:Warning
  },
  code: {
    class:Code,
    inlineToolbar: true
  },
  linkTool: {
    class:LinkTool,
    inlineToolbar: true,
    config: { 
        endpoint: 'https://newt.keetup.com/api/creators/scraplink', // Your backend endpoint for url data fetching
      }
  },
  image: {
    class: Img,
    inlineToolbar: true,
    config: {
      uploader: {
        
        }
      }
  },
  raw: {
    inlineToolbar: true,
    class:Raw
  },
  header: {
    class: Header,
    inlineToolbar: true
  },
  quote: {
    class:Quote,
    inlineToolbar: true
  },
  marker: {
    class:Marker,
    inlineToolbar: true
  },
  checklist: {
    class:CheckList,
    inlineToolbar: true
  },
  delimiter: {
    inlineToolbar: true,
    class:Delimiter
  },
  inlineCode: {
    class:InlineCode,
    inlineToolbar: true
  },
  simpleImage: {
    inlineToolbar: true,
    class:SimpleImage
  }
}


const optionsImgPkr = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      allowsEditing: true,
        aspect: [4, 4],
        base64: false,
      storageOptions: {
        skipBackup: true,
      },
    };

export default class Wysiwyg extends PureComponent {

    constructor(props) {
        super(props);
        this.isInit = false;
        this.state = {
            initial: props.initialBlocks || {blocks: []},
            focus: null,
            modalVisible:false,
            urlModalText: null,
            header: props.header
          };
        
          //console.log("WYSIWYG CONSTRUCTOR!!!",this.state)
    }
    static getDerivedStateFromProps(props, state) {
     // console.log("get new props COREJS", props, state)
        if (props.initialBlocks && state.initial == null && !isEqual(props.initialBlocks, state.initial)) {
           // console.log("get dervieed!", props.initialBlocks)
          return {
            initial: props.initialBlocks
          };
        }

        // Return null to indicate no change to state.
        return null;
    }
 
    componentDidMount() {
      if(typeof this.state.initialBlocks === 'undefined' && this.state.initialBlocks && this.state.initialBlocks.blocks){
        this.state.initial = {
          blocks: []
        };
       }
    }
  _renderBlocks = (blocks) => {
    if(!blocks){
        return;
    }
    return 

  }

  
  focusBlock = (index) => {
    this.setState({
        focus: index
    })
  }

  onChange = () => {
    //console.log("fire on change!", this.state.initial)
    if(this.props.onChangeBlocks && this.state.initial.blocks && this.state.initial.blocks.length > -1){
      //console.log("this props afte rchange", this.state.initial)
      this.props.onChangeBlocks(this.state.initial.blocks);
      //console.log('this state initial', this.state.initial)
    }
  }
  askPermissions = async() => {
    let ca = await Permissions.request('camera', {
          rationale: {
            title: 'Newt Camera Permission',
            message:
              'Newt needs access to your camera ' +
              'so you can take awesome pictures.',
          },
        });
    let ph = await Permissions.request('camera', {
          rationale: {
            title: 'Newt Camera Permission',
            message:
              'Newt needs access to your camera ' +
              'so you can take awesome pictures.',
          },
        });

    let ch = await Permissions.checkMultiple(['camera', 'photo']);
    this.setState({
          hasCameraPermission: ch.camera,
          hasCameraRollPermission: ch.photo,
        });

    return true;
  }
  addImageHeader = async() => {
    let per = await this.askPermissions();
    if(per != true){
      return;
    }
    let response = await ImagePicker.launchImageLibrary(optionsImgPkr, async(response) => {
            let params = {
              type: response.type,
              name: response.fileName,
              size: response.fileSize,
              data: response.data,
              uri: response.uri
            };
          //console.log("props screenprops!", params)

            //Snackbar.show({ title: 'Uploading image to the cloud', duration: Snackbar.LENGTH_LONG })
            params = JSON.stringify(params);


          let iUrl = await this.props.addHeader(params);


              //return url;

              


                this.setState((prevState) => update(prevState, { 
                                  header: { 
                                    $set: iUrl
                                  },
                            }),() => this.onChange());

          })
  }

  removeHeader = () => {
    this.setState((prevState) => update(prevState, { 
                                  header: { 
                                    $set: null
                                  },
                            }),() => this.onChange());
    if(this.props.removeHeader){
      this.props.removeHeader()
    }
  }

  uploadImage = async(index) => {
    let per = await this.askPermissions();

    
          let response = await ImagePicker.launchImageLibrary(optionsImgPkr, async(response) => {
          let params = {
              type: response.type,
              name: response.fileName,
              size: response.fileSize,
              data: response.data,
              uri: response.uri
            };
          let iUrl = await this.props.uploadImage(params);
          if(!iUrl){
            return;
          }
          let block = {
                    "id": nanoid(),
                    "type" : "image",
                    "data" : {
                              "file" : {
                                url: iUrl 
                              },
                              "caption" : "",
                              stretched: true,
                              withBackground: false,
                              withBorder: false
                          }
                  }
               
              index = index + 1;
               if(block != null && iUrl != false){

                this.setState((prevState) => update(prevState, { 
                                  initial: { 
                                    blocks: {
                                        $splice: [[index, 0, block]]
                                    }
                                  },
                                  focus: {
                                     $set: index
                                  },
                            }),() => this.onChange());

               }
            
          })


   

  }
  onChangeTextBlock = (text,index) => {



        this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [index]: {
                                data: {
                                    text: {
                                        $set: text
                                    }
                                }
                            }
                        }
                    }
                }),() => this.onChange());
  }

  onChangeTextBlockInputs = (text,index,type) => {



    if(type == 'caption'){
      this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [index]: {
                                data: {
                                    caption: {
                                        $set: text
                                    }
                                }
                            }
                        }
                    }
                }),() => this.onChange());
    } else if(type == 'text') {
      this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [index]: {
                                data: {
                                    text: {
                                        $set: text
                                    }
                                }
                            }
                        }
                    }
                }),() => this.onChange());
    } else if(type == 'message') {
      this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [index]: {
                                data: {
                                    message: {
                                        $set: text
                                    }
                                }
                            }
                        }
                    }
                }),() => this.onChange());
    } else if(type == 'title') {
      this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [index]: {
                                data: {
                                    title: {
                                        $set: text
                                    }
                                }
                            }
                        }
                    }
                }),() => this.onChange());
    }

        
  }


  onChangeTextBlockHeader = (text,index) => {
    //console.log("on changetextblock!", this.state.initial.blocks[index])



        this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [index]: {
                                data: {
                                    text: {
                                        $set: text
                                    }
                                }
                            }
                        }
                    }
                }),() => this.onChange());
  }

  onChangeTextBlockList = (text,indexList,indexBlock) => {




        this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [indexBlock]: {
                                data: {
                                    items: {
                                        [indexList]: {
                                            $set: text
                                        }
                                    }
                                }
                            }
                        }
                    }
                }),() => this.onChange());
  }


  createListOnIndex = (indexBlock, indexList) => {

    //let ite = this.state.initial.blocks[indexBlock].data.items.splice( indexList + 1, 0, ['Text'])

    // this.setState((prevState) => update(prevState, { 
    //                   initial: { 
    //                     blocks: {
    //                         [indexBlock]: {
    //                             data: {
    //                                 items: {
    //                                     $set: ite
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             })); 

    let t = '';
     this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [indexBlock]: {
                                data: {
                                    items:{
                                        $splice: [[indexList + 1, 0, t]]
                                    }
                                }
                            }
                            
                        }
                    }
                }),() => this.onChange());
  }

  removeListOnIndex = (indexBlock, indexList) => {


    // this.setState((prevState) => update(prevState, { 
    //                   initial: { 
    //                     blocks: {
    //                         [indexBlock]: {
    //                             data: {
    //                                 items: {
    //                                     $set: ite
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             })); 

     this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            [indexBlock]: {
                                data: {
                                    items:{
                                        $splice: [[indexList, 1]]
                                    }
                                }
                            }
                            
                        }
                    }
                }),() => this.onChange());
  }

  createParagraphOnIndex = async(index) => {

    let p = {
        type: 'paragraph',
        id: nanoid(),
        data: {
            text: ''
        }
    };

    // if(this.state.initial == null || !this.state.initial.blocks){
    //   this.state.initial.blocks = [];
    // }
    index = index + 1;

    // let nb = update(this.state.initial.blocks, { 
    //                   initial: { 
    //                     blocks: {
    //                         $splice: [[index, 0, p]]
    //                     }
    //                   }
    //             });
    // console.log("nb!!", nb)
    //this.state.initial.blocks.splice( index + 1, 0, p);
    
    this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                            $splice: [[index, 0, p]]
                        }
                      },
                      focus: {
                         $set: index
                      }
                }), () => this.onChange());
    // this.setState((prevState) => update(prevState, { 
    //                 focus: {
    //                    $set: index
    //                 },
    //             }));

    //this.state.initial.blocks = insert(this.state.initial.blocks, index, p);

  }

  removeBlockOnIndex = async(index) => {

   // this.state.initial.blocks = this.state.initial.blocks.splice(index, 0);
   let nb = update(this.state.initial, { 
                        blocks: {
                            $splice: [[index, 1]]
                        }
                });
    this.setState((prevState) => update(prevState, { 
                      initial: { 
                        $set: nb
                      }
                }),() => this.onChange());
    
    //this.state.initial.blocks = insert(this.state.initial.blocks, index, p);
  }

  moveArray = (arr, old_index, new_index) => {
    // if (new_index >= arr.length) {
    //     var k = new_index - arr.length + 1;
    //     while (k--) {
    //        // arr.push(undefined);
    //     }
    // }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };


  onMove = async(index, direction) => {
    if(index == 0 && direction == 'up'){
      return;
    }
    let newIndex = direction == 'up' ? (index - 1) : (index + 1);
    let nA = await this.moveArray(this.state.initial.blocks, index, newIndex)
    return this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                          $set: nA
                        }
                      }
                }),() => this.onChange());
  }

  newBlock = (type, index) => {

    let block = null;
    if(type == 'paragraph'){
       block = {
          id: nanoid(),
          type: 'paragraph',
          autoFocus: true,
          data: {
              text: ''
          }
      };
    }

    if(type == 'header'){
      block = {
            "type" : "header",
            id: nanoid(),
            "data" : {
                "text" : "",
                "level" : 1
            }
        }
    }

    if(type == 'list'){
      block = {
            "type" : "list",
            id: nanoid(),
             "data" : {
                "style" : "unordered",
                "items" : [
                    ""
                ]
            }
        }
    }

    if(type == 'delimiter'){
      block = {
            id: nanoid(),
            "type" : "delimiter",
             "data" : {}
        }
    }


    if(type == 'quote'){
      block = {
        "type" : "quote",
        id: nanoid(),
              "data" : {
                  "text" : "",
                  "caption" : "",
                  "alignment" : "left"
              }
      }
    }
    if(type == 'warning'){
      block = {
        "type" : "warning",
        id: nanoid(),
              "data" : {
                  "text" : "",
                  "caption" : "",
                  "alignment" : "left"
              }
      }
    }
   

  // if(this.state.initial == null || !this.state.initial.blocks){
  //   this.state.initial.blocks = [];
  // }

  if(!this.state.initial || !this.state.initial.blocks){
    this.state.initial.blocks = [];
  }
  index = index + 1;
   if(block != null){
    let nb = update(this.state.initial, { 
                        blocks: {
                            $splice: [[index, 0, block]]
                        }
                });

    this.setState((prevState) => update(prevState, { 
                      initial: { 
                        $set: nb
                      },
                      focus: {
                         $set: index
                      },
                }),() => this.onChange());
   }
  }

  addImage = (index) => {
    //console.log("add image!!", index)
  }

  checkAddLink = async() => {
    let url = this.state.urlModalText;

    let retUrl = await this.props.addLink(url);


    if(retUrl && retUrl.success && retUrl.success == 1){
      let block = {
                    "type" : "linkTool",
                    "id": nanoid(),
                          "data" : {
                              link: url,
                              meta: retUrl.meta
                          }
                  }
      let index = (this.state.focus + 1);

      if(!index){
        index = 0;
      }
      this.setState((prevState) => update(prevState, { 
                                  initial: { 
                                    blocks: {
                                        $splice: [[index, 0, block]]
                                    }
                                  },
                                  focus: {
                                     $set: index
                                  },
                            }),() => this.onChange());
    }
    this.setState({modalVisible:false});
    return;
    
  }
  addLink = async(index) => {


    this.setState((prevState) => update(prevState, { 
                                  modalVisible: {
                                    $set: true
                                  }
                            }));
    return;
    let iUrl = await this.props.addLink(params);




              //return url;

               let block = {
                    "type" : "linkTool",
                          "data" : {
                              "file" : {
                                url: iUrl 
                              },
                              "caption" : "",
                              stretched: true,
                              withBackground: false,
                              withBorder: false
                          }
                  }
               
              index = index + 1;
               if(block != null && iUrl != false){

                // this.setState((prevState) => update(prevState, { 
                //                   initial: { 
                //                     blocks: {
                //                         $splice: [[index, 0, block]]
                //                     }
                //                   },
                //                   focus: {
                //                      $set: index
                //                   },
                //             }));
               }
 
  }

  convertTo = (type, index, block, to) => {
    if(type == 'header'){
      this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                          [index]: {
                            data: {
                              level: {
                                $set: to
                              }
                            }
                          }
                        }
                      },
                      focus: {
                         $set: index
                      },
                }),() => this.onChange());
    }
    if(type == 'list'){
      this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                          [index]: {
                            data: {
                              style: {
                                $set: block.data.style == 'ordered' ? 'unordered' : 'ordered'
                              }
                            }
                          }
                        }
                      },
                      focus: {
                         $set: index
                      },
                }),() => this.onChange());
    }
    if(type == 'image'){
      if(to == 'stretch'){
        this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                          [index]: {
                            data: {
                              stretched: {
                                $set: block.data.stretched == true ? false : true
                              }
                            }
                          }
                        }
                      },
                      focus: {
                         $set: index
                      },
                }),() => this.onChange());
      }
      if(to == 'background'){
        this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                          [index]: {
                            data: {
                              withBackground: {
                                $set: block.data.withBackground == true ? false : true
                              }
                            }
                          }
                        }
                      },
                      focus: {
                         $set: index
                      },
                }),() => this.onChange());
      }
      if(to == 'border'){
        this.setState((prevState) => update(prevState, { 
                      initial: { 
                        blocks: {
                          [index]: {
                            data: {
                              withBorder: {
                                $set: block.data.withBorder == true ? false : true
                              }
                            }
                          }
                        }
                      },
                      focus: {
                         $set: index
                      },
                }),() => this.onChange());
      }
    }
  }

  _settingsBlock = (type, index, block) => {
   // console.log("settings block!", type, block)
    return (
        <View style={{position: 'absolute', right:2,top:3,zIndex:99,backgroundColor: this.context == 'dark' ? '#fff' : 'transparent',borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
        <Menu ref={r => (this.menu = r)} renderer={Popover} rendererProps={{ preferredPlacement: 'left', anchorStyle: {backgroundColor: '#fff'} }} style={{backgroundColor: 'transparent', borderRadius: 8}}>
                <MenuTrigger style={{width:40, height:40, display:'flex', justifyContent: 'center'}}>
                        <EntypoIcono name="dots-two-vertical" style={{color: this.props.readingTheme == 'dark' ? '#fff' : '#000', fontSize: 30, textAlign: 'right', alignSelf: 'center'}} />
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={{
                    paddingBottom: 5,
                    paddingLeft: 5,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                  }}
                  >

                  
                  { type == 'image' && 
                  <View>
                    <MenuOption onSelect={() => this.convertTo(type, index, block, 'stretch')} >
                      <Text style={{color: '#000', fontSize: 18}}>Stretch</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => this.convertTo(type, index, block, 'background')} >
                      <Text style={{color: '#000', fontSize: 18}}>Background</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => this.convertTo(type, index, block, 'border')} >
                      <Text style={{color: '#000', fontSize: 18}}>Border</Text>
                    </MenuOption>
                    </View>
                  }
                  { type == 'header' &&
                    <View> 
                    <View style={{width: 120, flexDirection: 'row', justifyContent: 'center'}}>
                      <TouchableOpacity 
                      style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                      onPress={() => this.convertTo(type, index, block, 1)}>
                      
                          <MaterialCommunityIcons
                                name="format-header-1"
                                size={18}
                                color={block.data.level == 1 ? "#fff" : "#999"}
                              />
 
                      </TouchableOpacity>
                      <TouchableOpacity 
                      style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                      onPress={() => this.convertTo(type, index, block, 2)}>
                      
                          <MaterialCommunityIcons
                                name="format-header-2"
                                size={18}
                                color={block.data.level == 2 ? "#fff" : "#999"}
                              />

                      </TouchableOpacity>
                      <TouchableOpacity 
                      style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                      onPress={() => this.convertTo(type, index, block, 3)}>
                      
                          <MaterialCommunityIcons
                                name="format-header-3"
                                size={18}
                                color={block.data.level == 3 ? "#fff" : "#999"}
                              />

                      </TouchableOpacity>
                  </View>
                  <View style={{width: 120, flexDirection: 'row', justifyContent: 'center'}}>
                      <TouchableOpacity 
                        style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                        onPress={() => this.convertTo(type, index, block, 4)}>
                        
                            <MaterialCommunityIcons
                                  name="format-header-4"
                                  size={18}
                                  color={block.data.level == 4 ? "#fff" : "#999"}
                                />

                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                        onPress={() => this.convertTo(type, index, block, 5)}>
                        
                            <MaterialCommunityIcons
                                  name="format-header-5"
                                  size={18}
                                  color={block.data.level == 5 ? "#fff" : "#999"}
                                />

                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                        onPress={() => this.convertTo(type, index, block, 6)}>
                        
                            <MaterialCommunityIcons
                                  name="format-header-6"
                                  size={18}
                                  color={block.data.level == 6 ? "#fff" : "#999"}
                                />

                        </TouchableOpacity>
                  </View>
                  </View>
                  }

                  { type == 'list' && 
                    <View style={{width: 120, flexDirection: 'row', justifyContent: 'center'}}>
                      <MenuOption onSelect={() => this.convertTo(type, index, block)} >
                        <Text style={{color: '#000', fontSize: 18}}>{block.data.style == 'ordered' ? 'Unorder' : 'Order'}</Text>
                      </MenuOption>
                    </View>
                  }
                  



                  <View style={{width: 120, flexDirection: 'row', justifyContent: 'center'}}>
                    
                    {
                      index > 0 && <TouchableOpacity 
                        style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                        onPress={() => this.onMove(index, 'up')}>
                        
                            <EntypoIcono
                                  name="chevron-up"
                                  size={18}
                                  color="#000"
                                />

                        </TouchableOpacity>
                      }
                    <TouchableOpacity 
                    style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                    onPress={() => this.removeBlockOnIndex(index)}>
                    
                        <MaterialCommunityIcons
                              name="close"
                              size={18}
                              color="#ff7575"
                            />

                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={{ display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:7, marginRight:5,padding: 5,width: 35, height: 35, backgroundColor: this.context == 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.1)', borderRadius: 10, borderColor: 'rgba(0,0,0,.1)', borderWidth: 1, marginRight:5}} 
                    onPress={() => this.onMove(index, 'down')}>
                    
                        <EntypoIcono
                              name="chevron-down"
                              size={18}
                              color="#000"
                            />

                    </TouchableOpacity>
                  </View>


                </MenuOptions>
              </Menu>
            </View>
              )
  }


  _onRenderBlock = (block) => {

    return <Blocked blockOptions={this.props.blockOptions} block={block} {...this} {...this.state} fontSize={this.props.fontSize} readingTheme={this.props.readingTheme} editMode={this.props.editMode}/>
    //console.log("blockhere!", block)
    let index = block.index;
    let type = block.item.type;
    let blockData = block.item;
    let editMode = this.props.editMode ? true : false;

    let ren = null;
     if(type == 'paragraph'){
            ren = <EditorTools.paragraph.class 
                        isLast={(index+1) == this.state.initial.blocks.length ? true : false} 
                        removeBlockOnIndex={(index) => this.removeBlockOnIndex(index)} 
                        createParagraphOnIndex={(index) => this.createParagraphOnIndex(index)} 
                        index={block.index}
                        fontSize={this.props.fontSize}
                        isFocused={block.index == this.state.focus}
                        focusedIndex={this.state.focus} 
                        focusBlock={(index) => this.focusBlock(index)}
                        onChangeTextBlock={(text,index) => this.onChangeTextBlock(text,index)} 
                        item={blockData} 
                        readingTheme={this.props.readingTheme}
                        textAlign={this.props.textAlign}
                        editMode={editMode}/>
            }
            if(type == 'header'){
                    ren = <EditorTools.header.class 
                            index={block.index} 
                            item={blockData} 
                            fontSize={this.props.fontSize}
                            focusedIndex={this.state.focus} 
                            focusBlock={(index) => this.focusBlock(index)}
                            removeBlockOnIndex={(index) => this.removeBlockOnIndex(index)} 
                            createParagraphOnIndex={(index) => this.createParagraphOnIndex(index)}
                            onChangeTextBlockHeader={(text,indexList,indexBlock) => this.onChangeTextBlockHeader(text,indexList, indexBlock)} 
                            editMode={editMode}
                            readingTheme={this.props.readingTheme}
                            />
            }
            if(type == 'list'){
                   ren =  <EditorTools.list.class 
                            focusBlock={(index) => this.focusBlock(index)}
                            index={block.index} 
                            focusedIndex={this.state.focus}
                            fontSize={this.props.fontSize}
                            readingTheme={this.props.readingTheme}
                            removeListOnIndex={(indexList,indexBlock) => this.removeListOnIndex(indexList, indexBlock)}  
                            createListOnIndex={(indexList,indexBlock) => this.createListOnIndex(indexList, indexBlock)} 
                            onChangeTextBlockList={(text,indexList,indexBlock) => this.onChangeTextBlockList(text,indexList, indexBlock)} 
                            item={blockData}
                            createParagraphOnIndex={(index) => this.createParagraphOnIndex(index)}
                            editMode={editMode}
                            />
            }
            if(type == 'quote'){
                   ren =  <EditorTools.quote.class 
                            item={blockData} 
                            editMode={editMode}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.focusBlock(index)}
                            index={block.index} 
                            readingTheme={this.props.readingTheme}
                            focusedIndex={this.state.focus}
                            onChangeTextBlockInputs={(text,index,type) => this.onChangeTextBlockInputs(text,index,type)} 
                        />
            }
            if(type == 'warning'){
                   ren =  <EditorTools.warning.class 
                            item={blockData} 
                            editMode={editMode}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.focusBlock(index)}
                            index={block.index} 
                            readingTheme={this.props.readingTheme}
                            focusedIndex={this.state.focus} 
                            onChangeTextBlockInputs={(text,index,type) => this.onChangeTextBlockInputs(text,index,type)} 
                        />
            }
            if(type == 'delimiter'){
                   ren =  <EditorTools.delimiter.class 
                            item={blockData} 
                            editMode={editMode}
                            readingTheme={this.props.readingTheme}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.focusBlock(index)}
                            index={block.index} 
                            focusedIndex={this.state.focus} 
                        />
            }
            if(type == 'linkTool'){
                   ren =  <EditorTools.linkTool.class 
                            item={blockData} 
                            editMode={editMode}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.focusBlock(index)}
                            index={block.index} 
                            readingTheme={this.props.readingTheme}
                            focusedIndex={this.state.focus} 
                        />
            }
            if(type == 'image'){
                   ren =  <EditorTools.image.class 
                            item={blockData} 
                            editMode={editMode}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.focusBlock(index)}
                            index={block.index} 
                            readingTheme={this.props.readingTheme}
                            focusedIndex={this.state.focus} 
                            onChangeTextBlockInputs={(text,index,type) => this.onChangeTextBlockInputs(text,index,type)} 
                        />
            }
    return (
        <View 
            style={{backgroundColor: this.state.focus == index ? 'rgba(255,255,255,.05)' : 'transparent'}}
            //key={nanoid()}
            >
            {this.props.editMode == true && this.state.focus == index && this._settingsBlock(type, index, blockData)}
            {ren}
            {this.props.editMode == true && this.state.focus == index && 
                    <View>
                      {this._renderAddBlocks(index)}
                    </View>
                  }
            {this.props.editMode == false && this.state.focus == index && 
                    <View>
                      {this.props.blockOptions(block, index)}
                    </View>
                  }
            { (this.props.editMode == true && (index+1) == this.state.initial.blocks.length && this.state.focus == null) && this._renderAddBlocks(index)}
        </View>
        )
    
    return;
  }

  _renderTextAddBlock = (type) => {
    let i18n = this.props.i18n || {
      paragraph: 'Paragraph',
      headline: 'Headline',
      image: 'Image',
      list: 'Lista',
      quote: 'Quote',
       warning: 'Warning',
      delimiter: 'Delimiter',
      link: 'Link'
    }
    if(type == 'paragraph'){
      return i18n.paragraph;
    }
    if(type == 'headline'){
      return i18n.headline;
    }
    if(type == 'image'){
      return i18n.image;
    }
    if(type == 'list'){
      return i18n.list;
    }
    if(type == 'quote'){
      return i18n.quote;
    }
    if(type == 'warning'){
      return i18n.warning;
    }
    if(type == 'delimiter'){
      return i18n.delimiter;
    }
    if(type == 'link'){
      return i18n.link;
    }
  }

  _renderAddBlocks = (index) => {
    return (
        <ScrollView horizontal={true} contentContainerStyle={{height:50,backgroundColor:'transparent',flexDirection:'row',justifyContent: 'center', alignItems: 'center'}}>
            
        
            <IconButton
               icon="plus"
               color={'#2575ed'}
               style={{}}
              size={20}
              onPress={() => this.newBlock('paragraph', index)}
             />
            <Button onPress={() =>  this.newBlock('paragraph', index)} color={'#2575ed'} icon={"text"} mode="outlined" style={{margin: 5}}>
                {this._renderTextAddBlock('paragraph')}
            </Button>
            <Button onPress={() =>  this.newBlock('header', index)} color={'#2575ed'} icon={"format-header-1"} mode="outlined" style={{margin: 5}}>
                {this._renderTextAddBlock('headline')}
            </Button>
            <Button onPress={() =>  this.uploadImage(index)} color={'#2575ed'} icon={"image"} mode="outlined" style={{margin: 5}}>
                {this._renderTextAddBlock('image')}
            </Button>
            <Button onPress={() =>  this.newBlock('list', index)} color={'#2575ed'} icon={"format-list-bulleted"} mode="outlined" style={{margin: 5}}>
                {this._renderTextAddBlock('list')}
            </Button>
            <Button onPress={() =>  this.newBlock('quote', index)} color={'#2575ed'} icon={"comment-text"} mode="outlined" style={{margin: 5}}>
                {this._renderTextAddBlock('quote')}
            </Button>
            <Button onPress={() =>  this.newBlock('warning', index)} color={'#2575ed'} icon={"alert-outline"} mode="outlined" style={{margin: 5}}>
                {this._renderTextAddBlock('warning')}
            </Button>
            <Button onPress={() =>  this.newBlock('delimiter', index)} color={'#2575ed'} icon={"division"} mode="outlined" style={{margin: 5}}>
                {this._renderTextAddBlock('delimiter')}
            </Button>
            <Button onPress={() =>  this.addLink(index)} color={'#2575ed'} icon={"attachment"} mode="outlined" style={{margin: 5}}>
                {this._renderTextAddBlock('link')}
            </Button>
        </ScrollView>

        )
  }

  
  _renderEmpty = () => {
    return (
      <View style={{justifyContent:'center', alignItems: 'center'}}>
        <Text style={{fontSize: this.props.fontSize, color: this.props.readingTheme == 'dark' ? '#fff' : '#111'}}>This part has no content</Text>
        <NoContent />
      </View>
      )
  }




    render() {
       //console.log("[ON WYSIWYG]",this.props)
        const RootComponent = this.props.editMode ? KeyboardAwareFlatList : FlatList;
        return (

            <View 
                style={[styles.container, { 
                    backgroundColor: 'transparent'
                }]}
                {...this.props.viewProps}>
                <RootComponent
                   data={this.state.initial && this.state.initial.blocks && this.state.initial.blocks}
                   extraData={this.state.focus}
                   ref={(ref) => { this._wysiwyg = ref; }}
                   innerRef={ref => {
                      this.scroll = ref;
                    }}
                   initialNumToRender={7}
                   enableAutomaticScroll={this.props.editMode == true ? true : false}
                   maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={500}
                   //listKey={(item, index) => 'D' + nanoid()}
                   keyExtractor={(item, index) => { 
                     if(item.id){
                       return item.id.toString();
                     } else {

                       return (index).toString()
                     }
                   }}
                   ListEmptyComponent={this.props.editMode == true ? this._renderAddBlocks(0) : this._renderEmpty()}
                   
                   //getItemLayout={(data, index) => ({ length: this.state.initial.blocks.length, index })}
                    contentContainerStyle={{ paddingBottom: 100}}
                    keyboardShouldPersistTaps="handled"
                    // contentInset={{left: 0, right: 0}}
                    //contentInsetAdjustmentBehavior="automatic"
                   style={styles.scrollViewBooks}
                   onScroll={this.props.onScroll || null}
                   // innerRef={ref => {
                   //    this.scroll = ref;
                   //  }}  
                   renderItem={(item) => this._onRenderBlock(item)}
                   {...this.props}
                /> 
                <Modal
                  animationOut={'slideOutDown'}
                  style={{padding: 0, margin: 0, width: '100%'}}
                  animationIn={'slideInUp'}
                  transparent={true}
                  useNativeDriver={false}
                  isVisible={this.state.modalVisible}
                  hideModalContentWhileAnimating={true}
                  backdropOpacity={0.3}
                  avoidKeyboard={true}

                  hasBackdrop={true}
                  onSwipeComplete={() => this.setState({ modalVisible: false })}
                  swipeDirection="down"
                  swipeThreshold={90}
                  propagateSwipe={true} 
                >
                  
                   <View style={styles.centeredView}>
          <View style={[styles.modalView,{width: '100%', backgroundColor: this.context == 'dark' ? '#222' : '#fff' }]}>
            <Text style={styles.modalText}>Type or paste URL</Text>
            <TextInput 
                    style = {[styles.input, {flexGrow: 0, marginBottom: 10,backgroundColor: this.context == 'dark' ? '#111' : '#f4f4f0', borderRadius: 10, width: '100%', fontSize: this.props.fontSize}]}
                   underlineColorAndroid = "transparent"
                   secureTextEntry={false}
                   returnKeyType='next'
                   multiline = {false}
                   ref={input => { this._modalInput = input }}
                   //autoFocus={true}
                   autoCorrect={false}
                   placeholderTextColor={this.context == 'dark' ? "#d8d8d8" : "#dadada"}
                   autoCapitalize = "none"
                   placeholder={'https://'}
                   value={this.state.urlModalText}
                   //onFocus={(event) => this.onFocus(event)}
                   //onKeyPress={this.onKeyPress}
                   //onSubmitEditing={this.enterKey}
                   blurOnSubmit={true}
                   //value={this.props.item.data.text}
                   /*onContentSizeChange={(event) => {
                    console.log("size chage ",this.props)
                    if(this.props.refScroll != null && this.props.refScroll.props){
                        this.props.refScroll.props.scrollToFocusedInput(findNodeHandle(event.target));
                    }
                      }}*/
                  // onSubmitEditing={() => { this._onLogin() }}
                   onChangeText={(text) => this.setState((prevState) => update(prevState, { 
                                  urlModalText: {
                                    $set: text
                                  }
                            }))}
                />

            <View style={{flexDirection: 'row', display: 'flex', justifyContent: 'center'}}>
              <AwesomeButton
                        progress
                        onPress={async(next) => {
                          /** Do Something **/
                          let c = await this.checkAddLink()

                          next()
                        }}
                        style={{ ...styles.openButton, backgroundColor: "#2196F3",marginRight:10 }}
                        width={50}
                        height={38}
                        raiseLevel={0}
                        borderRadius={30}
                        borderColor={'transparent'}
                        
                        borderWidth={1}
                        textSize={17}
                        backgroundColor={'#2196F3'}
                        backgroundProgress={'#333'}
                      >
                      <Text style={styles.textStyle}>Add</Text>
            </AwesomeButton>

              
              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: "transparent" }}
                onPress={() => {
                  this.setState({modalVisible:false});
                }}
              >
                <Text style={[styles.textStyle, {color: '#000'}]}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
                </Modal>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        margin:0,
        padding:0
    },
    
    input: {
      height:50,
      padding:5,
      width:300
    },


    centeredView: {
      alignItems: 'center',
      justifyContent: 'flex-end',
    flex: 1,
    margin: 0,
    padding:0,
    width:'100%'
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    alignItems: "flex-start",
    width: '100%',
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight:'600'
  }
    });

export class Blocked extends PureComponent {
  constructor(props){
    super(props);

    this.state = {
      key: this.props.block.item.id || nanoid()
    }
  }

  render(){
    //console.log("blockhere!", this)
    const block = this.props.block;
    let index = block.index;
    let type = block.item.type;
    let blockData = block.item;
    let editMode = this.props.editMode ? true : false;

    let ren = null;
     if(type == 'paragraph'){
            ren = <EditorTools.paragraph.class 
                        isLast={(index+1) == this.props.initial.blocks.length ? true : false} 
                        removeBlockOnIndex={(index) => this.props.removeBlockOnIndex(index)} 
                        createParagraphOnIndex={(index) => this.props.createParagraphOnIndex(index)} 
                        index={block.index}
                        fontSize={this.props.fontSize}
                        isFocused={block.index == this.props.focus}
                        focusedIndex={this.props.focus} 
                        focusBlock={(index) => this.props.focusBlock(index)}
                        onChangeTextBlock={(text,index) => this.props.onChangeTextBlock(text,index)} 
                        item={blockData} 
                        readingTheme={this.props.readingTheme}
                        textAlign={this.props.textAlign}
                        editMode={editMode}/>
            }
            if(type == 'header'){
                    ren = <EditorTools.header.class 
                            index={block.index} 
                            item={blockData} 
                            fontSize={this.props.fontSize}
                            focusedIndex={this.props.focus} 
                            focusBlock={(index) => this.props.focusBlock(index)}
                            removeBlockOnIndex={(index) => this.props.removeBlockOnIndex(index)} 
                            createParagraphOnIndex={(index) => this.props.createParagraphOnIndex(index)}
                            onChangeTextBlockHeader={(text,indexList,indexBlock) => this.props.onChangeTextBlockHeader(text,indexList, indexBlock)} 
                            editMode={editMode}
                            readingTheme={this.props.readingTheme}
                            />
            }
            if(type == 'list'){
                   ren =  <EditorTools.list.class 
                            focusBlock={(index) => this.props.focusBlock(index)}
                            index={block.index} 
                            focusedIndex={this.props.focus}
                            fontSize={this.props.fontSize}
                            readingTheme={this.props.readingTheme}
                            removeListOnIndex={(indexList,indexBlock) => this.props.removeListOnIndex(indexList, indexBlock)}  
                            createListOnIndex={(indexList,indexBlock) => this.props.createListOnIndex(indexList, indexBlock)} 
                            onChangeTextBlockList={(text,indexList,indexBlock) => this.props.onChangeTextBlockList(text,indexList, indexBlock)} 
                            item={blockData}
                            createParagraphOnIndex={(index) => this.props.createParagraphOnIndex(index)}
                            editMode={editMode}
                            />
            }
            if(type == 'quote'){
                   ren =  <EditorTools.quote.class 
                            item={blockData} 
                            editMode={editMode}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.props.focusBlock(index)}
                            index={block.index} 
                            readingTheme={this.props.readingTheme}
                            focusedIndex={this.props.focus}
                            onChangeTextBlockInputs={(text,index,type) => this.props.onChangeTextBlockInputs(text,index,type)} 
                        />
            }
            if(type == 'warning'){
                   ren =  <EditorTools.warning.class 
                            item={blockData} 
                            editMode={editMode}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.props.focusBlock(index)}
                            index={block.index} 
                            readingTheme={this.props.readingTheme}
                            focusedIndex={this.props.focus} 
                            onChangeTextBlockInputs={(text,index,type) => this.props.onChangeTextBlockInputs(text,index,type)} 
                        />
            }
            if(type == 'delimiter'){
                   ren =  <EditorTools.delimiter.class 
                            item={blockData} 
                            editMode={editMode}
                            readingTheme={this.props.readingTheme}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.props.focusBlock(index)}
                            index={block.index} 
                            focusedIndex={this.props.focus} 
                        />
            }
            if(type == 'linkTool'){
                   ren =  <EditorTools.linkTool.class 
                            item={blockData} 
                            editMode={editMode}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.props.focusBlock(index)}
                            index={block.index} 
                            readingTheme={this.props.readingTheme}
                            focusedIndex={this.props.focus} 
                        />
            }
            if(type == 'image'){
                   ren =  <EditorTools.image.class 
                            item={blockData} 
                            editMode={editMode}
                            fontSize={this.props.fontSize}
                            focusBlock={(index) => this.props.focusBlock(index)}
                            index={block.index} 
                            readingTheme={this.props.readingTheme}
                            focusedIndex={this.props.focus} 
                            onChangeTextBlockInputs={(text,index,type) => this.props.onChangeTextBlockInputs(text,index,type)} 
                        />
            }
    return (
        <View 
            style={{backgroundColor: this.props.focus == index ? 'rgba(255,255,255,.05)' : 'transparent'}}
            key={this.state.key}
            >
            {this.props.editMode == true && this.props.focus == index && this.props._settingsBlock(type, index, blockData)}
            {ren}
            {this.props.editMode == true && this.props.focus == index && 
                    <View>
                      {this.props._renderAddBlocks(index)}
                    </View>
                  }
            {this.props.editMode == false && this.props.focus == index && 
                    <View>
                      {this.props.blockOptions(blockData, index)}
                    </View>
                  }
            { (this.props.editMode == true && (index+1) == this.props.initial.blocks.length && this.props.focus == null) && this.props._renderAddBlocks(index)}
        </View>
        )
    
  }
}