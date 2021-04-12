import React from 'react';
import { Platform, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { getLang, Languages } from '../static/languages';
import { DrawerContent } from './renders';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView, VibrancyView } from "../../libraries/blur";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SignedOut from '../screens/signedOut';
import SignedIn from '../screens/signedIn';
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dynamic'
import HomeScreen from '../screens/routes/homeScreen';
import BookScreen from '../screens/routes/bookScreen';
import ReaderScreen from '../screens/routes/readerScreen';
import SearchScreen from '../screens/routes/searchScreen';

import AddressScreen from '../screens/routes/addressScreen';
import BusinessScreen from '../screens/routes/businessScreen';
import CourierScreen from '../screens/routes/courierScreen';
import MapScreen from '../screens/routes/mapScreen';

import ProfileScreen from '../screens/routes/profileScreen';
import GridScreen from '../screens/routes/gridScreen';
import CollectionsScreen from '../screens/routes/collectionsScreen';
import ChangeProperty from '../components/inProps';


import Navbar from '../components/navbar';
import HeaderFX from '../components/header';

const HomeStack = createStackNavigator();

const stackOptions = {
	headerTransparent: Platform.OS == 'ios' ? true : false,
	headerBackground: () => Platform.OS == 'ios' ? (
	     <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
	   ) : null,
}

