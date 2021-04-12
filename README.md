<div align="center">

<img src="https://camo.githubusercontent.com/74979e9c2c7d3124c96b5b327a5cc490f4ce3d31/68747470733a2f2f7472617669732d63692e636f6d2f656c656374726f6e2d72656163742d626f696c6572706c6174652f656c656374726f6e2d72656163742d626f696c6572706c6174652e7376673f6272616e63683d6d6173746572" alt="Build Status" data-canonical-src="https://travis-ci.com/electron-react-boilerplate/electron-react-boilerplate.svg?branch=master" style="max-width:100%;">
<img src="https://camo.githubusercontent.com/3c4a8b5c0dc4ccd8c2c0ae14b4d2697f7db4a7a6/68747470733a2f2f63692e6170707665796f722e636f6d2f6170692f70726f6a656374732f7374617475732f346d393732733665346e6635326878362f6272616e63682f6d61737465723f7376673d74727565" alt="Appveyor Build Status" data-canonical-src="https://ci.appveyor.com/api/projects/status/4m972s6e4nf52hx6/branch/master?svg=true" style="max-width:100%;">
<a href="https://david-dm.org/electron-react-boilerplate/electron-react-boilerplate" rel="nofollow"><img src="https://camo.githubusercontent.com/0eb78044f607b2d3e8c9ad28681b251e2b321bdf/68747470733a2f2f696d672e736869656c64732e696f2f64617669642f656c656374726f6e2d72656163742d626f696c6572706c6174652f656c656374726f6e2d72656163742d626f696c6572706c6174652e737667" alt="Dependency Status" data-canonical-src="https://img.shields.io/david/electron-react-boilerplate/electron-react-boilerplate.svg" style="max-width:100%;"></a>
<a href="https://david-dm.org/electron-react-boilerplate/electron-react-boilerplate?type=dev" rel="nofollow"><img src="https://camo.githubusercontent.com/f2f051c3ff41cf9662c84075d79fc14956e0099e/68747470733a2f2f696d672e736869656c64732e696f2f64617669642f6465762f656c656374726f6e2d72656163742d626f696c6572706c6174652f656c656374726f6e2d72656163742d626f696c6572706c6174652e7376673f6c6162656c3d646576446570656e64656e63696573" alt="DevDependency Status" data-canonical-src="https://img.shields.io/david/dev/electron-react-boilerplate/electron-react-boilerplate.svg?label=devDependencies" style="max-width:100%;"></a>
<a href="https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest"><img src="https://camo.githubusercontent.com/335de1d18d0f061ec289a54993c26ad67dfbd550/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f7461672f656c656374726f6e2d72656163742d626f696c6572706c6174652f656c656374726f6e2d72656163742d626f696c6572706c6174652e7376673f6c6162656c3d76657273696f6e" alt="Github Tag" data-canonical-src="https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version" style="max-width:100%;"></a>

</div>

# Bao for Phones



# Run

(if JAVA 13 is set, switch to 8) ->
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
source ~/.bash_profile 



# Release on Android

./gradlew assembleRelease

On node_modules/react-native/react.grandle
Place this code where doFirst{} method is
		`
		doLast {
            def moveFunc = { resSuffix ->
                File originalDir = file("$buildDir/generated/res/react/release/drawable-${resSuffix}");
                if (originalDir.exists()) {
                    File destDir = file("$buildDir/../src/main/res/drawable-${resSuffix}");
                    ant.move(file: originalDir, tofile: destDir);
                }
            }
            moveFunc.curry("ldpi").call()
            moveFunc.curry("mdpi").call()
            moveFunc.curry("hdpi").call()
            moveFunc.curry("xhdpi").call()
            moveFunc.curry("xxhdpi").call()
            moveFunc.curry("xxxhdpi").call()
        }
        `



## Errors
  - Unsupported class file major version 57
    This is because of Java 13.
    If you also have Java 8, switch it like so:
    `
    export JAVA_HOME=$(/usr/libexec/java_home -v 1.8) && source ~/.bash_profile
    `

	- No bundle URL present.
		Run: 
			 rm -rf ios/build/; lsof -ti :8081 | xargs kill -9; react-native run-ios --simulator="iPhone 6"

	- React Native Settings
		Go to react-native-settings under node_modules folder, and change its .JSX extensions to .JS

    - Duplicate resources:
    Place the doLast code.

    - If error with linking BVLinearGradient on Pods, put this before pod 'BVLinearGradient'
    pod "yoga", :path => "../node_modules/react-native/ReactCommon/yoga"
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'Core',
  'DevSupport',
  'RCTNetwork',
  'RCTWebSocket'
]
 then:
 cd ios && rm -rf Pods/ && pod install


