module.exports = {
  dependencies: {
    'react-native-vector-icons': {
	      platforms: {
	        android: null,
	        ios: null,
	      },
	    },
	  },
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ['./assets/fonts/'], // stays the same
  //commands: require('./path-to-commands.js'), // formerly "plugin", returns an array of commands
};const macSwitch = '--use-react-native-macos';

if (process.argv.includes(macSwitch)) {
  process.argv = process.argv.filter(arg => arg !== macSwitch);
  process.argv.push('--config=metro.config.macos.js');
  module.exports = {
    reactNativePath: 'node_modules/react-native-macos',
  };
}