export function HomeNavigator() {
  const isDarkMode = useDarkMode();
  const stackStyle = {
    cardStyle: {
      opacity: 1,
      backgroundColor: 'transparent'
    }
  };
  const headerStyle = {
    headerTintColor: isDarkMode == true ? '#ffffff' : '#000000',
    headerStyle: {
      backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'
    },
  }
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{

        }}
        screenOptions={{...stackOptions, ...stackStyle }}/>
      <HomeStack.Screen 
        name="Address" 
        component={AddressScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>

      <HomeStack.Screen 
        name="Details" 
        component={BookScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
      <HomeStack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
      <HomeStack.Screen 
        name="Grid" 
        component={GridScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
      <HomeStack.Screen 
        name="Collections" 
        component={CollectionsScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
    </HomeStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

export function SearchNavigator() {
  const isDarkMode = useDarkMode();
  const stackStyle = {
    cardStyle: {
      opacity: 1,
      backgroundColor: 'transparent'
    }
  };
  const headerStyle = {
    headerTintColor: isDarkMode == true ? '#ffffff' : '#000000',
    headerStyle: {
      backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'
    },
  }
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
      <SearchStack.Screen 
        name="Details" 
        component={BookScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
      <SearchStack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
    </SearchStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

export function ProfileNavigator() {
  const isDarkMode = useDarkMode();
  const stackStyle = {
    cardStyle: {
      opacity: 1,
      backgroundColor: 'transparent'
    }
  };
  const headerStyle = {
    headerTintColor: isDarkMode == true ? '#ffffff' : '#000000',
    headerStyle: {
      backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'
    },
  }
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
      <ProfileStack.Screen 
        name="Details" 
        component={BookScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
      
    </ProfileStack.Navigator>
  );
}


const BusinessStack = createStackNavigator();

export function BusinessNavigator() {
  const isDarkMode = useDarkMode();
  const stackStyle = {
    cardStyle: {
      opacity: 1,
      backgroundColor: 'transparent'
    }
  };
  const headerStyle = {
    headerTintColor: isDarkMode == true ? '#ffffff' : '#000000',
    headerStyle: {
      backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'
    },
  }
  return (
    <BusinessStack.Navigator>
      <BusinessStack.Screen 
        name="Business" 
        component={BusinessScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
    </BusinessStack.Navigator>
  );
}

const CourierStack = createStackNavigator();

export function CourierNavigator() {
  const isDarkMode = useDarkMode();
  const stackStyle = {
    cardStyle: {
      opacity: 1,
      backgroundColor: 'transparent'
    }
  };
  const headerStyle = {
    headerTintColor: isDarkMode == true ? '#ffffff' : '#000000',
    headerStyle: {
      backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'
    },
  }
  return (
    <CourierStack.Navigator>
      <CourierStack.Screen 
        name="Courier" 
        component={CourierScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
    </CourierStack.Navigator>
  );
}

const MapaStack = createStackNavigator();

export function MapaNavigator() {
  const isDarkMode = useDarkMode();
  const stackStyle = {
    cardStyle: {
      opacity: 1,
      backgroundColor: 'transparent'
    }
  };
  const headerStyle = {
    headerTintColor: isDarkMode == true ? '#ffffff' : '#000000',
    headerStyle: {
      backgroundColor: isDarkMode == true ? '#000000' : '#ffffff'
    },
  }
  return (
    <MapaStack.Navigator>
      <MapaStack.Screen 
        name="Map" 
        component={MapScreen} 
        options={headerStyle}
        screenOptions={{...stackOptions, ...stackStyle}}/>
    </MapaStack.Navigator>
  );
}

//const Tab = Platform.OS == 'android' ? createMaterialBottomTabNavigator() : createBottomTabNavigator();
const Drawer = createDrawerNavigator();
export function SignedInRoutes() {
  const isDarkMode = useDarkMode();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props}/>}
    	options={{

    	}}
      barStyle={{
        backgroundColor: isDarkMode == true ? '#111' : '#fff',
      }}

    	tabBarOptions= {{
	        activeTintColor: isDarkMode == true ? '#fff' : '#000',
	        inactiveTintColor: isDarkMode == true ? '#999' : '#999',
          style: {
            backgroundColor: isDarkMode == true ? '#000' : '#fff',
            borderTopWidth:0,
            borderColor: 'transparent'
          },
	        showLabel: true, //icons in label because maxsize of tabBarIcons is 25
	        showIcon: true,
	        indicatorStyle:{height: 3},
	    }}
    	>
        <Drawer.Screen name="Home" component={HomeNavigator} 
        	options={{
        		  tabBarLabel: Languages.bottomBarExplore[getLang()],
		          tabBarIcon: ({ color, size }) => (
		            <Icon name="compass-outline" color={color} size={size} />
		          ),
        	}}/>
        <Drawer.Screen name="Search" component={SearchNavigator} 
        	options={{
        		  tabBarLabel: Languages.bottomBarSearch[getLang()],
		          tabBarIcon: ({ color, size }) => (
		            <MaterialIcons name="search" color={color} size={size} />
		          ),
        	}}/>
        <Drawer.Screen 
          name="Business" 
          component={BusinessNavigator} 
          options={{
              tabBarLabel: Languages.bottomBarExplore[getLang()],
              tabBarIcon: ({ color, size }) => (
                <Icon name="compass-outline" color={color} size={size} />
              ),
          }}/>
        <Drawer.Screen name="Couriers" component={CourierNavigator} 
          options={{
              tabBarLabel: Languages.bottomBarExplore[getLang()],
              tabBarIcon: ({ color, size }) => (
                <Icon name="compass-outline" color={color} size={size} />
              ),
          }}/>
          <Drawer.Screen name="Mapa" component={MapaNavigator} 
          options={{
              tabBarLabel: Languages.bottomBarExplore[getLang()],
              tabBarIcon: ({ color, size }) => (
                <Icon name="compass-outline" color={color} size={size} />
              ),
          }}/>
        <Drawer.Screen name="Profile" component={ProfileNavigator} 
        	options={{
        		  tabBarLabel: Languages.bottomBarProfile[getLang()],
		          tabBarIcon: ({ color, size }) => (
		            <Icon name="account-circle" color={color} size={size} />
		          ),
        	}}/>
    </Drawer.Navigator>
  );
}

const AppStack = createStackNavigator();

export function AppRoutes({ isLoggedIn }) {
  const isDarkMode = useDarkMode();
  const NewtTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2575ed',
      backgroundColor: '#000'
    },
  };

  return (
  <NavigationContainer theme={NewtTheme}>
    <AppStack.Navigator>
    	{
    		isLoggedIn == false && <AppStack.Screen options={{headerShown: false}} name="SignedOut" component={SignedOut} />
    	}
    	{
    		isLoggedIn == true && <AppStack.Screen options={{headerShown: false}} name="SignedIn" component={SignedIn} />
    	}
    </AppStack.Navigator>
   </NavigationContainer>
  );
}