# Splashscreen & icon
I recommend [generator-rn-toolbox](https://github.com/bamlab/generator-rn-toolbox) for applying launch screen or main icon using on react-native. It is more simple and easy to use through cli as react-native.

 - Do not need to open XCode.
 - Do not need to make a lot of image files for various resolutions.
 - Anytime change launch screen using one line commend. 


## Requirements

 - node >= 6
 - One **square** image or psd file with a size of more than **2208x2208** px resolution for a launch screen(splash screen)
 - Positive mind ;)

## Install
 1. Install generator-rn-toolbox and yo
 2. `npm install -g yo `
 3. Install imagemagick
`brew install imagemagick`
 4. Apply splash screen on iOS

 ```yo rn-toolbox:assets --splash YOURIMAGE.png --ios```

 or Android

 ```yo rn-toolbox:assets --splash YOURIMAGE.png --android```


That's all. :) 


## Run on iOS
- react-native run-ios --configuration Release --device "Matías’s iPhone"

Go to XCode -> Products -> Scheme -> Edit Scheme 
On Build Configuration, change Debug to Release

ART Shape not found (React-native-progress):
Add the ART.xcodeproj (found in node_modules/react-native/Libraries/ART) to the Libraries group and add libART.a to Link Binary With Libraries under Build Phases.
## Android

export ANDROID_HOME=/Users/mfort/Library/Android/sdk && export PATH=$ANDROID_HOME/platform-tools:$PATH && export PATH=$ANDROID_HOME/tools:$PATH && source ~/.bash_profile && echo $ANDROID_HOME

export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)

1. DEX Error on Compile 
	Go to *android/build.gradle*
	
	On *defaultConfig* {} (where is the targetSdk, compileSdk, etc.),
	 place this line:
	 `multiDexEnabled = true`

2. Deploy to phone
	adb install -r ./android/app/build/outputs/apk/release/app-release.apk

[Source][1]


  [1]: https://github.com/bamlab/generator-rn-toolbox/blob/master/generators/assets/README.md


## Google Maps

The pod, must be like this: 
```
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'Fenix' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # Pods for Fenix
     pod "yoga", :path => "../node_modules/react-native/ReactCommon/yoga"
    pod 'React', :path => '../node_modules/react-native', :subspecs => [
      'Core',
      'DevSupport',
      'RCTNetwork',
      'RCTImage',
      'RCTWebSocket',
      'RCTGeolocation',
      'RCTLinkingIOS',
      'RCTNetwork',
      'RCTSettings',
      'RCTText',
      'RCTVibration',
      'RCTActionSheet'
    ]
    pod 'react-native-blur', :path => '../node_modules/@react-native-community/blur'

    pod 'RNGestureHandler', :path => '../node_modules/react-native-gesture-handler'

    pod 'BVLinearGradient', :path => '../node_modules/react-native-linear-gradient'

    pod 'react-native-maps', :path => '../node_modules/react-native-maps'

    pod 'react-native-google-maps', :path => '../node_modules/react-native-maps'  # Uncomment this line if you want to support GoogleMaps on iOS
    pod 'GoogleMaps'  # Uncomment this line if you want to support GoogleMaps on iOS
    pod 'Google-Maps-iOS-Utils' # Uncomment this line if you want to support GoogleMaps on iOS
    pod 'RNSnackbar', :path => '../node_modules/react-native-snackbar'

    pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'

    pod 'react-native-wkwebview', :path => '../node_modules/react-native-wkwebview-reborn'

    pod 'rn-fetch-blob', :path => '../node_modules/rn-fetch-blob'


  target 'FenixTests' do
    inherit! :search_paths
    # Pods for testing
  end

end

target 'Fenix-tvOS' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # Pods for Fenix-tvOS

  target 'Fenix-tvOSTests' do
    inherit! :search_paths
    # Pods for testing
  end

end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == 'react-native-google-maps'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_ENABLE_MODULES'] = 'No'
      end
    end
    if target.name == "React"
      target.remove_from_project
    end
  end
end
```

And in the AppDelegator, let's define API Key
```
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <GoogleMaps/GoogleMaps.h> # <-- there!!!!! #####

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  #ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif


    [GMSServices provideAPIKey:@"YOUR GOOGLE MAPS API KEY"];
    ^ and here!


  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Fenix"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
```

# Updated iOS?
Go to:
`/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport`
and copy one of the folders, example 12.0.1, and rename like: 12.2.1 ({id}) and paste it again.
The {id} is whatever is under () in other folder examples.

## Buffer not defined / not found
Place this line:
global.Buffer = global.Buffer || require('buffer').Buffer
in pouchdb node_modules
