import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../styles/index.style';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = 200;
const slideHeightLarge = 220;
const slideWidth = 250;
const itemHorizontalMargin = wp(0.4);
const itemHorizontalMarginSearch = wp(0.1);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin - 100;
export const itemWidthDoc = slideWidth + itemHorizontalMargin - 50;

const entryBorderRadius = 15;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 0 // needed for shadow
    },
    slideInnerContainerSearch: {

        paddingBottom: 0 // needed for shadow
    },
    largeSlideInnerContainer: {
        width: itemWidth + 175,
        height: slideHeightLarge,

        backgroundColor: 'rgba(255,255,255,.2)',
        borderRadius: 12,
        marginLeft: 2,
        marginRight: 1,
        paddingBottom: 0 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : 0, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: entryBorderRadius,
        resizeMode: "stretch"
    },
    imageContainerLarge: {
        flex: 1,
        height: 200,

        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        borderRadius: entryBorderRadius,
    },
    imageContainerEven: {
        backgroundColor: colors.black,
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: entryBorderRadius,
        resizeMode: "stretch"
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',

        borderRadius: 15,
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    radiusMaskEven: {
        backgroundColor: colors.white
    },
    textContainer: {
        justifyContent: 'center',
        //paddingTop: 20 - entryBorderRadius,
        //paddingBottom: 20,
        //paddingHorizontal: 16,
        backgroundColor: 'transparent',
        color: 'white',
        position: 'absolute',
        padding: 10,
        borderRadius: entryBorderRadius,
          bottom:0
    },
    textContainerEven: {
        backgroundColor: colors.white
    },
    title: {
        color: colors.white,
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        //color: 'rgba(255, 255, 255, 0.7)'
    },
    contentContainer: {
        borderRadius: entryBorderRadius,
        flex: 1,
        justifyContent: 'flex-end',
      },
});
