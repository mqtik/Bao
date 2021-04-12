import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';

import {
    TouchableOpacity,
    ImageBackground
} from 'react-native';

import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';
const Image = createImageProgress(FastImage);

const resolveAssetSource = Image.resolveAssetSource;

const ScalableImage = props => {
    const ImageComponent = props.background
        ? Image
        : Image;

    const [scalableWidth, setScalableWidth] = useState(null);
    const [scalableHeight, setScalableHeight] = useState(null);
    const [image, setImage] = useState(<ImageComponent />);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
    }, []);

    useEffect(() => {
        onProps(props);
    }, []);

    useEffect(() => {
        setImage(
            <ImageComponent
                {...props}
                indicator={Progress.Circle}
                imageStyle={props.imageStyle}
                resizeMode={'cover'}
                style={[props.style, {
                    width: scalableWidth,
                    height: scalableHeight
                }]}
            />
        );
    }, [props, scalableHeight, scalableWidth]);

    const onProps = localProps => {
        const { source } = localProps;
        if (source.uri) {
            const sourceToUse = source.uri
                ? source.uri
                : source;

            Image.getSize(
                sourceToUse,
                (width, height) => adjustSize(width, height, props),
                console.err
            );
        }
        else {
            const sourceToUse = resolveAssetSource(source);
            adjustSize(sourceToUse.width, sourceToUse.height, props);
        }
    };

    const adjustSize = (sourceWidth, sourceHeight, localProps) => {
        const { width, height } = localProps;

        let ratio = 1;

        if (width && height) {
            ratio = Math.min(width / sourceWidth, height / sourceHeight);
        }
        else if (width) {
            ratio = width / sourceWidth;
        }
        else if (height) {
            ratio = height / sourceHeight;
        }

        if (mounted.current) {
            const computedWidth = sourceWidth * ratio;
            const computedHeight = sourceHeight * ratio;

            setScalableWidth(computedWidth);
            setScalableHeight(computedHeight);

            props.onSize({ width: computedWidth, height: computedHeight });
        }
    };

    if (!props.onPress) {
        return image;
    }
    else {
        return (
            <TouchableOpacity onPress={props.onPress}>
                {image}
            </TouchableOpacity>
        );
    }
};

ScalableImage.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onPress: PropTypes.func,
    onSize: PropTypes.func,
    background: PropTypes.bool,
};

ScalableImage.defaultProps = {
    background: false,
    onSize: size => {}
};

export default ScalableImage;